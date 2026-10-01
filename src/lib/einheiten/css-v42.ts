import type { EinheitFullSet } from './types'

/**
 * Heft v4.2 — CSS aller Dateien in src/styles/v42/, alphabetisch verkettet.
 *
 * Über einen Glob statt einzelner Importe: eine später hinzukommende Datei
 * (z. B. `auftragsbogen.css`) kommt ohne weitere Verdrahtung mit. Die Reihenfolge
 * ist der Dateiname — wer auf eine andere Datei aufbaut, muss danach sortieren.
 */
const dateien = import.meta.glob('../../styles/v42/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const cssV42: string = Object.keys(dateien)
  .sort()
  .map((pfad) => dateien[pfad])
  .join('\n')

/**
 * Der CSS-String, den [setKey].astro für eine Einheit ausliefert (Vorschau und
 * Workbench/Standalone-HTML). Nur mit v4.2-Heft (`spur` gesetzt) kommt `cssV42`
 * dazu — für jede andere Einheit bleibt das Renderer-CSS Zeichen für Zeichen gleich
 * (Invariante 4, geprüft von scripts/bestand-v42.mjs).
 */
export function cssFuerEinheit(cssRenderer: string, d: Pick<EinheitFullSet, 'spur'> | null | undefined): string {
  return d?.spur ? `${cssRenderer}\n${cssV42}` : cssRenderer
}
