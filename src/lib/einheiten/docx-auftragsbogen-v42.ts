// docx-auftragsbogen-v42.ts — Auftragsbogen des gemeinsamen Auftrags v4.2 als
// Word-Dokument. Spiegel von DocAuftragsbogen.tsx: vier Seiten (Leitfaden §7.5),
// jede in einem eigenen Abschnitt wie in docx-heft-v42.ts; Kopf/Fuss wie buildAustausch.
//
// Die kleinen Ableitungen (Schrittnummer, Sozialform-Zeile, Sprechdauer, Glossar-
// Gruppen, Stationen der Sprechspur) kommen aus der Komponente — eine Quelle, damit
// HTML und Word nie auseinanderlaufen. Nie gedruckt: `erwartungshorizont`,
// `kontext_ausschluss`, `aktivierte_trade_offs`, `lebensbereich`, `bogen`.

import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, LineRuleType, TabStopType, WidthType, VerticalAlign,
} from 'docx'
import type { GemeinsamerAuftrag, SetJson } from './types'
import { BBW_GRUEN, COLOR, p, schreibfeld, sectionHead, sectionProps, skizzeBox, tcell } from './docx-primitives'
import {
  SPRECHSPUR_STATIONEN, glossarGruppen, schrittTeile, sozialformZeile, sprechDauer,
} from '../../components/einheiten/docs/DocAuftragsbogen'

export interface BuildAuftragsbogenOpts {
  set: SetJson | null
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

/** Der Auftrag gehört keinem Heft: Plattform-Grün, wie --brand im HTML. */
const AKZENT = BBW_GRUEN
const DOC_CODE = 'AUFTRAG · GEMEINSAM'

const KEIN_RAND = { style: BorderStyle.NIL, size: 0 }
const OHNE_RAENDER = { top: KEIN_RAND, bottom: KEIN_RAND, left: KEIN_RAND, right: KEIN_RAND }
const RAND = (size = 4, color = COLOR.rule) => ({ style: BorderStyle.SINGLE, size, color })

/** Kleine Grossbuchstaben-Beschriftung — Gegenstück zu .v42-auftrag-mikro. */
function mikro(text: string, after = 30): Paragraph {
  return p(text.toUpperCase(), { run: { color: AKZENT, bold: true, size: 14, font: 'Consolas' }, spacing: { before: 0, after } })
}

function absatz(text: string, size = 18, opts: { bold?: boolean; color?: string; after?: number } = {}): Paragraph {
  return p(text, {
    run: { size, bold: opts.bold, color: opts.color },
    spacing: { before: 0, after: opts.after ?? 40, line: 264, lineRule: LineRuleType.AUTO },
  })
}

/** Kasten mit Akzentlinie links — wie <Kasten> (gemeinsam.css), ohne Füllung. */
function kasten(label: string, inhalt: (Paragraph | Table)[], linie: 'voll' | 'gestrichelt' = 'voll'): Table {
  const rahmen = linie === 'voll'
    ? { top: RAND(), bottom: RAND(), right: RAND(), left: RAND(24, AKZENT) }
    : {
        top: { style: BorderStyle.DASHED, size: 6, color: AKZENT },
        bottom: { style: BorderStyle.DASHED, size: 6, color: AKZENT },
        left: { style: BorderStyle.DASHED, size: 6, color: AKZENT },
        right: { style: BorderStyle.DASHED, size: 6, color: AKZENT },
      }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [tcell([mikro(label), ...inhalt], { borders: rahmen, margins: { top: 60, bottom: 40, left: 120, right: 120 } })],
    })],
  })
}

/** Zwei Blöcke nebeneinander, ohne sichtbare Tabelle — wie .v42-auftrag-zweier. */
function zweiSpalten(links: (Paragraph | Table)[], rechts: (Paragraph | Table)[]): Table {
  const zelle = (inhalt: (Paragraph | Table)[], rechtsRand: number) => tcell(inhalt.length ? inhalt : [p('')], {
    width: { size: 50, type: WidthType.PERCENTAGE },
    borders: OHNE_RAENDER,
    margins: { top: 0, bottom: 0, left: rechtsRand ? 0 : 100, right: rechtsRand },
  })
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [zelle(links, 100), zelle(rechts, 0)] })],
  })
}

