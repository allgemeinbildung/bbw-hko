// docx.ts — die drei leeren Word-Vorlagen für eigenes Material.
//
// Gleiche Bausteine wie die generierten Einheiten-Dokumente (docx-primitives),
// also gleiche Typografie, gleiche Seitenränder, gleicher Kopf mit Logo. Eine
// Vorlage ist deshalb kein Fremdkörper im Ordner der Lehrperson, sondern sieht
// aus wie das, was die Plattform sonst ausgibt.
//
// Alles läuft clientseitig (wie EinheitWorkbench) — keine Vercel-Funktion.

import { Document, Paragraph, TextRun, BorderStyle, ShadingType, Table, TableRow, WidthType, LineRuleType, HeadingLevel } from 'docx'
import {
  COLOR, BBW_GRUEN, BBW_GRUEN_TINT,
  p, h, sectionHead, spacer, pageBreak, tcell,
  schreibfeld, skizzeBox, callout, sectionProps,
} from '../einheiten/docx-primitives'
import { RUBRIK_PUNKTE_LABELS } from '../einheiten/rubrik-skala'
import type { VorlagenKontext } from './kontext'
import { LEERER_KONTEXT } from './kontext'
import { wortschatz, type Terminologie, type Wortschatz } from './wortschatz'
import { vorlagenStyles, STIL_LEGENDE } from './styles'

export type VorlagenTyp = 'herausforderung' | 'kompetenznachweis' | 'begleiter' | 'blanko'

export const VORLAGEN_TYPEN: { key: VorlagenTyp; label: string; zweck: string; dateiteil: string }[] = [
  { key: 'herausforderung',   label: 'Herausforderung / Arbeitsblatt', zweck: 'Der Bogen, den die Lernenden in der Hand haben: Situation, Leitfragen, Handlungsprodukt, Arbeitsfläche, Selbstcheck.', dateiteil: 'herausforderung' },
  { key: 'kompetenznachweis', label: 'Kompetenznachweis + Raster',    zweck: 'Die Prüfungsaufgabe und das zweidimensionale Raster (SuK · Ges, 0–3 Punkte, zwei getrennte Noten).', dateiteil: 'kompetenznachweis' },
  { key: 'begleiter',         label: 'Begleitdokument Lehrperson',    zweck: 'Steckbrief, Ablaufraster, Stolpersteine, Differenzierung — und die Notizen nach dem Unterricht.', dateiteil: 'begleitdokument' },
  { key: 'blanko',            label: 'Blanko — nur Gerüst',           zweck: 'Kopf mit Logo, Fusszeile mit Seitenzahl, die BBW-Formatvorlagen und die Überschriften. Keine Schreiblinien, keine Anleitung — das leere Blatt zum Selberschreiben.', dateiteil: 'blanko' },
]

const AKZENT = BBW_GRUEN
const LIGHT = BBW_GRUEN_TINT

// ---------------------------------------------------------------- Bausteine

/** Zeile mit Kästchen zum Ankreuzen. */
function ankreuz(optionen: string[]): Paragraph {
  return new Paragraph({
    children: [new TextRun({
      text: optionen.map((o) => `☐  ${o}`).join('      '),
      size: 18, font: 'Consolas', color: COLOR.ink,
    })],
    spacing: { after: 120 },
  })
}

/** Leere Ankreuz-Zeile mit Schreiblinie dahinter. */
function ankreuzLinie(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: '☐  ', size: 18, font: 'Consolas', color: AKZENT })],
    spacing: { after: 175, line: 360, lineRule: LineRuleType.AUTO },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.line } },
  })
}

/** Kleine Feldbeschriftung über einem Schreibfeld. */
function feldLabel(text: string, hint?: string): Paragraph[] {
  const out = [p(text.toUpperCase(), { run: { color: AKZENT, bold: true, size: 14 }, spacing: { before: 120, after: hint ? 20 : 40 } })]
  if (hint) out.push(p(hint, { run: { italics: true, color: COLOR.inkMute, size: 15 }, spacing: { after: 40 } }))
  return out
}

