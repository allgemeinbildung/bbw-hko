import { SeitenKopf, type HeftSeiteProps } from './gemeinsam'

/**
 * Heft v4.2, Seiten 1–4 (Leitfaden §3): Herausforderung · Wissensecke I · Quelle ·
 * Wissensecke II. GERÜST — jede Seite zeigt nur ihren Titel. Die Inhalte baut ein
 * eigener Executor; Stil dazu in src/styles/v42/heft-1-4.css.
 */

export function Seite1(_props: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={1} titel="Herausforderung" />
      <p>(Gerüst)</p>
    </>
  )
}

export function Seite2(_props: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={2} titel="Wissensecke I" />
      <p>(Gerüst)</p>
    </>
  )
}

export function Seite3(_props: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={3} titel="Quelle" />
      <p>(Gerüst)</p>
    </>
  )
}

export function Seite4(_props: HeftSeiteProps) {
  return (
    <>
      <SeitenKopf nr={4} titel="Wissensecke II" />
      <p>(Gerüst)</p>
    </>
  )
}
