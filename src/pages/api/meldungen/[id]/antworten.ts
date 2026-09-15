import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../../lib/supabase'
import {
  MAX_TEXT,
  authoriseMeldung,
  json,
  mailAnKt1,
  mailAnMeldende,
  type MeldungRow,
} from '../../../../lib/meldungen'

export const prerender = false

/**
 * Antwort im Ticketverlauf.
 *
 * Wer schreibt, bestimmt, wer danach am Zug ist:
 *   KT1       → wartet_auf=meldend, lp_ungelesen, «neu» wird «in Arbeit»;
 *               optional `erledigt: true` schliesst im selben Schritt (eine Mail).
 *   meldend   → wartet_auf=kt1; eine erledigte Meldung wird wieder geöffnet.
 * Die meldende Person spricht immer als «meldend», auch wenn sie KT1 ist.
 */
export const POST: APIRoute = async ({ locals, params, request, url }) => {
  const auth = await authoriseMeldung(locals, params.id ?? '')
  if (!auth.ok) return auth.res

  const body = await request.json().catch(() => null)
  const text = typeof body?.text === 'string' ? body.text.trim().slice(0, MAX_TEXT) : ''
  if (!text) return json({ error: 'Die Antwort ist leer.' }, 400)

  const m = auth.meldung
  const von = auth.isOwner ? 'meldend' : 'kt1'
  const schliessen = von === 'kt1' && body?.erledigt === true

  const admin = createAdminClient()
  const { data: antwort, error } = await admin
    .from('meldung_antworten')
    .insert({ meldung_id: m.id, autor_id: locals.user!.id, von, text })
    .select()
    .single()
  if (error || !antwort) return json({ error: error?.message ?? 'Speichern fehlgeschlagen.' }, 400)

  const now = new Date().toISOString()
  const update = von === 'kt1'
    ? {
        updated_at: now,
        wartet_auf: 'meldend',
        lp_ungelesen: true,
        status: schliessen ? 'erledigt' : m.status === 'neu' ? 'in_arbeit' : m.status,
      }
    : {
        updated_at: now,
        wartet_auf: 'kt1',
        status: m.status === 'erledigt' ? 'in_arbeit' : m.status,
      }
  const { data: upd } = await admin.from('meldungen').update(update).eq('id', m.id).select().single()
  const neu = (upd ?? m) as MeldungRow

  if (von === 'kt1') await mailAnMeldende(url.origin, neu, schliessen ? 'erledigt' : 'antwort', text)
  else await mailAnKt1(url.origin, neu, 'antwort', text)

  return json({ data: antwort }, 201)
}
