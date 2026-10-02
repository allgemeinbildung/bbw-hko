// docx-heft-v42-1-4.ts — Heft v4.2 (Word), Seiten 1–4: Herausforderung ·
// Wissensecke I · Quelle · Wissensecke II. Spiegel von heft-v42/seiten-1-4.tsx:
// dieselbe Reihenfolge, derselbe Inhalt. Wer dort etwas ändert, ändert hier mit.
//
// Importiert nur aus docx-primitives.ts und docx-heft-v42-gemeinsam.ts, nie aus
// docx-builder.ts (zirkulär). Die Scaffold-Spalte ist darum hier nachgebaut statt
// railZelle() zu benutzen — sie steht ohnehin in 9 pt statt 7.5 pt (Rahmentexte im Heft).
//
// Nie gedruckt: `loesung`, `erwartungshorizont`, `prinzip_handoff`, `sk_anker`,
// `archiv_ref`, `lizenz_hinweis`, `sachlage_geprueft`, `ersatz`, `quellen_anker[].fuer_leitfrage`.

import {
  Paragraph, TextRun, Table, TableRow, ImageRun,
  AlignmentType, BorderStyle, ShadingType, WidthType, HeightRule, LineRuleType,
} from 'docx'
import type { KastenS4, Leitfrage, Quelle, SituationJson } from './types'
import { COLOR, MM, p, h, spacer, tcell, schreibfeld } from './docx-primitives'
import { seitenKopfDocx, kastenDocx, type HeftDocxKontext } from './docx-heft-v42-gemeinsam'
import { landingUrl, qrPng } from './qr'

type Block = Paragraph | Table

// ── Kleine Helfer (doppelt in seiten-1-4.tsx — die React-Seite darf kein docx ziehen) ──

/** Ordnername der Einheit aus der Heft-ID: `1.3.1_konsum_verantworten_v42_hf_A` → `1.3.1_konsum_verantworten_v42`. */
function einheitOrdner(sit: SituationJson): string {
  return (sit.id || '').replace(/_hf_[A-Za-z]$/, '')
}

/** QR-Inhalt der Medien-Spur: Landing-Seite der Einheit mit Anker des Hefts (ENTSCHEIDE E5). */
function qrInhalt(sit: SituationJson): string {
  return landingUrl(einheitOrdner(sit), sit.buchstabe)
}

function kurzadresse(url: string): string {
  return url.replace(/^https?:\/\//, '')
}

const TYP_ETIKETT: Record<string, string> = {
  artikel: 'Artikel', grafik: 'Grafik', video: 'Video', audio: 'Audio', rechtstext: 'Rechtstext', webseite: 'Webseite',
}

function typEtikett(q: Quelle): string {
  return TYP_ETIKETT[q.typ] || q.typ
}

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

function datumCh(d?: string): string {
  if (!d) return ''
  const tag = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d)
  if (tag) return `${tag[3]}.${tag[2]}.${tag[1]}`
  const monat = /^(\d{4})-(\d{2})$/.exec(d)
  if (monat) return `${MONATE[Number(monat[2]) - 1] ?? monat[2]} ${monat[1]}`
  return d
}

function laenge(q: Quelle): string {
  if (q.dauer_sek) return `${Math.floor(q.dauer_sek / 60)}:${String(q.dauer_sek % 60).padStart(2, '0')} min`
  if (q.woerter) return `${q.woerter} Wörter`
  return ''
}

/** Zeile «Länge» der Quellenkarte; bei einer Grafik der Umfang (wie laengeZeile() im HTML). */
function laengeZeile(q: Quelle): { etikett: string; wert: string } {
  if (q.typ === 'grafik') return { etikett: 'Umfang', wert: `1 Seite${q.woerter ? `, rund ${q.woerter} Wörter Text` : ''}` }
  return { etikett: 'Länge', wert: laenge(q) }
}

function verortung(q: Quelle): string {
  const v = q.verortung
  if (!v) return ''
  if (v.absaetze) return v.absaetze
  return v.von && v.bis ? `${v.von}–${v.bis}` : ''
}

function herausgeberDatum(q: Quelle): string {
  return [q.herausgeber, datumCh(q.datum)].filter(Boolean).join(', ')
}

function pflichtQuelle(sit: SituationJson): Quelle | undefined {
  return sit.spur === 'mit_medien' ? sit.quellen?.find((q) => q.rolle === 'pflicht') : undefined
}

