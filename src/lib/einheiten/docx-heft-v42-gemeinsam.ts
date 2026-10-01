// docx-heft-v42-gemeinsam.ts — Heft v4.2 (Word): Kontext und Helfer, die alle
// acht Seiten teilen. Spiegel von src/components/einheiten/docs/heft-v42/gemeinsam.tsx.
//
// Importiert bewusst nur aus docx-primitives.ts, nie aus docx-builder.ts: der
// Builder ruft buildHeftV42 auf, ein Rückimport wäre zirkulär.

import { Table, TableRow, Paragraph, BorderStyle, WidthType } from 'docx'
import type { SetJson, SituationJson } from './types'
import { COLOR, p, sectionHead, tcell } from './docx-primitives'

/** Was jede Word-Seite des Hefts bekommt. `sit` ist bereits in genau einer Spur aufgelöst. */
export interface HeftDocxKontext {
  sit: SituationJson
  set: SetJson | null
  mode: 'info' | 'fill'
  /** Hex ohne «#», wie überall in den docx-Bausteinen. */
  akzent: string
  light: string
  mid: string
}

/** Eine Seite = ihre Absätze/Tabellen; buildHeftV42 setzt jede in einen eigenen Abschnitt. */
export type HeftSeiteDocx = (ctx: HeftDocxKontext) => (Paragraph | Table)[]

/**
 * Palette aus `sit_farbe*`. Gleiche Regel wie sitPalette() in docx-builder.ts —
 * hier nachgebaut, weil der Builder nicht importiert werden darf (siehe Kopf).
 */
export function heftPalette(sit: SituationJson): Pick<HeftDocxKontext, 'akzent' | 'light' | 'mid'> {
  const strip = (h?: string) => (h || '').replace('#', '').toUpperCase()
  return {
    akzent: strip(sit.sit_farbe) || COLOR.neutral,
    light: strip(sit.sit_farbe_light) || COLOR.neutralLight,
    mid: strip(sit.sit_farbe_mid) || COLOR.neutralMid,
  }
}

/** Kopf jeder Heftseite: Seitennummer und Seitentitel — Gegenstück zu <SeitenKopf>. */
export function seitenKopfDocx(nr: number, titel: string, ctx: HeftDocxKontext): Paragraph[] {
  return sectionHead(String(nr).padStart(2, '0'), titel, ctx.akzent)
}

/** Umrandeter Kasten mit optionaler Beschriftung — Gegenstück zu <Kasten>. */
export function kastenDocx(label: string | null, inhalt: (Paragraph | Table)[], ctx: HeftDocxKontext): Table {
  const kopf = label ? [p(label.toUpperCase(), { run: { color: ctx.akzent, bold: true, size: 14 } })] : []
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [tcell([...kopf, ...inhalt], {
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
          left: { style: BorderStyle.SINGLE, size: 24, color: ctx.akzent },
          right: { style: BorderStyle.SINGLE, size: 4, color: COLOR.rule },
        },
      })],
    })],
  })
}
