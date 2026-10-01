// docx-heft-v42-1-4.ts — Heft v4.2 (Word), Seiten 1–4: Herausforderung ·
// Wissensecke I · Quelle · Wissensecke II. Spiegel von heft-v42/seiten-1-4.tsx.
// GERÜST — jede Seite zeigt nur ihren Titel; die Inhalte baut ein eigener Executor.

import { p } from './docx-primitives'
import { seitenKopfDocx, type HeftDocxKontext } from './docx-heft-v42-gemeinsam'

export function seite1Docx(ctx: HeftDocxKontext) {
  return [...seitenKopfDocx(1, 'Herausforderung', ctx), p('(Gerüst)')]
}

export function seite2Docx(ctx: HeftDocxKontext) {
  return [...seitenKopfDocx(2, 'Wissensecke I', ctx), p('(Gerüst)')]
}

export function seite3Docx(ctx: HeftDocxKontext) {
  return [...seitenKopfDocx(3, 'Quelle', ctx), p('(Gerüst)')]
}

export function seite4Docx(ctx: HeftDocxKontext) {
  return [...seitenKopfDocx(4, 'Wissensecke II', ctx), p('(Gerüst)')]
}
