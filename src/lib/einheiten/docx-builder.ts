// docx-builder.ts — ported from renderer/docx-builder.jsx.
// Builds Word (.docx) versions of DOC-S, DOC-KN-S, DOC-KN-LP that mirror the
// React HTML renderers. Runs client-side (in the browser island) so generation
// stays off the Vercel function path.

import {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  HeadingLevel, AlignmentType, BorderStyle, ShadingType,
  Table, TableRow, TableCell, WidthType,
  PageBreak, PageNumber, LineRuleType,
  TabStopType, TabStopPosition, ImageRun,
} from 'docx'

import type { KnJson, KnTyp, PrinzipJson, SetJson, SituationJson } from './types'
import { skNameByNr } from '../sk-labels'
import { lookupSprachmodus, unitSprachmodusIds, rezeptionFirst, kompetenzSprachmodusDetails, HOERVERSTAENDNIS_HINWEIS } from './sprachfoerderung'

const A4_W = 11906
const A4_H = 16838
const MM = 56.6929

const COLOR = {
  ink: '1A1D22',
  inkSoft: '4A5057',
  inkMute: '8B9099',
  rule: 'D8DBE0',
  ruleSoft: 'EBEDF0',
  line: 'BDC3C7',
  neutral: '2C3E50',
  neutralLight: 'ECF0F1',
  neutralMid: '7F8C8D',
}

function sitPalette(sit: SituationJson | null | undefined) {
  if (!sit) return { akzent: COLOR.neutral, light: COLOR.neutralLight, mid: COLOR.neutralMid }
  const strip = (h?: string) => (h || '').replace('#', '').toUpperCase()
  return {
    akzent: strip(sit.sit_farbe) || COLOR.neutral,
    light: strip(sit.sit_farbe_light) || COLOR.neutralLight,
    mid: strip(sit.sit_farbe_mid) || COLOR.neutralMid,
  }
}

interface POpts {
  run?: any
  spacing?: any
  alignment?: any
  border?: any
  indent?: any
  bullet?: any
  pageBreakBefore?: boolean
  keepNext?: boolean
  keepLines?: boolean
}

function p(text: any, opts: POpts = {}): Paragraph {
  const children = Array.isArray(text)
    ? text
    : [new TextRun({ text: String(text == null ? '' : text), ...(opts.run || {}) })]
  return new Paragraph({
    children,
    spacing: opts.spacing || { after: 60, line: 280, lineRule: LineRuleType.AUTO },
    alignment: opts.alignment,
    border: opts.border,
    indent: opts.indent,
    bullet: opts.bullet,
    pageBreakBefore: opts.pageBreakBefore,
    keepNext: opts.keepNext,
    keepLines: opts.keepLines,
  })
}

function h(text: string, level: 'title' | 'section' | 'sub' | 'meta', color: string = COLOR.ink): Paragraph {
  const map: Record<string, { size: number; bold: boolean; spacing: any }> = {
    title:   { size: 36, bold: true, spacing: { after: 80, line: 300, lineRule: LineRuleType.AUTO } },
    section: { size: 26, bold: true, spacing: { before: 140, after: 80, line: 300, lineRule: LineRuleType.AUTO } },
    sub:     { size: 20, bold: true, spacing: { before: 80, after: 40 } },
    meta:    { size: 14, bold: true, spacing: { before: 60, after: 30 } },
  }
  const cfg = map[level] || { size: 22, bold: true, spacing: { after: 80 } }
  return new Paragraph({
    children: [new TextRun({ text, bold: cfg.bold, color, size: cfg.size })],
    spacing: cfg.spacing,
    keepNext: true,
    keepLines: true,
  })
}

function sectionHead(num: string, title: string, akzent: string): Paragraph[] {
  return [
    new Paragraph({
      children: [new TextRun({ text: num.toUpperCase(), color: akzent, size: 16, bold: true, font: 'Consolas' })],
      spacing: { before: 180, after: 30 },
      keepNext: true,
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 3 } },
    }),
    h(title, 'section', COLOR.ink),
  ]
}

function badgeRun(text: string, akzent: string, variant: 'fill' | 'outline' = 'fill'): TextRun {
  if (variant === 'outline') {
    return new TextRun({ text: `[${text}]`, color: akzent, bold: true, size: 16 })
  }
  return new TextRun({ text: ` ${text} `, color: 'FFFFFF', shading: { type: ShadingType.SOLID, color: akzent }, bold: true, size: 16 })
}

function spacer(twips = 200): Paragraph {
  return new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: twips, after: twips } })
}

function pageBreak(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] })
}

function sourceRefRun(text: string, akzent: string): TextRun {
  return new TextRun({ text, color: akzent, size: 16, font: 'Consolas' })
}

interface TCellOpts {
  width?: any
  shading?: any
  verticalAlign?: any
  margins?: any
  borders?: any
}

function tcell(content: any, opts: TCellOpts = {}): TableCell {
  const children = Array.isArray(content)
    ? content
    : [typeof content === 'string' ? p(content, { run: { size: 20 } }) : content]
  return new TableCell({
    children,
    width: opts.width,
    shading: opts.shading,
    verticalAlign: opts.verticalAlign,
    margins: opts.margins || { top: 80, bottom: 80, left: 100, right: 100 },
    borders: opts.borders || {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
    },
  })
}

function dataTable(headers: string[], rows: any[][], akzent: string, colWidths?: number[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((label, i) => tcell(
      p(label.toUpperCase(), { run: { size: 14, bold: true, color: akzent } }),
      {
        width: colWidths ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
        shading: { type: ShadingType.SOLID, color: 'FFFFFF' },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: akzent },
          bottom: { style: BorderStyle.SINGLE, size: 12, color: akzent },
          left: { style: BorderStyle.NIL, size: 0 },
          right: { style: BorderStyle.NIL, size: 0 },
        },
      },
    )),
  })
  const dataRows = rows.map((row) => new TableRow({
    children: row.map((cell, i) => tcell(
      typeof cell === 'string' ? p(cell, { run: { size: 18 } }) : cell,
      {
        width: colWidths ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
        borders: {
          top: { style: BorderStyle.NIL, size: 0 },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: COLOR.ruleSoft },
          left: { style: BorderStyle.NIL, size: 0 },
          right: { style: BorderStyle.NIL, size: 0 },
        },
      },
    )),
  }))
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  })
}

