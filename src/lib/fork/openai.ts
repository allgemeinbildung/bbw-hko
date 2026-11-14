/**
 * Reiner Transport zur OpenAI Responses API (Fork-Pilot «Meine Fassung»).
 *
 * Vertrag: docs/fork/VERTRAG.md §7, ENTSCHEIDE F4/F10, Invarianten 8 und 9.
 * Baut keinen Prompt (das macht anfrage.ts) und prueft nicht gegen die
 * Positivliste — hier nur: senden, Antwort auspacken, grob gegen das Schema
 * pruefen.
 *
 * Konfiguration (nur Server, nie mit PUBLIC_-Praefix):
 *   OPENAI_API_KEY   geheimer Key
 *   OPENAI_MODEL     Modell-ID (kein Modellname im Code, F4)
 *
 * Der Key wird nie geloggt und erscheint in keiner Rueckgabe, auch nicht
 * teilweise. Fehler von OpenAI werden nur mit Status, `error.type` und
 * `error.code` weitergegeben, nie mit `error.message` oder Request-Inhalt.
 * Kein `user`, keine `metadata`, `store: false` (Invariante 9).
 */
import { getDefaultAutoSelectFamilyAttemptTimeout, setDefaultAutoSelectFamilyAttemptTimeout } from 'node:net'

// Node probiert IPv4/IPv6 abwechselnd und gibt jeder Adresse nur 250 ms (Standard).
// In langsameren Netzen (lokal im Schulnetz belegt, 14.11.2026) laufen alle Versuche
// mit ETIMEDOUT ab, obwohl curl die API erreicht. 2 s pro Adresse genügen. Nur Server.
if (getDefaultAutoSelectFamilyAttemptTimeout() < 2000) setDefaultAutoSelectFamilyAttemptTimeout(2000)

const ENDPUNKT = 'https://api.openai.com/v1/responses'
/** F10: Route laeuft hoechstens 120 s, der Aufruf bricht vorher ab. */
const ZEITLIMIT_MS = 140_000
/** Obergrenze der Ausgabe (inkl. Denk-Tokens bei Reasoning-Modellen). */
const MAX_AUSGABE_TOKENS = 32_000

export interface Ersetzung { datei: string; pfad: string; wert_json: string; begruendung: string }
export interface Bestaetigung { pfad: string; begruendung: string }
export interface ModellAntwort { ersetzungen: Ersetzung[]; bestaetigt: Bestaetigung[]; hinweis: string }

export type ModellFehler = 'nicht_konfiguriert' | 'zeitueberschreitung' | 'abgelehnt' | 'unvollstaendig' | 'http' | 'format'
export type ModellErgebnis =
  | { ok: true; antwort: ModellAntwort; modell: string; nutzung?: { eingabe: number; ausgabe: number; gesamt: number } }
  | { ok: false; fehler: ModellFehler; meldung: string }

/** Antwortschema nach VERTRAG §7, strikt-tauglich: jedes Objekt mit
 *  additionalProperties false, jedes Feld in required, Wurzel ist ein Objekt.
 *  `wert_json` ist ein JSON-Text, weil das strikte Schema kein `any` kennt. */
export const ANTWORT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ersetzungen', 'bestaetigt', 'hinweis'],
  properties: {
    ersetzungen: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['datei', 'pfad', 'wert_json', 'begruendung'],
        properties: {
          datei: { type: 'string' },
          pfad: { type: 'string' },
          wert_json: { type: 'string', description: 'Neuer Wert des Felds als JSON-Text' },
          begruendung: { type: 'string' },
        },
      },
    },
    bestaetigt: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['pfad', 'begruendung'],
        properties: { pfad: { type: 'string' }, begruendung: { type: 'string' } },
      },
    },
    hinweis: { type: 'string' },
  },
} as const

