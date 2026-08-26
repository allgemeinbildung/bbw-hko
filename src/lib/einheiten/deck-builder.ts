// deck-builder — generates a HyperFrames slideshow deck (teacher-facing) from an
// Einheit's JSON files plus its begleiter.md. Fully derived: no per-deck handwork.
//
// Audience slides come from the JSONs. Presenter notes come from begleiter.md
// callouts, keyed by (section number x callout type). Section headings below H2 are
// NOT used for routing — 1.3.1_konsum_verantworten has no H3 structure at all, so
// anything keyed to H3 would silently produce empty notes for that unit.
//
// Scope: EFZ (3er-Set) und EBA (2er-Set) aus derselben Quelle. Der EBA-Begleiter behält
// die EFZ-Sektionsnummern (0-4, 6, 7, 8 — Sektion 5 fehlt), deshalb trägt dieselbe
// Notizen-Zuordnung beide Lehrgänge. EBA-spezifisch ist nur das `dossier.json`: es
// ersetzt dort das fehlende Lehrmittel und speist die Wissens-Anker-Unterfolien.

/* ------------------------------------------------------------------ */
/* begleiter.md parsing                                                */
/* ------------------------------------------------------------------ */

import { RUBRIK_PUNKTE_MAX, RUBRIK_ZIELPUNKTZAHL } from './rubrik-skala'

export type Callout = { type: string; title: string; body: string }
export type MdTable = { head: string[]; rows: string[][] }
export type Section = { n: number; heading: string; callouts: Callout[]; tables: MdTable[] }

/** Markdown inline -> plain text (notes are rendered in a plain <textarea>). */
function stripInline(s: string): string {
  return String(s)
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1$2')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim()
}

const isSeparatorRow = (cells: string[]) => cells.every((c) => /^:?-{2,}:?$/.test(c.trim()))

export function parseBegleiterSections(raw: string): Section[] {
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  const lines = body.split(/\r?\n/)
  const sections: Section[] = []
  let cur: Section | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Two heading dialects in the corpus: "## 3. Herausforderung A — …" (EFZ)
    // and "## Sektion 3 — …" (EBA). Both carry the same section semantics.
    const h2 = /^##\s+(?:Sektion\s+)?(\d+)\s*[.—:–-]?\s*(.*)$/.exec(line)
    if (h2) {
      cur = { n: Number(h2[1]), heading: stripInline(h2[2]), callouts: [], tables: [] }
      sections.push(cur)
      continue
    }
    // Ein UNNUMMERIERTES H2 beendet die laufende Sektion, statt sie fortzusetzen.
    // Die EBA-Begleiter hängen hinter Sektion 8 noch «## Sektion „Wissens-Dossier (A2)"»
    // und «## Sektion „Von der Lehrperson bereitzustellen"» an; ohne diesen Schnitt
    // landeten deren Callouts (z. B. die kantonale Kontaktstelle) in den
    // Referentennotizen des Kompetenznachweises.
    if (/^##\s+\S/.test(line)) {
      cur = null
      continue
    }
    if (!cur) continue

    // Callouts and tables may sit indented inside a list item (e.g. the variant
    // branches in 1.3.1 §6), so leading whitespace must be tolerated everywhere.
    const co = /^\s*>\s*\[!([A-Za-z_]+)\]\s*(.*)$/.exec(line)
    if (co) {
      const bodyLines: string[] = []
      let j = i + 1
      while (j < lines.length && /^\s*>/.test(lines[j])) {
        bodyLines.push(lines[j].replace(/^\s*>[ \t]?/, ''))
        j++
      }
      cur.callouts.push({
        type: co[1].toLowerCase(),
        title: stripInline(co[2]),
        body: bodyLines
          .map((l) => stripInline(l))
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim(),
      })
      i = j - 1
      continue
    }

    if (/^\s*\|/.test(line)) {
      const raw: string[][] = []
      let j = i
      while (j < lines.length && /^\s*\|/.test(lines[j])) {
        raw.push(
          lines[j]
            .replace(/^\s*\|/, '')
            .replace(/\|\s*$/, '')
            .split('|')
            .map((c) => stripInline(c))
        )
        j++
      }
      const rows = raw.filter((r) => !isSeparatorRow(r))
      if (rows.length > 1) cur.tables.push({ head: rows[0], rows: rows.slice(1) })
      i = j - 1
      continue
    }
  }
  return sections
}

const CALLOUT_LABEL: Record<string, string> = {
  coaching: 'COACHING',
  warnung: 'ACHTUNG',
  troubleshooting: 'WENN ES HAKT',
  tafelbild: 'TAFELBILD',
  mehrdeutigkeit: 'MEHRDEUTIGKEIT',
  differenzieren: 'DIFFERENZIEREN 80 / 100',
  hinweis: 'HINWEIS',
  lernziel: 'SO SIEHT GUT AUS',
  ki_einsatz: 'KI — OPTIONAL, IHR ENTSCHEID',
  erwartungshorizont: 'ERWARTUNGSHORIZONT',
}

function fmtCallout(c: Callout): string {
  const label = CALLOUT_LABEL[c.type] || c.type.toUpperCase()
  const head = c.title ? `${label} — ${c.title}` : label
  return `${head}\n${c.body}`
}

/** All callouts of the given types in a section, in document order. */
function pick(sec: Section | undefined, types: string[]): Callout[] {
  if (!sec) return []
  return sec.callouts.filter((c) => types.includes(c.type))
}

function findTable(sec: Section | undefined, headMatch: RegExp): MdTable | undefined {
  return sec?.tables.find((t) => t.head.some((h) => headMatch.test(h)))
}

function notesFrom(first: string, parts: (string | null | undefined)[]): string {
  return [first, ...parts.filter((p): p is string => !!p && p.trim().length > 0)].join('\n\n')
}

/* ------------------------------------------------------------------ */
/* deck model                                                          */
/* ------------------------------------------------------------------ */

export type Block =
  | { t: 'prose'; text: string }
  | { t: 'nums'; items: { l: string; v: string; accent?: string }[] }
  | { t: 'ask'; k: string; text: string; dark?: boolean }
  | { t: 'cards'; grid: 1 | 2; fill?: boolean; items: DeckCard[] }
  | { t: 'steps'; items: { badge: string; lead: string; note?: string; pale?: boolean; color?: string }[] }
  | { t: 'chips'; items: { text: string; dark?: boolean; color?: string }[] }
  | { t: 'quote'; text: string }
  | { t: 'mind'; zentrum: string; aeste: { titel: string; punkte: string[]; optional?: boolean }[] }
  | {
      t: 'muster'
      hinweis?: string
      abschnitte: { titel: string; zeilen: { label?: string; text: string; quelle?: string }[] }[]
    }

export type DeckCard = {
  k?: string
  text?: string
  check?: string[]
  tint?: boolean
  color?: string
  /** Letter chip (A/B/C) in front of the card label. */
  badge?: string
}

/** Accent trio driving `--acc` / `--acc-dark` / `--acc-soft` on one slide. */
export type Palette = { acc: string; dark: string; soft: string }

export type DeckSlide = {
  id: string
  accent: Palette
  /** Letter badge in the header (A/B/C) — replaces any week numbering. */
  badge?: string
  ctx: string
  src: string
  headline: string
  small?: boolean
  center?: boolean
  hero?: boolean
  lead?: string
  foot?: string
  body: Block[]
  notes: string
  /** Set on sub-slides: the id of the main-line slide they hang under. */
  branchOf?: string
}

export type Deck = { title: string; slides: DeckSlide[] }

export type DeckOptions = {
  /** Where the deck loads the BBW logo. Absolute path when served, data URI when offline. */
  logoSrc?: string
  /** Lion watermark — same asset the /einheiten catalog cards use (`.lion-bg`). */
  lionSrc?: string
}

const DEFAULT_LOGO = '/logo-bbw-doc.png'
const DEFAULT_LION = '/lion-only.svg'

export type EinheitSource = {
  set: any
  prinzip: any
  kn: any
  herausforderungen: any[] // ordered A, B, C
  begleiter: string
  /** EBA only — `dossier.json` ersetzt dort das fehlende Lehrmittel. Fehlt bei EFZ. */
  dossier?: any
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const ZAHLWORT = ['null', 'eine', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht']
const zahl = (n: number) => ZAHLWORT[n] ?? String(n)
const Zahl = (n: number) => {
  const w = zahl(n)
  return w.charAt(0).toUpperCase() + w.slice(1)
}

// Bewusste Kopie — dieses Modul bleibt importfrei. Bei Änderungen auch
// LEHRGANG_LABEL in ./lehrgang.ts nachziehen.
const LEHRGANG_LABEL: Record<string, string> = {
  EFZ_3J: 'EFZ 3-jährig',
  EFZ_4J: 'EFZ 4-jährig',
  EBA_2J: 'EBA 2-jährig',
}

const DIMENSION_LABEL: Record<string, string> = {
  SuK: 'Sprache und Kommunikation',
  Ges: 'Gesellschaft',
}

/** Brand green — used by every frame slide (Titel, Übersicht, Austausch, Transfer, KN).
 *  Austausch und Kompetenznachweis haben im Renderer keine eigene Farbe (A4Page bekommt
 *  `sit={null}` → neutrales Slate), und set.json/kn.json führen kein Farbfeld. Sie erben
 *  deshalb die Deck-Grundfarbe, statt eine dritte Farbwelt zu erfinden. */
const BRAND: Palette = { acc: '#0e6e3a', dark: '#094d28', soft: '#e8f3ec' }

/** Accent trio for a Herausforderung, straight from its JSON (`sit_farbe*`). */
function paletteOf(hf: any): Palette {
  const acc = hf?.sit_farbe || BRAND.acc
  return { acc, dark: darken(acc), soft: hf?.sit_farbe_light || BRAND.soft }
}

/** Darker variant for text on light backgrounds — the JSON only ships a *lighter* mid tone. */
function darken(hex: string, f = 0.74): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim())
  if (!m) return BRAND.dark
  const v = parseInt(m[1], 16)
  const ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => Math.round(c * f))
  return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('')
}