function schreibfeld(heightMm: number, color: string = COLOR.line): Paragraph[] {
  const lines = Math.max(3, Math.ceil(heightMm / 8.5) + 1)
  const paragraphs: Paragraph[] = []
  for (let i = 0; i < lines; i++) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: '' })],
      spacing: { before: 0, after: 200, line: 360, lineRule: LineRuleType.AUTO },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    }))
  }
  return paragraphs
}

function skizzeBox(heightMm: number, label: string, akzent: string): Table {
  const lines = Math.max(8, Math.ceil(heightMm / 6))
  const empty: Paragraph[] = []
  for (let i = 0; i < lines; i++) {
    empty.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { line: 320, lineRule: LineRuleType.AUTO } }))
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [tcell([
        p(label, { run: { color: akzent, bold: true, size: 14 } }),
        ...empty,
      ], {
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          left: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          right: { style: BorderStyle.SINGLE, size: 6, color: akzent },
        },
      })],
    })],
  })
}

function callout(label: string, text: string, akzent: string, light: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [tcell([
        p(label.toUpperCase(), { run: { color: akzent, bold: true, size: 14 } }),
        p(text, { run: { size: 22 } }),
      ], {
        shading: { type: ShadingType.SOLID, color: light },
        borders: {
          top: { style: BorderStyle.NIL, size: 0 },
          bottom: { style: BorderStyle.NIL, size: 0 },
          left: { style: BorderStyle.SINGLE, size: 24, color: akzent },
          right: { style: BorderStyle.NIL, size: 0 },
        },
      })],
    })],
  })
}

function sectionProps(docCode: string, docTitel: string, abteilung: string | undefined, logoPng: ArrayBuffer | Uint8Array | null) {
  const headerChildren: Paragraph[] = []
  if (logoPng) {
    headerChildren.push(new Paragraph({
      children: [
        new ImageRun({
          data: logoPng,
          transformation: { width: 180, height: 70 },
          type: 'png',
        } as any),
      ],
      spacing: { after: 40 },
    }))
  }
  headerChildren.push(new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      ...(abteilung ? [new TextRun({ text: abteilung, color: COLOR.inkSoft, size: 16 })] : [new TextRun({ text: '', size: 16 })]),
      new TextRun({ text: '\t' }),
      new TextRun({ text: docCode, color: COLOR.ink, bold: true, size: 14, font: 'Consolas' }),
    ],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 3 } },
    spacing: { after: 100 },
  }))
  return {
    properties: {
      page: {
        size: { width: A4_W, height: A4_H },
        margin: {
          top: Math.round(28 * MM),
          bottom: Math.round(16 * MM),
          left: Math.round(20 * MM),
          right: Math.round(20 * MM),
          header: Math.round(8 * MM),
          footer: Math.round(8 * MM),
        },
      },
    },
    headers: { default: new Header({ children: headerChildren }) },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: docTitel || '', color: COLOR.inkMute, size: 14, font: 'Consolas' }),
            new TextRun({ text: '\t' }),
            new TextRun({ children: ['Seite ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES] as any, color: COLOR.inkMute, size: 14, font: 'Consolas' }),
          ],
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: COLOR.ruleSoft, space: 3 } },
        })],
      }),
    },
  }
}

function cockpitBlock(sit: SituationJson, akzent: string, light: string): any[] {
  const els: any[] = []
  els.push(new Paragraph({
    children: [
      badgeRun('KOMP ' + (sit.nrlp?.nr || ''), akzent, 'outline'),
      new TextRun({ text: '  ' }),
      badgeRun('Herausforderung ' + sit.situation + ' · ' + (sit.emotion_tag || ''), akzent),
    ],
    spacing: { after: 200 },
  }))
  els.push(h(sit.titel || '', 'title'))
  els.push(p(sit.modul_titel || '', { run: { color: COLOR.inkSoft, size: 22, italics: true } }))
  if (sit.sub_facette) {
    els.push(p('Herausforderung ' + (sit.sub_facette.buchstabe || '') + ': ' + (sit.sub_facette.label || ''),
      { run: { color: akzent, bold: true, size: 18 } }))
  }
  els.push(spacer(120))

  els.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [
        tcell([
          p('PERSONA', { run: { color: akzent, bold: true, size: 14 } }),
          p(sit.persona?.beruf || '', { run: { bold: true, size: 24 } }),
          p(`${sit.persona?.betrieb || ''}, ${sit.persona?.ort || ''}`, { run: { color: COLOR.inkSoft, size: 18 } }),
        ], { shading: { type: ShadingType.SOLID, color: light }, borders: {
          left: { style: BorderStyle.SINGLE, size: 16, color: akzent },
          top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL },
        } }),
        tcell([
          p('HANDLUNGSPRODUKT', { run: { color: akzent, bold: true, size: 14 } }),
          p(sit.handlungsprodukt?.format || '', { run: { bold: true, size: 24 } }),
          p(sit.handlungsprodukt?.titel || '', { run: { color: COLOR.inkSoft, size: 18 } }),
        ], { shading: { type: ShadingType.SOLID, color: light }, borders: {
          left: { style: BorderStyle.SINGLE, size: 16, color: akzent },
          top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL },
        } }),
      ],
    })],
  }))
  els.push(spacer(120))

  if (sit.wochen_plan) {
    els.push(p('WOCHENPLAN', { run: { color: akzent, bold: true, size: 14 } }))
    const clean = (l: string) => (l || '').replace(/^Woche\s+\d+\s*[-–—]\s*/i, '').trim() || l
    els.push(dataTable(
      ['Dauer', 'Inhalt'],
      sit.wochen_plan.map((w) => [clean(w.label), w.text]),
      akzent, [26, 74],
    ))
    els.push(spacer(80))
  }

  if (sit.bewertungsraster) {
    const total = sit.bewertungsraster.reduce((s, r) => s + (r.gewicht || 0), 0)
    els.push(p('BEWERTUNGSRASTER · TOTAL ' + total + '%', { run: { color: akzent, bold: true, size: 14 } }))
    els.push(dataTable(
      ['Produkt', 'Abgabe', 'Gewicht', 'Kriterium'],
      sit.bewertungsraster.map((b) => [
        new Paragraph({ children: [new TextRun({ text: b.produkt, bold: true, size: 18 })] }),
        b.abgabe,
        b.gewicht + '%',
        b.kriterium,
      ]),
      akzent, [22, 30, 10, 38],
    ))
    els.push(spacer(80))
  }

  if (sit.quellen_anker) {
    els.push(p('QUELLEN', { run: { color: akzent, bold: true, size: 14 } }))
    sit.quellen_anker.forEach((q) => {
      const meta = [q.unterueberschrift, [q.ref, q.seiten].filter(Boolean).join(' · ')].filter(Boolean).join('  ·  ')
      els.push(new Paragraph({
        children: [
          new TextRun({ text: q.titel || '', bold: true, size: 18 }),
          ...(meta ? [new TextRun({ text: '  ·  ' + meta, size: 18, color: COLOR.inkSoft })] : []),
        ],
        spacing: { after: 60 },
        indent: { left: 200 },
      }))
    })
  }

  return els
}

