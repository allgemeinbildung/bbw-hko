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
      lebensbezug_nr: body.lebensbezug_nr || null,
      kompetenz_nr: body.kompetenz_nr || null,
      kompetenz_nrs: body.kompetenz_nrs ?? [],
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
      // HKO-Beitragsfelder (Migration 010)
      kompetenzversprechen: body.kompetenzversprechen || null,
      leitfrage: body.leitfrage || null,
      mehrdeutigkeit: body.mehrdeutigkeit || null,
      kn_format: body.kn_format || null,
      kn_aufgabe: body.kn_aufgabe || null,
      bewertungskriterien: body.bewertungskriterien ?? [],
      lehrmittel_anker: body.lehrmittel_anker || null,
      didaktischer_kniff: body.didaktischer_kniff || null,
      // zusatzmaterialien wird ueber /api/materials/[id]/files verwaltet
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