/** Unique source references from a Herausforderung's Leitfragen, for the header.
 *  Zwei Dialekte: EFZ verweist ins Lehrmittel ("Kap. 1.4 | S. 31-34"), EBA hat kein
 *  Lehrmittel und verweist ins eigene Dossier ("Dossier | Info-Karte A-01"). Ohne den
 *  zweiten Zweig bliebe die Kopfzeile der EBA-Leitfragen-Folie leer. */
function quellenOf(hf: any): string {
  const kap: string[] = []
  const karten: string[] = []
  for (const lf of hf.leitfragen ?? []) {
    const ref = String(lf.knoten_ref ?? '')
    // matchAll, nicht exec: ein knoten_ref kann mehrere Quellen tragen
    // ("Kap. 19.2 | S. 426-428 plus Kap. 18.1 | S. 412") — exec haette nur die erste gesehen.
    for (const m of ref.matchAll(/Kap\.\s*([\d.]+)/g)) if (!kap.includes(m[1])) kap.push(m[1])
    for (const m of ref.matchAll(/Info-Karte\s*([A-Z]-\d+)/gi)) if (!karten.includes(m[1])) karten.push(m[1])
  }
  kap.sort((a, b) => parseFloat(a) - parseFloat(b))
  if (kap.length) return 'Kap. ' + kap.join(' · ')
  if (karten.length) return 'Info-Karte ' + karten.join(' · ')
  return ''
}

/** Redaktionelle `_kommentar`-Schlüssel gehören nicht auf die Folie.
 *  `prinzip.aspekte` führt sie in den EBA-Sets — ungefiltert erschiene ein 266 Zeichen
 *  langer Fliesstext als Chip neben den zwei echten Aspekten. */
function ohneKommentare<T>(obj: Record<string, T> | null | undefined): [string, T][] {
  return Object.entries(obj ?? {}).filter(([k]) => !k.startsWith('_'))
}

/** «allen drei» trägt bei zwei Herausforderungen nicht — EBA-Sets haben nur A und B. */
const alleN = (n: number) => (n === 2 ? 'beiden' : `allen ${zahl(n)}`)
const IhreN = (n: number) => (n === 2 ? 'Ihre beiden' : `Ihre ${zahl(n)}`)

function selbstcheckOf(hf: any): string[] {
  const row = (hf.bewertungsraster ?? []).find((r: any) => /handlungsprodukt/i.test(r.produkt ?? ''))
  return row?.vollstaendig_wenn ?? []
}

/* ---- Dossier (EBA) ------------------------------------------------ */

/** «Info-Karte A-01» / «nugget_A_01» → «A-01». Die beiden Seiten des Joins schreiben
 *  denselben Code verschieden; normalisiert wird er vergleichbar. */
function nuggetCode(s: unknown): string {
  const m = /([A-Z])[-_ ]?(\d+)/i.exec(String(s ?? ''))
  return m ? `${m[1].toUpperCase()}-${m[2].padStart(2, '0')}` : ''
}

/** Die Info-Karten des Dossiers, die zu genau dieser Herausforderung gehören.
 *  Primär über `quellen_anker[].nugget_ref` (die redaktionelle Zuordnung), Fallback
 *  über `nuggets[].tag` — sonst verschwände die Folie, wenn ein Set nur den Tag pflegt. */
function nuggetsFor(dossier: any, hf: any): any[] {
  const alle: any[] = dossier?.nuggets ?? []
  if (!alle.length) return []
  const wanted = (hf.quellen_anker ?? []).map((q: any) => nuggetCode(q.nugget_ref)).filter(Boolean)
  const byAnker = wanted
    .map((c: string) => alle.find((n) => nuggetCode(n.id) === c))
    .filter(Boolean)
  if (byAnker.length) return byAnker
  return alle.filter((n) => String(n.tag ?? '').toUpperCase() === String(hf.buchstabe ?? '').toUpperCase())
}

/** Leitfragen-Nummern, für die eine Info-Karte die Grundlage liefert. */
function lfHinweis(dossier: any, hf: any, nug: any): string {
  const anker = (hf.quellen_anker ?? []).find((q: any) => nuggetCode(q.nugget_ref) === nuggetCode(nug.id))
  const lfs: number[] = anker?.fuer_leitfrage ?? nug.fuer_leitfrage ?? []
  return lfs.length ? `für LF ${lfs.join(', ')}` : ''
}

/** A2-Glossarbegriffe der übergebenen Info-Karten, dedupliziert, in Reihenfolge. */
function glossarFor(dossier: any, nuggets: any[]): string[] {
  const eintraege: any[] = dossier?.glossar ?? []
  const out: string[] = []
  for (const n of nuggets) {
    for (const ref of n.glossar_refs ?? []) {
      const g = eintraege.find((e) => e.id === ref)
      const wort = g?.begriff ?? ''
      if (wort && !out.includes(wort)) out.push(wort)
    }
  }
  return out
}

/** Sprachmodi-Scaffold des Dossiers für eine Herausforderung (A/B). */
function scaffoldFor(dossier: any, hf: any): any | undefined {
  return (dossier?.sprachmodi_scaffolds ?? []).find(
    (s: any) => String(s.tag ?? '').toUpperCase() === String(hf.buchstabe ?? '').toUpperCase()
  )
}

/* ------------------------------------------------------------------ */
/* deck assembly                                                       */
/* ------------------------------------------------------------------ */