function leitfrage(sit: SituationJson, nr: number): Leitfrage | undefined {
  return sit.leitfragen?.find((l) => l.nr === nr)
}

function kompetenzen(sit: SituationJson): { nr: string; text: string }[] {
  const resolved = sit.nrlp?.kompetenzen?.filter((k) => k && k.text)
  if (resolved && resolved.length) return resolved
  return sit.nrlp?.kompetenz_text ? [{ nr: sit.nrlp?.nr || '', text: sit.nrlp.kompetenz_text }] : []
}

function inGuillemets(s: string): string {
  return /^«.*»$/.test(s.trim()) ? s.trim() : `«${s.trim()}»`
}

function ankerZu(sit: SituationJson, knotenRef?: string) {
  if (!knotenRef) return undefined
  return sit.quellen_anker?.find((a) => a.ref && knotenRef.startsWith(a.ref))
}

// ── Bausteine ──────────────────────────────────────────────────────────────

const NIL = { style: BorderStyle.NIL, size: 0 }
const OHNE_RAND = { top: NIL, bottom: NIL, left: NIL, right: NIL }
const linie = (color: string, size = 4, style: any = BorderStyle.SINGLE) => ({ style, size, color })

/** Beschriftung in Versalien — Gegenstück zu `.v42-mini`. */
function mini(text: string, ctx: HeftDocxKontext, after = 30): Paragraph {
  return p(text.toUpperCase(), { run: { color: ctx.akzent, bold: true, size: 14, font: 'Consolas' }, spacing: { before: 0, after }, keepNext: true })
}

/** Leerer Schlussabsatz: Word verlangt, dass eine Tabellenzelle mit einem Absatz endet. */
function schluss(): Paragraph {
  return new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 120, lineRule: LineRuleType.EXACT } })
}

function qrBild(url: string, mm: number): ImageRun {
  const px = Math.round((mm / 25.4) * 96)
  return new ImageRun({ data: qrPng(url), transformation: { width: px, height: px }, type: 'png' } as any)
}

function scaffoldZelle(sc: Leitfrage['scaffolding'], ctx: HeftDocxKontext) {
  const strategien = sc?.strategien?.filter(Boolean) ?? []
  const satzanfaenge = sc?.satzanfaenge?.filter(Boolean) ?? []
  const produkt = sc?.produkt?.trim() ?? ''
  if (!strategien.length && !satzanfaenge.length && !produkt) return null
  const els: Paragraph[] = []
  const lauf = { size: 18, color: COLOR.inkSoft }
  if (strategien.length) {
    els.push(mini('So gehen Sie vor', ctx))
    strategien.forEach((s) => els.push(new Paragraph({ children: [new TextRun({ text: s, ...lauf })], bullet: { level: 0 }, spacing: { after: 30 } })))
  }
  if (satzanfaenge.length) {
    els.push(new Paragraph({ children: [], spacing: { after: 40 } }))
    els.push(mini('Satzanfänge', ctx))
    satzanfaenge.forEach((s) => els.push(p(inGuillemets(s), { run: { ...lauf, italics: true }, spacing: { after: 30 } })))
  }
  if (produkt) {
    els.push(new Paragraph({ children: [], spacing: { after: 40 } }))
    els.push(mini('Ins Produkt', ctx))
    els.push(p(produkt, { run: lauf, spacing: { after: 0 } }))
  }
  return tcell(els, {
    width: { size: 28, type: WidthType.PERCENTAGE },
    verticalAlign: 'top',
    margins: { top: 0, bottom: 0, left: 160, right: 0 },
    borders: { ...OHNE_RAND, left: linie(COLOR.rule, 6) },
  })
}