function leseEnv(name: string): string | undefined {
  const astro = (import.meta as { env?: Record<string, string | undefined> }).env?.[name]
  const wert = astro || (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env[name]
  return wert && wert.trim() ? wert.trim() : undefined
}

const fehler = (f: ModellFehler, meldung: string): ModellErgebnis => ({ ok: false, fehler: f, meldung })
const istText = (v: unknown): v is string => typeof v === 'string'
const istObjekt = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

/** Grobe Formpruefung gegen ANTWORT_SCHEMA (Typen und Pflichtfelder). */
export function pruefeAntwort(v: unknown): v is ModellAntwort {
  if (!istObjekt(v) || !Array.isArray(v.ersetzungen) || !Array.isArray(v.bestaetigt) || !istText(v.hinweis)) return false
  const ersOk = v.ersetzungen.every((e) => istObjekt(e) && istText(e.datei) && istText(e.pfad) && istText(e.wert_json) && istText(e.begruendung))
  const bestOk = v.bestaetigt.every((b) => istObjekt(b) && istText(b.pfad) && istText(b.begruendung))
  return ersOk && bestOk
}

export async function frageModell(args: { system: string; nutzer: string; signal?: AbortSignal }): Promise<ModellErgebnis> {
  const key = leseEnv('OPENAI_API_KEY')
  const modell = leseEnv('OPENAI_MODEL')
  if (!key || !modell) return fehler('nicht_konfiguriert', 'OPENAI_API_KEY oder OPENAI_MODEL ist nicht gesetzt.')

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ZEITLIMIT_MS)
  const aussen = () => ctrl.abort()
  if (args.signal?.aborted) ctrl.abort()
  args.signal?.addEventListener('abort', aussen, { once: true })

  let res: Response
  try {
    res = await fetch(ENDPUNKT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      // Bewusst ohne `user`, `metadata`, `safety_identifier`, `prompt_cache_key` (Invariante 9).
      body: JSON.stringify({
        model: modell,
        instructions: args.system,
        input: args.nutzer,
        store: false,
        max_output_tokens: MAX_AUSGABE_TOKENS,
        text: { format: { type: 'json_schema', name: 'fassung_vorschlag', strict: true, schema: ANTWORT_SCHEMA } },
      }),
      signal: ctrl.signal,
    })
  } catch (e) {
    if (ctrl.signal.aborted) {
      return fehler('zeitueberschreitung', args.signal?.aborted ? 'Anfrage abgebrochen.' : `Keine Antwort innert ${ZEITLIMIT_MS / 1000} s.`)
    }
    // Nur den Fehlertyp nennen, nie die Meldung (koennte Header-Inhalt spiegeln).
    return fehler('http', `Netzwerkfehler (${e instanceof Error ? e.name : 'unbekannt'}).`)
  } finally {
    clearTimeout(timer)
    args.signal?.removeEventListener('abort', aussen)
  }

  let json: unknown
  try {
    json = await res.json()
  } catch {
    json = undefined
  }

  if (!res.ok) {
    const err = istObjekt(json) && istObjekt(json.error) ? json.error : {}
    const teile = [istText(err.type) ? `type=${err.type}` : '', istText(err.code) ? `code=${err.code}` : ''].filter(Boolean)
    const retry = res.headers.get('retry-after')
    return fehler('http', `OpenAI HTTP ${res.status}${teile.length ? ` (${teile.join(', ')})` : ''}${retry ? `, Retry-After ${retry}` : ''}.`)
  }
  if (!istObjekt(json)) return fehler('format', 'Antwort ist kein JSON-Objekt.')

  // `output_text` ist laut Referenz nur eine SDK-Bequemlichkeit — wir lesen `output[]`.
  const teile = (Array.isArray(json.output) ? json.output : [])
    .filter((o): o is Record<string, unknown> => istObjekt(o) && o.type === 'message')
    .flatMap((o) => (Array.isArray(o.content) ? o.content : []))
    .filter(istObjekt)
  const ablehnung = teile.find((c) => c.type === 'refusal')
  if (ablehnung) return fehler('abgelehnt', istText(ablehnung.refusal) ? ablehnung.refusal.slice(0, 500) : 'Das Modell hat abgelehnt.')

  if (json.status === 'incomplete') {
    const grund = istObjekt(json.incomplete_details) && istText(json.incomplete_details.reason) ? json.incomplete_details.reason : 'unbekannt'
    return fehler('unvollstaendig', `Antwort unvollstaendig (${grund}).`)
  }
  if (json.status !== 'completed') {
    const code = istObjekt(json.error) && istText(json.error.code) ? `, code=${json.error.code}` : ''
    return fehler('http', `Status ${istText(json.status) ? json.status : 'unbekannt'}${code}.`)
  }

  const text = teile.filter((c) => c.type === 'output_text' && istText(c.text)).map((c) => c.text as string).join('')
  let antwort: unknown
  try {
    antwort = JSON.parse(text)
  } catch {
    return fehler('format', 'Ausgabe ist kein gueltiges JSON.')
  }
  if (!pruefeAntwort(antwort)) return fehler('format', 'Ausgabe entspricht nicht dem Antwortschema.')

  const u = istObjekt(json.usage) ? json.usage : undefined
  const nutzung = u && typeof u.input_tokens === 'number' && typeof u.output_tokens === 'number'
    ? { eingabe: u.input_tokens, ausgabe: u.output_tokens, gesamt: typeof u.total_tokens === 'number' ? u.total_tokens : u.input_tokens + u.output_tokens }
    : undefined
  return { ok: true, antwort, modell: istText(json.model) ? json.model : modell, ...(nutzung ? { nutzung } : {}) }
}
