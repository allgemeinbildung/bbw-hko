/* docx-builder.jsx — generates professional Word (.docx) versions */
/* of DOC-S / DOC-KN-S / DOC-KN-LP, mirroring the HTML renderers. */
/* Uses the docx library (global `docx`). */

/* eslint-disable no-undef */

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  HeadingLevel, AlignmentType, BorderStyle, ShadingType,
  Table, TableRow, TableCell, WidthType,
  PageBreak, PageNumber, LineRuleType,
  TabStopType, TabStopPosition, ImageRun,
} = docx;

// ─────────────────────────────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────────────────────────────

// A4 in twips (1mm = 56.6929 twips)
const A4_W = 11906;
const A4_H = 16838;
const MM = 56.6929;

const COLOR = {
  ink:      '1A1D22',
  inkSoft:  '4A5057',
  inkMute:  '8B9099',
  rule:     'D8DBE0',
  ruleSoft: 'EBEDF0',
  line:     'BDC3C7',
  neutral:  '2C3E50',
  neutralLight: 'ECF0F1',
  neutralMid: '7F8C8D',
};

function sitPalette(sit) {
  if (!sit) {
    return {
      akzent: COLOR.neutral,
      light: COLOR.neutralLight,
      mid: COLOR.neutralMid,
    };
  }
  const strip = (h) => (h || '').replace('#', '').toUpperCase();
  return {
    akzent: strip(sit.sit_farbe) || COLOR.neutral,
    light: strip(sit.sit_farbe_light) || COLOR.neutralLight,
    mid: strip(sit.sit_farbe_mid) || COLOR.neutralMid,
  };
}

// Paragraph helper
function p(text, opts = {}) {
  const children = Array.isArray(text)
    ? text
    : [new TextRun({ text: String(text == null ? '' : text), ...opts.run })];
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
  });
}

// Heading helper. level: 'title' | 'section' | 'sub' | 'meta'
function h(text, level, color = COLOR.ink) {
  const map = {
    title:   { size: 36, bold: true,  spacing: { after: 80, line: 300, lineRule: LineRuleType.AUTO } },
    section: { size: 26, bold: true,  spacing: { before: 140, after: 80, line: 300, lineRule: LineRuleType.AUTO } },
    sub:     { size: 20, bold: true,  spacing: { before: 80, after: 40 } },
    meta:    { size: 14, bold: true,  spacing: { before: 60, after: 30 } },
  }[level] || { size: 22, bold: true, spacing: { after: 80 } };
  return new Paragraph({
    children: [new TextRun({ text, bold: map.bold, color, size: map.size })],
    spacing: map.spacing,
    keepNext: true,
    keepLines: true,
  });
}

// Section header: small monospace prefix + big title underneath
function sectionHead(num, title, akzent) {
  return [
    new Paragraph({
      children: [
        new TextRun({ text: num.toUpperCase(), color: akzent, size: 16, bold: true, font: 'Consolas' }),
      ],
      spacing: { before: 180, after: 30 },
      keepNext: true,
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 3 } },
    }),
    h(title, 'section', COLOR.ink),
  ];
}

// Badge: colored, bold text in brackets-like form
function badgeRun(text, akzent, variant = 'fill') {
  if (variant === 'outline') {
    return new TextRun({ text: `[${text}]`, color: akzent, bold: true, size: 16 });
  }
  return new TextRun({ text: ` ${text} `, color: 'FFFFFF', shading: { type: ShadingType.SOLID, color: akzent }, bold: true, size: 16 });
}

// Simple separator
function spacer(twips = 200) {
  return new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: twips, after: twips } });
}

// Page break
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// Source reference run (e.g. "Kap. 1.4 | S. 29-33")
function sourceRefRun(text, akzent) {
  return new TextRun({ text, color: akzent, size: 16, font: 'Consolas' });
}

// A bordered cell shorthand
function tcell(content, opts = {}) {
  const children = Array.isArray(content) ? content : [typeof content === 'string' ? p(content, { run: { size: 20 } }) : content];
  return new TableCell({
    children,
    width: opts.width,
    shading: opts.shading,
    verticalAlign: opts.verticalAlign,
    margins: opts.margins || { top: 80, bottom: 80, left: 100, right: 100 },
    borders: opts.borders || {
      top:    { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
      left:   { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
      right:  { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
    },
  });
}

// 2-column key/value table
function kvTable(rows, akzent) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([k, v]) => new TableRow({
      children: [
        tcell(p(k, { run: { size: 16, bold: true, color: akzent } }), { width: { size: 30, type: WidthType.PERCENTAGE } }),
        tcell(p(v, { run: { size: 20 } })),
      ],
    })),
  });
}