/** Leitfrage: Frage, Meta-Zeile, optional Blöcke vor dem Feld, Schreibfeld; rechts die Scaffold-Spalte. */
function lfBlock(lf: Leitfrage, ctx: HeftDocxKontext, hoeheMm: number, vorFeld: Block[] = []): Block[] {
  const meta: TextRun[] = []
  if (lf.bloom) meta.push(new TextRun({ text: `[${lf.bloom}]`, color: ctx.akzent, bold: true, size: 14 }))
  if (lf.knoten_ref) meta.push(new TextRun({ text: `  ${lf.knoten_ref}`, color: COLOR.inkMute, size: 15, font: 'Consolas' }))
  if (lf.liefert) meta.push(new TextRun({ text: `   → liefert: ${lf.liefert}`, color: COLOR.inkSoft, size: 18, italics: true }))
  const haupt: Block[] = [
    new Paragraph({
      children: [
        new TextRun({ text: `LF${lf.nr}  `, bold: true, color: ctx.akzent, size: 20, font: 'Consolas' }),
        new TextRun({ text: lf.text, size: 20, bold: true }),
      ],
      spacing: { before: 0, after: 40, line: 300, lineRule: LineRuleType.AUTO },
      keepNext: true,
    }),
    new Paragraph({ children: meta, spacing: { after: 60 }, keepNext: true }),
    ...vorFeld,
    ...schreibfeld(hoeheMm),
  ]
  const rechts = scaffoldZelle(lf.scaffolding, ctx)
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({
        cantSplit: true,
        children: [
          tcell(haupt, {
            width: { size: rechts ? 72 : 100, type: WidthType.PERCENTAGE },
            verticalAlign: 'top',
            margins: { top: 0, bottom: 0, left: 0, right: 160 },
            borders: OHNE_RAND,
          }),
          ...(rechts ? [rechts] : []),
        ],
      })],
    }),
    spacer(60),
  ]
}

/**
 * Tabelle zum Ausfüllen (Raster S. 3, Denkhilfe S. 4) mit Zeilen in Schreibhöhe.
 * Beispielzeile gestrichelt und kursiv mit Etikett — wie im HTML, ohne Farbe lesbar.
 */
function ausfuellTabelle(spalten: string[], leer: number, zeileMm: number, ctx: HeftDocxKontext, beispiel?: string[]): Table {
  const rand = linie(COLOR.inkSoft, 6)
  const breite = Math.floor(100 / spalten.length)
  const kopf = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: spalten.map((s) => tcell(p(s, { run: { bold: true, size: 18 }, spacing: { after: 0 } }), {
      width: { size: breite, type: WidthType.PERCENTAGE },
      verticalAlign: 'bottom',
      borders: { top: rand, left: rand, right: rand, bottom: linie(ctx.akzent, 12) },
    })),
  })
  const hoehe = { value: Math.round(zeileMm * MM), rule: HeightRule.ATLEAST }
  const zeilen: TableRow[] = []
  if (beispiel) {
    const strich = linie(COLOR.inkSoft, 6, BorderStyle.DASHED)
    zeilen.push(new TableRow({
      height: hoehe,
      cantSplit: true,
      children: spalten.map((_, c) => tcell([
        ...(c === 0 ? [p('BEISPIEL', { run: { color: ctx.akzent, bold: true, size: 13, font: 'Consolas' }, spacing: { after: 0 } })] : []),
        p(beispiel[c] ?? '', { run: { italics: true, size: 18, color: COLOR.inkSoft }, spacing: { after: 0 } }),
      ], {
        width: { size: breite, type: WidthType.PERCENTAGE },
        borders: { top: strich, bottom: strich, left: strich, right: strich },
      })),
    }))
  }
  for (let r = 0; r < Math.max(0, leer); r++) {
    zeilen.push(new TableRow({
      height: hoehe,
      cantSplit: true,
      children: spalten.map(() => tcell(p(''), {
        width: { size: breite, type: WidthType.PERCENTAGE },
        borders: { top: rand, bottom: rand, left: rand, right: rand },
      })),
    }))
  }
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [kopf, ...zeilen] })
}

/** Zwei Zellen nebeneinander ohne Rahmen. */
function zweiSpalten(links: Block[], rechts: Block[], linksProzent: number, rechtsOpts: { verticalAlign?: any } = {}): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      cantSplit: true,
      children: [
        tcell([...links, ...(links[links.length - 1] instanceof Table ? [schluss()] : [])], {
          width: { size: linksProzent, type: WidthType.PERCENTAGE },
          verticalAlign: 'top',
          margins: { top: 0, bottom: 0, left: 0, right: 140 },
          borders: OHNE_RAND,
        }),
        tcell([...rechts, ...(rechts[rechts.length - 1] instanceof Table ? [schluss()] : [])], {
          width: { size: 100 - linksProzent, type: WidthType.PERCENTAGE },
          verticalAlign: rechtsOpts.verticalAlign ?? 'top',
          margins: { top: 0, bottom: 0, left: 140, right: 0 },
          borders: OHNE_RAND,
        }),
      ],
    })],
  })
}

