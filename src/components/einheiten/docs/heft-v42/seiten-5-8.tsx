import { SeitenKopf, type HeftSeiteProps } from './gemeinsam'

/**
 * Heft v4.2, Seiten 5–8 (Leitfaden §3): Auftrag · Methoden · Arbeitsfläche ·
 * Abschluss. GERÜST — jede Seite zeigt nur ihren Titel. Die Inhalte baut ein
 * eigener Executor; Stil dazu in src/styles/v42/heft-5-8.css.
 */

export function Seite5(_props: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={5} titel="Auftrag" />
      <p>(Gerüst)</p>
    </>
  )
}

export function Seite6(_props: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={6} titel="Methoden" />
      <p>(Gerüst)</p>
    </>
  )
}

export function Seite7(_props: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={7} titel="Arbeitsfläche" />
      <p>(Gerüst)</p>
    </>
  )
}

export function Seite8(_props: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={8} titel="Abschluss" />
      <p>(Gerüst)</p>
    </>
  )
}
