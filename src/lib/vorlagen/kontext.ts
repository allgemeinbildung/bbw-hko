// kontext.ts — was eine Vorlage über den gewählten Lehrplan-Ort weiss.
//
// Die Vorlagen sind *vorbefüllt*: die Lehrperson wählt Lehrgang → Thema →
// Lebensbezug → Kompetenz(en), und daraus wird alles abgeleitet, was der nRLP
// an dieser Stelle ohnehin schon sagt (Kompetenzversprechen, Aspekte,
// Sprachmodi, Schlüsselkompetenzen). Dieselbe Kaskade wie in IntakeForm.astro —
// bewusst dieselben Feldnamen, damit ein ausgefülltes Word-Dokument sich später
// ohne Übersetzung ins Einreichen-Formular tippen lässt.
//
// Die Auswahl ist überall optional. Ohne Auswahl entsteht eine leere,
// lehrplanfreie Vorlage — siehe `terminologie: 'neutral'` in ./wortschatz.
//
// Diese Datei importiert bewusst KEINE nRLP-JSONs: sie laeuft auch im Browser,
// und die drei Datensaetze zusammen sind ~355 KB. Den Auszug liefert
// ./nrlp-auszug.ts (nur serverseitig), die Seite schreibt ihn in ein
// <script type="application/json">.

import type { Lehrdauer } from '../nrlp'

/**
 * Der Ausschnitt des nRLP, den die Vorlagen brauchen — feldgleich zum echten
 * Datensatz, nur ohne alles Übrige. `buildKontext` arbeitet auf beidem: auf dem
 * Server auf dem vollen `getNrlp()`-Datensatz, im Browser auf diesem Auszug,
 * den `vorlagenBaum()` in die Seite schreibt. So gibt es eine Auflöse-Funktion
 * statt zweier, die auseinanderlaufen können.
 */
export interface NrlpAuszug {
  themen: any[]
}

export interface VorlagenAuswahl {
  lehrgang?: Lehrdauer | null
  themaNr?: number | null
  lebensbezugNr?: string | null
  kompetenzNrs?: string[]
}

export interface KompetenzRef {
  nr: string
  text: string
}

export interface LabeledRef {
  label: string
  detail: string
}

export interface VorlagenKontext {
  lehrgang: Lehrdauer | null
  lehrgangLabel: string | null
  themaNr: number | null
  themaTitel: string | null
  lebensbezugNr: string | null
  lebensbezugText: string | null
  kompetenzen: KompetenzRef[]
  /** Union der gesellschaftlichen Inhalte über alle gewählten Kompetenzen. */
  aspekte: LabeledRef[]
  /** Union der Sprachmodi über alle gewählten Kompetenzen. */
  sprachmodi: LabeledRef[]
  /** Schlüsselkompetenzen — im nRLP nur auf Thema-Ebene, als volle Sätze. */
  schluesselkompetenzen: string[]
  /** Vorschlag für das «Ich kann …» — der Klartext der ersten Kompetenz. */
  kompetenzversprechen: string | null
  /** Kurzform für Kopfzeile und Dateiname, z. B. «1.1.1» oder «T3». */
  code: string | null
}

export const LEHRGANG_LABEL: Record<Lehrdauer, string> = {
  'EFZ-3J': 'EFZ 3-jährig',
  'EFZ-4J': 'EFZ 4-jährig',
  'EBA': 'EBA 2-jährig',
}

export const LEERER_KONTEXT: VorlagenKontext = {
  lehrgang: null, lehrgangLabel: null,
  themaNr: null, themaTitel: null,
  lebensbezugNr: null, lebensbezugText: null,
  kompetenzen: [], aspekte: [], sprachmodi: [], schluesselkompetenzen: [],
  kompetenzversprechen: null, code: null,
}

/** Union über eine Liste von {label, detail}-Paaren; erstes Auftreten gewinnt. */
function unite(all: LabeledRef[]): LabeledRef[] {
  const seen = new Map<string, LabeledRef>()
  for (const e of all) {
    if (!e.label) continue
    const prev = seen.get(e.label)
    if (!prev) seen.set(e.label, { label: e.label, detail: e.detail || '' })
    else if (e.detail && !prev.detail.includes(e.detail)) prev.detail = [prev.detail, e.detail].filter(Boolean).join(' · ')
  }
  return [...seen.values()]
}

/**
 * Löst eine Auswahl gegen den passenden nRLP-Datensatz auf. Unvollständige
 * Auswahlen sind erlaubt: was fehlt, bleibt null/leer — die Vorlage lässt an
 * dieser Stelle dann einfach eine Schreiblinie stehen.
 */
export function buildKontext(sel: VorlagenAuswahl, auszug: NrlpAuszug | null): VorlagenKontext {
  const lehrgang = (sel.lehrgang || null) as Lehrdauer | null
  if (!lehrgang) return LEERER_KONTEXT

  const ds = auszug
  if (!ds) return { ...LEERER_KONTEXT, lehrgang, lehrgangLabel: LEHRGANG_LABEL[lehrgang] ?? lehrgang }

  const thema = (ds.themen as any[]).find((t) => t.nr === sel.themaNr) || null
  const lb = thema?.lebensbezuege?.find((l: any) => l.nr === sel.lebensbezugNr) || null
  const wanted = new Set(sel.kompetenzNrs || [])
  const komps: any[] = (lb?.kompetenzen || []).filter((k: any) => wanted.has(k.nr))

  const kompetenzen: KompetenzRef[] = komps.map((k) => ({ nr: k.nr, text: k.text || '' }))

  const aspekte = unite(komps.flatMap((k) =>
    (k.gesellschaftliche_inhalte || []).map((g: any) => ({ label: g.aspekt || '', detail: g.detail || '' })),
  ))
  const sprachmodi = unite(komps.flatMap((k) =>
    (k.sprachmodi || []).map((s: any) => ({ label: s.modus || '', detail: s.detail || '' })),
  ))

  const code = kompetenzen[0]?.nr || lb?.nr || (thema ? `T${thema.nr}` : null)

  return {
    lehrgang,
    lehrgangLabel: LEHRGANG_LABEL[lehrgang] ?? lehrgang,
    themaNr: thema?.nr ?? null,
    themaTitel: thema?.titel ?? null,
    lebensbezugNr: lb?.nr ?? null,
    lebensbezugText: lb?.text ?? null,
    kompetenzen,
    aspekte,
    sprachmodi,
    schluesselkompetenzen: (thema?.schluesselkompetenzen || []) as string[],
    kompetenzversprechen: kompetenzen[0]?.text || null,
    code,
  }
}

/** Dateiname-Baustein: «1-1-1» / «t3» / «vorlage». */
export function kontextSlug(k: VorlagenKontext): string {
  if (!k.code) return 'vorlage'
  return k.code.replace(/\./g, '-').toLowerCase()
}
