// deck-v42 — Unterrichtsdeck für Einheiten im Format v4.2 (ENTSCHEIDE E29).
//
// Das alte Deck (deck-builder.ts → buildDeck) kennt drei Herausforderungen, Austausch und
// Transfer. Hier entsteht dasselbe Deck-Modell (`Deck`, `DeckSlide`, `Block`) für zwei Hefte
// in EINER Spur, mit gemeinsamem Auftrag — gerendert von derselben Shell
// (`renderStandaloneDeckHtml`), mit demselben CSS und derselben Aufklapp-Mechanik (`.reveal`).
// Der alte Pfad bleibt unberührt: nichts hier wird für eine Einheit ohne Spuren aufgerufen.
//
// Alles wird zur Laufzeit aus den Daten gerechnet — kein neues Feld. Die Lösungen kommen aus
// demselben Modell wie das Dokument «Lösungen» (loesungen-v42.ts); fehlt ein Lösungsfeld,
// fehlt die Folie. Das Deck ist Material der Lehrperson.

import {
  BRAND,
  DIMENSION_LABEL,
  LEHRGANG_LABEL,
  Zahl,
  esc,
  fmtCallout,
  notesFrom,
  ohneKommentare,
  paletteOf,
  parseBegleiterSections,
  pick,
  renderStandaloneDeckHtml,
  zahl,
} from './deck-builder'
import type { Block, Callout, Deck, DeckOptions, DeckSlide, Palette, Section } from './deck-builder'
import { SPUR_NAME_LS, loesungenModell } from './loesungen-v42'
import { landingUrl, qrSvg } from './qr'
import { RUBRIK_PUNKTE_MAX, RUBRIK_ZIELPUNKTZAHL, punkteLabel } from './rubrik-skala'
import { SPUR_KEYS } from './spuren'
import type {
  EinheitFullSet,
  Erwartungshorizont,
  FeedbackKriterium,
  GemeinsamerAuftrag,
  KnJson,
  PrinzipJson,
  ProduktBild,
  ProduktBildBlock,
  Quelle,
  SetJson,
  SituationJson,
  SpurKey,
} from './types'

export type EinheitSourceV42 = {
  id: string
  set: SetJson
  prinzip: PrinzipJson
  kn: KnJson
  /** Heft A und B, in der Spur des Decks aufgelöst (ein Heft mit nur einer Spur: die vorhandene). */
  hefte: SituationJson[]
  begleiter: string
  /** Die Spur, die das Deck zeigt. */
  spur: SpurKey
}

/** Trägt die Einheit das v4.2-Format? Einziger Schalter für das v4.2-Deck. */
export function istV42Einheit(d: Pick<EinheitFullSet, 'spur_varianten'> | null | undefined): boolean {
  return !!d?.spur_varianten
}

/**
 * Adapter für `loadEinheit()`. `spur` wählt die Fassung; fehlt sie oder gibt es sie in der
 * Einheit nicht, gilt `d.spur` (so wie `loadEinheit` sie aufgelöst hat). Null, wenn die
 * Einheit kein v4.2-Format hat oder Bausteine fehlen.
 */
export function deckSourceV42(d: EinheitFullSet | null | undefined, spur?: SpurKey | null): EinheitSourceV42 | null {
  if (!d?.spur_varianten || !d.set || !d.prinzip || !d.kn) return null
  const wahl: SpurKey | undefined =
    spur && (SPUR_KEYS as readonly string[]).includes(spur) && d.spur_varianten[spur] ? spur : d.spur
  if (!wahl) return null
  const v = d.spur_varianten[wahl] ?? { hf_A: d.hf_A, hf_B: d.hf_B }
  const hefte = [v.hf_A, v.hf_B].filter((h): h is SituationJson => !!h)
  if (!hefte.length) return null
  return { id: d.id, set: d.set, prinzip: d.prinzip, kn: d.kn, hefte, begleiter: d.begleiter?.raw ?? '', spur: wahl }
}

/** Gibt es im Deck mindestens eine Lösung? (Für den Zusatz «mit Lösungen» am Knopf.) */
export function deckV42HatLoesungen(src: EinheitSourceV42 | null | undefined): boolean {
  return !!src?.hefte.some((h) => !!loesungenModell(h))
}

/* ------------------------------------------------------------------ */
/* kleine Helfer                                                       */
/* ------------------------------------------------------------------ */

const voll = (s?: string | null): s is string => !!s && !!s.trim()

const POL_TYP_LABEL: Record<string, string> = {
  lehrmittel_quelle: 'Lehrmittel ↔ Quelle',
  position_gegenposition: 'Position ↔ Gegenposition',
  modell_eigener_fall: 'Modell ↔ eigener Fall',
  recht_praxis: 'Recht ↔ Praxis',
  quelle_quelle: 'Quelle ↔ Quelle',
}

const TYP_ETIKETT: Record<string, string> = {
  artikel: 'Artikel', grafik: 'Grafik', video: 'Video', audio: 'Audio', rechtstext: 'Rechtstext', webseite: 'Webseite',
}

const SOZIALFORM_LABEL: Record<string, string> = { einzel: 'Einzelarbeit', partner: 'Partnerarbeit', gruppe: 'Gruppenarbeit' }

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

/** `2026-06-15` → `15.06.2026`, `2026-09` → `September 2026`; alles andere unverändert. */
function datumCh(d?: string): string {
  if (!d) return ''
  const tag = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d)
  if (tag) return `${tag[3]}.${tag[2]}.${tag[1]}`
  const monat = /^(\d{4})-(\d{2})$/.exec(d)
  if (monat) return `${MONATE[Number(monat[2]) - 1] ?? monat[2]} ${monat[1]}`
  return d
}

function laenge(q: Quelle): string {
  if (q.dauer_sek) return `${Math.floor(q.dauer_sek / 60)}:${String(q.dauer_sek % 60).padStart(2, '0')} min`
  if (q.woerter) return `${q.woerter} Wörter`
  return ''
}

function verortung(q: Quelle): string {
  const v = q.verortung
  if (!v) return ''
  if (v.absaetze) return v.absaetze
  return v.von && v.bis ? `${v.von}–${v.bis}` : ''
}

const herkunft = (q: Quelle) => [q.herausgeber, datumCh(q.datum)].filter(Boolean).join(', ')

/** Ordner der Einheit aus der Heft-ID (wie im Heft, S. 3). */
const ordnerVon = (sit: SituationJson, fallback: string) => (sit.id || '').replace(/_hf_[A-Za-z]$/, '') || fallback

/** «01 Karte einteilen» → [«01», «Karte einteilen»]. */
function schrittTeile(label: string, i: number): [string, string] {
  const m = /^(\d{1,2})[.)]?\s+(.*)$/.exec(String(label ?? '').trim())
  return m ? [m[1].padStart(2, '0'), m[2]] : [String(i + 1).padStart(2, '0'), String(label ?? '')]
}

/** Grössenstufe nach Textmenge — hält lange Inhalte im Rahmen der Folie. */
const stufe = (n: number, f2: number, f3: number, f4 = Infinity) => (n > f4 ? ' f4' : n > f3 ? ' f3' : n > f2 ? ' f2' : '')
const summe = (teile: (string | undefined | null)[]) => teile.reduce((n, t) => n + String(t ?? '').length, 0)

/* ---- Markup-Bausteine (als `raw`-Block) --------------------------- */

const raw = (html: string): Block => ({ t: 'raw', html })

/** Aufklapp-Abschnitt — dasselbe Markup wie die Musterlösung des alten Decks (`.ms.reveal`). */
function klapp(titel: string, inner: string, i: number): string {
  return `<div class="ms reveal" style="--i:${i}"><button class="ms-t" type="button" aria-expanded="false"><span>${esc(
    titel
  )}</span><i class="mm-x" aria-hidden="true"></i></button><div class="mm-b"><div class="mm-bi">${inner}</div></div></div>`
}

/** Akkordeon: immer nur ein Abschnitt offen. */
const akkordeon = (teile: string[]) => `<div class="ms-group" data-accordion>${teile.join('')}</div>`

function zeilenHtml(zeilen: { label?: string; text: string; quelle?: string }[]): string {
  const text = summe(zeilen.map((z) => z.text))
  return `<div class="v-z${stufe(text, 600, 850, 1150)}">${zeilen
    .map(
      (z) =>
        `<div class="ms-z">${z.label ? `<span class="ms-l">${esc(z.label)}</span>` : ''}<span class="ms-x">${esc(z.text)}</span>${
          z.quelle ? `<span class="ms-q">${esc(z.quelle)}</span>` : ''
        }</div>`
    )
    .join('')}</div>`
}

type TabZeile = { zellen: string[]; cls?: string; marke?: string }

