// docx-heft-v42-5-8.ts — Heft v4.2 (Word), Seiten 5–8: Auftrag · Methoden ·
// Arbeitsfläche · Abschluss. Spiegel von heft-v42/seiten-5-8.tsx — gleiche Folge,
// gleicher Inhalt, gleiche Texte. Kriterien, Quer-Check, Mitnahme und Checkliste
// sind echte Tabellen bzw. Absätze mit Kästchen-Zeichen (☐).
//
// methodenBlock und checklisteBlock kommen aus docx-builder.ts. Der Import ist
// zirkulär (der Builder ruft buildHeftV42 auf) und darum nur in Funktionskörpern
// benutzt — beim Aufruf ist das Modul längst ausgewertet. Nichts auf Modulebene.

import {
  Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, HeightRule, LineRuleType, VerticalAlign, WidthType,
} from 'docx'
import { COLOR, p, skizzeBox, tcell } from './docx-primitives'
import { kastenDocx, seitenKopfDocx, type HeftDocxKontext } from './docx-heft-v42-gemeinsam'
import { checklisteBlock, methodenBlock } from './docx-builder'
import { RUBRIK_PUNKTE_LABELS } from './rubrik-skala'
import { begriffsnetzTabelle, checklisteZweispaltigDocx, glossarBlock } from './docx-begriffsnetz-v42'
import { beispielBandDocx } from './docx-produkt-bild-v42'
import type { SituationJson } from './types'

type Block = Paragraph | Table

const KEIN = { style: BorderStyle.NIL, size: 0, color: 'FFFFFF' }
const LINIE = { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule }
const pct = (n: number) => ({ size: n, type: WidthType.PERCENTAGE })

/** Kleiner, fester Abstand zwischen Blöcken (spacer() wäre doppelt so hoch). */
function abstand(after = 100): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: '', size: 4 })],
    spacing: { before: 0, after, line: 40, lineRule: LineRuleType.EXACT },
  })
}

/** Beschriftung über einem Block — Gegenstück zu `.v42-kasten-label`. */
function label(text: string, ctx: HeftDocxKontext, farbe = ctx.akzent): Paragraph {
  return p(text.toUpperCase(), { run: { color: farbe, bold: true, size: 14 }, spacing: { after: 40 }, keepNext: true })
}

/** Arbeitsanweisung — Gegenstück zu `.v42-anweisung`. */
function anweisung(text: string): Paragraph {
  return p(text, { run: { color: COLOR.inkSoft, size: 18 }, spacing: { after: 60 }, keepNext: true })
}

/** «01 Karte einteilen» → Nummer und Text; Spiegel von schrittTeile() im HTML. */
function schrittTeile(text: string, i: number): { nr: string; text: string } {
  const m = /^\s*(\d{1,2})\s+(.+)$/.exec(text || '')
  return m ? { nr: m[1].padStart(2, '0'), text: m[2] } : { nr: String(i + 1).padStart(2, '0'), text: text || '' }
}

// ---------------------------------------------------------------------------
// Seite 5 — Auftrag
// ---------------------------------------------------------------------------

function schritteTabelle(sit: SituationJson, ctx: HeftDocxKontext): Table | null {
  const schritte = (sit.handlungsprodukt?.schritte || []).filter((s) => s && (s.label || s.hint))
  if (!schritte.length) return null
  const rand = { top: KEIN, left: KEIN, right: KEIN, bottom: LINIE }
  return new Table({
    width: pct(100),
    rows: schritte.map((s, i) => {
      const { nr, text } = schrittTeile(s.label, i)
      const m = { top: 50, bottom: 50, left: 0, right: 100 }
      return new TableRow({
        cantSplit: true,
        children: [
          tcell(p(nr, { run: { bold: true, color: ctx.akzent, font: 'Consolas', size: 20 }, spacing: { after: 0 } }), { width: pct(6), borders: rand, margins: m }),
          tcell(p(text, { run: { bold: true, size: 20 }, spacing: { after: 0 } }), { width: pct(25), borders: rand, margins: m }),
          tcell(p(s.hint || '', { run: { color: COLOR.inkSoft, size: 19 }, spacing: { after: 0 } }), { width: pct(69), borders: rand, margins: m }),
        ],
      })
    }),
  })
}