/** Beschriftetes Schreibfeld in einem Zug. */
function feld(label: string, mm: number, hint?: string): Paragraph[] {
  return [...feldLabel(label, hint), ...schreibfeld(mm)]
}

/** Grauer Hinweis für die Lehrperson. */
function lpHinweis(text: string): Paragraph {
  return p(text, { run: { italics: true, color: COLOR.inkMute, size: 15 }, spacing: { after: 120 } })
}

/**
 * Seite 1 jeder Vorlage: was das Dokument ist und wie man es ausfüllt.
 * Bei Dokumenten für die Klasse trägt sie den ausdrücklichen Hinweis, dass sie
 * vor dem Austeilen gelöscht wird — sonst landet die Anleitung im Klassensatz.
 */
function anleitungsSeite(titel: string, intro: string, schritte: string[], fuerLernende: boolean): any[] {
  const out: any[] = []
  out.push(p('Vorlage · ABU-Materialplattform BBW', { run: { color: AKZENT, bold: true, size: 16 }, spacing: { after: 40 } }))
  out.push(h(titel, 'title'))
  out.push(p(intro, { run: { size: 20 }, spacing: { after: 140, line: 340, lineRule: LineRuleType.AUTO } }))

  out.push(p('SO FÜLLEN SIE DIE VORLAGE AUS', { run: { color: AKZENT, bold: true, size: 14 }, spacing: { after: 60 } }))
  schritte.forEach((s) => {
    out.push(new Paragraph({
      children: [new TextRun({ text: '✓  ', bold: true, color: AKZENT, size: 20 }), new TextRun({ text: s, size: 19 })],
      spacing: { after: 50 },
      indent: { left: 200 },
    }))
  })

  out.push(spacer(100))
  if (fuerLernende) {
    out.push(callout(
      'Diese Seite vor dem Austeilen löschen',
      'Alles ab der nächsten Seite ist für die Lernenden. Diese Anleitungsseite gehört Ihnen — löschen Sie sie, bevor Sie den Klassensatz drucken.',
      AKZENT, LIGHT,
    ))
    out.push(spacer(80))
  }
  out.push(callout(
    'Teilen erwünscht',
    'Funktioniert Ihr Material? Reichen Sie es auf bbw-hko.ch unter «Material einreichen» ein — geprüftes Material wird allen Lehrpersonen zur Verfügung gestellt.',
    AKZENT, LIGHT,
  ))
  return out
}

/**
 * Verortungsblock — nur wenn die Lehrperson einen Lehrplan-Ort gewählt hat.
 * Im neutralen Wortschatz schrumpft er auf eine einzige Bezugszeile.
 */
function verortungsBlock(k: VorlagenKontext, w: Wortschatz): any[] {
  if (!k.lehrgang) return []
  const zeilen: string[] = []
  if (k.lehrgangLabel) zeilen.push(k.lehrgangLabel)
  if (k.themaNr) zeilen.push(`Thema ${k.themaNr} · ${k.themaTitel || ''}`.trim())
  if (k.lebensbezugNr) zeilen.push(`Lebensbezug ${k.lebensbezugNr}`)
  for (const komp of k.kompetenzen) zeilen.push(`Kompetenz ${komp.nr}`)
  if (!zeilen.length) return []

  if (!w.mitTaxonomie) {
    return [p(`Bezug: ${zeilen.join(' · ')}`, { run: { color: COLOR.inkMute, size: 15, font: 'Consolas' }, spacing: { after: 120 } })]
  }

  const out: any[] = []
  out.push(p(w.verortung.toUpperCase(), { run: { color: AKZENT, bold: true, size: 14 }, spacing: { after: 40 } }))
  out.push(p(zeilen.join('  ·  '), { run: { size: 17, font: 'Consolas', color: COLOR.inkSoft }, spacing: { after: 60 } }))
  if (k.lebensbezugText) out.push(p(k.lebensbezugText, { run: { size: 17, color: COLOR.inkSoft, italics: true }, spacing: { after: 100 } }))
  return out
}

