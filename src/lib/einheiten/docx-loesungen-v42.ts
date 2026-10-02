// docx-loesungen-v42.ts — Dokument «Lösungen» (v4.2, E19, nur Lehrperson) als Word.
// Gegenstück zu src/components/einheiten/docs/DocLoesungenV42.tsx; beide lesen dasselbe
// Modell (loesungen-v42.ts), damit HTML und Word nie auseinanderlaufen.
//
// Lösungen in Plattform-Grün (BBW_GRUEN), Aufgaben und Spaltenköpfe schwarz, Hinweise für
// die Lehrperson grau und kleiner. Keine Schreiblinien: die Lösung ist normaler Text.
// Jeder Abschnitt beginnt auf einer neuen Seite (S. 2 · S. 3 · S. 4 · Produkt · Abschluss).
//
// Importiert nur aus docx-primitives.ts, docx-heft-v42-gemeinsam.ts und
// docx-produkt-bild-v42.ts, nie aus docx-builder.ts (zirkulär über buildHeftV42).

import {
  Document, Paragraph, TextRun, Table, TableRow, BorderStyle, LineRuleType, WidthType,
} from 'docx'
import { BBW_GRUEN, COLOR, h, sectionProps, tcell } from './docx-primitives'
import { heftPalette } from './docx-heft-v42-gemeinsam'
import { produktBildDocx } from './docx-produkt-bild-v42'
import {
  LOESUNG_ERKLAERUNG, loesungenModell,
  type LoesungenModell, type LsAbschluss, type LsBeurteilen, type LsLeitfrage, type LsProdukt, type LsRaster, type LsZeile,
} from './loesungen-v42'
import type { SituationJson } from './types'

type Block = Paragraph | Table

/** Schriftgrössen in halben Punkten: Text 10 pt, Hinweise 9 pt, Labels 8,5 pt (Untergrenze). */
const TEXT = 20
const HINWEIS = 18
const KLEIN = 17
const ZEILE = { line: 264, lineRule: LineRuleType.AUTO }

const KEIN = { style: BorderStyle.NIL, size: 0, color: 'FFFFFF' }
const OHNE = { top: KEIN, bottom: KEIN, left: KEIN, right: KEIN }
const pct = (n: number) => ({ size: n, type: WidthType.PERCENTAGE })

function run(text: string, o: { color?: string; size?: number; bold?: boolean; italics?: boolean; font?: string } = {}): TextRun {
  return new TextRun({ text, color: o.color ?? COLOR.ink, size: o.size ?? TEXT, bold: o.bold, italics: o.italics, font: o.font })
}
/** Lösung: grüner Text. */
const gruen = (text: string, size = TEXT) => run(text, { color: BBW_GRUEN, size })

function absatz(children: TextRun[], o: { after?: number; before?: number; indent?: any; keepNext?: boolean } = {}): Paragraph {
  return new Paragraph({
    children,
    indent: o.indent,
    keepNext: o.keepNext,
    spacing: { before: o.before ?? 0, after: o.after ?? 80, ...ZEILE },
  })
}

/** Beschriftung eines Teils (`RASTER`, `BEFUND` …), grau, Monospace. */
function label(text: string): Paragraph {
  return absatz([run(text.toUpperCase(), { color: COLOR.inkSoft, size: KLEIN, bold: true, font: 'Consolas' })], { before: 120, after: 40, keepNext: true })
}

/**
 * Abschnittskopf wie sectionHead() aus docx-primitives, aber mit Seitenumbruch davor —
 * ein PageBreak-Run liesse oben auf der neuen Seite eine Leerzeile stehen.
 */
function abschnittKopf(num: string, titel: string, akzent: string, neueSeite: boolean): Paragraph[] {
  return [
    new Paragraph({
      children: [new TextRun({ text: num, color: akzent, size: 16, bold: true, font: 'Consolas' })],
      spacing: { before: neueSeite ? 0 : 180, after: 30 },
      pageBreakBefore: neueSeite,
      keepNext: true,
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 3 } },
    }),
    h(titel, 'section', COLOR.ink),
  ]
}

function frage(nr: number, text: string, akzent: string): Paragraph {
  return absatz([
    run(`LF${nr}  `, { color: akzent, size: KLEIN, bold: true, font: 'Consolas' }),
    run(text, { bold: true }),
  ], { before: 80, after: 80, keepNext: true })
}

/** Zeilen als randlose Tabelle: Label fett links, Text rechts (grün oder, als Hinweis, grau), Quelle klein dahinter. */
function zeilenDocx(zeilen: LsZeile[], hinweis = false): Table {
  const size = hinweis ? HINWEIS : TEXT
  const farbe = hinweis ? COLOR.inkSoft : BBW_GRUEN
  const rand = { top: 20, bottom: 40, left: 0, right: 120 }
  return new Table({
    width: pct(100),
    rows: zeilen.map((z) => new TableRow({
      cantSplit: true,
      children: [
        tcell(absatz([run(z.label ?? '', { bold: true, size, color: hinweis ? COLOR.inkSoft : COLOR.ink })], { after: 0 }), { width: pct(22), borders: OHNE, margins: rand }),
        tcell(absatz([
          run(z.text, { color: farbe, size }),
          ...(z.quelle ? [run(`   ${z.quelle}`, { color: COLOR.inkMute, size: KLEIN })] : []),
        ], { after: 0 }), { width: pct(78), borders: OHNE, margins: { ...rand, right: 0 } }),
      ],
    })),
  })
}

