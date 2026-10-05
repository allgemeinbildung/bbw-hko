// docx-begriffsnetz-v42.ts — Heft v4.2 (Word), Seite 8: Begriffsnetz, Glossar des Hefts,
// Checkliste in zwei Spalten (Entscheid E17). Spiegel von heft-v42/begriffsnetz.tsx.
//
// Word kann nicht frei platzieren: das Netz ist eine Tabelle ohne sichtbares Gitter.
// Die Regionen sind Zellen, die Knoten umrandete Zellen einer inneren Tabelle mit zwei
// Spuren (aussen/innen) und einer leeren Spalte dazwischen — aufeinanderfolgende Knoten
// wechseln die Spur wie im HTML (knotenSpur), darum stehen sie versetzt. Keine Linien.
//
// Importiert nur aus docx-primitives.ts und der Komponente (Platzierungsregel, eine
// Quelle), nie aus docx-builder.ts.

import {
  Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, HeightRule, LineRuleType, TabStopType, VerticalAlign, WidthType,
} from 'docx'
import { COLOR, MM, p } from './docx-primitives'
import type { HeftDocxKontext } from './docx-heft-v42-gemeinsam'
import { checklistenZeilen, knotenSpur, netzAeste } from '../../components/einheiten/docs/heft-v42/begriffsnetz'
import type { SituationJson } from './types'

type Block = Paragraph | Table
type Rand = { style: (typeof BorderStyle)[keyof typeof BorderStyle]; size: number; color: string }

const KEIN: Rand = { style: BorderStyle.NIL, size: 0, color: 'FFFFFF' }
const OHNE = { top: KEIN, bottom: KEIN, left: KEIN, right: KEIN }
const pct = (n: number) => ({ size: n, type: WidthType.PERCENTAGE })
const rundum = (r: Rand) => ({ top: r, bottom: r, left: r, right: r })

/** Satzbreite 170 mm in Twips (A4 minus 2 × 20 mm, sectionProps). */
const SATZ = Math.round(170 * MM)

/** Word verlangt am Ende jeder Zelle einen Absatz — auch nach einer inneren Tabelle. */
function schluss(): Paragraph {
  return new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT } })
}

/** Beschriftung über einem Block — Gegenstück zu `.v42-kasten-label`. */
export function bnLabel(text: string, ctx: HeftDocxKontext, oben = false): Paragraph {
  return p(text.toUpperCase(), {
    run: { color: ctx.akzent, bold: true, size: 14, font: 'Consolas' },
    spacing: { before: oben ? 40 : 0, after: 30 },
    keepNext: true,
    border: oben ? { top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 3 } } : undefined,
  })
}

// ---------------------------------------------------------------------------
// Begriffsnetz
// ---------------------------------------------------------------------------

/** Ein Knoten: umrandete Zelle, Begriff zeichengleich, zentriert. */
function knotenZelle(text: string, breite: number): TableCell {
  return new TableCell({
    width: pct(breite),
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 20, bottom: 20, left: 60, right: 60 },
    borders: rundum({ style: BorderStyle.SINGLE, size: 6, color: COLOR.inkSoft }),
    children: [p(text, { run: { bold: true, size: 17 }, alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 228, lineRule: LineRuleType.AUTO } })],
  })
}

function leerZelle(breite: number): TableCell {
  return new TableCell({ width: pct(breite), borders: OHNE, margins: { top: 0, bottom: 0, left: 0, right: 0 }, children: [p('', { spacing: { before: 0, after: 0 } })] })
}

/**
 * Knoten einer Region als innere Tabelle: Spalten aussen · Luft · innen (rechts gespiegelt).
 * Zeile i trägt Knoten i in seiner Spur; die andere Spur bleibt leer — das ist die Luft
 * zwischen den Knoten, an die Linien und Beschriftungen kommen.
 */
function knotenTabelle(punkte: string[], region: number, rechts: boolean): Table {
  const B = [42, 16, 42]
  const zeilen = punkte.map((pt, i) => {
    const spur = knotenSpur(i, punkte.length, region)
    const links = (spur === 'aussen') !== rechts
    return new TableRow({
      cantSplit: true,
      height: { value: Math.round(6.2 * MM), rule: HeightRule.ATLEAST },
      children: links
        ? [knotenZelle(pt, B[0]), leerZelle(B[1]), leerZelle(B[2])]
        : [leerZelle(B[0]), leerZelle(B[1]), knotenZelle(pt, B[2])],
    })
  })
  return new Table({ width: pct(100), rows: zeilen })
}

