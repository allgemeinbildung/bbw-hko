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

import type { KnJson, KnTyp, PrinzipJson, SetJson, SituationJson, KiJson, LernpromptJson, LernbegleiterJson } from './types'
import type { DossierJson, DossierRecherche, DossierScaffold } from '../../components/einheiten/docs/DocEbaDossier'
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

// C1 + C2 — cockpit (Deckblatt) now also carries the merged situation block.
// Order mirrors the HTML CockpitPageBody: badges/title/sub-facette → cards →
// situation_text → Leitfrage (+ Spannungsfeld) → Checkliste Vollständigkeit → Ressourcen.
function cockpitBlock(sit: SituationJson, akzent: string, light: string): any[] {
  const els: any[] = []
  // C1 — no KOMP badge; HF badge without emotion.
  els.push(new Paragraph({
    children: [
      badgeRun('Herausforderung ' + sit.buchstabe, akzent),
    ],
    spacing: { after: 200 },
  }))
  els.push(h(sit.titel || '', 'title'))
  els.push(p(sit.modul_titel || '', { run: { color: COLOR.inkSoft, size: 22, italics: true } }))
  // C1 — sub-facette label only (no "Herausforderung X:" prefix).
  if (sit.herausforderung?.label) {
    els.push(p(sit.herausforderung.label, { run: { color: akzent, bold: true, size: 18 } }))
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
  els.push(spacer(80))

  // page-1 metadata (Lebensbezug + Sprachmodi) — mirrors the HTML cockpit meta (also shown on the HP page)
  {
    const lebensbezug = sit.nrlp?.lebensbezug_text
    const sprachmodi = (sit.nrlp?.sprachmodi || []).filter(Boolean)
    if (lebensbezug) {
      els.push(new Paragraph({
        children: [
          new TextRun({ text: 'LEBENSBEZUG  ', color: akzent, bold: true, size: 13 }),
          new TextRun({ text: lebensbezug, size: 16, color: COLOR.inkSoft }),
        ],
        spacing: { after: 30 },
      }))
    }
    if (sprachmodi.length) {
      els.push(new Paragraph({
        children: [
          new TextRun({ text: 'SPRACHMODI  ', color: akzent, bold: true, size: 13 }),
          new TextRun({ text: sprachmodi.join(' · '), size: 16, color: COLOR.inkSoft }),
        ],
        spacing: { after: 60 },
      }))
    }
  }
  els.push(spacer(80))

  // C2 — merged situation: situation_text + Leitfrage (+ Spannungsfeld). sit-meta + zahlen_tabelle dropped.
  els.push(p(sit.situation_text || '', { run: { size: 22 }, spacing: { after: 160, line: 360, lineRule: LineRuleType.AUTO } }))
  els.push(callout('Leitfrage', sit.leitfrage || '', akzent, light))
  if (sit.mehrdeutigkeit?.trade_off) {
    els.push(spacer(80))
    els.push(callout('Spannungsfeld', sit.mehrdeutigkeit.trade_off, akzent, light))
  }
  els.push(spacer(140))

  // C1 — Checkliste Vollständigkeit (Produkt · Kriterien · ☐); vollstaendig_wenn bullets; no Total/Abgabe/Gewicht.
  if (sit.bewertungsraster) {
    els.push(p('CHECKLISTE VOLLSTÄNDIGKEIT', { run: { color: akzent, bold: true, size: 14 } }))
    els.push(dataTable(
      ['Produkt', 'Kriterien', '☐'],
      sit.bewertungsraster.map((b) => {
        const bullets = b.vollstaendig_wenn?.filter(Boolean) || []
        const kritCell = bullets.length
          ? bullets.map((v) => new Paragraph({ children: [new TextRun({ text: v, size: 16 })], bullet: { level: 0 }, spacing: { after: 20 } }))
          : [p(b.kriterium || '', { run: { size: 18 } })]
        return [
          new Paragraph({ children: [new TextRun({ text: b.produkt, bold: true, size: 18 })] }),
          kritCell,
          new Paragraph({ children: [new TextRun({ text: '☐', size: 22, bold: true, color: akzent })], alignment: AlignmentType.CENTER }),
        ]
      }),
      akzent, [26, 66, 8],
    ))
    els.push(spacer(80))
  }

  // C1 — "Quellen" → "Ressourcen"
  if (sit.quellen_anker) {
    els.push(p('RESSOURCEN', { run: { color: akzent, bold: true, size: 14 } }))
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

// C2 — situationBlock removed; its content (situation_text + Leitfrage + Spannungsfeld) is now part of cockpitBlock.

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

// C5 — DOCX mindmap as a 2×2 quadrant: center label on top, then 4 cells
// (titel + punkte in full / titel + blank room in skeleton). 4th cell marked optional (dashed).
function mindmapQuadrant(sit: SituationJson, akzent: string, full: boolean): any[] {
  const els: any[] = []
  const aeste = sit.mindmap_aeste || []

  // Center node (full width)
  els.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [tcell([
        p(sit.mindmap_zentrum || '', { run: { bold: true, color: 'FFFFFF', size: 22 }, alignment: AlignmentType.CENTER }),
      ], {
        shading: { type: ShadingType.SOLID, color: akzent },
        borders: { top: { style: BorderStyle.SINGLE, color: akzent, size: 12 }, bottom: { style: BorderStyle.SINGLE, color: akzent, size: 12 }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
        margins: { top: 160, bottom: 160, left: 120, right: 120 },
      })],
    })],
  }))
  els.push(spacer(120))

  const cellFor = (ast: typeof aeste[number] | undefined): TableCell => {
    if (!ast) return tcell(p('', { run: { size: 18 } }), { width: { size: 50, type: WidthType.PERCENTAGE } })
    const kids: any[] = [
      new Paragraph({
        children: [
          new TextRun({ text: ast.titel, bold: true, color: akzent, size: 18 }),
          ...(ast.optional ? [new TextRun({ text: '  · optional', color: COLOR.inkMute, size: 14 })] : []),
        ],
        spacing: { after: 60 },
      }),
    ]
    if (full) {
      ast.punkte?.forEach((pt) => kids.push(new Paragraph({ children: [new TextRun({ text: pt, size: 16 })], bullet: { level: 0 }, spacing: { after: 30 } })))
    } else {
      for (let s = 0; s < 4; s++) kids.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { line: 320, lineRule: LineRuleType.AUTO } }))
    }
    return tcell(kids, {
      verticalAlign: 'top',
      width: { size: 50, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
        left: { style: ast.optional ? BorderStyle.DASHED : BorderStyle.SINGLE, size: 12, color: ast.optional ? COLOR.inkMute : akzent },
        right: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
      },
    })
  }

  els.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [cellFor(aeste[0]), cellFor(aeste[1])] }),
      new TableRow({ children: [cellFor(aeste[2]), cellFor(aeste[3])] }),
    ],
  }))
  return els
}

