import type { APIRoute } from 'astro'

export const PATCH: APIRoute = async ({ locals, request, params }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = params
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID fehlt.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', locals.user.id)
    .single()

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültiges JSON.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (profile?.role === 'kt1') {
    const update: Record<string, unknown> = {
      reviewed_by: locals.user.id,
      reviewed_at: new Date().toISOString(),
    }
    if (body.status !== undefined) update.status = body.status
    if ('kt1_kommentar' in body) update.kt1_kommentar = body.kt1_kommentar || null

    const { data, error } = await locals.supabase
      .from('materials')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // LP: verify ownership + status='eingereicht'
  const { data: existing } = await locals.supabase
    .from('materials')
    .select('submitted_by, status')
    .eq('id', id)
    .single()

  if (!existing) {
    return new Response(JSON.stringify({ error: 'Material nicht gefunden.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  if (existing.submitted_by !== locals.user.id) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  if (existing.status !== 'eingereicht') {
    return new Response(JSON.stringify({ error: 'Material kann nicht mehr bearbeitet werden.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data, error } = await locals.supabase
    .from('materials')
    .update({
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
      herausforderung_text: body.herausforderung_text || null,
      handlungsprodukt_typ: body.handlungsprodukt_typ,
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
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const DELETE: APIRoute = async ({ locals, params }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = params
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID fehlt.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data: existing } = await locals.supabase
    .from('materials')
    .select('submitted_by, status')
    .eq('id', id)
    .single()

  if (!existing) {
    return new Response(JSON.stringify({ error: 'Material nicht gefunden.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  if (existing.submitted_by !== locals.user.id) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  if (existing.status !== 'eingereicht') {
    return new Response(JSON.stringify({ error: 'Material kann nicht mehr gelöscht werden.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { error } = await locals.supabase
    .from('materials')
    .delete()
    .eq('id', id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(null, { status: 204 })
}