// Section table (heading row + data rows)
function dataTable(headers, rows, akzent, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((label, i) => tcell(
      p(label.toUpperCase(), { run: { size: 14, bold: true, color: akzent } }),
      {
        width: colWidths ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
        shading: { type: ShadingType.SOLID, color: 'FFFFFF' },
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 4, color: akzent },
          bottom: { style: BorderStyle.SINGLE, size: 12, color: akzent },
          left:   { style: BorderStyle.NIL, size: 0 },
          right:  { style: BorderStyle.NIL, size: 0 },
        },
      }
    )),
  });
  const dataRows = rows.map(row => new TableRow({
    children: row.map((cell, i) => tcell(
      typeof cell === 'string' ? p(cell, { run: { size: 18 } }) : cell,
      {
        width: colWidths ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
        borders: {
          top:    { style: BorderStyle.NIL, size: 0 },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: COLOR.ruleSoft },
          left:   { style: BorderStyle.NIL, size: 0 },
          right:  { style: BorderStyle.NIL, size: 0 },
        },
      }
    )),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

// Writing field: N empty paragraphs with bottom-line for handwriting
function schreibfeld(heightMm, color = COLOR.line) {
  const lines = Math.max(3, Math.ceil(heightMm / 8.5) + 1);
  const paragraphs = [];
  for (let i = 0; i < lines; i++) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: '' })],
      spacing: { before: 0, after: 200, line: 360, lineRule: LineRuleType.AUTO },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 4, color },
      },
    }));
  }
  return paragraphs;
}

// Drawing surface (blank box)
function skizzeBox(heightMm, label, akzent) {
  const lines = Math.max(8, Math.ceil(heightMm / 6));
  const empty = [];
  for (let i = 0; i < lines; i++) {
    empty.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { line: 320, lineRule: LineRuleType.AUTO } }));
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [tcell([
          p(label, { run: { text: label, color: akzent, bold: true, size: 14 } }),
          ...empty,
        ], {
          borders: {
            top:    { style: BorderStyle.SINGLE, size: 6, color: akzent },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: akzent },
            left:   { style: BorderStyle.SINGLE, size: 6, color: akzent },
            right:  { style: BorderStyle.SINGLE, size: 6, color: akzent },
          },
        })],
      }),
    ],
  });
}

// Callout box (leitfrage, tradeoff)
function callout(label, text, akzent, light) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [tcell([
          p(label.toUpperCase(), { run: { color: akzent, bold: true, size: 14 } }),
          p(text, { run: { size: 22 } }),
        ], {
          shading: { type: ShadingType.SOLID, color: light },
          borders: {
            top:    { style: BorderStyle.NIL, size: 0 },
            bottom: { style: BorderStyle.NIL, size: 0 },
            left:   { style: BorderStyle.SINGLE, size: 24, color: akzent },
            right:  { style: BorderStyle.NIL, size: 0 },
          },
        })],
      }),
    ],
  });
}

// Standard A4 section properties
function sectionProps(docCode, docTitel, abteilung, logoPng) {
  // Logo: 1280×501 source. Target ~50mm wide → ~190×74 px (96dpi).
  const headerChildren = [];
  if (logoPng) {
    headerChildren.push(new Paragraph({
      children: [
        new ImageRun({
          data: logoPng,
          transformation: { width: 180, height: 70 },
          type: 'png',
        }),
      ],
      spacing: { after: 40 },
    }));
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
  }));
  return {
    properties: {
      page: {
        size: { width: A4_W, height: A4_H },
        margin: {
          top: Math.round(28 * MM),   // bigger top to accommodate logo header
          bottom: Math.round(16 * MM),
          left: Math.round(20 * MM),
          right: Math.round(20 * MM),
          header: Math.round(8 * MM),
          footer: Math.round(8 * MM),
        },
      },
    },
    headers: {
      default: new Header({ children: headerChildren }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: docTitel || '', color: COLOR.inkMute, size: 14, font: 'Consolas' }),
            new TextRun({ text: '\t' }),
            new TextRun({ children: ['Seite ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES], color: COLOR.inkMute, size: 14, font: 'Consolas' }),
          ],
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: COLOR.ruleSoft, space: 3 } },
        })],
      }),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DOC-S — Schueler-Situationsheft
// ─────────────────────────────────────────────────────────────────────────────