function mindmapSkelettBlock(sit: SituationJson, akzent: string): any[] {
  const els: any[] = []
  // C5/AS-2 — same hint string as the HTML skeleton.
  els.push(p('Bauen Sie Ihre Mindmap aus Ihren Leitfragen-Antworten und den Ressourcen auf dieser Seite. Zentrum und die vier Ast-Titel sind gesetzt — ergänzen Sie die Detail-Punkte selbst.',
    { run: { italics: true, color: COLOR.inkMute, size: 16 } }))
  els.push(spacer(80))
  els.push(...mindmapQuadrant(sit, akzent, false))
  return els
}

// Dossier mindmap — no diagram (drawn on paper/another device); just hint at the four Ast-Titel.
function mindmapHinweisBlock(sit: SituationJson, akzent: string): any[] {
  const els: any[] = []
  els.push(p('Die Mindmap erstellen Sie selbst — auf Papier oder einem Gerät. Bauen Sie sie aus dem Zentrum und diesen vier Ästen auf:',
    { run: { italics: true, color: COLOR.inkSoft, size: 16 } }))
  ;(sit.mindmap_aeste || []).forEach((ast, i) => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: (i + 1) + '. ', bold: true, color: akzent, size: 18, font: 'Consolas' }),
        new TextRun({ text: ast.titel, size: 18 }),
        ...(ast.optional ? [new TextRun({ text: '  · optional', color: COLOR.inkMute, size: 14 })] : []),
      ],
      spacing: { after: 40 },
      indent: { left: 200 },
    }))
  })
  return els
}

// C6 — Handlungsprodukt Anleitung (6a): metadata → beschreibung → Schritte → Abgabe → Gütekriterien → Scaffolding.
// No write area here; the fill-mode Arbeitsfläche (6b) is emitted in buildDocS after a page break.
function handlungsproduktBlock(sit: SituationJson, akzent: string): any[] {
  const hp = sit.handlungsprodukt
  if (!hp) return []
  const els: any[] = []

  // metadata (Lebensbezug + Sprachmodi) — replaces the old format badge / "Du übst"-Marker
  const lebensbezug = sit.nrlp?.lebensbezug_text
  const sprachmodi = (sit.nrlp?.sprachmodi || []).filter(Boolean)
  if (lebensbezug) {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: 'LEBENSBEZUG  ', color: akzent, bold: true, size: 14 }),
        new TextRun({ text: lebensbezug, size: 18, color: COLOR.inkSoft }),
      ],
      spacing: { after: 40 },
    }))
  }
  if (sprachmodi.length) {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: 'SPRACHMODI  ', color: akzent, bold: true, size: 14 }),
        new TextRun({ text: sprachmodi.join(' · '), size: 18, color: COLOR.inkSoft }),
      ],
      spacing: { after: 140 },
    }))
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

  // "Das liefern Sie ab" — konkrete Abgabe(n)
  if (hp.abgaben?.length) {
    els.push(spacer(80))
    els.push(p('DAS LIEFERN SIE AB', { run: { color: akzent, bold: true, size: 14 }, spacing: { after: 40 } }))
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
  }

  // C6 — Gütekriterien (lernfortschritt.kriterien): ☐ + kriterium — indikator (gewicht ignored)
  const kriterien = sit.lernfortschritt?.kriterien?.filter((k) => k && (k.kriterium || k.indikator)) || []
  if (kriterien.length) {
    els.push(spacer(80))
    els.push(p('GÜTEKRITERIEN', { run: { color: akzent, bold: true, size: 14 }, spacing: { after: 40 } }))
    kriterien.forEach((k) => {
      els.push(new Paragraph({
        children: [
          new TextRun({ text: '☐  ', bold: true, color: akzent, size: 20 }),
          new TextRun({ text: k.kriterium || '', bold: true, size: 18 }),
          ...(k.indikator ? [new TextRun({ text: ' — ' + k.indikator, size: 18, color: COLOR.inkSoft })] : []),
        ],
        spacing: { after: 40 },
        indent: { left: 200 },
      }))
    })
  }

  // C6 — Scaffolding (Satzanfänge · Strategien · Struktur)
  const sc = hp.scaffolding
  if (sc) {
    const groups: Array<[string, string[] | undefined]> = [
      ['Satzanfänge', sc.satzanfaenge],
      ['Strategien', sc.strategien],
      ['Struktur', sc.struktur],
    ]
    const present = groups.filter(([, items]) => (items?.filter(Boolean).length || 0) > 0)
    if (present.length) {
      els.push(spacer(80))
      els.push(p('WIE GEHT DAS?', { run: { color: akzent, bold: true, size: 14 }, spacing: { after: 40 } }))
      present.forEach(([label, items]) => {
        els.push(p(label, { run: { color: akzent, bold: true, size: 16 }, spacing: { before: 60, after: 20 } }))
        items!.filter(Boolean).forEach((it) => {
          els.push(new Paragraph({ children: [new TextRun({ text: it, size: 18 })], bullet: { level: 0 }, spacing: { after: 20 }, indent: { left: 200 } }))
        })
      })
    }
  }

  return els
}

// C8 — the embedded austausch block was removed from DOC-S. The set-level
// "Austausch & Transfer" content now lives in the standalone buildAustausch() below.

export interface BuildDocSOpts {
  sit: SituationJson
  set: SetJson | null
  abteilung?: string
  mode: 'info' | 'fill'
  logoPng?: ArrayBuffer | Uint8Array | null
}

