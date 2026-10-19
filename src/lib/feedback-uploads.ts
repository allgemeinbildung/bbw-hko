import { createAdminClient } from './supabase'

export const FEEDBACK_BUCKET = 'feedback-uploads'
const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED_EXT = [
  'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'md',
  'html', 'htm',
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

/** POST handler: JSON → signierte Upload-URLs (Direkt-Upload), multipart → klassischer Upload.
 *
 * Vercel-Serverless nimmt höchstens 4.5 MB Request-Body an. Alles darüber weist
 * Vercel ab, bevor dieser Code läuft — der Browser bekam nur ein nacktes
 * «Upload fehlgeschlagen.» (Meldung Martina Ruoss, ZIP zu 1.2). Darum lädt der
 * Client die Bytes direkt zu Supabase Storage (public/js/hko-upload.js):
 *   1) POST JSON {files:[{name,size}]}  → hier: signierte Upload-URLs
 *   2) PUT der Bytes an die signierte URL (an Vercel vorbei)
 *   3) PUT JSON {files:[{name,path}]}   → handleRegister: prüfen + eintragen
 * Gleiches Muster wie api/materials/[id]/files.ts. Multipart bleibt als Fallback.
 */
export async function handleUpload(
  locals: App.Locals,
  request: Request,
  rowId: string,
  table: AuthorizeOpts['table'],
  ownerId: string,
): Promise<Response> {
  if ((request.headers.get('content-type') ?? '').includes('application/json')) {
    return handleSign(locals, request, rowId, table, ownerId)
  }
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

/** Schritt 1 des Direkt-Uploads: signierte Upload-URLs ausstellen. */
async function handleSign(
  locals: App.Locals,
  request: Request,
  rowId: string,
  table: AuthorizeOpts['table'],
  ownerId: string,
): Promise<Response> {
  let payload: { files?: Array<{ name?: string; size?: number }> }
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Ungültiges JSON.' }, 400)
  }
  const wanted = Array.isArray(payload.files) ? payload.files : []
  if (wanted.length === 0) return json({ error: 'Keine Dateien angefragt.' }, 400)
  if (wanted.length > 20) return json({ error: 'Höchstens 20 Dateien auf einmal.' }, 400)

  const auth = await authoriseFeedback(locals, rowId, { table, idColumn: 'id', jsonbColumn: 'idee_dateien', needOwner: true })
  if (!auth.ok) return auth.res

  const admin = createAdminClient()
  const slots: Array<{ name: string; path: string; signedUrl: string }> = []
  for (const f of wanted) {
    const name = String(f?.name ?? '')
    const size = Number(f?.size ?? 0)
    if (!name) return json({ error: 'Dateiname fehlt.' }, 400)
    if (size > MAX_BYTES) return json({ error: `«${name}» ist grösser als 15 MB.` }, 400)
    if (!ALLOWED_EXT.includes(extOf(name))) return json({ error: `Dateityp «.${extOf(name)}» ist nicht erlaubt.` }, 400)

    const path = `${ownerId}/${rowId}/${crypto.randomUUID()}_${sanitize(name)}`
    const { data, error } = await admin.storage.from(FEEDBACK_BUCKET).createSignedUploadUrl(path)
    if (error || !data?.signedUrl)
      return json({ error: `Upload-Vorbereitung fehlgeschlagen: ${error?.message ?? 'unbekannt'}` }, 400)
    slots.push({ name, path, signedUrl: data.signedUrl })
  }
  return json({ data: slots })
}

/** Schritt 3 des Direkt-Uploads (PUT): hochgeladene Dateien prüfen und eintragen.
 *  Grösse und Typ kommen aus dem Storage, nicht aus der Behauptung des Clients. */
export async function handleRegister(
  locals: App.Locals,
  request: Request,
  rowId: string,
  table: AuthorizeOpts['table'],
  ownerId: string,
): Promise<Response> {
  let payload: { files?: Array<{ name?: string; path?: string; type?: string }> }
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Ungültiges JSON.' }, 400)
  }
  const incoming = Array.isArray(payload.files) ? payload.files : []
  if (incoming.length === 0) return json({ error: 'Keine Dateien übermittelt.' }, 400)

  const auth = await authoriseFeedback(locals, rowId, { table, idColumn: 'id', jsonbColumn: 'idee_dateien', needOwner: true })
  if (!auth.ok) return auth.res

  const admin = createAdminClient()
  const dir = `${ownerId}/${rowId}`
  const now = new Date().toISOString()
  const added: FileMeta[] = []

  for (const f of incoming) {
    const path = String(f?.path ?? '')
    const name = String(f?.name ?? '').slice(0, 200)
    if (!path.startsWith(dir + '/') || path.includes('..')) return json({ error: 'Ungültiger Datei-Pfad.' }, 400)

    const objectName = path.slice(dir.length + 1)
    const { data: listed, error: listErr } = await admin.storage
      .from(FEEDBACK_BUCKET)
      .list(dir, { limit: 100, search: objectName })
    if (listErr) return json({ error: `Prüfung fehlgeschlagen: ${listErr.message}` }, 400)
    const obj = (listed ?? []).find((o) => o.name === objectName)
    if (!obj) return json({ error: `Hochgeladene Datei nicht gefunden: «${name}».` }, 400)

    const size = Number((obj as any)?.metadata?.size ?? 0)
    if (size > MAX_BYTES) {
      await admin.storage.from(FEEDBACK_BUCKET).remove([path])
      return json({ error: `«${name}» ist grösser als 15 MB.` }, 400)
    }
    const type = String((obj as any)?.metadata?.mimetype ?? f?.type ?? '')
    added.push({ name, path, size, type, uploaded_at: now })
  }

  const existing: FileMeta[] = Array.isArray(auth.row.idee_dateien) ? auth.row.idee_dateien : []
  const known = new Set(existing.map((e) => e.path))
  const fresh = added.filter((a) => !known.has(a.path))
  const merged = [...existing, ...fresh]
  const { error: dbErr } = await admin.from(table).update({ idee_dateien: merged }).eq('id', rowId)
  if (dbErr) {
    await admin.storage.from(FEEDBACK_BUCKET).remove(fresh.map((a) => a.path))
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