/** Zweispaltige Liste {Bezeichnung → Detail} als schlanke Tabelle. */
function refTabelle(titel: string, rows: { label: string; detail: string }[]): any[] {
  if (!rows.length) return []
  const rand = {
    top: { style: BorderStyle.NIL, size: 0 },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: COLOR.ruleSoft },
    left: { style: BorderStyle.NIL, size: 0 },
    right: { style: BorderStyle.NIL, size: 0 },
  }
  const out: any[] = []
  out.push(p(titel.toUpperCase(), { run: { color: AKZENT, bold: true, size: 14 }, spacing: { before: 140, after: 50 } }))
  out.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((r) => new TableRow({
      children: [
        tcell(p(r.label, { run: { size: 17, bold: true } }), { width: { size: 34, type: WidthType.PERCENTAGE }, borders: rand }),
        tcell(p(r.detail || '—', { run: { size: 17, color: COLOR.inkSoft } }), { width: { size: 66, type: WidthType.PERCENTAGE }, borders: rand }),
      ],
    })),
  }))
  return out
}

/**
 * Taxonomie-Anhang: was der nRLP an dieser Stelle empfiehlt. Bewusst als
 * *Vorschlag* beschriftet — die Auswahl bleibt eine didaktische Entscheidung,
 * die die Vorlage nicht vorwegnimmt. Im neutralen Wortschatz entfällt er ganz.
 */
function taxonomieSeite(k: VorlagenKontext, w: Wortschatz): any[] {
  if (!w.mitTaxonomie) return []
  if (!k.aspekte.length && !k.sprachmodi.length && !k.schluesselkompetenzen.length) return []
  const out: any[] = []
  out.push(pageBreak())
  out.push(...sectionHead('Anhang', 'Was der Lehrplan hier vorschlägt', AKZENT))
  out.push(lpHinweis('Aus dem nRLP für die gewählte(n) Kompetenz(en) übernommen. Kreuzen Sie an, was Ihr Material tatsächlich bedient — die übrigen Zeilen können Sie löschen.'))

  if (k.schluesselkompetenzen.length) {
    out.push(p('SCHLÜSSELKOMPETENZEN (THEMA-EBENE)', { run: { color: AKZENT, bold: true, size: 14 }, spacing: { before: 140, after: 50 } }))
    k.schluesselkompetenzen.forEach((s) => {
      out.push(new Paragraph({
        children: [new TextRun({ text: '☐  ', size: 18, font: 'Consolas' }), new TextRun({ text: s, size: 17 })],
        spacing: { after: 60 },
      }))
    })
  }
  out.push(...refTabelle('Gesellschaftliche Inhalte (Aspekte)', k.aspekte.map((a) => ({ label: a.label, detail: a.detail }))))
  out.push(...refTabelle('Sprachmodi', k.sprachmodi.map((s) => ({ label: s.label, detail: s.detail }))))
  return out
}

