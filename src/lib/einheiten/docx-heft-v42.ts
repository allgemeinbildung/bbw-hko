// docx-heft-v42.ts — Heft v4.2 (template `heft_8page_v42`) als Word-Dokument.
// Spiegel von DocHeftV42.tsx: acht Seiten in der Folge von Leitfaden §3, jede in
// einem eigenen Abschnitt und damit auf einer neuen Seite; Kopf/Fuss wie buildDocS.
// Eingang ist buildDocS() — die Weiche dort leitet jedes v4.2-Heft hierher.
//
// Importiert nie zur Laufzeit aus docx-builder.ts (zirkulär); `BuildDocSOpts` ist
// ein reiner Typ-Import und verschwindet beim Übersetzen.

import { Document } from 'docx'
import type { BuildDocSOpts } from './docx-builder'
import { sectionProps } from './docx-primitives'
import { heftPalette, type HeftDocxKontext, type HeftSeiteDocx } from './docx-heft-v42-gemeinsam'
import { seite1Docx, seite2Docx, seite3Docx, seite4Docx } from './docx-heft-v42-1-4'
import { seite5Docx, seite6Docx, seite7Docx, seite8Docx } from './docx-heft-v42-5-8'

/** Feste Seitenfolge, Index + 1 = Seitenzahl. */
const SEITEN: HeftSeiteDocx[] = [seite1Docx, seite2Docx, seite3Docx, seite4Docx, seite5Docx, seite6Docx, seite7Docx, seite8Docx]

export function buildHeftV42({ sit, set, abteilung, mode, logoPng = null }: BuildDocSOpts): Document {
  const docCode = `HEFT ${sit.buchstabe} · ${sit.spur === 'mit_medien' ? 'MIT MEDIEN' : 'OHNE MEDIEN'}`
  const docTitel = sit.titel || ''
  const ctx: HeftDocxKontext = { sit, set, mode, ...heftPalette(sit) }
  return new Document({
    creator: 'HKO Renderer',
    title: docTitel,
    description: docCode,
    // Ein Abschnitt je Seite statt Seitenumbrüchen: eine Seite, die überläuft, schiebt
    // so nie die Folgeseite mit — und die Seitenfolge bleibt im Paket abzählbar.
    sections: SEITEN.map((seite) => ({ ...sectionProps(docCode, docTitel, abteilung, logoPng), children: seite(ctx) })),
  })
}
