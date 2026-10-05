// docx-produkt-bild-v42.ts — Produktbild v4.2 als Word: das ausgefüllte Handlungsprodukt
// als Tabelle (kein Bild), das Band für Heft S. 6 und das Blatt im Dokument «Lösungen»
// (docx-loesungen-v42.ts, Einträge in Lösungsgrün über `tinte`).
// Spiegel von heft-v42/produkt-bild.tsx — gleiche Ableitungen
// (Zeichen der Markierung, Spaltengewichte, Zahlenspalten) kommen von dort, damit HTML und
// Word nie auseinanderlaufen.
//
// Importiert nur aus docx-primitives.ts und docx-heft-v42-gemeinsam.ts, nie aus
// docx-builder.ts (zirkulär über buildHeftV42).

import {
  Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, LineRuleType, TabStopType, VerticalAlign, WidthType,
} from 'docx'
import { COLOR, p, tcell } from './docx-primitives'
import { blockArt, blockGewichte, istZahl, markeForm, tabellenBonus, type MarkeForm } from '../../components/einheiten/docs/heft-v42/produkt-bild'
import type { ProduktBild, ProduktBildBlock } from './types'

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

function zeichen(form: MarkeForm, size: number, color: string = COLOR.ink): TextRun {
  return new TextRun({ text: ZEICHEN[form], font: SYMBOL, size, color })
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

function listeDocx(bild: ProduktBild, b: ProduktBildBlock, g: Groesse, tinte: string): Paragraph[] {
  const m = MASS[g]
  const out: Paragraph[] = []
  for (const e of (b.eintraege || []).filter((x) => x && x.text)) {
    const form = markeForm(bild, e.marke)
    const runs = form ? [zeichen(form, m.text, tinte), hand(` ${e.text}`, m.text, { color: tinte })] : [hand(e.text, m.text, { color: tinte })]
    // Hängender Einzug: Folgezeilen beginnen unter dem Text, nicht unter dem Kreis.
    const einzug = form ? { left: g === 'klein' ? 170 : 260, hanging: g === 'klein' ? 170 : 260 } : undefined
    out.push(new Paragraph({
      children: runs,
      indent: einzug,
      spacing: { before: 0, after: e.notiz ? 0 : m.luft, line: m.zeile, lineRule: LineRuleType.EXACT },
    }))
    if (e.notiz) {
      out.push(new Paragraph({
        children: [hand(e.notiz, m.klein, { color: tinte === COLOR.ink ? COLOR.inkSoft : tinte })],
        indent: einzug ? { left: einzug.left } : undefined,
        spacing: { before: 0, after: m.luft, line: m.zeile, lineRule: LineRuleType.EXACT },
      }))
    }
  }
  return out
}

/** E26 — Fliesstext: Absätze in der Schreibschrift der Listen. */
function textDocx(b: ProduktBildBlock, g: Groesse, tinte: string): Paragraph[] {
  const m = MASS[g]
  const absaetze = (b.text || []).filter(Boolean)
  return absaetze.map((t, i) => new Paragraph({
    children: [hand(t, m.text, { color: tinte })],
    spacing: { before: 0, after: i < absaetze.length - 1 ? (g === 'klein' ? 40 : 100) : m.luft, line: m.zeile, lineRule: LineRuleType.EXACT },
  }))
}

/**
 * E26 — Wechselrede: je Beitrag ein Absatz, Sprecher links (fett, klein), Beitrag hängend
 * daneben. Die Sprecherspalte ist so breit wie der längste Name (Segoe Print, geschätzt);
 * mit Markierungen steht davor eine Spalte für den Kreis.
 */
function wechselDocx(bild: ProduktBild, b: ProduktBildBlock, g: Groesse, tinte: string): Paragraph[] {
  const m = MASS[g]
  const beitraege = (b.wechsel || []).filter((w) => w && w.text)
  const mitMarke = beitraege.some((w) => markeForm(bild, w.marke))
  const marke = mitMarke ? (g === 'klein' ? 170 : 260) : 0
  const laengster = Math.max(0, ...beitraege.map((w) => (w.wer || '').length))
  // Zeichenbreite ≈ 0.68 em (fett); m.klein ist in halben Punkten, 1 pt = 20 Twips.
  const links = marke + Math.round((laengster + 1) * (m.klein / 2) * 0.68 * 20)
  const farbeWer = tinte === COLOR.ink ? COLOR.inkSoft : tinte
  return beitraege.map((w) => {
    const form = markeForm(bild, w.marke)
    return new Paragraph({
      children: [
        ...(mitMarke ? [...(form ? [zeichen(form, m.text, tinte)] : []), hand('\t', m.klein)] : []),
        hand(w.wer || '', m.klein, { bold: true, color: farbeWer }),
        hand('\t', m.text),
        hand(w.text, m.text, { color: tinte }),
      ],
      tabStops: [...(mitMarke ? [{ type: TabStopType.LEFT, position: marke }] : []), { type: TabStopType.LEFT, position: links }],
      indent: { left: links, hanging: links },
      spacing: { before: 0, after: m.luft, line: m.zeile, lineRule: LineRuleType.EXACT },
    })
  })
}

function tabelleDocx(bild: ProduktBild, b: ProduktBildBlock, g: Groesse, tinte: string): Table {
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
        ...(mitMarke ? [tcell(zeile(form ? [zeichen(form, m.text, tinte)] : [hand('', m.text)], g, { tab: true }), { width: pct(marke), borders: kante, margins: rand })] : []),
        ...Array.from({ length: spalten }, (_, i) => {
          const t = z.zellen[i] ?? ''
          return tcell(
            zeile([hand(t, m.text, { bold: !!z.stark, color: tinte })], g, { tab: true, align: i > 0 && istZahl(t) ? AlignmentType.RIGHT : undefined }),
            { width: pct(breite(i)), borders: kante, margins: i === spalten - 1 ? { ...rand, right: 0 } : rand },
          )
        }),
      ],
    }))
  })
  return new Table({ width: pct(100), rows })
}

