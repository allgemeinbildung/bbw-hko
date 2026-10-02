import { renderToStaticMarkup } from 'react-dom/server'
import type { Document } from 'docx'
import { DocS } from '../../components/einheiten/docs/DocS'
import { DocAuftragsbogen } from '../../components/einheiten/docs/DocAuftragsbogen'
import { DocLoesungenV42 } from '../../components/einheiten/docs/DocLoesungenV42'
import { buildDocS } from './docx-builder'
import { buildAuftragsbogen } from './docx-auftragsbogen-v42'
import { buildLoesungen } from './docx-loesungen-v42'
import { loesungenModell, loesungenTitel } from './loesungen-v42'
import { SPUR_KEYS, isV42 } from './spuren'
import type { EinheitFullSet, SpurKey } from './types'

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
  /** Einfüge-Sperre + Schreibprotokoll im eigenständigen HTML — nur die Hefte. */
  protokoll: boolean
  /** Nur für die Lehrperson (Lösungen): im ZIP unter `Material_LP/`, für Gäste gesperrt. */
  lehrperson: boolean
}

export interface V42DokumenteOpts {
  abteilung?: string
  logoPng?: ArrayBuffer | Uint8Array | null
}

const SPUR_DATEI = { ohne_medien: 'ohne-medien', mit_medien: 'mit-medien' } as const
const SPUR_TITEL = { ohne_medien: 'ohne Medien', mit_medien: 'mit Medien' } as const

/** Dateiname (ohne Endung) eines Hefts in einer Spur, z. B. `heft-a-ohne-medien`. */
export function heftDatei(buchstabe: string, spur: SpurKey): string {
  return `heft-${buchstabe.toLowerCase()}-${SPUR_DATEI[spur]}`
}

/** Dateiname (ohne Endung) der Lösungen eines Hefts in einer Spur, z. B. `loesungen-a-ohne-medien`. */
export function loesungenDatei(buchstabe: string, spur: SpurKey): string {
  return `loesungen-${buchstabe.toLowerCase()}-${SPUR_DATEI[spur]}`
}

/**
 * Je Heft (A, dann B) und je verfügbarer Spur ein Eintrag, in der Folge
 * `heft-a-ohne-medien`, `heft-a-mit-medien`, `heft-b-ohne-medien`, `heft-b-mit-medien`,
 * danach `auftragsbogen`, sofern `set.gemeinsamer_auftrag` vorhanden ist, danach je Heft und
 * Spur die Lösungen der Lehrperson (E19) in derselben Folge (`loesungen-a-ohne-medien`,
 * `loesungen-a-mit-medien`, `loesungen-b-…`) — nur, wo das Heft Lösungen trägt.
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
        datei: heftDatei(L, spur),
        titel: `Heft ${L} · ${SPUR_TITEL[spur]} · ${sit.titel ?? ''}`.trim(),
        markup: () =>
          renderToStaticMarkup(<DocS sit={sit} set={d.set} abteilung={abteilung} mode="fill" edits={{}} onEdit={() => {}} />),
        docx: () => buildDocS({ sit, set: d.set, abteilung, mode: 'fill', logoPng }),
        protokoll: true,
        lehrperson: false,
      })
    }
  }
  // Auftragsbogen des gemeinsamen Auftrags (Leitfaden §7.5) — nach den Heften, in beiden Spuren derselbe.
  const ga = d.set?.gemeinsamer_auftrag
  if (ga) {
    out.push({
      datei: 'auftragsbogen',
      titel: `Auftragsbogen · ${ga.titel ?? ''}`.trim(),
      markup: () =>
        renderToStaticMarkup(<DocAuftragsbogen set={d.set} abteilung={abteilung} edits={{}} onEdit={() => {}} />),
      docx: () => buildAuftragsbogen({ set: d.set, abteilung, logoPng }),
      protokoll: false,
      lehrperson: false,
    })
  }
  // Lösungen (nur Lehrperson, E19) — nach dem Auftragsbogen, je Heft und Spur eines.
  for (const L of ['A', 'B'] as const) {
    for (const spur of SPUR_KEYS) {
      const sit = varianten[spur]?.[`hf_${L}`]
      if (!sit || !isV42(sit) || sit.spur !== spur || !loesungenModell(sit)) continue
      out.push({
        datei: loesungenDatei(L, spur),
        titel: `${loesungenTitel(L, spur)} · ${sit.titel ?? ''}`.replace(/ · $/, ''),
        markup: () => renderToStaticMarkup(<DocLoesungenV42 sit={sit} abteilung={abteilung} />),
        docx: () => buildLoesungen({ sit, abteilung, logoPng }),
        protokoll: false,
        lehrperson: true,
      })
    }
  }
  return out
}
