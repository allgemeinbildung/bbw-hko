import { TEMPLATE_V42 } from './types'
import type { MethodeRef, SetJson, SituationJson, SpurKey } from './types'

/**
 * Spur-Auflösung für das Heft v4.2 — Vertrag: docs/upgrade-v4.2/ENTSCHEIDE.md, E3.
 *
 * Auf der Platte steht der Kern eines Hefts genau einmal (LF1, LF2, Produkt, Methoden-
 * Karten 1/3/4 …), daneben unter `spuren` nur das, was von der Spur abhängt (Leitfaden
 * §4.1). `resolveSpur` steckt eine Spur in den Kern — danach sieht jeder Renderer wie
 * heute ein Heft mit vier Leitfragen und weiss nichts von Spuren.
 *
 * Bewusst OHNE Datenimporte und ohne `import.meta.glob`: die Datei läuft unverändert im
 * Browser und in Node-Skripten. Die Karteien (Methoden, Quellen) löst `loadEinheit`
 * erst NACH `resolveSpur` auf — hier wird nur umgesteckt, Referenzen bleiben Referenzen.
 */

/** Alle Spuren, in Vorrang-Reihenfolge: fehlt die verlangte, gilt die erste vorhandene. */
export const SPUR_KEYS: readonly SpurKey[] = ['ohne_medien', 'mit_medien']

/** E4: ohne Wunsch und bei `set.spur: "wahl"` zeigt die Plattform zuerst die traditionelle Spur. */
export const DEFAULT_SPUR: SpurKey = 'ohne_medien'

/** `ref` des Platzhalters in `methoden`, an dessen Stelle die Rezeptionskarte der Spur tritt. */
export const SPUR_PLATZHALTER = '__spur__'

function istSpurKey(v: unknown): v is SpurKey {
  return typeof v === 'string' && (SPUR_KEYS as readonly string[]).includes(v)
}

/** Trägt das Heft das v4.2-Template? Einziger Schalter für allen v4.2-Code. */
export function isV42(sit: SituationJson | null | undefined): boolean {
  return sit?.template === TEMPLATE_V42
}

/**
 * Die Spuren, die dieses Heft auf der Platte führt, in Vorrang-Reihenfolge.
 * Kein v4.2-Heft oder keine `spuren`: `[]`. Nach `resolveSpur` steht dieselbe Liste
 * in `sit.spuren_verfuegbar` — hier wird nur der Rohzustand gelesen.
 */
export function spurenVerfuegbar(sit: SituationJson | null | undefined): SpurKey[] {
  if (!isV42(sit)) return []
  const spuren = sit!.spuren
  if (!spuren || typeof spuren !== 'object') return []
  return SPUR_KEYS.filter((k) => !!spuren[k] && typeof spuren[k] === 'object')
}

/**
 * Welche Spur eine Einheit zeigt (E3, Punkt 3): der Wunsch des Aufrufers, sonst
 * `set.spur`, wenn dort eine feste Spur steht, sonst {@link DEFAULT_SPUR}.
 * Ob ein einzelnes Heft diese Spur auch hat, entscheidet erst `resolveSpur`.
 */
export function effektiveSpur(set: Pick<SetJson, 'spur'> | null | undefined, wunsch?: SpurKey | null): SpurKey {
  if (istSpurKey(wunsch)) return wunsch
  if (istSpurKey(set?.spur)) return set!.spur as SpurKey
  return DEFAULT_SPUR
}

/**
 * Setzt eine Spur in ein v4.2-Heft ein (Rohdaten → Heft mit vier Leitfragen):
 *
 * - `leitfragen` = Kern (LF1, LF2) + `spuren[spur].leitfragen` (LF3, LF4), nach `nr` sortiert
 * - `quellen` = `spuren[spur].quellen` (nur Medien-Spur, sonst kein Feld) — noch als Referenzen
 * - `kasten_s4` = `spuren[spur].kasten_s4`
 * - in `methoden` tritt `spuren[spur].methoden_ref_rezeption` an die Stelle von
 *   `{ ref: "__spur__" }`, Position bleibt — ebenfalls noch als Referenz
 * - `lernfortschritt.scaffold_90` = `spuren[spur].scaffold_90`, falls gesetzt
 * - `spur` und `spuren_verfuegbar` werden gesetzt, `spuren` wird entfernt
 *
 * Fehlt die verlangte Spur (Leitfaden §4.4), gilt die erste vorhandene. Ohne v4.2-
 * Template oder ohne `spuren` kommt **dasselbe Objekt** zurück (Invariante 4). Das
 * Eingabeobjekt wird nie verändert.
 */
export function resolveSpur<T extends SituationJson | null | undefined>(sit: T, spur?: SpurKey | null): T {
  if (!sit) return sit
  const vorhanden = spurenVerfuegbar(sit)
  if (!vorhanden.length) return sit
  const key: SpurKey = istSpurKey(spur) && vorhanden.includes(spur) ? spur : vorhanden[0]
  const s = sit.spuren![key]!

  // `spuren` fällt weg: ein Renderer bekommt die andere Spur nie zu sehen.
  const { spuren: _weg, ...kern } = sit
  const out: SituationJson = {
    ...kern,
    leitfragen: [...(sit.leitfragen ?? []), ...(s.leitfragen ?? [])].sort((a, b) => (a?.nr ?? 0) - (b?.nr ?? 0)),
    spur: key,
    spuren_verfuegbar: vorhanden,
  }
  if (Array.isArray(s.quellen)) out.quellen = s.quellen
  if (s.kasten_s4) out.kasten_s4 = s.kasten_s4

  // Platzhalter durch die Rezeptionskarte ersetzen. Fehlt sie in der Spur, entfällt nur
  // dieser eine Eintrag — gemeldet, nicht geworfen (gleiche Toleranz wie die Kartei).
  // Auf der Platte stehen in `methoden` Referenzen, im Typ aufgelöste Karten.
  const refs = sit.methoden as unknown as MethodeRef[] | undefined
  if (refs?.some((r) => r?.ref === SPUR_PLATZHALTER)) {
    if (!s.methoden_ref_rezeption) {
      console.warn(`[spuren] ${sit.id ?? '?'}: Spur «${key}» ohne methoden_ref_rezeption — Platzhalter entfällt.`)
    }
    const ersetzt = refs.flatMap((r) =>
      r?.ref === SPUR_PLATZHALTER ? (s.methoden_ref_rezeption ? [s.methoden_ref_rezeption] : []) : [r],
    )
    out.methoden = ersetzt as unknown as SituationJson['methoden']
  }

  if (s.scaffold_90 != null) {
    out.lernfortschritt = { ...(sit.lernfortschritt ?? {}), scaffold_90: s.scaffold_90 }
  }

  return out as T
}
