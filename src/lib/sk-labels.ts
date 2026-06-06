/**
 * Maps short SK labels (stored in materials.schluesselkompetenzen[] and shown
 * in dropdowns/chips) to the full Bildungsrat sentence (shown on hover).
 *
 * Source: themen[].schluesselkompetenzen in public/nrlp_3j.json + nrlp_4j.json.
 * Two entries (Anpassung, Mehrdeutigkeit) belong to Themen 4/5/7 which are
 * still skizze-only — fill in once those Themen are finalised.
 */
export const skFullName: Record<string, string> = {
  'Quellen unterscheiden':
    'Zwischen relevanten und irrelevanten Quellen und Inhalten unterscheiden',
  'Ziele setzen und anpassen':
    'Sich selbst Ziele setzen, die Zielsetzung überprüfen und sich adaptiv verhalten',
  'Innovation und Problemlösung':
    'Antizipative, unternehmerische und innovative Wege der Problemlösung erkennen, entwickeln und umsetzen',
  'Teamarbeit':
    'In unterschiedlichen Teams zielgerichtet und effizient arbeiten',
  'Werthaltungen reflektieren':
    'Die eigenen Werthaltungen und Überzeugungen erkennen, verstehen, kritisch reflektieren und weiterentwickeln',
  'Standpunkte begründen':
    'Ihre eigenen Standpunkte begründen und andere davon überzeugen',
  'Verständnis fördern':
    'Unterschiedliche Standpunkte nachvollziehen und das gegenseitige Verständnis fördern',
  'Lebensphasen planen':
    'Ihre Lebensphasen planen und mit Unwägbarkeiten umgehen',
  'Nachhaltigkeit':
    'Vernetzt und systemisch denken, um sozial, ökologisch und ökonomisch nachhaltig zu handeln',
  'Anpassung': '',
  'Mehrdeutigkeit': '',
  'Partizipation':
    'An gesellschaftlichen Prozessen partizipieren und Handlungsspielräume nutzen',
}

export function skTooltip(short: string): string {
  return skFullName[short] || short
}

/**
 * Maps the numeric SK id (1–12, the order of nrlp zirkularitaet.schluesselkompetenzen[])
 * to its short Bildungsrat label. Situation JSONs store SK as numbers (sk:[1,6,11]).
 */
export const skShortByNr: Record<number, string> = {
  1: 'Quellen unterscheiden',
  2: 'Ziele setzen und anpassen',
  3: 'Innovation und Problemlösung',
  4: 'Teamarbeit',
  5: 'Werthaltungen reflektieren',
  6: 'Standpunkte begründen',
  7: 'Verständnis fördern',
  8: 'Lebensphasen planen',
  9: 'Nachhaltigkeit',
  10: 'Anpassung',
  11: 'Mehrdeutigkeit',
  12: 'Partizipation',
}

export function skNameByNr(n: number): string {
  return skShortByNr[n] || `SK ${n}`
}
