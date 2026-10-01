import type { ReactNode } from 'react'
import { SectionHead } from '../chrome'
import { DEFAULT_SPUR } from '../../../../lib/einheiten/spuren'
import type { SetJson, SituationJson } from '../../../../lib/einheiten/types'

/**
 * Heft v4.2 — was alle acht Seiten teilen (Leitfaden §3).
 *
 * Die Seiten selbst liegen in `seiten-1-4.tsx` und `seiten-5-8.tsx`; diese Datei hält
 * nur, was wirklich mehr als eine Seite braucht. Seitenspezifisches gehört nicht hierher
 * und nicht nach DocHeftV42.tsx.
 */

/** Was jede Seite des Hefts bekommt. `sit` ist bereits in genau einer Spur aufgelöst. */
export type HeftSeiteProps = {
  sit: SituationJson
  set?: SetJson | null
  mode: 'info' | 'fill'
  edits: Record<string, string>
  onEdit: (k: string, v: string) => void
  /** Eingabe-Namensraum, siehe {@link heftNs}. */
  ns: string
}

/**
 * Namensraum der Eingaben eines Hefts: `hfA_ohne_medien_`, `hfB_mit_medien_` …
 *
 * Gegenstück zu editNs() in DocS.tsx, aber je Spur getrennt: die Workbench hält ein
 * gemeinsames `edits`-Objekt, und was in der einen Spur getippt wurde, darf nicht in
 * der anderen erscheinen. Ob ein Kernfeld (LF1, LF2 …) die Spur dennoch teilen soll,
 * entscheidet die Seite — dann schreibt sie dort ohne Spur-Teil.
 */
export function heftNs(sit: SituationJson): string {
  return `hf${sit.buchstabe || '?'}_${sit.spur ?? DEFAULT_SPUR}_`
}

/** Kopf jeder Heftseite: Seitennummer und Seitentitel (Leitfaden §3, Spalte «Titel»). */
export function SeitenKopf({ nr, titel }: { nr: number; titel: ReactNode }) {
  return (
    <div className="v42-seitenkopf">
      <SectionHead num={String(nr).padStart(2, '0')}>{titel}</SectionHead>
    </div>
  )
}

/** Umrandeter Kasten mit optionaler Beschriftung — Akzent links, sonst Schwarz/Weiss. */
export function Kasten({ label, children, className }: { label?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={className ? `v42-kasten ${className}` : 'v42-kasten'}>
      {label && <div className="v42-kasten-label">{label}</div>}
      {children}
    </section>
  )
}