export function buildDeck(src: EinheitSource): Deck {
  const { set, prinzip, kn, herausforderungen: hfs, dossier } = src
  const secs = parseBegleiterSections(src.begleiter)
  const sec = (n: number) => secs.find((s) => s.n === n)
  const n = hfs.length
  const slides: DeckSlide[] = []

  /* ---- 1 Titel ---- */
  // `einheit_titel` fehlt in den EBA-Sets. Deren Dossier führt den Titel aber im Kopf —
  // und der ist der richtige: `modul_titel` ist bei EBA der Themen-, nicht der
  // Einheitentitel, beide T1-Einheiten hiessen sonst gleich «Ins Berufsleben einsteigen».
  const deckTitel =
    set.einheit_titel || dossier?.kopf?.einheit_titel || set.modul_titel || prinzip.topic_slug || 'Unterrichtsdeck'
  const aspektePaare = ohneKommentare<string>(prinzip.aspekte)
  const aspekte = aspektePaare.map(([k, v]) => `${k} · ${v}`)
  slides.push({
    id: 'titel',
    accent: BRAND,
    ctx: `BBW · ABU · Thema ${String(set.thema ?? '').replace(/^T/, '')} · Kompetenz ${prinzip.kompetenz_nr}`,
    src: LEHRGANG_LABEL[set.lehrgang] ?? set.lehrgang,
    headline: deckTitel,
    hero: true,
    // Ohne `einheit_titel` fällt die Headline auf `modul_titel` zurück — dann stünde
    // derselbe Satz zweimal untereinander.
    lead: set.modul_titel === deckTitel ? undefined : set.modul_titel,
    foot: `Lebensbezug ${set.modul} · Aspekte ${aspektePaare.map(([k]) => k).join(' · ')}`,
    body: [
      {
        t: 'chips',
        items: [
          ...hfs.map((hf) => ({
            text: `Herausforderung ${hf.buchstabe} · ${hf.handlungsprodukt?.format ?? ''}`,
            dark: true,
            color: hf.sit_farbe,
          })),
          { text: 'Austausch & Transfer' },
          { text: 'Kompetenznachweis' },
        ],
      },
    ],
    notes: notesFrom(
      `Einstieg — Überblick und Durchführungs-Variante offenlegen.`,
      [
        ...pick(sec(0), ['hinweis']).map(fmtCallout),
        ...pick(sec(2), ['coaching']).map(fmtCallout),
      ]
    ),
  })

  /* ---- 2 Kompetenzversprechen ---- */
  const progression: any[] = set.konzept_progression ?? []
  slides.push({
    id: 'versprechen',
    accent: BRAND,
    ctx: 'Das Kompetenzversprechen',
    src: 'Der Massstab für alles Weitere',
    headline: 'Das können Sie am Ende dieser Einheit.',
    body: [
      { t: 'quote', text: prinzip.kern_kompetenzversprechen },
      {
        t: 'cards',
        grid: 1,
        items: hfs.map((hf, i) => ({
          k: `Herausforderung ${hf.buchstabe}`,
          badge: hf.buchstabe,
          text: progression[i]?.konzept ?? prinzip.herausforderungen?.[hf.buchstabe]?.herausforderung ?? '',
          color: hf.sit_farbe,
        })),
      },
      { t: 'chips', items: aspekte.map((a) => ({ text: a })) },
    ],
    notes: notesFrom(`Der Massstab der Einheit — ein Satz, ${zahl(n)} Bausteine.`, [
      ...pick(sec(1), ['mehrdeutigkeit', 'hinweis']).map(fmtCallout),
    ]),
  })

  /* ---- 3 Ablauf ---- */
  const phasenTable = findTable(sec(0), /Schicht|Modell/i)
  slides.push({
    id: 'ablauf',
    accent: BRAND,
    ctx: 'Übersicht',
    src: '',
    headline: `${Zahl(n)} Herausforderungen, ein Prinzip, ein Nachweis.`,
    body: [
      {
        t: 'steps',
        items: [
          ...hfs.map((hf, i) => ({
            badge: hf.buchstabe,
            lead: `Herausforderung ${hf.buchstabe} — ${hf.handlungsprodukt?.format ?? ''}`,
            note: progression[i]?.konzept ?? '',
            color: hf.sit_farbe, // Übersicht trägt die Farbwelt der Herausforderungen
          })),
          {
            badge: '→',
            lead: 'Austausch & Transfer',
            note: set.dekontextualisierungs_aufgabe?.auftrag ?? '',
            pale: true,
          },
          {
            badge: '✓',
            lead: 'Kompetenznachweis',
            note: kn.hybrid_situation?.titel ?? '',
            pale: true,
          },
        ],
      },
    ],
    notes: notesFrom('Überblick — von hinten gedacht: der Kompetenznachweis war zuerst da.', [
      phasenTable
        ? 'PHASEN-SCHICHTEN\n' + phasenTable.rows.map((r) => `· ${r.join(' — ')}`).join('\n')
        : null,
      ...pick(sec(0), ['hinweis']).map(fmtCallout),
    ]),
  })

  /* ---- per Herausforderung: Situation / Leitfragen / Produkt ---- */
  hfs.forEach((hf, i) => {
    const L = hf.buchstabe
    const pal = paletteOf(hf)
    const parentId = `${L.toLowerCase()}-situation`
    const sk: number[] = hf.nrlp?.sk ?? []
    const skLine = sk.length ? 'Schlüsselkompetenzen ' + sk.map((x) => `SK${x}`).join(' · ') : ''
    const s = sec(3 + i) // Kap. 3 = A, 4 = B, 5 = C
    const aviva = findTable(s, /AViVA/i)
    const avivaRow = (re: RegExp) => aviva?.rows.find((r) => re.test(r[0] ?? ''))
    const fahrplan = aviva
      ? 'UNTERRICHTSFAHRPLAN (AViVA — Richtwerte, keine feste Taktung)\n' +
        aviva.rows.map((r) => `· ${r[0]}: ${r[1]}${r[2] ? ` [${r[2]}]` : ''}`).join('\n')
      : null

    slides.push({
      id: parentId,
      accent: pal,
      badge: L,
      ctx: `Herausforderung ${L}${hf.emotion_tag ? ` · ${hf.emotion_tag}` : ''}`,
      src: [hf.persona?.beruf, hf.persona?.betrieb].filter(Boolean).join(' · '),
      headline: hf.titel,
      small: true,
      body: [
        { t: 'prose', text: hf.situation_text },
        // EBA-Herausforderungen führen keine Zahlen — ein leerer `nums`-Block
        // hinterliesse eine leere Kachelzeile zwischen Text und Leitfrage.
        ...((hf.zahlen_tabelle ?? []).length
          ? ([
              {
                t: 'nums',
                items: hf.zahlen_tabelle.slice(0, 4).map((z: any) => ({ l: z.label, v: z.wert })),
              },
            ] as Block[])
          : []),
        { t: 'ask', k: 'Leitfrage', text: hf.leitfrage },
      ],
      notes: notesFrom(`Herausforderung ${L} — Einstieg. Details liegen als Unterfolien darunter (↓).`, [
        avivaRow(/Ankommen/i) ? `ANKOMMEN\n${avivaRow(/Ankommen/i)![1]}` : null,
        avivaRow(/Vorwissen/i) ? `VORWISSEN\n${avivaRow(/Vorwissen/i)![1]}` : null,
        fahrplan,
        ...pick(s, ['hinweis']).map(fmtCallout),
      ]),
    })

    const blooms = (hf.leitfragen ?? []).map((l: any) => l.bloom).filter(Boolean)
    slides.push({
      id: `${L.toLowerCase()}-leitfragen`,
      accent: pal,
      badge: L,
      branchOf: parentId,
      ctx: `Herausforderung ${L} · Leitfragen`,
      src: quellenOf(hf),
      headline:
        blooms.length > 1
          ? `${Zahl(hf.leitfragen.length)} Leitfragen — von ${blooms[0]} bis ${blooms[blooms.length - 1]}.`
          : `${Zahl((hf.leitfragen ?? []).length)} Leitfragen.`,
      body: [
        {
          t: 'cards',
          grid: 1,
          items: (hf.leitfragen ?? []).map((lf: any) => ({
            k: `LF ${lf.nr} · ${lf.bloom} · ${lf.knoten_ref}`,
            text: lf.text,
          })),
        },
      ],
      notes: notesFrom(`Herausforderung ${L} — Coaching zu den Leitfragen.`, [
        ...pick(s, ['coaching', 'warnung', 'troubleshooting']).map(fmtCallout),
      ]),
    })

    // Wissens-Anker — nur EBA. Dort gibt es kein Lehrmittel: das ganze Fachwissen liegt
    // im Dossier, und die Leitfragen verweisen mit «Info-Karte A-01» dorthin. Diese Folie
    // zeigt die zugehörigen Karten im Unterricht, statt sie nur zu zitieren.
    // Aufklappbar (dieselbe `.reveal`-Mechanik wie Mindmap und Musterlösung), weil drei
    // A2-Karten am Stück ~1400 Zeichen sind — Karte für Karte lesen ist die EBA-Bewegung.
    const nuggets = dossier ? nuggetsFor(dossier, hf) : []
    if (nuggets.length) {
      const woerter = glossarFor(dossier, nuggets)
      slides.push({
        id: `${L.toLowerCase()}-wissen`,
        accent: pal,
        badge: L,
        branchOf: parentId,
        ctx: `Herausforderung ${L} · Wissen`,
        src: 'Glossar+ · Info-Karten zu dieser Herausforderung',
        headline: 'Hier steht, was Sie dafür wissen müssen.',
        small: true,
        body: [
          {
            t: 'muster',
            abschnitte: nuggets.map((nug) => ({
              titel: `Info-Karte ${nuggetCode(nug.id)} — ${nug.titel}`,
              zeilen: [
                { text: nug.inhalt, quelle: lfHinweis(dossier, hf, nug) },
                ...(nug.beispiel ? [{ label: 'Beispiel', text: nug.beispiel }] : []),
              ],
            })),
          },
          ...(woerter.length
            ? ([{ t: 'chips', items: woerter.map((w) => ({ text: w })) }] as Block[])
            : []),
        ],
        notes: notesFrom(
          `Herausforderung ${L} — Wissens-Anker aus dem Dossier. Eine Karte pro Klick.`,
          [
            'Die Lernenden haben dieselben Karten im Glossar+ vor sich. Die Folie ersetzt das Lesen nicht — sie gibt der Klasse einen gemeinsamen Takt.',
            'Die Begriffszeile unten ist der A2-Wortschatz dieser Herausforderung; die Erklärungen stehen im Glossar+.',
            // `lp_pruefen` markiert Fakten, die regional variieren (z. B. der Name der
            // kantonalen Stelle) — die einzige Stelle im Dossier, die aktiv Handarbeit verlangt.
            ...nuggets.flatMap((nug: any) =>
              (nug.fakten_anker ?? [])
                .filter((f: any) => f.lp_pruefen)
                .map((f: any) => `VOR DEM EINSATZ PRÜFEN — ${nuggetCode(nug.id)}\n${f.behauptung}\n(${f.wert})`)
            ),
            nuggets.some((nug: any) => nug.recherche?.selbst_pruefen)
              ? 'SELBST PRÜFEN — die Karten tragen je eine Kontrollaufgabe:\n' +
                nuggets
                  .filter((nug: any) => nug.recherche?.selbst_pruefen)
                  .map((nug: any) => `· ${nuggetCode(nug.id)}: ${nug.recherche.selbst_pruefen}`)
                  .join('\n')
              : null,
          ]
        ),
      })
    }

    // Lösung der Leitfragen — eigene Unterfolie, gleiche Aufklapp-Mechanik wie die
    // Musterlösung des Handlungsprodukts: pro Klick eine Leitfrage. Sie entsteht nur,
    // wo `leitfragen[].loesung` gepflegt ist (Stand: die beiden 1.1.1-Einheiten);
    // ohne Daten bleibt der Zweig wie bisher bei Leitfragen → Mindmap → Produkt.
    const lfMitLoesung = (hf.leitfragen ?? []).filter((lf: any) => lf.loesung?.zeilen?.length)
    if (lfMitLoesung.length) {
      slides.push({
        id: `${L.toLowerCase()}-leitfragen-loesung`,
        accent: pal,
        badge: L,
        branchOf: parentId,
        ctx: `Herausforderung ${L} · Lösung der Leitfragen`,
        src: 'Erst nach der eigenen Bearbeitung',
        headline: 'So sieht eine tragfähige Antwort aus.',
        small: true,
        body: [
          {
            t: 'muster',
            abschnitte: lfMitLoesung.map((lf: any) => ({
              titel: `LF ${lf.nr} · ${lf.bloom}${lf.loesung.kern ? ` — ${lf.loesung.kern}` : ''}`,
              zeilen: lf.loesung.zeilen,
            })),
          },
        ],
        notes: notesFrom(`Herausforderung ${L} — Lösung der Leitfragen. Eine Frage pro Klick aufklappen.`, [
          'Kein Wort-für-Wort-Skript, sondern der Massstab: Antworten der Lernenden dürfen abweichen, solange Quelle und eigene Verdichtung erkennbar sind.',
          'Erst die eigenen Antworten danebenlegen lassen, dann Frage für Frage abgleichen — nicht vorlesen.',
          ...pick(s, ['erwartungshorizont']).map(fmtCallout),
        ]),
      })
    }

    // Mindmap — die Äste sind die strukturierte Fassung des Tafelbilds aus dem
    // Begleiter, deshalb vollständig aus dem JSON ableitbar.
    if (hf.mindmap_zentrum && (hf.mindmap_aeste ?? []).length) {
      slides.push({
        id: `${L.toLowerCase()}-mindmap`,
        accent: pal,
        badge: L,
        branchOf: parentId,
        ctx: `Herausforderung ${L} · Mindmap`,
        src: 'Zentrum und Äste übernehmen, eigene Punkte ergänzen',
        // Das Zentrum steht im Knoten selbst — die Überschrift darf es nicht doppeln.
        // Doppelpunkt statt "zum/zur": das Genus des Produktnamens steht nirgends im JSON.
        headline: `Ihre Mindmap: ${hf.handlungsprodukt?.format ?? 'Handlungsprodukt'}`,
        small: true,
        center: true,
        body: [{ t: 'mind', zentrum: hf.mindmap_zentrum, aeste: hf.mindmap_aeste }],
        notes: notesFrom(
          `Herausforderung ${L} — Mindmap. Das ist zugleich Ihr Tafelbild.`,
          [
            'Die Äste hier sind die Soll-Lösung: Pflicht-Äste finden alle, der hell markierte Ast ist die Vertiefung für 100 %.',
            'Erst die Lernenden sammeln lassen, dann diese Folie als Abgleich zeigen — nicht umgekehrt.',
            ...pick(s, ['tafelbild']).map(fmtCallout),
          ]
        ),
      })
    }

    const check = selbstcheckOf(hf)
    slides.push({
      id: `${L.toLowerCase()}-produkt`,
      accent: pal,
      badge: L,
      branchOf: parentId,
      ctx: `Herausforderung ${L} · Handlungsprodukt`,
      src: skLine,
      headline: `Ihr Handlungsprodukt: ${hf.handlungsprodukt?.format ?? ''}`,
      small: true,
      body: [
        {
          t: 'cards',
          grid: 2,
          fill: true,
          items: [
            { k: 'Format', text: hf.handlungsprodukt?.format_detail ?? '' },
            {
              k: 'So gehen Sie vor',
              text: (hf.handlungsprodukt?.schritte ?? []).map((x: any) => x.label).join(' → '),
            },
            ...(check.length ? [{ k: 'Wann ist es fertig?', check }] : []),
            ...(hf.mehrdeutigkeit?.hint
              ? [{ k: 'Ihr Zielkonflikt', text: hf.mehrdeutigkeit.hint, tint: true }]
              : []),
          ],
        },
      ],
      notes: notesFrom(`Herausforderung ${L} — Tafelbild und Scaffolds.`, [
        ...pick(s, ['tafelbild', 'differenzieren', 'mehrdeutigkeit', 'ki_einsatz']).map(fmtCallout),
        // EBA: das Dossier führt pro Herausforderung ein Sprachmodus-Scaffold mit
        // Schritt-für-Schritt-Anleitung. Es steht im Glossar+, aber die Lehrperson
        // braucht es genau hier — beim Anmoderieren des Handlungsprodukts.
        ...(() => {
          const sc = dossier ? scaffoldFor(dossier, hf) : undefined
          if (!sc) return []
          return [
            `SPRACH-SCAFFOLD ${sc.sm_id} — ${sc.modus_label} (im Glossar+)\n` +
              (sc.so_gehst_du_vor ?? []).map((x: string) => `· ${x}`).join('\n'),
          ]
        })(),
      ]),
    })

    // Musterlösung — letzte Unterfolie, Abschnitte einzeln aufklappbar.
    const ml = hf.handlungsprodukt?.musterloesung
    if (ml?.abschnitte?.length) {
      slides.push({
        id: `${L.toLowerCase()}-muster`,
        accent: pal,
        badge: L,
        branchOf: parentId,
        ctx: `Herausforderung ${L} · Musterlösung`,
        src: 'Erst nach dem eigenen Entwurf',
        headline: `So könnte es aussehen: ${hf.handlungsprodukt?.format ?? ''}`,
        small: true,
        body: [{ t: 'muster', hinweis: ml.hinweis, abschnitte: ml.abschnitte }],
        notes: notesFrom(
          `Herausforderung ${L} — Musterlösung. Abschnittsweise aufklappen (Klick oder Leertaste).`,
          [
            ml.hinweis,
            'Nicht als Vorlage zum Abschreiben zeigen. Besser: erst den eigenen Entwurf danebenlegen lassen, dann Abschnitt für Abschnitt vergleichen — «Was haben Sie anders gelöst, und trägt Ihre Lösung auch?»',
            ...pick(s, ['erwartungshorizont']).map(fmtCallout),
          ]
        ),
      })
    }
  })

  /* ---- Austausch ---- */
  const ap = set.austausch_phase ?? {}
  slides.push({
    id: 'austausch',
    accent: BRAND,
    ctx: 'Austausch',
    src: 'Arbeitsblatt «Austausch & Transfer», Seite 1',
    headline: `Was haben ${IhreN(n)} Herausforderungen gemeinsam?`,
    center: true,
    body: [
      {
        t: 'nums',
        items: hfs.map((hf, i) => ({
          l: `Herausforderung ${hf.buchstabe}`,
          v: hf.handlungsprodukt?.format ?? '',
          accent: hf.sit_farbe,
        })),
      },
      ...(ap.einzelarbeit_plenum
        ? ([{ t: 'ask', k: 'Im Plenum', text: ap.einzelarbeit_plenum }] as Block[])
        : []),
      ...(ap.einzelauftrag
        ? ([{ t: 'ask', k: 'Einzelauftrag', text: ap.einzelauftrag, dark: true }] as Block[])
        : []),
    ],
    notes: notesFrom(`Austausch — Plenumssynthese.`, [
      ...pick(sec(6), ['coaching', 'warnung', 'hinweis']).map(fmtCallout),
      // EBA: das Dossier hält den Austausch sprachlich gestützt — ohne Satzanfänge
      // bleibt eine A2-Klasse in der Synthese stumm.
      dossier?.transfer_wissensblatt?.austausch_scaffolds
        ? 'AUSTAUSCH-SCAFFOLD (im Glossar+)\n' +
          [
            ...(dossier.transfer_wissensblatt.austausch_scaffolds.so_tauschst_du_aus ?? []).map(
              (x: string) => `· ${x}`
            ),
            ...(dossier.transfer_wissensblatt.austausch_scaffolds.satzanfaenge ?? []).map(
              (x: string) => `  ${x}`
            ),
          ].join('\n')
        : null,
    ]),
  })

  /* ---- Prinzip ---- */
  const zirk = prinzip.zirkularitaet ?? {}
  slides.push({
    id: 'prinzip',
    accent: BRAND,
    ctx: 'Das Prinzip',
    src: 'Vergleichen Sie mit Ihrem eigenen Satz',
    headline: `Das Prinzip hinter ${alleN(n)} Herausforderungen.`,
    small: true,
    center: true,
    body: [
      { t: 'quote', text: prinzip.dekontextualisierungs_anker?.anker_statement ?? '' },
      {
        t: 'cards',
        grid: 2,
        items: [
          // EBA: derselbe Anker noch einmal auf A2. Der Ankersatz oben ist die
          // Fachformulierung — diese Karte ist der Satz, den die Klasse mitnimmt.
          ...(dossier?.transfer_wissensblatt?.prinzip_in_einfach
            ? [{ k: 'In einfacher Sprache', text: dossier.transfer_wissensblatt.prinzip_in_einfach, tint: true }]
            : []),
          ...(zirk.r2_voraussicht ? [{ k: 'Kommt wieder', text: zirk.r2_voraussicht }] : []),
          ...(zirk.r3_voraussicht ? [{ k: 'Und später', text: zirk.r3_voraussicht }] : []),
        ],
      },
    ],
    notes: notesFrom(
      `Erst zeigen, NACHDEM der Klassensatz an der Wandtafel steht.`,
      [
        'Der Ankersatz darf nicht vorgegeben werden — sonst entfällt genau die Abstraktionsleistung, die der Kompetenznachweis prüft.',
        zirk.r1_aktuell || zirk.r2_voraussicht
          ? `ZIRKULARITÄT\n· Jetzt: ${zirk.r1_aktuell ?? '—'}\n· ${zirk.r2_voraussicht ?? ''}\n· ${zirk.r3_voraussicht ?? ''}`
          : null,
        dossier?.transfer_wissensblatt?.fachsystematik
          ? `FACHSYSTEMATIK (Transfer-Wissensblatt im Glossar+)\n${dossier.transfer_wissensblatt.fachsystematik}`
          : null,
      ]
    ),
  })

  /* ---- Transfer ---- */
  const da = set.dekontextualisierungs_aufgabe ?? {}
  slides.push({
    id: 'transfer',
    accent: BRAND,
    ctx: da.gewicht_prozent ? `Transfer · ${da.gewicht_prozent} % der Bewertung` : 'Transfer',
    // `abgabe` ist im JSON wochenbasiert ("Woche 3 — vor KN"); das Deck bleibt
    // wochenfrei, deshalb nur den Bezugspunkt behalten.
    src: da.abgabe ? String(da.abgabe).replace(/^\s*Woche\s*\d+\s*[—–-]\s*/i, '') : 'Arbeitsblatt Seite 2',
    headline: 'Übertragen Sie das Prinzip auf einen neuen Kontext.',
    small: true,
    center: true,
    body: [
      { t: 'ask', k: 'Ihr Auftrag', text: [da.auftrag, da.format].filter(Boolean).join(' — ') },
      ...(prinzip.dekontextualisierungs_anker?.transferfeld
        ? ([
            {
              t: 'cards',
              grid: 1,
              items: [
                { k: 'Transferfeld', text: prinzip.dekontextualisierungs_anker.transferfeld },
              ],
            },
          ] as Block[])
        : []),
    ],
    notes: notesFrom(`Transfer — Abgabe vor dem Kompetenznachweis.`, [
      ...pick(sec(7), ['lernziel', 'warnung', 'coaching', 'hinweis']).map(fmtCallout),
    ]),
  })

  /* ---- KN Hybrid-Fall ---- */
  const hyb = kn.hybrid_situation ?? {}
  const tradeoffs: string[] = hyb.aktivierte_trade_offs ?? []
  slides.push({
    id: 'kn-fall',
    accent: BRAND,
    ctx: 'Kompetenznachweis · Hybrid-Fall',
    src: [hyb.persona?.beruf, hyb.persona?.betrieb].filter(Boolean).join(' · '),
    headline: hyb.titel ?? 'Kompetenznachweis',
    small: true,
    body: [
      { t: 'prose', text: hyb.text ?? '' },
      ...(hyb.leitfrage ? ([{ t: 'ask', k: 'Leitfrage', text: hyb.leitfrage }] as Block[]) : []),
      {
        t: 'nums',
        items: [
          ...hfs.map((hf, i) => ({
            l: `Aus Herausforderung ${hf.buchstabe}`,
            v: hf.handlungsprodukt?.format ?? '',
            accent: hf.sit_farbe,
          })),
          ...(tradeoffs.length
            ? [{ l: 'Neu im Nachweis', v: `${zahl(tradeoffs.length)} Zielkonflikte gleichzeitig` }]
            : []),
        ],
      },
    ],
    notes: notesFrom(`Hybrid-Fall vorlesen lassen, nicht selbst vorlesen.`, [
      tradeoffs.length ? 'AKTIVIERTE ZIELKONFLIKTE\n' + tradeoffs.map((t) => `· ${t}`).join('\n') : null,
      ...pick(sec(8), ['hinweis']).map(fmtCallout),
    ]),
  })

  /* ---- KN Formen ---- */
  const typen: any[] = kn.kn_typen ?? []
  const kriterien: any[] = kn.rubrik_shared?.kriterien ?? []
  // Section 8 carries coaching for both the method choice and the grading. Route by a
  // small fixed lexicon so nothing is dropped; grading-flavoured callouts go to the
  // Bewertung slide, everything else stays with the method slide.
  // `stufe` bleibt im Lexikon, obwohl die Rubrik in Punkten spricht: noch nicht
  // migrierte Begleiter-Texte sollen weiterhin auf der Bewertungsfolie landen.
  const isGrading = (c: Callout) => /bewert|benot|\bnote|raster|rubrik|punkt|stufe|dimension/i.test(c.title + ' ' + c.body)
  const s8 = pick(sec(8), ['coaching', 'mehrdeutigkeit', 'warnung'])
  slides.push({
    id: 'kn-formen',
    accent: BRAND,
    ctx: 'Kompetenznachweis · Formen',
    src: `Alle ${zahl(typen.length)} prüfen dieselben ${zahl(kriterien.length)} Kriterien`,
    headline: `Der Nachweis läuft in einer von ${zahl(typen.length)} Formen.`,
    small: true,
    center: true,
    body: [
      {
        t: 'cards',
        grid: 1,
        items: typen.map((ty) => ({
          k: `${ty.label} — ${ty.format}`,
          text: (ty.ablauf ?? []).join(' '),
        })),
      },
    ],
    notes: notesFrom(`Die Lehrperson wählt die Form, nicht die einzelne Person.`, [
      ...s8.filter((c) => !isGrading(c)).map(fmtCallout),
      pick(sec(8), ['erwartungshorizont']).length
        ? 'ERWARTUNGSHORIZONT — Volltext im Begleiter, Kapitel 8:\n' +
          pick(sec(8), ['erwartungshorizont'])
            .map((c) => `· ${c.title}`)
            .join('\n')
        : null,
    ]),
  })

  /* ---- KN Bewertung ---- */
  const dims: string[] = kn.rubrik_shared?.dimensionen ?? []
  const baender: any[] = kn.rubrik_shared?.niveaubaender ?? []
  const punkteMax = (kriterien[0]?.stufen?.length ?? RUBRIK_PUNKTE_MAX + 1) - 1
  slides.push({
    id: 'kn-bewertung',
    accent: BRAND,
    ctx: `Bewertung · ${zahl(kriterien.length)} Kriterien, 0–${punkteMax} Punkte`,
    src: `Zwei getrennte Noten: ${dims.join(' und ')}`,
    headline: `Bewertet wird auf zwei Spuren — ${dims.map((d) => DIMENSION_LABEL[d] ?? d).join(', ')}.`,
    small: true,
    body: [
      {
        t: 'cards',
        grid: 2,
        items: kriterien.map((k) => ({
          k: `${k.dimension} · ${k.name}`,
          // Das Band «korrekt und situationsangemessen» — die Punktzahl, auf die Lernende zielen.
          text: k.stufen?.[RUBRIK_ZIELPUNKTZAHL] ?? '',
        })),
      },
      {
        t: 'chips',
        items: baender.map((b, i) => ({
          text: `${b.label} — ${b.definition}`,
          dark: i === baender.length - 1,
        })),
      },
    ],
    notes: notesFrom(`Zwei getrennte Noten — nie zu einer Zahl verrechnen.`, [
      ...s8.filter(isGrading).map(fmtCallout),
    ]),
  })

  return { title: deckTitel, slides }
}

