/**
 * Fork-Pilot — was an OpenAI geht (VERTRAG §7). Entscheid des Orchestrators.
 *
 * Abschliessend: Regeln + Auflagen aus dem Konsistenz-Vertrag (`werkstattKontext`),
 * die ersetzbaren Felder EINES Hefts mit ihrem genauen Pfad, die Kommentare des
 * Bündels, optional der eigene Text und die Pflicht-Abhängigkeiten.
 * Nie: Namen, E-Mail oder ID der Lehrperson (Invariante 9), Lösungen anderer
 * Hefte, KN-Fall, Begleiter, KI-Toolbox.
 *
 * Reine Funktion — kein Netz, kein Env. Aufruf: `src/lib/fork/openai.ts`.
 */
import type { WerkstattKontext } from '../werkstatt/kontext'
import type { FassungsDatei } from './adresse.ts'
import { feldFuer, AUFTRAEGE, type AuftragKey } from './positivliste.ts'

export interface BuendelKommentar {
  auftrag: AuftragKey
  datei: FassungsDatei
  pfad: string
  kommentar: string
}

export interface AnfrageArgs {
  kontext: WerkstattKontext
  datei: FassungsDatei
  /** Rohdatei mit der bisherigen Fassung angewendet. */
  roh: unknown
  kommentare: BuendelKommentar[]
  eigenerText?: string | null
  eba: boolean
  /** Ausgedehnte Pflicht-Abhängigkeiten dieses Hefts (positivliste.pflichtPfade). */
  pflicht: string[]
  /** Begriffe des Hefts aus `set.glossar` — Punkte im Begriffsnetz müssen daraus sein. */
  glossarBegriffe?: string[]
}

/** Listen und ihr Schlüssel (VERTRAG §1). */
const LISTEN_SCHLUESSEL: Record<string, string> = {
  leitfragen: 'nr',
  schritte: 'label',
  feedback_kriterien: 'kn_kriterium',
  methoden: 'ref',
  heft_bezug: 'heft',
  nuggets: 'id',
  sprachmodi_scaffolds: 'tag',
}

export interface Feldauszug {
  pfad: string
  wert: unknown
}

/** Alle konkreten Pfade der Rohdatei, die auf ein Feld der Positivliste fallen — in Dateireihenfolge. */
export function feldauszug(datei: FassungsDatei, roh: unknown): Feldauszug[] {
  const out: Feldauszug[] = []
  const gehe = (wert: unknown, pfad: string) => {
    if (pfad && feldFuer(datei, pfad)) {
      out.push({ pfad, wert })
      return
    }
    if (!wert || typeof wert !== 'object' || Array.isArray(wert)) return
    for (const [k, v] of Object.entries(wert as Record<string, unknown>)) {
      const basis = pfad ? `${pfad}.${k}` : k
      const schluessel = LISTEN_SCHLUESSEL[k]
      if (Array.isArray(v) && schluessel) {
        for (const el of v) {
          const sw = el && typeof el === 'object' ? (el as Record<string, unknown>)[schluessel] : undefined
          if (sw == null || sw === '__spur__') continue
          gehe(el, `${basis}[${schluessel}=${String(sw)}]`)
        }
      } else {
        gehe(v, basis)
      }
    }
  }
  gehe(roh, '')
  return out
}

/** Lesekontext je Leitfrage: was die Lehrperson nicht ändern kann, das Modell aber wissen muss. */
function leitfragenKontext(roh: unknown): string[] {
  const r = roh as { leitfragen?: unknown[]; spuren?: Record<string, { leitfragen?: unknown[] }> }
  const zeilen: string[] = []
  const lf = (l: any, wo: string) => {
    if (!l || typeof l !== 'object') return
    const art = l.antwortform === 'raster' ? `Raster mit ${l.raster?.spalten?.length ?? '?'} Spalten und ${l.raster?.zeilen ?? l.raster?.vorgabe?.length ?? '?'} Zeilen` : l.pol_typ ? `Beurteilen (${l.pol_typ})` : 'Schreibfeld'
    zeilen.push(`- Leitfrage ${l.nr} (${wo}): ${art}${l.bloom ? `, Bloom ${l.bloom}` : ''}`)
  }
  for (const l of r.leitfragen ?? []) lf(l, 'Kern, gilt in jeder Spur')
  for (const [s, sp] of Object.entries(r.spuren ?? {})) for (const l of sp?.leitfragen ?? []) lf(l, `Spur ${s}`)
  return zeilen
}

function liste(xs: (string | undefined | null)[]): string {
  return xs.filter(Boolean).map((x) => `- ${x}`).join('\n')
}