/**
 * Feedback-Kriterien als echte Tabelle: Kopfzeile je Kriterium (Name, Dimension,
 * Indikator), darunter die vier Stufen im Wortlaut mit ☐ in der Spalte «Selbst».
 * Name und Stufen zeichengenau aus den Daten (Invariante 8).
 */
function kriterienBlock(sit: SituationJson, ctx: HeftDocxKontext): Block[] {
  const kriterien = (sit.feedback_kriterien || []).filter((k) => k && k.kn_kriterium)
  if (!kriterien.length) return []
  const breite = [12, 80, 8]
  const kopfRand = { top: KEIN, left: KEIN, right: KEIN, bottom: { style: BorderStyle.SINGLE, size: 12, color: ctx.akzent } }
  const kopf = new TableRow({
    tableHeader: true,
    children: ['Stufe', 'Beschreibung (Wortlaut Kompetenznachweis)', 'Selbst'].map((t, i) => tcell(
      p(t.toUpperCase(), { run: { bold: true, size: 13, color: ctx.akzent }, spacing: { after: 0 }, alignment: i === 2 ? AlignmentType.CENTER : undefined }),
      { width: pct(breite[i]), borders: kopfRand, margins: { top: 20, bottom: 40, left: 0, right: 80 } },
    )),
  })
  const zeilen: TableRow[] = [kopf]
  for (const k of kriterien) {
    const name: TextRun[] = [new TextRun({ text: k.kn_kriterium, bold: true, size: 21 })]
    if (k.dimension) name.push(new TextRun({ text: `   ${k.dimension}`, bold: true, size: 14, color: ctx.akzent }))
    const inhalt: Paragraph[] = [new Paragraph({ children: name, spacing: { after: 20 }, keepNext: true })]
    if (k.indikator_produkt) {
      inhalt.push(new Paragraph({
        children: [
          new TextRun({ text: 'Woran sehe ich das in meinem Produkt? ', italics: true, size: 18, color: COLOR.inkSoft }),
          new TextRun({ text: k.indikator_produkt, size: 18, color: COLOR.inkSoft }),
        ],
        spacing: { after: 0 },
        keepNext: true,
      }))
    }
    zeilen.push(new TableRow({
      cantSplit: true,
      children: [new TableCell({
        children: inhalt,
        columnSpan: 3,
        margins: { top: 100, bottom: 40, left: 0, right: 0 },
        borders: { top: KEIN, left: KEIN, right: KEIN, bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.inkSoft } },
      })],
    }))
    k.stufen.forEach((s, si) => {
      const rand = { top: KEIN, left: KEIN, right: KEIN, bottom: LINIE }
      const m = { top: 30, bottom: 30, left: 0, right: 80 }
      zeilen.push(new TableRow({
        cantSplit: true,
        children: [
          tcell(p(RUBRIK_PUNKTE_LABELS[si] ?? `${si} Punkte`, { run: { font: 'Consolas', size: 14, color: COLOR.inkSoft }, spacing: { after: 0 } }), { width: pct(breite[0]), borders: rand, margins: m }),
          tcell(p(s, { run: { size: 18 }, spacing: { after: 0 } }), { width: pct(breite[1]), borders: rand, margins: m }),
          tcell(p('☐', { run: { size: 24 }, alignment: AlignmentType.CENTER, spacing: { after: 0 } }), { width: pct(breite[2]), borders: rand, margins: { ...m, right: 0 }, verticalAlign: VerticalAlign.CENTER }),
        ],
      }))
    })
  }
  return [
    label('Feedback-Kriterien', ctx),
    anweisung('Kreuzen Sie vor der Abgabe in der Spalte «Selbst» Ihre Stufe an.'),
    new Table({ width: pct(100), rows: zeilen }),
  ]
}

