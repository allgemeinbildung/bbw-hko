import { renderToStaticMarkup } from 'react-dom/server'
import type { Document } from 'docx'
import { DocS } from '../../components/einheiten/docs/DocS'
import { buildDocS } from './docx-builder'
import { SPUR_KEYS, isV42 } from './spuren'
import type { EinheitFullSet } from './types'

/**
 * Welche v4.2-Dokumente es zu einer Einheit gibt — EINE Liste für alle Abnehmer:
 * heute scripts/export-v42.mjs, später der ZIP der Workbench. Wer ein Dokument
 * ergänzt (Auftragsbogen …), hängt es hier an und nirgends sonst.
 *
 * Jedes Dokument liefert sein Markup und sein Word lazy: der Aufrufer entscheidet,
 * was er davon wirklich braucht (Vorschau, Einzeldownload, Bündel).
 */
export interface V42Dokument {
  /** Dateiname ohne Endung, z. B. `heft-a-ohne-medien`. */
  datei: string
  titel: string
  /** `renderToStaticMarkup` des Dokuments, Modus `fill` (die auszufüllende Fassung). */
  markup: () => string
  docx: () => Document | null
}

export interface V42DokumenteOpts {
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

const SPUR_DATEI = { ohne_medien: 'ohne-medien', mit_medien: 'mit-medien' } as const
const SPUR_TITEL = { ohne_medien: 'ohne Medien', mit_medien: 'mit Medien' } as const

/**
 * Je Heft (A, dann B) und je verfügbarer Spur ein Eintrag, in der Folge
 * `heft-a-ohne-medien`, `heft-a-mit-medien`, `heft-b-ohne-medien`, `heft-b-mit-medien`.
 * Einheiten ohne `spur_varianten` (alle Bestandseinheiten): leere Liste.
 */
export function v42Dokumente(d: EinheitFullSet, opts: V42DokumenteOpts = {}): V42Dokument[] {
  const varianten = d.spur_varianten
  if (!varianten) return []
  const { abteilung, logoPng = null } = opts
  const out: V42Dokument[] = []
  for (const L of ['A', 'B'] as const) {
    for (const spur of SPUR_KEYS) {
      const sit = varianten[spur]?.[`hf_${L}`]
      // Fehlt einem Heft diese Spur, hat loadEinheit die erste vorhandene eingesetzt
      // (Leitfaden §4.4) — das wäre ein Doppel der anderen Datei, kein eigenes Heft.
      if (!sit || !isV42(sit) || sit.spur !== spur) continue
      out.push({
        datei: `heft-${L.toLowerCase()}-${SPUR_DATEI[spur]}`,
        titel: `Heft ${L} · ${SPUR_TITEL[spur]} · ${sit.titel ?? ''}`.trim(),
        markup: () =>
          renderToStaticMarkup(<DocS sit={sit} set={d.set} abteilung={abteilung} mode="fill" edits={{}} onEdit={() => {}} />),
        docx: () => buildDocS({ sit, set: d.set, abteilung, mode: 'fill', logoPng }),
      })
    }
  }
  return out
}
