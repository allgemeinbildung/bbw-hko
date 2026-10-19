// feedback-kommentare.ts — «Warum?» zu jeder Bewertung im Einheiten-Feedback
// (Migration 024, Rückmeldung Christof 19.10.2026).
//
// Gespeichert als jsonb `bewertung_kommentare` = { <bewertungsfeld>: "Begründung" }.
// Der Browser schickt ein beliebiges Objekt; hier bleibt nur, was zu einem
// bekannten Bewertungsfeld gehört, als gekürzter Text.

export const KOMMENTAR_FELDER = [
  'tauglichkeit', 'qualitaet_situation', 'qualitaet_handlungsprodukt',
  'schwierigkeit', 'motivation', 'kn_validitaet',
  'kn_fairness', 'kn_zeit_angemessen', 'kn_raster_brauchbar',
] as const

const MAX_LAENGE = 1000

export function sanitizeBewertungKommentare(update: Record<string, unknown>): void {
  if (!('bewertung_kommentare' in update)) return
  const roh = update.bewertung_kommentare
  if (!roh || typeof roh !== 'object' || Array.isArray(roh)) {
    update.bewertung_kommentare = null
    return
  }
  const out: Record<string, string> = {}
  for (const feld of KOMMENTAR_FELDER) {
    const v = (roh as Record<string, unknown>)[feld]
    if (typeof v === 'string' && v.trim()) out[feld] = v.trim().slice(0, MAX_LAENGE)
  }
  update.bewertung_kommentare = Object.keys(out).length ? out : null
}
