/**
 * Fork-Pilot «Meine Fassung» (VERTRAG §9).
 *  GET    /api/fassungen/<einheit>  → { fassung: FassungSicht | null }  (ohne Klartext)
 *  DELETE /api/fassungen/<einheit>  → { ok: true }  Fassung samt Bündeln und Klartexten löschen
 */
import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../lib/supabase'
import { FASSUNG_BUCKET, fehler, json, ladeFassung, ladeSicht, zugang } from '../../../lib/fork/server'

export const prerender = false

export const GET: APIRoute = async ({ locals, params }) => {
  const z = await zugang(locals, params.einheit)
  if (!z.ok) return z.res
  try {
    return json({ fassung: await ladeSicht(createAdminClient(), z.userId, z.slug) })
  } catch {
    return fehler('Die Fassung konnte nicht geladen werden.', 502)
  }
}

export const DELETE: APIRoute = async ({ locals, params }) => {
  const z = await zugang(locals, params.einheit)
  if (!z.ok) return z.res
  const admin = createAdminClient()
  try {
    const f = await ladeFassung(admin, z.userId, z.slug)
    if (!f) return json({ ok: true })
    const { data: rows, error } = await admin.from('einheit_fassung_buendel').select('text_pfad').eq('fassung_id', f.id).eq('user_id', z.userId)
    if (error) throw error
    // Erst die Klartexte, dann die Zeilen — sonst gingen die Pfade verloren.
    const pfade = [...new Set((rows ?? []).map((r) => r.text_pfad as string | null).filter((p): p is string => !!p))]
    if (pfade.length) {
      const { error: stErr } = await admin.storage.from(FASSUNG_BUCKET).remove(pfade)
      if (stErr) throw stErr
    }
    // Bündel fallen mit `on delete cascade`.
    const { error: delErr } = await admin.from('einheit_fassungen').delete().eq('id', f.id).eq('user_id', z.userId)
    if (delErr) throw delErr
    return json({ ok: true })
  } catch {
    return fehler('Die Fassung konnte nicht gelöscht werden.', 502)
  }
}
