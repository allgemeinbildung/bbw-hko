/**
 * Fork-Pilot «Meine Fassung» — Ersetzungen auf die Rohdateien anwenden (VERTRAG §1, §2).
 *
 * Eine Fassung ist eine Liste von Ersetzungen, nie eine Kopie. `wendeAn` arbeitet auf
 * tiefen Kopien der betroffenen Rohdateien, VOR `ladeHeft` (Invariante 2); die
 * übergebenen Objekte (bei `loadEinheit` die Module von `import.meta.glob`) werden nie
 * verändert. Adressen werden ausschliesslich über `adresse.ts` gelesen und gesetzt
 * (Invariante 1).
 *
 * Die Positivliste (`positivliste.ts`) wird hier bewusst NICHT importiert: Sie kommt als
 * Haken `istErlaubt` herein, damit diese Datei ohne sie testbar bleibt.
 */

import { DATEIEN, lesePfad, parsePfad, setzePfad, wertHash } from './adresse.ts'
import type { FassungsDatei, Segment } from './adresse.ts'
import type { SpurKey } from '../einheiten/types'

export type AuftragKey =
  | 'leitfrage_umformulieren'
  | 'eigener_text'
  | 'situation_umformulieren'
  | 'handlungsprodukt_aendern'

/** Eine Ersetzung, Felder genau wie VERTRAG §1. */
export interface Ersetzung {
  datei: FassungsDatei
  /** Pfad nach der Grammatik in VERTRAG §1, adressiert die Rohform auf der Platte. */
  pfad: string
  /** JSON-Wert, der den Originalwert ganz ersetzt. */
  wert: unknown
  /** 'sha256:' + 64 hex über den kanonischen Originalwert. */
  original_hash: string
  auftrag: AuftragKey
  /** uuid des Bündels, aus dem die Ersetzung stammt. */
  buendel_id: string
}

export interface FassungOption {
  ersetzungen: Ersetzung[]
  /** Auftrag `eigener_text`: nur diese Spur bleibt in `spur_varianten`. */
  nur_spur?: SpurKey
}

export interface FassungBericht {
  angewendet: number
  /** Original hat sich seit dem Speichern geändert — nicht angewendet. */
  veraltet: Ersetzung[]
  /** Nicht anwendbar (Datei fehlt, nicht erlaubt, Pfad ungültig oder nicht erreichbar). */
  verworfen: { e: Ersetzung; grund: string }[]
}

export type FassungsDateien = Partial<Record<FassungsDatei, unknown>>

function istObjekt(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

/**
 * Ist das Ziel des Pfads erreichbar? Ein letztes Segment ohne Schlüssel darf fehlen
 * (es wird angelegt, Hash des Originals = Hash von `null`), sein Elternteil aber nicht.
 * Ein letztes Segment mit Schlüssel muss genau ein Listenelement treffen.
 */
function erreichbar(obj: unknown, seg: Segment[]): boolean {
  const letztes = seg[seg.length - 1]
  if (letztes.wahl) return lesePfad(obj, seg) !== undefined
  const eltern = seg.length === 1 ? obj : lesePfad(obj, seg.slice(0, -1))
  return istObjekt(eltern)
}

/**
 * Wendet `ersetzungen` in Listenreihenfolge an. Gibt alle übergebenen Dateien zurück;
 * betroffene als tiefe Kopie (structuredClone), unbetroffene als dieselbe Referenz.
 */
export function wendeAn(
  roh: FassungsDateien,
  ersetzungen: Ersetzung[],
  istErlaubt?: (e: Ersetzung) => string | null,
): { dateien: FassungsDateien; bericht: FassungBericht } {
  const dateien: FassungsDateien = { ...roh }
  const kopiert = new Set<FassungsDatei>()
  const bericht: FassungBericht = { angewendet: 0, veraltet: [], verworfen: [] }
  const verwirf = (e: Ersetzung, grund: string) => bericht.verworfen.push({ e, grund })

  for (const e of ersetzungen ?? []) {
    if (!e || !(DATEIEN as readonly string[]).includes(e.datei)) { verwirf(e, 'Unbekannte Datei'); continue }
    if (dateien[e.datei] == null) { verwirf(e, `Datei «${e.datei}» fehlt in dieser Einheit`); continue }
    const grund = istErlaubt?.(e) ?? null
    if (grund) { verwirf(e, grund); continue }

    let seg: Segment[]
    try { seg = parsePfad(e.pfad) } catch (err) { verwirf(e, `Pfad ungültig: ${(err as Error).message}`); continue }
    if (!erreichbar(dateien[e.datei], seg)) { verwirf(e, `Pfad «${e.pfad}» nicht erreichbar`); continue }

    if (wertHash(lesePfad(dateien[e.datei], seg)) !== e.original_hash) { bericht.veraltet.push(e); continue }

    // Erst jetzt kopieren: nur Dateien, an denen wirklich etwas gesetzt wird.
    if (!kopiert.has(e.datei)) { dateien[e.datei] = structuredClone(dateien[e.datei]); kopiert.add(e.datei) }
    if (!setzePfad(dateien[e.datei], seg, structuredClone(e.wert))) { verwirf(e, `Pfad «${e.pfad}» nicht setzbar`); continue }
    bericht.angewendet++
  }
  return { dateien, bericht }
}
