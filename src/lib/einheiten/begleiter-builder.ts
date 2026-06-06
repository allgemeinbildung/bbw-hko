// begleiter-builder.ts — ported from begleiter/parser.js + exporter.js.
// Reads markdown with YAML frontmatter and emits a styled Word .docx using
// the docx library. Custom-rendered HKO callouts (lernziel, hinweis, warnung,
// beispiel, reflexion, coaching, mehrdeutigkeit, differenzieren).

import { Marked, type Tokens } from 'marked'
import {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  HeadingLevel, AlignmentType, BorderStyle, ShadingType,
  Table, TableRow, TableCell, WidthType, PageNumber,
  ImageRun, LevelFormat, ExternalHyperlink, UnderlineType,
} from 'docx'

import type { BegleiterMeta } from './types'

export const CALLOUT_LABELS: Record<string, string> = {
  lernziel: 'Lernziel',
  hinweis: 'Hinweis',
  beispiel: 'Beispiel',
  warnung: 'Warnung',
  reflexion: 'Reflexion',
  coaching: 'Coaching-Move',
  mehrdeutigkeit: 'Mehrdeutigkeit halten',
  differenzieren: 'Differenzieren',
}

export const CALLOUT_COLORS: Record<string, { bg: string; bd: string }> = {
  lernziel:       { bg: 'E9F3EC', bd: '2F7A4A' },
  hinweis:        { bg: 'E8EEF7', bd: '2A548C' },
  beispiel:       { bg: 'F1EDE4', bd: '7A6135' },
  warnung:        { bg: 'FAECE9', bd: 'B8232B' },
  reflexion:      { bg: 'EFEAF5', bd: '5E3F8A' },
  coaching:       { bg: 'FDF5E1', bd: 'A07A14' },
  mehrdeutigkeit: { bg: 'E6F1F1', bd: '2F7373' },
  differenzieren: { bg: 'EDEDED', bd: '4A4A4A' },
}

const POINT = (pt: number) => pt * 2
const TWIP = (pt: number) => Math.round(pt * 20)

const C = {
  brand: '80FF00',
  brandDeep: '5A9D14',
  brandSoft: 'E8FCC6',
  primary: '1A1A1A',
  primarySoft: 'F1F1EE',
  accent: '5A9D14',
  ink: '1A1A1A',
  ink2: '4A4A4A',
  muted: '7A7A7A',
  line: 'DCDCDC',
  lineSoft: 'ECECEC',
  panel: 'F7F6F1',
  code: 'F5F3ED',
  codeBd: 'E6E2D4',
}

function parseFrontmatter(raw: string): { meta: BegleiterMeta; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return { meta: {}, body: raw }
  const meta: BegleiterMeta = {}
  m[1].split(/\r?\n/).forEach((line) => {
    if (!line.trim() || line.trim().startsWith('#')) return
    const km = /^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/.exec(line)
    if (!km) return
    let v = km[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    meta[km[1]] = v
  })
  return { meta, body: raw.slice(m[0].length) }
}

function makeMarked() {
  const m = new Marked({ gfm: true, breaks: false })
  // Callout extension: > [!type] title \n > body…
  m.use({
    extensions: [{
      name: 'callout',
      level: 'block',
      start(src: string) {
        const i = src.search(/^>\s*\[!/m)
        return i < 0 ? undefined : i
      },
      tokenizer(src: string) {
        const rule = /^(?:>[ \t]*\[!([A-Za-z_]+)\][ \t]*(.*?)\r?\n)((?:>.*(?:\r?\n|$))*)/
        const mt = rule.exec(src)
        if (!mt) return
        const type = mt[1].toLowerCase()
        if (!(type in CALLOUT_LABELS)) return
        const title = (mt[2] || '').trim()
        const bodyText = mt[3]
          .split(/\r?\n/)
          .map((ln) => ln.replace(/^>[ \t]?/, ''))
          .join('\n')
          .replace(/\n+$/, '')
        const tokens: any[] = []
        ;(this as any).lexer.blockTokens(bodyText, tokens)
        return { type: 'callout', raw: mt[0], calloutType: type, title, tokens }
      },
      renderer() { return '' },
    }],
  })
  return m
}

function decodeEntities(s: string): string {
  return String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
}
function stripTags(s: string): string { return String(s).replace(/<[^>]+>/g, '') }

function inlineRuns(tokens: any[] | undefined, style: any = {}): (TextRun | ExternalHyperlink)[] {
  const out: (TextRun | ExternalHyperlink)[] = []
  if (!tokens) return out
  for (const t of tokens) {
    switch (t.type) {
      case 'text':
        if (t.tokens && t.tokens.length) out.push(...inlineRuns(t.tokens, style))
        else out.push(new TextRun({ text: decodeEntities(t.text), ...style }))
        break
      case 'escape':
        out.push(new TextRun({ text: t.text, ...style }))
        break
      case 'strong':
        out.push(...inlineRuns(t.tokens, { ...style, bold: true }))
        break
      case 'em':
        out.push(...inlineRuns(t.tokens, { ...style, italics: true }))
        break
      case 'del':
        out.push(...inlineRuns(t.tokens, { ...style, strike: true }))
        break
      case 'codespan':
        out.push(new TextRun({
          text: decodeEntities(t.text),
          font: 'JetBrains Mono',
          color: '6A3E00',
          shading: { type: ShadingType.CLEAR, fill: 'F0EEE8', color: 'auto' },
          ...style,
        }))
        break
      case 'br':
        out.push(new TextRun({ break: 1, ...style }))
        break
      case 'link': {
        const children = inlineRuns(t.tokens, {
          ...style,
          color: C.brandDeep,
          underline: { type: UnderlineType.SINGLE, color: C.brandDeep },
        }) as TextRun[]
        out.push(new ExternalHyperlink({ link: t.href, children }))
        break
      }
      case 'image':
        out.push(new TextRun({ text: `[Bild: ${t.text || t.href}]`, italics: true, color: C.muted, ...style }))
        break
      case 'html':
        out.push(new TextRun({ text: stripTags(t.text), ...style }))
        break
      default:
        if (t.tokens) out.push(...inlineRuns(t.tokens, style))
        else if (t.text) out.push(new TextRun({ text: decodeEntities(t.text), ...style }))
    }
  }
  return out
}

function noBorders(overrides: any = {}) {
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  return { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none, ...overrides }
}

function spacer(): Paragraph {
  return new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '', size: POINT(4) })] })
}

