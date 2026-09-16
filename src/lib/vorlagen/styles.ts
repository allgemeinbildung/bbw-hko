// styles.ts — benannte Word-Formatvorlagen für die Vorlagen.
//
// Die Einheiten-Dokumente formatieren direkt (jeder TextRun trägt Grösse und
// Farbe). Das ist für erzeugte Dokumente richtig — niemand bearbeitet sie.
// Eine Vorlage wird aber bearbeitet, und dann zählt etwas anderes: dass die
// Lehrperson im Formatvorlagen-Katalog von Word «Überschrift 1» anklicken kann
// und BBW-Grün bekommt, statt Grösse und Farbe von Hand nachzustellen.
//
// Zwei Stufen, damit das Nachrüsten die bestehenden Dokumente nicht anfasst:
//
//   `vorlagenStyles(false)` — nur die Vorlagen-Definitionen. Die drei
//   ausfüllbaren Vorlagen bekommen das: sie benutzen Titel/Überschrift nirgends
//   (sie formatieren direkt), also ändert sich ihr Aussehen um kein Haar — die
//   Lehrperson hat den Katalog aber trotzdem, sobald sie selbst weiterschreibt.
//
//   `vorlagenStyles(true)` — zusätzlich die Dokument-Grundschrift. Nur das
//   Blanko-Dokument bekommt das, weil dort jeder Absatz über eine Formatvorlage
//   läuft und es sonst keine Basis gäbe.

import type { IStylesOptions } from 'docx'
import { COLOR, BBW_GRUEN } from '../einheiten/docx-primitives'

/** Nur diese Vorlagen tauchen im Katalog auf — mehr verwirrt mehr als es hilft. */
export const STIL_LEGENDE = 'Titel · Überschrift 1–3 · Standard · BBW Hinweis · BBW Feldbeschriftung'

export function vorlagenStyles(mitDokumentBasis: boolean): IStylesOptions {
  return {
    default: {
      ...(mitDokumentBasis
        ? {
            document: {
              run: { size: 20, color: COLOR.ink },
              paragraph: { spacing: { after: 120, line: 300 } },
            },
          }
        : {}),
      title: {
        run: { size: 36, bold: true, color: COLOR.ink },
        paragraph: { spacing: { after: 120, line: 300 } },
      },
      heading1: {
        run: { size: 26, bold: true, color: BBW_GRUEN },
        paragraph: { spacing: { before: 280, after: 100, line: 300 }, keepNext: true },
      },
      heading2: {
        run: { size: 22, bold: true, color: COLOR.ink },
        paragraph: { spacing: { before: 200, after: 80, line: 300 }, keepNext: true },
      },
      heading3: {
        run: { size: 19, bold: true, color: COLOR.inkSoft },
        paragraph: { spacing: { before: 160, after: 60 }, keepNext: true },
      },
    },
    paragraphStyles: [
      {
        id: 'BBWHinweis',
        name: 'BBW Hinweis',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 16, italics: true, color: COLOR.inkMute },
        paragraph: { spacing: { after: 120 } },
      },
      {
        id: 'BBWFeld',
        name: 'BBW Feldbeschriftung',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 14, bold: true, color: BBW_GRUEN, allCaps: true },
        paragraph: { spacing: { before: 160, after: 40 } },
      },
    ],
  }
}