/** Ast-Titel klein in der Heftfarbe — Gegenstück zu `.v42-bn-titel`. */
function astTitel(text: string, ctx: HeftDocxKontext, rechts: boolean, vorher = 0): Paragraph {
  return p(text.toUpperCase(), {
    run: { color: ctx.akzent, bold: true, size: 14, font: 'Consolas' },
    alignment: rechts ? AlignmentType.RIGHT : AlignmentType.LEFT,
    spacing: { before: vorher, after: 60 },
  })
}

/** Leerer Knoten «aus meinem Raster»: gestrichelt, Beschriftung blass oben. */
function leerKnoten(): Table {
  return new Table({
    width: { size: Math.round(32 * MM), type: WidthType.DXA },
    alignment: AlignmentType.CENTER,
    rows: [new TableRow({
      cantSplit: true,
      height: { value: Math.round(10 * MM), rule: HeightRule.EXACT },
      children: [new TableCell({
        width: { size: Math.round(32 * MM), type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 20, bottom: 0, left: 60, right: 60 },
        borders: rundum({ style: BorderStyle.DASHED, size: 6, color: COLOR.inkMute }),
        children: [p('aus meinem Raster', { run: { size: 14, color: COLOR.inkMute }, alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } })],
      })],
    })],
  })
}

/** Zentrum: Kontur in der Heftfarbe, Text zeichengleich. */
function zentrum(text: string, ctx: HeftDocxKontext): Table {
  const breite = Math.round(64 * MM)
  return new Table({
    width: { size: breite, type: WidthType.DXA },
    alignment: AlignmentType.CENTER,
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        width: { size: breite, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        borders: rundum({ style: BorderStyle.SINGLE, size: 12, color: ctx.akzent }),
        children: [p(text, { run: { bold: true, size: 20 }, alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO } })],
      })],
    })],
  })
}

/** Transfer-Feld «gilt auch bei …»: gestrichelter Kasten mit drei Schreiblinien. */
function transferZelle(titel: string, spalten: number): TableCell {
  const strich: Rand = { style: BorderStyle.DASHED, size: 6, color: COLOR.inkSoft }
  const zeile = () => new Paragraph({
    children: [new TextRun({ text: '' })],
    spacing: { before: 0, after: 0, line: Math.round(5.5 * MM), lineRule: LineRuleType.EXACT },
    // `between`: sonst zieht Word nur unter der letzten der gleich umrandeten Zeilen eine Linie.
    border: { bottom: { style: BorderStyle.DOTTED, size: 4, color: COLOR.inkMute }, between: { style: BorderStyle.DOTTED, size: 4, color: COLOR.inkMute } },
  })
  return new TableCell({
    columnSpan: spalten,
    verticalAlign: VerticalAlign.BOTTOM,
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    borders: { top: strich, bottom: strich, right: strich, left: { style: BorderStyle.DASHED, size: 24, color: COLOR.inkSoft } },
    children: [p(titel, { run: { bold: true, size: 18 }, spacing: { before: 0, after: 0 } }), zeile(), zeile(), zeile()],
  })
}

/**
 * Begriffsnetz als Tabelle ohne Gitter, fünf Spalten (22 · 24 · 8 · 24 · 22 %):
 * oben Ast 1 | Luft | Ast 2 · Mitte leerer Knoten | Zentrum | leerer Knoten ·
 * unten Ast 3 | Luft | Transfer-Feld.
 */
export function begriffsnetzTabelle(sit: SituationJson, ctx: HeftDocxKontext): Table {
  const { aeste, transfer } = netzAeste(sit)
  const S = [22, 24, 8, 24, 22]
  const zelle = (kinder: Block[], spalten: number, breite: number, mitte = false) => new TableCell({
    columnSpan: spalten,
    width: pct(breite),
    verticalAlign: mitte ? VerticalAlign.CENTER : VerticalAlign.TOP,
    borders: OHNE,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    children: kinder.length ? kinder : [p('', { spacing: { before: 0, after: 0 } })],
  })
  const region = (a: number, rechts: boolean, titelUnten: boolean): Block[] => {
    const ast = aeste[a]
    if (!ast) return []
    const punkte = (ast.punkte || []).slice(0, 5)
    const tabelle = knotenTabelle(punkte, a, rechts)
    return titelUnten
      ? [tabelle, astTitel(ast.titel, ctx, rechts, 80)]
      : [astTitel(ast.titel, ctx, rechts), tabelle, schluss()]
  }
  const mitteHoehe = { value: Math.round(15 * MM), rule: HeightRule.ATLEAST }
  return new Table({
    width: { size: SATZ, type: WidthType.DXA },
    columnWidths: S.map((s) => Math.round((SATZ * s) / 100)),
    rows: [
      new TableRow({
        cantSplit: true,
        children: [zelle(region(0, false, false), 2, S[0] + S[1]), zelle([], 1, S[2]), zelle(region(1, true, false), 2, S[3] + S[4])],
      }),
      new TableRow({
        cantSplit: true,
        height: mitteHoehe,
        children: [
          zelle([leerKnoten(), schluss()], 1, S[0], true),
          zelle([zentrum(sit.mindmap_zentrum || '', ctx), schluss()], 3, S[1] + S[2] + S[3], true),
          zelle([leerKnoten(), schluss()], 1, S[4], true),
        ],
      }),
      new TableRow({
        cantSplit: true,
        children: [
          zelle(region(2, false, true), 2, S[0] + S[1]),
          zelle([], 1, S[2]),
          transferZelle(transfer?.titel || 'gilt auch bei …', 2),
        ],
      }),
    ],
  })
}