function cockpitBlock(sit, akzent, light) {
  const els = [];
  els.push(new Paragraph({
    children: [
      badgeRun('KOMP ' + (sit.nrlp?.nr || ''), akzent, 'outline'),
      new TextRun({ text: '  ' }),
      badgeRun('HF ' + sit.buchstabe + ' · ' + (sit.emotion_tag || ''), akzent),
    ],
    spacing: { after: 200 },
  }));
  els.push(h(sit.titel || '', 'title'));
  els.push(p(sit.modul_titel || '', { run: { color: COLOR.inkSoft, size: 22, italics: true } }));
  if (sit.herausforderung) {
    els.push(p('Herausforderung ' + (sit.herausforderung.buchstabe || '') + ' — ' + (sit.herausforderung.label || ''),
      { run: { color: akzent, bold: true, size: 18 } }));
  }
  els.push(spacer(120));

  // Persona + Handlungsprodukt as 2-col table
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
  }));
  els.push(spacer(120));

  // Wochenplan
  if (sit.wochen_plan) {
    els.push(p('WOCHENPLAN', { run: { color: akzent, bold: true, size: 14 } }));
    const clean = (l) => (l || '').replace(/^Woche\s+\d+\s*[-\u2013\u2014]\s*/i, '').trim() || l;
    els.push(dataTable(
      ['Dauer', 'Inhalt'],
      sit.wochen_plan.map(w => [clean(w.label), w.text]),
      akzent,
      [26, 74],
    ));
    els.push(spacer(80));
  }

  // Bewertungsraster
  if (sit.bewertungsraster) {
    const total = sit.bewertungsraster.reduce((s, r) => s + (r.gewicht || 0), 0);
    els.push(p('BEWERTUNGSRASTER · TOTAL ' + total + '%', { run: { color: akzent, bold: true, size: 14 } }));
    els.push(dataTable(
      ['Produkt', 'Abgabe', 'Gewicht', 'Kriterium'],
      sit.bewertungsraster.map(b => [
        new Paragraph({ children: [new TextRun({ text: b.produkt, bold: true, size: 18 })] }),
        b.abgabe,
        b.gewicht + '%',
        b.kriterium,
      ]),
      akzent,
      [22, 30, 10, 38],
    ));
    els.push(spacer(80));
  }

  // Quellen
  if (sit.quellen_anker) {
    els.push(p('QUELLEN', { run: { color: akzent, bold: true, size: 14 } }));
    sit.quellen_anker.forEach(q => {
      els.push(new Paragraph({
        children: [
          sourceRefRun(q.ref, akzent),
          new TextRun({ text: '  ·  ' + q.titel + '  ·  ' + q.seiten, size: 18, color: COLOR.inkSoft }),
        ],
        spacing: { after: 60 },
        indent: { left: 200 },
      }));
    });
  }

  return els;
}

function situationBlock(sit, akzent, light) {
  const els = [];
  els.push(...sectionHead('02 · Situation', sit.titel || '', akzent));
  // meta key/values inline
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
  }));
  els.push(p(sit.buchstabe_text || '', { run: { size: 22 }, spacing: { after: 200, line: 360, lineRule: LineRuleType.AUTO } }));

  if (sit.zahlen_tabelle) {
    els.push(dataTable(
      ['Kennzahl', 'Wert'],
      sit.zahlen_tabelle.map(z => [
        z.label,
        new Paragraph({ children: [new TextRun({ text: z.wert, font: 'Consolas', size: 18 })], alignment: AlignmentType.RIGHT }),
      ]),
      akzent,
      [70, 30],
    ));
    els.push(spacer(80));
  }
  els.push(callout('Leitfrage', sit.leitfrage || '', akzent, light));
  if (sit.mehrdeutigkeit?.explizit && sit.mehrdeutigkeit.trade_off) {
    els.push(spacer(80));
    els.push(callout('Spannungsfeld', sit.mehrdeutigkeit.trade_off, akzent, light));
  }
  return els;
}

function leitfrageItems(sit, akzent, withField, fieldHeightMm) {
  const els = [];
  sit.leitfragen?.forEach((lf) => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: 'LF' + lf.nr + '  ', bold: true, color: akzent, size: 22, font: 'Consolas' }),
        new TextRun({ text: lf.text, size: 20 }),
      ],
      spacing: { before: 120, after: 40, line: 320, lineRule: LineRuleType.AUTO },
      keepNext: true,
    }));
    els.push(new Paragraph({
      children: [
        new TextRun({ text: '[' + (lf.bloom || '') + ']', color: akzent, bold: true, size: 14 }),
        new TextRun({ text: '  ' }),
        sourceRefRun(lf.knoten_ref || '', akzent),
      ],
      spacing: { after: 80 },
    }));
    if (withField) {
      els.push(...schreibfeld(fieldHeightMm || lf.feld_hoehe_mm || 15));
    }
  });
  return els;
}

function reflexionItems(sit, akzent, withField, fieldHeightMm) {
  const els = [];
  sit.reflexion_fragen?.forEach(rf => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: rf.nr + '  ', bold: true, color: akzent, size: 22, font: 'Consolas' }),
        new TextRun({ text: rf.text, size: 20 }),
      ],
      spacing: { before: 120, after: 60, line: 320, lineRule: LineRuleType.AUTO },
    }));
    if (rf.sub) {
      els.push(p(rf.sub, { run: { color: COLOR.inkMute, size: 18, italics: true } }));
    }
    if (withField) {
      els.push(...schreibfeld(fieldHeightMm || rf.feld_hoehe_mm || 10));
    }
  });
  return els;
}

function mindmapFullBlock(sit, akzent, light) {
  const els = [];
  els.push(p(sit.mindmap_zentrum || '', { run: { bold: true, color: 'FFFFFF', size: 24 }, alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, color: akzent, size: 6 }, bottom: { style: BorderStyle.SINGLE, color: akzent, size: 6 } } }));
  els.push(spacer(60));
  sit.mindmap_aeste?.forEach(ast => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: ast.titel, bold: true, color: akzent, size: 20 }),
        ...(ast.optional ? [new TextRun({ text: '  · optional', color: COLOR.inkMute, size: 14 })] : []),
      ],
      spacing: { before: 120, after: 40 },
      keepNext: true,
    }));
    ast.punkte?.forEach(pt => {
      els.push(new Paragraph({
        children: [new TextRun({ text: pt, size: 18 })],
        bullet: { level: 0 },
        spacing: { after: 40 },
      }));
    });
  });
  return els;
}

