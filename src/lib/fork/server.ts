/**
 * Fork-Pilot «Meine Fassung» — gemeinsame Serverteile der API unter
 * `src/pages/api/fassungen/` (VERTRAG §8, §9).
 *
 * Bauweise wie `meldungen`: Session prüfen, Rolle aus `profiles`, dann
 * schreiben nur mit dem Service-Role-Client (Invariante 10). Zugang nur für
 * `darfForken(role)` (Invariante 11) und nur für v4.2-Einheiten (Invariante 12).
 *
 * Die Einheiten-Daten werden erst beim Aufruf geladen (dynamischer Import), damit die
 * reinen Teile dieser Datei unter `node --test` laufen (scripts/fork/server.test.mjs).
 */
import { createAdminClient } from '../supabase.ts'
import { darfForken, istV42Einheit, feldFuer, zielFelder, erlaubtFuerAuftrag, AUFTRAEGE } from './positivliste.ts'
import { HEFT_DATEI } from './typen.ts'
import type { AuftragKey, BuendelHeft, BuendelSicht, BuendelStatus, Entscheid, Ersetzung, FassungSicht, FassungsDatei, KommentarEingabe, Vorschlag } from './typen.ts'
import type { SpurKey } from '../einheiten/types'

export const FASSUNG_BUCKET = 'fassung-texte'
export const MAX_KOMMENTARE = 30
export const MAX_KOMMENTAR_ZEICHEN = 2000
const VORGABE_PRO_TAG = 20

export type Admin = ReturnType<typeof createAdminClient>
export type RohDateien = Record<FassungsDatei, unknown>

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}
/** Fehlerantwort nach `typen.ts`: `{ fehler }`, deutsch, für die Oberfläche. */
export const fehler = (text: string, status: number) => json({ fehler: text }, status)

// --- Zugang (Invarianten 11, 12) --------------------------------------------------------
export type Zugang =
  | { ok: true; userId: string; slug: string; roh: RohDateien; eba: boolean }
  | { ok: false; res: Response }

export async function zugang(locals: App.Locals, slug: string | undefined): Promise<Zugang> {
  if (!locals.user) return { ok: false, res: fehler('Nicht angemeldet.', 401) }
  const { data } = await locals.supabase.from('profiles').select('role').eq('id', locals.user.id).maybeSingle()
  if (!darfForken(data?.role)) return { ok: false, res: fehler('Keine Berechtigung.', 403) }
  const { einheitById, ladeRohdateien, isEbaLehrgang } = await import('../einheiten/index')
  const entry = slug ? einheitById(slug) : undefined
  const roh = slug && entry ? ladeRohdateien(slug) : null
  if (!slug || !entry || !roh) return { ok: false, res: fehler('Einheit nicht gefunden.', 404) }
  if (!istV42Einheit({ A: roh.herausforderung_A, B: roh.herausforderung_B })) {
    return { ok: false, res: fehler('Diese Einheit lässt sich nicht anpassen (nur Einheiten im Format v4.2).', 403) }
  }
  return { ok: true, userId: locals.user.id, slug, roh, eba: isEbaLehrgang(entry.lehrgang) }
}

// --- Eingabe prüfen ---------------------------------------------------------------------
export const ANFRAGE_HEFTE = ['A', 'B', 'auftrag'] as const

/**
 * Kommentare eines Bündels prüfen: 1–30, je ≤ 2000 Zeichen, Datei passt zum Heft,
 * Pfad steht auf der Positivliste, ist ein Ziel des Auftrags (§4) und dort erlaubt.
 */
