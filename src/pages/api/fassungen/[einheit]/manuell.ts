/**
 * Fork-Pilot «Meine Fassung» — Selbst bearbeiten (15.11.2026), ohne Modell.
 *  GET  /api/fassungen/<einheit>/manuell?datei=<datei>&pfad=<pfad>  → { wert, max, original }  aktueller Text des Felds und Original
 *  POST /api/fassungen/<einheit>/manuell  { datei, pfad, wert }       → { fassung: FassungSicht }
 *
 * Prüfung in `src/lib/fork/manuell.ts` (Positivliste, Form, Länge, Anrede). Jede Änderung
 * legt ein abgeschlossenes Bündel an (Spur für KT1, `auftrag: 'manuell'`); kein Aufruf ans
 * Modell, darum keine Tagesgrenze und nichts an OpenAI.
 */
import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../../lib/supabase'
import { fehler, holeOderLegeFassung, json, ladeFassung, ladeSicht, zugang } from '../../../../lib/fork/server'
import { jetzigerWert, wendeManuellAn } from '../../../../lib/fork/manuell'
import { heftVon } from '../../../../components/einheiten/fork/fork-hilfe'
import type { FassungsDatei } from '../../../../lib/fork/typen'

export const prerender = false

export const GET: APIRoute = async ({ locals, params, url }) => {
  const z = await zugang(locals, params.einheit)
  if (!z.ok) return z.res
  const datei = url.searchParams.get('datei') ?? ''
  const pfad = url.searchParams.get('pfad') ?? ''
  try {
    const f = await ladeFassung(createAdminClient(), z.userId, z.slug)
    const w = jetzigerWert(z.roh, f?.ersetzungen ?? [], datei as FassungsDatei, pfad)
    if (!w) return fehler('Dieses Feld lässt sich nicht selbst bearbeiten.', 400)
    return json(w)
  } catch {
    return fehler('Der Text konnte nicht geladen werden.', 502)
  }
}

export const POST: APIRoute = async ({ locals, params, request }) => {
  const z = await zugang(locals, params.einheit)
  if (!z.ok) return z.res
  let body: { datei?: unknown; pfad?: unknown; wert?: unknown }
  try { body = await request.json() } catch { return fehler('Ungültige Anfrage.', 400) }
  const datei = typeof body?.datei === 'string' ? body.datei : ''
  const pfad = typeof body?.pfad === 'string' ? body.pfad : ''
  const heft = heftVon(datei)
  if (!heft) return fehler('Dieses Feld lässt sich nicht selbst bearbeiten.', 400)

  const admin = createAdminClient()
  try {
    const bisher = (await ladeFassung(admin, z.userId, z.slug))?.ersetzungen ?? []
    const buendelId = crypto.randomUUID()
    const r = wendeManuellAn({ roh: z.roh, ersetzungen: bisher, datei, pfad, wert: body?.wert, buendelId })
    if (!r.ok) return fehler(r.fehler, 400)
    if (!r.geaendert) return json({ fassung: await ladeSicht(admin, z.userId, z.slug), geaendert: false })

    const f = await holeOderLegeFassung(admin, z.userId, z.slug)
    if (r.ersetzungen.some((e) => e.buendel_id === buendelId)) {
      const { error: bErr } = await admin.from('einheit_fassung_buendel').insert({
        id: buendelId, fassung_id: f.id, user_id: z.userId, heft, status: 'abgeschlossen',
        kommentare: [{ auftrag: 'manuell', datei, pfad, kommentar: 'Selbst bearbeitet' }],
      })
      if (bErr) throw bErr
    }
    const { error } = await admin.from('einheit_fassungen').update({ ersetzungen: r.ersetzungen }).eq('id', f.id).eq('user_id', z.userId)
    if (error) throw error
    return json({ fassung: await ladeSicht(admin, z.userId, z.slug), geaendert: true })
  } catch {
    return fehler('Die Änderung konnte nicht gespeichert werden.', 502)
  }
}