function headingParagraph(t: any): Paragraph {
  const level = t.depth as 1 | 2 | 3 | 4
  const map: Record<number, any> = {
    1: { size: POINT(22), color: C.ink, bold: true, font: 'Source Serif 4', spacing: { before: 0, after: 120 } },
    2: { size: POINT(18), color: C.ink, bold: true, font: 'Source Serif 4', spacing: { before: 0, after: 160 },
         border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: C.brand, space: 6 } } },
    3: { size: POINT(13), color: C.ink, bold: true, font: 'Source Serif 4', spacing: { before: 280, after: 80 } },
    4: { size: POINT(10), color: C.ink2, bold: true, font: 'Source Sans 3', caps: true, spacing: { before: 200, after: 60 } },
  }
  const cfg = map[level] || map[4]
  const runs = inlineRuns(t.tokens, { bold: cfg.bold, color: cfg.color, font: cfg.font, size: cfg.size, allCaps: cfg.caps })
  const headingStyle: any = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3, 4: HeadingLevel.HEADING_4 }[level]
  return new Paragraph({
    heading: headingStyle,
    spacing: cfg.spacing,
    border: cfg.border,
    children: runs as any,
    keepNext: true,
    pageBreakBefore: level === 2,
  })
}

function blockquoteParagraphs(t: any): any[] {
  const inner: any[] = []
  for (const c of t.tokens) inner.push(...blockToParagraphs(c))
  if (!inner.length) inner.push(new Paragraph({ children: [] }))
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: 'fixed' as any,
      borders: noBorders({ left: { style: BorderStyle.SINGLE, size: 18, color: C.ink2 } }),
      rows: [new TableRow({
        children: [new TableCell({
          margins: { top: 120, bottom: 120, left: 220, right: 180 },
          shading: { type: ShadingType.CLEAR, fill: C.panel, color: 'auto' },
          children: inner,
        })],
      })],
    }),
    spacer(),
  ]
}

// Callout-Typen, die im LP-Begleiter extra Gewicht bekommen (Cluster 5):
// coaching + differenzieren tragen die didaktischen Kern-Moves und Scaffolds —
// sie sollen aus dem leichteren Links-Rand-Stil der uebrigen Callouts heraus-
// stechen. Render: farbiges Header-Band (Label weiss auf Rahmenfarbe) + Box.
const EMPHASIS_CALLOUTS = new Set(['coaching', 'differenzieren'])