/** Plus — freiwillig, darum gestrichelt umrandet (Gegenstück zu `.v42-plus`). */
function plusKasten(text: string): Table {
  const strich = { style: BorderStyle.DASHED, size: 4, color: COLOR.inkMute }
  return new Table({
    width: pct(100),
    rows: [new TableRow({
      cantSplit: true,
      children: [tcell([
        p('PLUS', { run: { color: COLOR.inkSoft, bold: true, size: 14 }, spacing: { after: 30 } }),
        p(text, { run: { size: 19 }, spacing: { after: 0 } }),
      ], { borders: { top: strich, bottom: strich, right: strich, left: { style: BorderStyle.DASHED, size: 24, color: COLOR.inkMute } } })],
    })],
  })
}

export function seite5Docx(ctx: HeftDocxKontext): Block[] {
  const { sit } = ctx
  const hp = sit.handlungsprodukt
  const els: Block[] = [...seitenKopfDocx(5, 'Auftrag', ctx)]

  const produkt: Paragraph[] = []
  if (hp?.titel) produkt.push(p(hp.titel, { run: { bold: true, size: 25 }, spacing: { after: 30 } }))
  if (hp?.beschreibung) produkt.push(p(hp.beschreibung, { run: { size: 20 }, spacing: { after: 0 } }))
  if (produkt.length) els.push(kastenDocx('Ihr Produkt', produkt, ctx), abstand())

  const schritte = schritteTabelle(sit, ctx)
  if (schritte) els.push(schritte, abstand(60))
  if (hp?.hilfe_verweis) els.push(p(`→ ${hp.hilfe_verweis}`, { run: { italics: true, size: 18, color: COLOR.inkSoft }, spacing: { after: 100 } }))

  const abgaben = (hp?.abgaben || []).filter(Boolean)
  if (abgaben.length) {
    els.push(kastenDocx('Das geben Sie ab', abgaben.map((a) => new Paragraph({
      children: [new TextRun({ text: '•  ', bold: true, color: ctx.akzent, size: 20 }), new TextRun({ text: a, size: 20 })],
      spacing: { after: 20 },
      indent: { left: 120 },
    })), ctx), abstand())
  }

  const kriterien = kriterienBlock(sit, ctx)
  if (kriterien.length) els.push(...kriterien, abstand())

  const plus = sit.lernfortschritt?.scaffold_100
  if (plus) els.push(plusKasten(plus))
  return els
}

// ---------------------------------------------------------------------------
// Seite 6 — Methoden: der Bestand, unverändert (2×2-Tabelle, Kontur statt Farbe)
// ---------------------------------------------------------------------------

export function seite6Docx(ctx: HeftDocxKontext): Block[] {
  // Mit Beispielbild: das Band als Tabelle unter den Methodenkarten (wie im HTML).
  const bild = ctx.sit.handlungsprodukt?.beispielbild
  return [
    ...seitenKopfDocx(6, 'Methoden', ctx),
    ...methodenBlock(ctx.sit, ctx.akzent),
    ...(bild ? beispielBandDocx(bild, ctx.akzent) : []),
  ]
}

// ---------------------------------------------------------------------------
// Seite 7 — Arbeitsfläche
// ---------------------------------------------------------------------------

export function seite7Docx(ctx: HeftDocxKontext): Block[] {
  // Wie der Bestand (skizzeBox, 235 mm → 40 Leerzeilen); passt auch unter dem
  // Seitenkopf noch auf die Seite (in Word nachgezählt). Beschriftung = Produkttitel
  // (im HTML per CSS in Versalien, hier ausgeschrieben).
  const titel = ctx.sit.handlungsprodukt?.titel || 'Hier erarbeiten'
  return [...seitenKopfDocx(7, 'Arbeitsfläche', ctx), skizzeBox(235, titel.toUpperCase(), ctx.akzent)]
}

