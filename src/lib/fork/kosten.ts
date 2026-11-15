/**
 * Fork-Pilot «Meine Fassung» — Preise und Kosten der Modellaufrufe.
 *
 * Reine Rechenlogik ohne Abhängigkeiten (läuft unter `node --test`, scripts/fork/kosten.test.mjs).
 * Begründung und Hochrechnung: docs/fork/KOSTEN.md.
 *
 * Preisquelle: https://developers.openai.com/api/docs/pricing, abgefragt am 15.11.2026,
 * Standard-Tarif, kurzer Kontext (bis 272 000 Eingabe-Tokens; die Anfragen des Piloten liegen
 * bei rund 3 000–12 000). Ändert OpenAI die Preise, nur PREISE und PREISSTAND nachführen.
 * Die Ausgabe-Tokens enthalten bei Reasoning-Modellen die Denk-Tokens — sie kosten wie Ausgabe.
 */

export const PREISSTAND = '15.11.2026'
export const PREISQUELLE = 'https://developers.openai.com/api/docs/pricing'

/** USD pro 1 Mio. Tokens. */
export interface Preis { eingabe: number; gecacht: number; ausgabe: number }

export const PREISE: Record<string, Preis> = {
  'gpt-6-luna': { eingabe: 0.10, gecacht: 0.01, ausgabe: 0.50 },
  'gpt-6.1-terra': { eingabe: 1.00, gecacht: 0.05, ausgabe: 5.00 },
  'gpt-6.1-sol': { eingabe: 2.00, gecacht: 0.10, ausgabe: 10.00 },
  'gpt-6-sol': { eingabe: 2.00, gecacht: 0.20, ausgabe: 10.00 },
}

/** Kurs USD→CHF (Mittelkurs Anfang November 2026, gerundet; Quelle docs/fork/KOSTEN.md). */
export const USD_CHF = 0.82
export const KURSSTAND = '15.11.2026'

/**
 * Preis zu einer Modell-ID. Die Antwort nennt oft einen Snapshot («gpt-6-luna-2026-10-01») —
 * darum gilt der längste bekannte Name, mit dem die ID beginnt. Unbekannt → `null`.
 */
export function preisFuer(modell: string | null | undefined): Preis | null {
  if (!modell) return null
  const id = modell.trim().toLowerCase()
  let best: string | null = null
  for (const k of Object.keys(PREISE)) {
    if ((id === k || id.startsWith(`${k}-`)) && (!best || k.length > best.length)) best = k
  }
  return best ? PREISE[best] : null
}

export interface Tokens { eingabe: number; gecacht?: number; ausgabe: number }

/**
 * Kosten in USD. `gecacht` ist ein Teil von `eingabe` (so zählt OpenAI `input_tokens`):
 * der gecachte Teil kostet den Cache-Preis, der Rest den vollen. `null` bei unbekanntem Modell.
 */
export function kostenUsd(t: Tokens, modell: string | null | undefined): number | null {
  const p = preisFuer(modell)
  if (!p) return null
  const eingabe = Math.max(0, t.eingabe || 0)
  const gecacht = Math.min(eingabe, Math.max(0, t.gecacht || 0))
  const ausgabe = Math.max(0, t.ausgabe || 0)
  return ((eingabe - gecacht) * p.eingabe + gecacht * p.gecacht + ausgabe * p.ausgabe) / 1_000_000
}

export const usdZuChf = (usd: number): number => usd * USD_CHF

/** Betrag für die Anzeige: unter einem Rappen/Cent mit vier Stellen, sonst zwei. */
export function betrag(wert: number, waehrung: 'USD' | 'CHF'): string {
  const stellen = Math.abs(wert) > 0 && Math.abs(wert) < 0.01 ? 4 : 2
  return `${waehrung} ${wert.toFixed(stellen)}`
}