function blockZelle(bild: ProduktBild, b: ProduktBildBlock, g: Groesse, akzent: string, tinte: string, breite: number, letzte: boolean): TableCell {
  const m = MASS[g]
  const titel = zeile([hand(b.titel || '', m.titel, { bold: true, color: akzent })], g, {
    after: g === 'klein' ? 20 : 60,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: akzent, space: 1 } },
    keepNext: true,
  })
  const art = blockArt(b)
  const inhalt: Block[] = art === 'tabelle' ? [tabelleDocx(bild, b, g, tinte), p('', { spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT } })]
    : art === 'wechsel' ? wechselDocx(bild, b, g, tinte)
    : art === 'text' ? textDocx(b, g, tinte)
    : listeDocx(bild, b, g, tinte)
  return tcell([titel, ...inhalt], {
    width: pct(breite),
    borders: OHNE,
    margins: { top: 0, bottom: 0, left: 0, right: letzte ? 0 : g === 'klein' ? 160 : 260 },
  })
}

/** Die Blöcke nebeneinander, höchstens drei je Zeile, Breiten wie im HTML (blockGewichte). */
function bloeckeDocx(bild: ProduktBild, g: Groesse, akzent: string, tinte: string): Table | null {
  const bloecke = (bild.bloecke || []).filter(Boolean)
  if (!bloecke.length) return null
  const rows: TableRow[] = []
  for (let i = 0; i < bloecke.length; i += 3) {
    const teil = bloecke.slice(i, i + 3)
    const gew = bloecke.length > 3 ? teil.map(() => 1) : blockGewichte(teil, tabellenBonus(g))
    const summe = gew.reduce((a, b) => a + b, 0)
    const zellen = teil.map((b, j) => blockZelle(bild, b, g, akzent, tinte, Math.round((gew[j] / summe) * 100), j === teil.length - 1))
    rows.push(new TableRow({ children: zellen }))
  }
  return new Table({ width: pct(100), rows })
}

/**
 * Das Blatt als eine umrandete Tabellenzelle: Kopfzeile, darunter die Blöcke.
 * Gegenstück zu <ProduktBildBlatt>; `hinweis` wird nie gesetzt. `tinte`: Farbe der
 * Einträge (Text, Notizen, Zellen, Markierungen) — Standard Tinte; das Dokument «Lösungen»
 * gibt Lösungsgrün (wie `loesung` im HTML). Titel, Legende, Köpfe bleiben.
 */
export function produktBildDocx(bild: ProduktBild, groesse: Groesse, akzent: string, tinte: string = COLOR.ink): Table {
  const kante = { style: BorderStyle.SINGLE, size: 6, color: COLOR.inkMute }
  const bloecke = bloeckeDocx(bild, groesse, akzent, tinte)
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
