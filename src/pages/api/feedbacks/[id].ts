import type { APIRoute } from 'astro'

const LP_FIELDS = [
  'klasse',
  'lehrjahr',
  'abteilung',
  'getestet_am',
  'dauer_lektionen',
  'tauglichkeit',
  'qualitaet',
  'schwierigkeit',
  'motivation',
  'weiterempfehlung',
  'was_funktionierte',
  'was_nicht_funktionierte',
  'aenderungsvorschlaege',
  'eigene_anpassungen',
  'anmerkungen',
  'status',
] as const

const KT1_FIELDS = ['status', 'kt1_kommentar'] as const

function pick(body: Record<string, unknown>, allowed: readonly string[]) {
  const out: Record<string, unknown> = {}
  for (const k of allowed) if (k in body) out[k] = body[k] === '' ? null : body[k]
  return out
}

export const PATCH: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Nicht angemeldet.' }), { status: 401 })

  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'id fehlt.' }), { status: 400 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültiges JSON.' }), { status: 400 })
  }

  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', locals.user.id)
    .single()
  const isKt1 = profile?.role === 'kt1'

  const update = isKt1 ? pick(body, KT1_FIELDS) : pick(body, LP_FIELDS)
  if (Object.keys(update).length === 0) {
    return new Response(JSON.stringify({ error: 'Keine änderbaren Felder.' }), { status: 400 })
  }
  if (isKt1 && update.status) {
    update.reviewed_by = locals.user.id
    update.reviewed_at = new Date().toISOString()
  }

  const { data, error } = await locals.supabase
    .from('feedbacks')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  return new Response(JSON.stringify({ data }), { status: 200 })
}

export const DELETE: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Nicht angemeldet.' }), { status: 401 })
  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'id fehlt.' }), { status: 400 })
  const { error } = await locals.supabase.from('feedbacks').delete().eq('id', id)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  return new Response(null, { status: 204 })
}