function situationBlock(sit: SituationJson, akzent: string, light: string): any[] {
  const els: any[] = []
  els.push(...sectionHead('02 · Herausforderung', sit.titel || '', akzent))
  els.push(new Paragraph({
    children: [
      new TextRun({ text: 'BERUF ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: sit.persona?.beruf || '', size: 18 }),
      new TextRun({ text: '   ·   ', color: COLOR.inkMute, size: 14 }),
      new TextRun({ text: 'BETRIEB ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: sit.persona?.betrieb || '', size: 18 }),
      new TextRun({ text: '   ·   ', color: COLOR.inkMute, size: 14 }),
      new TextRun({ text: 'ORT ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: sit.persona?.ort || '', size: 18 }),
      new TextRun({ text: '   ·   ', color: COLOR.inkMute, size: 14 }),
      new TextRun({ text: 'EMOTION ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: sit.emotion_tag || '', size: 18 }),
    ],
    spacing: { after: 180 },
  }))
  els.push(p(sit.situation_text || '', { run: { size: 22 }, spacing: { after: 200, line: 360, lineRule: LineRuleType.AUTO } }))
  if (sit.zahlen_tabelle) {
    els.push(dataTable(
      ['Kennzahl', 'Wert'],
      sit.zahlen_tabelle.map((z) => [
        z.label,
        new Paragraph({ children: [new TextRun({ text: z.wert, font: 'Consolas', size: 18 })], alignment: AlignmentType.RIGHT }),
      ]),
      akzent, [70, 30],
    ))
    els.push(spacer(80))
  }
  els.push(callout('Leitfrage', sit.leitfrage || '', akzent, light))
  if (sit.mehrdeutigkeit?.explizit && sit.mehrdeutigkeit.trade_off) {
    els.push(spacer(80))
    els.push(callout('Spannungsfeld', sit.mehrdeutigkeit.trade_off, akzent, light))
  }
  return els
}

function leitfrageItems(sit: SituationJson, akzent: string, withField: boolean, fieldHeightMm?: number): any[] {
  const els: any[] = []
  sit.leitfragen?.forEach((lf) => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: 'LF' + lf.nr + '  ', bold: true, color: akzent, size: 22, font: 'Consolas' }),
        new TextRun({ text: lf.text, size: 20 }),
      ],
      spacing: { before: 120, after: 40, line: 320, lineRule: LineRuleType.AUTO },
      keepNext: true,
    }))
    els.push(new Paragraph({
      children: [
        new TextRun({ text: '[' + (lf.bloom || '') + ']', color: akzent, bold: true, size: 14 }),
        new TextRun({ text: '  ' }),
        sourceRefRun(lf.knoten_ref || '', akzent),
      ],
      spacing: { after: 80 },
    }))
    if (withField) els.push(...schreibfeld(fieldHeightMm || lf.feld_hoehe_mm || 15))
  })
  return els
}

function reflexionItems(sit: SituationJson, akzent: string, withField: boolean, fieldHeightMm?: number): any[] {
  const els: any[] = []
  sit.reflexion_fragen?.forEach((rf) => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: String(rf.nr) + '  ', bold: true, color: akzent, size: 22, font: 'Consolas' }),
        new TextRun({ text: rf.text, size: 20 }),
      ],
      spacing: { before: 120, after: 60, line: 320, lineRule: LineRuleType.AUTO },
    }))
    if (rf.sub) els.push(p(rf.sub, { run: { color: COLOR.inkMute, size: 18, italics: true } }))
    if (withField) els.push(...schreibfeld(fieldHeightMm || rf.feld_hoehe_mm || 10))
  })
  return els
}

function mindmapFullBlock(sit: SituationJson, akzent: string): any[] {
  const els: any[] = []
  els.push(p(sit.mindmap_zentrum || '', {
    run: { bold: true, color: 'FFFFFF', size: 24 }, alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, color: akzent, size: 6 }, bottom: { style: BorderStyle.SINGLE, color: akzent, size: 6 } },
  }))
  els.push(spacer(60))
  sit.mindmap_aeste?.forEach((ast) => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: ast.titel, bold: true, color: akzent, size: 20 }),
        ...(ast.optional ? [new TextRun({ text: '  · optional', color: COLOR.inkMute, size: 14 })] : []),
      ],
      spacing: { before: 120, after: 40 },
      keepNext: true,
    }))
    ast.punkte?.forEach((pt) => {
      els.push(new Paragraph({ children: [new TextRun({ text: pt, size: 18 })], bullet: { level: 0 }, spacing: { after: 40 } }))
    })
  })
  return els
}