function tabelle(kopf: string[], zeilen: TabZeile[], opts: { breiten?: number[]; leer?: number; cls?: string } = {}): string {
  const n = Math.max(kopf.length, ...zeilen.map((z) => z.zellen.length), 1)
  const text = summe([...kopf, ...zeilen.flatMap((z) => z.zellen)])
  const cols = opts.breiten?.length === n ? `<colgroup>${opts.breiten.map((b) => `<col style="width:${b}%">`).join('')}</colgroup>` : ''
  const head = kopf.length ? `<thead><tr>${kopf.map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead>` : ''
  const body = [
    ...zeilen.map(
      (z) =>
        `<tr${z.cls ? ` class="${z.cls}"` : ''}>${Array.from({ length: n }, (_, i) => `<td>${i === 0 && z.marke ? z.marke : ''}${esc(z.zellen[i] ?? '')}</td>`).join('')}</tr>`
    ),
    ...Array.from({ length: opts.leer ?? 0 }, () => `<tr class="leer">${'<td></td>'.repeat(n)}</tr>`),
  ].join('')
  return `<table class="v-tab${stufe(text, 420, 700, 1000)}${opts.cls ? ` ${opts.cls}` : ''}">${cols}${head}<tbody>${body}</tbody></table>`
}

/** Karte mit Etikett und Fliesstext — das Markup der `cards`-Blöcke, mit eigener Grössenstufe. */
function karte(k: string, text: string, opts: { tint?: boolean; cls?: string } = {}): string {
  return `<div class="card${opts.tint ? ' tint' : ''}"><div class="krow"><span class="k">${esc(k)}</span></div><div class="t s${
    opts.cls ?? stufe(text.length, 210, 330)
  }">${esc(text)}</div></div>`
}

/* ---- Produktbild (Beispielbild / Lösungsbild) --------------------- */

// Wie im Heft: die Position in `legende` bestimmt das Zeichen (Kontur statt Farbe).
const MARKEN = ['●', '○', '◐']

function markeHtml(bild: ProduktBild, key?: string): string {
  const i = (bild.legende ?? []).findIndex((l) => l.key === key)
  return i >= 0 && i < MARKEN.length ? `<span class="v-m" title="${esc(bild.legende![i].text)}">${MARKEN[i]}</span>` : ''
}

function blockInhalt(bild: ProduktBild, b: ProduktBildBlock): string {
  if (b.eintraege?.length) {
    return `<ul class="v-pb-ul">${b.eintraege
      .map(
        (e) =>
          `<li>${markeHtml(bild, e.marke)}<span>${esc(e.text)}${e.notiz ? `<em class="v-pb-n">${esc(e.notiz)}</em>` : ''}</span></li>`
      )
      .join('')}</ul>`
  }
  if (b.zeilen?.length) {
    return tabelle(
      b.kopf ?? [],
      b.zeilen.map((z) => ({ zellen: z.zellen ?? [], cls: z.stark ? 'stark' : undefined, marke: markeHtml(bild, z.marke) })),
      { cls: 'v-pb-tab' }
    )
  }
  if (b.text?.length) return b.text.map((p) => `<p class="v-pb-p">${esc(p)}</p>`).join('')
  if (b.wechsel?.length) {
    return `<div class="v-pb-w">${b.wechsel
      .map((w) => `<div class="v-pb-wz"><span class="v-pb-wer">${markeHtml(bild, w.marke)}${esc(w.wer)}</span><span>${esc(w.text)}</span></div>`)
      .join('')}</div>`
  }
  return ''
}

/** Schriftgrössen des Blatts, von gross nach klein — gewählt wird die grösste, die passt. */
const PB_SCHRIFT = [25, 22, 20, 18, 16.5, 15, 14]

/**
 * Geschätzte Höhe eines Blocks in px bei Schrift `f` und Spaltenbreite `w` (Zeilenhöhe 1.28,
 * mittlere Zeichenbreite 0.5 em). Bewusst grob und eher zu hoch: die Folie schneidet ab,
 * was nicht passt, und eine Schrift zu klein ist der kleinere Schaden.
 */
function blockHoehe(b: ProduktBildBlock, f: number, w: number): number {
  const zh = f * 1.28
  const zeilen = (text: string | undefined, breite: number) => Math.max(1, Math.ceil((String(text ?? '').length * f * 0.5) / Math.max(40, breite)))
  let h = 40 + zeilen(b.titel, w - 40) * zh * 1.04 + 0.5 * f
  if (b.eintraege?.length) {
    for (const e of b.eintraege) h += (zeilen(e.text, w - 1.5 * f) + (e.notiz ? zeilen(e.notiz, w - 1.5 * f) : 0)) * zh + 0.36 * f
  } else if (b.zeilen?.length) {
    const k = Math.max(1, b.kopf?.length ?? 0, ...b.zeilen.map((z) => z.zellen?.length ?? 0))
    const zw = w / k - f
    const reihe = (zellen: string[]) => Math.max(1, ...zellen.map((z) => zeilen(z, zw))) * zh + 0.5 * f + 1
    if (b.kopf?.length) h += reihe(b.kopf)
    for (const z of b.zeilen) h += reihe(z.zellen ?? [])
  } else if (b.text?.length) {
    for (const p of b.text) h += zeilen(p, w) * zh + 0.5 * f
  } else if (b.wechsel?.length) {
    for (const x of b.wechsel) h += Math.max(zeilen(x.wer, w * 0.22), zeilen(x.text, w * 0.76)) * zh + 0.4 * f + 1
  }
  return h
}

/** Das Blatt als Spalten von Blöcken. `verdeckt`: jeder Block klappt erst pro Klick auf (Lösungsbild). */
function produktBild(bild: ProduktBild, verdeckt: boolean): string {
  const bloecke = (bild.bloecke ?? []).filter((b) => blockInhalt(bild, b))
  const legende = (bild.legende ?? []).slice(0, MARKEN.length)
  const leg = legende.length
    ? `<div class="v-pb-leg">${legende.map((l, i) => `<span><span class="v-m">${MARKEN[i]}</span>${esc(l.text)}</span>`).join('')}</div>`
    : ''
  const cols = Math.min(3, Math.max(1, bloecke.length))
  // Platz unter Kopfzeile, zweizeiliger Überschrift und Legende; bei mehr Blöcken als Spalten
  // stehen sie in Reihen untereinander.
  const frei = legende.length ? 640 : 690
  const w = (1776 - 16 * (cols - 1)) / cols - 44
  const hoehe = (f: number) => {
    let sum = 0
    for (let i = 0; i < bloecke.length; i += cols) sum += Math.max(...bloecke.slice(i, i + cols).map((b) => blockHoehe(b, f, w))) + 16
    return sum
  }
  let schrift = PB_SCHRIFT.find((f) => hoehe(f) <= frei) ?? PB_SCHRIFT[PB_SCHRIFT.length - 1]
  // Drei Blöcke, einer viel höher als die anderen (z. B. eine lange Tabelle): der hohe Block
  // bekommt eine eigene Spalte, die zwei anderen stehen daneben übereinander — wenn das eine
  // grössere Schrift erlaubt.
  let gross = -1
  if (bloecke.length === 3) {
    const w2 = (1776 - 16) / 2 - 44
    const h1 = bloecke.map((b) => blockHoehe(b, 20, w2))
    const k = h1.indexOf(Math.max(...h1))
    const hoehe2 = (f: number) =>
      Math.max(blockHoehe(bloecke[k], f, w2), bloecke.reduce((sum, b, i) => (i === k ? sum : sum + blockHoehe(b, f, w2) + 16), 0)) + 16
    const schrift2 = PB_SCHRIFT.find((f) => hoehe2(f) <= frei) ?? PB_SCHRIFT[PB_SCHRIFT.length - 1]
    if (schrift2 > schrift) { schrift = schrift2; gross = k }
  }
  const teile = bloecke
    .map((b, i) =>
      verdeckt
        ? `<div class="v-pb-b ms reveal" style="--i:${i}"><button class="ms-t" type="button" aria-expanded="false"><span>${esc(
            b.titel
          )}</span><i class="mm-x" aria-hidden="true"></i></button><div class="mm-b"><div class="mm-bi">${blockInhalt(bild, b)}</div></div></div>`
        : `<div class="v-pb-b ms"><div class="v-pb-t">${esc(b.titel)}</div>${blockInhalt(bild, b)}</div>`
    )
  if (gross >= 0) {
    const stapel = `<div class="v-pb-st">${teile.filter((_, i) => i !== gross).join('')}</div>`
    const inner2 = gross === 0 ? teile[0] + stapel : stapel + teile[gross]
    return `${leg}<div class="v-pb" style="--n:2;font-size:${schrift}px">${inner2}</div>`
  }
  return `${leg}<div class="v-pb" style="--n:${cols};font-size:${schrift}px">${teile.join('')}</div>`
}

/* ---- Kriterien ---------------------------------------------------- */

