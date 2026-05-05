import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültiges JSON.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data, error } = await locals.supabase
    .from('materials')
    .insert({
      submitted_by: locals.user.id,
      typ: body.typ,
      lehrdauer: body.lehrdauer,
      lehrjahr: body.lehrjahr,
      thema_nr: body.thema_nr,
      thema_titel: body.thema_titel,
      titel: body.titel,
      abteilung: body.abteilung || null,
      schluesselkompetenzen: body.schluesselkompetenzen,
      aspekte: body.aspekte,
      sprachmodus_primaer: body.sprachmodus_primaer,
      sprachmodi_sekundaer: body.sprachmodi_sekundaer,
      handlungsprodukt_typ: body.handlungsprodukt_typ,
      herausforderung_text: body.herausforderung_text || null,
      handlungsprodukt_beschreibung: body.handlungsprodukt_beschreibung,
      beurteilungsraster: body.beurteilungsraster,
      datei_name: body.datei_name || null,
      selbstcheck: body.selbstcheck,
    })
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