/* ------------------------------------------------------------------ */
/* HTML emit                                                           */
/* ------------------------------------------------------------------ */

const SLIDE_SECONDS = 10

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/** Content-length driven size buckets — keeps long German prose inside the frame. */
function proseClass(text: string): string {
  const n = text.length
  return n > 700 ? ' f3' : n > 470 ? ' f2' : ''
}
function cardClass(items: DeckCard[]): string {
  const longest = Math.max(0, ...items.map((i) => (i.text ?? '').length + (i.check ?? []).join('').length))
  return longest > 330 ? ' f3' : longest > 210 ? ' f2' : ''
}

function renderBlock(b: Block): string {
  switch (b.t) {
    case 'prose':
      return `<div class="prose${proseClass(b.text)}">${esc(b.text)}</div>`
    case 'nums':
      return `<div class="grid${Math.min(4, b.items.length)}">${b.items
        .map(
          (i) =>
            `<div class="num"${i.accent ? ` style="border-bottom-color:${i.accent}"` : ''}><div class="l">${esc(
              i.l
            )}</div><div class="v">${esc(i.v)}</div></div>`
        )
        .join('')}</div>`
    case 'ask':
      return `<div class="ask${b.dark ? ' dark' : ''}"><div class="k">${esc(b.k)}</div><div class="t">${esc(
        b.text
      )}</div></div>`
    case 'cards': {
      const cls = cardClass(b.items)
      const inner = b.items
        .map((c) => {
          const head = c.k
            ? `<div class="krow">${c.badge ? `<span class="kbadge">${esc(c.badge)}</span>` : ''}<span class="k">${esc(
                c.k
              )}</span></div>`
            : ''
          const body = c.check
            ? `<ul>${c.check.map((x) => `<li>☐ ${esc(x)}</li>`).join('')}</ul>`
            : `<div class="t s${cls}">${esc(c.text)}</div>`
          const st = c.color ? ` style="--acc:${c.color};--acc-dark:${darken(c.color)}"` : ''
          return `<div class="card${c.tint ? ' tint' : ''}${c.check ? ' check' : ''}"${st}>${head}${body}</div>`
        })
        .join('')
      return b.grid === 2 ? `<div class="grid2${b.fill ? ' fill' : ''}">${inner}</div>` : inner
    }
    case 'steps':
      return b.items
        .map(
          (s) =>
            `<div class="step"${
              s.color ? ` style="--acc:${s.color};--acc-dark:${darken(s.color)}"` : ''
            }><div class="badge${s.pale ? ' pale' : ''}">${esc(
              s.badge
            )}</div><div class="body2"><div class="lead2">${esc(s.lead)}</div>${
              s.note ? `<div class="note">${esc(s.note)}</div>` : ''
            }</div></div>`
        )
        .join('')
    case 'chips':
      return `<div class="chips">${b.items
        .map(
          (c) =>
            `<span class="chip${c.dark ? ' dark' : ''}"${
              c.color ? ` style="--acc:${c.color};--acc-soft:${c.color}22"` : ''
            }>${esc(c.text)}</span>`
        )
        .join('')}</div>`
    case 'quote':
      return `<div class="quote">${esc(b.text)}</div>`
    case 'mind': {
      const n = b.aeste.length
      // Connectors are drawn behind the branch cards; each path runs from the centre
      // node down into the top of its column, so the fan reads as one mindmap.
      const paths = b.aeste
        .map((_, k) => {
          const x = ((k + 0.5) / n) * 100
          // Symmetric S-curve: leaves the centre straight down, arrives straight down
          // into the column. Asymmetric control points tangle under non-uniform scaling.
          return `<path class="mm-link" style="--i:${k}" d="M 50 0 C 50 50, ${x} 50, ${x} 100" vector-effect="non-scaling-stroke" />`
        })
        .join('')
      // Titel ist ein Button: im eigenständigen Deck klappt er den Ast auf. In der
      // HyperFrames-Variante (nur für `check`) bleibt alles offen sichtbar.
      const cols = b.aeste
        .map(
          (a, k) =>
            `<div class="mm-branch reveal${a.optional ? ' opt' : ''}" style="--i:${k}"><button class="mm-t" type="button" aria-expanded="false"><span>${esc(
              a.titel
            )}</span><i class="mm-x" aria-hidden="true"></i></button><div class="mm-b"><div class="mm-bi"><ul class="mm-ul">${a.punkte
              .map((p) => `<li>${esc(p)}</li>`)
              .join('')}</ul>${
              a.optional ? '<div class="mm-opt">Vertiefung für 100 %</div>' : ''
            }</div></div></div>`
        )
        .join('')
      return `<div class="mm"><div class="mm-center">${esc(b.zentrum)}</div>
        <svg class="mm-links" viewBox="0 0 100 100" preserveAspectRatio="none">${paths}</svg>
        <div class="mm-row" style="--n:${n}">${cols}</div></div>`
    }
    case 'muster': {
      // Gleiche Aufklapp-Mechanik wie die Mindmap (.reveal): Titel steht, Inhalt kommt
      // pro Klick — damit die Musterlösung nicht vor dem eigenen Entwurf sichtbar ist.
      // Der längste Abschnitt wird markiert: die HyperFrames-Kopie klappt genau ihn auf,
      // damit `check` den realistischen Worst Case eines Akkordeons prüft.
      const lens = b.abschnitte.map((a) => a.zeilen.reduce((n, z) => n + z.text.length, 0))
      const longest = lens.indexOf(Math.max(...lens))
      const secs = b.abschnitte
        .map(
          (a, k) =>
            `<div class="ms reveal${
              k === longest ? ' ms-longest' : ''
            }" style="--i:${k}"><button class="ms-t" type="button" aria-expanded="false"><span>${esc(
              a.titel
            )}</span><i class="mm-x" aria-hidden="true"></i></button><div class="mm-b"><div class="mm-bi">${a.zeilen
              .map(
                (z) =>
                  `<div class="ms-z">${z.label ? `<span class="ms-l">${esc(z.label)}</span>` : ''}<span class="ms-x">${esc(
                    z.text
                  )}</span>${z.quelle ? `<span class="ms-q">${esc(z.quelle)}</span>` : ''}</div>`
              )
              .join('')}</div></div></div>`
        )
        .join('')
      // data-accordion: immer nur ein Abschnitt offen. Sonst läuft eine vollständige
      // Musterlösung unten aus der Folie (check meldet canvas_overflow).
      // `hinweis` steht bewusst nur in den Notizen — er richtet sich an die Lehrperson.
      return `<div class="ms-group" data-accordion>${secs}</div>`
    }
  }
}

