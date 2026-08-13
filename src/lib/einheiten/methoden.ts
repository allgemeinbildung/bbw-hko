import type { MethodeKarte, MethodeRef, Methode } from './types'

/**
 * Methodenkartei — plattformweit, einheitenunabhängig.
 *
 * Eine Karte beschreibt ein Werkzeug ein einziges Mal: Schritte, Knackpunkt,
 * Musterbeispiel, typischer Fehler, Faustregel. Sie kennt die Einheit nicht, in der
 * sie eingesetzt wird — das Musterbeispiel hat deshalb ein festes, neutrales Sujet,
 * genau wie die Musterbriefe im Lehrmittel, die auch in jedem Unterricht dasselbe
 * Thema zeigen und trotzdem als Vorlage taugen.
 *
 * Einheitenspezifisch ist nur die Übertragung: `fuer` (wofür in dieser Abgabe) und
 * `tun` (was mit dem Kapitel in dieser Abgabe zu machen ist). Beides steht in der
 * Herausforderung, nicht auf der Karte. `beispiel` lässt sich pro Einsatz überschreiben,
 * wenn eine Einheit wirklich ein eigenes braucht — Regelfall ist das Karten-Beispiel.
 */
const karteiFiles = import.meta.glob('../../data/methoden/*.json', { eager: true }) as Record<
  string,
  { default: MethodeKarte }
>

const KARTEI: Record<string, MethodeKarte> = Object.fromEntries(
  Object.values(karteiFiles)
    .map((m) => m.default)
    .filter((k): k is MethodeKarte => !!k?.id)
    .map((k) => [k.id, k]),
)

export function methodeKarte(id: string): MethodeKarte | null {
  return KARTEI[id] ?? null
}

export function alleMethodenKarten(): MethodeKarte[] {
  return Object.values(KARTEI).sort((a, b) => a.id.localeCompare(b.id))
}

/**
 * Löst die Referenzliste einer Herausforderung gegen die Kartei auf.
 * Unbekannte Referenzen werden übersprungen und gemeldet, statt die Seite zu sprengen —
 * eine fehlende Karte darf kein Heft unrenderbar machen.
 */
export function resolveMethoden(refs: MethodeRef[] | null | undefined): Methode[] {
  if (!refs?.length) return []
  const out: Methode[] = []
  for (const r of refs) {
    if (!r?.ref) continue
    const karte = KARTEI[r.ref]
    if (!karte) {
      console.warn(`[methoden] Unbekannte Karte «${r.ref}» — übersprungen.`)
      continue
    }
    out.push({
      ...karte,
      ...(r.fuer ? { fuer: r.fuer } : {}),
      ...(r.beispiel?.length ? { beispiel: r.beispiel } : {}),
      ...(r.tun ? { tun: r.tun } : {}),
    })
  }
  return out
}
