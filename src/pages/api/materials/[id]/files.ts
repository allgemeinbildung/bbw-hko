import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../../lib/supabase'

const BUCKET = 'zusatzmaterialien'
const MAX_BYTES = 15 * 1024 * 1024 // 15 MB pro Datei
const ALLOWED_EXT = [
  'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'md',
  'ppt', 'pptx', 'xls', 'xlsx', 'csv',
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'zip',
]

interface FileMeta {
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

/** Loads the material and authorises the caller. `needOwner` forces LP-ownership + editable status. */
async function authorize(
  locals: App.Locals,
  id: string,
  opts: { needOwner: boolean },
): Promise<{ ok: true; material: any; role: string } | { ok: false; res: Response }> {
  if (!locals.user) return { ok: false, res: json({ error: 'Nicht angemeldet.' }, 401) }

  const { data: profile } = await locals.supabase
    .from('profiles').select('role').eq('id', locals.user.id).single()
  const role = profile?.role ?? 'lp'

  const { data: material } = await locals.supabase
    .from('materials')
    .select('id, submitted_by, status, zusatzmaterialien')
    .eq('id', id)
    .single()

  if (!material) return { ok: false, res: json({ error: 'Material nicht gefunden.' }, 404) }

  const isOwner = material.submitted_by === locals.user.id
  if (opts.needOwner) {
    if (!isOwner) return { ok: false, res: json({ error: 'Keine Berechtigung.' }, 403) }
    if (material.status !== 'eingereicht')
      return { ok: false, res: json({ error: 'Material kann nicht mehr bearbeitet werden.' }, 403) }
  } else if (!isOwner && role !== 'kt1' && role !== 'reviewer') {
    return { ok: false, res: json({ error: 'Keine Berechtigung.' }, 403) }
  }
  return { ok: true, material, role }
}

// ── POST: Upload vorbereiten (JSON {op:'sign'}) ODER Direkt-Upload (multipart) ──
//
// Vercel-Serverless begrenzt den Request-Body auf 4.5 MB. Mehrere/grosse Dateien
// sprengen dieses Limit im multipart-Pfad. Deshalb lädt der Client neu DIREKT zu
// Supabase Storage hoch: er holt hier signierte Upload-URLs (op:'sign'), lädt die
// Bytes an Vercel vorbei zu Supabase und meldet die fertigen Dateien via PUT zurück.
// Der alte multipart-POST bleibt als Fallback für kleine Uploads erhalten.
export const POST: APIRoute = async ({ locals, request, params }) => {
  const id = params.id
  if (!id) return json({ error: 'ID fehlt.' }, 400)

  const auth = await authorize(locals, id, { needOwner: true })
  if (!auth.ok) return auth.res

  const contentType = request.headers.get('content-type') ?? ''

  // ── Variante A: signierte Upload-URLs ausstellen ──────────────────────────
  if (contentType.includes('application/json')) {
    let payload: { op?: string; files?: Array<{ name?: string; size?: number; type?: string }> }
    try {
      payload = await request.json()
    } catch {
      return json({ error: 'Ungültiges JSON.' }, 400)
    }
    const wanted = Array.isArray(payload.files) ? payload.files : []
    if (wanted.length === 0) return json({ error: 'Keine Dateien angefragt.' }, 400)

    const admin = createAdminClient()
    const slots: Array<{ name: string; path: string; signedUrl: string }> = []
    for (const f of wanted) {
      const name = String(f?.name ?? '')
      const size = Number(f?.size ?? 0)
      if (!name) return json({ error: 'Dateiname fehlt.' }, 400)
      if (size > MAX_BYTES) return json({ error: `«${name}» ist grösser als 15 MB.` }, 400)
      if (!ALLOWED_EXT.includes(extOf(name)))
        return json({ error: `Dateityp «.${extOf(name)}» ist nicht erlaubt.` }, 400)

      const safe = sanitize(name)
      const path = `${auth.material.submitted_by}/${id}/${crypto.randomUUID()}_${safe}`
      const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path)
      if (error || !data?.signedUrl)
        return json({ error: `Upload-Vorbereitung fehlgeschlagen: ${error?.message ?? 'unbekannt'}` }, 400)
      slots.push({ name, path, signedUrl: data.signedUrl })
    }
    return json({ data: slots })
  }

  // ── Variante B: klassischer multipart-Upload (Fallback) ───────────────────
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'Ungültige Anfrage (kein multipart/form-data).' }, 400)
  }
  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length === 0) return json({ error: 'Keine Dateien übermittelt.' }, 400)

  const admin = createAdminClient()
  const existing: FileMeta[] = Array.isArray(auth.material.zusatzmaterialien)
    ? auth.material.zusatzmaterialien
    : []
  const added: FileMeta[] = []
  const now = new Date().toISOString()

  for (const file of files) {
    if (file.size > MAX_BYTES)
      return json({ error: `«${file.name}» ist grösser als 15 MB.` }, 400)
    if (!ALLOWED_EXT.includes(extOf(file.name)))
      return json({ error: `Dateityp «.${extOf(file.name)}» ist nicht erlaubt.` }, 400)

    const safe = sanitize(file.name)
    const path = `${auth.material.submitted_by}/${id}/${crypto.randomUUID()}_${safe}`
    const buffer = new Uint8Array(await file.arrayBuffer())

    const { error: upErr } = await admin.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })
    if (upErr) return json({ error: `Upload fehlgeschlagen: ${upErr.message}` }, 400)

    added.push({ name: file.name.slice(0, 200), path, size: file.size, type: file.type || '', uploaded_at: now })
  }

  const merged = [...existing, ...added]
  const { error: dbErr } = await admin
    .from('materials')
    .update({ zusatzmaterialien: merged })
    .eq('id', id)
  if (dbErr) {
    // Best effort: hochgeladene Objekte wieder entfernen, damit keine Waisen bleiben.
    await admin.storage.from(BUCKET).remove(added.map(a => a.path))
    return json({ error: `Speichern fehlgeschlagen: ${dbErr.message}` }, 400)
  }

  return json({ data: merged }, 201)
}

