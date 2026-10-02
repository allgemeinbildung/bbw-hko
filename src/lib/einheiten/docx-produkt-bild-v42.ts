// docx-produkt-bild-v42.ts — Produktbild v4.2 als Word: das ausgefüllte Handlungsprodukt
// als Tabelle (kein Bild), das Band für Heft S. 6 und das Lösungsblatt der Lehrperson.
// Spiegel von heft-v42/produkt-bild.tsx und DocLoesungsblattV42.tsx — gleiche Ableitungen
// (Zeichen der Markierung, Spaltengewichte, Zahlenspalten) kommen von dort, damit HTML und
// Word nie auseinanderlaufen.
//
// Importiert nur aus docx-primitives.ts und docx-heft-v42-gemeinsam.ts, nie aus
// docx-builder.ts (zirkulär über buildHeftV42).

import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, LineRuleType, VerticalAlign, WidthType,
} from 'docx'
import { COLOR, p, sectionHead, sectionProps, tcell } from './docx-primitives'
import { heftPalette } from './docx-heft-v42-gemeinsam'
import { blockGewichte, istZahl, markeForm, tabellenBonus, type MarkeForm } from '../../components/einheiten/docs/heft-v42/produkt-bild'
import {
  LOESUNG_HINWEIS_ERSATZ, loesungsblattDocCode, loesungsblattTitel,
} from '../../components/einheiten/docs/DocLoesungsblattV42'
import type { ProduktBild, ProduktBildBlock, SituationJson } from './types'

type Block = Paragraph | Table
type Groesse = 'klein' | 'gross'

/** Schreibschrift wie im HTML (dort mit Rückfallkette); in Word genau eine Schrift. */
const HAND = 'Segoe Print'
/** Kreise als Zeichen in einer Symbolschrift, die sie sicher hat (Segoe Print hat ◐ nicht). */
const SYMBOL = 'Segoe UI Symbol'
const ZEICHEN: Record<MarkeForm, string> = { voll: '●', leer: '○', halb: '◐' }

const KEIN = { style: BorderStyle.NIL, size: 0, color: 'FFFFFF' }
const OHNE = { top: KEIN, bottom: KEIN, left: KEIN, right: KEIN }
const pct = (n: number) => ({ size: n, type: WidthType.PERCENTAGE })

/**
 * Schriftmasse je Grösse, in halben Punkten (docx `size`) und Twips (Zeilenabstand).
 * `klein` = Heft S. 6: nie unter 7 pt, wie im HTML. Zeilenabstand fest, weil Segoe Print
 * mit «einfach» fast doppelt so hohe Zeilen setzt.
 */
const MASS: Record<Groesse, { text: number; klein: number; titel: number; zeile: number; zeileTab: number; luft: number }> = {
  klein: { text: 14, klein: 14, titel: 15, zeile: 176, zeileTab: 176, luft: 10 },
  gross: { text: 21, klein: 19, titel: 22, zeile: 280, zeileTab: 270, luft: 50 },
}

function zeile(runs: TextRun[], g: Groesse, opts: { after?: number; tab?: boolean; align?: (typeof AlignmentType)[keyof typeof AlignmentType]; border?: any; keepNext?: boolean } = {}): Paragraph {
  const m = MASS[g]
  return new Paragraph({
    children: runs,
    alignment: opts.align,
    border: opts.border,
    keepNext: opts.keepNext,
    spacing: { before: 0, after: opts.after ?? 0, line: opts.tab ? m.zeileTab : m.zeile, lineRule: LineRuleType.EXACT },
  })
}

function hand(text: string, size: number, opts: { bold?: boolean; color?: string } = {}): TextRun {
  return new TextRun({ text, font: HAND, size, bold: opts.bold, color: opts.color ?? COLOR.ink })
}

function zeichen(form: MarkeForm, size: number): TextRun {
  return new TextRun({ text: ZEICHEN[form], font: SYMBOL, size, color: COLOR.ink })
}

/**
 * Kopfzeile: Titel, darunter die Legende, Linie unter dem letzten Absatz. Anders als im
 * HTML (Legende rechts daneben) untereinander: Word bricht eine schmale Legendenzelle
 * mitten im Eintrag um. Innerhalb eines Eintrags stehen geschützte Leerzeichen.
 */
function kopfDocx(bild: ProduktBild, g: Groesse): Paragraph[] {
  const m = MASS[g]
  const legende = (bild.legende || []).slice(0, 3)
  const formen: MarkeForm[] = ['voll', 'leer', 'halb']
  const linie = { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.inkSoft, space: 1 } }
  const titel = zeile([hand(bild.titel || '', m.titel, { bold: true })], g, { after: legende.length ? 0 : 40, border: legende.length ? undefined : linie, keepNext: true })
  if (!legende.length) return [titel]
  const runs: TextRun[] = []
  legende.forEach((l, i) => {
    if (i) runs.push(hand('     ', m.klein))
    runs.push(zeichen(formen[i], m.klein), hand(`\u00A0${l.text.replace(/ /g, '\u00A0')}`, m.klein, { color: COLOR.inkSoft }))
  })
  return [titel, zeile(runs, g, { after: 40, border: linie, keepNext: true })]
}

