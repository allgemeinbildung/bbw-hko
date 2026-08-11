// Lehrgang-Handling für Einheiten — zwei bewusst getrennte Ebenen:
//
//  • `lehrgang` (Singular; in herausforderung_*.json und set.json) ist der
//    KANONISCHE Lehrgang einer Einheit. Er entscheidet, aus welchem nRLP-Datensatz
//    Kompetenz- und Lebensbezugstexte aufgelöst werden (kompetenz-text.ts,
//    sprachfoerderung.ts, scripts/sync-einheiten-nrlp.mjs) und ob EBA-Rendering
//    greift (DocS, DocKnS, kn-typ-labels). Er bleibt immer einwertig.
//
//  • `lehrgaenge` (Plural; optional in set.json) listet ALLE Lehrgänge, für die
//    die Einheit gültig ist. Wird ausschliesslich für Katalog-Filter und Anzeige
//    verwendet. Fehlt das Feld, gilt `[lehrgang]`.
//
// Mehrfachgültigkeit ist nur zulässig, wenn jede abgedeckte Kompetenz in allen
// genannten Datensätzen unter DERSELBEN Nummer mit DEMSELBEN Text steht — etwa
// 1.1.1 und 1.2.2, die in nrlp_3j.json und nrlp_4j.json identisch sind.
// Gegenbeispiel: 3J 3.1.1 liegt im 4J unter 1.3.1 und ist zusätzlich umformuliert;
// solche Einheiten dürfen NICHT doppelt getaggt werden. Geprüft wird das bei jedem
// Build von `scripts/sync-einheiten-nrlp.mjs` (mit `--check` bricht es ab).

/** Kanonische Reihenfolge für Anzeige und Filter-Dropdowns. */
export const LEHRGANG_ORDER = ['EFZ_3J', 'EFZ_4J', 'EBA_2J'] as const

export const LEHRGANG_LABEL: Record<string, string> = {
  EFZ_3J: 'EFZ 3-jährig',
  EFZ_4J: 'EFZ 4-jährig',
  EBA_2J: 'EBA 2-jährig',
}

/** Kompaktform für Chips auf Katalogkarten. */
const LEHRGANG_SHORT: Record<string, string> = {
  EFZ_3J: '3J',
  EFZ_4J: '4J',
  EBA_2J: 'EBA',
}

export function lehrgangLabel(code: string): string {
  return LEHRGANG_LABEL[code] ?? code
}

export function lehrgangShort(code: string): string {
  return LEHRGANG_SHORT[code] ?? code
}

export function isEbaLehrgang(code: string | null | undefined): boolean {
  return (code ?? '').toUpperCase().startsWith('EBA')
}

/**
 * Alle Lehrgänge, für die eine Einheit gültig ist. Fällt auf den kanonischen
 * `lehrgang` zurück, solange ein Index noch ohne `lehrgaenge` gebaut wurde.
 */
export function lehrgaengeOf(e: { lehrgang: string; lehrgaenge?: string[] }): string[] {
  return e.lehrgaenge?.length ? e.lehrgaenge : [e.lehrgang]
}

/** Sortiert nach LEHRGANG_ORDER; Unbekanntes hinten, alphabetisch. */
export function sortLehrgaenge(list: string[]): string[] {
  const rank = (l: string) => {
    const i = (LEHRGANG_ORDER as readonly string[]).indexOf(l)
    return i === -1 ? LEHRGANG_ORDER.length : i
  }
  return [...list].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}