function mindmapSkelettBlock(sit: SituationJson, akzent: string): any[] {
  const els: any[] = []
  els.push(p('Skizziere deine Mindmap. Zentrum und Ast-Titel sind Anker; die Detail-Punkte arbeitest du selbst aus.',
    { run: { italics: true, color: COLOR.inkMute, size: 16 } }))
  els.push(spacer(60))
  els.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [tcell([
        p(sit.mindmap_zentrum || '', { run: { bold: true, color: 'FFFFFF', size: 22 }, alignment: AlignmentType.CENTER }),
      ], {
        shading: { type: ShadingType.SOLID, color: akzent },
        borders: { top: { style: BorderStyle.SINGLE, color: akzent, size: 12 }, bottom: { style: BorderStyle.SINGLE, color: akzent, size: 12 }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
        margins: { top: 200, bottom: 200, left: 120, right: 120 },
      })],
    })],
  }))
  els.push(spacer(160))
  const aeste = sit.mindmap_aeste || []
  const rows: TableRow[] = []
  for (let i = 0; i < aeste.length; i += 2) {
    const a = aeste[i], b = aeste[i + 1]
    rows.push(new TableRow({
      children: [
        tcell([
          p(a.titel + (a.optional ? '  · optional' : ''), { run: { color: akzent, bold: true, size: 18 } }),
        ], { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.DASHED, color: akzent, size: 4 }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } }),
        b
          ? tcell([
              p(b.titel + (b.optional ? '  · optional' : ''), { run: { color: akzent, bold: true, size: 18 } }),
            ], { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.DASHED, color: akzent, size: 4 }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } })
          : tcell(p('', { run: { size: 18 } }), { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } }),
      ],
    }))
    for (let s = 0; s < 5; s++) {
      rows.push(new TableRow({
        children: [
          tcell(p('', { run: { size: 18 } }), { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } }),
          tcell(p('', { run: { size: 18 } }), { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } }),
        ],
      }))
    }
  }
  els.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }))
  return els
}

function handlungsproduktBlock(sit: SituationJson, akzent: string, withField: boolean): any[] {
  const hp = sit.handlungsprodukt
  if (!hp) return []
  const els: any[] = []
  els.push(new Paragraph({
    children: [badgeRun(hp.format || '', akzent, 'outline')],
    spacing: { after: 160 },
  }))
  // Cluster 6 — "Das lieferst du ab": konkrete Abgabe(n), parallel zum HTML-DocS-Callout
  if (hp.abgaben?.length) {
    els.push(p('DAS LIEFERST DU AB', { run: { color: akzent, bold: true, size: 14 }, spacing: { after: 40 } }))
    hp.abgaben.filter(Boolean).forEach((a) => {
      els.push(new Paragraph({
        children: [
          new TextRun({ text: '•  ', color: akzent, bold: true, size: 20 }),
          new TextRun({ text: a, size: 20 }),
        ],
        spacing: { after: 30 },
        indent: { left: 200 },
      }))
    })
    els.push(spacer(120))
  }
  els.push(p(hp.beschreibung || '', { run: { size: 22 }, spacing: { after: 160, line: 360, lineRule: LineRuleType.AUTO } }))
  hp.schritte?.forEach((s, i) => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: String(i + 1).padStart(2, '0') + '  ', bold: true, color: akzent, font: 'Consolas', size: 20 }),
        new TextRun({ text: s.label, bold: true, size: 20 }),
      ],
      spacing: { before: 100, after: 30 },
      keepNext: true,
    }))
    els.push(p(s.hint || '', { run: { color: COLOR.inkSoft, size: 18 }, indent: { left: 400 } }))
  })
  if (withField) {
    els.push(spacer(160))
    els.push(skizzeBox(150, hp.schreib_label || 'HIER ERARBEITEN', akzent))
  }
  return els
}

function austauschBlock(set: SetJson | null | undefined, sit: SituationJson | null | undefined, akzent: string): any[] {
  const els: any[] = []
  const ap = set?.austausch_phase
  const da = set?.dekontextualisierungs_aufgabe
  if (!ap && !da) return []
  if (ap) {
    els.push(p(`AUSTAUSCH · ${ap.format || ''} · ${ap.dauer_min || ''} MIN`, { run: { color: akzent, bold: true, size: 14 } }))
    const jig = ap.gruppenarbeit_jigsaw || {}
    ;([['Runde 1', jig.runde_1], ['Runde 2', jig.runde_2], ['Runde 3', jig.runde_3]] as Array<[string, string | undefined]>).forEach(([label, text]) => {
      if (!text) return
      els.push(new Paragraph({
        children: [
          new TextRun({ text: label + '   ', color: akzent, bold: true, size: 16, font: 'Consolas' }),
          new TextRun({ text, size: 20 }),
        ],
        spacing: { after: 80 },
      }))
    })
    if (ap.einzelarbeit_plenum) {
      els.push(p('PLENUM', { run: { color: akzent, bold: true, size: 14 } }))
      els.push(p(ap.einzelarbeit_plenum, { run: { size: 20 } }))
    }
  }
  if (da) {
    els.push(p('TRANSFER', { run: { color: akzent, bold: true, size: 14 } }))
    els.push(p(da.auftrag || '', { run: { bold: true, size: 20 } }))
    els.push(p(`Format: ${da.format} · Gewicht: ${da.gewicht_prozent}% · Abgabe: ${da.abgabe}`,
      { run: { color: COLOR.inkSoft, size: 16 } }))
    if (sit?.dekontextualisierung?.frage) {
      els.push(new Paragraph({
        children: [
          new TextRun({ text: 'Leitend: ', color: akzent, bold: true, size: 18 }),
          new TextRun({ text: sit.dekontextualisierung.frage, size: 20 }),
        ],
        spacing: { before: 100 },
      }))
    }
  }
  return els
}

export interface BuildDocSOpts {
  sit: SituationJson
  set: SetJson | null
  abteilung?: string
  mode: 'info' | 'fill'
  logoPng?: ArrayBuffer | Uint8Array | null
}