function calloutTable(t: any): any[] {
  const colors = CALLOUT_COLORS[t.calloutType] || { bg: 'EEEEEE', bd: '888888' }
  const label = CALLOUT_LABELS[t.calloutType] || t.calloutType
  const labelText = label + (t.title ? '  ·  ' + t.title : '')
  const body: any[] = []
  for (const c of t.tokens) body.push(...blockToParagraphs(c))

  if (EMPHASIS_CALLOUTS.has(t.calloutType)) {
    const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: 'fixed' as any,
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 8,  color: colors.bd },
          bottom: { style: BorderStyle.SINGLE, size: 8,  color: colors.bd },
          left:   { style: BorderStyle.SINGLE, size: 40, color: colors.bd },
          right:  { style: BorderStyle.SINGLE, size: 8,  color: colors.bd },
          insideHorizontal: none,
          insideVertical: none,
        },
        rows: [
          new TableRow({
            children: [new TableCell({
              shading: { type: ShadingType.CLEAR, fill: colors.bd, color: 'auto' },
              margins: { top: 70, bottom: 70, left: 220, right: 180 },
              children: [new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [new TextRun({
                  text: labelText.toUpperCase(),
                  bold: true, size: POINT(10.5), color: 'FFFFFF', font: 'Source Sans 3',
                  characterSpacing: 16,
                })],
              })],
            })],
          }),
          new TableRow({
            children: [new TableCell({
              shading: { type: ShadingType.CLEAR, fill: colors.bg, color: 'auto' },
              margins: { top: 150, bottom: 150, left: 220, right: 180 },
              children: body.length ? body : [new Paragraph({ children: [] })],
            })],
          }),
        ],
      }),
      spacer(),
    ]
  }

  const inner: any[] = [
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [new TextRun({
        text: labelText.toUpperCase(),
        bold: true, size: POINT(9), color: colors.bd, font: 'Source Sans 3',
        characterSpacing: 12,
      })],
    }),
    ...body,
  ]
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: 'fixed' as any,
      borders: noBorders({ left: { style: BorderStyle.SINGLE, size: 18, color: colors.bd } }),
      rows: [new TableRow({
        children: [new TableCell({
          margins: { top: 140, bottom: 140, left: 220, right: 180 },
          shading: { type: ShadingType.CLEAR, fill: colors.bg, color: 'auto' },
          children: inner,
        })],
      })],
    }),
    spacer(),
  ]
}

function listParagraphs(t: any, depth = 0): any[] {
  const out: any[] = []
  const ordered = t.ordered
  for (const item of t.items) {
    const itemChildren: any[] = item.tokens || []
    let mainTextTokens: any[] = []
    const nestedBlocks: any[] = []
    for (const c of itemChildren) {
      if (c.type === 'list') nestedBlocks.push(c)
      else if (c.type === 'text' || c.type === 'paragraph') {
        mainTextTokens = mainTextTokens.concat(c.tokens || [{ type: 'text', text: c.text || '' }])
      } else nestedBlocks.push(c)
    }
    let firstLine = inlineRuns(mainTextTokens) as TextRun[]
    if (item.task) {
      firstLine = [new TextRun({ text: item.checked ? '☒  ' : '☐  ', size: POINT(11) }), ...firstLine]
    }
    out.push(new Paragraph({
      spacing: { before: 30, after: 30, line: 300 },
      indent: { left: TWIP(14 + depth * 18), hanging: TWIP(14) },
      numbering: item.task ? undefined : { reference: ordered ? 'ordered' : 'bullet', level: depth },
      children: firstLine,
    }))
    for (const nb of nestedBlocks) {
      if (nb.type === 'list') out.push(...listParagraphs(nb, depth + 1))
      else for (const para of blockToParagraphs(nb)) out.push(para)
    }
  }
  return out
}

function codeParagraphs(t: any): any[] {
  const lines = String(t.text || '').split(/\r?\n/)
  const innerParas = lines.map((line) => new Paragraph({
    spacing: { before: 0, after: 0, line: 260 },
    children: [new TextRun({ text: line || ' ', font: 'JetBrains Mono', size: POINT(9.5), color: '2A2A2A' })],
  }))
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: 'fixed' as any,
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 4, color: C.codeBd },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: C.codeBd },
        left:   { style: BorderStyle.SINGLE, size: 4, color: C.codeBd },
        right:  { style: BorderStyle.SINGLE, size: 4, color: C.codeBd },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideVertical:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      },
      rows: [new TableRow({
        children: [new TableCell({
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          shading: { type: ShadingType.CLEAR, fill: C.code, color: 'auto' },
          children: innerParas,
        })],
      })],
    }),
    spacer(),
  ]
}