export interface BuildVorlageOpts {
  kontext?: VorlagenKontext
  terminologie?: Terminologie
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

function doc(docCode: string, docTitel: string, o: BuildVorlageOpts, children: any[], mitDokumentBasis = false): Document {
  return new Document({
    creator: 'ABU-Materialplattform BBW',
    title: docTitel,
    description: docCode,
    // Die Formatvorlagen aendern an den ausgefuellten Vorlagen nichts (die
    // formatieren direkt), geben der Lehrperson aber den Katalog fuer alles,
    // was sie selbst dazuschreibt. Siehe ./styles.ts.
    styles: vorlagenStyles(mitDokumentBasis),
    sections: [{ ...sectionProps(docCode, docTitel, o.abteilung, o.logoPng ?? null), children }],
  })
}

// ------------------------------------------- 1 · Herausforderung / Arbeitsblatt

export function buildHerausforderungVorlage(o: BuildVorlageOpts = {}): Document {
  const k = o.kontext || LEERER_KONTEXT
  const w = wortschatz(o.terminologie || 'hko')
  const children: any[] = []

  children.push(...anleitungsSeite(
    `${w.hfTitel} — Vorlage`,
    'Der Bogen, den die Lernenden in der Hand haben. Die Struktur ist dieselbe wie bei den fertigen Einheiten der Plattform; Umfang und Ton passen Sie frei an.',
    [
      `${w.versprechen} formulieren — ein Satz, der den Massstab setzt.`,
      `${w.situation} schreiben: konkret, mit einer Entscheidung, die wirklich offen ist.`,
      `${w.leitfragen} ergänzen oder streichen — vier sind ein Richtwert, keine Regel.`,
      `${w.produkt} benennen: Was liegt am Schluss physisch vor?`,
      'Die Arbeitsfläche so gross lassen, wie das Produkt Platz braucht.',
      'Seiten dürfen weg: was Sie nicht brauchen, löschen Sie in Word.',
    ],
    true,
  ))

  // Seite 2 — Cockpit
  children.push(pageBreak())
  children.push(...verortungsBlock(k, w))
  children.push(...feld('Titel', 10))
  children.push(spacer(60))
  children.push(...feldLabel(w.versprechen, w.versprechenHint))
  if (k.kompetenzversprechen) {
    children.push(callout('Vorschlag aus dem Lehrplan', k.kompetenzversprechen, AKZENT, LIGHT))
    children.push(lpHinweis('Übernehmen, zuspitzen oder ersetzen — dann die Linien darunter benutzen.'))
  }
  children.push(...schreibfeld(16))
  children.push(...feld(w.situation, 45, w.situationHint))
  children.push(...feld(w.auftrag, 25))

  // Seite 3 — Leitfragen
  children.push(pageBreak())
  children.push(...sectionHead('01', w.leitfragen, AKZENT))
  children.push(lpHinweis(w.leitfragenHint))
  for (let i = 1; i <= 4; i++) {
    children.push(p(`${i}.`, { run: { color: AKZENT, bold: true, size: 18, font: 'Consolas' }, spacing: { before: 140, after: 30 } }))
    children.push(...schreibfeld(22))
  }

  // Seite 4 — Handlungsprodukt
  children.push(pageBreak())
  children.push(...sectionHead('02', w.produkt, AKZENT))
  children.push(lpHinweis(w.produktHint))
  children.push(...feld('Das entsteht', 18))
  children.push(...feldLabel('Damit ist es gelungen', 'Drei bis fünf beobachtbare Merkmale — dieselben, die später bewertet werden.'))
  for (let i = 0; i < 4; i++) children.push(ankreuzLinie())
  children.push(spacer(80))
  children.push(...feld('Rahmen (Zeit · Sozialform · Hilfsmittel)', 12))

  // Seite 5 — Arbeitsfläche
  children.push(pageBreak())
  children.push(skizzeBox(235, w.arbeitsflaeche.toUpperCase(), AKZENT))

  // Seite 6 — Selbstcheck
  children.push(pageBreak())
  children.push(...sectionHead('03', w.selbstcheck, AKZENT))
  children.push(lpHinweis('Erst prüfen, ob alles da ist — dann darüber nachdenken, wie es gelaufen ist.'))
  children.push(p('VOLLSTÄNDIGKEIT', { run: { color: AKZENT, bold: true, size: 14 }, spacing: { before: 100, after: 50 } }))
  for (let i = 0; i < 4; i++) children.push(ankreuzLinie())
  children.push(...feld('Das ist mir gelungen', 14))
  children.push(...feld('Das würde ich beim nächsten Mal anders machen', 14))

  children.push(...taxonomieSeite(k, w))

  return doc(w.hfCode + (k.code ? ` · ${k.code}` : ''), `${w.hfTitel} — Vorlage`, o, children)
}

// -------------------------------------------- 2 · Kompetenznachweis + Raster

/** Rasterzeile: Kriterium links, vier Punktekästchen rechts. */
function rasterZeile(): TableRow {
  return new TableRow({
    children: [
      tcell([...schreibfeld(9)], { width: { size: 40, type: WidthType.PERCENTAGE } }),
      ...RUBRIK_PUNKTE_LABELS.map(() => tcell(
        p('☐', { run: { size: 22, font: 'Consolas' }, alignment: 'center' as any }),
        { width: { size: 15, type: WidthType.PERCENTAGE } },
      )),
    ],
  })
}

function rasterBlock(dimension: string, zeilen: number): any[] {
  const out: any[] = []
  out.push(p(dimension.toUpperCase(), { run: { color: AKZENT, bold: true, size: 15 }, spacing: { before: 160, after: 50 } }))
  const header = new TableRow({
    tableHeader: true,
    children: [
      tcell(p('KRITERIUM', { run: { size: 13, bold: true, color: AKZENT } }), {
        width: { size: 40, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: LIGHT },
      }),
      ...RUBRIK_PUNKTE_LABELS.map((l) => tcell(
        p(l.toUpperCase(), { run: { size: 12, bold: true, color: AKZENT }, alignment: 'center' as any }),
        { width: { size: 15, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: LIGHT } },
      )),
    ],
  })
  const rows = [header]
  for (let i = 0; i < zeilen; i++) rows.push(rasterZeile())
  out.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }))
  out.push(p(`Summe ${dimension}: ______ von ${zeilen * 3} Punkten`, { run: { size: 17, bold: true, color: COLOR.inkSoft }, spacing: { before: 80, after: 40 } }))
  return out
}