function renderSlide(s: DeckSlide, idx: number, logo = DEFAULT_LOGO): string {
  const start = idx * SLIDE_SECONDS
  const p = s.accent
  const vars = `--acc:${p.acc};--acc-dark:${p.dark};--acc-soft:${p.soft};`
  const head = `<div class="top"><div class="topl">${
    s.badge ? `<span class="wk">${esc(s.badge)}</span>` : ''
  }<span class="ctx">${esc(s.ctx)}</span>${
    s.src ? `<span class="src">${esc(s.src)}</span>` : ''
  }</div><div class="logo" role="img" aria-label="BBW"></div></div>`

  const inner = s.hero
    ? `${head}<div class="lionmark"></div><div class="hero"><h1>${esc(s.headline)}</h1>${
        s.lead ? `<div class="lead">${esc(s.lead)}</div>` : ''
      }${s.body.map(renderBlock).join('')}</div>${s.foot ? `<div class="foot">${esc(s.foot)}</div>` : ''}`
    : `${head}${s.headline ? `<h1${s.small ? ' class="sm"' : ''}>${esc(s.headline)}</h1>` : ''}<div class="body${
        s.center ? ' center' : ''
      }">${s.body.map(renderBlock).join('')}</div>`

  return `      <div id="scene-${s.id}" class="scene${s.hero ? ' titleslide' : ''}" style="${vars}" data-scene-id="${s.id}" data-scene-start="${start}" data-scene-duration="${SLIDE_SECONDS}">
        <section id="clip-${start}" class="clip" data-start="${start}" data-duration="${SLIDE_SECONDS}" data-track-index="1">
          <div class="bg"></div>
          <div class="pad">${inner}</div>
        </section>
      </div>`
}

