import type { APIRoute } from 'astro'

const ALLOWED_FIELDS = [
  'material_id',
  'klasse',
  'lehrjahr',
  'abteilung',
  'getestet_am',
  'dauer_lektionen',
  'tauglichkeit',
  'qualitaet_situation',
  'qualitaet_handlungsprodukt',
  'schwierigkeit',
  'niveau_passung',
  'noetiges_scaffolding',
  'motivation',
  'weiterempfehlung',
  'kn_fairness',
  'kn_zeit_angemessen',
  'kn_raster_brauchbar',
  'kn_ergebnis',
  'kn_validitaet',
  'wirksame_sk',
  'wirksame_aspekte',
  'was_funktionierte',
  'was_nicht_funktionierte',
  'aenderungsvorschlaege',
  'eigene_anpassungen',
  'anmerkungen',
  'neue_idee',
  'idee_typ',
  'idee_titel',
  'idee_beschreibung',
  'freigabe_gemeinsamer_kn',
  'status',
] as const

function pick(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const k of ALLOWED_FIELDS) if (k in body) out[k] = body[k] === '' ? null : body[k]
  return out
}

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Nicht angemeldet.' }), { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültiges JSON.' }), { status: 400 })
  }
  if (!body.material_id) {
    return new Response(JSON.stringify({ error: 'material_id fehlt.' }), { status: 400 })
  }
  const status = (body.status as string) ?? 'entwurf'
  if (!['entwurf', 'eingereicht'].includes(status)) {
    return new Response(JSON.stringify({ error: 'Ungültiger Status für Erstanlage.' }), { status: 400 })
  }

  const payload = { ...pick(body), lp_id: locals.user.id, status }

  const { data, error } = await locals.supabase
    .from('material_feedbacks')
    .insert(payload)
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  return new Response(JSON.stringify({ data }), { status: 201 })
}