function listeDocx(bild: ProduktBild, b: ProduktBildBlock, g: Groesse): Paragraph[] {
  const m = MASS[g]
  const out: Paragraph[] = []
  for (const e of (b.eintraege || []).filter((x) => x && x.text)) {
    const form = markeForm(bild, e.marke)
    const runs = form ? [zeichen(form, m.text), hand(` ${e.text}`, m.text)] : [hand(e.text, m.text)]
    // Hängender Einzug: Folgezeilen beginnen unter dem Text, nicht unter dem Kreis.
    const einzug = form ? { left: g === 'klein' ? 170 : 260, hanging: g === 'klein' ? 170 : 260 } : undefined
    out.push(new Paragraph({
      children: runs,
      indent: einzug,
      spacing: { before: 0, after: e.notiz ? 0 : m.luft, line: m.zeile, lineRule: LineRuleType.EXACT },
    }))
    if (e.notiz) {
      out.push(new Paragraph({
        children: [hand(e.notiz, m.klein, { color: COLOR.inkSoft })],
        indent: einzug ? { left: einzug.left } : undefined,
        spacing: { before: 0, after: m.luft, line: m.zeile, lineRule: LineRuleType.EXACT },
      }))
    }
  }
  return out
}

function tabelleDocx(bild: ProduktBild, b: ProduktBildBlock, g: Groesse): Table {
  const m = MASS[g]
  const zeilen = (b.zeilen || []).filter((z) => z && z.zellen?.length)
  const spalten = Math.max(b.kopf?.length || 0, ...zeilen.map((z) => z.zellen.length))
  const mitMarke = zeilen.some((z) => markeForm(bild, z.marke))
  // Breiten: Markenspalte schmal, erste Textspalte breit, Zahlenspalten gleich.
  const marke = mitMarke ? 6 : 0
  const rest = 100 - marke
  const zahl = spalten > 1 ? Math.round((rest * 0.34) / (spalten - 1)) : 0
  const erste = rest - zahl * (spalten - 1)
  const breite = (i: number) => (i === 0 ? erste : zahl)
  const rand = { top: 0, bottom: 0, left: 0, right: 50 }
  const punktiert = { ...OHNE, bottom: { style: BorderStyle.DOTTED, size: 4, color: COLOR.inkMute } }
  const rows: TableRow[] = []
  if (b.kopf?.length) {
    const linie = { ...OHNE, bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.inkSoft } }
    rows.push(new TableRow({
      tableHeader: true,
      children: [
        ...(mitMarke ? [tcell(zeile([hand('', m.text)], g, { tab: true }), { width: pct(marke), borders: linie, margins: rand })] : []),
        ...Array.from({ length: spalten }, (_, i) => tcell(
          zeile([hand(b.kopf![i] ?? '', m.text, { bold: true, color: COLOR.inkSoft })], g, { tab: true, align: i > 0 ? AlignmentType.RIGHT : undefined }),
          { width: pct(breite(i)), borders: linie, margins: i === spalten - 1 ? { ...rand, right: 0 } : rand },
        )),
      ],
    }))
  }
  zeilen.forEach((z, zi) => {
    const form = markeForm(bild, z.marke)
    const letzteStarke = z.stark && zi === zeilen.length - 1
    const kante = letzteStarke ? { ...OHNE, top: { style: BorderStyle.SINGLE, size: 6, color: COLOR.inkSoft } } : punktiert
    rows.push(new TableRow({
      cantSplit: true,
      children: [
        ...(mitMarke ? [tcell(zeile(form ? [zeichen(form, m.text)] : [hand('', m.text)], g, { tab: true }), { width: pct(marke), borders: kante, margins: rand })] : []),
        ...Array.from({ length: spalten }, (_, i) => {
          const t = z.zellen[i] ?? ''
          return tcell(
            zeile([hand(t, m.text, { bold: !!z.stark })], g, { tab: true, align: i > 0 && istZahl(t) ? AlignmentType.RIGHT : undefined }),
            { width: pct(breite(i)), borders: kante, margins: i === spalten - 1 ? { ...rand, right: 0 } : rand },
          )
        }),
      ],
    }))
  })
  return new Table({ width: pct(100), rows })
}

function blockZelle(bild: ProduktBild, b: ProduktBildBlock, g: Groesse, akzent: string, breite: number, letzte: boolean): TableCell {
  const m = MASS[g]
  const titel = zeile([hand(b.titel || '', m.titel, { bold: true, color: akzent })], g, {
    after: g === 'klein' ? 20 : 60,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: akzent, space: 1 } },
    keepNext: true,
  })
  const inhalt: Block[] = b.kopf?.length || b.zeilen?.length ? [tabelleDocx(bild, b, g), p('', { spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT } })] : listeDocx(bild, b, g)
  return tcell([titel, ...inhalt], {
    width: pct(breite),
    borders: OHNE,
    margins: { top: 0, bottom: 0, left: 0, right: letzte ? 0 : g === 'klein' ? 160 : 260 },
  })
}