export function buildDocS({ sit, abteilung, mode, logoPng = null }: BuildDocSOpts): Document {
  const palette = sitPalette(sit)
  const akzent = palette.akzent
  const light = palette.light
  const docCode = `DOC-S · HF ${sit.buchstabe} · ${mode === 'info' ? 'DOSSIER' : 'AUFTRAG'}`
  const docTitel = sit.titel || ''

  // C1/C2/C6/C8 — page 1 cockpit carries the merged situation; HP split into Anleitung + Arbeitsfläche;
  // austausch lives in the standalone DOC-AUSTAUSCH.
  const children: any[] = []
  children.push(...cockpitBlock(sit, akzent, light))
  if (mode === 'fill') {
    children.push(pageBreak())
    children.push(...sectionHead('02 · Wissensecke', 'Leitfragen', akzent))
    if (sit.leitfragen_intro) children.push(p(sit.leitfragen_intro, { run: { color: COLOR.inkSoft, size: 18 } }))
    children.push(...leitfrageItems(sit, akzent, true, 55))
    children.push(pageBreak())
    children.push(...sectionHead('03 · Mindmap', sit.mindmap_zentrum || '', akzent))
    children.push(...mindmapSkelettBlock(sit, akzent))
    children.push(pageBreak())
    children.push(...sectionHead('04 · Handlungsprodukt', sit.handlungsprodukt?.titel || '', akzent))
    children.push(...handlungsproduktBlock(sit, akzent))
    children.push(pageBreak())
    // 6b — full-page writing surface: no "Arbeitsfläche" heading, box fills the page
    children.push(skizzeBox(235, sit.handlungsprodukt?.schreib_label || 'HIER ERARBEITEN', akzent))
    children.push(pageBreak())
    children.push(...sectionHead('05 · Selbstcheck', 'Reflexion', akzent))
    children.push(...reflexionItems(sit, akzent, true, 35))
  } else {
    children.push(pageBreak())
    children.push(...sectionHead('02 · Wissensecke', 'Leitfragen', akzent))
    if (sit.leitfragen_intro) children.push(p(sit.leitfragen_intro, { run: { color: COLOR.inkSoft, size: 16 } }))
    children.push(...leitfrageItems(sit, akzent, false))
    // Mindmap hint shares the Leitfragen page (Dossier saves a page) — no diagram, drawn off-sheet.
    children.push(...sectionHead('03 · Mindmap', sit.mindmap_zentrum || '', akzent))
    children.push(...mindmapHinweisBlock(sit, akzent))
    children.push(pageBreak())
    children.push(...sectionHead('04 · Handlungsprodukt', sit.handlungsprodukt?.titel || '', akzent))
    children.push(...handlungsproduktBlock(sit, akzent))
    children.push(pageBreak())
    children.push(...sectionHead('05 · Selbstcheck', 'Reflexion', akzent))
    children.push(...reflexionItems(sit, akzent, false))
  }

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  })
}

export interface BuildAustauschOpts {
  set: SetJson | null
  sits?: (SituationJson | null)[]
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

// C8 — standalone set-level "Austausch & Transfer" document (mirrors DocAustausch.tsx).
export function buildAustausch({ set, sits = [], abteilung, logoPng = null }: BuildAustauschOpts): Document {
  const akzent = COLOR.neutral
  const docCode = 'DOC-AUSTAUSCH · SET-ABSCHLUSS'
  const docTitel = 'Austausch & Transfer'

  const validSits = (sits || []).filter((s): s is SituationJson => Boolean(s))
  const ap = set?.austausch_phase
  const da = set?.dekontextualisierungs_aufgabe
  // back-compat: prefer the new structured closure keys, fall back to the legacy names
  const gruppe = ap?.gruppenpuzzle ?? ap?.gruppenarbeit_jigsaw
  const plenum = ap?.plenum ?? ap?.einzelarbeit_plenum
  const einzel = ap?.einzelauftrag
  const konzeptFor = (s: SituationJson) => set?.konzept_progression?.find((k) => k.herausforderung === s.id)?.konzept

  // Transfer is a template-constant set task → generic writing scaffold + self-check (mirrors DocAustausch.tsx).
  const TRANSFER_SATZANFAENGE = [
    '«Das gemeinsame Prinzip meiner drei Herausforderungen ist …»',
    '«Ein neuer Kontext, in dem dasselbe Prinzip gilt, ist …»',
    '«Dort zeigt es sich konkret so: …»',
    '«Wie in Herausforderung … muss ich auch hier …»',
  ]
  const TRANSFER_CHECKLISTE = [
    'Kernprinzip in eigenen Worten benannt',
    'Neuer, selbst gewählter Kontext (nicht aus dem Unterricht)',
    '5–7 Sätze geschrieben',
    'Mindestens zwei Lehrmittelbegriffe verwendet',
    'Bezug zu mindestens einer der drei Herausforderungen erkennbar',
  ]

  const optionHead = (kuerzel: string, label: string) => new Paragraph({
    children: [
      new TextRun({ text: '☐  ', bold: true, color: akzent, size: 22 }),
      new TextRun({ text: kuerzel + ' · ', bold: true, color: akzent, size: 18, font: 'Consolas' }),
      new TextRun({ text: label, bold: true, size: 20 }),
    ],
    spacing: { before: 120, after: 40 },
    keepNext: true,
  })

  const children: any[] = []

  // ---------------- Page 1 — Austausch ----------------
  children.push(...sectionHead('01 · Austausch', 'Eure drei Lösungen im Vergleich', akzent))
  children.push(p('Ihr habt drei Herausforderungen bearbeitet und je ein Handlungsprodukt erstellt. Vergleicht jetzt eure Lösungen und arbeitet das gemeinsame Prinzip heraus. Wählt eine Sozialform und haltet eure Ergebnisse im Notizfeld fest:',
    { run: { size: 20 }, spacing: { after: 120, line: 340, lineRule: LineRuleType.AUTO } }))
  validSits.forEach((s) => {
    const k = konzeptFor(s)
    children.push(new Paragraph({
      children: [
        new TextRun({ text: 'HF ' + s.buchstabe + ': ', bold: true, color: akzent, size: 18 }),
        new TextRun({ text: s.handlungsprodukt?.format || s.titel || '', size: 18 }),
        ...(k ? [new TextRun({ text: ' — ' + k, size: 16, color: COLOR.inkSoft })] : []),
      ],
      bullet: { level: 0 },
      spacing: { after: 40 },
    }))
  })
  children.push(spacer(80))

  if (einzel) {
    children.push(optionHead('EA', 'Einzelauftrag'))
    children.push(p(einzel, { run: { size: 20 }, indent: { left: 300 } }))
    if (gruppe?.runde_3) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Und: ', bold: true, color: akzent, size: 18 }),
          new TextRun({ text: gruppe.runde_3, size: 20 }),
        ],
        spacing: { after: 60 }, indent: { left: 300 },
      }))
    }
    children.push(...schreibfeld(8))
  }
  if (gruppe && (gruppe.runde_1 || gruppe.runde_2 || gruppe.runde_3)) {
    children.push(optionHead('GA', 'Gruppenpuzzle'))
    ;([['Runde 1', gruppe.runde_1], ['Runde 2', gruppe.runde_2], ['Runde 3', gruppe.runde_3]] as Array<[string, string | undefined]>).forEach(([lab, text]) => {
      if (!text) return
      children.push(new Paragraph({
        children: [
          new TextRun({ text: lab + '   ', color: akzent, bold: true, size: 16, font: 'Consolas' }),
          new TextRun({ text, size: 20 }),
        ],
        spacing: { after: 60 },
        indent: { left: 300 },
      }))
    })
    children.push(...schreibfeld(8))
  }
  if (plenum) {
    children.push(optionHead('PL', 'Plenum'))
    children.push(p(plenum, { run: { size: 20 }, indent: { left: 300 } }))
    children.push(...schreibfeld(8))
  }

  // ---------------- Page 2 — Transfer ----------------
  children.push(pageBreak())
  children.push(...sectionHead('02 · Transfer', 'Transfer (Einzelarbeit)', akzent))
  if (da) {
    children.push(p(da.auftrag || '', { run: { bold: true, size: 20 }, spacing: { after: 60 } }))
    const metaParts = [da.format ? 'Format: ' + da.format : '', da.abgabe ? 'Abgabe: ' + da.abgabe : ''].filter(Boolean)
    if (metaParts.length) children.push(p(metaParts.join('  ·  '), { run: { color: COLOR.inkSoft, size: 16 } }))
    if (validSits.some((s) => s.dekontextualisierung?.frage)) {
      children.push(p('BEISPIELE AUS EUREN HERAUSFORDERUNGEN', { run: { color: akzent, bold: true, size: 14 }, spacing: { before: 100, after: 40 } }))
      validSits.forEach((s) => {
        if (!s.dekontextualisierung?.frage) return
        children.push(new Paragraph({
          children: [
            new TextRun({ text: 'HF ' + s.buchstabe + ': ', bold: true, color: akzent, size: 16 }),
            new TextRun({ text: s.dekontextualisierung.frage, size: 18 }),
          ],
          bullet: { level: 0 },
          spacing: { after: 40 },
        }))
      })
    }
  }
  children.push(p('SCHREIBHILFE — SATZANFÄNGE', { run: { color: akzent, bold: true, size: 14 }, spacing: { before: 120, after: 40 } }))
  TRANSFER_SATZANFAENGE.forEach((s) => {
    children.push(new Paragraph({ children: [new TextRun({ text: s, size: 18 })], bullet: { level: 0 }, spacing: { after: 30 } }))
  })
  children.push(spacer(80))
  children.push(p('DEIN TRANSFER (5–7 SÄTZE)', { run: { color: akzent, bold: true, size: 14 } }))
  children.push(...schreibfeld(50))
  children.push(spacer(80))
  children.push(p('SELBSTCHECK — HABE ICH DEN TRANSFER RICHTIG GEMACHT?', { run: { color: akzent, bold: true, size: 14 }, spacing: { after: 40 } }))
  TRANSFER_CHECKLISTE.forEach((c) => {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: '☐  ', bold: true, color: akzent, size: 18 }),
        new TextRun({ text: c, size: 18 }),
      ],
      spacing: { after: 30 },
      indent: { left: 200 },
    }))
  })

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  })
}