function mindmapSkelettBlock(sit, akzent) {
  const els = [];
  els.push(p(
    'Skizziere deine Mindmap. Zentrum und Ast-Titel sind Anker; die Detail-Punkte arbeitest du selbst aus.',
    { run: { italics: true, color: COLOR.inkMute, size: 16 } }
  ));
  els.push(spacer(60));
  els.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [tcell([
          p(sit.mindmap_zentrum || '', { run: { bold: true, color: 'FFFFFF', size: 22 }, alignment: AlignmentType.CENTER }),
        ], {
          shading: { type: ShadingType.SOLID, color: akzent },
          borders: { top: { style: BorderStyle.SINGLE, color: akzent, size: 12 }, bottom: { style: BorderStyle.SINGLE, color: akzent, size: 12 }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
          margins: { top: 200, bottom: 200, left: 120, right: 120 },
        })],
      }),
    ],
  }));
  els.push(spacer(160));
  // Ast titles as anchors in 2 columns
  const aeste = sit.mindmap_aeste || [];
  const rows = [];
  for (let i = 0; i < aeste.length; i += 2) {
    const a = aeste[i], b = aeste[i + 1];
    rows.push(new TableRow({
      children: [
        tcell([
          p(a.titel + (a.optional ? '  · optional' : ''), { run: { color: akzent, bold: true, size: 18 } }),
        ], { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.DASHED, color: akzent, size: 4 }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } }),
        b ? tcell([
          p(b.titel + (b.optional ? '  · optional' : ''), { run: { color: akzent, bold: true, size: 18 } }),
        ], { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.DASHED, color: akzent, size: 4 }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } })
          : tcell(p('', { run: { size: 18 } }), { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } }),
      ],
    }));
    // Empty spacer rows under each ast for handwriting room
    for (let s = 0; s < 5; s++) {
      rows.push(new TableRow({
        children: [
          tcell(p('', { run: { size: 18 } }), { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } }),
          tcell(p('', { run: { size: 18 } }), { borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } } }),
        ],
      }));
    }
  }
  els.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  return els;
}

function handlungsproduktBlock(sit, akzent, withField) {
  const hp = sit.handlungsprodukt;
  if (!hp) return [];
  const els = [];
  els.push(new Paragraph({
    children: [badgeRun(hp.format || '', akzent, 'outline')],
    spacing: { after: 160 },
  }));
  els.push(p(hp.beschreibung || '', { run: { size: 22 }, spacing: { after: 160, line: 360, lineRule: LineRuleType.AUTO } }));
  hp.schritte?.forEach((s, i) => {
    els.push(new Paragraph({
      children: [
        new TextRun({ text: String(i + 1).padStart(2, '0') + '  ', bold: true, color: akzent, font: 'Consolas', size: 20 }),
        new TextRun({ text: s.label, bold: true, size: 20 }),
      ],
      spacing: { before: 100, after: 30 },
      keepNext: true,
    }));
    els.push(p(s.hint || '', { run: { color: COLOR.inkSoft, size: 18 }, indent: { left: 400 } }));
  });
  if (withField) {
    els.push(spacer(160));
    els.push(skizzeBox(150, hp.schreib_label || 'HIER ERARBEITEN', akzent));
  }
  return els;
}

function austauschBlock(set, sit, akzent) {
  const els = [];
  const ap = set?.austausch_phase;
  const da = set?.dekontextualisierungs_aufgabe;
  if (!ap && !da) return [];
  if (ap) {
    els.push(p(`AUSTAUSCH · ${ap.format || ''} · ${ap.dauer_min || ''} MIN`, { run: { color: akzent, bold: true, size: 14 } }));
    const jig = ap.gruppenarbeit_jigsaw || {};
    [['Runde 1', jig.runde_1], ['Runde 2', jig.runde_2], ['Runde 3', jig.runde_3]].forEach(([label, text]) => {
      if (!text) return;
      els.push(new Paragraph({
        children: [
          new TextRun({ text: label + '   ', color: akzent, bold: true, size: 16, font: 'Consolas' }),
          new TextRun({ text, size: 20 }),
        ],
        spacing: { after: 80 },
      }));
    });
    if (ap.einzelarbeit_plenum) {
      els.push(p('PLENUM', { run: { color: akzent, bold: true, size: 14 } }));
      els.push(p(ap.einzelarbeit_plenum, { run: { size: 20 } }));
    }
  }
  if (da) {
    els.push(p('DEKONTEXTUALISIERUNG', { run: { color: akzent, bold: true, size: 14 } }));
    els.push(p(da.auftrag, { run: { bold: true, size: 20 } }));
    els.push(p(
      `Format: ${da.format} · Gewicht: ${da.gewicht_prozent}% · Abgabe: ${da.abgabe}`,
      { run: { color: COLOR.inkSoft, size: 16 } }
    ));
    if (sit?.dekontextualisierung?.frage) {
      els.push(new Paragraph({
        children: [
          new TextRun({ text: 'Leitend: ', color: akzent, bold: true, size: 18 }),
          new TextRun({ text: sit.dekontextualisierung.frage, size: 20 }),
        ],
        spacing: { before: 100 },
      }));
    }
  }
  return els;
}

