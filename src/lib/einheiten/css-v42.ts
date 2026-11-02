import type { EinheitFullSet } from './types'
import { istEba } from './v42-profil'

/**
 * Heft v4.2 — CSS aller Dateien in src/styles/v42/, alphabetisch verkettet.
 *
 * Über einen Glob statt einzelner Importe: eine später hinzukommende Datei
 * (z. B. `auftragsbogen.css`) kommt ohne weitere Verdrahtung mit. Die Reihenfolge
 * ist der Dateiname — wer auf eine andere Datei aufbaut, muss danach sortieren.
 */
const dateien = import.meta.glob('../../styles/v42/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

/**
 * `eba.css` gehört nicht in den gemeinsamen String: es kommt nur bei EBA-Einheiten dazu
 * (`cssFuerEinheit`), sonst änderte sich das eigenständige HTML jeder EFZ-Einheit.
 */
const istEbaDatei = (pfad: string) => /\/eba\.css$/.test(pfad)

export const cssV42: string = Object.keys(dateien)
  .filter((pfad) => !istEbaDatei(pfad))
  .sort()
  .map((pfad) => dateien[pfad])
  .join('\n')

/** Zusatz für EBA-Hefte v4.2 (grössere Schrift, Kasten «Wichtige Wörter») — Selektoren unter `.v42-eba`. */
export const cssV42Eba: string = Object.keys(dateien)
  .filter(istEbaDatei)
  .map((pfad) => dateien[pfad])
  .join('\n')

/**
 * Der CSS-String, den [setKey].astro für eine Einheit ausliefert (Vorschau und
 * Workbench/Standalone-HTML). Nur mit v4.2-Heft (`spur` gesetzt) kommt `cssV42`
 * dazu — für jede andere Einheit bleibt das Renderer-CSS Zeichen für Zeichen gleich
 * (Invariante 4, geprüft von scripts/bestand-v42.mjs).
 */
export function cssFuerEinheit(
  cssRenderer: string,
  d: (Pick<EinheitFullSet, 'spur'> & Partial<Pick<EinheitFullSet, 'set' | 'hf_A'>>) | null | undefined,
): string {
  if (!d?.spur) return cssRenderer
  const eba = istEba(d.hf_A) || istEba(d.set)
  return eba ? `${cssRenderer}\n${cssV42}\n${cssV42Eba}` : `${cssRenderer}\n${cssV42}`
}