/** Tabelle für Raster und Denkhilfe: Köpfe schwarz, Zellen grün, Beispielzeile grau. */
function tabelleDocx(spalten: string[], zeilen: string[][], beispiel?: string[], breiten?: number[]): Table {
  const n = Math.max(spalten.length, beispiel?.length ?? 0, ...zeilen.map((z) => z.length))
  const w = (i: number) => pct(breiten?.[i] ?? Math.round(100 / n))
  const kopfKante = { ...OHNE, bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOR.ink } }
  const zeilenKante = { ...OHNE, bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule } }
  const rand = (i: number) => ({ top: 50, bottom: 50, left: 0, right: i === n - 1 ? 0 : 120 })
  const rows: TableRow[] = [new TableRow({
    tableHeader: true,
    children: Array.from({ length: n }, (_, i) => tcell(
      absatz([run(spalten[i] ?? '', { bold: true })], { after: 0 }),
      { width: w(i), borders: kopfKante, margins: rand(i) },
    )),
  })]
  if (beispiel) {
    rows.push(new TableRow({
      cantSplit: true,
      children: Array.from({ length: n }, (_, i) => tcell([
        absatz([run(beispiel[i] ?? '', { color: COLOR.inkSoft, italics: true })], { after: 0 }),
        ...(i === 0 ? [absatz([run('Beispiel im Heft', { color: COLOR.inkMute, size: KLEIN, bold: true })], { after: 0 })] : []),
      ], { width: w(i), borders: zeilenKante, margins: rand(i) })),
    }))
  }
  for (const z of zeilen) {
    rows.push(new TableRow({
      cantSplit: true,
      children: Array.from({ length: n }, (_, i) => tcell(
        absatz([gruen(z[i] ?? '')], { after: 0 }),
        { width: w(i), borders: zeilenKante, margins: rand(i) },
      )),
    }))
  }
  return new Table({ width: pct(100), rows })
}

function liste(items: TextRun[][]): Paragraph[] {
  return items.map((runs) => absatz([run('–\t'), ...runs], { after: 40, indent: { left: 280, hanging: 280 } }))
}

// ── Abschnitte ────────────────────────────────────────────────────────────

function kopfDocx(m: LoesungenModell): Block[] {
  const kasten = { style: BorderStyle.SINGLE, size: 10, color: COLOR.ink, space: 2 }
  return [
    absatz([run(m.titel, { size: 32, bold: true })], { after: 60 }),
    new Paragraph({
      children: [run('NUR FÜR DIE LEHRPERSON', { size: KLEIN, bold: true, font: 'Consolas' })],
      border: { top: kasten, bottom: kasten, left: kasten, right: kasten },
      indent: { right: 6700 },
      spacing: { before: 40, after: 100 },
    }),
    ...(m.heftTitel ? [absatz([run(m.heftTitel, { color: COLOR.inkSoft, size: 20 })], { after: 60 })] : []),
    new Paragraph({
      children: [run('■ ', { color: BBW_GRUEN, size: 22 }), run(LOESUNG_ERKLAERUNG, { color: COLOR.inkSoft, size: 18 })],
      spacing: { before: 0, after: 120, ...ZEILE },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 6 } },
    }),
  ]
}

function s2Docx(lfs: LsLeitfrage[], akzent: string, neueSeite: boolean): Block[] {
  const out: Block[] = abschnittKopf('02', 'Wissensecke I · Leitfragen 1 und 2', akzent, neueSeite)
  for (const lf of lfs) out.push(frage(lf.nr, lf.text, akzent), zeilenDocx(lf.zeilen))
  return out
}

function s3Docx(r: LsRaster, akzent: string, neueSeite: boolean): Block[] {
  const out: Block[] = [...abschnittKopf('03', `Quelle · Leitfrage ${r.nr}`, akzent, neueSeite), frage(r.nr, r.text, akzent)]
  if (r.quelle || r.stand) {
    const meta = [r.quelle, r.stand && `Lösung geprüft am ${r.stand}`].filter(Boolean).join(' · ')
    out.push(absatz([run(meta, { color: COLOR.inkSoft, size: KLEIN })], { after: 40 }))
  }
  if (r.spalten.length && (r.zeilen.length || r.beispiel)) {
    out.push(label('Raster'), tabelleDocx(r.spalten, r.zeilen, r.beispiel, r.breiten))
  }
  if (r.befund) out.push(label('Befund'), absatz([gruen(r.befund)]))
  if (r.hinweise.length) out.push(label('Hinweise für die Lehrperson'), zeilenDocx(r.hinweise, true))
  return out
}