// --- EBA Glossar+ (Dossier) ------------------------------------------------
// Word-Export der EBA-Wissens-Einheit. Feldgleich zu DocEbaDossier.tsx: gleiche
// Seiten in gleicher Reihenfolge (Titel · ein Nugget pro Seite · Sprachhilfe ·
// Grundprinzip · Glossar · Notizen). Akzent set-weit BBW-Gruen.
const BBW_GRUEN = '0E6E3A'
const BBW_GRUEN_TINT = 'E8F3EC'

function dossierNuggetCode(id: string): string {
  // nugget_A_01 -> A-01 ; nugget_B_03 -> B-03 ; fallback: id (wie DocEbaDossier)
  const m = id.match(/_([AB])_?0*?(\d+)$/i)
  return m ? `${m[1].toUpperCase()}-${m[2].padStart(2, '0')}` : id
}

// Recherche-Strip eines Nuggets (mirror RechercheBlock in DocEbaDossier.tsx).
function dossierRechercheBlock(r: DossierRecherche, akzent: string): any[] {
  const queries = Array.isArray(r.suchbegriffe)
    ? r.suchbegriffe.filter(Boolean)
    : (r.suchbegriffe ? [r.suchbegriffe] : [])
  const ki = r.ki_beispiel || (r.ki_prompt ? { prompt: r.ki_prompt } : undefined)
  const hasKi = !!(ki && (ki.prompt || ki.so_fragst_du))
  const lernen = (r.ki_lernen || []).filter((l) => l && l.prompt)
  if (!queries.length && !hasKi && !lernen.length && !r.selbst_pruefen) return []

  const els: any[] = []
  const stripLabel = (icon: string, label: string) => new Paragraph({
    children: [
      new TextRun({ text: icon + '  ', size: 18 }),
      new TextRun({ text: label, bold: true, color: akzent, size: 18 }),
    ],
    spacing: { before: 120, after: 40 },
    keepNext: true,
  })

  if (queries.length) {
    els.push(stripLabel('🔎', 'Suchen Sie online:'))
    queries.forEach((q) => {
      els.push(new Paragraph({ children: [new TextRun({ text: `«${q}»`, size: 18 })], bullet: { level: 0 }, spacing: { after: 20 }, indent: { left: 200 } }))
    })
  }
  if (hasKi) {
    els.push(stripLabel('🤖', 'So fragen Sie die KI:'))
    if (ki!.so_fragst_du) els.push(p(ki!.so_fragst_du, { run: { size: 18 }, indent: { left: 200 } }))
    if (ki!.prompt) els.push(promptBox(ki!.prompt))
    if (ki!.tipp) els.push(p(ki!.tipp, { run: { italics: true, color: COLOR.inkSoft, size: 17 }, indent: { left: 200 } }))
    els.push(p('Prüfen Sie die Antwort an einer sicheren Quelle.', { run: { italics: true, color: COLOR.inkMute, size: 16 }, indent: { left: 200 } }))
  }
  if (lernen.length) {
    els.push(stripLabel('📚', 'So lernen Sie mit KI:'))
    lernen.forEach((l) => {
      els.push(new Paragraph({
        children: [
          ...(l.strategie ? [new TextRun({ text: l.strategie + ': ', bold: true, size: 18 })] : []),
          new TextRun({ text: `«${l.prompt}»`, size: 18 }),
        ],
        bullet: { level: 0 }, spacing: { after: 30 }, indent: { left: 200 },
      }))
    })
  }
  if (r.selbst_pruefen) {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: '✏  ', size: 18 }),
        new TextRun({ text: 'Selbst prüfen: ', bold: true, color: akzent, size: 18 }),
        new TextRun({ text: r.selbst_pruefen, size: 18 }),
      ],
      spacing: { before: 120, after: 40 }, keepNext: true,
    }))
    els.push(...schreibfeld(8))
  }
  return els
}

