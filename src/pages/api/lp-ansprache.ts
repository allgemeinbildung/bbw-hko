import type { APIRoute } from 'astro'

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

// KT1 vermerkt: Lehrperson angesprochen — oder (Notausgang) nicht erreichbar.
// Schreibt über den RLS-Client; die Datenbank lässt nur role='kt1' mit kt1_id = eigene ID zu.
export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: 'Nicht angemeldet.' }, 401)

  const { data: profile } = await locals.supabase
    .from('profiles').select('role').eq('id', locals.user.id).single()
  if (profile?.role !== 'kt1') return json({ error: 'Nur für KT1.' }, 403)

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return json({ error: 'Ungültiges JSON.' }, 400) }

  const lp_id = typeof body.lp_id === 'string' ? body.lp_id : ''
  const art = body.art
  const notiz = typeof body.notiz === 'string' ? body.notiz.trim().slice(0, 1000) : ''
  if (!lp_id) return json({ error: 'lp_id fehlt.' }, 400)
  if (art !== 'angesprochen' && art !== 'nicht_erreichbar') return json({ error: 'Ungültige Art.' }, 400)
  // Notausgang ohne Begründung wäre keiner: es muss stehen, was versucht wurde.
  if (art === 'nicht_erreichbar' && !notiz) return json({ error: 'Bitte kurz vermerken, was du versucht hast.' }, 400)

  const { data, error } = await locals.supabase
    .from('lp_ansprache')
    .insert({ lp_id, kt1_id: locals.user.id, art, notiz: notiz || null })
    .select('id, lp_id, art, notiz, created_at')
    .single()

  if (error) return json({ error: error.message }, 400)
  return json({ data }, 200)
}
