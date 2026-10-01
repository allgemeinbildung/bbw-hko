// docx-heft-v42-5-8.ts — Heft v4.2 (Word), Seiten 5–8: Auftrag · Methoden ·
// Arbeitsfläche · Abschluss. Spiegel von heft-v42/seiten-5-8.tsx.
// GERÜST — jede Seite zeigt nur ihren Titel; die Inhalte baut ein eigener Executor.

import { p } from './docx-primitives'
import { seitenKopfDocx, type HeftDocxKontext } from './docx-heft-v42-gemeinsam'

export function seite5Docx(ctx: HeftDocxKontext) {
  return [...seitenKopfDocx(5, 'Auftrag', ctx), p('(Gerüst)')]
}

export function seite6Docx(ctx: HeftDocxKontext) {
  return [...seitenKopfDocx(6, 'Methoden', ctx), p('(Gerüst)')]
}

export function seite7Docx(ctx: HeftDocxKontext) {
  return [...seitenKopfDocx(7, 'Arbeitsfläche', ctx), p('(Gerüst)')]
}

export function seite8Docx(ctx: HeftDocxKontext) {
  return [...seitenKopfDocx(8, 'Abschluss', ctx), p('(Gerüst)')]
}
