import type { CSSProperties } from 'react'
import type { SituationJson } from '../../../../lib/einheiten/types'

/**
 * Heft v4.2, Seite 8 — Begriffsnetz, Glossar des Hefts und Checkliste in zwei Spalten
 * (Entscheid E17). Ersetzt auf S. 8 die Kasten-Mindmap, sobald das Heft ein Glossar
 * trägt (`sit.glossar`, von loadEinheit aus `set.glossar` eingesetzt); sonst bleibt
 * die Mindmap in seiten-5-8.tsx der Rückfall.
 *
 * Stil in src/styles/v42/begriffsnetz.css (Präfix `.v42-bn-`). Word-Spiegel in
 * src/lib/einheiten/docx-begriffsnetz-v42.ts — die Platzierungsregel (Spuren, Folge)
 * steht nur hier und wird dort importiert.
 *
 * Kontur statt Farbe (Schwarz-Weiss-Kopie): durchgezogen = vorgegebener Begriff,
 * gestrichelt = offen, selbst ausfüllen. Ein Akzent (Heftfarbe) für Zentrum und
 * Ast-Titel. Keine vorgezeichneten Linien — die ziehen die Lernenden.
 */

type Ast = NonNullable<SituationJson['mindmap_aeste']>[number]

/**
 * Bezugsfläche der Platzierung in mm. Die Koordinaten werden in Prozent dieser Fläche
 * umgerechnet: ändert begriffsnetz.css die Höhe, wandert alles anteilig mit.
 */
export const NETZ_MM = { breite: 170, hoehe: 83 } as const

/** Höhe der Mittelachse (mm): Zentrum und die zwei leeren Knoten. */
const MITTE_Y = 42

/**
 * Breiteste Pille: 36 mm (begriffsnetz.css `.v42-bn-knoten { max-width }`) — längere
 * Begriffe brechen um. Die Spurabstände unten setzen diese Grenze voraus.
 *
 * Zwei Spuren je Region: «aussen» am Seitenrand, «innen» zur Mitte hin. Aufeinander-
 * folgende Knoten wechseln die Spur, darum liegen sie nie nebeneinander: Spurabstand
 * (≥ 39 mm) > breiteste Pille (36 mm). Gleiche Spur heisst zwei Schritte Abstand in
 * der Höhe. So geht jede Zahl von 1–5 Knoten ohne Überlappung auf.
 */
const REGIONEN = [
  // Ast 1 oben links: der unterste Knoten aussen, damit innen (unter dem Zentrum) Luft bleibt.
  { aussen: [20, 24, 18], innen: [64, 62], oben: 9, unten: 30, untersterAussen: true },
  // Ast 2 oben rechts: gespiegelt.
  { aussen: [150, 146, 152], innen: [106, 108], oben: 9, unten: 30, untersterAussen: true },
  // Ast 3 unten links: der oberste Knoten aussen, der Titel steht darunter.
  { aussen: [20, 24, 18], innen: [64, 62], oben: 54, unten: 72, untersterAussen: false },
] as const
// x je Spur und Rang in der Spur (mm): der Versatz bricht die Spalte auf; jedes Paar
// aufeinanderfolgender Knoten bleibt ≥ 38 mm auseinander (62 − 24), also auch zwei
// Pillen der Höchstbreite 36 mm mit 2 mm Luft; aussen bleibt ≥ 0, innen ≤ 82 bzw. ≥ 88 mm.

export type KnotenSpur = 'aussen' | 'innen'

/**
 * Spur des i-ten von n Knoten einer Region. Geteilt mit Word: dort ist die Spur die
 * Spalte der inneren Tabelle.
 */
export function knotenSpur(i: number, n: number, region: number): KnotenSpur {
  const r = REGIONEN[Math.min(region, REGIONEN.length - 1)]
  const abstand = r.untersterAussen ? n - 1 - i : i
  return abstand % 2 === 0 ? 'aussen' : 'innen'
}

/** Mittelpunkt des i-ten von n Knoten in Region `region`, in mm der Bezugsfläche. */
export function knotenPunkt(i: number, n: number, region: number): { x: number; y: number } {
  const r = REGIONEN[region]
  const spur = knotenSpur(i, n, region)
  // Rang in der Spur = wie viele Knoten davor in derselben Spur liegen.
  let rang = 0
  for (let j = 0; j < i; j++) if (knotenSpur(j, n, region) === spur) rang++
  const xs: readonly number[] = spur === 'aussen' ? r.aussen : r.innen
  const x = xs[rang % xs.length]
  const y = n > 1 ? r.oben + (i * (r.unten - r.oben)) / (n - 1) : (r.oben + r.unten) / 2
  return { x, y }
}

