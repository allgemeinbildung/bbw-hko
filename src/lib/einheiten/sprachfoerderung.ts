// Sprachförderung — Sprachmodus-Bibliothek (Cluster 3), zwei-Schichten-Modell.
//
//   Schicht 1 (hier): generischer Methoden-Kern je SM-ID (Ziel / Vorgehen / Material).
//   Schicht 2:        per-Kompetenz `detail` aus nRLP (nrlp_3j/4j.json) → wird im
//                     Renderer als "In dieser Einheit konkret:"-Zeile injiziert.
//
// Methodenvokabular ist an die nRLP-Begriffe gebunden (Lesestrategien, Markierhilfe,
// Lesestruktur, 3B-Schema, Redemittel) — nicht parallel erfinden.
// Mirror der Doku: hko-deploy/.claude/skills/.../references/sprachfoerderung-methoden.md

import { getNrlp } from '../nrlp'

export interface SprachmodusInfo {
  id: string
  bezeichnung: string   // nRLP-Bezeichnung VERBATIM (Teacher-/Datenebene)
  kurz: string          // schlichtes, schülerseitiges Label (kein Code)
  gruppe: 'Rezeption' | 'Produktion' | 'Interaktion'
  ziel: string
  schritte: string[]    // genau 3 Schritte
  material: string[]    // benannte Scaffolds
}

// Canonical SM1–SM9, Reihenfolge = nrlp zirkularitaet.sprachmodi[]
export const SPRACHMODI: SprachmodusInfo[] = [
  {
    id: 'SM1', bezeichnung: 'Rezeption mündlich', kurz: 'Hören (Zuhören)', gruppe: 'Rezeption',
    ziel: 'Gesprochene Informationen gezielt verstehen und Wesentliches festhalten.',
    schritte: [
      'Vor dem Hören zwei Leitfragen setzen.',
      'Erster Durchgang global hören, zweiter Durchgang mit Notizauftrag (3 Fakten).',
      'Im Plenum sichern und vergleichen.',
    ],
    material: ['Leitfragen', 'Notizraster (3 Fakten)'],
  },
  {
    id: 'SM2', bezeichnung: 'Rezeption audiovisuell', kurz: 'Sehen & Hören', gruppe: 'Rezeption',
    ziel: 'Bild- und Tonquellen verstehen und Kernaussagen entnehmen.',
    schritte: [
      'Vor dem Sehen zwei Leitfragen setzen.',
      'Mit Stopp-Stellen sehen; nach jeder Sequenz kurz notieren.',
      'Beobachtungen im Plenum sichern.',
    ],
    material: ['Leitfragen', 'Beobachtungsraster'],
  },
  {
    id: 'SM3', bezeichnung: 'Rezeption schriftlich und bildlich', kurz: 'Lesen (Texte verstehen)', gruppe: 'Rezeption',
    ziel: 'Zentrale Aussagen aus Texten entnehmen — der dokumentierte Schwerpunkt der Sprachförderung.',
    schritte: [
      'Überfliegen: Titel, Zwischentitel und Hervorhebungen erfassen (Lesestruktur).',
      'Genaues Lesen mit Markierhilfe: Schlüsselbegriffe markieren, Randsymbole setzen.',
      'Mit eigenen Worten in 2–3 Sätzen zusammenfassen (Lesestrategien).',
    ],
    material: ['Wortliste / Fachbegriffsklärung', 'Markierhilfe (+ Randsymbole)', 'Lesegitter / Lesestruktur'],
  },
  {
    id: 'SM4', bezeichnung: 'Produktion mündlich', kurz: 'Sprechen', gruppe: 'Produktion',
    ziel: 'Eigene Aussagen mündlich klar und strukturiert formulieren.',
    schritte: [
      'Kernaussage und Begründung stichwortartig vorbereiten.',
      'Mit Redemitteln und Satzanfängen formulieren.',
      '60-Sekunden-Pitch üben und Feedback einholen.',
    ],
    material: ['Redemittel / Satzanfänge'],
  },
  {
    id: 'SM5', bezeichnung: 'Produktion schriftlich und bildlich', kurz: 'Schreiben', gruppe: 'Produktion',
    ziel: 'Sachverhalte schriftlich strukturiert und begründet darstellen.',
    schritte: [
      'Inhalt mit 3B-Schema (Behauptung – Begründung – Beleg) gliedern.',
      'Textsorten-Merkmale beachten und Entwurf schreiben.',
      'Mit Checkliste überarbeiten.',
    ],
    material: ['3B-Schema (Behauptung – Begründung – Beleg)', 'Überarbeitungs-Checkliste'],
  },
  {
    id: 'SM6', bezeichnung: 'Produktion multimedial', kurz: 'Multimedial gestalten', gruppe: 'Produktion',
    ziel: 'Inhalte in Bild, Text und Ton adressatengerecht aufbereiten.',
    schritte: [
      'Inhalt in Sinnabschnitte gliedern (Storyboard).',
      'Pro Abschnitt ein Bild und einen Kernsatz festlegen.',
      'Zusammenführen und auf Verständlichkeit prüfen.',
    ],
    material: ['Storyboard-Vorlage'],
  },
  {
    id: 'SM7', bezeichnung: 'Interaktion und Kollaboration mündlich', kurz: 'Im Gespräch aushandeln', gruppe: 'Interaktion',
    ziel: 'Im Gespräch aktiv zuhören, Bezug nehmen und gemeinsam zu Ergebnissen kommen.',
    schritte: [
      'Gesprächsrollen vergeben (Moderation, Position A/B, Beobachtung).',
      'Aktiv zuhören: erst paraphrasieren, dann antworten.',
      'Ergebnis gemeinsam festhalten.',
    ],
    material: ['Rollenkarten', 'Redemittel / Satzanfänge'],
  },
  {
    id: 'SM8', bezeichnung: 'Interaktion und Kollaboration schriftlich', kurz: 'Schriftlich aushandeln', gruppe: 'Interaktion',
    ziel: 'Schriftlich auf Beiträge anderer Bezug nehmen und gemeinsam weiterentwickeln.',
    schritte: [
      'Beitrag der/des anderen genau lesen.',
      'Antwort mit Bezugnahme formulieren („Du schreibst …, dazu …").',
      'Gemeinsames Zwischenergebnis sichern.',
    ],
    material: ['Redemittel für Bezugnahme'],
  },
  {
    id: 'SM9', bezeichnung: 'Interaktion und Kollaboration digital', kurz: 'Digital zusammenarbeiten', gruppe: 'Interaktion',
    ziel: 'In digitalen Kanälen sachlich, adressatengerecht und regelkonform zusammenarbeiten.',
    schritte: [
      'Kanal und Quellen bewusst wählen.',
      'Beiträge knapp, sachlich und adressatengerecht verfassen (Netiquette).',
      'Belege und Verweise sauber einbinden.',
    ],
    material: ['Netiquette-Regeln'],
  },
]