export function buildDocS({ sit, set, abteilung, mode, logoPng = null }: BuildDocSOpts): Document {
  const palette = sitPalette(sit)
  const akzent = palette.akzent
  const light = palette.light
  const docCode = `DOC-S · SIT ${sit.situation} · ${mode === 'info' ? 'DOSSIER' : 'AUFTRAG'}`
  const docTitel = sit.titel || ''

  const children: any[] = []
  children.push(...cockpitBlock(sit, akzent, light))
  children.push(pageBreak())
  children.push(...situationBlock(sit, akzent, light))
  if (mode === 'fill') {
    children.push(pageBreak())
    children.push(...sectionHead('03 · Wissensecke', 'Leitfragen', akzent))
    if (sit.leitfragen_intro) children.push(p(sit.leitfragen_intro, { run: { color: COLOR.inkSoft, size: 18 } }))
    children.push(...leitfrageItems(sit, akzent, true, 55))
    children.push(pageBreak())
    children.push(...sectionHead('04 · Mindmap', sit.mindmap_zentrum || '', akzent))
    children.push(...mindmapSkelettBlock(sit, akzent))
    children.push(pageBreak())
    children.push(...sectionHead('05 · Handlungsprodukt', sit.handlungsprodukt?.titel || '', akzent))
    children.push(...handlungsproduktBlock(sit, akzent, true))
    children.push(pageBreak())
    children.push(...sectionHead('06 · Selbstcheck', 'Reflexion', akzent))
    children.push(...reflexionItems(sit, akzent, true, 35))
    children.push(pageBreak())
    children.push(...sectionHead('07 · Austausch & Transfer', 'Austausch & Transfer', akzent))
    children.push(...austauschBlock(set, sit, akzent))
    children.push(spacer(120))
    children.push(p('DEIN TRANSFER (5–7 SÄTZE)', { run: { color: akzent, bold: true, size: 14 } }))
    children.push(...schreibfeld(55))
  } else {
    children.push(pageBreak())
    children.push(...sectionHead('03 · Wissensecke', 'Leitfragen', akzent))
    if (sit.leitfragen_intro) children.push(p(sit.leitfragen_intro, { run: { color: COLOR.inkSoft, size: 16 } }))
    children.push(...leitfrageItems(sit, akzent, false))
    children.push(pageBreak())
    children.push(...sectionHead('04 · Mindmap', sit.mindmap_zentrum || '', akzent))
    children.push(...mindmapFullBlock(sit, akzent))
    children.push(...sectionHead('05 · Handlungsprodukt', sit.handlungsprodukt?.titel || '', akzent))
    children.push(...handlungsproduktBlock(sit, akzent, false))
    children.push(pageBreak())
    children.push(...sectionHead('06 · Selbstcheck', 'Reflexion', akzent))
    children.push(...reflexionItems(sit, akzent, false))
    children.push(...sectionHead('07 · Austausch & Transfer', 'Austausch & Transfer', akzent))
    children.push(...austauschBlock(set, sit, akzent))
  }

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  })
}

export interface BuildKnSOpts {
  kn: KnJson
  knTyp: string
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

export function buildKnS({ kn, knTyp, abteilung, logoPng = null }: BuildKnSOpts): Document | null {
  const t: KnTyp | undefined = (kn.kn_typen || []).find((x) => x.typ === knTyp) || kn.kn_typen?.[0]
  if (!t) return null
  const akzent = COLOR.neutral
  const light = COLOR.neutralLight
  const docCode = `DOC-KN-S · ${t.typ.toUpperCase()}`
  const docTitel = kn.hybrid_situation?.titel || ''
  const hs = kn.hybrid_situation || {}

  const children: any[] = []
  children.push(new Paragraph({
    children: [
      badgeRun('KN ' + (kn.kompetenz_nr || ''), akzent, 'outline'),
      new TextRun({ text: '  ' }),
      badgeRun(t.label, akzent),
    ],
    spacing: { after: 200 },
  }))
  children.push(h(hs.titel || '', 'title'))
  children.push(spacer(80))
  children.push(...sectionHead('01 · Hybrid-Herausforderung', 'Herausforderung', akzent))
  children.push(p(kn.hybrid_situation?.definition_kurz
    || 'Eine Hybrid-Herausforderung bündelt die drei Herausforderungen (A, B, C) und ihre Kompetenzen in einer neuen, zusammengesetzten Aufgabe.',
    { run: { italics: true, color: COLOR.inkSoft, size: 18 }, spacing: { after: 100 } }))
  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'BERUF ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: hs.persona?.beruf || '', size: 18 }),
      new TextRun({ text: '   ·   ' + (hs.persona?.betrieb || '') + ', ' + (hs.persona?.ort || ''), size: 18, color: COLOR.inkSoft }),
      new TextRun({ text: '   ·   EMOTION ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: hs.emotion_tag || '', size: 18 }),
    ],
    spacing: { after: 160 },
  }))
  children.push(p(hs.text || '', { run: { size: 22 }, spacing: { after: 160, line: 360, lineRule: LineRuleType.AUTO } }))
  children.push(callout('Leitfrage', hs.leitfrage || '', akzent, light))

  children.push(...sectionHead('02 · Rahmen', 'Format & Ablauf', akzent))
  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'Format: ', color: akzent, bold: true, size: 18 }),
      new TextRun({ text: t.format || '', size: 20 }),
    ],
    spacing: { after: 100 },
  }))
  t.ablauf?.forEach((a) => {
    children.push(new Paragraph({ children: [new TextRun({ text: a, size: 20 })], bullet: { level: 0 }, spacing: { after: 60 } }))
  })

  children.push(pageBreak())
  if (t.typ === 'fachgespraech') {
    children.push(...sectionHead('03 · Vorbereitung', 'Notizen zu den Fragen', akzent))
    children.push(p('Stichwortartige Notizen zu jeder Frage. Im Gespräch sprichst du frei.', { run: { color: COLOR.inkSoft, size: 18 } }))
    t.fragestruktur?.forEach((f) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'F' + f.nr + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: f.frage, size: 20 }),
        ],
        spacing: { before: 120, after: 40 },
        keepNext: true,
      }))
      children.push(new Paragraph({ children: [new TextRun({ text: '[' + (f.typ || '') + ']', color: akzent, bold: true, size: 14 })], spacing: { after: 60 } }))
      children.push(...schreibfeld(25))
    })
  } else if (t.typ === 'mini_case_schriftlich') {
    children.push(...sectionHead('03 · Aufgaben', 'Prüfungsaufgaben', akzent))
    children.push(p('Bearbeite alle Aufgaben schriftlich. Lehrmittel nach Anweisung der Lehrperson, kein Internet.', { run: { color: COLOR.inkSoft, size: 18 } }))
    t.aufgaben?.forEach((a) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'A' + a.nr + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: a.aufgabe, size: 20 }),
        ],
        spacing: { before: 120, after: 40 },
        keepNext: true,
      }))
      children.push(new Paragraph({ children: [new TextRun({ text: '[' + (a.typ || '') + ']', color: akzent, bold: true, size: 14 })], spacing: { after: 60 } }))
      children.push(...schreibfeld(55))
    })
  } else {
    children.push(...sectionHead('03 · Werkwahl', 'Welches Handlungsprodukt wähle ich?', akzent))
    children.push(p('Begründe deine Wahl in 2–3 Sätzen.', { run: { color: COLOR.inkSoft, size: 18 } }))
    children.push(...schreibfeld(28))
    children.push(...sectionHead('04 · Transfer-Reflexion', 'Drei Reflexionsfragen', akzent))
    children.push(p('Beantworte schriftlich, insgesamt 200–250 Wörter.', { run: { color: COLOR.inkSoft, size: 18 } }))
    t.reflexionsfragen?.forEach((f, i) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'R' + (i + 1) + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: f, size: 20 }),
        ],
        spacing: { before: 120, after: 40 },
        keepNext: true,
      }))
      children.push(...schreibfeld(40))
    })
  }

  children.push(pageBreak())
  children.push(...sectionHead('05 · Bewertungskriterien', 'Worauf geachtet wird', akzent))
  children.push(p('Vier Kriterien, zwei Dimensionen: sachliche Korrektheit (SuK) und gesellschaftliche Werthaltung (Ges). Beide werden separat benotet.', { run: { color: COLOR.inkSoft, size: 18 } }))
  if (kn.rubrik_shared?.kriterien) {
    children.push(dataTable(
      ['Kriterium', 'Dimension'],
      kn.rubrik_shared.kriterien.map((k) => [
        new Paragraph({ children: [new TextRun({ text: k.name, bold: true, size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: k.dimension, bold: true, size: 16, color: akzent })] }),
      ]),
      akzent, [75, 25],
    ))
  }
  children.push(spacer(160))
  children.push(p('NIVEAUBAENDER', { run: { color: akzent, bold: true, size: 14 } }))
  kn.rubrik_shared?.niveaubaender?.forEach((n) => {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: n.label + '   ', bold: true, color: akzent, size: 18 }),
        new TextRun({ text: n.definition, size: 18 }),
      ],
      spacing: { after: 80 },
    }))
  })

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  })
}

