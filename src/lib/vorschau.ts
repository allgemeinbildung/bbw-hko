// Vorschau neuer Einheiten: Lehrpersonen sehen das Download-Bundle einer Einheit
// online (hinter dem Login) und sagen zu den neuen Bausteinen, ob sie sie einsetzen würden.
//
// Die Dateien liegen im privaten Storage-Bucket `vorschau` unter `{setKey}/…`
// (hochgeladen mit `node scripts/upload-vorschau.mjs`), die Übersicht wird bei
// jedem Aufruf aus `buildUebersicht()` erzeugt. Dieses Modul ist rein (kein
// Server-Code), weil die Übersicht es auch im Browser für das ZIP braucht.

import type { EinheitFullSet } from './einheiten/types'

export const VORSCHAU_BUCKET = 'vorschau'

/** Rollen, die eine Vorschau öffnen und Feedback geben dürfen. */
export const VORSCHAU_ROLLEN = ['lp', 'kt1', 'reviewer'] as const

/** Ordner des Bundles, die ausgeliefert werden — alles andere ist 404. */
export const VORSCHAU_ORDNER = ['html', 'word', 'Material_LP'] as const

export const BEWERTUNGEN = [
  { key: 'einsetzen', label: 'Würde ich einsetzen' },
  { key: 'nicht', label: 'Nicht für meine Klassen' },
] as const
export type Bewertung = (typeof BEWERTUNGEN)[number]['key']

export interface VorschauFeature {
  key: string
  label: string
  frage: string
  /** Eintrag der Übersicht, in dem man den Baustein sieht (Schlüssel aus buildUebersicht). */
  ansehen: string
  /** Einführung «Was ist neu?»: was der Baustein ist und wo er steht. */
  was: string
  wo: string
  /** Ein konkretes Beispiel aus genau dieser Einheit, falls vorhanden. */
  beispiel: string | null
}

const hfs = (d: EinheitFullSet) => [d.hf_A, d.hf_B, d.hf_C].filter(Boolean) as any[]

/**
 * Nur die neuen Bausteine — zu Herausforderungen, KN und Begleiter gibt es das
 * Feedback nach dem Unterricht. `vorhanden` prüft, ob die Einheit den Baustein führt.
 */
type FeatureDef = Omit<VorschauFeature, 'beispiel'> & {
  vorhanden: (d: EinheitFullSet) => boolean
  beispiel: (d: EinheitFullSet) => string | null
}

const FEATURES: FeatureDef[] = [
  {
    key: 'scaffolding',
    label: 'Scaffolding',
    frage: 'Hilfen neben den Leitfragen: Strategien und Satzanfänge.',
    ansehen: 'hf-A-auftrag',
    was: 'Neben jeder Leitfrage steht eine schmale Spalte mit Schreibhilfen für genau diesen Denkschritt: Strategien, Satzanfänge und wofür die Antwort später im Handlungsprodukt gebraucht wird.',
    wo: 'In den Aufträgen A–C, rechts neben den Leitfragen.',
    vorhanden: (d) => hfs(d).some((hf) => (hf.leitfragen ?? []).some((lf: any) => lf.scaffolding)),
    beispiel: (d) => {
      for (const hf of hfs(d)) for (const lf of hf.leitfragen ?? []) {
        const satz = lf.scaffolding?.satzanfaenge?.[0]
        if (satz) return `Satzanfang in Herausforderung ${hf.buchstabe ?? ''}: ${satz}`.replace(/ {2,}/g, ' ')
      }
      return null
    },
  },
  {
    key: 'methodenkarten',
    label: 'Methodenkarten',
    frage: 'Methoden aus dem Lehrmittel, direkt an die Herausforderung angepasst.',
    ansehen: 'hf-A-auftrag',
    was: 'Jede Herausforderung hat eine Seite «Methoden» mit vier Werkzeugen für das Handlungsprodukt. Wo das Lehrmittel die Methode erklärt, steht das Kapitel — und dazu, was die Lernenden damit für genau diese Abgabe tun.',
    wo: 'In den Aufträgen A–C, Seite «05 · Methoden».',
    vorhanden: (d) => hfs(d).some((hf) => hf.methoden?.length),
    beispiel: (d) => {
      const m = hfs(d).flatMap((hf) => hf.methoden ?? []).find((m: any) => m?.name)
      if (!m) return null
      const quelle = m.quelle === 'lehrmittel' && m.kap ? ` (Lehrmittel Kap. ${m.kap})` : ''
      return `«${m.name}»${quelle}${m.fuer ? ` — ${m.fuer}` : ''}`
    },
  },
  {
    key: 'ki',
    label: 'KI-Toolbox',
    frage: 'KI-Aufträge, Lernprompt und Lernbegleiter — optional und formativ.',
    ansehen: 'ki-1',
    was: 'Vier optionale Dokumente: zwei KI-Aufträge, ein Lernprompt, mit dem die Lernenden prompten lernen, und ein Lernbegleiter zur Vorbereitung auf den Kompetenznachweis. Die Grundregel: Die KI prüft die Arbeit der Lernenden, sie schreibt sie nicht.',
    wo: 'In der Gruppe «KI-Toolbox». Für die Lehrperson erklärt im «Lies mich!».',
    vorhanden: (d) => !!(d.ki || d.lernprompt || d.lernbegleiter),
    beispiel: (d) => {
      const a = d.ki?.assignments?.[0]
      return a?.titel ? `KI-Auftrag 1: «${a.titel}»` : null
    },
  },
]

export const FEATURE_KEYS = FEATURES.map((f) => f.key)
export const FEATURE_LABEL: Record<string, string> = Object.fromEntries(FEATURES.map((f) => [f.key, f.label]))

export function vorschauFeatures(d: EinheitFullSet): VorschauFeature[] {
  return FEATURES.filter((f) => f.vorhanden(d)).map(({ vorhanden, beispiel, ...f }) => ({ ...f, beispiel: beispiel(d) }))
}

export interface VorschauFeedbackInput {
  bewertungen: Record<string, { wert: Bewertung }>
  kommentar: string
}

export const MAX_KOMMENTAR = 2000

/** Nur bekannte Bausteine und Werte, Kommentar gekürzt; leere Einträge fallen weg. */
export function normalizeFeedback(raw: any): VorschauFeedbackInput {
  const out: VorschauFeedbackInput = { bewertungen: {}, kommentar: '' }
  const werte = new Set<string>(BEWERTUNGEN.map((b) => b.key))
  const src = raw && typeof raw.bewertungen === 'object' && raw.bewertungen ? raw.bewertungen : {}
  for (const key of FEATURE_KEYS) {
    const wert = src[key]?.wert
    if (typeof wert === 'string' && werte.has(wert)) out.bewertungen[key] = { wert: wert as Bewertung }
  }
  out.kommentar = typeof raw?.kommentar === 'string' ? raw.kommentar.trim().slice(0, MAX_KOMMENTAR) : ''
  return out
}
