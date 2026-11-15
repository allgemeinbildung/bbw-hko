/**
 * Fork-Pilot «Meine Fassung» — Selbst bearbeiten (Entscheid Pietro 15.11.2026).
 *
 * Die Lehrperson ändert den Text eines Felds selbst, ohne Modell. Das Ergebnis ist eine
 * gewöhnliche Ersetzung mit `auftrag: 'manuell'`; Speichern, Anwenden, Vorschau, Download
 * und KT1-Sicht bleiben unverändert. Geprüft wird mit denselben Regeln wie ein Vorschlag des
 * Modells (Positivliste, Form, Längenbudget, «Sie»-Anrede) — nur ohne Kommentar und Aufruf.
 *
 * Erste Fassung: nur reine Textfelder (Schema 'T') in Heft A, Heft B und Auftragsbogen.
 * Reine Funktionen, laufen unter `node --test` (scripts/fork/manuell.test.mjs).
 */
import { lesePfad, kanonisch, wertHash, type FassungsDatei } from './adresse.ts'
import { wendeAn, type Ersetzung, type FassungsDateien } from './anwenden.ts'
import { feldFuer, pruefeWert, textMax } from './positivliste.ts'
import { pruefeAnrede } from './pruefungen.ts'

export const MANUELL_DATEIEN: readonly FassungsDatei[] = ['herausforderung_A', 'herausforderung_B', 'set']
export const MANUELL_MAX_ZEICHEN = 5000

/** Darf die Lehrperson dieses Feld selbst bearbeiten? Nur reine Textfelder der Positivliste. */
export function manuellBearbeitbar(datei: string, pfad: string): boolean {
  if (!(MANUELL_DATEIEN as readonly string[]).includes(datei)) return false
  const feld = feldFuer(datei as FassungsDatei, pfad)
  return !!feld && feld.form.schema === 'T'
}

/** Ersetzungen desselben Pfads oder darunter liegender Pfade — die neue Ersetzung verdrängt sie (wie beim Entscheid). */
const verdraengt = (e: Ersetzung, datei: string, pfad: string) =>
  e.datei === datei && (e.pfad === pfad || e.pfad.startsWith(`${pfad}.`) || e.pfad.startsWith(`${pfad}[`))

/** Aktueller Text des Felds in der Fassung (Original, wenn nichts ersetzt ist) und die erlaubte Länge. */
export function jetzigerWert(roh: FassungsDateien, ersetzungen: Ersetzung[], datei: FassungsDatei, pfad: string): { wert: string; max: number } | null {
  if (!manuellBearbeitbar(datei, pfad)) return null
  const original = lesePfad(roh[datei], pfad)
  if (typeof original !== 'string') return null
  const { dateien } = wendeAn(roh, ersetzungen)
  const jetzt = lesePfad(dateien[datei], pfad)
  return { wert: typeof jetzt === 'string' ? jetzt : original, max: textMax([...original].length) }
}

export type ManuellErgebnis =
  | { ok: true; ersetzungen: Ersetzung[]; geaendert: boolean }
  | { ok: false; fehler: string }

/**
 * Prüft eine Handänderung und gibt die neue Liste der Ersetzungen zurück.
 * Text gleich dem Original → die eigene Ersetzung fällt weg («zurück zum Original»).
 */
export function wendeManuellAn(a: {
  roh: FassungsDateien
  ersetzungen: Ersetzung[]
  datei: string
  pfad: string
  wert: unknown
  buendelId: string
}): ManuellErgebnis {
  const { roh, datei, pfad, wert } = a
  if (!manuellBearbeitbar(datei, pfad)) return { ok: false, fehler: 'Dieses Feld lässt sich nicht selbst bearbeiten.' }
  if (typeof wert !== 'string') return { ok: false, fehler: 'Ungültiger Text.' }
  const text = wert.trim()
  if (!text) return { ok: false, fehler: 'Der Text darf nicht leer sein.' }
  if ([...text].length > MANUELL_MAX_ZEICHEN) return { ok: false, fehler: `Der Text ist länger als ${MANUELL_MAX_ZEICHEN} Zeichen.` }
  const d = datei as FassungsDatei
  const original = lesePfad(roh[d], pfad)
  if (typeof original !== 'string') return { ok: false, fehler: 'Dieses Feld gibt es in der Einheit nicht.' }

  const rest = (a.ersetzungen ?? []).filter((e) => !verdraengt(e, d, pfad))
  // Wert an dieser Stelle, nachdem alle übrigen Ersetzungen angewendet sind — daran misst `wendeAn` den Hash.
  const { dateien } = wendeAn(roh, rest)
  const vorher = lesePfad(dateien[d], pfad)
  const jetzt = jetzigerWert(roh, a.ersetzungen ?? [], d, pfad)?.wert
  if (jetzt !== undefined && kanonisch(text) === kanonisch(jetzt)) return { ok: true, ersetzungen: a.ersetzungen ?? [], geaendert: false }
  if (kanonisch(text) === kanonisch(vorher)) return { ok: true, ersetzungen: rest, geaendert: true }

  const grund = pruefeWert(d, pfad, original, text, { methodenRefs: new Set() })
  if (grund) {
    const lang = /zu lang: (\d+) Zeichen, erlaubt (\d+)/.exec(grund)
    if (lang) return { ok: false, fehler: `Der Text ist zu lang für den Platz im Heft: ${lang[1]} Zeichen, höchstens ${lang[2]}.` }
    if (/Lösung/.test(grund)) return { ok: false, fehler: 'Der Text übernimmt einen Teil der Lösung — das gehört nicht in ein Feld für Lernende.' }
    return { ok: false, fehler: 'Dieser Text passt nicht in das Feld.' }
  }
  const feld = feldFuer(d, pfad)!
  if (!feld.lp && pruefeAnrede(text, original)) {
    return { ok: false, fehler: 'Die Einheit spricht die Lernenden mit «Sie» an. Bitte ohne «du», «dein», «dich».' }
  }
  const neu: Ersetzung = { datei: d, pfad, wert: text, original_hash: wertHash(vorher), auftrag: 'manuell', buendel_id: a.buendelId }
  return { ok: true, ersetzungen: [...rest, neu], geaendert: true }
}