function buildDocS({ sit, set, abteilung, mode, logoPng }) {
  const palette = sitPalette(sit);
  const akzent = palette.akzent;
  const light = palette.light;
  const docCode = `DOC-S · HF ${sit.buchstabe} · ${mode === 'info' ? 'DOSSIER' : 'AUFTRAG'}`;
  const docTitel = sit.titel || '';

  const children = [];
  // P1 Cockpit
  children.push(...cockpitBlock(sit, akzent, light));
  children.push(pageBreak());
  // P2 Situation
  children.push(...situationBlock(sit, akzent, light));
  if (mode === 'fill') {
    children.push(pageBreak());
    children.push(...sectionHead('03 · Wissensecke', 'Leitfragen', akzent));
    if (sit.leitfragen_intro) children.push(p(sit.leitfragen_intro, { run: { color: COLOR.inkSoft, size: 18 } }));
    children.push(...leitfrageItems(sit, akzent, true, 55));
    children.push(pageBreak());
    children.push(...sectionHead('04 · Mindmap', sit.mindmap_zentrum || '', akzent));
    children.push(...mindmapSkelettBlock(sit, akzent));
    children.push(pageBreak());
    children.push(...sectionHead('05 · Handlungsprodukt', sit.handlungsprodukt?.titel || '', akzent));
    children.push(...handlungsproduktBlock(sit, akzent, true));
    children.push(pageBreak());
    children.push(...sectionHead('06 · Selbstcheck', 'Reflexion', akzent));
    children.push(...reflexionItems(sit, akzent, true, 35));
    children.push(pageBreak());
    children.push(...sectionHead('07 · Austausch & Transfer', 'Austausch & Dekontextualisierung', akzent));
    children.push(...austauschBlock(set, sit, akzent));
    children.push(spacer(120));
    children.push(p('DEIN TRANSFER (5–7 SAETZE)', { run: { color: akzent, bold: true, size: 14 } }));
    children.push(...schreibfeld(55));
  } else {
    // info mode: pack denser
    children.push(pageBreak());
    children.push(...sectionHead('03 · Wissensecke', 'Leitfragen', akzent));
    if (sit.leitfragen_intro) children.push(p(sit.leitfragen_intro, { run: { color: COLOR.inkSoft, size: 16 } }));
    children.push(...leitfrageItems(sit, akzent, false));
    children.push(pageBreak());
    children.push(...sectionHead('04 · Mindmap', sit.mindmap_zentrum || '', akzent));
    children.push(...mindmapFullBlock(sit, akzent, light));
    children.push(...sectionHead('05 · Handlungsprodukt', sit.handlungsprodukt?.titel || '', akzent));
    children.push(...handlungsproduktBlock(sit, akzent, false));
    children.push(pageBreak());
    children.push(...sectionHead('06 · Selbstcheck', 'Reflexion', akzent));
    children.push(...reflexionItems(sit, akzent, false));
    children.push(...sectionHead('07 · Austausch & Transfer', 'Austausch & Dekontextualisierung', akzent));
    children.push(...austauschBlock(set, sit, akzent));
  }

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DOC-KN-S — Schueler KN
// ─────────────────────────────────────────────────────────────────────────────

function buildKnS({ kn, knTyp, abteilung, logoPng }) {
  const t = (kn.kn_typen || []).find(x => x.typ === knTyp) || kn.kn_typen?.[0];
  if (!t) return null;
  const akzent = COLOR.neutral;
  const light = COLOR.neutralLight;
  const docCode = `DOC-KN-S · ${t.typ.toUpperCase()}`;
  const docTitel = kn.hybrid_situation?.titel || '';
  const hs = kn.hybrid_situation || {};

  const children = [];
  // Header page
  children.push(new Paragraph({
    children: [
      badgeRun('KN ' + (kn.kompetenz_nr || ''), akzent, 'outline'),
      new TextRun({ text: '  ' }),
      badgeRun(t.label, akzent),
    ],
    spacing: { after: 200 },
  }));
  children.push(h(hs.titel || '', 'title'));
  children.push(spacer(80));
  children.push(...sectionHead('01 · Hybrid-Situation', 'Situation', akzent));
  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'BERUF ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: hs.persona?.beruf || '', size: 18 }),
      new TextRun({ text: '   ·   ' + (hs.persona?.betrieb || '') + ', ' + (hs.persona?.ort || ''), size: 18, color: COLOR.inkSoft }),
      new TextRun({ text: '   ·   EMOTION ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: hs.emotion_tag || '', size: 18 }),
    ],
    spacing: { after: 160 },
  }));
  children.push(p(hs.text || '', { run: { size: 22 }, spacing: { after: 160, line: 360, lineRule: LineRuleType.AUTO } }));
  children.push(callout('Leitfrage', hs.leitfrage || '', akzent, light));

  children.push(...sectionHead('02 · Rahmen', 'Format & Ablauf', akzent));
  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'Format: ', color: akzent, bold: true, size: 18 }),
      new TextRun({ text: t.format, size: 20 }),
    ],
    spacing: { after: 100 },
  }));
  t.ablauf?.forEach(a => {
    children.push(new Paragraph({ children: [new TextRun({ text: a, size: 20 })], bullet: { level: 0 }, spacing: { after: 60 } }));
  });

  // Task pages
  children.push(pageBreak());
  if (t.typ === 'fachgespraech') {
    children.push(...sectionHead('03 · Vorbereitung', 'Notizen zu den Fragen', akzent));
    children.push(p('Stichwortartige Notizen zu jeder Frage. Im Gespraech sprichst du frei.', { run: { color: COLOR.inkSoft, size: 18 } }));
    t.fragestruktur?.forEach(f => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'F' + f.nr + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: f.frage, size: 20 }),
        ],
        spacing: { before: 120, after: 40 },
        keepNext: true,
      }));
      children.push(p('', { run: { text: '[' + (f.typ || '') + ']', color: akzent, bold: true, size: 14 } }));
      children.push(...schreibfeld(25));
    });
  } else if (t.typ === 'mini_case_schriftlich') {
    children.push(...sectionHead('03 · Aufgaben', 'Pruefungsaufgaben', akzent));
    children.push(p('Bearbeite alle Aufgaben schriftlich. Lehrmittel nach Anweisung der Lehrperson, kein Internet.', { run: { color: COLOR.inkSoft, size: 18 } }));
    t.aufgaben?.forEach(a => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'A' + a.nr + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: a.aufgabe, size: 20 }),
        ],
        spacing: { before: 120, after: 40 },
        keepNext: true,
      }));
      children.push(p('', { run: { text: '[' + (a.typ || '') + ']', color: akzent, bold: true, size: 14 } }));
      children.push(...schreibfeld(55));
    });
  } else {
    // werkschau_transfer
    children.push(...sectionHead('03 · Werkwahl', 'Welches Handlungsprodukt waehle ich?', akzent));
    children.push(p('Begruende deine Wahl in 2–3 Saetzen.', { run: { color: COLOR.inkSoft, size: 18 } }));
    children.push(...schreibfeld(28));
    children.push(...sectionHead('04 · Transfer-Reflexion', 'Drei Reflexionsfragen', akzent));
    children.push(p('Beantworte schriftlich, insgesamt 200–250 Woerter.', { run: { color: COLOR.inkSoft, size: 18 } }));
    t.reflexionsfragen?.forEach((f, i) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'R' + (i + 1) + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
          new TextRun({ text: f, size: 20 }),
        ],
        spacing: { before: 120, after: 40 },
        keepNext: true,
      }));
      children.push(...schreibfeld(40));
    });
  }

  // Rubrik page (stripped — no Stufen texts, no k_stufe)
  children.push(pageBreak());
  children.push(...sectionHead('05 · Bewertungskriterien', 'Worauf geachtet wird', akzent));
  children.push(p(
    'Vier Kriterien, zwei Dimensionen: sachliche Korrektheit (SuK) und gesellschaftliche Werthaltung (Ges). Beide werden separat benotet.',
    { run: { color: COLOR.inkSoft, size: 18 } }
  ));
  if (kn.rubrik_shared?.kriterien) {
    children.push(dataTable(
      ['Kriterium', 'Dimension'],
      kn.rubrik_shared.kriterien.map(k => [
        new Paragraph({ children: [new TextRun({ text: k.name, bold: true, size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: k.dimension, bold: true, size: 16, color: akzent })] }),
      ]),
      akzent,
      [75, 25],
    ));
  }
  children.push(spacer(160));
  children.push(p('NIVEAUBAENDER', { run: { color: akzent, bold: true, size: 14 } }));
  kn.rubrik_shared?.niveaubaender?.forEach(n => {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: n.label + '   ', bold: true, color: akzent, size: 18 }),
        new TextRun({ text: n.definition, size: 18 }),
      ],
      spacing: { after: 80 },
    }));
  });

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DOC-KN-LP — Lehrperson KN + Bewertung
// ─────────────────────────────────────────────────────────────────────────────

