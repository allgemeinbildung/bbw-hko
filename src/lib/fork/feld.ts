/**
 * Fork-Pilot — Feldmarken im DOM (VERTRAG §10).
 *
 * Die Renderer sehen nur das aufgelöste Heft. Diese Helfer rechnen daraus die
 * Rohadresse auf der Platte zurück, damit `data-feld` auf ein Feld zeigt, das in
 * der Rohdatei existiert (LF1/LF2 im Kern, LF3/LF4 unter der wirksamen Spur).
 *
 * Nur v4.2-Hefte bekommen Marken; jedes andere Heft rendert Zeichen für Zeichen
 * wie bisher (Invariante 3, 12).
 */
import type { Leitfrage, SituationJson, SetJson } from '../einheiten/types'
import { TEMPLATE_V42 } from '../einheiten/types'

type Marke = { 'data-feld'?: string }
const KEINE: Marke = {}

function heftDatei(sit: Pick<SituationJson, 'buchstabe'>): string | null {
  return sit.buchstabe === 'A' || sit.buchstabe === 'B' ? `herausforderung_${sit.buchstabe}` : null
}

function istV42(sit: Pick<SituationJson, 'template'> | null | undefined): boolean {
  return !!sit && sit.template === TEMPLATE_V42
}

/** Marke für ein Feld des Hefts, z. B. `fm(sit, 'situation_text')`. */
export function fm(sit: SituationJson | null | undefined, pfad: string): Marke {
  if (!sit || !istV42(sit)) return KEINE
  const datei = heftDatei(sit)
  return datei ? { 'data-feld': `${datei}:${pfad}` } : KEINE
}

/** Rohpfad einer Leitfrage: Raster- und Beurteilen-Leitfrage liegen in der Spur, der Rest im Kern. */
export function lfPfad(sit: Pick<SituationJson, 'spur'>, lf: Pick<Leitfrage, 'nr' | 'antwortform' | 'pol_typ'>): string {
  const inSpur = lf.antwortform === 'raster' || !!lf.pol_typ
  return inSpur && sit.spur ? `spuren.${sit.spur}.leitfragen[nr=${lf.nr}]` : `leitfragen[nr=${lf.nr}]`
}

/** Marke für ein Feld einer Leitfrage, z. B. `fmLf(sit, lf, 'text')`. */
export function fmLf(sit: SituationJson | null | undefined, lf: Leitfrage | null | undefined, feld: string): Marke {
  if (!sit || !lf) return KEINE
  return fm(sit, `${lfPfad(sit, lf)}.${feld}`)
}

/** Marke für ein Feld der Spur (nur LF3/Kasten S. 4), z. B. `fmSpur(sit, 'kasten_s4')`. */
export function fmSpur(sit: SituationJson | null | undefined, feld: string): Marke {
  if (!sit?.spur) return KEINE
  return fm(sit, `spuren.${sit.spur}.${feld}`)
}

/** Marke für ein Feld des Auftragsbogens (set.json), z. B. `fmSet(set, 'gemeinsamer_auftrag.situation_text')`. */
export function fmSet(set: SetJson | null | undefined, pfad: string, v42: boolean): Marke {
  if (!set || !v42) return KEINE
  return { 'data-feld': `set:${pfad}` }
}

/** Marke für ein Feld des EBA-Dossiers. */
export function fmDossier(aktiv: boolean, pfad: string): Marke {
  return aktiv ? { 'data-feld': `dossier:${pfad}` } : KEINE
}