export function buildKompetenznachweisVorlage(o: BuildVorlageOpts = {}): Document {
  const k = o.kontext || LEERER_KONTEXT
  const w = wortschatz(o.terminologie || 'hko')
  const children: any[] = []

  children.push(...anleitungsSeite(
    `${w.knTitel} — Vorlage`,
    `Die Prüfungsaufgabe und ihr Raster in einem Dokument. Das Raster hat zwei Dimensionen: ${w.knSuk} und ${w.knGes} werden getrennt gezählt und ergeben zwei Noten, die nie zu einer verschmolzen werden.`,
    [
      'Format wählen — es bestimmt, was überhaupt beobachtbar ist.',
      'Aufgabe schreiben: idealerweise eine NEUE Situation, nicht die geübte. Geprüft wird der Transfer.',
      `Kriterien aus den Gelingensmerkmalen ${w.hfGenitiv} ableiten — nicht neu erfinden.`,
      'Drei bis fünf Kriterien pro Dimension. Mehr macht die Bewertung nicht genauer, nur länger.',
      'Jedes Kriterium beobachtbar formulieren: Was genau sehen oder hören Sie?',
      'Das Raster den Lernenden vorher zeigen — es ist kein Geheimnis, sondern der Massstab.',
    ],
    false,
  ))

  // Seite 2 — Aufgabe
  children.push(pageBreak())
  children.push(...verortungsBlock(k, w))
  children.push(...sectionHead('01', w.knAufgabe, AKZENT))
  children.push(...feldLabel(w.knFormat))
  children.push(ankreuz(['Fachgespräch', 'Mini Case schriftlich', 'Werkschau + Transfer']))
  children.push(ankreuz(['anderes: ______________________________']))
  children.push(...feld('Titel', 10))
  children.push(...feld('Ausgangslage (neue Situation)', 40, 'Nicht die geübte Situation wiederholen — geprüft wird, ob das Gelernte auf Neues übertragen wird.'))
  children.push(...feld('Auftrag an die Lernenden', 30))
  children.push(...feld('Rahmen (Zeit · Hilfsmittel · Sozialform)', 12))

  // Seite 3 — Raster
  children.push(pageBreak())
  children.push(...sectionHead('02', w.knRaster, AKZENT))
  children.push(lpHinweis(w.knRasterHinweis))
  children.push(...rasterBlock(w.knSuk, 3))
  children.push(...rasterBlock(w.knGes, 3))

  // Seite 4 — Rückmeldung
  children.push(pageBreak())
  children.push(...sectionHead('03', 'Rückmeldung', AKZENT))
  children.push(...feld('Das ist gelungen', 30))
  children.push(...feld('Daran weiterarbeiten', 30))
  children.push(spacer(120))
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [
        tcell(p(`Note ${w.knSuk}: ________`, { run: { size: 20, bold: true } }), { width: { size: 50, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: LIGHT } }),
        tcell(p(`Note ${w.knGes}: ________`, { run: { size: 20, bold: true } }), { width: { size: 50, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: LIGHT } }),
      ],
    })],
  }))
  children.push(p('Zwei Noten, getrennt ausgewiesen — nie zu einer Gesamtnote verrechnet.', { run: { italics: true, color: COLOR.inkMute, size: 15 }, spacing: { before: 60 } }))

  children.push(...taxonomieSeite(k, w))

  return doc(w.knCode + (k.code ? ` · ${k.code}` : ''), `${w.knTitel} — Vorlage`, o, children)
}

