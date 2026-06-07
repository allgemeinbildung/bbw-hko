import { createAdminClient } from './supabase'

export const FEEDBACK_BUCKET = 'feedback-uploads'
const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED_EXT = [
  'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'md',
  'ppt', 'pptx', 'xls', 'xlsx', 'csv',
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'zip',
]

export interface FileMeta {
  name: string
  path: string
  size: number
  type: string
  uploaded_at: string
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function extOf(name: string): string {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

function sanitize(name: string): string {
  const ext = extOf(name)
  const base = (ext ? name.slice(0, name.length - ext.length - 1) : name)
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'datei'
  return ext ? `${base}.${ext}` : base
}

/** Options for authorising a feedback upload request. */
export interface AuthorizeOpts {
  table: 'feedbacks' | 'einheit_feedbacks' | 'material_feedbacks'
  idColumn: 'id'
  jsonbColumn: 'idee_dateien'
  /** `needOwner=true` → LP ownership + status in entwurf/eingereicht required. */
  needOwner: boolean
}

/** Result type returned by authoriseFeedback. */
type AuthResult =
  | { ok: true; row: any; role: string }
  | { ok: false; res: Response }

export async function authoriseFeedback(
  locals: App.Locals,
  rowId: string,
  opts: AuthorizeOpts,
): Promise<AuthResult> {
  if (!locals.user) return { ok: false, res: json({ error: 'Nicht angemeldet.' }, 401) }

  const { data: profile } = await locals.supabase
    .from('profiles').select('role').eq('id', locals.user.id).single()
  const role = profile?.role ?? 'lp'

  const { data: row } = await locals.supabase
    .from(opts.table)
    .select('id, lp_id, status, idee_dateien')
    .eq('id', rowId)
    .single()

  if (!row) return { ok: false, res: json({ error: 'Eintrag nicht gefunden.' }, 404) }

  const isOwner = row.lp_id === locals.user.id
  if (opts.needOwner) {
    if (!isOwner) return { ok: false, res: json({ error: 'Keine Berechtigung.' }, 403) }
    if (!['entwurf', 'eingereicht'].includes(row.status))
      return { ok: false, res: json({ error: 'Feedback kann nicht mehr bearbeitet werden.' }, 403) }
  } else if (!isOwner && role !== 'kt1' && role !== 'reviewer') {
    return { ok: false, res: json({ error: 'Keine Berechtigung.' }, 403) }
  }
  return { ok: true, row, role }
}

/** POST handler: upload files to feedback-uploads bucket. */
export async function handleUpload(
  locals: App.Locals,
  request: Request,
  rowId: string,
  table: AuthorizeOpts['table'],
  ownerId: string,
): Promise<Response> {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'Ungültige Anfrage (kein multipart/form-data).' }, 400)
  }
  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length === 0) return json({ error: 'Keine Dateien übermittelt.' }, 400)

  const auth = await authoriseFeedback(locals, rowId, { table, idColumn: 'id', jsonbColumn: 'idee_dateien', needOwner: true })
  if (!auth.ok) return auth.res

  const admin = createAdminClient()
  const existing: FileMeta[] = Array.isArray(auth.row.idee_dateien) ? auth.row.idee_dateien : []
  const added: FileMeta[] = []
  const now = new Date().toISOString()

  for (const file of files) {
    if (file.size > MAX_BYTES) return json({ error: `«${file.name}» ist grösser als 15 MB.` }, 400)
    if (!ALLOWED_EXT.includes(extOf(file.name))) return json({ error: `Dateityp «.${extOf(file.name)}» ist nicht erlaubt.` }, 400)

    const safe = sanitize(file.name)
    const path = `${ownerId}/${rowId}/${crypto.randomUUID()}_${safe}`
    const buffer = new Uint8Array(await file.arrayBuffer())

    const { error: upErr } = await admin.storage
      .from(FEEDBACK_BUCKET)
      .upload(path, buffer, { contentType: file.type || 'application/octet-stream', upsert: false })
    if (upErr) return json({ error: `Upload fehlgeschlagen: ${upErr.message}` }, 400)

    added.push({ name: file.name.slice(0, 200), path, size: file.size, type: file.type || '', uploaded_at: now })
  }

  const merged = [...existing, ...added]
  const { error: dbErr } = await admin.from(table).update({ idee_dateien: merged }).eq('id', rowId)
  if (dbErr) {
    await admin.storage.from(FEEDBACK_BUCKET).remove(added.map((a) => a.path))
    return json({ error: `Speichern fehlgeschlagen: ${dbErr.message}` }, 400)
  }
  return json({ data: merged }, 201)
}

/** DELETE handler: remove one file from a feedback row. */
export async function handleDelete(
  locals: App.Locals,
  request: Request,
  url: URL,
  rowId: string,
  table: AuthorizeOpts['table'],
): Promise<Response> {
  const auth = await authoriseFeedback(locals, rowId, { table, idColumn: 'id', jsonbColumn: 'idee_dateien', needOwner: true })
  if (!auth.ok) return auth.res

  let path = url.searchParams.get('path') ?? ''
  if (!path) {
    try { path = String((await request.json())?.path ?? '') } catch { /* noop */ }
  }
  if (!path) return json({ error: 'Pfad fehlt.' }, 400)

  const existing: FileMeta[] = Array.isArray(auth.row.idee_dateien) ? auth.row.idee_dateien : []
  if (!existing.some((f) => f.path === path)) return json({ error: 'Datei gehört nicht zu diesem Eintrag.' }, 403)

  const admin = createAdminClient()
  await admin.storage.from(FEEDBACK_BUCKET).remove([path])
  const remaining = existing.filter((f) => f.path !== path)
  const { error } = await admin.from(table).update({ idee_dateien: remaining }).eq('id', rowId)
  if (error) return json({ error: error.message }, 400)
  return json({ data: remaining })
}

/** GET handler: return a signed URL for one file. */
export async function handleGet(
  locals: App.Locals,
  url: URL,
  rowId: string,
  table: AuthorizeOpts['table'],
): Promise<Response> {
  const auth = await authoriseFeedback(locals, rowId, { table, idColumn: 'id', jsonbColumn: 'idee_dateien', needOwner: false })
  if (!auth.ok) return auth.res

  const path = url.searchParams.get('path') ?? ''
  const existing: FileMeta[] = Array.isArray(auth.row.idee_dateien) ? auth.row.idee_dateien : []
  if (!path || !existing.some((f) => f.path === path))
    return json({ error: 'Datei gehört nicht zu diesem Eintrag.' }, 403)

  const admin = createAdminClient()
  const { data, error } = await admin.storage.from(FEEDBACK_BUCKET).createSignedUrl(path, 60)
  if (error || !data?.signedUrl) return json({ error: error?.message ?? 'Download fehlgeschlagen.' }, 400)
  return new Response(null, { status: 302, headers: { Location: data.signedUrl } })
}
