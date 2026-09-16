// wortschatz.ts — die Beschriftungen der Vorlagen, in zwei Sprachen.
//
// Der Grund für diese Datei: nicht jede Lehrperson will in HKO-Vokabular
// arbeiten. «Handlungssituation», «Kompetenzversprechen», «Handlungsprodukt»
// sind die Begriffe des nRLP und des Einreichen-Formulars — wer sie benutzt,
// bekommt ein Dokument, das sich 1:1 in /einreichen übertragen lässt. Wer ein
// schlichtes Arbeitsblatt will, wählt `neutral` und bekommt dieselbe Struktur
// unter Alltagsnamen (Ausgangslage, Auftrag, Abgabe, Rückblick).
//
// Struktur und Layout sind in beiden Fällen identisch — es wechseln nur die
// Wörter. Damit gibt es genau EINEN Vorlagen-Generator statt zwei Dateisätzen,
// und eine Layout-Korrektur wirkt automatisch für beide.
//
// Dritter Weg, den keine Software abdecken muss: die erzeugte .docx ist nicht
// gesperrt. Jede Überschrift ist normaler Text und lässt sich in Word
// umbenennen, löschen oder ergänzen.

import { RUBRIK_ANKREUZ_HINWEIS } from '../einheiten/rubrik-skala'

export type Terminologie = 'hko' | 'neutral'

export const TERMINOLOGIE_LABEL: Record<Terminologie, string> = {
  hko: 'HKO-Begriffe (nRLP)',
  neutral: 'Alltagssprache',
}

export const TERMINOLOGIE_HINWEIS: Record<Terminologie, string> = {
  hko: 'Begriffe wie im Lehrplan und im Einreichen-Formular — das ausgefüllte Dokument lässt sich später ohne Übersetzung einreichen.',
  neutral: 'Schlichtes Arbeitsblatt in Alltagssprache. Gleiche Struktur, ohne Lehrplan-Vokabular; die Taxonomie-Seite entfällt.',
}

export interface Wortschatz {
  // Dokumenttitel + Kopfzeilen-Code
  hfTitel: string
  /** Genitiv des Bogens, für Saetze wie «Kriterien aus … ableiten». */
  hfGenitiv: string
  hfCode: string
  knTitel: string
  knCode: string
  begleiterTitel: string
  begleiterCode: string
  // Abschnitte Herausforderung
  versprechen: string
  versprechenHint: string
  situation: string
  situationHint: string
  auftrag: string
  leitfragen: string
  leitfragenHint: string
  produkt: string
  produktHint: string
  arbeitsflaeche: string
  selbstcheck: string
  // Abschnitte Kompetenznachweis
  knAufgabe: string
  knFormat: string
  knRaster: string
  knSuk: string
  knGes: string
  /** Anleitungssatz über dem Raster. */
  knRasterHinweis: string
  // Verortung
  verortung: string
  taxonomie: string
  /** Ob die ausführliche Taxonomie-Seite (SK · Aspekte · Sprachmodi) mitkommt. */
  mitTaxonomie: boolean
}

const HKO: Wortschatz = {
  hfTitel: 'Herausforderung',
  hfGenitiv: 'der Herausforderung',
  hfCode: 'HERAUSFORDERUNG · VORLAGE',
  knTitel: 'Kompetenznachweis',
  knCode: 'KOMPETENZNACHWEIS · VORLAGE',
  begleiterTitel: 'Begleitdokument Lehrperson',
  begleiterCode: 'BEGLEITDOKUMENT · VORLAGE',

  versprechen: 'Kompetenzversprechen',
  versprechenHint: 'Ein Satz in der ICH-Form: «Ich kann …». Das ist der Massstab, an dem am Schluss gemessen wird.',
  situation: 'Handlungssituation',
  situationHint: 'Aus der ICH-Perspektive der lernenden Person geschrieben, konkret und mit echtem Entscheidungsdruck.',
  auftrag: 'Auftrag',
  leitfragen: 'Leitfragen',
  leitfragenHint: 'Die Fragen, die auf dem Weg zum Handlungsprodukt beantwortet sein müssen.',
  produkt: 'Handlungsprodukt',
  produktHint: 'Was am Schluss physisch vorliegt — Brief, Plan, Aufnahme, Plakat, Gespräch.',
  arbeitsflaeche: 'Arbeitsfläche',
  selbstcheck: 'Selbstcheck · Reflexion',

  knAufgabe: 'KN-Aufgabe',
  knFormat: 'KN-Format',
  knRaster: 'Bewertungsraster',
  knSuk: 'Sprache und Kommunikation (SuK)',
  knGes: 'Gesellschaft (Ges)',
  knRasterHinweis: RUBRIK_ANKREUZ_HINWEIS,

  verortung: 'Verortung im nRLP',
  taxonomie: 'Taxonomie',
  mitTaxonomie: true,
}

const NEUTRAL: Wortschatz = {
  hfTitel: 'Arbeitsblatt',
  hfGenitiv: 'des Arbeitsblatts',
  hfCode: 'ARBEITSBLATT · VORLAGE',
  knTitel: 'Leistungsnachweis',
  knCode: 'LEISTUNGSNACHWEIS · VORLAGE',
  begleiterTitel: 'Notizen zur Lektion',
  begleiterCode: 'LEKTIONSNOTIZEN · VORLAGE',

  versprechen: 'Lernziel',
  versprechenHint: 'Ein Satz: Was können die Lernenden am Schluss?',
  situation: 'Ausgangslage',
  situationHint: 'Die Situation, um die es geht — kurz und konkret.',
  auftrag: 'Auftrag',
  leitfragen: 'Fragen zum Thema',
  leitfragenHint: 'Die Fragen, die unterwegs beantwortet werden.',
  produkt: 'Abgabe',
  produktHint: 'Was am Schluss abgegeben wird.',
  arbeitsflaeche: 'Platz zum Arbeiten',
  selbstcheck: 'Rückblick',

  knAufgabe: 'Aufgabe',
  knFormat: 'Prüfungsform',
  knRaster: 'Bewertungsraster',
  knSuk: 'Sprache',
  knGes: 'Inhalt',
  knRasterHinweis: 'Pro Kriterium die zutreffende Punktzahl ankreuzen (0–3). Sprache und Inhalt werden getrennt gezählt — am Schluss zwei separate Noten, niemals zu einer verschmolzen.',

  verortung: 'Einordnung',
  taxonomie: 'Einordnung',
  mitTaxonomie: false,
}

export function wortschatz(t: Terminologie): Wortschatz {
  return t === 'neutral' ? NEUTRAL : HKO
}