function luecke(twips = 100): Paragraph {
  return new Paragraph({ children: [], spacing: { before: 0, after: 0, line: twips, lineRule: LineRuleType.EXACT } })
}

// ---------------- A1 — Situation und Auftrag ----------------
function seiteA1(ga: GemeinsamerAuftrag): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [...sectionHead('A1', ga.titel || '', AKZENT)]
  const persona = [ga.persona?.beruf, ga.persona?.betrieb, ga.persona?.ort].filter(Boolean).join(' · ')
  if (persona) {
    out.push(new Paragraph({
      children: [
        new TextRun({ text: 'PERSONA   ', color: AKZENT, bold: true, size: 14, font: 'Consolas' }),
        new TextRun({ text: persona, color: COLOR.inkSoft, size: 18 }),
      ],
      spacing: { before: 0, after: 80 },
    }))
  }
  if (ga.situation_text) {
    out.push(p(ga.situation_text, { run: { size: 20 }, spacing: { before: 0, after: 120, line: 276, lineRule: LineRuleType.AUTO } }))
  }

  const zahlen = ga.zahlen_tabelle || []
  const links: (Paragraph | Table)[] = zahlen.length
    ? [new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            tableHeader: true,
            children: ['Zahlen', 'Betrag'].map((t, i) => tcell(
              p(t.toUpperCase(), { run: { size: 14, bold: true, color: AKZENT }, alignment: i ? AlignmentType.RIGHT : undefined, spacing: { after: 0 } }),
              { width: { size: i ? 28 : 72, type: WidthType.PERCENTAGE }, borders: { ...OHNE_RAENDER, bottom: RAND(12, AKZENT) }, margins: { top: 20, bottom: 30, left: 0, right: 60 } },
            )),
          }),
          ...zahlen.map((z) => new TableRow({
            children: [
              tcell(p(z.label, { run: { size: 18 }, spacing: { after: 0 } }), { borders: { ...OHNE_RAENDER, bottom: RAND(2, COLOR.ruleSoft) }, margins: { top: 30, bottom: 30, left: 0, right: 60 } }),
              tcell(p(z.wert, { run: { size: 18, font: 'Consolas' }, alignment: AlignmentType.RIGHT, spacing: { after: 0 } }), { borders: { ...OHNE_RAENDER, bottom: RAND(2, COLOR.ruleSoft) }, margins: { top: 30, bottom: 30, left: 0, right: 60 } }),
            ],
          })),
        ],
      })]
    : []
  const rechts: (Paragraph | Table)[] = []
  if (ga.leitfrage) rechts.push(kasten('Leitfrage', [absatz(ga.leitfrage, 20, { bold: true, after: 0 })]))
  if (ga.mehrdeutigkeit?.trade_off) {
    if (rechts.length) rechts.push(luecke(100))
    rechts.push(kasten('Spannungsfeld', [
      absatz(ga.mehrdeutigkeit.trade_off, 19, { bold: true, after: ga.mehrdeutigkeit.hint ? 20 : 0 }),
      ...(ga.mehrdeutigkeit.hint ? [absatz(ga.mehrdeutigkeit.hint, 18, { color: COLOR.inkSoft, after: 0 })] : []),
    ], 'gestrichelt'))
  }
  if (links.length || rechts.length) out.push(zweiSpalten(links, rechts), luecke(140))

  const schritte = ga.schritte || []
  if (ga.auftrag || schritte.length) {
    out.push(kasten('Ihr Auftrag', [
      ...(ga.auftrag ? [absatz(ga.auftrag, 20, { bold: true, after: 60 })] : []),
      ...schritte.map((s, i) => {
        const [nr, label] = schrittTeile(s.label, i)
        return new Paragraph({
          children: [
            new TextRun({ text: `${nr}\t`, color: AKZENT, bold: true, size: 18, font: 'Consolas' }),
            new TextRun({ text: label, bold: true, size: 19 }),
            new TextRun({ text: ` — ${s.hint}`, size: 19 }),
          ],
          tabStops: [{ type: TabStopType.LEFT, position: 450 }],
          indent: { left: 450, hanging: 450 },
          spacing: { before: 0, after: 50, line: 260, lineRule: LineRuleType.AUTO },
        })
      }),
    ]), luecke(140))
  }

  const abgaben = (ga.abgaben || []).map((a) => new Paragraph({
    children: [new TextRun({ text: '☐  ', bold: true, color: AKZENT, size: 18 }), new TextRun({ text: a, size: 18 })],
    indent: { left: 300, hanging: 300 },
    spacing: { before: 0, after: 30, line: 260, lineRule: LineRuleType.AUTO },
  }))
  const moeglich = sozialformZeile(ga.sozialform?.zulaessig)
  const sozial: Paragraph[] = []
  if (moeglich) sozial.push(p([new TextRun({ text: 'Möglich: ', bold: true, size: 18 }), new TextRun({ text: moeglich, size: 18 })], { spacing: { before: 0, after: 40, line: 260, lineRule: LineRuleType.AUTO } }))
  if (ga.sozialform?.empfehlung) sozial.push(p([new TextRun({ text: 'Empfehlung: ', bold: true, size: 18 }), new TextRun({ text: ga.sozialform.empfehlung, size: 18 })], { spacing: { before: 0, after: 0, line: 260, lineRule: LineRuleType.AUTO } }))
  if (abgaben.length || sozial.length) {
    out.push(zweiSpalten(
      abgaben.length ? [kasten('Das geben Sie ab', abgaben)] : [],
      sozial.length ? [kasten('Sozialform', sozial)] : [],
    ))
  }
  out.push(p('Ihre Hefte A und B dürfen Sie benutzen.', {
    run: { size: 19, bold: true },
    spacing: { before: 120, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 3 } },
  }))
  return out
}