// ── PUT: direkt zu Storage hochgeladene Dateien registrieren (JSON) ────────────
// Body: { files: [{ name, path, type }] }. Der Server prüft, dass jeder Pfad zum
// Material gehört und das Objekt wirklich existiert, und übernimmt die vom Storage
// gemeldete Grösse (nicht die vom Client behauptete).
export const PUT: APIRoute = async ({ locals, request, params }) => {
  const id = params.id
  if (!id) return json({ error: 'ID fehlt.' }, 400)

  const auth = await authorize(locals, id, { needOwner: true })
  if (!auth.ok) return auth.res

  let payload: { files?: Array<{ name?: string; path?: string; type?: string }> }
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Ungültiges JSON.' }, 400)
  }
  const incoming = Array.isArray(payload.files) ? payload.files : []
  if (incoming.length === 0) return json({ error: 'Keine Dateien übermittelt.' }, 400)

  const admin = createAdminClient()
  const prefix = `${auth.material.submitted_by}/${id}/`
  const now = new Date().toISOString()
  const added: FileMeta[] = []

  for (const f of incoming) {
    const path = String(f?.path ?? '')
    const name = String(f?.name ?? '').slice(0, 200)
    // Pfad muss zu genau diesem Material des Eigentümers gehören.
    if (!path.startsWith(prefix) || path.includes('..'))
      return json({ error: 'Ungültiger Datei-Pfad.' }, 400)

    // Objekt-Existenz + tatsächliche Grösse aus dem Storage verifizieren.
    const objectName = path.slice(prefix.length)
    const { data: listed, error: listErr } = await admin.storage
      .from(BUCKET)
      .list(prefix.replace(/\/$/, ''), { limit: 100, search: objectName })
    if (listErr) return json({ error: `Prüfung fehlgeschlagen: ${listErr.message}` }, 400)
    const obj = (listed ?? []).find((o) => o.name === objectName)
    if (!obj) return json({ error: `Hochgeladene Datei nicht gefunden: «${name}».` }, 400)

    const size = Number((obj as any)?.metadata?.size ?? 0)
    if (size > MAX_BYTES) {
      await admin.storage.from(BUCKET).remove([path])
      return json({ error: `«${name}» ist grösser als 15 MB.` }, 400)
    }
    const type = String((obj as any)?.metadata?.mimetype ?? f?.type ?? '')
    added.push({ name, path, size, type, uploaded_at: now })
  }

  const existing: FileMeta[] = Array.isArray(auth.material.zusatzmaterialien)
    ? auth.material.zusatzmaterialien
    : []
  // Doppelregistrierung desselben Pfads vermeiden.
  const existingPaths = new Set(existing.map((e) => e.path))
  const fresh = added.filter((a) => !existingPaths.has(a.path))
  const merged = [...existing, ...fresh]

  const { error: dbErr } = await admin
    .from('materials')
    .update({ zusatzmaterialien: merged })
    .eq('id', id)
  if (dbErr) {
    await admin.storage.from(BUCKET).remove(fresh.map((a) => a.path))
    return json({ error: `Speichern fehlgeschlagen: ${dbErr.message}` }, 400)
  }

  return json({ data: merged }, 201)
}

// ── DELETE: eine Datei entfernen (?path=… oder JSON { path }) ──────────────────
export const DELETE: APIRoute = async ({ locals, request, params, url }) => {
  const id = params.id
  if (!id) return json({ error: 'ID fehlt.' }, 400)

  const auth = await authorize(locals, id, { needOwner: true })
  if (!auth.ok) return auth.res

  let path = url.searchParams.get('path') ?? ''
  if (!path) {
    try { path = String((await request.json())?.path ?? '') } catch { /* noop */ }
  }
  if (!path) return json({ error: 'Pfad fehlt.' }, 400)

  const existing: FileMeta[] = Array.isArray(auth.material.zusatzmaterialien)
    ? auth.material.zusatzmaterialien
    : []
  if (!existing.some(f => f.path === path))
    return json({ error: 'Datei gehört nicht zu diesem Material.' }, 403)

  const admin = createAdminClient()
  await admin.storage.from(BUCKET).remove([path])
  const remaining = existing.filter(f => f.path !== path)
  const { error } = await admin.from('materials').update({ zusatzmaterialien: remaining }).eq('id', id)
  if (error) return json({ error: error.message }, 400)

  return json({ data: remaining })
}

// ── GET ?path=… : Signed-URL-Download (Eigentümer oder KT1) ────────────────────
export const GET: APIRoute = async ({ locals, params, url }) => {
  const id = params.id
  if (!id) return json({ error: 'ID fehlt.' }, 400)

  const auth = await authorize(locals, id, { needOwner: false })
  if (!auth.ok) return auth.res

  const path = url.searchParams.get('path') ?? ''
  const existing: FileMeta[] = Array.isArray(auth.material.zusatzmaterialien)
    ? auth.material.zusatzmaterialien
    : []
  if (!path || !existing.some(f => f.path === path))
    return json({ error: 'Datei gehört nicht zu diesem Material.' }, 403)

  const admin = createAdminClient()
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(path, 60)
  if (error || !data?.signedUrl) return json({ error: error?.message ?? 'Download fehlgeschlagen.' }, 400)

  return new Response(null, { status: 302, headers: { Location: data.signedUrl } })
}