function kriterienTabelle(kriterien: FeedbackKriterium[]): string {
  const n = Math.max(RUBRIK_PUNKTE_MAX + 1, ...kriterien.map((k) => k.stufen?.length ?? 0))
  const kopf = ['Kriterium', ...Array.from({ length: n }, (_, i) => punkteLabel(i))]
  const text = summe(kriterien.flatMap((k) => [k.kn_kriterium, k.indikator_produkt, ...(k.stufen ?? [])]))
  const body = kriterien
    .map(
      (k) =>
        `<tr><td><b>${esc(k.kn_kriterium)}</b><span class="v-dim">${esc(DIMENSION_LABEL[k.dimension] ?? k.dimension)}</span>${
          k.indikator_produkt ? `<span class="v-ind">${esc(k.indikator_produkt)}</span>` : ''
        }</td>${Array.from({ length: n }, (_, i) => `<td>${esc(k.stufen?.[i] ?? '')}</td>`).join('')}</tr>`
    )
    .join('')
  return `<table class="v-tab v-krit${stufe(text, 600, 900, 1300)}"><colgroup><col style="width:24%">${`<col style="width:${76 / n}%">`.repeat(
    n
  )}</colgroup><thead><tr>${kopf.map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>`
}

function ehNotiz(titel: string, eh?: Erwartungshorizont): string | null {
  if (!eh) return null
  const teile = [
    (eh.gut_wenn ?? []).filter(voll).length ? 'Tragfähig, wenn …\n' + eh.gut_wenn!.filter(voll).map((x) => `· ${x}`).join('\n') : null,
    voll(eh.tragfaehig) ? `Tragfähig: ${eh.tragfaehig}` : null,
    voll(eh.beispiel_pol_1) ? `Mögliche Antwort 1: ${eh.beispiel_pol_1}` : null,
    voll(eh.beispiel_pol_2) ? `Mögliche Antwort 2: ${eh.beispiel_pol_2}` : null,
    voll(eh.nicht_tragfaehig) ? `Nicht tragfähig: ${eh.nicht_tragfaehig}` : null,
  ].filter(Boolean)
  return teile.length ? `${titel}\n${teile.join('\n')}` : null
}

/* ------------------------------------------------------------------ */
/* Deck                                                                */
/* ------------------------------------------------------------------ */

