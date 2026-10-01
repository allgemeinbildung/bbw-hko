import type { ComponentType, ReactNode } from 'react'
import { A4Page, sitColors } from './chrome'
import type { DocSProps } from './DocS'
import { heftNs, type HeftSeiteProps } from './heft-v42/gemeinsam'
import { Seite1, Seite2, Seite3, Seite4 } from './heft-v42/seiten-1-4'
import { Seite5, Seite6, Seite7, Seite8 } from './heft-v42/seiten-5-8'

/**
 * Heft v4.2 (template `heft_8page_v42`) — Leitfaden docs/upgrade-v4.2 §3.
 *
 * Genau acht Seiten in fester Folge, in beiden Modi dieselben: das Heft ist ein
 * gefalteter A3-Bogen, Doppelseite 6–7 legt die Methoden neben die Arbeitsfläche.
 * Hier steht nur die Hülle (Seitenrahmen, Zähler, Namensraum). Was auf eine Seite
 * kommt, entscheidet die Seite selbst — darum nichts Seitenspezifisches in dieser Datei.
 *
 * Eingang ist DocS(): die Weiche dort leitet jedes v4.2-Heft hierher.
 */

/** Feste Seitenfolge, Index + 1 = Seitenzahl. */
const SEITEN: ComponentType<HeftSeiteProps>[] = [Seite1, Seite2, Seite3, Seite4, Seite5, Seite6, Seite7, Seite8]

interface HeftPageCommon {
  sit: DocSProps['sit']
  abteilung?: string
  kompetenzNr?: string
  abgedeckteKompetenzen?: string[]
}

/**
 * Seitenrahmen — Muster DocSPage in DocS.tsx: Komponente auf Modulebene, nie im
 * Render-Body erzeugt, sonst hängt React bei jedem Tastenanschlag das Heft neu ein.
 */
function HeftPage({ common, nr, children }: { common: HeftPageCommon; nr: number; children: ReactNode }) {
  const { sit } = common
  return (
    <A4Page
      sit={sit.buchstabe}
      abteilung={common.abteilung}
      docCode={`HEFT ${sit.buchstabe} · ${sit.spur === 'mit_medien' ? 'MIT MEDIEN' : 'OHNE MEDIEN'}`}
      docTitel={sit.titel}
      sitLetter={sit.buchstabe}
      pageNum={nr}
      pageTotal={SEITEN.length}
      kompetenzNr={common.kompetenzNr || sit.nrlp?.nr}
      abgedeckteKompetenzen={common.abgedeckteKompetenzen || sit.nrlp?.nr_primary}
    >
      <div className={`a4-page-body v42-seite v42-s${nr}`}>{children}</div>
    </A4Page>
  )
}

export function DocHeftV42({ sit, set, abteilung, mode, edits, onEdit, kompetenzNr, abgedeckteKompetenzen }: DocSProps) {
  const common: HeftPageCommon = { sit, abteilung, kompetenzNr, abgedeckteKompetenzen }
  const seite: HeftSeiteProps = { sit, set, mode, edits, onEdit, ns: heftNs(sit) }
  return (
    <div className="v42-heft" style={sitColors(sit)}>
      {SEITEN.map((Seite, i) => (
        <HeftPage common={common} nr={i + 1} key={i}>
          <Seite {...seite} />
        </HeftPage>
      ))}
    </div>
  )
}