export function renderDeckHtml(deck: Deck, opts: DeckOptions = {}): string {
  const logo = opts.logoSrc ?? DEFAULT_LOGO
  const lion = opts.lionSrc ?? DEFAULT_LION
  const total = deck.slides.length * SLIDE_SECONDS
  const manifest = {
    slides: deck.slides.map((s, i) => ({
      sceneId: s.id,
      startTime: i * SLIDE_SECONDS,
      endTime: (i + 1) * SLIDE_SECONDS,
      notes: s.notes,
    })),
  }

  return `<!doctype html>
<html lang="de" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>${esc(deck.title)} — Unterrichtsdeck</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
${DECK_CSS}
      .logo { background-image: url("${logo}") }
      .lionmark { background-image: url("${lion}") }
      /* First slide visible before any seek, so a fresh audience tab is never blank. */
      #deck-root > [data-scene-id]:first-child { opacity: 1; visibility: visible; }
      /* Musterlösung ist im echten Deck ein Akkordeon — hier nur den längsten
         Abschnitt zeigen, damit check den realistischen Worst Case misst. */
      .ms-group .ms:not(.ms-longest) .mm-b { display: none; }
    </style>
  </head>
  <body>
    <script type="application/hyperframes-slideshow+json">
${JSON.stringify(manifest, null, 2)}
    </script>

    <div
      id="deck-root"
      data-composition-id="deck"
      data-start="0"
      data-duration="${total}"
      data-label="${esc(deck.title)}"
      data-width="1920"
      data-height="1080"
      style="position: relative; width: 1920px; height: 1080px; overflow: hidden"
    >
${deck.slides.map((s, i) => renderSlide(s, i, logo)).join('\n')}
    </div>

    <script>
      // Static deck — no animation. The timeline only switches which slide is on screen
      // so the player can seek to it: one zero-duration set per scene boundary.
      window.__timelines = window.__timelines || {};
      (function () {
        var tl = gsap.timeline({ paused: true });
        var scenes = document.querySelectorAll("#deck-root > [data-scene-id]");
        for (var i = 0; i < scenes.length; i++) {
          var sc = scenes[i];
          var at = parseFloat(sc.getAttribute("data-scene-start"));
          var len = parseFloat(sc.getAttribute("data-scene-duration"));
          tl.set(sc, { autoAlpha: 1 }, at);
          tl.set(sc, { autoAlpha: 0 }, at + len);
        }
        window.__timelines["deck"] = tl;
      })();
    </script>
  </body>
</html>
`
}

const DECK_CSS = `      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #f4f6f3; }
      body { font-family: system-ui, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; }

      .scene {
        position: absolute; top: 0; left: 0; width: 1920px; height: 1080px; overflow: hidden;
        opacity: 0; visibility: hidden;
        --acc: #0e6e3a; --acc-dark: #094d28; --acc-soft: #e8f3ec;
      }
      .scene.on { opacity: 1; visibility: visible; }
      .bg { position: absolute; inset: 0; background: #f4f6f3; }
      .bg::after { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 12px; background: var(--acc); }
      .clip { position: absolute; inset: 0; }
      .pad { position: absolute; inset: 0; padding: 58px 72px 54px; display: flex; flex-direction: column; }

      .top { display: flex; justify-content: space-between; align-items: center; gap: 28px; }
      .topl { display: flex; align-items: center; gap: 16px; min-width: 0; flex-wrap: wrap; }
      .wk { flex: 0 0 auto; background: var(--acc); color: #fff; border-radius: 9px; min-width: 42px; height: 42px;
            display: inline-flex; align-items: center; justify-content: center; font-size: 25px; font-weight: 800; padding: 0 12px; }
      .ctx { font-size: 23px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--acc-dark); }
      .src { font-size: 21px; font-weight: 650; letter-spacing: .06em; text-transform: uppercase; color: #65746c; }
      .src::before { content: "· "; }
      /* Same mark as the rendered Einheiten (public/logo-bbw-doc.png, 3421x1296).
         Set once as a background so the data URI is not repeated on every slide. */
      .logo { flex: 0 0 auto; height: 46px; width: 121px; background-repeat: no-repeat; background-position: center right; background-size: contain; }
      h1 { margin-top: 24px; font-size: 62px; line-height: 1.1; letter-spacing: -.015em; color: #10201a; font-weight: 750; }
      h1.sm { font-size: 50px; }

      .body { margin-top: 26px; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 16px; }
      .body.center { justify-content: center; gap: 22px; }
      .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .grid2.fill { flex: 1; min-height: 0; grid-auto-rows: 1fr; }
      .grid1, .grid2n { display: grid; gap: 16px; }
      .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

      .card { background: #fff; border-radius: 18px; border-left: 10px solid var(--acc); padding: 18px 24px; box-shadow: 0 1px 0 rgba(16,32,26,.07); }
      .krow { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
      .kbadge { flex: 0 0 auto; width: 34px; height: 34px; border-radius: 8px; background: var(--acc); color: #fff;
        display: inline-flex; align-items: center; justify-content: center; font-size: 21px; font-weight: 800; }
      .card .k { font-size: 22px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--acc); }
      .card .t { font-size: 37px; line-height: 1.27; color: #10201a; font-weight: 500; }
      .card .t.s { font-size: 32px; line-height: 1.31; }
      .card .t.s.f2 { font-size: 28px; line-height: 1.3; }
      .card .t.s.f3 { font-size: 25px; line-height: 1.29; }
      .card.tint { background: var(--acc-soft); box-shadow: none; }
      .card.check ul { margin: 0; }
      .card.check li { list-style: none; font-size: 29px; line-height: 1.32; color: #10201a; font-weight: 500; padding-left: 40px; text-indent: -40px; margin-bottom: 6px; }

      .step { display: flex; align-items: center; gap: 22px; background: #fff; border-radius: 18px; padding: 16px 24px; box-shadow: 0 1px 0 rgba(16,32,26,.07); }
      .step .badge { flex: 0 0 144px; background: var(--acc); color: #fff; border-radius: 12px; padding: 10px; text-align: center; font-size: 26px; font-weight: 800; }
      .step .badge.pale { background: #d8e6dd; color: var(--acc-dark); }
      .step .body2 { flex: 1; min-width: 0; }
      .step .lead2 { font-size: 34px; line-height: 1.2; color: #10201a; font-weight: 650; }
      .step .note { margin-top: 4px; font-size: 27px; line-height: 1.27; color: #5c6b63; font-weight: 500; }

      .num { background: #fff; border-radius: 16px; padding: 15px 19px; border-bottom: 6px solid var(--acc); }
      .num .l { font-size: 22px; line-height: 1.25; color: #5c6b63; font-weight: 650; }
      .num .v { margin-top: 6px; font-size: 28px; line-height: 1.2; color: #10201a; font-weight: 750; }

      .prose { background: #fff; border-radius: 20px; padding: 24px 30px; font-size: 34px; line-height: 1.38; color: #172a22; font-weight: 450; border-left: 10px solid var(--acc); }
      .prose.f2 { font-size: 30px; line-height: 1.36; }
      .prose.f3 { font-size: 27px; line-height: 1.34; }

      .ask { background: var(--acc); color: #fff; border-radius: 18px; padding: 18px 26px; }
      .ask.dark { background: #10201a; }
      .ask .k { font-size: 21px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; opacity: .85; margin-bottom: 6px; }
      .ask .t { font-size: 34px; line-height: 1.24; font-weight: 600; }

      .quote { background: #10201a; color: #fff; border-radius: 22px; padding: 28px 34px; font-size: 35px; line-height: 1.34; font-weight: 500; }

      .chips { display: flex; flex-wrap: wrap; gap: 12px; }
      .chip { background: var(--acc-soft); color: var(--acc-dark); border-radius: 999px; padding: 10px 20px; font-size: 26px; font-weight: 700; }
      .chip.dark { background: var(--acc); color: #fff; }

      /* mindmap — centre node, connector fan, one column per Ast */
      .mm { width: 100%; display: flex; flex-direction: column; align-items: center; position: relative; }
      .mm-center { background: var(--acc); color: #fff; border-radius: 999px; padding: 18px 44px; font-size: 36px; font-weight: 700; text-align: center; max-width: 1200px; }
      .mm-links { width: 100%; height: 72px; flex: 0 0 72px; overflow: visible; }
      .mm-link { fill: none; stroke: var(--acc); stroke-width: 3; opacity: .45; }
      .mm-row { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 18px; width: 100%; align-items: start; }
      .mm-branch { background: #fff; border-radius: 16px; border-top: 8px solid var(--acc); padding: 20px 22px; box-shadow: 0 1px 0 rgba(16,32,26,.07); }
      .mm-branch.opt { background: var(--acc-soft); border-top-style: dashed; box-shadow: none; }
      .mm-branch .mm-t { display: flex; align-items: flex-start; gap: 12px; width: 100%; text-align: left;
        background: none; border: 0; padding: 0; font: inherit; font-size: 27px; line-height: 1.22; font-weight: 750; color: #10201a; margin-bottom: 12px; }
      .mm-x { flex: 0 0 auto; width: 26px; height: 26px; margin-top: 4px; border-radius: 6px; background: var(--acc); position: relative; }
      .mm-x::before, .mm-x::after { content: ""; position: absolute; background: #fff; border-radius: 2px; }
      .mm-x::before { left: 6px; right: 6px; top: 11.5px; height: 3px; }
      .mm-x::after { top: 6px; bottom: 6px; left: 11.5px; width: 3px; }
      .mm-branch ul { margin: 0; }
      .mm-branch li { list-style: none; font-size: 26px; line-height: 1.3; color: #33463c; font-weight: 500; padding-left: 22px; text-indent: -22px; margin-bottom: 8px; }
      .mm-branch li::before { content: "· "; color: var(--acc); font-weight: 800; }
      .mm-opt { margin-top: 10px; font-size: 19px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--acc-dark); }

      /* Musterlösung — aufklappbare Abschnitte */
      .ms-group { display: flex; flex-direction: column; gap: 14px; }
      .ms { background: #fff; border-radius: 16px; border-left: 10px solid var(--acc); padding: 16px 22px; box-shadow: 0 1px 0 rgba(16,32,26,.07); }
      .ms-t { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; background: none; border: 0; padding: 0;
        font: inherit; font-size: 26px; font-weight: 750; color: #10201a; }
      .ms-t .mm-x { margin-top: 0; }
      .ms-z { display: flex; align-items: baseline; gap: 12px; padding: 9px 0; border-top: 1px solid #eef2ef; font-size: 27px; line-height: 1.34; color: #172a22; }
      .ms-z:first-child { border-top: 0; padding-top: 14px; }
      .ms-l { flex: 0 0 190px; font-size: 21px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--acc-dark); }
      .ms-x { flex: 1; min-width: 0; }
      .ms-q { flex: 0 0 auto; font-size: 21px; font-weight: 700; color: var(--acc-dark); background: var(--acc-soft); border-radius: 8px; padding: 5px 12px; white-space: nowrap; }

      .foot { margin-top: 14px; font-size: 24px; color: #6b7c72; font-weight: 600; }
      /* Titelfolie: grösseres Logo + Löwen-Wasserzeichen wie die Katalogkarten (.lion-bg). */
      .titleslide .logo { height: 92px; width: 242px; }
      .lionmark { position: absolute; right: -30px; top: 90px; width: 640px; height: 720px;
        background-repeat: no-repeat; background-position: right center; background-size: contain;
        opacity: .05; pointer-events: none; z-index: 0; }
      .titleslide .pad > *:not(.lionmark) { position: relative; z-index: 1; }
      .hero { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 30px; }
      .hero h1 { font-size: 104px; line-height: 1.02; margin-top: 0; }
      .lead { font-size: 40px; line-height: 1.3; color: #4a5a51; font-weight: 500; max-width: 1480px; }`