// ---------------------------------------------------------------------------
// Seite 8 — Abschluss
// ---------------------------------------------------------------------------

/**
 * Mindmap als 3×3-Tabelle wie das HTML-Raster: Zentrum in der Mitte, die Äste in
 * den Ecken, dazwischen freie Zellen zum Verbinden. Der Ast «gilt auch bei …»
 * (`transfer: true`) ist gestrichelt und hat Leerzeilen statt Punkten.
 */
function mindmapTabelle(sit: SituationJson, ctx: HeftDocxKontext): Table {
  const aeste = (sit.mindmap_aeste || []).slice(0, 4)
  const leer = () => tcell([p('')], { width: pct(33), borders: { top: KEIN, bottom: KEIN, left: KEIN, right: KEIN } })
  const astZelle = (ast: (typeof aeste)[number] | undefined): TableCell => {
    if (!ast) return leer()
    const offen = !!ast.transfer || !ast.punkte?.length
    const kids: Paragraph[] = [p(ast.titel, { run: { bold: true, size: 19, color: offen ? COLOR.ink : ctx.akzent }, spacing: { after: 40 } })]
    if (offen) {
      for (let i = 0; i < 3; i++) {
        kids.push(new Paragraph({
          children: [new TextRun({ text: '' })],
          spacing: { before: 0, after: 60, line: 300, lineRule: LineRuleType.AUTO },
          border: { bottom: { style: BorderStyle.DOTTED, size: 4, color: COLOR.inkMute } },
        }))
      }
    } else {
      ast.punkte!.forEach((pt) => kids.push(new Paragraph({ children: [new TextRun({ text: pt, size: 17 })], bullet: { level: 0 }, spacing: { after: 10 } })))
    }
    const kante = offen
      ? { style: BorderStyle.DASHED, size: 4, color: COLOR.inkSoft }
      : { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule }
    return tcell(kids, {
      width: pct(33),
      verticalAlign: VerticalAlign.CENTER,
      borders: {
        top: kante, bottom: kante, right: kante,
        left: offen ? { style: BorderStyle.DASHED, size: 24, color: COLOR.inkSoft } : { style: BorderStyle.SINGLE, size: 24, color: ctx.akzent },
      },
    })
  }
  const zentrum = tcell([p(sit.mindmap_zentrum || '', { run: { bold: true, size: 21 }, alignment: AlignmentType.CENTER, spacing: { after: 0 } })], {
    width: pct(34),
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 120, bottom: 120, left: 120, right: 120 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 12, color: ctx.akzent },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: ctx.akzent },
      left: { style: BorderStyle.SINGLE, size: 12, color: ctx.akzent },
      right: { style: BorderStyle.SINGLE, size: 12, color: ctx.akzent },
    },
  })
  const hoehe = { value: Math.round(20 * 56.6929), rule: HeightRule.ATLEAST }
  return new Table({
    width: pct(100),
    rows: [
      new TableRow({ cantSplit: true, height: hoehe, children: [astZelle(aeste[0]), leer(), astZelle(aeste[1])] }),
      new TableRow({ cantSplit: true, height: hoehe, children: [leer(), zentrum, leer()] }),
      new TableRow({ cantSplit: true, height: hoehe, children: [astZelle(aeste[2]), leer(), astZelle(aeste[3])] }),
    ],
  })
}