function tableBlock(t: any): any[] {
  const cellText = (cell: any) => ((cell.tokens || [{ text: cell.text || '' }]).map((x: any) => x.text || '').join(''))
  const isSteckbrief = (t.header || []).length === 2
    && t.header.every((cell: any) => cellText(cell).replace(/ /g, '').trim() === '')
  const hasHeader = !isSteckbrief && (t.header || []).some((cell: any) => cellText(cell).trim() !== '')

  const rows: TableRow[] = []
  const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: C.line }

  if (hasHeader) {
    rows.push(new TableRow({
      tableHeader: true,
      children: t.header.map((cell: any) => new TableCell({
        shading: { type: ShadingType.CLEAR, fill: C.ink, color: 'auto' },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: inlineRuns(cell.tokens, { bold: true, color: 'FFFFFF', size: POINT(9.5) }) as any })],
      })),
    }))
  }

  for (let ri = 0; ri < t.rows.length; ri++) {
    const r = t.rows[ri]
    const stripe = !isSteckbrief && (ri % 2 === 1)
    rows.push(new TableRow({
      children: r.map((cell: any, ci: number) => {
        const isSteckLabel = isSteckbrief && ci === 0
        const innerRuns = inlineRuns(cell.tokens, {
          bold: isSteckLabel,
          color: isSteckLabel ? C.brandDeep : undefined,
          size: POINT(10),
        })
        return new TableCell({
          shading: isSteckLabel
            ? { type: ShadingType.CLEAR, fill: C.brandSoft, color: 'auto' }
            : stripe
            ? { type: ShadingType.CLEAR, fill: 'FAFAF7', color: 'auto' }
            : undefined,
          margins: { top: 70, bottom: 70, left: 120, right: 120 },
          width: isSteckbrief && ci === 0 ? { size: 32, type: WidthType.PERCENTAGE } : undefined,
          children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: innerRuns as any })],
        })
      }),
    }))
  }

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: 'fixed' as any,
      borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder, insideHorizontal: cellBorder, insideVertical: cellBorder },
      rows,
    }),
    spacer(),
  ]
}

function blockToParagraphs(token: any): any[] {
  switch (token.type) {
    case 'heading': return [headingParagraph(token)]
    case 'paragraph':
      return [new Paragraph({ spacing: { before: 60, after: 100, line: 320 }, children: inlineRuns(token.tokens) as any })]
    case 'blockquote': return blockquoteParagraphs(token)
    case 'callout': return calloutTable(token)
    case 'list': return listParagraphs(token)
    case 'code': return codeParagraphs(token)
    case 'hr':
      return [new Paragraph({
        spacing: { before: 60, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 1 } },
        children: [new TextRun({ text: '' })],
      })]
    case 'table': return tableBlock(token)
    case 'space': return []
    case 'html':
      return [new Paragraph({ children: [new TextRun({ text: stripTags(token.text), color: C.muted, size: POINT(10) })] })]
    default:
      if (token.tokens) {
        const out: any[] = []
        for (const c of token.tokens) out.push(...blockToParagraphs(c))
        return out
      }
      return []
  }
}

function titleBlock(meta: BegleiterMeta): Paragraph[] {
  const out: Paragraph[] = []
  out.push(new Paragraph({
    spacing: { before: 0, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 22, color: C.brand, space: 2 } },
    children: [new TextRun({
      text: (meta.kompetenz ? 'KOMPETENZ ' + meta.kompetenz : 'BEGLEITDOKUMENT').toUpperCase(),
      bold: true, color: C.brandDeep, size: POINT(9.5), characterSpacing: 30, font: 'Source Sans 3',
    })],
  }))
  out.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 120, after: 80 },
    children: [new TextRun({ text: meta.titel || 'Begleit-Dokument', bold: true, color: C.ink, size: POINT(22), font: 'Source Serif 4' })],
  }))
  if (meta.untertitel) {
    out.push(new Paragraph({
      spacing: { before: 0, after: 140 },
      children: [new TextRun({ text: meta.untertitel, italics: true, color: C.ink2, size: POINT(12), font: 'Source Serif 4' })],
    }))
  }
  const bits: Array<[string, string]> = []
  if (meta.kompetenz_slug) bits.push(['Kompetenz-Slug', meta.kompetenz_slug])
  if (meta.beruf) bits.push(['Beruf', meta.beruf])
  if (meta.thema) bits.push(['Thema', meta.thema])
  if (meta.fach) bits.push(['Lernbereiche', meta.fach])
  if (meta.autor) bits.push(['Lehrperson', meta.autor])
  if (meta.stand) bits.push(['Stand', meta.stand])
  if (meta.version) bits.push(['Version', meta.version])
  if (bits.length) {
    const runs: TextRun[] = []
    bits.forEach(([k, v], i) => {
      if (i > 0) runs.push(new TextRun({ text: '    ', size: POINT(9.5) }))
      runs.push(new TextRun({ text: k + ': ', bold: true, color: C.ink2, size: POINT(9.5) }))
      runs.push(new TextRun({ text: v, color: C.muted, size: POINT(9.5) }))
    })
    out.push(new Paragraph({
      spacing: { before: 60, after: 240 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 8 } },
      children: runs,
    }))
  }
  return out
}