export interface BuildKnLpOpts {
  kn: KnJson
  prinzip: PrinzipJson | null
  set: SetJson | null
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
  sits?: (SituationJson | null)[]
}

export function buildKnLp({ kn, prinzip, set, abteilung, logoPng = null, sits = [] }: BuildKnLpOpts): Document {
  const akzent = COLOR.neutral
  const light = COLOR.neutralLight
  const docCode = 'DOC-KN-LP'
  const docTitel = kn.hybrid_situation?.titel || `KN ${kn.kompetenz_nr}`
  const hs = kn.hybrid_situation || {}

  const children: any[] = []
  children.push(new Paragraph({
    children: [
      badgeRun('LEHRPERSON', akzent, 'outline'),
      new TextRun({ text: '  ' }),
      badgeRun('KN ' + (kn.kompetenz_nr || ''), akzent),
      new TextRun({ text: '  ' }),
      badgeRun('Dominanter Aspekt: ' + (kn.dominanter_aspekt || '—'), akzent, 'outline'),
    ],
    spacing: { after: 200 },
  }))
  children.push(h(prinzip?.kern_kompetenzversprechen || kn.kern_kompetenzversprechen || '', 'title'))
  children.push(p(kn.mehrdeutigkeits_pflicht || '', { run: { italics: true, color: COLOR.inkSoft, size: 20 } }))

  // 00 · Lehrplan-Bezug + Sprachförderung (Cluster 1 + 3) — from situation data
  {
    const real = (sits || []).filter((s): s is SituationJson => Boolean(s))
    const ref = real[0]?.nrlp
    const kompId = ref?.kompetenz_id || ref?.nr || kn.kompetenz_nr || ''
    const kompText = ref?.kompetenz_text || prinzip?.kern_kompetenzversprechen || kn.kern_kompetenzversprechen || ''
    const lbId = ref?.lebensbezug_id || ref?.lebensbezug || ''
    const lbText = ref?.lebensbezug_text || '—'
    const aspekte = prinzip?.aspekte
      ? Object.entries(prinzip.aspekte).map(([a, it]) => a + (it ? ` (${it})` : ''))
      : Array.from(new Set(real.flatMap((s) => (s.nrlp?.gesellschaft || []).map((g) => g.aspekt + (g.iteration ? ` (${g.iteration})` : '')))))
    const smIds = unitSprachmodusIds(real)
    const skSet = new Set<number>()
    real.forEach((s) => (s.nrlp?.sk || []).forEach((n) => skSet.add(n)))
    if (!skSet.size && prinzip?.sk_schnittmenge_kn?.primary) prinzip.sk_schnittmenge_kn.primary.forEach((n) => skSet.add(n))
    const skList = Array.from(skSet).sort((a, b) => a - b)

    children.push(...sectionHead('00 · Lehrplan-Bezug', 'Vollständige Metadaten dieser Einheit', akzent))
    children.push(dataTable(
      ['Feld', 'Wert'],
      [
        [`Kompetenz ${kompId}`, kompText],
        [`Lebensbezug ${lbId}`, lbText],
        ['Gesellschaftliche Aspekte', aspekte.length ? aspekte.join(' · ') : '—'],
        ['Sprachmodi', smIds.length ? smIds.map((id) => `${id} ${lookupSprachmodus(id)?.bezeichnung || ''}`).join(' · ') : '—'],
        ['Schlüsselkompetenzen', skList.length ? skList.map((n) => `SK ${n} ${skNameByNr(n)}`).join(' · ') : '—'],
      ],
      akzent, [30, 70],
    ))

    children.push(...sectionHead('00 · Sprachförderung', 'Welche Sprachmodi geübt werden — mit Methode', akzent))
    const lehrgang = real[0]?.lehrgang || prinzip?.lehrgang
    const smDetails = kompetenzSprachmodusDetails(kompId, lehrgang)
    rezeptionFirst(smIds)
      .map((id) => lookupSprachmodus(id))
      .filter((sm): sm is NonNullable<typeof sm> => Boolean(sm))
      .forEach((sm) => {
        children.push(p(`${sm.id} · ${sm.bezeichnung}`, { run: { bold: true, color: akzent, size: 18 }, spacing: { before: 100, after: 20 } }))
        children.push(p('Ziel: ' + sm.ziel, { run: { size: 16 } }))
        sm.schritte.forEach((s, i) => {
          children.push(new Paragraph({ children: [new TextRun({ text: `${i + 1}. ${s}`, size: 16 })], spacing: { after: 20 }, indent: { left: 200 } }))
        })
        children.push(p('Material: ' + sm.material.join(' · '), { run: { size: 16, color: COLOR.inkSoft } }))
        const detail = smDetails.get(sm.bezeichnung)
        if (detail) children.push(p('In dieser Einheit konkret: ' + detail, { run: { size: 16, color: akzent } }))
      })
    if (smIds.includes('SM1') || smIds.includes('SM2')) {
      children.push(p(HOERVERSTAENDNIS_HINWEIS, { run: { italics: true, color: COLOR.inkSoft, size: 16 }, spacing: { before: 100 } }))
    }
  }

  children.push(pageBreak())
  children.push(...sectionHead('01 · Herausforderungen A·B·C', 'Was die drei Herausforderungen versprechen', akzent))
  if (prinzip?.sub_facetten) {
    ;['A', 'B', 'C'].forEach((letter) => {
      const sf = prinzip.sub_facetten![letter]
      if (!sf) return
      children.push(new Paragraph({
        children: [new TextRun({ text: 'HERAUSFORDERUNG ' + letter, bold: true, color: akzent, size: 14 })],
        spacing: { before: 100, after: 30 },
      }))
      children.push(p(sf.facette, { run: { bold: true, size: 22 } }))
      children.push(p('Konfliktart: ' + sf.konfliktart, { run: { color: COLOR.inkSoft, size: 18 } }))
    })
  }

  if (prinzip?.zirkularitaet) {
    children.push(...sectionHead('02 · Zirkularität', 'R1 jetzt — Ausblick T4 / T7', akzent))
    ;([
      ['R1 · Aktuell', prinzip.zirkularitaet.r1_aktuell],
      ['R2 · Voraussicht', prinzip.zirkularitaet.r2_voraussicht],
      ['R3 · Voraussicht', prinzip.zirkularitaet.r3_voraussicht],
    ] as Array<[string, string | undefined]>).forEach(([k, v]) => {
      if (!v) return
      children.push(new Paragraph({
        children: [
          new TextRun({ text: k + '   ', bold: true, color: akzent, size: 16, font: 'Consolas' }),
          new TextRun({ text: v, size: 20 }),
        ],
        spacing: { after: 80 },
      }))
    })
  }

  if (set?.konzept_progression) {
    children.push(...sectionHead('03 · Konzeptbogen', 'Progression A → B → C', akzent))
    children.push(dataTable(
      ['#', 'Konzept'],
      set.konzept_progression.map((kp) => [
        new Paragraph({ children: [new TextRun({ text: String(kp.position), bold: true, size: 22, font: 'Consolas' })] }),
        kp.konzept,
      ]),
      akzent, [8, 92],
    ))
  }

  children.push(pageBreak())
  children.push(...sectionHead('04 · Hybrid-Herausforderung', hs.titel || '', akzent))
  children.push(p(hs.definition_lang
    || 'Die Hybrid-Herausforderung ist die Prüfungssituation des Kompetenznachweises: Sie führt die drei vorangehenden Herausforderungen (A, B, C) und die darin geübten Kompetenzen in einer neuen, zusammengesetzten Aufgabe zusammen und prüft so den Transfer.',
    { run: { italics: true, color: COLOR.inkSoft, size: 18 }, spacing: { after: 100 } }))
  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'BERUF ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: hs.persona?.beruf || '', size: 18 }),
      new TextRun({ text: '   ·   ' + (hs.persona?.betrieb || '') + ', ' + (hs.persona?.ort || ''), size: 18, color: COLOR.inkSoft }),
    ],
    spacing: { after: 160 },
  }))
  children.push(p(hs.text || '', { run: { size: 22 }, spacing: { after: 160, line: 360, lineRule: LineRuleType.AUTO } }))
  children.push(callout('Leitfrage', hs.leitfrage || '', akzent, light))
  if (hs.aktivierte_trade_offs?.length) {
    children.push(spacer(120))
    children.push(p('AKTIVIERTE TRADE-OFFS', { run: { color: akzent, bold: true, size: 14 } }))
    hs.aktivierte_trade_offs.forEach((to) => {
      children.push(new Paragraph({ children: [new TextRun({ text: to, size: 20 })], bullet: { level: 0 } }))
    })
  }
  if (hs.alignment_note?.subfacetten_mapping) {
    children.push(...sectionHead('05 · Alignment', 'Welche Herausforderung welches Szenen-Element aktiviert', akzent))
    children.push(dataTable(
      ['Herausforderung', 'Szenen-Element'],
      hs.alignment_note.subfacetten_mapping.map((m) => [
        new Paragraph({ children: [new TextRun({ text: m.sit_letter, bold: true, size: 22, font: 'Consolas' })] }),
        m.scene_element,
      ]),
      akzent, [14, 86],
    ))
  }

  ;(kn.kn_typen || []).forEach((kt, idx) => {
    children.push(pageBreak())
    children.push(...sectionHead(`06.${idx + 1} · Durchführung`, kt.label, akzent))
    children.push(new Paragraph({
      children: [
        new TextRun({ text: 'Format: ', color: akzent, bold: true, size: 18 }),
        new TextRun({ text: kt.format || '', size: 20 }),
      ],
      spacing: { after: 100 },
    }))
    if (kt.ablauf) {
      kt.ablauf.forEach((a) => {
        children.push(new Paragraph({ children: [new TextRun({ text: a, size: 18 })], bullet: { level: 0 }, spacing: { after: 50 } }))
      })
    }
    const list: any[] = kt.fragestruktur || kt.aufgaben
      || (kt.reflexionsfragen ? kt.reflexionsfragen.map((f, i) => ({ nr: i + 1, frage: f })) : [])
    const prefix = kt.fragestruktur ? 'F' : kt.aufgaben ? 'A' : 'R'
    if (list && list.length) {
      children.push(spacer(80))
      list.forEach((item) => {
        const txt = item.frage || item.aufgabe || ''
        children.push(new Paragraph({
          children: [
            new TextRun({ text: prefix + item.nr + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
            new TextRun({ text: txt, size: 20 }),
          ],
          spacing: { before: 100, after: 30 },
          keepNext: true,
        }))
        const tags: string[] = []
        if (item.typ) tags.push(item.typ)
        if (item.k_stufe) tags.push('K' + item.k_stufe)
        if (tags.length) {
          children.push(new Paragraph({
            children: tags.map((tt, i) => new TextRun({ text: (i > 0 ? '  ' : '') + '[' + tt + ']', color: akzent, bold: true, size: 14 })),
            spacing: { after: 100 },
          }))
        }
      })
    }
    if (kt.sk || kt.aspekte) {
      const tagRuns: TextRun[] = []
      ;(kt.sk || []).forEach((s) => tagRuns.push(badgeRun('SK ' + s, akzent, 'outline'), new TextRun({ text: ' ' })))
      ;(kt.aspekte || []).forEach((a) => tagRuns.push(badgeRun(a, akzent), new TextRun({ text: ' ' })))
      children.push(new Paragraph({ children: tagRuns, spacing: { before: 160 } }))
    }
  })

  children.push(pageBreak())
  children.push(...sectionHead('07 · Bewertung', 'Bi-dimensionaler Rubrik-Grid', akzent))
  children.push(p('Pro Kriterium die zutreffende Stufe ankreuzen. SuK und Ges werden getrennt aggregiert — zwei separate Noten, niemals zu einer verschmolzen.', { run: { color: COLOR.inkSoft, size: 16 } }))
  const rs = kn.rubrik_shared
  if (rs?.kriterien) {
    const headerCells = ['Kriterium', 'Dim.', 'Stufe 1', 'Stufe 2', 'Stufe 3', 'Stufe 4']
    const rows = rs.kriterien.map((k) => {
      const cells: any[] = [
        new Paragraph({ children: [new TextRun({ text: k.name, bold: true, size: 18 })] }),
        new Paragraph({ children: [new TextRun({ text: k.dimension, bold: true, color: akzent, size: 14 })] }),
      ]
      ;(k.stufen || []).forEach((s) => {
        cells.push([
          new Paragraph({ children: [new TextRun({ text: '☐  ', size: 18, bold: true })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: s, size: 14, color: COLOR.inkSoft })] }),
        ])
      })
      return cells
    })
    const headerRow = new TableRow({
      tableHeader: true,
      children: headerCells.map((label) => tcell(
        p(label.toUpperCase(), { run: { size: 14, bold: true, color: akzent } }),
        { shading: { type: ShadingType.SOLID, color: light } },
      )),
    })
    const dataRows = rows.map((row) => new TableRow({
      children: row.map((cell: any, i: number) => {
        const widthPct = [25, 8, 17, 17, 17, 16][i]
        return tcell(
          Array.isArray(cell) ? cell : (cell instanceof Paragraph ? [cell] : [p(cell, { run: { size: 18 } })]),
          { width: { size: widthPct, type: WidthType.PERCENTAGE }, verticalAlign: 'top' },
        )
      }),
    }))
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...dataRows] }))
  }

  children.push(spacer(160))
  children.push(p('NIVEAUBAENDER', { run: { color: akzent, bold: true, size: 14 } }))
  rs?.niveaubaender?.forEach((n) => {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: n.label + '   ', bold: true, color: akzent, size: 18 }),
        new TextRun({ text: n.definition, size: 18 }),
      ],
      spacing: { after: 80 },
    }))
  })

  children.push(spacer(160))
  children.push(p('NOTE PRO DIMENSION (SEPARAT)', { run: { color: akzent, bold: true, size: 14 } }))
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [
        tcell([
          p('SuK · Sach- und Kommunikationskompetenz', { run: { color: akzent, bold: true, size: 14 } }),
          p('___________', { run: { size: 28, bold: true, font: 'Consolas' } }),
        ], { borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          left: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          right: { style: BorderStyle.SINGLE, size: 6, color: akzent },
        } }),
        tcell([
          p('Ges · Gesellschaft', { run: { color: akzent, bold: true, size: 14 } }),
          p('___________', { run: { size: 28, bold: true, font: 'Consolas' } }),
        ], { borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          left: { style: BorderStyle.SINGLE, size: 6, color: akzent },
          right: { style: BorderStyle.SINGLE, size: 6, color: akzent },
        } }),
      ],
    })],
  }))
  children.push(p('Aggregation: SuK-Note = Mittel der SuK-Kriterien · Ges-Note = Mittel der Ges-Kriterien. Beide Noten gleichgewichtet, aber nie zu einer Gesamtnote verschmolzen.',
    { run: { color: COLOR.inkMute, size: 14, italics: true } }))

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  })
}

export async function docToBlob(doc: Document): Promise<Blob> {
  return Packer.toBlob(doc)
}