/* ------------------------------------------------------------------ */
/* standalone shell (ZIP + platform route)                             */
/* ------------------------------------------------------------------ */

// The HyperFrames player hosts the composition in an iframe and reaches into its
// document. That is fine over http, but a deck opened from a downloaded ZIP runs on
// file://, where Chrome gives every file an opaque origin and that access is blocked.
// The standalone shell therefore carries its own (tiny) navigation instead: same slide
// markup, same CSS, no iframe, no dependencies — works offline by double-click.

const SHELL_CSS = `
  html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #0b1410; font-family: system-ui, "Segoe UI", Roboto, sans-serif; }
  #wrap { position: fixed; inset: 0; display: flex; }
  #stage { position: relative; flex: 1; min-width: 0; overflow: hidden; background: #0b1410; }
  #deck-root { position: absolute; top: 0; left: 0; transform-origin: 0 0; }
  #aside { flex: 0 0 30%; max-width: 620px; background: #10201a; color: #e8f3ec; display: none; flex-direction: column; border-left: 1px solid #24382e; }
  body.notes #aside { display: flex; }
  body.audience #aside, body.audience #bar { display: none !important; }
  #aside header { padding: 16px 20px 10px; border-bottom: 1px solid #24382e; }
  #aside .lbl { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #7fae93; font-weight: 700; }
  #aside h2 { font-size: 17px; line-height: 1.3; margin-top: 6px; font-weight: 650; }
  #notes { flex: 1; overflow-y: auto; padding: 16px 20px; white-space: pre-wrap; font-size: 15px; line-height: 1.52; color: #d7e6dc; }
  #notes::-webkit-scrollbar { width: 9px } #notes::-webkit-scrollbar-thumb { background: #2c4438; border-radius: 9px }
  #aside footer { padding: 12px 20px 16px; border-top: 1px solid #24382e; font-size: 13px; color: #9dbfaa; }
  #aside footer b { color: #e8f3ec; font-weight: 600; }
  #bar { position: fixed; left: 50%; transform: translateX(-50%); bottom: 16px; display: flex; align-items: center; gap: 6px;
         background: rgba(11,20,16,.92); border: 1px solid #2c4438; border-radius: 999px; padding: 6px 8px; z-index: 20; }
  body.notes #bar { left: auto; right: calc(30% + 20px); transform: none; }
  #bar button { background: transparent; border: 0; color: #cfe3d6; font: inherit; font-size: 14px; cursor: pointer; padding: 7px 12px; border-radius: 999px; }
  #bar button:hover { background: #1d3128; color: #fff; }
  #bar .cnt { color: #9dbfaa; font-size: 13px; font-variant-numeric: tabular-nums; padding: 0 6px; min-width: 62px; text-align: center; }
  #bar .sep { width: 1px; height: 20px; background: #2c4438; margin: 0 2px; }
  #bar .down { color: #8fd0a6; }
  @media print { #bar, #aside { display: none !important } }

  /* Sub-slide hint on any main slide that has a branch. */
  .hasSub::after {
    content: "↓ " attr(data-sub-label);
    position: absolute; right: 72px; bottom: 30px; z-index: 5;
    font-size: 22px; font-weight: 700; letter-spacing: .06em;
    color: var(--acc-dark); background: var(--acc-soft);
    border-radius: 999px; padding: 8px 18px;
  }

  /* Mindmap: nur die Ast-Titel stehen da, der Inhalt kommt pro Klick.
     Der Ast selbst ist klickbar, nicht nur der Titel. */
  .reveal { cursor: pointer; transition: box-shadow .15s, transform .15s; }
  .reveal:hover { box-shadow: 0 4px 14px rgba(16,32,26,.13); }
  .reveal .mm-b {
    display: grid; grid-template-rows: 0fr;
    transition: grid-template-rows .34s cubic-bezier(.2,.7,.3,1), opacity .28s;
    opacity: 0;
  }
  /* Genau EIN Grid-Kind — bei mehreren würde 1fr nur die erste Zeile aufziehen
     und der «Vertiefung»-Hinweis bliebe als eigene auto-Zeile sichtbar. */
  .reveal .mm-bi { overflow: hidden; min-height: 0; }
  .reveal.open .mm-b { grid-template-rows: 1fr; opacity: 1; }
  .reveal.open .mm-x::after { transform: scaleY(0); }        /* + wird zu − */
  .mm-x::after { transition: transform .25s ease; }
  body.audience .reveal { cursor: default; }
  @media (prefers-reduced-motion: reduce) { .reveal .mm-b { transition: none } }

  /* Mindmap build-up — runs on slide entry (.anim is re-applied each time). */
  @keyframes mmPop { from { opacity: 0; transform: scale(.86) } to { opacity: 1; transform: none } }
  @keyframes mmIn  { from { opacity: 0; transform: translateY(-16px) } to { opacity: 1; transform: none } }
  @keyframes mmDraw { from { stroke-dashoffset: 180 } to { stroke-dashoffset: 0 } }
  .mm-center, .mm-branch { opacity: 0 }
  .mm-link { stroke-dasharray: 180; stroke-dashoffset: 180 }
  .scene.anim .mm-center { animation: mmPop .42s cubic-bezier(.2,.7,.3,1) both; }
  .scene.anim .mm-link   { animation: mmDraw .5s ease-out both; animation-delay: calc(.34s + var(--i) * .13s); }
  .scene.anim .mm-branch { animation: mmIn .44s cubic-bezier(.2,.7,.3,1) both; animation-delay: calc(.46s + var(--i) * .13s); }
  @media (prefers-reduced-motion: reduce) {
    .mm-center, .mm-branch { opacity: 1 } .mm-link { stroke-dashoffset: 0 }
    .scene.anim .mm-center, .scene.anim .mm-link, .scene.anim .mm-branch { animation: none }
  }
`

export function renderStandaloneDeckHtml(deck: Deck, deckId: string, opts: DeckOptions = {}): string {
  const logo = opts.logoSrc ?? DEFAULT_LOGO
  const lion = opts.lionSrc ?? DEFAULT_LION
  const meta = deck.slides.map((s) => ({
    id: s.id,
    label: s.ctx,
    branchOf: s.branchOf ?? null,
    notes: s.notes,
  }))

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(deck.title)} — Unterrichtsdeck</title>
<style>
${DECK_CSS}
.logo { background-image: url("${logo}") }
      .lionmark { background-image: url("${lion}") }
${SHELL_CSS}
</style>
</head>
<body>
<div id="wrap">
  <div id="stage">
    <div id="deck-root">
${deck.slides.map((s, i) => renderSlide(s, i, logo)).join('\n')}
    </div>
  </div>
  <aside id="aside">
    <header><div class="lbl" id="a-lbl"></div><h2 id="a-title"></h2></header>
    <div id="notes"></div>
    <footer><span id="a-next"></span><br /><b id="a-time">00:00</b></footer>
  </aside>
</div>
<div id="bar">
  <button id="b-prev" title="Vorherige Herausforderung (←)">‹</button>
  <span class="cnt" id="b-cnt"></span>
  <button id="b-next" title="Nächste Herausforderung (→)">›</button>
  <span class="sep"></span>
  <button id="b-up" class="down" title="Eine Ebene hoch (↑)">↑</button>
  <button id="b-down" class="down" title="Details öffnen (↓)">↓</button>
  <span class="sep"></span>
  <button id="b-notes" title="Notizen (N)">Notizen</button>
  <button id="b-beam" title="Beamer-Ansicht">Beamer</button>
  <button id="b-full" title="Vollbild (F)">⛶</button>
