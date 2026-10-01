import type { Quelle, QuelleKarte, QuelleRef } from './types'

/**
 * Quellenkartei (Heft v4.2, Spur «mit Medien») — plattformweit, nach dem Muster der
 * Methodenkartei (./methoden.ts).
 *
 * Eine Karte trägt Metadaten und Verortung einer Quelle (Titel, Herausgeber, URL,
 * Absätze bzw. Zeitmarken). Das Repo ist öffentlich: Volltexte und Transkripte liegen
 * nie hier, nur im privaten Archiv (`archiv_ref`). Was die Quelle in einem bestimmten
 * Heft leistet — Rolle, Auftrag, Raster — steht in der Herausforderung
 * (`spuren.mit_medien.quellen[]`), nicht auf der Karte.
 *
 * Der Ordner darf leer sein: `import.meta.glob` liefert dann `{}`, die Kartei ist leer
 * und jede Referenz wird als unbekannt gemeldet, statt den Build zu brechen.
 */
const karteiFiles = import.meta.glob('../../data/quellen/*.json', { eager: true }) as Record<
  string,
  { default: QuelleKarte }
>

const KARTEI: Record<string, QuelleKarte> = Object.fromEntries(
  Object.values(karteiFiles)
    .map((m) => m?.default)
    .filter((k): k is QuelleKarte => !!k?.id)
    .map((k) => [k.id, k]),
)

export function quelleKarte(id: string): QuelleKarte | null {
  return KARTEI[id] ?? null
}

export function alleQuellenKarten(): QuelleKarte[] {
  return Object.values(KARTEI).sort((a, b) => a.id.localeCompare(b.id))
}

/**
 * Löst die Quellen-Referenzen eines Hefts gegen die Kartei auf: Karte und Einsatz
 * liegen danach flach auf einem Eintrag (Typ {@link Quelle}), die Karten-`id` ersetzt
 * das Kürzel `ref`. Führt die Karte ein `ersatz_ref`, wird die Ersatzkarte als
 * `ersatz` angehängt.
 *
 * Unbekannte Referenzen werden übersprungen und gemeldet, statt die Seite zu sprengen —
 * eine fehlende Karte darf kein Heft unrenderbar machen. Eine unbekannte Ersatzkarte
 * kostet nur das `ersatz`-Feld.
 */
export function resolveQuellen(refs: QuelleRef[] | null | undefined): Quelle[] {
  if (!refs?.length) return []
  const out: Quelle[] = []
  for (const r of refs) {
    if (!r?.ref) continue
    const karte = KARTEI[r.ref]
    if (!karte) {
      console.warn(`[quellen] Unbekannte Karte «${r.ref}» — übersprungen.`)
      continue
    }
    const { ref: _ref, ...einsatz } = r
    const eintrag: Quelle = { ...karte, ...einsatz }
    if (karte.ersatz_ref) {
      const ersatz = KARTEI[karte.ersatz_ref]
      if (ersatz) eintrag.ersatz = ersatz
      else console.warn(`[quellen] Unbekannte Ersatzkarte «${karte.ersatz_ref}» (zu «${r.ref}») — ohne Ersatz.`)
    }
    out.push(eintrag)
  }
  return out
}