// ---------------- A2 — Arbeitsfläche (Schritt 04) ----------------
function seiteA2(ga: GemeinsamerAuftrag): (Paragraph | Table)[] {
  const s = ga.schritte?.[3]
  const [nr, label] = s ? schrittTeile(s.label, 3) : ['04', 'Entscheidungsblatt']
  return [
    ...sectionHead('A2', label, AKZENT),
    ...(s?.hint ? [p([new TextRun({ text: `Schritt ${nr}: `, bold: true, size: 18 }), new TextRun({ text: s.hint, size: 18 })], { spacing: { before: 0, after: 100 } })] : []),
    // Höhe wie die HTML-Fläche bis zum Seitenende; ein Abschnitt je Seite, ein Zuviel würde eine fünfte Seite öffnen.
    skizzeBox(226, `SCHRITT ${nr} · ${label.toUpperCase()} · SCHRIFTLICH UND BILDLICH`, AKZENT),
  ]
}

// ---------------- A3 — Sprechspur + Glossar ----------------
function seiteA3(ga: GemeinsamerAuftrag, set: SetJson): (Paragraph | Table)[] {
  const s = ga.schritte?.[4]
  const [nr, label] = s ? schrittTeile(s.label, 4) : ['05', 'Sprachnachricht']
  const out: (Paragraph | Table)[] = [...sectionHead('A3', `${label} planen`, AKZENT)]
  if (s?.hint) out.push(p([new TextRun({ text: `Schritt ${nr}: `, bold: true, size: 18 }), new TextRun({ text: s.hint, size: 18 })], { spacing: { before: 0, after: 40 } }))
  out.push(absatz('Notieren Sie Stichworte, keinen ganzen Text. Sprechen Sie frei und stoppen Sie die Zeit. Ihre Sprachnachricht geben Sie der Lehrperson direkt ab: live oder als Aufnahme.', 18, { after: 80 }))

  // Die Spur: Linie links, Stationen mit zwei Schreiblinien — wie .v42-auftrag-spur.
  const spur: Paragraph[] = []
  SPRECHSPUR_STATIONEN.forEach((station, i) => {
    spur.push(new Paragraph({
      children: [
        new TextRun({ text: `${i + 1}   `, color: AKZENT, bold: true, size: 18, font: 'Consolas' }),
        new TextRun({ text: station, bold: true, size: 20 }),
      ],
      spacing: { before: i ? 120 : 0, after: 0 },
      keepNext: true,
    }))
    // schreibfeld() rechnet mindestens drei Linien; die Spur braucht zwei.
    spur.push(...schreibfeld(0).slice(0, 2))
  })
  spur.push(new Paragraph({
    children: [
      new TextRun({ text: 'ENDE   ', color: AKZENT, bold: true, size: 16, font: 'Consolas' }),
      new TextRun({ text: `Ziel ${sprechDauer(s?.hint)} · Probelauf:  ☐ zu kurz   ☐ passt   ☐ zu lang`, size: 18 }),
    ],
    spacing: { before: 120, after: 0 },
  }))
  out.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [tcell(spur, {
        borders: { ...OHNE_RAENDER, left: RAND(12, AKZENT) },
        margins: { top: 0, bottom: 0, left: 240, right: 0 },
      })],
    })],
  }))

  const glossar = set.glossar || []
  if (glossar.length) {
    out.push(p('Glossar der Einheit', {
      run: { size: 24, bold: true },
      spacing: { before: 200, after: 60 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 4 } },
      keepNext: true,
    }))
    const gruppen = glossarGruppen(glossar)
    // Zwei Hefte → je eine Spalte; sonst die Liste halbiert. Echte Tabelle, Zeile = Paar.
    const [l, r] = gruppen.length === 2 && gruppen.every((g) => g.heft)
      ? [gruppen[0].eintraege, gruppen[1].eintraege]
      : [glossar.slice(0, Math.ceil(glossar.length / 2)), glossar.slice(Math.ceil(glossar.length / 2))]
    const kopf = gruppen.length === 2 && gruppen.every((g) => g.heft) ? [`Heft ${gruppen[0].heft}`, `Heft ${gruppen[1].heft}`] : ['Begriffe', '']
    const eintrag = (e?: (typeof glossar)[number]) => e
      ? [
          p(e.begriff, { run: { size: 18, bold: true }, spacing: { before: 0, after: 0 } }),
          p(e.definition, { run: { size: 18, color: COLOR.inkSoft }, spacing: { before: 0, after: 0, line: 252, lineRule: LineRuleType.AUTO } }),
        ]
      : [p('')]
    const zelle = (inhalt: Paragraph[], links: boolean, istKopf = false) => tcell(inhalt, {
      width: { size: 50, type: WidthType.PERCENTAGE },
      borders: istKopf
        ? { ...OHNE_RAENDER, bottom: RAND(12, AKZENT) }
        : { ...OHNE_RAENDER, bottom: RAND(2, COLOR.rule) },
      margins: { top: 30, bottom: 30, left: links ? 0 : 160, right: links ? 160 : 0 },
    })
    out.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ tableHeader: true, children: kopf.map((k, i) => zelle([mikro(k, 0)], i === 0, true)) }),
        ...Array.from({ length: Math.max(l.length, r.length) }, (_, i) =>
          new TableRow({ cantSplit: true, children: [zelle(eintrag(l[i]), true), zelle(eintrag(r[i]), false)] })),
      ],
    }))
  }
  return out
}