</div>
<script>
(function () {
  var META = ${JSON.stringify(meta)};
  var DECK_ID = ${JSON.stringify(deckId)};
  var scenes = [].slice.call(document.querySelectorAll('#deck-root > [data-scene-id]'));
  var audience = /(?:\\?|&)mode=audience/.test(location.search);
  var i = 0, chan = null;

  // Two axes: → moves along the main line (Herausforderung to Herausforderung),
  // ↓ opens the sub-slides that hang under the current one. Space walks both in
  // reading order, so the deck serves as an overview and as a full presentation.
  var COLS = [];                       // [{ main: sceneIdx, subs: [sceneIdx…] }]
  META.forEach(function (m, n) {
    if (m.branchOf) { if (COLS.length) COLS[COLS.length - 1].subs.push(n); }
    else COLS.push({ main: n, subs: [] });
  });
  var pos = {};                        // sceneIdx -> { c, r }
  COLS.forEach(function (col, c) {
    pos[col.main] = { c: c, r: 0 };
    col.subs.forEach(function (s, r) { pos[s] = { c: c, r: r + 1 }; });
  });
  function at(c, r) {
    c = Math.max(0, Math.min(COLS.length - 1, c));
    var col = COLS[c];
    r = Math.max(0, Math.min(col.subs.length, r));
    return r === 0 ? col.main : col.subs[r - 1];
  }

  // Mark main slides that have sub-slides, so the audience sees there is more.
  COLS.forEach(function (col) {
    if (!col.subs.length) return;
    var el = scenes[col.main];
    el.classList.add('hasSub');
    el.setAttribute('data-sub-label', col.subs.length + ' Unterfolien');
  });

  try { chan = new BroadcastChannel('hko-deck:' + DECK_ID); } catch (e) { chan = null; }

  function fit() {
    var st = document.getElementById('stage');
    var w = st.clientWidth, h = st.clientHeight;
    var s = Math.min(w / 1920, h / 1080);
    document.getElementById('deck-root').style.transform =
      'translate(' + ((w - 1920 * s) / 2) + 'px,' + ((h - 1080 * s) / 2) + 'px) scale(' + s + ')';
  }

  function paint() {
    scenes.forEach(function (el, n) { el.classList.toggle('on', n === i); });
    // Re-trigger entry animations (mindmap build-up) every time a slide is shown.
    var cur = scenes[i];
    cur.classList.remove('anim'); void cur.offsetWidth; cur.classList.add('anim');
    var p = pos[i] || { c: 0, r: 0 };
    document.getElementById('b-cnt').textContent =
      (p.c + 1) + ' / ' + COLS.length + (p.r ? '  ·  ' + p.r + '/' + COLS[p.c].subs.length : '');
    document.getElementById('b-down').style.opacity = COLS[p.c].subs.length > p.r ? '1' : '.3';
    document.getElementById('b-up').style.opacity = p.r > 0 ? '1' : '.3';
    var m = META[i] || {}, nx = META[i + 1];
    document.getElementById('a-lbl').textContent = m.label || '';
    document.getElementById('a-title').textContent = (m.notes || '').split('\\n')[0];
    document.getElementById('notes').textContent = (m.notes || '').split('\\n').slice(1).join('\\n').trim();
    document.getElementById('a-next').textContent = nx ? 'Als Nächstes: ' + (nx.label || nx.id) : 'Letzte Folie';
  }

  function go(n, quiet) {
    i = Math.max(0, Math.min(scenes.length - 1, n));
    cursor = 0; applyCursor(true);   // eine Mindmap startet immer zugeklappt
    paint();
    if (!quiet && chan && !audience) chan.postMessage({ t: 'go', i: i });
  }

  if (chan) {
    chan.onmessage = function (e) {
      var d = e.data || {};
      if (d.t === 'go' && audience) go(d.i, true);
      if (d.t === 'cursor' && audience && d.s === i) { cursor = d.c; applyCursor(true); }
      if (d.t === 'hello' && !audience) {
        chan.postMessage({ t: 'go', i: i });
        chan.postMessage({ t: 'cursor', s: i, c: cursor });
      }
    };
    if (audience) chan.postMessage({ t: 'hello' });
  }

  function step(d) { var p = pos[i]; go(at(p.c + d, 0)); }
  function dive(d) { var p = pos[i]; go(at(p.c, p.r + d)); }

  /* ---- Mindmap / Musterlösung: ein Ast pro Klick bzw. pro Leertaste ---- */
  // Gilt für Mindmap-Äste UND Musterlösungs-Abschnitte — beide tragen .reveal.
  // cursor = Anzahl der auf dieser Folie bereits aufgedeckten Äste. Die Leertaste
  // zählt ihn hoch, statt den ersten *geschlossenen* Ast zu suchen: in einer
  // Akkordeon-Gruppe schliesst das Aufdecken den Vorgänger wieder, und die Suche
  // pendelte darum ewig zwischen Abschnitt 1 und 2, statt bis zum vierten zu laufen.
  var cursor = 0;
  function branchesOf(n) {
    return [].slice.call(scenes[n].querySelectorAll('.reveal'));
  }
  function applyCursor(quiet) {
    var last = cursor - 1;
    branchesOf(i).forEach(function (b, k) {
      // In einer Akkordeon-Gruppe (Musterlösung) bleibt nur der zuletzt aufgedeckte
      // Abschnitt offen — sonst läuft eine vollständige Lösung unten aus der Folie.
      var solo = b.closest && b.closest('[data-accordion]');
      var open = solo ? k === last : k < cursor;
      b.classList.toggle('open', open);
      var t = b.querySelector('.mm-t, .ms-t');
      if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (!quiet && chan && !audience) chan.postMessage({ t: 'cursor', s: i, c: cursor });
  }
  function setCursor(c, quiet) {
    cursor = Math.max(0, Math.min(branchesOf(i).length, c));
    applyCursor(quiet);
  }
  document.addEventListener('click', function (e) {
    if (audience) return;                     // Beamer-Fenster folgt nur
    var b = e.target.closest && e.target.closest('.reveal');
    if (!b || !scenes[i].contains(b)) return;
    var k = branchesOf(i).indexOf(b);
    setCursor(b.classList.contains('open') ? k : k + 1);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); dive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); dive(-1); }
    // Leertaste läuft in Lesereihenfolge: erst die Äste der Folie, dann weiter.
    else if (e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      if (cursor < branchesOf(i).length) setCursor(cursor + 1); else go(i + 1);
    }
    // Rückwärts spiegelbildlich: erst die Äste wieder zu, dann eine Folie zurück.
    else if (e.key === 'Backspace' || e.key === 'PageUp') {
      e.preventDefault();
      if (cursor > 0) setCursor(cursor - 1); else go(i - 1);
    }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(scenes.length - 1);
    else if (e.key === 'n' || e.key === 'N') document.body.classList.toggle('notes'), fit();
    else if (e.key === 'f' || e.key === 'F') toggleFull();
  });

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  }

  document.getElementById('b-prev').onclick = function () { step(-1); };
  document.getElementById('b-next').onclick = function () { step(1); };
  document.getElementById('b-down').onclick = function () { dive(1); };
  document.getElementById('b-up').onclick = function () { dive(-1); };
  document.getElementById('b-full').onclick = toggleFull;
  document.getElementById('b-notes').onclick = function () { document.body.classList.toggle('notes'); fit(); };
  document.getElementById('b-beam').onclick = function () {
    var u = location.pathname + (location.search ? location.search + '&' : '?') + 'mode=audience';
    window.open(u, 'hko-beamer-' + DECK_ID, 'width=1280,height=720');
    if (!document.body.classList.contains('notes')) { document.body.classList.add('notes'); fit(); }
  };

  // BroadcastChannel needs a shared origin. file:// gives every document an opaque
  // origin, so the second window would never receive anything — hide the offer instead
  // of shipping a button that silently does nothing.
  if (location.protocol === 'file:' || !chan) document.getElementById('b-beam').style.display = 'none';

  if (audience) { document.body.classList.add('audience'); }
  else { document.body.classList.add('notes'); }

  var t0 = null;
  setInterval(function () {
    if (audience) return;
    if (t0 === null) t0 = Date.now();
    var s = Math.floor((Date.now() - t0) / 1000);
    var el = document.getElementById('a-time');
    if (el) el.textContent = ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
  }, 1000);

  window.addEventListener('resize', fit);
  fit(); go(0, true);
})();
</script>
</body>
</html>
`
}

/* ------------------------------------------------------------------ */
/* entry points                                                        */
/* ------------------------------------------------------------------ */

/** Adapter for the shape `loadEinheit()` returns. Null when the unit is incomplete.
 *
 *  Kein Lehrgang-Filter mehr: EBA-Sets tragen dieselben Felder wie EFZ-Sets (nur zwei
 *  statt drei Herausforderungen, ohne Zahlen/Musterlösung) und ihr Begleiter behält die
 *  EFZ-Sektionsnummern — Sektion 5 fehlt einfach. Was fehlt, lässt `buildDeck` weg;
 *  was nur EBA hat (das Dossier), kommt hier zusätzlich herein. */
export function deckSourceFromFullSet(d: any): EinheitSource | null {
  if (!d?.set || !d?.prinzip || !d?.kn || !d?.begleiter?.raw) return null
  const hfs = [d.hf_A, d.hf_B, d.hf_C].filter(Boolean)
  if (!hfs.length) return null
  return {
    set: d.set,
    prinzip: d.prinzip,
    kn: d.kn,
    herausforderungen: hfs,
    begleiter: d.begleiter.raw,
    dossier: d.dossier ?? undefined,
  }
}

/** HyperFrames composition — used for authoring and `hyperframes check`. */
export function buildDeckHtml(src: EinheitSource, opts: DeckOptions = {}): string {
  return renderDeckHtml(buildDeck(src), opts)
}

/** Self-contained deck — served by the platform and shipped inside the ZIP. */
export function buildStandaloneDeckHtml(
  src: EinheitSource,
  deckId: string,
  opts: DeckOptions = {}
): string {
  return renderStandaloneDeckHtml(buildDeck(src), deckId, opts)
}
