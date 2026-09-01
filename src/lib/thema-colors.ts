/**
 * nRLP Thema-Identitaetsfarben (ABU Reform 2030, Bildungsrat 2026)
 * ----------------------------------------------------------------
 * Single Source of Truth fuer die Farbe jedes Themas. Hex-Werte stammen 1:1 aus
 * den offiziellen Schullehrplan-PDFs (Pascal Rusch, 10.06.2026).
 *
 * EFZ 3-/4-jaehrig nutzen dieselbe Palette; EBA 2-jaehrig hat dieselben 8 Farben,
 * aber andere Themen + andere Zuordnung (nur T1 identisch mit EFZ, T2-T8 weichen
 * jeweils individuell ab). Farbe haengt deshalb von (Lehrgang, thema_nr) ab.
 * Zuordnung bestaetigt von Christof (01.09.2026), CI-Farbnamen "Kanton ZH".
 *
 * `ink` = WCAG-AA-konforme Textfarbe auf der Thema-Flaeche. Spiegelbild im CSS:
 * src/layouts/Base.astro (--thema-N / --thema-N-ink + data-thema, EBA via
 * data-lehrgang="EBA"). Doku: docs/thema-farben.md
 */

export interface ThemaColor {
  nr: number
  hex: string
  ink: string
  titel: string
}

/** EFZ 3-jaehrig / 4-jaehrig - identische Palette (Default). */
export const THEMA_COLORS: Record<number, ThemaColor> = {
  1: { nr: 1, hex: '#009EE0', ink: '#000000', titel: 'Ins Berufsleben einsteigen' },
  2: { nr: 2, hex: '#885EA0', ink: '#FFFFFF', titel: 'Meinungen bilden und mitgestalten' },
  3: { nr: 3, hex: '#FFCC00', ink: '#000000', titel: 'Bewusst konsumieren und handeln' },
  4: { nr: 4, hex: '#EB690B', ink: '#000000', titel: 'Verantwortung fuer mich und andere' },
  5: { nr: 5, hex: '#3EA743', ink: '#000000', titel: 'Mich im Staat orientieren' },
  6: { nr: 6, hex: '#EC008C', ink: '#000000', titel: 'Mein eigenes Zuhause' },
  7: { nr: 7, hex: '#00A1A3', ink: '#000000', titel: 'Schlussarbeit' },
  8: { nr: 8, hex: '#0076BD', ink: '#FFFFFF', titel: 'Arbeiten in der Zukunft' },
}

/** EBA 2-jaehrig - gleiche 8 ZH-Farben, andere Themen + eigene Zuordnung. Nur T1 = EFZ. */
export const THEMA_COLORS_EBA: Record<number, ThemaColor> = {
  1: { nr: 1, hex: '#009EE0', ink: '#000000', titel: 'Ins Berufsleben einsteigen' },
  2: { nr: 2, hex: '#FFCC00', ink: '#000000', titel: 'Bewusst konsumieren und handeln' },
  3: { nr: 3, hex: '#EB690B', ink: '#000000', titel: 'Sicherheit und Gesundheit' },
  4: { nr: 4, hex: '#3EA743', ink: '#000000', titel: 'Medien und digitale Welt' },
  5: { nr: 5, hex: '#885EA0', ink: '#FFFFFF', titel: 'Meinung bilden und mitgestalten' },
  6: { nr: 6, hex: '#EC008C', ink: '#000000', titel: 'Vertraege verstehen - fair handeln' },
  7: { nr: 7, hex: '#0076BD', ink: '#FFFFFF', titel: 'Arbeit und Zukunft' },
  8: { nr: 8, hex: '#00A1A3', ink: '#000000', titel: 'Kultur und Kunst' },
}

export type LehrgangKey = 'EFZ-3J' | 'EFZ-4J' | 'EBA' | string | null | undefined

function isEba(lg: LehrgangKey): boolean {
  return typeof lg === 'string' && lg.toUpperCase().includes('EBA')
}

/** Map fuer einen Lehrgang (EBA eigene Zuordnung; sonst EFZ-Default). */
export function themaPalette(lehrgang?: LehrgangKey): Record<number, ThemaColor> {
  return isEba(lehrgang) ? THEMA_COLORS_EBA : THEMA_COLORS
}

/** Thema-Farbe fuer eine Themen-Nummer (Lehrgang-abhaengig); null wenn unbekannt. */
export function themaColor(nr: number | null | undefined, lehrgang?: LehrgangKey): ThemaColor | null {
  if (nr == null) return null
  return themaPalette(lehrgang)[nr] ?? null
}

/** Hex ohne '#' (Grossbuchstaben) - fuer SheetJS/docx. */
export function themaHexBare(nr: number | null | undefined, lehrgang?: LehrgangKey): string | null {
  const c = themaColor(nr, lehrgang)
  return c ? c.hex.slice(1).toUpperCase() : null
}

/** Ink-Hex ohne '#' (Grossbuchstaben) - fuer SheetJS/docx. */
export function themaInkBare(nr: number | null | undefined, lehrgang?: LehrgangKey): string | null {
  const c = themaColor(nr, lehrgang)
  return c ? c.ink.slice(1).toUpperCase() : null
}