export function seite8Docx(ctx: HeftDocxKontext): Block[] {
  const { sit } = ctx
  const els: Block[] = [...seitenKopfDocx(8, 'Abschluss', ctx)]
  // Begriffsnetz + Glossar (E17), sobald das Heft ein Glossar trägt; sonst die Mindmap.
  const netz = (sit.glossar?.length ?? 0) > 0 && (sit.mindmap_aeste?.length ?? 0) > 0

  if (netz) {
    const transferTitel = sit.mindmap_aeste?.find((a) => a.transfer)?.titel || 'gilt auch bei …'
    els.push(anweisung(
      `Verbinden Sie Begriffe mit Linien und schreiben Sie an jede Linie, wie die zwei Begriffe zusammenhängen — mindestens fünf Verbindungen, eine davon zum Feld «${transferTitel}». Schreiben Sie in die zwei leeren Knoten je einen Begriff aus Ihrem Raster (S. 3).`,
    ))
    els.push(begriffsnetzTabelle(sit, ctx), abstand(60), ...glossarBlock(sit, ctx), abstand(60))
  } else if ((sit.mindmap_aeste?.length ?? 0) > 0) {
    const transferTitel = sit.mindmap_aeste?.find((a) => a.transfer)?.titel || 'gilt auch bei …'
    els.push(anweisung(
      `Verbinden Sie die Begriffe mit Linien und schreiben Sie an jede Linie, wie die zwei Begriffe zusammenhängen — mindestens fünf Verbindungen. Ergänzen Sie mindestens zwei Begriffe aus Ihrem Raster (S. 3). Tragen Sie im Feld «${transferTitel}» ein, wo dasselbe sonst noch gilt, und führen Sie eine Verbindung dorthin.`,
    ))
    els.push(mindmapTabelle(sit, ctx), abstand(60))
  }

  const quercheck = (sit.abschluss?.quercheck || []).filter(Boolean)
  if (quercheck.length) {
    els.push(label('Quer-Check — die offenen Fragen der Situation', ctx))
    quercheck.forEach((q) => els.push(new Paragraph({
      children: [new TextRun({ text: '☐   ', size: 22 }), new TextRun({ text: q, size: 19 })],
      spacing: { before: 20, after: 40 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule, space: 2 } },
    })))
    els.push(abstand(60))
  }

  const mitnahme = (sit.abschluss?.mitnahme || []).filter(Boolean)
  if (mitnahme.length) {
    els.push(label('Das nehme ich mit', ctx))
    // Mit Begriffsnetz fehlt der Platz für die Anweisung — wie im HTML.
    if (!netz) els.push(anweisung('Halten Sie in drei Zeilen fest, was Sie aus diesem Heft weiterverwenden.'))
    // Beschriftung unten in der Zelle, ohne Innenabstand unten: die Grundlinie sitzt
    // bündig auf der eigenen Schreiblinie (Unterkante der rechten Zelle), nicht mittig
    // zwischen zwei Linien — wie .v42-mitnahme-zeile im HTML.
    const unten = { top: 0, bottom: 20, left: 0, right: 100 }
    els.push(new Table({
      width: pct(100),
      rows: mitnahme.map((m) => new TableRow({
        cantSplit: true,
        height: { value: Math.round((netz ? 7.5 : 9) * 56.6929), rule: HeightRule.ATLEAST },
        children: [
          tcell(p(m, { run: { bold: true, size: 19 }, spacing: { before: 0, after: 0 } }), { width: pct(30), verticalAlign: VerticalAlign.BOTTOM, margins: unten, borders: { top: KEIN, left: KEIN, right: KEIN, bottom: KEIN } }),
          tcell(p('', { spacing: { before: 0, after: 0 } }), { width: pct(70), verticalAlign: VerticalAlign.BOTTOM, margins: { ...unten, right: 0 }, borders: { top: KEIN, left: KEIN, right: KEIN, bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.inkSoft } } }),
        ],
      })),
    }), abstand(60))
  }

  // Checkliste Vollständigkeit (✔ … ☐): mit Begriffsnetz im 2×2-Raster, sonst der Bestand.
  els.push(...(netz ? checklisteZweispaltigDocx(sit, ctx) : checklisteBlock(sit, ctx.akzent)))
  return els
}