function buildKnLp({ kn, prinzip, set, abteilung, logoPng }) {
  const akzent = COLOR.neutral;
  const light = COLOR.neutralLight;
  const docCode = 'DOC-KN-LP';
  const docTitel = kn.hybrid_situation?.titel || `KN ${kn.kompetenz_nr}`;
  const hs = kn.hybrid_situation || {};

  const children = [];
  // Kontext page
  children.push(new Paragraph({
    children: [
      badgeRun('LEHRPERSON', akzent, 'outline'),
      new TextRun({ text: '  ' }),
      badgeRun('KN ' + (kn.kompetenz_nr || ''), akzent),
      new TextRun({ text: '  ' }),
      badgeRun('Dominanter Aspekt: ' + (kn.dominanter_aspekt || '—'), akzent, 'outline'),
    ],
    spacing: { after: 200 },
  }));
  children.push(h(prinzip?.kern_kompetenzversprechen || kn.kern_kompetenzversprechen || '', 'title'));
  children.push(p(kn.mehrdeutigkeits_pflicht || '', { run: { italics: true, color: COLOR.inkSoft, size: 20 } }));

  children.push(...sectionHead('01 · Herausforderungen A·B·C', 'Was die drei Herausforderungen versprechen', akzent));
  if (prinzip?.herausforderungen) {
    ['A', 'B', 'C'].forEach(letter => {
      const sf = prinzip.herausforderungen[letter];
      if (!sf) return;
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'SUBFACETTE ' + letter, bold: true, color: akzent, size: 14 }),
        ],
        spacing: { before: 100, after: 30 },
      }));
      children.push(p(sf.herausforderung, { run: { bold: true, size: 22 } }));
      children.push(p('Konfliktart: ' + sf.konfliktart, { run: { color: COLOR.inkSoft, size: 18 } }));
    });
  }

  if (prinzip?.zirkularitaet) {
    children.push(...sectionHead('02 · Zirkularitaet', 'R1 jetzt — Ausblick T4 / T7', akzent));
    [
      ['R1 · Aktuell', prinzip.zirkularitaet.r1_aktuell],
      ['R2 · Voraussicht', prinzip.zirkularitaet.r2_voraussicht],
      ['R3 · Voraussicht', prinzip.zirkularitaet.r3_voraussicht],
    ].forEach(([k, v]) => {
      if (!v) return;
      children.push(new Paragraph({
        children: [
          new TextRun({ text: k + '   ', bold: true, color: akzent, size: 16, font: 'Consolas' }),
          new TextRun({ text: v, size: 20 }),
        ],
        spacing: { after: 80 },
      }));
    });
  }

  if (set?.konzept_progression) {
    children.push(...sectionHead('03 · Konzeptbogen', 'Progression A → B → C', akzent));
    children.push(dataTable(
      ['#', 'Konzept'],
      set.konzept_progression.map(kp => [
        new Paragraph({ children: [new TextRun({ text: String(kp.position), bold: true, size: 22, font: 'Consolas' })] }),
        kp.konzept,
      ]),
      akzent,
      [8, 92],
    ));
  }

  // Hybrid page
  children.push(pageBreak());
  children.push(...sectionHead('04 · Hybrid-Situation', hs.titel || '', akzent));
  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'BERUF ', color: COLOR.inkMute, size: 14, bold: true }),
      new TextRun({ text: hs.persona?.beruf || '', size: 18 }),
      new TextRun({ text: '   ·   ' + (hs.persona?.betrieb || '') + ', ' + (hs.persona?.ort || ''), size: 18, color: COLOR.inkSoft }),
    ],
    spacing: { after: 160 },
  }));
  children.push(p(hs.text || '', { run: { size: 22 }, spacing: { after: 160, line: 360, lineRule: LineRuleType.AUTO } }));
  children.push(callout('Leitfrage', hs.leitfrage || '', akzent, light));
  if (hs.aktivierte_trade_offs?.length) {
    children.push(spacer(120));
    children.push(p('AKTIVIERTE TRADE-OFFS', { run: { color: akzent, bold: true, size: 14 } }));
    hs.aktivierte_trade_offs.forEach(to => {
      children.push(new Paragraph({ children: [new TextRun({ text: to, size: 20 })], bullet: { level: 0 } }));
    });
  }
  if (hs.alignment_note?.herausforderungen_mapping) {
    children.push(...sectionHead('05 · Alignment', 'Welche Herausforderung welches Szenen-Element aktiviert', akzent));
    children.push(dataTable(
      ['Herausforderung', 'Szenen-Element'],
      hs.alignment_note.herausforderungen_mapping.map(m => [
        new Paragraph({ children: [new TextRun({ text: m.hf_letter, bold: true, size: 22, font: 'Consolas' })] }),
        m.scene_element,
      ]),
      akzent,
      [14, 86],
    ));
  }

  // Durchfuehrung pages — one per KN-Typ
  (kn.kn_typen || []).forEach((kt, idx) => {
    children.push(pageBreak());
    children.push(...sectionHead(`06.${idx + 1} · Durchfuehrung`, kt.label, akzent));
    children.push(new Paragraph({
      children: [
        new TextRun({ text: 'Format: ', color: akzent, bold: true, size: 18 }),
        new TextRun({ text: kt.format, size: 20 }),
      ],
      spacing: { after: 100 },
    }));
    if (kt.ablauf) {
      kt.ablauf.forEach(a => {
        children.push(new Paragraph({ children: [new TextRun({ text: a, size: 18 })], bullet: { level: 0 }, spacing: { after: 50 } }));
      });
    }
    const list = kt.fragestruktur || kt.aufgaben || (kt.reflexionsfragen ? kt.reflexionsfragen.map((f, i) => ({ nr: i + 1, frage: f })) : []);
    const prefix = kt.fragestruktur ? 'F' : kt.aufgaben ? 'A' : 'R';
    if (list && list.length) {
      children.push(spacer(80));
      list.forEach(item => {
        const txt = item.frage || item.aufgabe || '';
        children.push(new Paragraph({
          children: [
            new TextRun({ text: prefix + item.nr + '  ', bold: true, color: akzent, size: 20, font: 'Consolas' }),
            new TextRun({ text: txt, size: 20 }),
          ],
          spacing: { before: 100, after: 30 },
          keepNext: true,
        }));
        const tags = [];
        if (item.typ) tags.push(item.typ);
        if (item.k_stufe) tags.push('K' + item.k_stufe);
        if (tags.length) {
          children.push(new Paragraph({
            children: tags.map((tt, i) => new TextRun({ text: (i > 0 ? '  ' : '') + '[' + tt + ']', color: akzent, bold: true, size: 14 })),
            spacing: { after: 100 },
          }));
        }
      });
    }
    if (kt.sk || kt.aspekte) {
      const tagRuns = [];
      (kt.sk || []).forEach(s => tagRuns.push(badgeRun('SK ' + s, akzent, 'outline'), new TextRun({ text: ' ' })));
      (kt.aspekte || []).forEach(a => tagRuns.push(badgeRun(a, akzent), new TextRun({ text: ' ' })));
      children.push(new Paragraph({ children: tagRuns, spacing: { before: 160 } }));
    }
  });

  // Bewertungs-Grid page
  children.push(pageBreak());
  children.push(...sectionHead('07 · Bewertung', 'Bi-dimensionaler Rubrik-Grid', akzent));
  children.push(p(
    'Pro Kriterium die zutreffende Stufe ankreuzen. SuK und Ges werden getrennt aggregiert — zwei separate Noten, niemals zu einer verschmolzen.',
    { run: { color: COLOR.inkSoft, size: 16 } }
  ));
  const rs = kn.rubrik_shared;
  if (rs?.kriterien) {
    const headerCells = ['Kriterium', 'Dim.', 'Stufe 1', 'Stufe 2', 'Stufe 3', 'Stufe 4'];
    const rows = rs.kriterien.map(k => {
      const cells = [
        new Paragraph({ children: [new TextRun({ text: k.name, bold: true, size: 18 })] }),
        new Paragraph({ children: [new TextRun({ text: k.dimension, bold: true, color: akzent, size: 14 })] }),
      ];
      (k.stufen || []).forEach(s => {
        cells.push([
          new Paragraph({ children: [new TextRun({ text: '☐  ', size: 18, bold: true })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: s, size: 14, color: COLOR.inkSoft })] }),
        ]);
      });
      return cells;
    });
    // Build a custom table that handles array cells
    const headerRow = new TableRow({
      tableHeader: true,
      children: headerCells.map((label) => tcell(
        p(label.toUpperCase(), { run: { size: 14, bold: true, color: akzent } }),
        { shading: { type: ShadingType.SOLID, color: light } }
      )),
    });
    const dataRows = rows.map(row => new TableRow({
      children: row.map((cell, i) => {
        const widthPct = [25, 8, 17, 17, 17, 16][i];
        return tcell(
          Array.isArray(cell) ? cell : (cell instanceof Paragraph ? [cell] : [p(cell, { run: { size: 18 } })]),
          {
            width: { size: widthPct, type: WidthType.PERCENTAGE },
            verticalAlign: 'top',
          }
        );
      }),
    }));
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
    }));
  }

  // Niveau bands
  children.push(spacer(160));
  children.push(p('NIVEAUBAENDER', { run: { color: akzent, bold: true, size: 14 } }));
  rs?.niveaubaender?.forEach(n => {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: n.label + '   ', bold: true, color: akzent, size: 18 }),
        new TextRun({ text: n.definition, size: 18 }),
      ],
      spacing: { after: 80 },
    }));
  });

  // Noten
  children.push(spacer(160));
  children.push(p('NOTE PRO DIMENSION (SEPARAT)', { run: { color: akzent, bold: true, size: 14 } }));
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
  }));
  children.push(p(
    'Aggregation: SuK-Note = Mittel der SuK-Kriterien · Ges-Note = Mittel der Ges-Kriterien. Beide Noten gleichgewichtet, aber nie zu einer Gesamtnote verschmolzen.',
    { run: { color: COLOR.inkMute, size: 14, italics: true } }
  ));

  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    sections: [{ ...sectionProps(docCode, docTitel, abteilung, logoPng), children }],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

window.HkoDocx = {
  buildDocS,
  buildKnS,
  buildKnLp,
  async toBlob(doc) { return Packer.toBlob(doc); },
};