// Sprachhilfe-Karte (mirror ScaffoldCard: nur Satzanfaenge + so_gehst_du_vor).
function dossierScaffoldBlock(sc: DossierScaffold, akzent: string): any[] {
  const els: any[] = []
  els.push(h(`Herausforderung ${sc.tag || ''} — ${sc.modus_label || sc.sm_id || ''}`, 'section', COLOR.ink))
  const satz = (sc.satzanfaenge || []).filter(Boolean)
  if (satz.length) {
    els.push(p('Satzanfänge', { run: { color: akzent, bold: true, size: 14 }, spacing: { before: 80, after: 30 } }))
    satz.forEach((s) => els.push(new Paragraph({ children: [new TextRun({ text: s, size: 19 })], bullet: { level: 0 }, spacing: { after: 30 } })))
  }
  const schritte = (sc.so_gehst_du_vor || []).filter(Boolean)
  if (schritte.length) {
    els.push(spacer(80))
    schritte.forEach((s, i) => {
      els.push(new Paragraph({
        children: [
          new TextRun({ text: String(i + 1) + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: s.replace(/^\d+\.\s*/, ''), size: 19 }),
        ],
        spacing: { before: 60, after: 40 }, indent: { left: 200 },
      }))
    })
  }
  return els
}

export interface BuildDossierOpts {
  dossier: DossierJson
  abteilung?: string
  kompetenzNr?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

export function buildDossier({ dossier, abteilung, kompetenzNr, logoPng = null }: BuildDossierOpts): Document | null {
  if (!dossier) return null
  const kopf = dossier.kopf
  const einleitung = dossier.einleitung
  const nuggets = dossier.nuggets || []
  const scaffolds = dossier.sprachmodi_scaffolds || []
  const tw = dossier.transfer_wissensblatt
  const glossar = dossier.glossar || []

  // leeres Dossier -> kein Dokument (Workbench prueft if (docx))
  if (!kopf && !einleitung && !nuggets.length && !scaffolds.length && !tw && !glossar.length) return null

  const akzent = BBW_GRUEN
  const light = BBW_GRUEN_TINT
  const docCode = 'GLOSSAR+ · EBA'
  const docTitel = kopf?.einheit_titel || 'Glossar+'
  const komp = kompetenzNr || dossier.kompetenz_nr

  // Nuggets sortiert A -> B -> rest (wie DocEbaDossier).
  const aN = nuggets.filter((n) => n.tag === 'A')
  const bN = nuggets.filter((n) => n.tag === 'B')
  const rest = nuggets.filter((n) => n.tag !== 'A' && n.tag !== 'B')
  const ordered = [...aN, ...bN, ...rest]

  const children: any[] = []

  // ---------------- Seite 1 — Titel + Einleitung ----------------
  children.push(p('Glossar+ · EBA', { run: { color: akzent, bold: true, size: 16 }, spacing: { after: 40 } }))
  children.push(h(docTitel, 'title'))
  if (kopf?.kompetenz_text) children.push(p(kopf.kompetenz_text, { run: { italics: true, color: COLOR.inkSoft, size: 20 }, spacing: { after: 120, line: 320, lineRule: LineRuleType.AUTO } }))

  if (kopf) {
    const niveau = kopf.sprachniveau || dossier.sprachniveau || 'A2'
    const metaRows: string[][] = []
    if (kopf.thema_nr) metaRows.push(['Thema', `${kopf.thema_nr}${kopf.thema_titel ? ' · ' + kopf.thema_titel : ''}`])
    if (kopf.lebensbezug_nr) metaRows.push(['Lebensbezug', `${kopf.lebensbezug_nr}${kopf.lebensbezug_text ? ' · ' + kopf.lebensbezug_text : ''}`])
    if (kopf.kompetenz_nr || komp) metaRows.push(['Kompetenz', String(kopf.kompetenz_nr || komp)])
    metaRows.push(['Lehrgang', `EBA (2 Jahre) · Niveau ${niveau}`])
    children.push(spacer(80))
    children.push(dataTable(['Feld', 'Wert'], metaRows, akzent, [26, 74]))
  }

  if (einleitung && (einleitung.was_ist_das || (einleitung.so_benutzt_du_es?.length || 0) > 0)) {
    children.push(...sectionHead('Einleitung', 'Was ist das Glossar+?', akzent))
    if (einleitung.was_ist_das) children.push(p(einleitung.was_ist_das, { run: { size: 20 }, spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO } }))
    if ((einleitung.so_benutzt_du_es?.length || 0) > 0) {
      children.push(h('So benutzen Sie es', 'sub', COLOR.ink))
      einleitung.so_benutzt_du_es!.filter(Boolean).forEach((s) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: '✓  ', bold: true, color: akzent, size: 20 }),
            new TextRun({ text: s, size: 19 }),
          ],
          spacing: { after: 40 }, indent: { left: 200 },
        }))
      })
    }
  }

  // ---------------- Wissen — EIN Nugget pro Seite ----------------
  ;(ordered.length ? ordered : [null]).forEach((n, i) => {
    children.push(pageBreak())
    children.push(...sectionHead('D1', i === 0 ? 'Ihr Glossar+' : 'Glossar+ (Fortsetzung)', akzent))
    if (!n) return
    children.push(new Paragraph({
      children: [new TextRun({ text: dossierNuggetCode(n.id), bold: true, color: akzent, size: 18, font: 'Consolas' })],
      spacing: { before: 80, after: 20 }, keepNext: true,
    }))
    if (n.titel) children.push(h(n.titel, 'section', COLOR.ink))
    if (n.inhalt) children.push(p(n.inhalt, { run: { size: 20 }, spacing: { after: 120, line: 340, lineRule: LineRuleType.AUTO } }))
    if (n.beispiel) children.push(callout('Beispiel', n.beispiel, akzent, light))
    if (n.recherche) children.push(...dossierRechercheBlock(n.recherche, akzent))
  })

  // ---------------- Sprachhilfe — ein Scaffold pro Seite ----------------
  scaffolds.forEach((sc, i) => {
    children.push(pageBreak())
    children.push(...sectionHead('D2', i === 0 ? 'So schreiben Sie Schritt für Schritt' : 'So schreiben Sie (Fortsetzung)', akzent))
    children.push(...dossierScaffoldBlock(sc, akzent))
  })

  // ---------------- Grundprinzip ----------------
  if (tw) {
    children.push(pageBreak())
    children.push(...sectionHead('D2', 'Das Grundprinzip', akzent))
    if (tw.prinzip_in_einfach) children.push(p(tw.prinzip_in_einfach, { run: { bold: true, size: 22 }, spacing: { after: 120, line: 340, lineRule: LineRuleType.AUTO } }))
    if (tw.fachsystematik) children.push(p(tw.fachsystematik, { run: { size: 20 }, spacing: { after: 120, line: 340, lineRule: LineRuleType.AUTO } }))
    const aS = (tw.austausch_scaffolds?.satzanfaenge || []).filter(Boolean)
    if (aS.length) {
      children.push(p('Austausch — Satzanfänge', { run: { color: akzent, bold: true, size: 14 }, spacing: { before: 80, after: 30 } }))
      aS.forEach((s) => children.push(new Paragraph({ children: [new TextRun({ text: s, size: 19 })], bullet: { level: 0 }, spacing: { after: 30 } })))
    }
  }

  // ---------------- Glossar (zweispaltig) ----------------
  if (glossar.length) {
    children.push(pageBreak())
    children.push(...sectionHead('D3', 'Glossar — schwierige Wörter einfach erklärt', akzent))
    const glossEntry = (g: typeof glossar[number]): Paragraph => new Paragraph({
      children: [
        new TextRun({ text: g.begriff || '', bold: true, size: 18 }),
        new TextRun({ text: ' — ', size: 18, color: COLOR.inkSoft }),
        new TextRun({ text: g.erklaerung_a2 || '', size: 18 }),
        ...(g.beispiel ? [new TextRun({ text: '  Bsp.: ' + g.beispiel, italics: true, size: 16, color: COLOR.inkMute })] : []),
      ],
      spacing: { after: 80, line: 300, lineRule: LineRuleType.AUTO },
    })
    const half = Math.ceil(glossar.length / 2)
    const rows: TableRow[] = []
    for (let i = 0; i < half; i++) {
      const leftG = glossar[i]
      const rightG = glossar[i + half]
      const noBorders = {
        top: { style: BorderStyle.NIL, size: 0 }, bottom: { style: BorderStyle.NIL, size: 0 },
        left: { style: BorderStyle.NIL, size: 0 }, right: { style: BorderStyle.NIL, size: 0 },
      }
      rows.push(new TableRow({
        children: [
          tcell([glossEntry(leftG)], { width: { size: 50, type: WidthType.PERCENTAGE }, verticalAlign: 'top', borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 140 } }),
          tcell(rightG ? [glossEntry(rightG)] : [p('', { run: { size: 18 } })], { width: { size: 50, type: WidthType.PERCENTAGE }, verticalAlign: 'top', borders: noBorders, margins: { top: 40, bottom: 40, left: 140, right: 0 } }),
        ],
      }))
    }
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }))
  }

  // ---------------- Notizen ----------------
  children.push(pageBreak())
  children.push(...sectionHead('N', 'Meine Notizen', akzent))
  children.push(p('Hier können Sie schreiben: Antworten, Fragen oder wichtige Wörter.', { run: { color: COLOR.inkSoft, size: 18 }, spacing: { after: 120 } }))
  children.push(...schreibfeld(200))

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  })
}

