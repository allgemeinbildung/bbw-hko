/**
 * Fork-Pilot «Meine Fassung» — automatische Prüfungen der Modellvorschläge (Entscheid F18).
 *
 *  - Du-Anrede: Hausregel ist «Sie». Ein Wert für Lernende, der eine Du-Form einführt, die
 *    die Datei im Original nicht benutzt, wird verworfen. Was in Anführungszeichen steht
 *    (wörtliche Rede einer Persona), zählt nicht.
 *  - Zahlen: Steht eine Zahl im Original mehrmals und ändert der Vorschlag nur einen Teil der
 *    Stellen, entsteht eine Warnung (kein Verwerfen) — z. B. Lohn 650 an drei Stellen, 700 an einer.
 *
 * Reine Funktionen: kein Netz, kein Dateisystem.
 */

/** Alle Zeichenketten eines Werts, mit Pfad. */
export function texteVon(wert: unknown, pfad = ''): { pfad: string; text: string }[] {
  if (typeof wert === 'string') return [{ pfad, text: wert }]
  if (Array.isArray(wert)) return wert.flatMap((v, i) => texteVon(v, `${pfad}[${i}]`))
  if (wert && typeof wert === 'object') {
    return Object.entries(wert as Record<string, unknown>).flatMap(([k, v]) => texteVon(v, pfad ? `${pfad}.${k}` : k))
  }
  return []
}

// --- Du-Anrede ----------------------------------------------------------------------------
const ZITAT = /«[^»]*»|„[^“”]*[“”]|"[^"]*"|‹[^›]*›|“[^”]*”/g
const DU_FORM = /(?<!\p{L})(du|dich|dir|dein|deine|deinen|deinem|deiner|deines|euch|euer|eure|euren|eurem|eurer|eures)(?!\p{L})/giu

/** Du-Formen ausserhalb von Anführungszeichen, klein geschrieben, ohne Doppel. */
export function duFormen(text: string): string[] {
  const ohneZitat = text.replace(ZITAT, ' ')
  return [...new Set([...ohneZitat.matchAll(DU_FORM)].map((m) => m[1].toLowerCase()))]
}

/** Gesprächszüge eines Beispielbilds (`wechsel[n].text`) sind wörtliche Rede — dort darf geduzt werden. */
const DIALOG = /(^|\.)wechsel\[\d+\]/

/** Du-Formen in allen Texten eines Werts, ohne Zitate und Gesprächszüge. */
export function duFormenIn(wert: unknown): string[] {
  return [...new Set(texteVon(wert).filter((t) => !DIALOG.test(t.pfad)).flatMap((t) => duFormen(t.text)))]
}

/**
 * Grund zum Verwerfen, oder `null`. Geprüft wird pro Feld: Duzt das Original dieses Felds
 * schon (z. B. eine Rollenspiel-Lösung), bleibt «du» erlaubt.
 */
export function pruefeAnrede(wert: unknown, original: unknown): string | null {
  if (duFormenIn(original).length) return null
  const formen = duFormenIn(wert)
  return formen.length ? `Du-Anrede («${formen.join('», «')}») — die Einheit spricht die Lernenden mit «Sie» an` : null
}

// --- Zahlen ------------------------------------------------------------------------------
// Mindestens drei Ziffern oder mit Tausender-/Dezimaltrennzeichen: Beträge, Mengen, Jahre.
// Kurze Zahlen (Schrittnummern, «2 Seiten») sind zu häufig für eine sinnvolle Warnung.
// Daten und Nummern wie «14.11.2026» oder «1.3.1» fallen weg (Nachbar ist «.Ziffer»).
const ZAHL = /(?<![\p{L}\d]|\d[.,])(\d{1,3}(?:['’]\d{3})+|\d{3,}|\d+[.,]\d+)(?![\p{L}\d]|[.,]\d)/gu
const norm = (z: string) => z.replace(/['’]/g, '')

/** Zahl → Pfade (eine Zeile pro Vorkommen). */
export function zahlenVon(roh: unknown): Map<string, string[]> {
  const m = new Map<string, string[]>()
  for (const t of texteVon(roh)) {
    for (const z of t.text.matchAll(ZAHL)) {
      const n = norm(z[1])
      m.set(n, [...(m.get(n) ?? []), t.pfad])
    }
  }
  return m
}

/** Eine Zahl, die nach dem Vorschlag nur noch an einem Teil ihrer Stellen steht. */
export interface ZahlWarnung { zahl: string; vorher: number; nachher: number; pfade: string[] }

/**
 * Zahlen, die vor dem Vorschlag mindestens zweimal stehen und danach nur noch an einem Teil
 * der Stellen. Verschwindet eine Zahl ganz, wurde sie überall geändert — keine Warnung.
 * `pfade`: wo die alte Zahl noch steht (höchstens drei).
 */
export function zahlenWarnungen(vorher: unknown, nachher: unknown): ZahlWarnung[] {
  const vor = zahlenVon(vorher)
  const nach = zahlenVon(nachher)
  const out: ZahlWarnung[] = []
  for (const [zahl, stellen] of vor) {
    if (stellen.length < 2) continue
    const bleibt = nach.get(zahl) ?? []
    if (bleibt.length === 0 || bleibt.length >= stellen.length) continue
    out.push({ zahl, vorher: stellen.length, nachher: bleibt.length, pfade: [...new Set(bleibt)].slice(0, 3) })
  }
  return out
}