/** Die Blöcke nebeneinander, höchstens drei je Zeile, Breiten wie im HTML (blockGewichte). */
function bloeckeDocx(bild: ProduktBild, g: Groesse, akzent: string): Table | null {
  const bloecke = (bild.bloecke || []).filter(Boolean)
  if (!bloecke.length) return null
  const rows: TableRow[] = []
  for (let i = 0; i < bloecke.length; i += 3) {
    const teil = bloecke.slice(i, i + 3)
    const gew = bloecke.length > 3 ? teil.map(() => 1) : blockGewichte(teil, tabellenBonus(g))
    const summe = gew.reduce((a, b) => a + b, 0)
    const zellen = teil.map((b, j) => blockZelle(bild, b, g, akzent, Math.round((gew[j] / summe) * 100), j === teil.length - 1))
    rows.push(new TableRow({ children: zellen }))
  }
  return new Table({ width: pct(100), rows })
}

/**
 * Das Blatt als eine umrandete Tabellenzelle: Kopfzeile, darunter die Blöcke.
 * Gegenstück zu <ProduktBildBlatt>; `hinweis` wird nie gesetzt.
 */
export function produktBildDocx(bild: ProduktBild, groesse: Groesse, akzent: string): Table {
  const kante = { style: BorderStyle.SINGLE, size: 6, color: COLOR.inkMute }
  const bloecke = bloeckeDocx(bild, groesse, akzent)
  const zwischen = p('', { spacing: { before: 0, after: 0, line: groesse === 'klein' ? 60 : 160, lineRule: LineRuleType.EXACT } })
  const inhalt: Block[] = [...kopfDocx(bild, groesse), zwischen, ...(bloecke ? [bloecke] : []), p('', { spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT } })]
  const rand = groesse === 'klein' ? { top: 50, bottom: 50, left: 130, right: 130 } : { top: 200, bottom: 220, left: 260, right: 260 }
  return new Table({
    width: pct(100),
    rows: [new TableRow({ children: [tcell(inhalt, { borders: { top: kante, bottom: kante, left: kante, right: kante }, margins: rand })] })],
  })
}

/** Heft S. 6: Beschriftung + Unterzeile, darunter das Blatt `klein`. Gegenstück zu <BeispielBand>. */
export function beispielBandDocx(bild: ProduktBild, akzent: string): Block[] {
  return [
    new Paragraph({
      children: [
        new TextRun({ text: 'SO KANN IHR PRODUKT AUSSEHEN', color: akzent, bold: true, size: 14, font: 'Consolas' }),
        new TextRun({ text: '   Beispiel an einem anderen Fall — bei Ihnen zählt die Form, nicht der Inhalt.', italics: true, color: COLOR.inkSoft, size: 16 }),
      ],
      spacing: { before: 120, after: 40 },
      keepNext: true,
    }),
    produktBildDocx(bild, 'klein', akzent),
  ]
}

export interface BuildLoesungsblattOpts {
  sit: SituationJson
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

/** Lösungsblatt (nur Lehrperson): ein Abschnitt, eine Seite. `null` ohne `loesungsbild`. */
export function buildLoesungsblatt({ sit, abteilung, logoPng = null }: BuildLoesungsblattOpts): Document | null {
  const bild = sit.handlungsprodukt?.loesungsbild
  if (!bild) return null
  const { akzent } = heftPalette(sit)
  const titel = loesungsblattTitel(sit)
  const docCode = loesungsblattDocCode(sit)
  const strich = { style: BorderStyle.DASHED, size: 4, color: COLOR.inkSoft }
  const lpKasten = new Table({
    width: pct(100),
    rows: [new TableRow({
      cantSplit: true,
      children: [tcell([
        p('NUR FÜR DIE LEHRPERSON', { run: { color: akzent, bold: true, size: 14, font: 'Consolas' }, spacing: { after: 40 } }),
        p(bild.hinweis || LOESUNG_HINWEIS_ERSATZ, { run: { size: 19 }, spacing: { after: 0, line: 264, lineRule: LineRuleType.AUTO } }),
      ], {
        borders: { top: strich, bottom: strich, right: strich, left: { style: BorderStyle.SINGLE, size: 24, color: akzent } },
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
      })],
    })],
  })
  return new Document({
    creator: 'HKO Renderer',
    title: titel,
    description: docCode,
    sections: [{
      ...sectionProps(docCode, titel, abteilung, logoPng),
      children: [
        ...sectionHead('LP', titel, akzent),
        lpKasten,
        p('', { spacing: { before: 0, after: 0, line: 200, lineRule: LineRuleType.EXACT } }),
        produktBildDocx(bild, 'gross', akzent),
      ],
    }],
  })
}