/** Die drei Äste mit Knoten und der Transfer-Ast, getrennt. Mehr als drei Äste: der Rest entfällt. */
export function netzAeste(sit: SituationJson): { aeste: Ast[]; transfer: Ast | undefined } {
  const alle = sit.mindmap_aeste || []
  return {
    aeste: alle.filter((a) => !a.transfer && (a.punkte?.length ?? 0) > 0).slice(0, REGIONEN.length),
    transfer: alle.find((a) => a.transfer),
  }
}

const pos = (x: number, y: number): CSSProperties => ({
  left: `${((x / NETZ_MM.breite) * 100).toFixed(2)}%`,
  top: `${((y / NETZ_MM.hoehe) * 100).toFixed(2)}%`,
})

/** Begriffsnetz: Zentrum, Knoten in drei Regionen, Transfer-Feld, zwei leere Knoten. */
export function Begriffsnetz({ sit }: { sit: SituationJson }) {
  const { aeste, transfer } = netzAeste(sit)
  const ecken = ['v42-bn-titel-ol', 'v42-bn-titel-or', 'v42-bn-titel-ul']
  return (
    <div className="v42-bn">
      <div className="v42-bn-zentrum" style={pos(NETZ_MM.breite / 2, MITTE_Y)}>{sit.mindmap_zentrum}</div>
      {aeste.map((ast, a) => {
        const punkte = (ast.punkte || []).slice(0, 5)
        return [
          <div className={`v42-bn-titel ${ecken[a]}`} key={`t${a}`}>{ast.titel}</div>,
          ...punkte.map((pt, i) => {
            const { x, y } = knotenPunkt(i, punkte.length, a)
            return <div className="v42-bn-knoten" style={pos(x, y)} key={`k${a}-${i}`}>{pt}</div>
          }),
        ]
      })}
      {/* Zwei leere Knoten für eigene Begriffe aus dem Raster (S. 3). */}
      <div className="v42-bn-knoten v42-bn-leer" style={pos(25, MITTE_Y)}><span>aus meinem Raster</span></div>
      <div className="v42-bn-knoten v42-bn-leer" style={pos(NETZ_MM.breite - 25, MITTE_Y)}><span>aus meinem Raster</span></div>
      <div className="v42-bn-transfer">
        <div className="v42-bn-transfer-titel">{transfer?.titel || 'gilt auch bei …'}</div>
        <div className="v42-bn-transfer-zeilen" aria-hidden="true"><span /><span /><span /></div>
      </div>
    </div>
  )
}

/** Glossar des Hefts: alle Einträge (auch die der Spur), Reihenfolge der Daten, drei Spalten. */
export function GlossarStreifen({ sit }: { sit: SituationJson }) {
  const glossar = (sit.glossar || []).filter((g) => g && g.begriff)
  if (!glossar.length) return null
  return (
    <section className="v42-bn-glossar">
      <div className="v42-kasten-label">Glossar</div>
      <dl className="v42-bn-glossar-liste">
        {glossar.map((g, i) => (
          <div key={i}>
            <dt>{g.begriff}</dt> <dd>{g.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Zeilen einer Checklisten-Gruppe — gleiche Regel wie ChecklisteVollstaendigkeit (DocS.tsx). */
export function checklistenZeilen(b: NonNullable<SituationJson['bewertungsraster']>[number]): string[] {
  const bullets = b.vollstaendig_wenn?.filter(Boolean) || []
  return bullets.length > 0 ? bullets : (b.kriterium ? [b.kriterium] : [])
}

/**
 * Checkliste Vollständigkeit für v4.2: dieselben Daten und Texte wie die Bestands-
 * komponente (✔ … ☐), aber die Gruppen im 2×2-Raster statt einer Tabellenzeile je Produkt.
 */
export function ChecklisteZweispaltig({ sit }: { sit: SituationJson }) {
  const raster = sit.bewertungsraster || []
  if (!raster.length) return null
  return (
    <section className="v42-bn-check">
      <div className="v42-kasten-label">Checkliste Vollständigkeit</div>
      <div className="v42-bn-check-raster">
        {raster.map((b, i) => (
          <div className="v42-bn-check-gruppe" key={i}>
            <div className="v42-bn-check-produkt">{b.produkt}</div>
            <ul>
              {checklistenZeilen(b).map((v, j) => (
                <li key={j}>
                  <span className="v42-bn-check-haken" aria-hidden="true">✔</span>
                  <span>{v}</span>
                  <span className="v42-bn-check-box" aria-hidden="true">☐</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