// --------------------------------------------------- 3 · Begleitdokument LP

function ablaufTabelle(zeilen: number): Table {
  const kopf = ['PHASE', 'WAS GESCHIEHT', 'SOZIALFORM', 'ZEIT', 'MATERIAL']
  const breiten = [16, 40, 16, 10, 18]
  const rows = [new TableRow({
    tableHeader: true,
    children: kopf.map((label, i) => tcell(
      p(label, { run: { size: 12, bold: true, color: AKZENT } }),
      { width: { size: breiten[i], type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: LIGHT } },
    )),
  })]
  for (let r = 0; r < zeilen; r++) {
    rows.push(new TableRow({
      children: breiten.map((bw) => tcell(
        p('', { run: { size: 17 }, spacing: { before: 120, after: 120 } }),
        { width: { size: bw, type: WidthType.PERCENTAGE } },
      )),
    }))
  }
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows })
}

export function buildBegleiterVorlage(o: BuildVorlageOpts = {}): Document {
  const k = o.kontext || LEERER_KONTEXT
  const w = wortschatz(o.terminologie || 'hko')
  const children: any[] = []

  children.push(...anleitungsSeite(
    `${w.begleiterTitel} — Vorlage`,
    'Das Dokument, das neben Ihnen liegt, während die Klasse arbeitet — und das Sie nach der Lektion um das ergänzen, was Sie beim nächsten Mal anders machen. Es geht nie an die Lernenden.',
    [
      'Steckbrief zuerst: Wer, wie lange, was ist die Voraussetzung.',
      'Ablauf nur so fein planen, wie Sie es tatsächlich brauchen.',
      'Stolpersteine sind der wertvollste Teil — dort verliert man im Unterricht die Zeit.',
      'Differenzierung in beide Richtungen: nach unten UND nach oben.',
      'Die letzte Seite erst nach dem Unterricht ausfüllen, solange es frisch ist.',
    ],
    false,
  ))

  // Seite 2 — Steckbrief
  children.push(pageBreak())
  children.push(...verortungsBlock(k, w))
  children.push(...sectionHead('01', 'Steckbrief', AKZENT))
  children.push(...feld('Titel', 10))
  children.push(...feldLabel(w.versprechen, w.versprechenHint))
  if (k.kompetenzversprechen) {
    children.push(callout('Vorschlag aus dem Lehrplan', k.kompetenzversprechen, AKZENT, LIGHT))
  }
  children.push(...schreibfeld(14))
  children.push(...feld('Klasse / Lehrgang · Anzahl Lektionen', 10))
  children.push(...feld('Was die Lernenden schon können müssen', 16))
  children.push(...feld('Material, das bereitliegen muss', 16))

  // Seite 3 — Ablauf
  children.push(pageBreak())
  children.push(...sectionHead('02', 'Ablauf', AKZENT))
  children.push(lpHinweis('Zeilen ergänzen oder löschen: in Word mit Tab am Zeilenende eine neue Zeile anfügen.'))
  children.push(ablaufTabelle(9))

  // Seite 4 — Stolpersteine & Differenzierung
  children.push(pageBreak())
  children.push(...sectionHead('03', 'Stolpersteine & Differenzierung', AKZENT))
  children.push(...feld('Wo es erfahrungsgemäss hakt — und was dann hilft', 50))
  children.push(...feld('Für Lernende, die mehr Unterstützung brauchen', 30))
  children.push(...feld('Für Lernende, die schneller fertig sind', 30))

  // Seite 5 — nach dem Unterricht
  children.push(pageBreak())
  children.push(...sectionHead('04', 'Nach dem Unterricht', AKZENT))
  children.push(...feld('Das hat funktioniert', 35))
  children.push(...feld('Das würde ich ändern', 35))
  children.push(...feld('Zeitbedarf tatsächlich', 10))
  children.push(spacer(100))
  children.push(callout(
    'Und jetzt weitergeben',
    'Material, das im Unterricht bestanden hat, gehört nicht in Ihren Ordner allein. Auf bbw-hko.ch unter «Material einreichen» hochladen — dieses Begleitdokument können Sie als Zusatzmaterial gleich mitgeben.',
    AKZENT, LIGHT,
  ))

  children.push(...taxonomieSeite(k, w))

  return doc(w.begleiterCode + (k.code ? ` · ${k.code}` : ''), `${w.begleiterTitel} — Vorlage`, o, children)
}