// ---------------------------------------------------------------------------
// Glossar des Hefts — drei Spalten, Reihenfolge der Daten spaltenweise wie im HTML
// ---------------------------------------------------------------------------

export function glossarBlock(sit: SituationJson, ctx: HeftDocxKontext): Block[] {
  const glossar = (sit.glossar || []).filter((g) => g && g.begriff)
  if (!glossar.length) return []
  const SP = 3
  const zeilen = Math.ceil(glossar.length / SP)
  const eintrag = (k: number) => glossar[k]
  const rows: TableRow[] = []
  for (let r = 0; r < zeilen; r++) {
    rows.push(new TableRow({
      cantSplit: true,
      children: Array.from({ length: SP }, (_, c) => {
        const g = eintrag(c * zeilen + r)
        return new TableCell({
          width: pct(100 / SP),
          borders: OHNE,
          margins: { top: 0, bottom: 30, left: c ? 90 : 0, right: c < SP - 1 ? 90 : 0 },
          children: [g
            ? new Paragraph({
                children: [
                  new TextRun({ text: g.begriff, bold: true, size: 15 }),
                  new TextRun({ text: ` ${g.definition}`, size: 15, color: COLOR.inkSoft }),
                ],
                spacing: { before: 0, after: 0, line: 216, lineRule: LineRuleType.AUTO },
              })
            : p('', { spacing: { before: 0, after: 0 } })],
        })
      }),
    }))
  }
  return [bnLabel('Glossar', ctx, true), new Table({ width: pct(100), rows })]
}

// ---------------------------------------------------------------------------
// Checkliste Vollständigkeit, 2 × 2 — dieselben Texte wie checklisteBlock (✔ … ☐)
// ---------------------------------------------------------------------------

export function checklisteZweispaltigDocx(sit: SituationJson, ctx: HeftDocxKontext): Block[] {
  const raster = sit.bewertungsraster || []
  if (!raster.length) return []
  const spalte = Math.round(SATZ / 2) - 160
  const gruppe = (b: (typeof raster)[number] | undefined): Paragraph[] => b
    ? [
        p(b.produkt, { run: { bold: true, size: 17 }, spacing: { before: 20, after: 10 }, keepNext: true }),
        ...checklistenZeilen(b).map((v) => new Paragraph({
          children: [
            new TextRun({ text: '✔ ', bold: true, size: 16 }),
            new TextRun({ text: v, size: 16 }),
            new TextRun({ text: '\t☐', size: 19 }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: spalte }],
          spacing: { before: 0, after: 0, line: 228, lineRule: LineRuleType.AUTO },
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLOR.rule, space: 1 } },
        })),
      ]
    : [p('', { spacing: { before: 0, after: 0 } })]
  const rows: TableRow[] = []
  for (let i = 0; i < raster.length; i += 2) {
    rows.push(new TableRow({
      cantSplit: true,
      children: [0, 1].map((k) => new TableCell({
        width: pct(50),
        borders: OHNE,
        margins: { top: 0, bottom: 40, left: k ? 140 : 0, right: k ? 0 : 140 },
        children: gruppe(raster[i + k]),
      })),
    }))
  }
  // Akzentlinie unter der Beschriftung — wie border-top des Rasters im HTML (Zellränder
  // würden einen Tabellenrand überschreiben, darum am Absatz).
  return [
    p('CHECKLISTE VOLLSTÄNDIGKEIT', {
      run: { color: ctx.akzent, bold: true, size: 14, font: 'Consolas' },
      spacing: { before: 0, after: 20 },
      keepNext: true,
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ctx.akzent, space: 2 } },
    }),
    new Table({ width: pct(100), rows }),
  ]
}
