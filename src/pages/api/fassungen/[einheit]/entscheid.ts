/**
 * Fork-Pilot «Meine Fassung» (VERTRAG §9).
 *  POST /api/fassungen/<einheit>/entscheid  { buendel_id, entscheide: { "<datei>:<pfad>": "angenommen"|"verworfen" } }
 *  → { fassung: FassungSicht }
 *
 * Übernommen wird nur, was im gespeicherten, geprüften Vorschlag steht — nie ein Wert
 * aus dem Request. Eine ältere Ersetzung mit gleichem datei+pfad wird ersetzt.
 */
import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../../lib/supabase'
import { fehler, json, ladeFassung, ladeSicht, zugang, type BuendelRow } from '../../../../lib/fork/server'
import type { Entscheid, Ersetzung } from '../../../../lib/fork/typen'

export const prerender = false

const ENTSCHEIDE: readonly string[] = ['angenommen', 'verworfen']
const schluessel = (e: { datei: string; pfad: string }) => `${e.datei}:${e.pfad}`

export const POST: APIRoute = async ({ locals, params, request }) => {
  const z = await zugang(locals, params.einheit)
  if (!z.ok) return z.res

  let body: { buendel_id?: unknown; entscheide?: unknown }
  try {
    body = await request.json()
  } catch {
    return fehler('Ungültige Anfrage.', 400)
  }
  const id = typeof body?.buendel_id === 'string' ? body.buendel_id : ''
  const ein = body?.entscheide
  if (!id || !ein || typeof ein !== 'object' || Array.isArray(ein)) return fehler('Ungültige Anfrage.', 400)

  const admin = createAdminClient()
  try {
    const f = await ladeFassung(admin, z.userId, z.slug)
    if (!f) return fehler('Keine Fassung zu dieser Einheit.', 404)
    const { data, error } = await admin.from('einheit_fassung_buendel').select('*')
      .eq('id', id).eq('fassung_id', f.id).eq('user_id', z.userId).maybeSingle()
    if (error) throw error
    const b = data as BuendelRow | null
    if (!b) return fehler('Vorschlag nicht gefunden.', 404)
    if (b.status !== 'vorschlag' || !b.vorschlag) return fehler('Dieser Vorschlag kann nicht (mehr) übernommen werden.', 400)

    const vorgeschlagen = new Map(b.vorschlag.ersetzungen.map((e) => [schluessel(e), e]))
    const bisher = b.entscheide ?? {}
    const neu: Record<string, Entscheid> = {}
    for (const [k, v] of Object.entries(ein as Record<string, unknown>)) {
      if (!vorgeschlagen.has(k)) return fehler('Ein Entscheid betrifft keinen Block dieses Vorschlags.', 400)
      if (typeof v !== 'string' || !ENTSCHEIDE.includes(v)) return fehler('Ungültiger Entscheid.', 400)
      if (bisher[k] && bisher[k] !== v) return fehler('Über diesen Block ist schon entschieden.', 400)
      if (!bisher[k]) neu[k] = v as Entscheid
    }

    // Nur aus dem gespeicherten Vorschlag; `begruendung` gehört nicht in die Fassung (VERTRAG §1).
    const angenommen: Ersetzung[] = Object.entries(neu).filter(([, v]) => v === 'angenommen').map(([k]) => {
      const e = vorgeschlagen.get(k)!
      return { datei: e.datei, pfad: e.pfad, wert: e.wert, original_hash: e.original_hash, auftrag: e.auftrag, buendel_id: b.id }
    })
    if (angenommen.length) {
      const neueKeys = new Set(angenommen.map(schluessel))
      const ersetzungen = [...(f.ersetzungen ?? []).filter((e) => !neueKeys.has(schluessel(e))), ...angenommen]
      const { error: fErr } = await admin.from('einheit_fassungen').update({ ersetzungen }).eq('id', f.id).eq('user_id', z.userId)
      if (fErr) throw fErr
    }

    const entscheide = { ...bisher, ...neu }
    const fertig = [...vorgeschlagen.keys()].every((k) => entscheide[k])
    const { error: bErr } = await admin.from('einheit_fassung_buendel')
      .update({ entscheide, ...(fertig ? { status: 'abgeschlossen' } : {}) }).eq('id', b.id).eq('user_id', z.userId)
    if (bErr) throw bErr

    return json({ fassung: await ladeSicht(admin, z.userId, z.slug) })
  } catch {
    return fehler('Der Entscheid konnte nicht gespeichert werden.', 502)
  }
}