const BY_ID = new Map(SPRACHMODI.map((s) => [s.id, s]))
const BY_LABEL = new Map(SPRACHMODI.map((s) => [s.bezeichnung.toLowerCase(), s]))

// Konstruktive Hörverständnis-Anleitung (ersetzt den alten „aus technischen Gründen"-Hinweis).
export const HOERVERSTAENDNIS_HINWEIS =
  'Hörverstehen (SM1/SM2): Es wird kein Audio-/Videomaterial generiert. Förderung durch die Lehrperson: kurzer Input (eigenes oder bestehendes Material, z. B. SRF), 2 Leitfragen vor dem Hören, Notizauftrag (3 Fakten) beim zweiten Durchgang, Sicherung im Plenum.'

export function lookupSprachmodus(idOrLabel?: string): SprachmodusInfo | undefined {
  if (!idOrLabel) return undefined
  return BY_ID.get(idOrLabel) || BY_LABEL.get(idOrLabel.toLowerCase())
}

// Schlichtes Schüler-Label für einen Sprachmodus (id ODER bezeichnung).
export function sprachmodusKurz(idOrLabel?: string): string {
  return lookupSprachmodus(idOrLabel)?.kurz || idOrLabel || ''
}

// IDs einer Situation auflösen: explizite ids bevorzugen, sonst Labels mappen.
export function resolveSprachmodusIds(opts: { sprachmodus_ids?: string[]; sprachmodi?: string[] }): string[] {
  if (opts.sprachmodus_ids?.length) return opts.sprachmodus_ids
  return (opts.sprachmodi || [])
    .map((l) => BY_LABEL.get(l.toLowerCase())?.id)
    .filter((x): x is string => Boolean(x))
}

// Vereinigung der SM-IDs über die drei Situationen, geordnet SM1→SM9.
export function unitSprachmodusIds(sits: { nrlp?: { sprachmodus_ids?: string[]; sprachmodi?: string[] } }[]): string[] {
  const set = new Set<string>()
  for (const s of sits) for (const id of resolveSprachmodusIds(s.nrlp || {})) set.add(id)
  return SPRACHMODI.map((s) => s.id).filter((id) => set.has(id))
}

// Rezeption zuerst (Cluster-3-Schwerpunkt), sonst Reihenfolge erhalten.
export function rezeptionFirst(ids: string[]): string[] {
  return [...ids].sort((a, b) => {
    const ga = lookupSprachmodus(a)?.gruppe === 'Rezeption' ? 0 : 1
    const gb = lookupSprachmodus(b)?.gruppe === 'Rezeption' ? 0 : 1
    return ga - gb
  })
}

// lehrgang-Wert der Units ("EFZ_3J") → getNrlp-Schlüssel ("EFZ-3J").
function lehrgangKey(lehrgang?: string): string {
  switch (lehrgang) {
    case 'EFZ_4J': return 'EFZ-4J'
    case 'EBA_2J': return 'EBA'
    default: return 'EFZ-3J'
  }
}

// Schicht 2 — per-Kompetenz detail aus nRLP: Map<modus-bezeichnung, detail>.
export function kompetenzSprachmodusDetails(kompetenzNr?: string, lehrgang?: string): Map<string, string> {
  const out = new Map<string, string>()
  if (!kompetenzNr) return out
  const nrlp = getNrlp(lehrgangKey(lehrgang))
  if (!nrlp) return out
  for (const thema of nrlp.themen || []) {
    for (const lb of (thema as any).lebensbezuege || []) {
      for (const k of lb.kompetenzen || []) {
        if (k.nr === kompetenzNr) {
          for (const sm of k.sprachmodi || []) {
            if (sm?.modus && sm?.detail) out.set(sm.modus, sm.detail)
          }
        }
      }
    }
  }
  return out
}