/** Kasten mit Schlussabsatz, falls der Inhalt mit einer Tabelle endet. */
function kasten(label: string | null, inhalt: Block[], ctx: HeftDocxKontext): Table {
  const letzt = inhalt[inhalt.length - 1]
  return kastenDocx(label, letzt instanceof Table ? [...inhalt, schluss()] : inhalt, ctx)
}

// ── Seite 1 · Herausforderung ──────────────────────────────────────────────

export function seite1Docx(ctx: HeftDocxKontext): Block[] {
  const { sit } = ctx
  const pflicht = pflichtQuelle(sit)
  const els: Block[] = [...seitenKopfDocx(1, 'Herausforderung', ctx)]

  els.push(h(sit.titel || '', 'title'))

  // Kopf: zwei Zeilen mit Beschriftung links — Persona, dann Kompetenz(en).
  const pers = sit.persona
  const komp = kompetenzen(sit)
  // Trennlinie unter dem Kopf: Unterkante der Zellen der letzten Zeile.
  const kopfRand = (letzte: boolean) => (letzte ? { ...OHNE_RAND, bottom: linie(COLOR.rule) } : OHNE_RAND)
  const labelZelle = (text: string, letzte: boolean) => tcell(mini(text, ctx, 0), {
    width: { size: 16, type: WidthType.PERCENTAGE },
    margins: { top: 20, bottom: letzte ? 80 : 20, left: 0, right: 100 },
    borders: kopfRand(letzte),
  })
  const textZelle = (inhalt: Paragraph[], letzte: boolean) => tcell(inhalt, {
    width: { size: 84, type: WidthType.PERCENTAGE },
    margins: { top: 20, bottom: letzte ? 80 : 20, left: 0, right: 0 },
    borders: kopfRand(letzte),
  })
  const kopfZeilen = [new TableRow({
    children: [
      labelZelle('Persona', !komp.length),
      textZelle([new Paragraph({
        children: [
          new TextRun({ text: pers?.beruf || '', bold: true, size: 19 }),
          ...((pers?.betrieb || pers?.ort) ? [new TextRun({ text: ` · ${[pers?.betrieb, pers?.ort].filter(Boolean).join(', ')}`, size: 19, color: COLOR.inkSoft })] : []),
        ],
        spacing: { after: 0 },
      })], !komp.length),
    ],
  })]
  if (komp.length) {
    kopfZeilen.push(new TableRow({
      children: [
        labelZelle(komp.length > 1 ? 'Kompetenzen' : 'Kompetenz', true),
        textZelle(komp.map((k) => new Paragraph({
          children: [
            ...(k.nr ? [new TextRun({ text: `${k.nr} `, bold: true, color: ctx.akzent, size: 18 })] : []),
            new TextRun({ text: k.text, size: 18 }),
          ],
          spacing: { after: 20 },
        })), true),
      ],
    }))
  }
  els.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: kopfZeilen,
  }))
  els.push(spacer(40))

  // Situation + Zahlen (zwei Paare pro Zeile, wie im HTML)
  els.push(p(sit.situation_text || '', { run: { size: 20 }, spacing: { after: 100, line: 290, lineRule: LineRuleType.AUTO } }))
  const zahlen = sit.zahlen_tabelle ?? []
  if (zahlen.length) {
    const zRand = (i: number) => ({ ...OHNE_RAND, bottom: linie(COLOR.rule), ...(i === 0 ? { top: linie(COLOR.rule) } : {}) })
    const zeilen: TableRow[] = []
    for (let i = 0; i < zahlen.length; i += 2) {
      const paar = zahlen.slice(i, i + 2)
      zeilen.push(new TableRow({
        children: [0, 1].flatMap((j) => {
          const z = paar[j]
          return [
            tcell(p(z?.label ?? '', { run: { size: 18 }, spacing: { after: 0 } }), {
              width: { size: 37, type: WidthType.PERCENTAGE },
              margins: { top: 30, bottom: 30, left: 0, right: 80 },
              borders: z ? zRand(i) : OHNE_RAND,
            }),
            tcell(p(z?.wert ?? '', { run: { size: 18, font: 'Consolas' }, alignment: AlignmentType.RIGHT, spacing: { after: 0 } }), {
              width: { size: 13, type: WidthType.PERCENTAGE },
              margins: { top: 30, bottom: 30, left: 80, right: j === 0 ? 240 : 0 },
              borders: z ? zRand(i) : OHNE_RAND,
            }),
          ]
        }),
      }))
    }
    els.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: zeilen }))
  }
  els.push(spacer(60))

  // Leitfrage | Spannungsfeld
  const md = sit.mehrdeutigkeit
  els.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      cantSplit: true,
      children: [
        tcell([
          mini('Leitfrage', ctx),
          p(sit.leitfrage || '', { run: { size: 21, bold: true }, spacing: { after: 0 } }),
        ], {
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: ctx.light },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          borders: { ...OHNE_RAND, left: linie(ctx.akzent, 24) },
        }),
        tcell(md?.trade_off ? [
          mini('Spannungsfeld', ctx),
          p(md.trade_off, { run: { size: 20, bold: true }, spacing: { after: 40 } }),
          ...(md.hint ? [p(md.hint, { run: { size: 18, color: COLOR.inkSoft }, spacing: { after: 0 } })] : []),
        ] : [p('')], {
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          borders: md?.trade_off
            ? { top: linie(ctx.akzent, 6, BorderStyle.DASHED), bottom: linie(ctx.akzent, 6, BorderStyle.DASHED), left: linie(ctx.akzent, 6, BorderStyle.DASHED), right: linie(ctx.akzent, 6, BorderStyle.DASHED) }
            : OHNE_RAND,
        }),
      ],
    })],
  }))
  els.push(spacer(60))

  // Lehrmittel-Ressourcen — ohne `fuer_leitfrage` (stimmt nicht in beiden Spuren).
  if (sit.quellen_anker?.length) {
    els.push(mini('Im Lehrmittel', ctx))
    sit.quellen_anker.forEach((a) => els.push(new Paragraph({
      children: [
        new TextRun({ text: a.titel || '', bold: true, size: 18 }),
        new TextRun({ text: [a.unterueberschrift, a.ref, a.seiten].filter(Boolean).map((t) => ` · ${t}`).join(''), size: 18, color: COLOR.inkSoft }),
      ],
      bullet: { level: 0 },
      spacing: { after: 20 },
    })))
    els.push(spacer(40))
  }

  // Nur Medien-Spur: Kurzeintrag der Pflichtquelle mit QR (PNG) und Kurzadresse.
  if (pflicht) {
    const url = qrInhalt(sit)
    els.push(kasten(`Pflichtquelle für Seite 3 · ${typEtikett(pflicht)}`, [zweiSpalten(
      [
        p([
          new TextRun({ text: pflicht.titel, bold: true, size: 20 }),
          new TextRun({ text: ` · ${herausgeberDatum(pflicht)}`, size: 20 }),
        ], { spacing: { after: 60 } }),
        p('Scannen Sie den Code oder tippen Sie die Adresse ein — dort finden Sie den Link zur Quelle. Bearbeitet wird sie auf Seite 3.', { run: { size: 18, color: COLOR.inkSoft }, spacing: { after: 0 } }),
      ],
      [
        new Paragraph({ children: [qrBild(url, 25)], alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
        // Umbruch nach «/m/» wie im HTML, damit die Adresse nicht mitten im Wort bricht.
        ...kurzadresse(url).replace('/m/', '/m/|').split('|').map((teil) =>
          p(teil,{ run: { size: 16, font: 'Consolas' }, alignment: AlignmentType.CENTER, spacing: { after: 0 } })),
      ],
      62, { verticalAlign: 'center' },
    )], ctx))
    els.push(spacer(40))
  }

  // Wochenplan
  if (sit.wochen_plan?.length) {
    els.push(mini('Ihre Woche', ctx))
    els.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: sit.wochen_plan.map((w, i) => new TableRow({
        children: [
          tcell(p(w.label, { run: { size: 17, font: 'Consolas', color: COLOR.inkSoft }, spacing: { after: 0 } }), {
            width: { size: 26, type: WidthType.PERCENTAGE },
            margins: { top: 40, bottom: 40, left: 0, right: 100 },
            borders: { ...OHNE_RAND, bottom: linie(COLOR.rule), ...(i === 0 ? { top: linie(COLOR.rule) } : {}) },
          }),
          tcell(p(w.text, { run: { size: 19 }, spacing: { after: 0 } }), {
            width: { size: 74, type: WidthType.PERCENTAGE },
            margins: { top: 40, bottom: 40, left: 0, right: 0 },
            borders: { ...OHNE_RAND, bottom: linie(COLOR.rule), ...(i === 0 ? { top: linie(COLOR.rule) } : {}) },
          }),
        ],
      })),
    }))
    els.push(spacer(60))
  }

  // Arbeitsanweisung
  els.push(new Paragraph({
    children: [
      new TextRun({ text: 'So starten Sie: ', bold: true, size: 19 }),
      new TextRun({ text: 'Lesen Sie die Situation genau. Markieren Sie, was Sie noch nicht wissen oder können — am Ende des Hefts prüfen Sie es im Quer-Check (S. 8).', size: 19 }),
    ],
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: COLOR.ink, space: 4 } },
    spacing: { before: 120, after: 0 },
  }))
  return els
}

