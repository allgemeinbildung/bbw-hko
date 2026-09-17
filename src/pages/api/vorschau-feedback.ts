import type { APIRoute } from 'astro'
import { createAdminClient } from '../../lib/supabase'
import { loadEinheit } from '../../lib/einheiten'
import { VORSCHAU_ROLLEN, normalizeFeedback } from '../../lib/vorschau'

export const prerender = false

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

/**
 * Rückmeldung zu einer Einheiten-Vorschau. Eine Zeile pro Person und Einheit:
 * erneutes Absenden überschreibt die frühere Rückmeldung.
 */
export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: 'Nicht angemeldet — bitte neu einloggen.' }, 401)

  const { data: profile } = await locals.supabase
    .from('profiles').select('role').eq('id', locals.user.id).single()
  const rolle = profile?.role
  if (!VORSCHAU_ROLLEN.includes(rolle as any)) return json({ error: 'Keine Berechtigung.' }, 403)

  let raw: any
  try {
    raw = await request.json()
  } catch {
    return json({ error: 'Ungültige Anfrage.' }, 400)
  }

  const einheitId = typeof raw?.einheit_id === 'string' ? raw.einheit_id : ''
  if (!/^[\w.-]+$/.test(einheitId) || !loadEinheit(einheitId)) return json({ error: 'Unbekannte Einheit.' }, 400)

  const fb = normalizeFeedback(raw)
  if (!Object.keys(fb.bewertungen).length && !fb.kommentar) {
    return json({ error: 'Bitte mindestens einen Baustein bewerten oder einen Kommentar schreiben.' }, 400)
  }

  const { error } = await createAdminClient()
    .from('vorschau_feedback')
    .upsert(
      {
        einheit_id: einheitId,
        lp_id: locals.user.id,
        rolle,
        bewertungen: fb.bewertungen,
        kommentar: fb.kommentar || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'einheit_id,lp_id' },
    )
  if (error) {
    console.error('vorschau_feedback upsert', error)
    return json({ error: 'Speichern fehlgeschlagen. Bitte später nochmals versuchen.' }, 500)
  }
  return json({ ok: true })
}
