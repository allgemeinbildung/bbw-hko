// docx-primitives.ts — geteilte Word-Bausteine.
// Ausgelagert aus docx-builder.ts, damit sowohl die Einheiten-Dokumente als auch
// die leeren Lehrpersonen-Vorlagen (src/lib/vorlagen/) dieselbe Typografie,
// dieselben Seitenraender und denselben Kopf/Fuss verwenden.

import {
  Paragraph, TextRun, Header, Footer,
  AlignmentType, BorderStyle, ShadingType,
  Table, TableRow, TableCell, WidthType,
  PageBreak, PageNumber, LineRuleType,
  TabStopType, TabStopPosition, ImageRun,
} from 'docx'

export const A4_W = 11906
export const A4_H = 16838
export const MM = 56.6929

export const BBW_GRUEN = '0E6E3A'
export const BBW_GRUEN_TINT = 'E8F3EC'

export const COLOR = {
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

export interface POpts {
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

export function p(text: any, opts: POpts = {}): Paragraph {
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

export function h(text: string, level: 'title' | 'section' | 'sub' | 'meta', color: string = COLOR.ink): Paragraph {
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

export function sectionHead(num: string, title: string, akzent: string): Paragraph[] {
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

export function badgeRun(text: string, akzent: string, variant: 'fill' | 'outline' = 'fill'): TextRun {
  if (variant === 'outline') {
    return new TextRun({ text: `[${text}]`, color: akzent, bold: true, size: 16 })
  }
  return new TextRun({ text: ` ${text} `, color: 'FFFFFF', shading: { type: ShadingType.SOLID, color: akzent }, bold: true, size: 16 })
}

export function spacer(twips = 200): Paragraph {
  return new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: twips, after: twips } })
}

export function pageBreak(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] })
}

export function sourceRefRun(text: string, akzent: string): TextRun {
  return new TextRun({ text, color: akzent, size: 16, font: 'Consolas' })
}

export interface TCellOpts {
  width?: any
  shading?: any
  verticalAlign?: any
  margins?: any
  borders?: any
}

export function tcell(content: any, opts: TCellOpts = {}): TableCell {
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

export function dataTable(headers: string[], rows: any[][], akzent: string, colWidths?: number[]): Table {
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

export function schreibfeld(heightMm: number, color: string = COLOR.line): Paragraph[] {
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

export function skizzeBox(heightMm: number, label: string, akzent: string): Table {
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

export function callout(label: string, text: string, akzent: string, light: string): Table {
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

export function sectionProps(docCode: string, docTitel: string, abteilung: string | undefined, logoPng: ArrayBuffer | Uint8Array | null) {
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
