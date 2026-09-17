import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../lib/supabase'
import { einheitById, loadEinheit } from '../../../lib/einheiten'
import { buildUebersicht, einheitPrefix } from '../../../lib/einheiten/uebersicht'
import { VORSCHAU_BUCKET, VORSCHAU_ORDNER, VORSCHAU_ROLLEN, normalizeFeedback } from '../../../lib/vorschau'

export const prerender = false

const TYPES: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
}
// Vercel-Funktionen antworten mit höchstens 4.5 MB; grössere Downloads gehen über eine signierte URL.
const MAX_INLINE = 4 * 1024 * 1024

const COMMON = { 'X-Robots-Tag': 'noindex, nofollow' }

function seite(status: number, titel: string, text: string) {
  return new Response(
    `<!DOCTYPE html><html lang="de-CH"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${titel}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:0 20px;color:#1d2026">
<h1 style="font-size:1.3rem;color:#094d28">${titel}</h1><p>${text}</p><p><a href="/">Zur Plattform</a></p></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...COMMON } },
  )
}

/**
 * Vorschau eines Einheiten-Bundles hinter dem Login.
 *
 *   /vorschau/{setKey}/            → Übersicht, live aus buildUebersicht()
 *   /vorschau/{setKey}/html/…      → Datei aus dem privaten Bucket `vorschau`
 *
 * Die relativen Links der Übersicht (`html/…`, `word/…`, `Material_LP/…`) lösen
 * dadurch unter derselben URL auf wie im entpackten ZIP.
 */
export const GET: APIRoute = async ({ locals, params, url, redirect }) => {
  if (!locals.user) return redirect('/login')

  const { data: profile } = await locals.supabase
    .from('profiles').select('role').eq('id', locals.user.id).single()
  if (!VORSCHAU_ROLLEN.includes(profile?.role as any)) {
    return seite(403, 'Nur für Lehrpersonen', 'Die Vorschau neuer Einheiten ist Lehrpersonen vorbehalten.')
  }

  const setKey = params.setKey ?? ''
  const path = params.path ?? ''
  if (!/^[\w.-]+$/.test(setKey)) return seite(404, 'Nicht gefunden', 'Diese Vorschau gibt es nicht.')

  const admin = createAdminClient()
  const storage = admin.storage.from(VORSCHAU_BUCKET)

  // ── Übersicht ──
  if (path === '' || path === 'index.html' || path === 'Übersicht_LP.html') {
    // Ohne Schrägstrich am Ende würden relative Links eine Ebene zu hoch auflösen.
    if (path === '' && !url.pathname.endsWith('/')) return redirect(`${url.pathname}/`, 301)

    const fullSet = loadEinheit(setKey)
    const meta = einheitById(setKey)
    if (!fullSet || !meta) return seite(404, 'Nicht gefunden', 'Diese Vorschau gibt es nicht.')

    const listen = await Promise.all(
      VORSCHAU_ORDNER.map((ordner) =>
        storage.list(`${setKey}/${ordner}`, { limit: 1000, sortBy: { column: 'name', order: 'asc' } })
          .then(({ data }) => (data ?? []).filter((f) => f.id).map((f) => ({ path: `${ordner}/${f.name}`, at: f.updated_at ?? f.created_at }))),
      ),
    )
    const dateien = listen.flat()
    if (!dateien.length) return seite(404, 'Keine Vorschau', 'Für diese Einheit ist keine Vorschau hochgeladen.')
    const stand = dateien.reduce((max, f) => (f.at && f.at > max ? f.at : max), '')

    const { data: fb } = await admin
      .from('vorschau_feedback')
      .select('bewertungen, kommentar')
      .eq('einheit_id', setKey)
      .eq('lp_id', locals.user.id)
      .maybeSingle()

    const html = buildUebersicht({
      prefix: einheitPrefix(fullSet),
      log: dateien.map((f) => f.path),
      d: fullSet,
      when: stand ? new Date(stand) : new Date(),
      abgedeckteKompetenzen: meta.abgedeckte_kompetenzen,
      mode: 'vorschau',
      feedbackEndpoint: '/api/vorschau-feedback',
      bisherigesFeedback: fb ? normalizeFeedback(fb) : null,
      zurueckUrl: profile?.role === 'kt1' ? '/admin/vorschau-feedback' : '/einheiten',
    })
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', ...COMMON },
    })
  }

  // ── Datei ──
  const teile = path.split('/')
  if (
    teile.length !== 2 ||
    !(VORSCHAU_ORDNER as readonly string[]).includes(teile[0]) ||
    !/^[\w.-]+$/.test(teile[1])
  ) {
    return seite(404, 'Nicht gefunden', 'Diese Datei gibt es nicht.')
  }
  const name = teile[1]
  const ext = name.split('.').pop()!.toLowerCase()
  const key = `${setKey}/${path}`

  const { data: blob, error } = await storage.download(key)
  if (error || !blob) return seite(404, 'Nicht gefunden', 'Diese Datei gibt es nicht.')

  const istHtml = ext === 'html'
  if (!istHtml && blob.size > MAX_INLINE) {
    const { data: signed } = await storage.createSignedUrl(key, 60, { download: name })
    if (signed?.signedUrl) return redirect(signed.signedUrl, 302)
  }

  return new Response(blob, {
    headers: {
      'Content-Type': TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': 'private, max-age=300',
      ...(istHtml ? {} : { 'Content-Disposition': `attachment; filename="${name}"` }),
      ...COMMON,
    },
  })
}