function buildHeader(_meta: BegleiterMeta, logoBuffer: ArrayBuffer | Uint8Array | null | undefined): Header {
  const logoPara = logoBuffer
    ? new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 0 },
        children: [new ImageRun({ data: logoBuffer, transformation: { width: 150, height: 57 } } as any)],
      })
    : new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: 'BBW · Berufsbildungsschule Winterthur', bold: true, color: C.brandDeep, size: POINT(10), font: 'Source Sans 3' })],
      })
  return new Header({
    children: [
      logoPara,
      new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '', size: POINT(2) })] }),
    ],
  })
}

function buildFooter(meta: BegleiterMeta): Footer {
  return new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorders({ top: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 6 } }),
        rows: [new TableRow({
          children: [
            new TableCell({
              width: { size: 72, type: WidthType.PERCENTAGE },
              borders: noBorders(),
              margins: { top: 80, bottom: 0, left: 0, right: 80 },
              children: [new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 0 },
                children: [new TextRun({ text: meta.titel || '', italics: true, color: C.ink2, size: POINT(8.5), font: 'Source Serif 4' })],
              })],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: noBorders(),
              margins: { top: 80, bottom: 0, left: 80, right: 0 },
              children: [new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({ text: 'Seite ', color: C.muted, size: POINT(8.5), font: 'Source Sans 3' }),
                  new TextRun({ children: [PageNumber.CURRENT] as any, color: C.ink2, size: POINT(8.5), font: 'Source Sans 3' }),
                  new TextRun({ text: ' / ', color: C.muted, size: POINT(8.5), font: 'Source Sans 3' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES] as any, color: C.ink2, size: POINT(8.5), font: 'Source Sans 3' }),
                ],
              })],
            }),
          ],
        })],
      }),
    ],
  })
}

const numberingConfig = {
  config: [
    {
      reference: 'bullet',
      levels: [0, 1, 2, 3, 4].map((lvl) => ({
        level: lvl,
        format: LevelFormat.BULLET,
        text: ['•', '◦', '▪', '•', '◦'][lvl] || '•',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: TWIP(18 * (lvl + 1)), hanging: TWIP(14) } } },
      })),
    },
    {
      reference: 'ordered',
      levels: [0, 1, 2, 3].map((lvl) => ({
        level: lvl,
        format: LevelFormat.DECIMAL,
        text: `%${lvl + 1}.`,
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: TWIP(18 * (lvl + 1)), hanging: TWIP(18) } } },
      })),
    },
  ],
}

function buildDocument(raw: string, logoBuffer: ArrayBuffer | Uint8Array | null = null): Document {
  const { meta, body } = parseFrontmatter(raw)
  const marked = makeMarked()
  const tokens = marked.lexer(body || '') as any[]

  const children: any[] = []
  children.push(...titleBlock(meta))
  for (const t of tokens) {
    for (const b of blockToParagraphs(t)) children.push(b)
  }

  return new Document({
    creator: meta.autor || 'BBW',
    title: meta.titel || 'Begleitdokument',
    description: meta.untertitel || '',
    styles: {
      default: {
        document: { run: { font: 'Source Sans 3', size: POINT(11), color: C.ink } } as any,
      },
    },
    numbering: numberingConfig as any,
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1900, right: 1500, bottom: 1500, left: 1500, header: 720, footer: 720 },
        },
      },
      headers: { default: buildHeader(meta, logoBuffer) },
      footers: { default: buildFooter(meta) },
      children,
    }],
  })
}

export async function buildBegleiterDocx(raw: string, logoBuffer: ArrayBuffer | Uint8Array | null = null): Promise<Blob> {
  return Packer.toBlob(buildDocument(raw, logoBuffer))
}

export async function buildBegleiterBuffer(raw: string, logoBuffer: ArrayBuffer | Uint8Array | null = null): Promise<Buffer> {
  return Packer.toBuffer(buildDocument(raw, logoBuffer))
}

export function parseBegleiter(raw: string) { return parseFrontmatter(raw) }