// ── Seite 2 · Wissensecke I ───────────────────────────────────────────────

export function seite2Docx(ctx: HeftDocxKontext): Block[] {
  const { sit } = ctx
  const els: Block[] = [...seitenKopfDocx(2, 'Wissensecke I', ctx)]
  if (sit.leitfragen_intro) {
    els.push(mini('Ihr Weg durch die Leitfragen', ctx))
    els.push(p(sit.leitfragen_intro, { run: { size: 19, color: COLOR.inkSoft }, spacing: { after: 160 } }))
  }
  for (const nr of [1, 2]) {
    const lf = leitfrage(sit, nr)
    if (lf) els.push(...lfBlock(lf, ctx, lf.feld_hoehe_mm || (nr === 1 ? 35 : 45)))
  }
  return els
}

// ── Seite 3 · Quelle ───────────────────────────────────────────────────────

export function seite3Docx(ctx: HeftDocxKontext): Block[] {
  const { sit } = ctx
  const els: Block[] = [...seitenKopfDocx(3, 'Quelle', ctx)]
  const lf = sit.leitfragen?.find((l) => l.antwortform === 'raster') ?? leitfrage(sit, 3)
  const raster = lf?.raster
  const pflicht = pflichtQuelle(sit)
  const auftrag = pflicht ? pflicht.auftrag : raster?.auftrag
  const beispiel = pflicht ? undefined : raster?.beispielzeile

  if (pflicht) {
    const ort = verortung(pflicht)
    const { etikett, wert: lang } = laengeZeile(pflicht)
    const meta: TextRun[] = []
    if (ort) meta.push(new TextRun({ text: 'Ausschnitt: ', bold: true, size: 18 }), new TextRun({ text: ort, size: 18, color: COLOR.inkSoft }))
    if (ort && lang) meta.push(new TextRun({ text: ' · ', size: 18, color: COLOR.inkSoft }))
    if (lang) meta.push(new TextRun({ text: `${etikett}: `, bold: true, size: 18 }), new TextRun({ text: lang, size: 18, color: COLOR.inkSoft }))
    els.push(kasten(`Pflichtquelle · ${typEtikett(pflicht)}`, [zweiSpalten(
      [
        p(pflicht.titel, { run: { bold: true, size: 21 }, spacing: { after: 20 } }),
        p(herausgeberDatum(pflicht), { run: { size: 18, color: COLOR.inkSoft }, spacing: { after: 60 } }),
        p(pflicht.kurzbeschrieb, { run: { size: 19 }, spacing: { after: 60 } }),
        new Paragraph({ children: meta, spacing: { after: 0 } }),
      ],
      [
        new Paragraph({ children: [qrBild(qrInhalt(sit), 17)], alignment: AlignmentType.CENTER, spacing: { after: 20 } }),
        p('Gleicher Code wie auf S. 1', { run: { size: 14, color: COLOR.inkMute }, alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
      ],
      84,
    )], ctx))
    els.push(spacer(60))
  } else if (raster?.knoten_ref) {
    const anker = ankerZu(sit, raster.knoten_ref)
    els.push(kasten('Lehrmittel-Abschnitt', [
      p(raster.knoten_ref.replace(/\s*\|\s*/g, ' · '), { run: { bold: true, size: 21 }, spacing: { after: anker ? 20 : 0 } }),
      ...(anker ? [p([anker.titel, anker.unterueberschrift].filter(Boolean).join(' · '), { run: { size: 18, color: COLOR.inkSoft }, spacing: { after: 0 } })] : []),
    ], ctx))
    els.push(spacer(60))
  }

  const spalten = raster?.spalten ?? []
  if (auftrag) {
    els.push(mini('Auftrag', ctx))
    els.push(p(auftrag, { run: { size: 20 }, spacing: { after: spalten.length ? 40 : 120 } }))
    // Verweis auf die Methodenkarte (S. 6) — Rahmenschrift wie der Verweis auf S. 5.
    if (spalten.length) els.push(p('→ Hilfe: Methodenkarte zum Raster auf S. 6', { run: { italics: true, size: 18, color: COLOR.inkSoft }, spacing: { after: 120 } }))
  }

  if (spalten.length) {
    els.push(mini(`Raster${beispiel ? ' · die erste Zeile ist ein Beispiel' : ''}`, ctx))
    els.push(ausfuellTabelle(spalten, (raster?.zeilen ?? 4) - (beispiel ? 1 : 0), 13, ctx, beispiel))
    els.push(spacer(80))
  }

  if (lf) els.push(...lfBlock(lf, ctx, 25))
  return els
}

// ── Seite 4 · Wissensecke II ──────────────────────────────────────────────

function denkhilfeDocx(k: KastenS4, ctx: HeftDocxKontext): Block[] {
  const spalten = k.spalten?.filter(Boolean) ?? []
  return [
    kasten(k.titel, [
      ...(spalten.length ? [ausfuellTabelle(spalten, 3, 11, ctx)] : []),
      ...(k.hinweis ? [p(k.hinweis, { run: { size: 18, color: COLOR.inkSoft }, spacing: { before: 60, after: 0 } })] : []),
    ], ctx),
    spacer(40),
  ]
}

function vertiefungKarte(q: Quelle, ctx: HeftDocxKontext): Block[] {
  const lang = laenge(q)
  return [
    p(`${typEtikett(q)}${lang ? ` · ${lang}` : ''}`.toUpperCase(), { run: { bold: true, size: 14, font: 'Consolas', color: COLOR.inkSoft }, spacing: { after: 20 } }),
    p(q.titel, { run: { bold: true, size: 20 }, spacing: { after: 20 } }),
    p(herausgeberDatum(q), { run: { size: 18, color: COLOR.inkSoft }, spacing: { after: 60 } }),
    ...(q.leitfrage_vertiefung ? [p(q.leitfrage_vertiefung, { run: { size: 19, italics: true }, spacing: { after: 0 } })] : []),
  ]
}

function vertiefungDocx(k: KastenS4, ctx: HeftDocxKontext): Block[] {
  const quellen = ctx.sit.quellen?.filter((q) => q.rolle === 'vertiefung').slice(0, 2) ?? []
  if (!quellen.length) return []
  const rand = linie(COLOR.inkSoft, 6)
  const karten = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      cantSplit: true,
      children: quellen.map((q) => tcell(vertiefungKarte(q, ctx), {
        width: { size: Math.floor(100 / quellen.length), type: WidthType.PERCENTAGE },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        borders: { top: rand, bottom: rand, left: rand, right: rand },
      })),
    })],
  })
  return [kasten(k.titel, [
    karten,
    p(k.hinweis || 'Die Links zu beiden Quellen stehen auf der QR-Seite (Code auf Seite 1).', { run: { size: 18, color: COLOR.inkSoft }, spacing: { before: 80, after: 0 } }),
  ], ctx)]
}

export function seite4Docx(ctx: HeftDocxKontext): Block[] {
  const { sit } = ctx
  const els: Block[] = [...seitenKopfDocx(4, 'Wissensecke II', ctx)]
  const lf = sit.leitfragen?.find((l) => !!l.pol_typ) ?? leitfrage(sit, 4)
  const k = sit.kasten_s4
  if (lf) {
    const hoehe = lf.feld_hoehe_mm || (sit.spur === 'mit_medien' ? 60 : 45)
    // Denkhilfe VOR dem Schreibfeld: erst füllen, dann schreiben.
    els.push(...lfBlock(lf, ctx, hoehe, k?.typ === 'denkhilfe' ? denkhilfeDocx(k, ctx) : []))
  }
  // Vertiefung NACH dem Schreibfeld — freiwillig.
  if (k?.typ === 'vertiefung') els.push(...vertiefungDocx(k, ctx))
  return els
}