// SuS-Ansicht: Prozentzahlen (90 % / 100 %) nur im LP-Material; hier Wort-Labels.
// Spiegelt susNiveauLabel() in DocKnS.tsx. Daten (kn.json) bleiben unveraendert.
function susNiveauLabel(label: string): string {
  const l = (label || '').toLowerCase()
  if (l.includes('100')) return 'Vollständig & selbstständig'
  if (l.includes('unter')) return 'Grundanforderung noch nicht erfüllt'
  if (l.includes('90')) return 'Grundanforderung erfüllt'
  return label.replace(/\s*\d+\s*%/g, '').trim() || label
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
    children.push(p('Stichwortartige Notizen zu jeder Frage. Im Gespräch sprechen Sie frei.', { run: { color: COLOR.inkSoft, size: 18 } }))
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
    children.push(p('Bearbeiten Sie alle Aufgaben schriftlich. Lehrmittel nach Anweisung der Lehrperson, kein Internet.', { run: { color: COLOR.inkSoft, size: 18 } }))
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
    children.push(p('Begründen Sie Ihre Wahl in 2–3 Sätzen.', { run: { color: COLOR.inkSoft, size: 18 } }))
    children.push(...schreibfeld(28))
    children.push(...sectionHead('04 · Transfer-Reflexion', 'Drei Reflexionsfragen', akzent))
    children.push(p('Beantworten Sie schriftlich, insgesamt 200–250 Wörter.', { run: { color: COLOR.inkSoft, size: 18 } }))
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
        new TextRun({ text: susNiveauLabel(n.label) + '   ', bold: true, color: akzent, size: 18 }),
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
  if (prinzip?.herausforderungen) {
    ;['A', 'B', 'C'].forEach((letter) => {
      const sf = prinzip.herausforderungen![letter]
      if (!sf) return
      children.push(new Paragraph({
        children: [new TextRun({ text: 'HERAUSFORDERUNG ' + letter, bold: true, color: akzent, size: 14 })],
        spacing: { before: 100, after: 30 },
      }))
      children.push(p(sf.herausforderung, { run: { bold: true, size: 22 } }))
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
  if (hs.alignment_note?.herausforderungen_mapping) {
    children.push(...sectionHead('05 · Alignment', 'Welche Herausforderung welches Szenen-Element aktiviert', akzent))
    children.push(dataTable(
      ['Herausforderung', 'Szenen-Element'],
      hs.alignment_note.herausforderungen_mapping.map((m) => [
        new Paragraph({ children: [new TextRun({ text: m.hf_letter, bold: true, size: 22, font: 'Consolas' })] }),
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

// ===========================================================================
// KI-Fluency builders (additive). Mirror DocKi / DocLernprompt / DocLernbegleiter.
// Local accent constants — never the green brand color.
// ===========================================================================

const KI_AKZENT = '1E3A5F'
const KI_LIGHT = 'E8F0FE'
const LP_AKZENT = '3B6FD4'
const WARN_AKZENT = 'D97706'
const WARN_LIGHT = 'FFF7ED'

// monospace, shaded prompt box (kopierbarer Prompt)
function promptBox(text: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [tcell([
        p(text, { run: { size: 17, font: 'Consolas', color: '2A2F36' }, spacing: { after: 0, line: 260, lineRule: LineRuleType.AUTO } }),
      ], {
        shading: { type: ShadingType.SOLID, color: 'F5F7FA' },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: 'D8DDE4' },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: 'D8DDE4' },
          left: { style: BorderStyle.SINGLE, size: 2, color: 'D8DDE4' },
          right: { style: BorderStyle.SINGLE, size: 2, color: 'D8DDE4' },
        },
      })],
    })],
  })
}

function microLabel(text: string, akzent: string): Paragraph {
  return p(text.toUpperCase(), { run: { color: akzent, bold: true, size: 13 }, spacing: { before: 80, after: 20 } })
}

export interface BuildKiOpts {
  ki: KiJson
  which: 'ki_1' | 'ki_2'
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

export function buildKi({ ki, which, abteilung, logoPng = null }: BuildKiOpts): Document | null {
  const list = ki.assignments || []
  const a = list.find((x) => x.key === which) || (which === 'ki_1' ? list[0] : list[1])
  if (!a) return null
  const akzent = KI_AKZENT
  const light = KI_LIGHT
  const num = which === 'ki_1' ? '1' : '2'
  const docCode = `DOC-KI-${num}`
  const docTitel = a.titel || `KI-Auftrag ${num}`

  const children: any[] = []
  children.push(new Paragraph({
    children: [
      badgeRun('KI ' + num, akzent),
      new TextRun({ text: '   KI-Fluency · formativ', color: LP_AKZENT, bold: true, size: 14 }),
    ],
    spacing: { after: 120 },
  }))
  children.push(h(docTitel, 'title'))
  if (a.pattern) children.push(p(a.pattern, { run: { color: akzent, bold: true, size: 16, font: 'Consolas' } }))
  if (a.ziel) children.push(callout('Ziel', a.ziel, akzent, light))
  if (a.bezug) { children.push(spacer(60)); children.push(callout('Bezug', a.bezug, akzent, light)) }

  // Lehrplan-Bezug (nRLP-Anker) + Leitfragen — am Anfang (parallel zur Preview-Seite 1).
  const anker = ki.nrlp_anker
  const lf = ki.ki_leitfragen
  const skTexte = anker?.schluesselkompetenzen_texte || []
  if (anker?.thema_text || skTexte.length) {
    children.push(...sectionHead('Lehrplan-Bezug', 'Worum es geht', akzent))
    if (anker?.thema_text) children.push(p(anker.thema_text, { run: { size: 18 }, spacing: { after: 80 } }))
    if (skTexte.length) {
      children.push(p('SCHLÜSSELKOMPETENZEN DIESER EINHEIT', { run: { color: akzent, bold: true, size: 13 }, spacing: { after: 20 } }))
      skTexte.forEach((s) => {
        const [code, ...rest] = s.split(' — ')
        children.push(new Paragraph({
          children: [
            new TextRun({ text: code, bold: true, color: akzent, size: 16 }),
            ...(rest.length ? [new TextRun({ text: ' — ' + rest.join(' — '), size: 16, color: COLOR.inkSoft })] : []),
          ],
          spacing: { after: 30 },
        }))
      })
    }
  }
  if (lf) {
    children.push(...sectionHead('Leitfragen', 'Behalte diese Fragen im Kopf', akzent))
    ;([['Offen', lf.offen], ['Kritisch', lf.kritisch], ['Vergleichend', lf.vergleichend], ['Urteilend', lf.urteilend]] as Array<[string, string | undefined]>).forEach(([k, v]) => {
      if (!v) return
      children.push(new Paragraph({
        children: [new TextRun({ text: k + ': ', bold: true, color: akzent, size: 16 }), new TextRun({ text: v, size: 16 })],
        spacing: { after: 30 },
      }))
    })
  }

  if (a.auftrag) {
    children.push(...sectionHead('01 · Auftrag', 'Das ist deine Aufgabe', akzent))
    children.push(p(a.auftrag, { run: { size: 20 }, spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO } }))
  }
  if (a.ki_frei_vorher) {
    children.push(...sectionHead('Ohne KI zuerst', 'Eigene Position festhalten', akzent))
    children.push(p(a.ki_frei_vorher, { run: { size: 20 } }))
    children.push(...schreibfeld(17))
  }
  if (a.prompt_strategie?.length) {
    children.push(pageBreak())
    children.push(...sectionHead('02 · Prompt-Strategie', 'So sprichst du mit der KI', akzent))
    a.prompt_strategie.forEach((s, i) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: (i + 1) + '. ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: s, size: 20 }),
        ],
        spacing: { after: 60 }, indent: { left: 200 },
      }))
    })
  }

  if (a.schritte?.length) {
    children.push(...sectionHead('03 · Schritte', 'Schritt für Schritt', akzent))
    a.schritte.forEach((s, i) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: String(i + 1).padStart(2, '0') + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: s, size: 20 }),
        ],
        spacing: { after: 60 }, indent: { left: 200 },
      }))
    })
  }
  if (a.guetekriterien?.length) {
    children.push(...sectionHead('04 · Gütekriterien', 'Daran erkennst du gute Arbeit', akzent))
    a.guetekriterien.forEach((g) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: '☐  ', bold: true, color: akzent, size: 20 }),
          new TextRun({ text: g.kriterium, bold: true, size: 18 }),
          new TextRun({ text: ' — ' + g.indikator, size: 18, color: COLOR.inkSoft }),
        ],
        spacing: { after: 40 }, indent: { left: 200 },
      }))
    })
    // Notiz-Feld: was hast du mit der KI gemacht?
    children.push(p('NOTIERE, WAS DU MIT DER KI GEMACHT HAST', { run: { color: akzent, bold: true, size: 14 }, spacing: { before: 120, after: 20 } }))
    children.push(p('Welchen Prompt hast du genutzt, was hat die KI geantwortet, was hast du geprüft oder geändert?', { run: { color: COLOR.inkSoft, size: 16 }, spacing: { after: 40 } }))
    children.push(...schreibfeld(31))
  }
  if (a.reflexion?.length) {
    children.push(pageBreak())
    children.push(...sectionHead('05 · Reflexion', 'Denk darüber nach', akzent))
    a.reflexion.forEach((r, i) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'R' + (i + 1) + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: r, size: 20 }),
        ],
        spacing: { before: 100, after: 40 }, keepNext: true,
      }))
      children.push(...schreibfeld(29))
    })
  }

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  })
}

