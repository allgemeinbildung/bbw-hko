import type { APIRoute } from 'astro'
import { createAdminClient } from '../../lib/supabase'
import { getRole } from '../../lib/meldungen'
import { aktuellesSemester } from '../../lib/kurzumfrage'

export const prerender = false

/**
 * Anonyme Kurzumfrage (Migration 023). Nur angemeldete Lehrpersonen dürfen
 * antworten — geprüft wird die Rolle, gespeichert wird sie ohne jeden
 * Personenbezug. Das Semester bestimmt der Server, nicht der Client.
 */
const HILFT = ['ja', 'eher_ja', 'eher_nein', 'nein']

export const POST: APIRoute = async ({ request, locals }) => {
  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

  const role = await getRole(locals)
  if (role !== 'lp' && role !== 'reviewer') return json({ error: 'Nicht berechtigt.' }, 403)

  const body = await request.json().catch(() => null)
  const hilft = typeof body?.hilft === 'string' ? body.hilft : ''
  if (!HILFT.includes(hilft)) return json({ error: 'Bitte eine Antwort wählen.' }, 400)
  const verbessern = typeof body?.verbessern === 'string' ? body.verbessern.trim().slice(0, 2000) : ''

  const { error } = await createAdminClient().from('kurzumfrage').insert({
    semester: aktuellesSemester(),
    rolle: role,
    hilft,
    verbessern: verbessern || null,
  })
  if (error) return json({ error: 'Speichern fehlgeschlagen.' }, 500)
  return json({ ok: true }, 201)
}