export function pruefeKommentare(rohText: unknown, heft: string, eba: boolean): { kommentare: KommentarEingabe[] } | { fehler: string } {
  if (!(ANFRAGE_HEFTE as readonly string[]).includes(heft)) return { fehler: 'Unbekanntes Heft.' }
  const datei = HEFT_DATEI[heft as BuendelHeft]
  let liste: unknown
  try { liste = JSON.parse(typeof rohText === 'string' ? rohText : '') } catch { return { fehler: 'Kommentare fehlen oder sind ungültig.' } }
  if (!Array.isArray(liste) || liste.length === 0) return { fehler: 'Mindestens ein Kommentar ist nötig.' }
  if (liste.length > MAX_KOMMENTARE) return { fehler: `Höchstens ${MAX_KOMMENTARE} Kommentare pro Bündel.` }
  const out: KommentarEingabe[] = []
  for (const k of liste) {
    if (!k || typeof k !== 'object') return { fehler: 'Kommentar ungültig.' }
    const { auftrag, datei: d, pfad, kommentar } = k as Record<string, unknown>
    if (typeof auftrag !== 'string' || !(auftrag in AUFTRAEGE)) return { fehler: 'Unbekannter Auftrag.' }
    if (d !== datei) return { fehler: 'Ein Kommentar gehört nicht zu diesem Heft.' }
    if (typeof pfad !== 'string' || typeof kommentar !== 'string') return { fehler: 'Kommentar ungültig.' }
    const text = kommentar.trim()
    if (!text) return { fehler: 'Ein Kommentar ist leer.' }
    if ([...text].length > MAX_KOMMENTAR_ZEICHEN) return { fehler: `Ein Kommentar ist länger als ${MAX_KOMMENTAR_ZEICHEN} Zeichen.` }
    const feld = feldFuer(datei, pfad)
    const a = auftrag as AuftragKey
    if (!feld) return { fehler: 'Dieser Block lässt sich nicht anpassen.' }
    if (!zielFelder(a).includes(feld) || erlaubtFuerAuftrag(a, datei, pfad, { eba }) !== null) {
      return { fehler: `«${AUFTRAEGE[a].label}» passt nicht zu diesem Block.` }
    }
    out.push({ auftrag: a, datei, pfad, kommentar: text })
  }
  return { kommentare: out }
}

/** Nummern der Leitfragen in den Kommentar-Pfaden (für `eigener_text`). */
export function leitfragenAus(kommentare: KommentarEingabe[]): number[] {
  const n = kommentare.map((k) => /leitfragen\[nr=(\d+)\]/.exec(k.pfad)).filter((m): m is RegExpExecArray => !!m).map((m) => Number(m[1]))
  return [...new Set(n)].sort((a, b) => a - b)
}

/** Begriffe des Hefts aus `set.glossar` (F9). */
export function glossarBegriffe(set: unknown, heft: string): string[] {
  const g = (set as { glossar?: { begriff?: unknown; heft?: unknown }[] } | null)?.glossar ?? []
  return [...new Set(g.filter((e) => e?.heft === heft && typeof e.begriff === 'string').map((e) => e.begriff as string))]
}

/** Kennungen der Methodenkartei: Dateinamen unter `src/data/methoden/` ohne `_…`-Dateien. */
export function methodenRefs(): Set<string> {
  const dateien = import.meta.glob('../../data/methoden/*.json', { eager: true })
  return new Set(Object.keys(dateien).map((p) => p.split('/').pop()!.replace(/\.json$/, '')).filter((n) => !n.startsWith('_')))
}

// --- Tagesgrenze (F4, VERTRAG §8) -------------------------------------------------------
function zurichOffsetMs(t: number): number {
  const teile = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zurich', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(t))
  const w = (typ: string) => Number(teile.find((p) => p.type === typ)?.value)
  return Date.UTC(w('year'), w('month') - 1, w('day'), w('hour'), w('minute'), w('second')) - Math.floor(t / 1000) * 1000
}

/** Beginn des heutigen Tags in Europe/Zurich als ISO-Zeitpunkt (UTC). */
export function zurichMitternacht(jetzt: Date = new Date()): string {
  const t = jetzt.getTime()
  const lokal = new Date(t + zurichOffsetMs(t))
  const utcMitternacht = Date.UTC(lokal.getUTCFullYear(), lokal.getUTCMonth(), lokal.getUTCDate())
  // Zürich wechselt die Zeit erst um 02:00/03:00 — um Mitternacht gilt der Offset von UTC-Mitternacht.
  return new Date(utcMitternacht - zurichOffsetMs(utcMitternacht)).toISOString()
}