export interface BuildLernpromptOpts {
  lernprompt: LernpromptJson
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

export function buildLernprompt({ lernprompt, abteilung, logoPng = null }: BuildLernpromptOpts): Document | null {
  const lp = lernprompt.lernprompt
  if (!lp) return null
  const akzent = LP_AKZENT
  const docCode = 'DOC-LERNPROMPT'
  const docTitel = 'KI-Lernprompt'

  const children: any[] = []
  children.push(new Paragraph({
    children: [
      badgeRun('P', akzent),
      new TextRun({ text: '   KI-Fluency · Prompting', color: KI_AKZENT, bold: true, size: 14 }),
    ],
    spacing: { after: 120 },
  }))
  children.push(h('Prompting lernen', 'title'))
  if (lp.thema_kontext) children.push(p(lp.thema_kontext, { run: { color: COLOR.inkSoft, size: 18 }, spacing: { after: 120 } }))

  ;(lp.techniken || []).forEach((t) => {
    children.push(...sectionHead('Technik', t.titel || '', akzent))
    if (t.erklaerung) children.push(p(t.erklaerung, { run: { size: 19 } }))
    if (t.thema_bezug) children.push(p(t.thema_bezug, { run: { italics: true, color: COLOR.inkSoft, size: 17 } }))
    if (t.beispiel_basis) { children.push(microLabel('Beispiel · Basis', akzent)); children.push(promptBox(t.beispiel_basis)) }
    if (t.beispiel_fortgeschritten) { children.push(microLabel('Beispiel · fortgeschritten', akzent)); children.push(promptBox(t.beispiel_fortgeschritten)) }
    if (t.warnung) { children.push(spacer(40)); children.push(callout('Achtung', t.warnung, WARN_AKZENT, WARN_LIGHT)) }
    const bk = t.baukasten
    if (bk) {
      ;([['Rolle', bk.rolle], ['Kontext', bk.kontext], ['Aufgabe', bk.aufgabe], ['Format', bk.format]] as Array<[string, string[] | undefined]>).forEach(([label, items]) => {
        if (!items?.length) return
        children.push(new Paragraph({
          children: [
            new TextRun({ text: label + ': ', bold: true, color: akzent, size: 16 }),
            new TextRun({ text: items.join(' · '), size: 16, color: COLOR.inkSoft }),
          ],
          spacing: { after: 30 },
        }))
      })
    }
    children.push(spacer(60))
  })

  const stack = (label: string, s: typeof lp.stacking_seite_1) => {
    if (!s) return
    children.push(...sectionHead(label, 'Prompts stapeln', akzent))
    if (s.technik_keys?.length) children.push(p(s.technik_keys.join(' · '), { run: { color: akzent, bold: true, size: 14 } }))
    if (s.logik_und_ziel) children.push(p(s.logik_und_ziel, { run: { size: 18, color: COLOR.inkSoft } }))
    if (s.prompt_1) { children.push(microLabel('Prompt 1', akzent)); children.push(promptBox(s.prompt_1)) }
    if (s.prompt_2) { children.push(microLabel('Prompt 2', akzent)); children.push(promptBox(s.prompt_2)) }
  }
  children.push(pageBreak())
  stack('Stacking · 1', lp.stacking_seite_1)
  stack('Stacking · 2', lp.stacking_seite_2)

  if (lp.prompt_vorlage) {
    children.push(spacer(120))
    children.push(new Paragraph({
      children: [new TextRun({ text: lp.prompt_vorlage, bold: true, color: 'FFFFFF', size: 20 })],
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: KI_AKZENT },
      spacing: { before: 120, after: 120, line: 320, lineRule: LineRuleType.AUTO },
    }))
  }

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  })
}