export function baueAnfrage(a: AnfrageArgs): { system: string; nutzer: string } {
  const k = a.kontext
  const niveau = a.eba
    ? 'Sprachniveau A2: kurze Hauptsätze (höchstens 12 Wörter), ein Gedanke pro Satz, Alltagswörter, Fachwörter nur aus dem Glossar, direkte Anrede «du» nur dort, wo das Original sie benutzt.'
    : 'Sprachniveau B1: klare Sätze (höchstens 20 Wörter), Fachwörter nur dort, wo das Original sie benutzt, Anrede wie im Original.'
  const auftraege = [...new Set(a.kommentare.map((c) => c.auftrag))]

  const system = [
    'Sie passen ein Unterrichtsheft der Allgemeinbildung (Berufsfachschule Schweiz, Reform ABU 2030) für EINE Lehrperson an. Das Heft ist in Felder zerlegt; Sie dürfen nur die aufgeführten Felder ersetzen.',
    '',
    'Regeln für jede Ersetzung:',
    `- ${niveau}`,
    '- Schweizer Schreibweise: «ss» statt Eszett, echte Umlaute, Guillemets «…».',
    '- Keine Namen realer Personen, keine Daten von Lernenden.',
    '- Gleiche Form wie das Original: gleiche Felder im Objekt, gleiche Anzahl Listeneinträge, gleiche Abstufung bei den vier Stufen eines Kriteriums. Höchstens 15 Prozent länger als das Original.',
    '- Felder, die nur die Lehrperson sieht (Lösungen, Erwartungshorizont, Lösungsbild, abschluss.loesung, loesung_zeilen), bleiben dort. Kein Lösungstext in ein Feld für Lernende.',
    '- Die fünf Schritte des Handlungsprodukts behalten ihr Label; nur der Hinweis («hint») darf sich ändern.',
    '- Methoden: ein Eintrag `methoden[ref=…]` wird ganz ersetzt; `ref` darf nur auf eine bestehende Karte zeigen, wenn Sie die Karte wechseln.',
    a.glossarBegriffe?.length ? `- Punkte im Begriffsnetz (mindmap_aeste.punkte) nur aus diesen Begriffen: ${a.glossarBegriffe.join(', ')}.` : '',
    '- Jeder Pfad in Ihrer Antwort muss exakt einer der Pfade aus der Feldliste sein.',
    '- `wert_json` ist der neue Wert als JSON-Text (Zeichenkette in Anführungszeichen, Liste oder Objekt — wie das Original).',
    '- Jeder Pfad unter «Pflicht-Abhängigkeiten» muss in Ihrer Antwort vorkommen: entweder ersetzt (in «ersetzungen») oder ausdrücklich als weiter passend bestätigt (in «bestaetigt», mit Begründung in einem Satz). Fehlt einer, wird der ganze Vorschlag verworfen.',
    '',
    'Konsistenz mit der Einheit (Auflagen, nicht verhandelbar):',
    liste([
      k.kompetenzversprechen && `Kompetenzversprechen: ${k.kompetenzversprechen}`,
      k.ankerStatement && `Anker der Einheit: ${k.ankerStatement}`,
      k.mehrdeutigkeitVerbindlich && `Verbindliche Mehrdeutigkeit: ${k.mehrdeutigkeitVerbindlich}`,
      k.tradeOffRaum?.length ? `Spannungsfelder: ${k.tradeOffRaum.join(' · ')}` : '',
      k.bloom?.length ? `Bloom-Profil: ${k.bloom.map((b) => `${b.lf} ${b.stufe}`).join(', ')}` : '',
      k.aspekte?.length ? `Gesellschaftsaspekte: ${k.aspekte.map((x) => `${x.aspekt} (${x.r})`).join(', ')}` : '',
      k.kompetenzen?.length ? `Kompetenzen: ${k.kompetenzen.map((x) => `${x.nr} ${x.text}`).join(' | ')}` : '',
    ]),
    '',
    'Aufträge in diesem Bündel:',
    liste(auftraege.map((x) => `${x}: ${AUFTRAEGE[x]?.beschreibung ?? ''}`)),
  ].filter((z) => z !== '').join('\n')

  const felder = feldauszug(a.datei, a.roh)
  const nutzer = [
    `Datei: ${a.datei} (${k.einheitTitel}, ${k.lehrgangLabel})`,
    '',
    'Leitfragen (nicht änderbar, zur Orientierung):',
    leitfragenKontext(a.roh).join('\n') || '- keine',
    '',
    'Feldliste (Pfad und aktueller Wert; nur diese Pfade sind ersetzbar):',
    ...felder.map((f) => `### ${f.pfad}\n${JSON.stringify(f.wert)}`),
    '',
    'Kommentare der Lehrperson:',
    ...a.kommentare.map((c) => `- [${c.auftrag}] ${c.datei}:${c.pfad} — ${c.kommentar.trim()}`),
    '',
    'Pflicht-Abhängigkeiten (ersetzen oder bestätigen):',
    a.pflicht.length ? liste(a.pflicht) : '- keine',
    ...(a.eigenerText
      ? ['', 'Eigener Text der Lehrperson (Grundlage für die neuen Leitfragen und Lösungen; nur daraus zitieren):', '"""', a.eigenerText, '"""']
      : []),
  ].join('\n')

  return { system, nutzer }
}