export function buildDeckV42(src: EinheitSourceV42): Deck {
  const { set, prinzip, kn, hefte, spur } = src
  const secs = parseBegleiterSections(src.begleiter)
  // Der v4.2-Begleiter zählt anders als der alte (5 = Quellen-Stand, 6 = Auftrag, 7 = KN) —
  // darum nach Überschrift, nicht nach Nummer.
  const sek = (re: RegExp): Section | undefined => secs.find((s) => re.test(s.heading))
  const sek0 = secs.find((s) => s.n === 0)
  const sekSpuren = sek(/Spuren/i)
  const sekAuftrag = sek(/Gemeinsamer Auftrag/i)
  const sekKn = sek(/Kompetenznachweis/i)
  const co = (s: Section | undefined, types: string[], nur?: (c: Callout) => boolean) =>
    pick(s, types).filter((c) => !nur || nur(c)).map(fmtCallout)

  const ga: GemeinsamerAuftrag = set.gemeinsamer_auftrag ?? {}
  const spurName = SPUR_NAME_LS[spur]
  const n = hefte.length
  const slides: DeckSlide[] = []
  const heftName = (hf: SituationJson) => prinzip.herausforderungen?.[hf.buchstabe]?.herausforderung ?? hf.herausforderung?.label ?? hf.titel ?? ''

  /* ---- Titel ---- */
  const einheitTitel = set.einheit_titel || (set as any).modul_titel || prinzip.topic_slug || 'Unterrichtsdeck'
  const aspektePaare = ohneKommentare<string>(prinzip.aspekte)
  const modulTitel: string | undefined = (set as any).modul_titel
  slides.push({
    id: 'titel',
    accent: BRAND,
    ctx: `BBW · ABU · Thema ${String((set as any).thema ?? '').replace(/^T/, '')} · Kompetenz ${prinzip.kompetenz_nr}`,
    src: `${LEHRGANG_LABEL[set.lehrgang ?? ''] ?? set.lehrgang ?? ''} · Spur ${spurName}`,
    headline: einheitTitel,
    hero: true,
    lead: modulTitel === einheitTitel ? undefined : modulTitel,
    foot: `Lebensbezug ${(set as any).modul ?? prinzip.modul ?? ''} · Aspekte ${aspektePaare.map(([k]) => k).join(' · ')}`,
    body: [
      {
        t: 'chips',
        items: [
          ...hefte.map((hf) => ({ text: `Heft ${hf.buchstabe} · ${heftName(hf)}`, dark: true, color: hf.sit_farbe })),
          ...(ga.titel ? [{ text: 'Gemeinsamer Auftrag' }] : []),
          { text: 'Kompetenznachweis' },
          { text: `Spur ${spurName}` },
        ],
      },
    ],
    notes: notesFrom(`Einstieg — Überblick über die Einheit (Fassung: Spur ${spurName}).`, [
      ...co(sek0, ['hinweis']),
      ...co(sekSpuren, ['coaching', 'warnung']),
    ]),
  })

  /* ---- Kompetenzversprechen ---- */
  const progression: any[] = set.konzept_progression ?? []
  slides.push({
    id: 'versprechen',
    accent: BRAND,
    ctx: 'Das Kompetenzversprechen',
    src: 'Der Massstab für alles Weitere',
    headline: 'Das können Sie am Ende dieser Einheit.',
    body: [
      { t: 'quote', text: prinzip.kern_kompetenzversprechen ?? kn.kern_kompetenzversprechen ?? '' },
      {
        t: 'cards',
        grid: 1,
        items: hefte.map((hf, i) => ({
          k: `Heft ${hf.buchstabe}`,
          badge: hf.buchstabe,
          text: progression[i]?.konzept ?? heftName(hf),
          color: hf.sit_farbe,
        })),
      },
      { t: 'chips', items: aspektePaare.map(([k, v]) => ({ text: `${k} · ${v}` })) },
    ],
    notes: notesFrom(`Der Massstab der Einheit — ein Satz, ${zahl(n)} Hefte.`, [...co(sek0, ['mehrdeutigkeit', 'coaching'])]),
  })

  /* ---- Übersicht ---- */
  slides.push({
    id: 'ablauf',
    accent: BRAND,
    ctx: 'Übersicht',
    src: '',
    headline: `${Zahl(n)} Hefte, ein gemeinsamer Auftrag, ein Nachweis.`,
    body: [
      {
        t: 'steps',
        items: [
          ...hefte.map((hf) => ({
            badge: hf.buchstabe,
            lead: `Heft ${hf.buchstabe} — ${hf.titel ?? ''}`,
            note: hf.handlungsprodukt?.titel ? `Produkt: ${hf.handlungsprodukt.titel}` : '',
            color: hf.sit_farbe,
          })),
          ...(ga.titel ? [{ badge: '→', lead: `Gemeinsamer Auftrag — ${ga.titel}`, note: ga.leitfrage ?? '', pale: true }] : []),
          { badge: '✓', lead: 'Kompetenznachweis', note: kn.hybrid_situation?.titel ?? '', pale: true },
        ],
      },
    ],
    notes: notesFrom('Überblick — von hinten gedacht: der Kompetenznachweis war zuerst da.', [
      n === 2 ? 'Beide Hefte führen auf denselben Nachweis; der gemeinsame Auftrag verbindet sie an einem neuen Fall.' : null,
    ]),
  })

  /* ---- je Heft ---- */
  hefte.forEach((hf) => {
    const L = hf.buchstabe
    const l = L.toLowerCase()
    const pal: Palette = paletteOf(hf)
    const parentId = `${l}-situation`
    const s = sek(new RegExp(`(Herausforderung|Heft)\\s+${L}\\b`))
    const m = loesungenModell(hf)
    const heftSpur: SpurKey = hf.spur ?? spur
    const nurEine = heftSpur !== spur
    const sub = (id: string, ctx: string, rest: Omit<DeckSlide, 'id' | 'accent' | 'badge' | 'branchOf' | 'ctx'>) =>
      slides.push({ id: `${l}-${id}`, accent: pal, badge: L, branchOf: parentId, ctx: `Heft ${L} · ${ctx}`, ...rest })

    /* Situation */
    slides.push({
      id: parentId,
      accent: pal,
      badge: L,
      ctx: `Heft ${L} · ${heftName(hf)}`,
      src: [hf.persona?.beruf, hf.persona?.betrieb].filter(Boolean).join(' · '),
      headline: hf.titel ?? `Heft ${L}`,
      small: true,
      body: [
        { t: 'prose', text: hf.situation_text ?? '' },
        ...((hf.zahlen_tabelle ?? []).length
          ? ([{ t: 'nums', items: hf.zahlen_tabelle!.slice(0, 4).map((z) => ({ l: z.label, v: z.wert })) }] as Block[])
          : []),
        ...(hf.leitfrage ? ([{ t: 'ask', k: 'Leitfrage', text: hf.leitfrage }] as Block[]) : []),
      ],
      notes: notesFrom(`Heft ${L} — Einstieg. Details liegen als Unterfolien darunter (↓).`, [
        nurEine ? `Heft ${L} gibt es nur in der Spur ${SPUR_NAME_LS[heftSpur]} — das Deck zeigt für dieses Heft diese Spur.` : null,
        ...co(s, ['hinweis']),
      ]),
    })

    /* Spannungsfeld */
    if (hf.mehrdeutigkeit?.trade_off) {
      sub('spannungsfeld', 'Spannungsfeld', {
        src: 'Beide Seiten bleiben begründbar',
        headline: hf.mehrdeutigkeit.trade_off,
        small: true,
        center: true,
        body: [
          ...(hf.mehrdeutigkeit.hint ? ([{ t: 'quote', text: hf.mehrdeutigkeit.hint }] as Block[]) : []),
          ...(hf.leitfrage ? ([{ t: 'ask', k: 'Leitfrage', text: hf.leitfrage }] as Block[]) : []),
        ],
        notes: notesFrom(`Heft ${L} — Spannungsfeld. Nicht auflösen: es trägt bis zur Leitfrage 4.`, [...co(s, ['mehrdeutigkeit'])]),
      })
    }

    /* LF1 und LF2 */
    const lf12 = [1, 2].map((nr) => hf.leitfragen?.find((x) => x.nr === nr)).filter((x): x is NonNullable<typeof x> => !!x)
    if (lf12.length) {
      sub('leitfragen', 'Leitfragen 1 und 2', {
        src: 'Wissensecke I · Heft S. 2',
        headline: lf12.length > 1 ? `Leitfragen 1 und 2 — ${lf12.map((x) => x.bloom).filter(Boolean).join(' und ')}.` : 'Leitfrage 1.',
        small: true,
        body: [
          {
            t: 'cards',
            grid: 1,
            items: lf12.map((lf) => ({ k: [`LF ${lf.nr}`, lf.bloom, lf.knoten_ref].filter(Boolean).join(' · '), text: lf.text })),
          },
        ],
        notes: notesFrom(`Heft ${L} — Coaching zu den Leitfragen 1 und 2.`, [
          hf.leitfragen_intro,
          ...co(s, ['coaching'], (c) => /LF\s*1|LF\s*2/i.test(c.title)),
        ]),
      })
    }
    if (m?.s2.length) {
      sub('leitfragen-loesung', 'Lösung der Leitfragen 1 und 2', {
        src: 'Erst nach der eigenen Bearbeitung',
        headline: 'So sieht eine tragfähige Antwort aus.',
        small: true,
        body: [
          {
            t: 'muster',
            abschnitte: m.s2.map((x) => {
              const lf = hf.leitfragen?.find((y) => y.nr === x.nr)
              return {
                titel: `LF ${x.nr}${lf?.bloom ? ` · ${lf.bloom}` : ''}${lf?.loesung?.kern ? ` — ${lf.loesung.kern}` : ''}`,
                zeilen: x.zeilen,
              }
            }),
          },
        ],
        notes: notesFrom(`Heft ${L} — Lösung der Leitfragen 1 und 2. Eine Frage pro Klick aufklappen.`, [
          'Kein Wort-für-Wort-Skript, sondern der Massstab: Antworten der Lernenden dürfen abweichen, solange Quelle und eigene Verdichtung erkennbar sind.',
          'Erst die eigenen Antworten danebenlegen lassen, dann Frage für Frage abgleichen — nicht vorlesen.',
        ]),
      })
    }

    /* Quelle */
    const lf3 = hf.leitfragen?.find((x) => x.antwortform === 'raster') ?? hf.leitfragen?.find((x) => x.nr === 3)
    const raster = lf3?.raster
    const pflicht = heftSpur === 'mit_medien' ? hf.quellen?.find((q) => q.rolle === 'pflicht') : undefined
    const auftrag = pflicht ? pflicht.auftrag : raster?.auftrag
    const spurSatz = nurEine
      ? `Heft ${L} gibt es nur in der Spur ${SPUR_NAME_LS[heftSpur]} — darum steht hier diese Fassung.`
      : ''
    if (pflicht || raster?.knoten_ref) {
      let karteHtml: string
      if (pflicht) {
        const url = landingUrl(ordnerVon(hf, src.id), L)
        const ort = verortung(pflicht)
        const lang = laenge(pflicht)
        karteHtml = `<div class="v-q"><div class="v-q-txt"><div class="v-q-k">Quelle · ${esc(TYP_ETIKETT[pflicht.typ] || pflicht.typ)}</div><div class="v-q-t">${esc(
          pflicht.titel
        )}</div><div class="v-q-h">${esc(herkunft(pflicht))}</div>${
          pflicht.kurzbeschrieb ? `<div class="v-q-b">${esc(pflicht.kurzbeschrieb)}</div>` : ''
        }<div class="v-q-m">${[ort ? `<b>Ausschnitt:</b> ${esc(ort)}` : '', lang ? `<b>Länge:</b> ${esc(lang)}` : ''].filter(Boolean).join(' · ')}</div><div class="v-q-m"><b>QR-Seite:</b> ${esc(url.replace(/^https?:\/\//, ''))}</div></div><div class="v-q-qr">${qrSvg(url)}</div></div>`
      } else {
        const anker = hf.quellen_anker?.find((a) => a.ref && raster!.knoten_ref!.startsWith(a.ref))
        karteHtml = `<div class="v-q"><div class="v-q-txt"><div class="v-q-k">Lehrmittel-Abschnitt</div><div class="v-q-t">${esc(
          raster!.knoten_ref!.replace(/\s*\|\s*/g, ' · ')
        )}</div>${anker ? `<div class="v-q-h">${esc([anker.titel, anker.unterueberschrift].filter(Boolean).join(' · '))}</div>` : ''}</div></div>`
      }
      sub('quelle', 'Quelle', {
        src: `Spur ${SPUR_NAME_LS[heftSpur]} · Heft S. 3`,
        headline: pflicht ? 'Die Quelle zu diesem Heft.' : 'Der Lehrmittel-Abschnitt zu diesem Heft.',
        small: true,
        body: [
          raw(karteHtml),
          ...(auftrag ? ([{ t: 'ask', k: 'Auftrag', text: auftrag }] as Block[]) : []),
          ...(spurSatz ? [raw(`<div class="v-hinweis">${esc(spurSatz)}</div>`)] : []),
        ],
        notes: notesFrom(`Heft ${L} — Quelle (Spur ${SPUR_NAME_LS[heftSpur]}).`, [
          spurSatz || null,
          pflicht ? `Die Lernenden erreichen die Quelle über den QR-Code im Heft (S. 3) oder die Kurzadresse ${landingUrl(ordnerVon(hf, src.id), L).replace(/^https?:\/\//, '')}.` : null,
          pflicht?.ersatz?.titel ? `ERSATZQUELLE (gleicher Auftrag, gleiches Raster)\n${pflicht.ersatz.titel} — ${herkunft(pflicht.ersatz as Quelle)}` : null,
          pflicht?.sachlage_geprueft ? `Sachlage geprüft am ${datumCh(pflicht.sachlage_geprueft)}.` : null,
          ...co(sekSpuren, ['warnung'], () => !!pflicht),
        ]),
      })
    }

    /* Raster (LF3) */
    const spalten = raster?.spalten ?? []
    if (lf3 && spalten.length) {
      const beispiel = !pflicht && raster?.beispielzeile?.length ? raster.beispielzeile : undefined
      const leer = Math.max(0, (raster?.zeilen ?? 4) - (beispiel ? 1 : 0))
      sub('raster', `LF 3${lf3.bloom ? ` · ${lf3.bloom}` : ''} · Raster`, {
        src: beispiel ? 'Die erste Zeile ist ein Beispiel' : 'Heft S. 3',
        headline: 'Raster füllen, dann den Befund festhalten.',
        small: true,
        body: [
          raw(tabelle(spalten, beispiel ? [{ zellen: beispiel, cls: 'bsp' }] : [], { breiten: m?.s3?.breiten, leer })),
          { t: 'ask', k: `Leitfrage ${lf3.nr}`, text: lf3.text },
        ],
        notes: notesFrom(`Heft ${L} — Leitfrage 3: Raster und Befund.`, [
          'Das Raster sammelt Belege, der Befund wertet sie aus. Erst füllen lassen, dann schreiben.',
          ...co(s, ['coaching'], (c) => /LF\s*3|Raster|Quelle/i.test(c.title)),
        ]),
      })
    }
    if (m?.s3) {
      const r = m.s3
      const teile: string[] = []
      if (r.zeilen.length || r.beispiel) {
        teile.push(
          klapp(
            'Raster · mögliche Lösung',
            tabelle(
              r.spalten,
              [
                ...(r.beispiel ? [{ zellen: r.beispiel, cls: 'bsp' }] : []),
                ...r.zeilen.map((z) => ({ zellen: z })),
              ],
              { breiten: r.breiten }
            ),
            teile.length
          )
        )
      }
      if (r.befund) teile.push(klapp('Befund', `<div class="v-text${stufe(r.befund.length, 380, 600)}">${esc(r.befund)}</div>`, teile.length))
      if (r.hinweise.length) teile.push(klapp('Hinweise für die Lehrperson', zeilenHtml(r.hinweise), teile.length))
      if (teile.length) {
        sub('raster-loesung', 'Lösung · Raster und Befund', {
          src: [r.quelle, r.stand ? `Stand ${r.stand}` : ''].filter(Boolean).join(' · '),
          headline: 'Das ausgefüllte Raster und ein möglicher Befund.',
          small: true,
          body: [raw(akkordeon(teile))],
          notes: notesFrom(`Heft ${L} — Lösung zu Leitfrage 3. Abschnittsweise aufklappen (Klick oder Leertaste).`, [
            'Eine mögliche Lösung: andere Zeilen gelten, wenn sie in der Quelle bzw. im Lehrmittel-Abschnitt belegt sind.',
            r.beispiel ? 'Die hell hinterlegte erste Zeile ist das Beispiel, das im Heft vorgedruckt ist.' : null,
          ]),
        })
      }
    }

    /* LF4 */
    const lf4 = hf.leitfragen?.find((x) => !!x.pol_typ) ?? hf.leitfragen?.find((x) => x.nr === 4)
    if (lf4) {
      const pol = lf4.pol_typ ? POL_TYP_LABEL[lf4.pol_typ] ?? lf4.pol_typ : ''
      sub('lf4', `LF 4${lf4.bloom ? ` · ${lf4.bloom}` : ''}`, {
        src: 'Wissensecke II · Heft S. 4',
        headline: 'Zwei Pole abwägen — und entscheiden.',
        small: true,
        center: true,
        body: [
          ...(pol ? ([{ t: 'chips', items: [{ text: `Die zwei Pole: ${pol}`, dark: true }] }] as Block[]) : []),
          { t: 'ask', k: `Leitfrage ${lf4.nr}`, text: lf4.text },
          ...(hf.mehrdeutigkeit?.trade_off
            ? ([{ t: 'cards', grid: 1, items: [{ k: 'Spannungsfeld', text: hf.mehrdeutigkeit.trade_off, tint: true }] }] as Block[])
            : []),
        ],
        notes: notesFrom(`Heft ${L} — Leitfrage 4: beurteilen und entscheiden.`, [
          ...co(s, ['coaching'], (c) => !/LF\s*1|LF\s*2|LF\s*3|Raster/i.test(c.title)),
          ...co(s, ['warnung', 'troubleshooting']),
        ]),
      })
    }
    if (m?.s4 && (m.s4.gutWenn.length || m.s4.antworten.length || m.s4.tragfaehig || m.s4.nichtTragfaehig)) {
      const b = m.s4
      sub('lf4-loesung', 'Lösung · Erwartungshorizont LF 4', {
        src: 'Erst nach der eigenen Bearbeitung',
        headline: 'Woran eine tragfähige Antwort zu erkennen ist.',
        small: true,
        body: [
          {
            t: 'muster',
            abschnitte: [
              ...(b.gutWenn.length ? [{ titel: 'Tragfähig, wenn …', zeilen: b.gutWenn.map((text) => ({ text })) }] : []),
              ...(b.tragfaehig ? [{ titel: 'Tragfähig', zeilen: [{ text: b.tragfaehig }] }] : []),
              ...b.antworten.map((text, i) => ({ titel: `Mögliche Antwort${b.antworten.length > 1 ? ` ${i + 1}` : ''}`, zeilen: [{ text }] })),
              ...(b.nichtTragfaehig ? [{ titel: 'Nicht tragfähig', zeilen: [{ text: b.nichtTragfaehig }] }] : []),
            ],
          },
        ],
        notes: notesFrom(`Heft ${L} — Erwartungshorizont zu Leitfrage 4. Abschnittsweise aufklappen.`, [
          'Beide Beispielantworten sind vertretbar — bewertet wird die Begründung, nicht die Richtung des Entscheids.',
          ...co(s, ['mehrdeutigkeit']),
        ]),
      })
    }

    /* Kasten S. 4 */
    const k = hf.kasten_s4
    if (k?.typ === 'denkhilfe' && (k.spalten ?? []).filter(Boolean).length) {
      const sp = k.spalten!.filter(Boolean)
      const loes = m?.s4?.denkhilfe
      sub('kasten', k.titel || 'Denkhilfe', {
        src: 'Vor dem Schreiben füllen · Heft S. 4',
        headline: 'Erst die Denkhilfe, dann die Antwort.',
        small: true,
        body: [
          raw(tabelle(sp, [], { leer: loes ? 1 : 3 })),
          ...(k.hinweis ? [raw(`<div class="v-hinweis">${esc(k.hinweis)}</div>`)] : []),
          ...(loes ? [raw(akkordeon([klapp('Mögliche Einträge', tabelle(loes.spalten, loes.zeilen.map((z) => ({ zellen: z }))), 0)]))] : []),
        ],
        notes: notesFrom(`Heft ${L} — Denkhilfe zu Leitfrage 4.`, [
          loes ? 'Die möglichen Einträge klappen erst pro Klick auf — zuerst die eigenen Stichworte sammeln lassen.' : null,
        ]),
      })
    } else if (k?.typ === 'vertiefung') {
      const vq = (hf.quellen ?? []).filter((q) => q.rolle === 'vertiefung').slice(0, 2)
      if (vq.length) {
        const mitErw = vq.filter((q) => voll(q.erwartung))
        const karten = vq
          .map((q) => {
            const ort = verortung(q)
            return `<div class="card"><div class="krow"><span class="k">${esc([TYP_ETIKETT[q.typ] || q.typ, herkunft(q)].filter(Boolean).join(' · '))}</span></div><div class="t s f2"><b>${esc(
              q.titel
            )}</b>${ort ? `<span class="v-ort">Ausschnitt: ${esc(ort)}</span>` : ''}${
              q.leitfrage_vertiefung ? `<span class="v-frage">${esc(q.leitfrage_vertiefung)}</span>` : ''
            }</div></div>`
          })
          .join('')
        sub('kasten', k.titel || 'Vertiefung', {
          src: 'Links auf der QR-Seite · Heft S. 4',
          headline: 'Wer weitergehen will: zwei weitere Quellen.',
          small: true,
          body: [
            raw(`<div class="grid2">${karten}</div>`),
            ...(mitErw.length
              ? [raw(akkordeon(mitErw.map((q, i) => klapp(`Erwartung · ${q.titel}`, `<div class="v-text${stufe(q.erwartung!.length, 380, 600)}">${esc(q.erwartung!)}</div>`, i))))]
              : []),
          ],
          notes: notesFrom(`Heft ${L} — Vertiefung (freiwillig).`, [
            k.hinweis,
            'Die Erwartung zu jeder Quelle klappt erst pro Klick auf.',
            ...co(s, ['erwartungshorizont'], (c) => /Vertiefung/i.test(c.title)),
          ]),
        })
      }
    }

    /* Produkt */
    const hp = hf.handlungsprodukt
    if (hp) {
      const schritte = hp.schritte ?? []
      const abgaben = (hp.abgaben ?? []).filter(voll)
      const menge = summe([...schritte.flatMap((x) => [x.label, x.hint]), ...abgaben])
      const schritteHtml = `<div class="v-steps${stufe(menge, 800, 1100, 1400)}">${schritte
        .map((x, i) => {
          const [nr, label] = schrittTeile(x.label, i)
          return `<div class="v-step"><span class="v-nr">${esc(nr)}</span><span class="v-st"><b>${esc(label)}</b>${x.hint ? `<span>${esc(x.hint)}</span>` : ''}</span></div>`
        })
        .join('')}${
        abgaben.length ? `<div class="v-abg"><div class="k">Das geben Sie ab</div><ul>${abgaben.map((a) => `<li>☐ ${esc(a)}</li>`).join('')}</ul></div>` : ''
      }</div>`
      sub('produkt', 'Produkt', {
        src: 'Heft S. 5',
        headline: `Ihr Produkt: ${hp.titel ?? hp.format ?? ''}`,
        small: true,
        body: [raw(schritteHtml)],
        notes: notesFrom(`Heft ${L} — Produkt: ${Zahl(schritte.length)} Schritte und die Abgaben.`, [
          hp.beschreibung,
          hp.format_detail,
          hf.lernfortschritt?.scaffold_90 ? `STÜTZE\n${hf.lernfortschritt.scaffold_90}` : null,
          hf.lernfortschritt?.scaffold_100 ? `ERWEITERUNG\n${hf.lernfortschritt.scaffold_100}` : null,
          ...co(s, ['differenzieren']),
        ]),
      })
    }

    /* Feedback-Kriterien */
    const fk = hf.feedback_kriterien ?? []
    if (fk.length) {
      sub('kriterien', 'Feedback-Kriterien', {
        src: 'Wortlaut wie im Kompetenznachweis',
        headline: `Daran wird Ihr Produkt gemessen — ${zahl(fk.length)} Kriterien, 0–${Math.max(RUBRIK_PUNKTE_MAX, (fk[0].stufen?.length ?? 1) - 1)} Punkte.`,
        small: true,
        body: [raw(kriterienTabelle(fk))],
        notes: notesFrom(`Heft ${L} — die ${zahl(fk.length)} Feedback-Kriterien dieses Hefts.`, [
          'Die Punkte stehen wörtlich so im Kompetenznachweis. Unter jedem Kriterium: woran es im Produkt zu sehen ist.',
          ...co(sek0, ['coaching'], (c) => /KN|Kriteri/i.test(c.title)),
        ]),
      })
    }

    /* Beispielbild / Lösungsbild */
    if (hp?.beispielbild?.bloecke?.length) {
      sub('beispielbild', 'Beispiel', {
        src: 'Ein anderer Fall — keine Vorlage · Heft S. 6',
        headline: hp.beispielbild.titel,
        small: true,
        body: [raw(produktBild(hp.beispielbild, false))],
        notes: notesFrom(`Heft ${L} — Beispiel des Produkts an einem anderen Fall.`, [
          'Das Beispiel zeigt die Form, nicht den Inhalt: Der Fall ist ein anderer als im Heft.',
          hp.beispielbild.hinweis,
        ]),
      })
    }
    if (m?.produkt?.bild?.bloecke?.length) {
      sub('loesungsbild', 'Lösung · Produkt', {
        src: 'Erst nach dem eigenen Entwurf',
        headline: m.produkt.bild.titel,
        small: true,
        body: [raw(produktBild(m.produkt.bild, true))],
        notes: notesFrom(`Heft ${L} — mögliche Lösung des Produkts. Block für Block aufklappen (Klick oder Leertaste).`, [
          m.produkt.hinweis,
          'Nicht als Vorlage zum Abschreiben zeigen. Besser: erst den eigenen Entwurf danebenlegen lassen, dann Block für Block vergleichen.',
        ]),
      })
    }

    /* Begriffsnetz */
    if (hf.mindmap_zentrum && (hf.mindmap_aeste ?? []).length) {
      sub('begriffsnetz', 'Begriffsnetz', {
        src: 'Knoten verbinden und beschriften · Heft S. 8',
        headline: 'Ihr Begriffsnetz: Zentrum, Äste, Knoten.',
        small: true,
        center: true,
        body: [
          {
            t: 'mind',
            zentrum: hf.mindmap_zentrum,
            aeste: hf.mindmap_aeste!.map((a) => ({ titel: a.titel, punkte: (a.punkte ?? []).filter(voll) })),
          },
        ],
        notes: notesFrom(`Heft ${L} — Begriffsnetz. Die Knoten sind Begriffe aus dem Glossar des Hefts.`, [
          'Pro Klick klappt ein Ast auf. Das Feld «gilt auch bei …» und zwei Knoten bleiben im Heft leer — die Lernenden füllen sie selbst.',
          ...co(s, ['tafelbild']),
        ]),
      })
    }
    const ab = m?.abschluss
    if (ab && (ab.verbindungen.length || ab.transfer || ab.eigeneKnoten.length)) {
      const teile: string[] = []
      if (ab.verbindungen.length) {
        teile.push(
          klapp(
            'Beschriftete Verbindungen',
            tabelle(['Von', 'Beschriftung', 'Nach'], ab.verbindungen.map((v) => ({ zellen: [v.von, v.text, v.nach] })), { breiten: [34, 32, 34] }),
            teile.length
          )
        )
      }
      if (ab.eigeneKnoten.length) {
        teile.push(klapp('Leere Knoten · aus dem Raster', `<div class="v-text">${esc(ab.eigeneKnoten.join(' · '))}</div>`, teile.length))
      }
      if (ab.transfer) teile.push(klapp(`Feld «${ab.transferTitel}»`, `<div class="v-text">${esc(ab.transfer)}</div>`, teile.length))
      sub('begriffsnetz-loesung', 'Lösung · Begriffsnetz', {
        src: `Spur ${SPUR_NAME_LS[heftSpur]}`,
        headline: 'Mögliche Verbindungen im Begriffsnetz.',
        small: true,
        body: [raw(akkordeon(teile))],
        notes: notesFrom(`Heft ${L} — mögliche Lösung des Begriffsnetzes. Abschnittsweise aufklappen.`, [
          'Andere Verbindungen gelten, wenn die Beschriftung die Beziehung der zwei Begriffe benennt.',
        ]),
      })
    }

    /* Abschluss */
    const quer = (hf.abschluss?.quercheck ?? []).filter(voll)
    const mit = (hf.abschluss?.mitnahme ?? []).filter(voll)
    if (quer.length || mit.length) {
      sub('abschluss', 'Abschluss', {
        src: 'Quer-Check und «Das nehme ich mit» · Heft S. 8',
        headline: 'Zum Schluss: zurück zur Situation.',
        small: true,
        center: true,
        body: [
          ...(quer.length ? ([{ t: 'cards', grid: 1, items: quer.map((text, i) => ({ k: `Quer-Check ${i + 1}`, text })) }] as Block[]) : []),
          ...(mit.length
            ? ([
                raw(`<div class="v-mini">Das nehme ich mit</div>`),
                { t: 'chips', items: mit.map((text) => ({ text })) },
              ] as Block[])
            : []),
        ],
        notes: notesFrom(`Heft ${L} — Abschluss: Quer-Check und «Das nehme ich mit».`, [
          hf.dekontextualisierung?.frage,
        ]),
      })
    }
    if (ab && (ab.quercheck.length || ab.mitnahme.length)) {
      sub('abschluss-loesung', 'Lösung · Abschluss', {
        src: 'Mögliche Antworten',
        headline: 'Quer-Check und «Das nehme ich mit» — mögliche Antworten.',
        small: true,
        body: [
          {
            t: 'muster',
            abschnitte: [
              ...ab.quercheck.map((x) => ({ titel: x.frage, zeilen: [{ text: x.antwort }] })),
              ...(ab.mitnahme.length ? [{ titel: 'Das nehme ich mit', zeilen: ab.mitnahme.map((x) => ({ label: x.label, text: x.eintrag })) }] : []),
            ],
          },
        ],
        notes: notesFrom(`Heft ${L} — mögliche Antworten zum Abschluss. Eine Frage pro Klick aufklappen.`, [
          'Die Einträge der Lernenden sind persönlich — die Lösung zeigt nur, wie eine tragfähige Antwort aussehen kann.',
        ]),
      })
    }
  })

  /* ---- Gemeinsamer Auftrag ---- */
  if (ga.titel || ga.situation_text) {
    const gid = 'auftrag'
    const gsub = (id: string, ctx: string, rest: Omit<DeckSlide, 'id' | 'accent' | 'branchOf' | 'ctx'>) =>
      slides.push({ id: `auftrag-${id}`, accent: BRAND, branchOf: gid, ctx: `Gemeinsamer Auftrag · ${ctx}`, ...rest })
    slides.push({
      id: gid,
      accent: BRAND,
      ctx: 'Gemeinsamer Auftrag',
      src: ga.lebensbereich ?? '',
      headline: ga.titel ?? 'Gemeinsamer Auftrag',
      small: true,
      body: [
        { t: 'prose', text: ga.situation_text ?? '' },
        ...((ga.zahlen_tabelle ?? []).length
          ? ([{ t: 'nums', items: ga.zahlen_tabelle!.slice(0, 4).map((z) => ({ l: z.label, v: z.wert })) }] as Block[])
          : []),
        ...(ga.leitfrage ? ([{ t: 'ask', k: 'Leitfrage', text: ga.leitfrage }] as Block[]) : []),
      ],
      notes: notesFrom(`Gemeinsamer Auftrag — ein neuer Fall, der ${n === 2 ? 'beide Hefte' : 'die Hefte'} braucht.`, [
        ga.mehrdeutigkeit?.trade_off ? `SPANNUNGSFELD\n${ga.mehrdeutigkeit.trade_off}${ga.mehrdeutigkeit.hint ? `\n${ga.mehrdeutigkeit.hint}` : ''}` : null,
        ehNotiz('ERWARTUNGSHORIZONT', ga.erwartungshorizont),
        ...co(sekAuftrag, ['coaching', 'hinweis', 'warnung']),
      ]),
    })

    const schritte = ga.schritte ?? []
    if (schritte.length || ga.auftrag) {
      const menge = summe([ga.auftrag, ...schritte.flatMap((x) => [x.label, x.hint])])
      gsub('schritte', 'Auftrag und Schritte', {
        src: (ga.heft_bezug ?? []).length ? `Mit den Werkzeugen aus ${(ga.heft_bezug ?? []).map((h) => `Heft ${h.heft}`).join(' und ')}` : '',
        headline: `So gehen Sie vor — ${zahl(schritte.length)} Schritte.`,
        small: true,
        body: [
          ...(ga.auftrag ? [raw(`<div class="v-hinweis v-auf${stufe(ga.auftrag.length, 260, 420)}">${esc(ga.auftrag)}</div>`)] : []),
          raw(
            `<div class="v-steps${stufe(menge, 800, 1100, 1400)}">${schritte
              .map((x, i) => {
                const [nr, label] = schrittTeile(x.label, i)
                return `<div class="v-step"><span class="v-nr">${esc(nr)}</span><span class="v-st"><b>${esc(label)}</b>${x.hint ? `<span>${esc(x.hint)}</span>` : ''}</span></div>`
              })
              .join('')}</div>`
          ),
        ],
        notes: notesFrom('Gemeinsamer Auftrag — Auftrag und Schritte.', [
          (ga.heft_bezug ?? []).length
            ? 'WAS DER AUFTRAG AUS DEN HEFTEN BRAUCHT\n' +
              ga.heft_bezug!.map((h) => `· Heft ${h.heft}${h.titel ? ` «${h.titel}»` : ''}: ${(h.inhalte ?? []).join('; ')}`).join('\n')
            : null,
          ehNotiz('ERWARTUNGSHORIZONT', ga.erwartungshorizont),
        ]),
      })
    }

    // Die zwei Produkte: `produkte` (E25), sonst der Gold-Fall — Schritt 04 und Schritt 05.
    const prod = (Array.isArray(ga.produkte) ? ga.produkte : []).filter((p) => p && (p.form === 'flaeche' || p.form === 'spur')).slice(0, 2)
    const produkte = prod.length
      ? prod.map((p) => {
          const i = Math.max(0, (Number(p.schritt) || 1) - 1)
          const sch = schritte[i]
          const [nr, label] = sch ? schrittTeile(sch.label, i) : [String(i + 1).padStart(2, '0'), p.modus || '']
          return { nr, label, hint: sch?.hint ?? '', modus: p.modus, stationen: p.form === 'spur' ? (p.stationen ?? []).filter(Boolean).slice(0, 4) : [], hinweis: p.form === 'spur' ? p.hinweis : undefined, dauer: p.form === 'spur' ? p.dauer : undefined }
        })
      : [3, 4]
          .filter((i) => schritte[i])
          .map((i) => {
            const [nr, label] = schrittTeile(schritte[i].label, i)
            return { nr, label, hint: schritte[i].hint ?? '', modus: undefined as string | undefined, stationen: [] as string[], hinweis: undefined as string | undefined, dauer: undefined as string | undefined }
          })
    const abgaben = (ga.abgaben ?? []).filter(voll)
    const zul = (ga.sozialform?.zulaessig ?? []).map((z) => SOZIALFORM_LABEL[z] ?? z)
    if (produkte.length || abgaben.length || ga.sozialform) {
      const menge = summe([...produkte.flatMap((p) => [p.label, p.hint, p.hinweis, ...p.stationen]), ...abgaben, ga.sozialform?.empfehlung])
      const prodHtml = produkte
        .map(
          (p) =>
            `<div class="card"><div class="krow"><span class="kbadge v-kb">${esc(p.nr)}</span><span class="k">${esc(
              [p.label, p.modus, p.dauer].filter(Boolean).join(' · ')
            )}</span></div><div class="v-pt">${p.hint ? `<p>${esc(p.hint)}</p>` : ''}${
              p.stationen.length ? `<ol>${p.stationen.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''
            }${p.hinweis ? `<p class="v-ph">${esc(p.hinweis)}</p>` : ''}</div></div>`
        )
        .join('')
      const unten = [
        abgaben.length ? `<div class="card check"><div class="krow"><span class="k">Das geben Sie ab</span></div><ul>${abgaben.map((a) => `<li>☐ ${esc(a)}</li>`).join('')}</ul></div>` : '',
        ga.sozialform
          ? `<div class="card tint"><div class="krow"><span class="k">Sozialform${zul.length ? ` · ${esc(zul.join(', '))}` : ''}</span></div><div class="v-pt">${
              ga.sozialform.empfehlung ? `<p>${esc(ga.sozialform.empfehlung)}</p>` : ''
            }</div></div>`
          : '',
      ].join('')
      gsub('produkte', 'Produkte und Sozialform', {
        src: (ga.sprachmodi ?? []).join(' · '),
        headline: produkte.length === 2 ? 'Zwei Produkte — und wie Sie zusammenarbeiten.' : 'Das Produkt — und wie Sie zusammenarbeiten.',
        small: true,
        body: [raw(`<div class="v-prod${stufe(menge, 900, 1250, 1600)}"><div class="grid2">${prodHtml}</div><div class="grid2">${unten}</div></div>`)],
        notes: notesFrom('Gemeinsamer Auftrag — die Produkte, die Abgaben und die Sozialform.', [
          ...co(sekAuftrag, ['hinweis'], (c) => /Sozialform/i.test(c.title)),
          ehNotiz('ERWARTUNGSHORIZONT', ga.erwartungshorizont),
        ]),
      })
    }

    const gk = ga.feedback_kriterien ?? []
    if (gk.length) {
      gsub('kriterien', `${Zahl(gk.length)} Kriterien`, {
        src: 'Dieselben Kriterien wie im Kompetenznachweis',
        headline: `Daran wird der Auftrag gemessen — ${zahl(gk.length)} Kriterien.`,
        small: true,
        body: [
          {
            t: 'cards',
            grid: 2,
            items: gk.map((x) => ({
              k: `${x.dimension} · ${x.kn_kriterium}`,
              text: x.indikator_produkt || x.stufen?.[RUBRIK_ZIELPUNKTZAHL] || '',
            })),
          },
        ],
        notes: notesFrom('Gemeinsamer Auftrag — alle Kriterien des Kompetenznachweises, hier am Produkt des Auftrags.', [
          ehNotiz('ERWARTUNGSHORIZONT', ga.erwartungshorizont),
          gk.some((x) => x.stufen?.[RUBRIK_ZIELPUNKTZAHL])
            ? `${punkteLabel(RUBRIK_ZIELPUNKTZAHL).toUpperCase()} — DAS BAND, AUF DAS LERNENDE ZIELEN\n` +
              gk.map((x) => `· ${x.kn_kriterium}: ${x.stufen?.[RUBRIK_ZIELPUNKTZAHL] ?? ''}`).join('\n')
            : null,
          ...co(sekAuftrag, ['erwartungshorizont']),
        ]),
      })
    }
  }

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
          ...hefte.map((hf) => ({ l: `Aus Heft ${hf.buchstabe}`, v: heftName(hf), accent: hf.sit_farbe })),
          ...(tradeoffs.length ? [{ l: 'Neu im Nachweis', v: `${zahl(tradeoffs.length)} Zielkonflikte gleichzeitig` }] : []),
        ],
      },
    ],
    notes: notesFrom(`Hybrid-Fall vorlesen lassen, nicht selbst vorlesen.`, [
      tradeoffs.length ? 'AKTIVIERTE ZIELKONFLIKTE\n' + tradeoffs.map((t) => `· ${t}`).join('\n') : null,
      n === 2 ? 'Der Fall ist neu: Er kommt in beiden Heften und im gemeinsamen Auftrag nicht vor.' : null,
      ...co(sekKn, ['hinweis']),
    ]),
  })

  /* ---- KN Formen ---- */
  const typen: any[] = kn.kn_typen ?? []
  const kriterien: any[] = kn.rubrik_shared?.kriterien ?? []
  const isGrading = (c: Callout) => /bewert|benot|\bnote|raster|rubrik|punkt|stufe|dimension/i.test(c.title + ' ' + c.body)
  const s8 = pick(sekKn, ['coaching', 'mehrdeutigkeit', 'warnung'])
  if (typen.length) {
    slides.push({
      id: 'kn-formen',
      accent: BRAND,
      ctx: 'Kompetenznachweis · Formen',
      src: `Alle ${zahl(typen.length)} prüfen dieselben ${zahl(kriterien.length)} Kriterien`,
      headline: `Der Nachweis läuft in einer von ${zahl(typen.length)} Formen.`,
      small: true,
      center: true,
      body: [{ t: 'cards', grid: 1, items: typen.map((ty) => ({ k: `${ty.label} — ${ty.format}`, text: (ty.ablauf ?? []).join(' ') })) }],
      notes: notesFrom(`Die Lehrperson wählt die Form, nicht die einzelne Person.`, [
        ...s8.filter((c) => !isGrading(c)).map(fmtCallout),
        pick(sekKn, ['erwartungshorizont']).length
          ? 'ERWARTUNGSHORIZONT — Volltext im Begleiter:\n' + pick(sekKn, ['erwartungshorizont']).map((c) => `· ${c.title}`).join('\n')
          : null,
      ]),
    })
  }

  /* ---- KN Bewertung ---- */
  if (kriterien.length) {
    const dims: string[] = (kn.rubrik_shared as any)?.dimensionen ?? []
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
        { t: 'cards', grid: 2, items: kriterien.map((k) => ({ k: `${k.dimension} · ${k.name}`, text: k.stufen?.[RUBRIK_ZIELPUNKTZAHL] ?? '' })) },
        { t: 'chips', items: baender.map((b, i) => ({ text: `${b.label} — ${b.definition}`, dark: i === baender.length - 1 })) },
      ],
      notes: notesFrom(`Zwei getrennte Noten — nie zu einer Zahl verrechnen.`, [...s8.filter(isGrading).map(fmtCallout)]),
    })
  }

  return { title: `${einheitTitel} · Spur ${spurName}`, slides }
}

/* ------------------------------------------------------------------ */
/* CSS der neuen Bausteine (hängt hinter dem Deck-CSS, nur im v4.2-Deck) */
/* ------------------------------------------------------------------ */

const V42_CSS = `
  /* v4.2 — Tabelle (Raster, Denkhilfe, Kriterien, Verbindungen) */
  .v-tab { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; background: #fff; border-radius: 16px; overflow: hidden;
    font-size: 27px; line-height: 1.28; color: #172a22; box-shadow: 0 1px 0 rgba(16,32,26,.07); }
  .v-tab.f2 { font-size: 24px; } .v-tab.f3 { font-size: 21px; } .v-tab.f4 { font-size: 19px; line-height: 1.24; }
  .v-tab th { background: var(--acc); color: #fff; text-align: left; font-size: .8em; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; padding: 10px 16px; }
  .v-tab td { padding: 10px 16px; border-top: 1px solid #e3eae5; vertical-align: top; overflow-wrap: anywhere; }
  .v-tab tr.leer td { height: 58px; }
  .v-tab tr.bsp td { background: var(--acc-soft); font-style: italic; }
  .v-tab tr.stark td { font-weight: 750; }
  .v-tab td + td, .v-tab th + th { border-left: 1px solid #e3eae5; }
  .mm-bi .v-tab { box-shadow: none; border: 1px solid #e3eae5; margin-top: 12px; }
  .v-krit td b { display: block; font-weight: 800; }
  .v-dim { display: block; font-size: .78em; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--acc-dark); margin: 2px 0 6px; }
  .v-ind { display: block; font-size: .9em; color: #4a5a51; }

  .v-z.f2 .ms-z { font-size: 24px; padding: 7px 0; } .v-z.f3 .ms-z { font-size: 21.5px; padding: 6px 0; } .v-z.f4 .ms-z { font-size: 19px; padding: 5px 0; }
  .v-z.f3 .ms-l, .v-z.f4 .ms-l, .v-z.f3 .ms-q, .v-z.f4 .ms-q { font-size: 18px; }

  /* Fliesstext und Hinweise */
  .v-text { font-size: 29px; line-height: 1.36; color: #172a22; padding-top: 12px; }
  .v-text.f2 { font-size: 26px; } .v-text.f3 { font-size: 23px; }
  .v-hinweis { background: var(--acc-soft); color: var(--acc-dark); border-radius: 14px; padding: 12px 20px; font-size: 25px; line-height: 1.3; font-weight: 600; }
  .v-hinweis.v-auf { font-size: 29px; } .v-hinweis.v-auf.f2 { font-size: 26px; } .v-hinweis.v-auf.f3 { font-size: 23px; }
  .v-mini { font-size: 22px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--acc-dark); }

  /* Quellenkarte */
  .v-q { display: flex; gap: 32px; align-items: center; background: #fff; border-radius: 20px; border-left: 10px solid var(--acc); padding: 22px 28px; }
  .v-q-txt { flex: 1; min-width: 0; }
  .v-q-k { font-size: 22px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--acc); }
  .v-q-t { margin-top: 6px; font-size: 40px; line-height: 1.16; font-weight: 750; color: #10201a; }
  .v-q-h { margin-top: 6px; font-size: 27px; font-weight: 650; color: #5c6b63; }
  .v-q-b { margin-top: 10px; font-size: 27px; line-height: 1.32; color: #172a22; }
  .v-q-m { margin-top: 10px; font-size: 24px; color: #33463c; }
  .v-q-qr { flex: 0 0 250px; text-align: center; }
  .v-q-qr svg { width: 230px; height: 230px; display: block; margin: 0 auto; }
  .v-ort { display: block; margin-top: 6px; font-size: .82em; color: #5c6b63; }
  .v-frage { display: block; margin-top: 8px; }

  /* Schritte und Abgaben */
  .v-steps { display: flex; flex-direction: column; gap: 10px; font-size: 27px; line-height: 1.26; }
  .v-steps.f2 { font-size: 24px; } .v-steps.f3 { font-size: 22px; gap: 8px; } .v-steps.f4 { font-size: 20px; gap: 7px; }
  .v-step { display: flex; gap: 18px; align-items: flex-start; background: #fff; border-radius: 14px; padding: .45em .8em; box-shadow: 0 1px 0 rgba(16,32,26,.07); }
  .v-nr { flex: 0 0 auto; min-width: 2.2em; text-align: center; background: var(--acc); color: #fff; border-radius: 9px; padding: .1em .3em; font-weight: 800; }
  .v-st { flex: 1; min-width: 0; color: #33463c; }
  .v-st b { color: #10201a; font-weight: 750; margin-right: .5em; }
  .v-abg { background: var(--acc-soft); border-radius: 14px; padding: .5em .8em; }
  .v-abg .k { font-size: .8em; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--acc-dark); margin-bottom: .2em; }
  .v-abg li { list-style: none; padding-left: 1.5em; text-indent: -1.5em; color: #10201a; font-weight: 500; }

  /* Produkte des gemeinsamen Auftrags */
  .v-prod { display: flex; flex-direction: column; gap: 16px; font-size: 26px; line-height: 1.3; }
  .v-prod.f2 { font-size: 23px; } .v-prod.f3 { font-size: 21px; } .v-prod.f4 { font-size: 19px; }
  .v-prod .card .k { font-size: .82em; }
  .v-prod .card.check li { font-size: 1em; padding-left: 1.5em; text-indent: -1.5em; }
  .v-pt { color: #172a22; }
  .v-pt p + p, .v-pt ol + p, .v-pt p + ol { margin-top: .35em; }
  .v-pt ol { padding-left: 1.3em; font-weight: 600; }
  .v-ph { color: #4a5a51; font-size: .92em; }
  .v-kb { font-size: 18px; }

  /* Produktbild (Beispiel / Lösung) */
  .v-pb-leg { display: flex; flex-wrap: wrap; gap: 26px; font-size: 24px; font-weight: 700; color: #33463c; }
  .v-m { display: inline-block; width: 1.25em; color: var(--acc-dark); font-style: normal; font-weight: 400; text-indent: 0; }
  .v-pb { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 16px; align-items: start; font-size: 25px; line-height: 1.28; }
  .v-pb-st { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .v-pb-b { border-left: 0; border-top: 8px solid var(--acc); min-width: 0; }
  .v-pb-b .ms-t, .v-pb-t { font-size: 1.04em; font-weight: 750; color: #10201a; }
  .v-pb-t { margin-bottom: .4em; }
  .v-pb-b .mm-bi > *:first-child { margin-top: .5em; }
  .v-pb-ul li { list-style: none; display: flex; gap: .2em; padding: .18em 0; color: #172a22; }
  .v-pb-ul li > span:last-child { flex: 1; min-width: 0; }
  .v-pb-n { display: block; font-size: .9em; color: #5c6b63; }
  .v-pb-p { color: #172a22; } .v-pb-p + .v-pb-p { margin-top: .5em; }
  .v-pb-wz { display: flex; gap: .7em; padding: .2em 0; border-top: 1px solid #eef2ef; }
  .v-pb-wz:first-child { border-top: 0; }
  .v-pb-wer { flex: 0 0 22%; font-weight: 750; color: var(--acc-dark); overflow-wrap: anywhere; }
  .v-pb-wz > span:last-child { flex: 1; min-width: 0; }
  .v-pb .v-tab { font-size: 1em; line-height: inherit; box-shadow: none; border: 1px solid #e3eae5; }
  .v-pb .v-tab td, .v-pb .v-tab th { padding: .25em .5em; }
`

/* ------------------------------------------------------------------ */
/* Einstiegspunkte                                                     */
/* ------------------------------------------------------------------ */

/** Eigenständiges Deck — von der Plattform ausgeliefert und im ZIP mitgegeben. */
export function buildStandaloneDeckHtmlV42(src: EinheitSourceV42, deckId: string, opts: DeckOptions = {}): string {
  return renderStandaloneDeckHtml(buildDeckV42(src), deckId, { ...opts, extraCss: V42_CSS + (opts.extraCss ?? '') })
}