// ---------------- A4 — Rückmeldung ----------------
function seiteA4(ga: GemeinsamerAuftrag): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [...sectionHead('A4', 'Rückmeldung', AKZENT)]
  out.push(absatz('Kreuzen Sie vor der Abgabe je Kriterium Ihre Stufe an (Spalte «Selbst»). Die Lehrperson gibt Ihnen Rückmeldung auf derselben Skala (Spalte «LP»). Es sind die Kriterien des KN; der Auftrag zählt nicht für die Note.', 18, { after: 80 }))

  const BREITEN = [7, 73, 10, 10]
  const linie = { ...OHNE_RAENDER, bottom: RAND(2, COLOR.rule) }
  const zelle = (inhalt: Paragraph[], i: number, borders: any = linie) => new TableCell({
    children: inhalt,
    width: { size: BREITEN[i], type: WidthType.PERCENTAGE },
    borders,
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 20, bottom: 20, left: 60, right: 60 },
  })
  const mitte = (text: string, size: number, opts: any = {}) =>
    p(text, { run: { size, ...opts }, alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } })

  const rows: TableRow[] = [new TableRow({
    tableHeader: true,
    children: ['Stufe', 'Kriterium', 'Selbst', 'LP'].map((t, i) => zelle(
      [p(t.toUpperCase(), { run: { size: 14, bold: true, color: AKZENT, font: 'Consolas' }, alignment: i === 1 ? undefined : AlignmentType.CENTER, spacing: { before: 0, after: 0 } })],
      i, { ...OHNE_RAENDER, bottom: RAND(12, AKZENT) },
    )),
  })]
  for (const k of ga.feedback_kriterien || []) {
    rows.push(new TableRow({
      cantSplit: true,
      children: [new TableCell({
        columnSpan: 4,
        borders: { ...OHNE_RAENDER, bottom: RAND(6, COLOR.ink) },
        margins: { top: 80, bottom: 20, left: 60, right: 60 },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: k.kn_kriterium, bold: true, size: 19 }),
              new TextRun({ text: `   ${k.dimension}`, bold: true, size: 14, color: AKZENT, font: 'Consolas' }),
            ],
            spacing: { before: 0, after: 0 },
            keepNext: true,
          }),
          ...(k.indikator_produkt
            ? [p(`Woran ich es sehe: ${k.indikator_produkt}`, { run: { size: 18, color: COLOR.inkSoft }, spacing: { before: 0, after: 0 }, keepNext: true })]
            : []),
        ],
      })],
    }))
    k.stufen.forEach((st, si) => rows.push(new TableRow({
      cantSplit: true,
      children: [
        zelle([mitte(String(si), 17, { bold: true, font: 'Consolas' })], 0),
        zelle([p(st, { run: { size: 18 }, spacing: { before: 0, after: 0, line: 252, lineRule: LineRuleType.AUTO } })], 1),
        zelle([mitte('☐', 22)], 2),
        zelle([mitte('☐', 22)], 3),
      ],
    })))
  }
  out.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }))

  out.push(p('BIS ZUM KN VERBESSERE ICH …', { run: { color: AKZENT, bold: true, size: 14, font: 'Consolas' }, spacing: { before: 160, after: 0 }, keepNext: true }))
  out.push(...schreibfeld(17))
  out.push(p('RÜCKMELDUNG MEINER PARTNERIN / MEINES PARTNERS', { run: { color: AKZENT, bold: true, size: 14, font: 'Consolas' }, spacing: { before: 120, after: 0 }, keepNext: true }))
  out.push(...schreibfeld(0).slice(0, 1))
  return out
}

/** Vier Abschnitte = vier Seiten in der Folge A1–A4. `null` ohne `gemeinsamer_auftrag`. */
export function buildAuftragsbogen({ set, abteilung, logoPng = null }: BuildAuftragsbogenOpts): Document | null {
  const ga = set?.gemeinsamer_auftrag
  if (!set || !ga) return null
  const docTitel = `Auftragsbogen · ${ga.titel ?? ''}`.trim()
  const seiten = [seiteA1(ga), seiteA2(ga), seiteA3(ga, set), seiteA4(ga)]
  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: DOC_CODE,
    sections: seiten.map((children) => ({ ...sectionProps(DOC_CODE, docTitel, abteilung, logoPng), children })),
  })
}