function s4Docx(b: LsBeurteilen, akzent: string, neueSeite: boolean): Block[] {
  const out: Block[] = [...abschnittKopf('04', `Wissensecke II · Leitfrage ${b.nr}`, akzent, neueSeite), frage(b.nr, b.text, akzent)]
  if (b.gutWenn.length) {
    out.push(label('Tragfähig, wenn …'), ...liste(b.gutWenn.map((g) => [run(g)])))
    if (b.tragfaehig) out.push(absatz([run(b.tragfaehig)]))
  }
  b.antworten.forEach((a, i) => {
    out.push(label(`Mögliche Antwort${b.antworten.length > 1 ? ` ${i + 1}` : ''}`), absatz([gruen(a)]))
  })
  if (b.nichtTragfaehig) out.push(label('Nicht tragfähig'), absatz([run(b.nichtTragfaehig)]))
  if (b.denkhilfe) out.push(label(b.denkhilfe.titel), tabelleDocx(b.denkhilfe.spalten, b.denkhilfe.zeilen))
  if (b.vertiefungen.length) {
    const kante = { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule }
    const breite = Math.round(100 / b.vertiefungen.length)
    out.push(label(b.vertiefungTitel || 'Vertiefung'), new Table({
      width: pct(100),
      rows: [new TableRow({
        cantSplit: true,
        children: b.vertiefungen.map((v) => tcell([
          absatz([run(v.titel, { bold: true })], { after: 20 }),
          ...(v.herkunft ? [absatz([run(v.herkunft, { color: COLOR.inkSoft, size: KLEIN })], { after: 40 })] : []),
          ...(v.frage ? [absatz([run(v.frage, { italics: true })], { after: 60 })] : []),
          absatz([gruen(v.erwartung)], { after: 0 }),
        ], { width: pct(breite), borders: { top: kante, bottom: kante, left: kante, right: kante }, margins: { top: 80, bottom: 80, left: 120, right: 120 } })),
      })],
    }))
  }
  return out
}

function produktDocx(pr: LsProdukt, akzent: string, neueSeite: boolean): Block[] {
  return [
    ...abschnittKopf('07', `Produkt${pr.titel ? ` · ${pr.titel}` : ''}`, akzent, neueSeite),
    ...(pr.hinweis ? [absatz([run(pr.hinweis, { color: COLOR.inkSoft })], { after: 160 })] : []),
    produktBildDocx(pr.bild, 'gross', akzent, BBW_GRUEN),
  ]
}

/** Das Transfer-Feld ist kein Begriff, sondern ein Feld — in Guillemets, wie im HTML. */
const knoten = (k: string, a: LsAbschluss) => (k === a.transferTitel ? `«${k}»` : k)

function abschlussDocx(a: LsAbschluss, akzent: string, neueSeite: boolean): Block[] {
  const out: Block[] = abschnittKopf('08', 'Abschluss', akzent, neueSeite)
  if (a.verbindungen.length) {
    out.push(label('Begriffsnetz · beschriftete Verbindungen'),
      ...liste(a.verbindungen.map((v) => [run(`${knoten(v.von, a)} → ${knoten(v.nach, a)}: `), gruen(v.text)])))
  }
  if (a.eigeneKnoten.length) out.push(label('Leere Knoten · aus dem Raster'), absatz([gruen(a.eigeneKnoten.join(' · '))]))
  if (a.transfer) out.push(label(`Feld «${a.transferTitel}»`), absatz([gruen(a.transfer)]))
  if (a.quercheck.length) {
    out.push(label('Quer-Check'))
    for (const q of a.quercheck) {
      out.push(absatz([run(q.frage)], { after: 20, keepNext: true }), absatz([gruen(q.antwort)], { indent: { left: 227 } }))
    }
  }
  if (a.mitnahme.length) out.push(label('Das nehme ich mit'), zeilenDocx(a.mitnahme.map((x) => ({ label: x.label, text: x.eintrag }))))
  return out
}

export interface BuildLoesungenOpts {
  sit: SituationJson
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

/** Dokument «Lösungen» eines Hefts in seiner Spur. `null`, wenn das Heft keine Lösung trägt. */
export function buildLoesungen({ sit, abteilung, logoPng = null }: BuildLoesungenOpts): Document | null {
  const m = loesungenModell(sit)
  if (!m) return null
  const { akzent } = heftPalette(sit)
  const teile: ((neueSeite: boolean) => Block[])[] = []
  if (m.s2.length) teile.push((n) => s2Docx(m.s2, akzent, n))
  if (m.s3) teile.push((n) => s3Docx(m.s3!, akzent, n))
  if (m.s4) teile.push((n) => s4Docx(m.s4!, akzent, n))
  if (m.produkt) teile.push((n) => produktDocx(m.produkt!, akzent, n))
  if (m.abschluss) teile.push((n) => abschlussDocx(m.abschluss!, akzent, n))
  return new Document({
    creator: 'HKO Renderer',
    title: m.titel,
    description: m.docCode,
    sections: [{
      ...sectionProps(m.docCode, m.titel, abteilung, logoPng),
      children: [...kopfDocx(m), ...teile.flatMap((t, i) => t(i > 0))],
    }],
  })
}