export function maxAufrufeProTag(): number {
  const roh = (import.meta as { env?: Record<string, string | undefined> }).env?.FORK_MAX_AUFRUFE_PRO_TAG
    ?? (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.FORK_MAX_AUFRUFE_PRO_TAG
  const n = Number.parseInt(roh ?? '', 10)
  return Number.isFinite(n) && n >= 0 ? n : VORGABE_PRO_TAG
}

export async function aufrufeHeute(admin: Admin, userId: string): Promise<number> {
  const { count, error } = await admin.from('einheit_fassung_buendel')
    .select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', zurichMitternacht())
  if (error) throw new Error('Tagesgrenze nicht lesbar')
  return count ?? 0
}

// --- Fassung und Bündel -----------------------------------------------------------------
export interface FassungRow { id: string; user_id: string; einheit_id: string; nur_spur: SpurKey | null; ersetzungen: Ersetzung[] }
export interface BuendelRow {
  id: string; fassung_id: string; user_id: string; heft: BuendelHeft; kommentare: KommentarEingabe[]
  text_pfad: string | null; status: BuendelStatus; vorschlag: Vorschlag | null; entscheide: Record<string, Entscheid>
  modell: string | null; created_at: string
}

export async function ladeFassung(admin: Admin, userId: string, slug: string): Promise<FassungRow | null> {
  const { data, error } = await admin.from('einheit_fassungen').select('*').eq('user_id', userId).eq('einheit_id', slug).maybeSingle()
  if (error) throw new Error('Fassung nicht lesbar')
  return (data as FassungRow | null) ?? null
}

/** Holt die eigene Fassung oder legt sie an; `nurSpur` setzt die Spur fest (F6). */
export async function holeOderLegeFassung(admin: Admin, userId: string, slug: string, nurSpur?: SpurKey): Promise<FassungRow> {
  let f = await ladeFassung(admin, userId, slug)
  if (!f) {
    const { data } = await admin.from('einheit_fassungen').insert({ user_id: userId, einheit_id: slug, nur_spur: nurSpur ?? null }).select('*').maybeSingle()
    // Gleichzeitiger zweiter Aufruf: unique(user_id, einheit_id) greift, dann die bestehende lesen.
    f = (data as FassungRow | null) ?? (await ladeFassung(admin, userId, slug))
    if (!f) throw new Error('Fassung nicht anlegbar')
  }
  if (nurSpur && f.nur_spur !== nurSpur) {
    const { data, error } = await admin.from('einheit_fassungen').update({ nur_spur: nurSpur }).eq('id', f.id).select('*').single()
    if (error || !data) throw new Error('Spur nicht setzbar')
    f = data as FassungRow
  }
  return f
}

/** Allgemeine Meldung bei `fehler` — nie ein Text des Modells (F11). */
export function fehlerMeldung(art?: string): string {
  if (art === 'nicht_konfiguriert') return 'Die Anpassung ist auf dem Server noch nicht eingerichtet.'
  if (art === 'zeitueberschreitung') return 'Der Vorschlag hat zu lange gedauert. Bitte mit weniger Kommentaren noch einmal versuchen.'
  return 'Der Vorschlag konnte nicht erstellt werden. Bitte später noch einmal versuchen.'
}

export function buendelSicht(r: BuendelRow, art?: string): BuendelSicht {
  return {
    id: r.id, heft: r.heft, status: r.status, kommentare: r.kommentare ?? [], vorschlag: r.vorschlag ?? null,
    entscheide: r.entscheide ?? {}, hat_text: !!r.text_pfad, created_at: r.created_at,
    ...(r.status === 'fehler' ? { meldung: fehlerMeldung(art) } : {}),
  }
}

/** Eigene Fassung samt Bündeln (ohne Klartext), oder `null`. */
export async function ladeSicht(admin: Admin, userId: string, slug: string): Promise<FassungSicht | null> {
  const f = await ladeFassung(admin, userId, slug)
  if (!f) return null
  const { data, error } = await admin.from('einheit_fassung_buendel').select('*').eq('fassung_id', f.id).eq('user_id', userId).order('created_at')
  if (error) throw new Error('Bündel nicht lesbar')
  return { einheit_id: f.einheit_id, nur_spur: f.nur_spur, ersetzungen: f.ersetzungen ?? [], buendel: ((data ?? []) as BuendelRow[]).map((r) => buendelSicht(r)) }
}
