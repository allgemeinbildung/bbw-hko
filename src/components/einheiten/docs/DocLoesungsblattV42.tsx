import { A4Page, SectionHead, sitColors } from './chrome'
import { Kasten } from './heft-v42/gemeinsam'
import { ProduktBildBlatt } from './heft-v42/produkt-bild'
import type { SituationJson } from '../../../lib/einheiten/types'

/**
 * Lösungsblatt Produkt (v4.2, nur Lehrperson): eine A4-Seite je Heft mit
 * `handlungsprodukt.loesungsbild` — Kopf wie die Heftseiten, Kasten «Nur für die
 * Lehrperson» mit `hinweis`, darunter das Blatt in Grösse `gross`.
 *
 * Spur-unabhängig: das Handlungsprodukt ist in beiden Spuren dasselbe. Spiegel in
 * src/lib/einheiten/docx-produkt-bild-v42.ts (buildLoesungsblatt), Stil in
 * src/styles/v42/produkt-bild.css. Verdrahtet über v42-dokumente.tsx.
 */

/** Rückfall, wenn `loesungsbild.hinweis` fehlt — der Kasten bleibt, damit klar ist, für wen das Blatt ist. */
export const LOESUNG_HINWEIS_ERSATZ = 'Eine mögliche Lösung zum Fall des Hefts, keine Vorlage. Nicht an die Lernenden abgeben.'

/** `Lösungsblatt · <Produkttitel>` — Titel in HTML und Word. */
export function loesungsblattTitel(sit: SituationJson): string {
  const t = sit.handlungsprodukt?.titel
  return t ? `Lösungsblatt · ${t}` : 'Lösungsblatt'
}

/** Kopfzeile oben rechts, wie `HEFT A · OHNE MEDIEN` bei den Heften. */
export function loesungsblattDocCode(sit: SituationJson): string {
  return `LÖSUNGSBLATT ${sit.buchstabe} · NUR LEHRPERSON`
}

export function DocLoesungsblattV42({ sit, abteilung }: { sit: SituationJson; abteilung?: string }) {
  const bild = sit.handlungsprodukt?.loesungsbild
  if (!bild) return null
  const titel = loesungsblattTitel(sit)
  return (
    <div className="v42-loesungsblatt" style={sitColors(sit)}>
      <A4Page
        sit={sit.buchstabe}
        abteilung={abteilung}
        docCode={loesungsblattDocCode(sit)}
        docTitel={titel}
        sitLetter={sit.buchstabe}
        pageNum={1}
        pageTotal={1}
        kompetenzNr={sit.nrlp?.nr}
        abgedeckteKompetenzen={sit.nrlp?.nr_primary}
      >
        <div className="a4-page-body v42-seite v42-lb-seite">
          <div className="v42-seitenkopf">
            <SectionHead num="LP">{titel}</SectionHead>
          </div>
          <Kasten label="Nur für die Lehrperson" className="v42-lb-lp">
            <p>{bild.hinweis || LOESUNG_HINWEIS_ERSATZ}</p>
          </Kasten>
          <ProduktBildBlatt bild={bild} groesse="gross" />
        </div>
      </A4Page>
    </div>
  )
}
