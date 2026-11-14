/**
 * Fork-Pilot — gemeinsame Typen zwischen Server (API), Seite und Workbench-Insel.
 * Festgelegt vom Orchestrator; Grundlage: docs/fork/VERTRAG.md §7–§9.
 * Nur Typen und Konstanten, keine Logik.
 */
import type { SpurKey } from '../einheiten/types'
import type { FassungsDatei } from './adresse.ts'
import type { AuftragKey, Ersetzung, FassungBericht } from './anwenden.ts'

export type { AuftragKey, Ersetzung, FassungBericht, FassungsDatei }

/** Wofür ein Bündel abgeschickt wird — ein Modellaufruf pro Bündel. */
export type BuendelHeft = 'A' | 'B' | 'auftrag' | 'dossier'

export const HEFT_DATEI: Record<BuendelHeft, FassungsDatei> = {
  A: 'herausforderung_A',
  B: 'herausforderung_B',
  auftrag: 'set',
  dossier: 'dossier',
}

/** Ein Kommentar der Lehrperson zu einem markierten Block. */
export interface KommentarEingabe {
  auftrag: AuftragKey
  datei: FassungsDatei
  /** Rohpfad aus `data-feld` (VERTRAG §1). */
  pfad: string
  kommentar: string
}

/** Eine geprüfte, vorgeschlagene Ersetzung — wie `Ersetzung` plus Begründung des Modells. */
export interface VorschlagErsetzung extends Ersetzung {
  begruendung: string
}

/** Ergebnis der Prüfung einer Modellantwort (VERTRAG §4, §6). */
export interface Vorschlag {
  ersetzungen: VorschlagErsetzung[]
  bestaetigt: { pfad: string; begruendung: string }[]
  /** Vom Server verworfen, mit Grund (ausserhalb der Positivliste, Form, Budget, LP-Leck …). */
  verworfen: { datei: string; pfad: string; grund: string }[]
  /** Pflicht-Abhängigkeiten, die weder ersetzt noch bestätigt sind. */
  fehlend: string[]
  /** `fehlend.length === 0` — nur dann wird der Vorschlag zur Übernahme angeboten (4a). */
  vollstaendig: boolean
  hinweis: string
  /** F18: Zahlen, die der Vorschlag nur an einem Teil ihrer Stellen ändert — Warnung, kein Verwerfen. */
  zahlen_warnungen?: { zahl: string; vorher: number; nachher: number; pfade: string[] }[]
}

export type BuendelStatus = 'offen' | 'vorschlag' | 'unvollstaendig' | 'fehler' | 'abgeschlossen'

export type Entscheid = 'angenommen' | 'verworfen'

/** Was der Browser von einem Bündel sieht. Kein Klartext des eigenen Texts. */
export interface BuendelSicht {
  id: string
  heft: BuendelHeft
  status: BuendelStatus
  kommentare: KommentarEingabe[]
  vorschlag: Vorschlag | null
  /** Schlüssel `<datei>:<pfad>`. */
  entscheide: Record<string, Entscheid>
  hat_text: boolean
  /** Bei `fehler`: allgemeine Meldung, nie ein Text des Modells. */
  meldung?: string
  created_at: string
}

export interface FassungSicht {
  einheit_id: string
  nur_spur: SpurKey | null
  ersetzungen: Ersetzung[]
  buendel: BuendelSicht[]
}

/**
 * API (`src/pages/api/fassungen/[einheit]/…`), alle JSON:
 *  GET    /api/fassungen/<einheit>              → { fassung: FassungSicht | null }
 *  POST   /api/fassungen/<einheit>/buendel      multipart: heft, kommentare (JSON KommentarEingabe[]),
 *                                               optional text (string) oder datei (File)
 *                                               → { buendel: BuendelSicht[] }  (bei EBA + eigener_text zwei: Heft + Dossier)
 *  POST   /api/fassungen/<einheit>/entscheid    { buendel_id, entscheide: Record<string, Entscheid> }
 *                                               → { fassung: FassungSicht }
 *  DELETE /api/fassungen/<einheit>              → { ok: true }
 *  Fehler: Status 400/403/404/429/502 mit { fehler: string } (deutsch, für die Oberfläche).
 */

/** Was die Seite `/einheiten/[setKey]` der Workbench-Insel mitgibt (nur kt1 + v4.2). */
export interface ForkProp {
  einheitId: string
  /** `original` = Original; `fassung` = eigene Fassung; `vorschau` = Fassung + Vorschlag eines Bündels. */
  modus: 'original' | 'fassung' | 'vorschau'
  eba: boolean
  fassung: FassungSicht | null
  /** Nur im Modus `vorschau`: das Bündel, dessen Vorschlag angewendet ist. */
  vorschauBuendelId?: string
  /** `data-feld`-Werte, deren Inhalt sich gegenüber dem Original unterscheidet (Hervorhebung). */
  geaendert: string[]
  /** Nur Vorschau: `data-feld`-Werte, die der angezeigte Vorschlag ändert. */
  vorgeschlagen: string[]
  /** Warnungen nach VERTRAG §5 (ohne Fusszeile). */
  warnungen: { code: string; text: string }[]
  bericht: FassungBericht | null
  /** Ziel-Felder je Auftrag als Muster (positivliste.zielFelder) — die Insel prüft damit, welcher Auftrag zu einem Block passt. */
  zielMuster: Record<AuftragKey, string[]>
}

/** Vermerk nach VERTRAG §5 (Fusszeile bzw. Kopfzeile im Word). */
export const VERMERK = 'Angepasst, nicht von KT1 geprüft'

/** Hinweis beim Start (Entscheid Pietro 14.11.2026 + F11). */
export const HINWEIS_START =
  'Ihre Anpassungen und Kommentare werden zugunsten aller Lehrpersonen weiterverarbeitet: KT1 sieht sie und kann gute Anpassungen in die Einheit übernehmen.'
export const HINWEIS_UPLOAD =
  'Laden Sie keine Namen und keine Texte von Lernenden hoch. Kommentare und eigener Text gehen zur Bearbeitung an OpenAI (USA). OpenAI nutzt sie nicht für das Training, kann sie aber bis zu 30 Tage zur Missbrauchskontrolle aufbewahren.'
