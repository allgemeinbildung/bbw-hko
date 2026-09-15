import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../lib/supabase'
import {
  MELDUNG_STATUS,
  authoriseMeldung,
  json,
  mailAnMeldende,
  type MeldungRow,
  type MeldungStatus,
} from '../../../lib/meldungen'

export const prerender = false

/** KT1 ändert den Status. «Erledigt» benachrichtigt die meldende Person. */
export const PATCH: APIRoute = async ({ locals, params, request, url }) => {
  const auth = await authoriseMeldung(locals, params.id ?? '')
  if (!auth.ok) return auth.res
  if (!auth.isKt1) return json({ error: 'Nur KT1 kann den Status ändern.' }, 403)

  const body = await request.json().catch(() => null)
  const status = body?.status as MeldungStatus
  if (!MELDUNG_STATUS.includes(status)) return json({ error: 'Ungültiger Status.' }, 400)

  const m = auth.meldung
  if (status === m.status) return json({ data: m })

  const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === 'erledigt') update.lp_ungelesen = true

  const { data, error } = await createAdminClient()
    .from('meldungen').update(update).eq('id', m.id).select().single()
  if (error || !data) return json({ error: error?.message ?? 'Speichern fehlgeschlagen.' }, 400)

  if (status === 'erledigt' && !auth.isOwner) {
    await mailAnMeldende(url.origin, data as MeldungRow, 'erledigt')
  }
  return json({ data })
}