export interface BuildLernbegleiterOpts {
  lernbegleiter: LernbegleiterJson
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

export function buildLernbegleiter({ lernbegleiter, abteilung, logoPng = null }: BuildLernbegleiterOpts): Document | null {
  const lb = lernbegleiter.lernbegleiter
  if (!lb) return null
  const akzent = LP_AKZENT
  const docCode = 'DOC-LERNBEGLEITER'
  const docTitel = lb.titel || 'KI-Lernbegleiter'

  const children: any[] = []
  children.push(new Paragraph({
    children: [
      badgeRun('L', akzent),
      new TextRun({ text: '   KI-Fluency · Lernen', color: KI_AKZENT, bold: true, size: 14 }),
    ],
    spacing: { after: 120 },
  }))
  children.push(h(docTitel, 'title'))
  if (lb.ziel) children.push(p(lb.ziel, { run: { color: COLOR.inkSoft, size: 18 }, spacing: { after: 120 } }))

  const frei = lb.ki_frei_zuerst
  if (frei) {
    children.push(...sectionHead('Ohne KI zuerst', 'Wo stehst du?', akzent))
    if (frei.auftrag) children.push(p(frei.auftrag, { run: { size: 20 } }))
    ;(frei.selbsteinschaetzung || []).forEach((line) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: line, size: 18 }),
          new TextRun({ text: '   1 ☐  2 ☐  3 ☐  4 ☐  5 ☐', color: akzent, bold: true, size: 16, font: 'Consolas' }),
        ],
        spacing: { after: 40 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLOR.ruleSoft } },
      }))
    })
  }

  if (lb.strategie_karten?.length) {
    children.push(...sectionHead('Strategien', 'So lernst du mit der KI', akzent))
    lb.strategie_karten.forEach((s) => {
      children.push(p(s.technik || '', { run: { bold: true, color: KI_AKZENT, size: 20 }, spacing: { before: 100, after: 20 }, keepNext: true }))
      if (s.wann) children.push(p('Wann: ' + s.wann, { run: { size: 18, color: COLOR.inkSoft } }))
      if (s.prompt_basis) { children.push(microLabel('Prompt · Basis', akzent)); children.push(promptBox(s.prompt_basis)) }
      if (s.prompt_fortgeschritten) { children.push(microLabel('Prompt · fortgeschritten', akzent)); children.push(promptBox(s.prompt_fortgeschritten)) }
      if (s.warnung) { children.push(spacer(40)); children.push(callout('Achtung', s.warnung, WARN_AKZENT, WARN_LIGHT)) }
    })
  }

  if (lb.kn_typ_tracks?.length) {
    children.push(pageBreak())
    children.push(...sectionHead('KN-Typen', 'Üben für deinen Kompetenznachweis', akzent))
    lb.kn_typ_tracks.forEach((t) => {
      children.push(p(t.label || '', { run: { bold: true, color: KI_AKZENT, size: 19 }, spacing: { before: 100, after: 20 }, keepNext: true }))
      if (t.uebungsfokus) children.push(p(t.uebungsfokus, { run: { size: 18, color: COLOR.inkSoft } }))
      if (t.prompt) children.push(promptBox(t.prompt))
    })
  }

  if (lb.rubrik_fokus?.length) {
    children.push(...sectionHead('Rubrik-Fokus', 'Worauf es im KN ankommt', akzent))
    lb.rubrik_fokus.forEach((r) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: (r.dimension || '') + '  ', bold: true, color: akzent, size: 18 }),
          ...(r.kriterien?.length ? [new TextRun({ text: '— ' + r.kriterien.join(' · '), size: 16, color: COLOR.inkMute })] : []),
        ],
        spacing: { before: 80, after: 20 },
      }))
      if (r.so_uebst_du) children.push(p(r.so_uebst_du, { run: { size: 18 } }))
    })
  }

  if (lb.integritaet_warnung) {
    children.push(spacer(80))
    children.push(callout('Fairness & Integrität', lb.integritaet_warnung, 'DC2626', 'FEF2F2'))
  }

  if (lb.selbstcheck?.length) {
    children.push(...sectionHead('Selbstcheck', 'Habe ich gut gelernt?', akzent))
    lb.selbstcheck.forEach((c) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: '☐  ', bold: true, color: akzent, size: 20 }),
          new TextRun({ text: c, size: 18 }),
        ],
        spacing: { after: 40 }, indent: { left: 200 },
      }))
    })
  }

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
