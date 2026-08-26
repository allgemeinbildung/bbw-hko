/**
 * Rubrik-Skala des Kompetenznachweises — eine einzige Quelle der Wahrheit.
 *
 * Die Skala ist **0–3 Punkte**, nicht 1–4 Stufen (Kernteam-1-Entscheid, Pascal
 * Rusch / Patrizia, 2026-08). Vier Bänder, deren tiefstes 0 Punkte gibt: dort ist
 * nichts Wesentliches der geforderten Kompetenz beobachtbar, und dafür gibt es
 * keinen Punkt. Damit deckt sich die KN-Rubrik mit den nRLP-Gütestufen und mit
 * den Kompetenzrastern unter `/umsetzungsbeispiele`, die schon immer 0–3 zeigen.
 *
 * Das Datenmodell bleibt unberührt: `rubrik_shared.kriterien[].stufen[]` ist ein
 * Array, sein Index **ist** die Punktzahl. Hier stehen nur die Beschriftungen.
 * Wer die Skala ändern will, ändert sie hier — und nirgends sonst.
 */

/** Spaltenköpfe des Rubrik-Grids, Index = Punktzahl. */
export const RUBRIK_PUNKTE_LABELS = ['0 Punkte', '1 Punkt', '2 Punkte', '3 Punkte'] as const

/** Anzahl Bänder pro Kriterium (Check 13 der Generator-Skill). */
export const RUBRIK_PUNKTE_MAX = RUBRIK_PUNKTE_LABELS.length - 1

/** Beschriftung für ein Band; fällt für unerwartete Indizes auf «N Punkte» zurück. */
export function punkteLabel(i: number): string {
  return RUBRIK_PUNKTE_LABELS[i] ?? `${i} Punkte`
}

/**
 * Das Band, das die geforderte Kompetenz erfüllt zeigt — «korrekt und
 * situationsangemessen». Referenzpunkt für Deck-Auszüge und Begleiter-Prosa.
 */
export const RUBRIK_ZIELPUNKTZAHL = 2

/** Anleitungssatz über dem Grid, in HTML und Word identisch. */
export const RUBRIK_ANKREUZ_HINWEIS =
  'Pro Kriterium die zutreffende Punktzahl ankreuzen (0–3). SuK und Ges werden getrennt aggregiert — am Schluss zwei separate Noten, niemals zu einer verschmolzen.'
