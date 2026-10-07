import type { KiAssignment, LernpromptTechnik, LernbegleiterStrategie } from './types'

// Geteilte Lese-Helfer für die drei KI-Toolbox-Dokumente (Vorschau/HTML in
// `components/einheiten/docs/Doc{Ki,Lernprompt,Lernbegleiter}.tsx`, Word in
// `docx-builder.ts`). Alles hier ist aus den Daten abgeleitet — kein Feld kommt
// dazu. «Basis-Form» heisst: die kleine Fassung, die die Skill `hko-ki-komplement`
// seit E40 als Vorgabe schreibt (wenige Schritte, fertige Prompts, keine
// fortgeschrittene Variante). Bestandseinheiten in voller Dichte erfüllen keine
// der drei Bedingungen und behalten darum Seitenfolge und Umbruch.

/**
 * Toolbox im neuen Zuschnitt (Dateistand ab 2.x). Nur für sie gelten der Umbruch
 * der Basis-Form und die Zusätze aus E42 (Begriffe, Beispiel-Verlauf, Notizfelder
 * unter den Prompts). Jede Toolbox mit Dateistand 1.x behält Seitenfolge und Inhalt.
 */
export function istNeueFassung(doc: { version?: string } | null | undefined): boolean {
  return parseInt(String(doc?.version ?? '1'), 10) >= 2
}

/** Auftrag in Basis-Form → zwei statt drei Seiten. */
export function istBasisAuftrag(a: KiAssignment | undefined): boolean {
  if (!a) return false
  return (a.schritte?.length ?? 0) <= 3
    && (a.reflexion?.length ?? 0) <= 2
    && (a.prompt_strategie?.length ?? 0) <= 3
    && (a.auftrag?.length ?? 0) <= 320
}

/** Technik-Karte in Basis-Form: ein fertiger Prompt, kein Baukasten. */
export function istBasisTechnik(t: LernpromptTechnik | undefined): boolean {
  return !!t && !t.beispiel_fortgeschritten && !t.baukasten
}

/** Strategie-Karte in Basis-Form: nur der fertige Prompt. */
export function istBasisKarte(s: LernbegleiterStrategie | undefined): boolean {
  return !!s && !s.prompt_fortgeschritten
}

/**
 * Eine Zeile aus `prompt_strategie`, die mit einem zitierten Prompt endet
 * («Prompt 1: «Du bist …»»), zerlegt in Vorspann und Prompt — damit der Prompt
 * wie in den anderen zwei Dokumenten in einem Kasten zum Abschreiben steht.
 * Jede andere Zeile (Hinweis ohne Zitat, Zitat mitten im Satz) bleibt Fliesstext.
 */
export function promptZeile(s: string): { vor: string; prompt: string } | null {
  const m = /^([^«»]*?):\s*«([\s\S]+)»\.?\s*$/.exec(s.trim())
  if (!m || m[2].includes('«')) return null
  return { vor: m[1].trim(), prompt: m[2].trim() }
}

/** «SK6 — Standpunkte begründen» → «Standpunkte begründen». */
export function skName(s: string): string {
  const i = s.indexOf(' — ')
  return i > -1 ? s.slice(i + 3) : s
}

const DIMENSION_LABEL: Record<string, string> = {
  SuK: 'Sprache und Kommunikation',
  Ges: 'Gesellschaft',
}
/** Rubrik-Dimension im Klartext; unbekannte Werte bleiben, wie sie sind. */
export function dimensionLabel(d: string | undefined): string {
  return (d && DIMENSION_LABEL[d]) || d || ''
}

// «Mini Case schriftlich» und «Werkschau + Transfer-Reflexion» sind Namen der
// KN-Formen für Lehrpersonen. In den Dokumenten der Toolbox, die Lernende lesen,
// steht stattdessen, was sie dort tun. `kn_typ_tracks[].label` bleibt in den Daten
// wörtlich wie in `kn.json` (Vertrag); gedruckt wird diese Fassung.
const KN_TYP_LERNENDE: Record<string, string> = {
  fachgespraech: 'Fachgespräch',
  mini_case_schriftlich: 'Schriftliche Aufgabe zu einem neuen Fall',
  werkschau_transfer: 'Eigene Arbeiten zeigen und erklären',
}
/** Name einer KN-Form für Lernende; unbekannte Formen fallen auf das Label zurück. */
export function knTypFuerLernende(typ: string | undefined, label: string | undefined, lehrgang?: string): string {
  if (typ === 'fachgespraech' && lehrgang === 'EBA_2J') return 'Kurzgespräch'
  return (typ && KN_TYP_LERNENDE[typ]) || label || typ || ''
}

/** Alle gesetzten KI-Leitfragen in fester Reihenfolge, ohne ihre Etiketten. */
export function leitfragenListe(lf: { offen?: string; kritisch?: string; vergleichend?: string; urteilend?: string } | undefined): string[] {
  if (!lf) return []
  return [lf.offen, lf.kritisch, lf.vergleichend, lf.urteilend].filter((x): x is string => !!x)
}