// ------------------------------------------------------------ 4 · Blanko

/**
 * Das leere Blatt. Kein Formular, sondern ein *Gerüst*: Kopf mit Logo,
 * Fusszeile mit Seitenzahl, die BBW-Formatvorlagen im Katalog und die
 * Abschnittsüberschriften der Plattform — darunter je eine Platzhalterzeile.
 *
 * Bewusst ohne Anleitungsseite, ohne Schreiblinien, ohne Ankreuzkästchen: wer
 * diese Vorlage wählt, will selber schreiben und nicht ausfüllen. Die einzige
 * Zeile, die nicht Inhalt ist, ist die Stil-Legende unter dem Titel — sie ist
 * als solche beschriftet und in einem Zug gelöscht.
 */
export function buildBlankoVorlage(o: BuildVorlageOpts = {}): Document {
  const k = o.kontext || LEERER_KONTEXT
  const w = wortschatz(o.terminologie || 'hko')
  const children: any[] = []

  children.push(new Paragraph({
    heading: HeadingLevel.TITLE,
    children: [new TextRun('Titel des Materials')],
  }))
  children.push(...verortungsBlock(k, w))
  children.push(new Paragraph({
    style: 'BBWHinweis',
    children: [new TextRun(`Formatvorlagen in diesem Dokument: ${STIL_LEGENDE}. In Word über den Formatvorlagen-Katalog anwenden. Diese Zeile darf weg.`)],
  }))

  // Die Abschnitte der Plattform-Dokumente als Überschriften — in dem
  // Wortschatz, den die Lehrperson oben gewählt hat.
  const abschnitte = [w.situation, w.auftrag, w.leitfragen, w.produkt, w.selbstcheck]
  abschnitte.forEach((titel) => {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(titel)] }))
    children.push(new Paragraph({ children: [new TextRun('')] }))
  })

  // Zweite Seite: zeigt, dass Kopf und Fusszeile mitlaufen und die Seitenzahl
  // stimmt — und gibt gleich Platz für den zweiten Teil.
  children.push(pageBreak())
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Weiterer Abschnitt')] }))
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Unterabschnitt')] }))
  children.push(new Paragraph({ children: [new TextRun('')] }))

  return doc(
    'BLANKO · VORLAGE' + (k.code ? ` · ${k.code}` : ''),
    'Blanko-Vorlage',
    o,
    children,
    true,
  )
}

// ------------------------------------------------------------------ Dispatch

export function buildVorlage(typ: VorlagenTyp, o: BuildVorlageOpts = {}): Document {
  switch (typ) {
    case 'kompetenznachweis': return buildKompetenznachweisVorlage(o)
    case 'begleiter':         return buildBegleiterVorlage(o)
    case 'blanko':            return buildBlankoVorlage(o)
    default:                  return buildHerausforderungVorlage(o)
  }
}
