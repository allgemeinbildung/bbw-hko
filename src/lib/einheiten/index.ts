import indexJson from '../../data/einheiten.index.json'
import type { EinheitIndexEntry, EinheitFullSet, SituationJson, KnJson, PrinzipJson, SetJson, BegleiterMeta, KiJson, LernpromptJson, LernbegleiterJson, DossierJson, MethodeRef, QuelleRef, SpurKey } from './types'
import { lehrgaengeOf } from './lehrgang'
import { resolveMethoden } from './methoden'
import { resolveQuellen } from './quellen'
import { SPUR_KEYS, effektiveSpur, isV42, resolveSpur, spurenVerfuegbar } from './spuren'
import { withLeitfragenLoesungen } from './begleiter-loesungen'
import { withFeldern } from './begleiter-felder'

export * from './lehrgang'
export { methodeKarte, alleMethodenKarten, resolveMethoden } from './methoden'
export { quelleKarte, alleQuellenKarten, resolveQuellen } from './quellen'
export * from './spuren'

export const einheitenIndex = indexJson as EinheitIndexEntry[]

export function einheitById(id: string): EinheitIndexEntry | undefined {
  return einheitenIndex.find((e) => e.id === id)
}

// ---------------------------------------------------------------------------
// Sichtbarkeit / KT1-only Drafts
// ---------------------------------------------------------------------------
// Zwei Schalter (beide in set.json, beide optional, default = live für alle):
//   • status: 'entwurf'            → ganze Einheit nur für KT1 (neue Einheit)
//   • status: 'archiviert'         → ganze Einheit nur für KT1 (abgelöste Einheit, E37);
//                                    optional `ersetzt_durch: "<ordner>"` = Nachfolgerin
//   • entwurf_komponenten: [...]   → einzelne Bausteine nur für KT1 (selektiv)
// KT1 sieht immer alles (mit Badge); lp/gast sehen nur Publiziertes.
// Ausnahme: die QR-Seite /m/<ordner> fragt den Status nicht — gedruckte Hefte
// müssen funktionieren, auch wenn die Einheit Entwurf oder archiviert ist.

export type Role = 'lp' | 'kt1' | 'gast'

/** Bausteine-Gruppen: ein Toggle deckt mehrere Set-Dateien ab. */
export const KOMPONENTEN_GRUPPEN: Record<string, (keyof EinheitFullSet)[]> = {
  'ki-fluency': ['ki', 'lernprompt', 'lernbegleiter', 'kiLiesmich'],
}

/** Menschlich lesbares Label für die KT1-Entwürfe-Übersicht. */
export const KOMPONENTEN_LABEL: Record<string, string> = {
  'ki-fluency': 'KI-Toolbox',
}

export function isEntwurf(entry: Pick<EinheitIndexEntry, 'status'>): boolean {
  return entry.status === 'entwurf'
}

/** Abgelöste Einheit: bleibt im Repo (gedruckte Hefte, Feedback, Statistik), ist aber nur für KT1 sichtbar. */
export function isArchiviert(entry: Pick<EinheitIndexEntry, 'status'>): boolean {
  return entry.status === 'archiviert'
}

/** Ganze Einheit nur für KT1 — Entwurf ODER archiviert. Die eine Schranke für Katalog und Direkt-URLs. */
export function istNurKt1(entry: Pick<EinheitIndexEntry, 'status'>): boolean {
  return isEntwurf(entry) || isArchiviert(entry)
}

export function draftKomponenten(entry: Pick<EinheitIndexEntry, 'entwurf_komponenten'>): string[] {
  return Array.isArray(entry.entwurf_komponenten) ? entry.entwurf_komponenten : []
}

/** Katalog-Filter: KT1 sieht alle Einheiten, lp/gast nur publizierte. */
export function visibleEinheiten<T extends Pick<EinheitIndexEntry, 'status'>>(list: T[], role: Role): T[] {
  if (role === 'kt1') return list
  return list.filter((e) => !istNurKt1(e))
}

/** Ist ein Baustein-Gruppen-Key für diese Rolle sichtbar? */
export function isKomponenteSichtbar(entry: Pick<EinheitIndexEntry, 'entwurf_komponenten'>, gruppe: string, role: Role): boolean {
  if (role === 'kt1') return true
  return !draftKomponenten(entry).includes(gruppe)
}

/**
 * Entfernt Entwurf-Bausteine aus einem geladenen Set, bevor es an die (öffentliche)
 * Workbench geht. Für KT1 unverändert; für lp/gast werden die zu jeder Entwurf-Gruppe
 * gehörenden Dateien auf null gesetzt (KI-Tab + ZIP-Dateien verschwinden).
 */
export function stripDraftComponents(set: EinheitFullSet, entry: Pick<EinheitIndexEntry, 'entwurf_komponenten'>, role: Role): EinheitFullSet {
  if (role === 'kt1') return set
  const drafts = draftKomponenten(entry)
  if (drafts.length === 0) return set
  const out = { ...set }
  for (const gruppe of drafts) {
    for (const key of KOMPONENTEN_GRUPPEN[gruppe] ?? []) {
      ;(out as Record<string, unknown>)[key] = null
    }
  }
  return out
}

export function prettifyId(id: string): string {
  const m = id.match(/^([\d.]+)_(.+)$/)
  if (!m) return id.replace(/_/g, ' ')
  return `${m[1]} · ${m[2].replace(/_/g, ' ')}`
}

// Eagerly import every set file at build time so /einheiten/[setKey] pages can
// serialize the full set into the client island without filesystem access at
// request time. Vite supports import.meta.glob with { eager: true } in SSR.
// Path is relative to this file.
const sitFiles = import.meta.glob('../../data/einheiten/*/*.json', { eager: true }) as Record<string, { default: unknown }>
const begleiterFiles = import.meta.glob('../../data/einheiten/*/begleiter.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>
const kiLiesmichFiles = import.meta.glob('../../data/einheiten/*/ki-liesmich.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

function pickJson<T>(slug: string, name: string): T | null {
  for (const [path, mod] of Object.entries(sitFiles)) {
    if (path.endsWith(`/${slug}/${name}.json`)) return (mod.default as T) ?? null
  }
  return null
}

function parseFrontmatter(raw: string): { meta: BegleiterMeta; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return { meta: {}, body: raw }
  const meta: BegleiterMeta = {}
  m[1].split(/\r?\n/).forEach((line) => {
    if (!line.trim() || line.trim().startsWith('#')) return
    const km = /^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/.exec(line)
    if (!km) return
    let v = km[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    meta[km[1]] = v
  })
  return { meta, body: raw.slice(m[0].length) }
}

/**
 * Löst `methoden` von Kürzeln auf volle Karten auf — einmal, hier, bevor die Daten
 * irgendeinen Renderer erreichen. Danach sehen HTML, Word und ZIP dieselbe aufgelöste
 * Form, und niemand sonst muss die Kartei kennen.
 */
function withMethoden(sit: SituationJson | null): SituationJson | null {
  if (!sit) return null
  // Auf der Platte steht MethodeRef[], im Typ steht Methode[] — der eine Ort, an dem
  // die beiden Stadien aufeinandertreffen.
  const refs = sit.methoden as unknown as MethodeRef[] | undefined
  if (!refs?.length) return sit
  return { ...sit, methoden: resolveMethoden(refs) }
}

/**
 * Heft v4.2: löst `quellen` (Kürzel aus der eingesetzten Medien-Spur) gegen die
 * Quellenkartei auf — dasselbe Muster wie `withMethoden`. Nur für v4.2-Hefte; jedes
 * andere Heft kommt unverändert zurück, auch wenn es zufällig ein Feld `quellen` hätte.
 */
function withQuellen(sit: SituationJson | null): SituationJson | null {
  if (!sit || !isV42(sit)) return sit
  // Auf der Platte QuelleRef[], im Typ Quelle[] — wie bei `methoden`.
  const refs = sit.quellen as unknown as QuelleRef[] | undefined
  if (!Array.isArray(refs)) return sit
  return { ...sit, quellen: resolveQuellen(refs) }
}

/**
 * Ein Heft vom Rohzustand bis zur Renderer-Form (ENTSCHEIDE E3): erst die Spur
 * einsetzen (`resolveSpur`, dabei wandert die Rezeptionskarte als Referenz an Position 2
 * von `methoden`), dann die Karteien auflösen. Für Hefte ohne v4.2-Template gibt
 * `resolveSpur` dasselbe Objekt zurück und `withQuellen` ebenso — übrig bleibt exakt
 * der Bestandsweg `withMethoden`.
 */
function ladeHeft(sit: SituationJson | null, spur: SpurKey, set?: SetJson | null): SituationJson | null {
  return withGlossar(withQuellen(withMethoden(resolveSpur(sit, spur))), set, spur)
}

/**
 * Heft v4.2: setzt das Glossar des Hefts ein — die Einträge aus `set.glossar` mit dem
 * Buchstaben des Hefts, ohne `spur` oder mit der eingesetzten Spur. Eine Quelle für
 * beide Verwendungen (Begriffsnetz und Glossar auf S. 8). Bestandshefte bleiben unberührt.
 */
function withGlossar(sit: SituationJson | null, set: SetJson | null | undefined, spur: SpurKey): SituationJson | null {
  if (!sit || !isV42(sit) || !set?.glossar?.length) return sit
  const glossar = set.glossar.filter((g) => g.heft === sit.buchstabe && (!g.spur || g.spur === spur))
  return glossar.length ? { ...sit, glossar } : sit
}

export interface LoadEinheitOptions {
  /** v4.2: gewünschte Spur. Ohne Angabe gilt `set.spur` (falls nicht `wahl`), sonst `DEFAULT_SPUR`. */
  spur?: SpurKey
}

export function loadEinheit(slug: string, opts?: LoadEinheitOptions): EinheitFullSet | null {
  if (!einheitById(slug)) return null
  const setRaw = pickJson<SetJson>(slug, 'set')
  const rohA = pickJson<SituationJson>(slug, 'herausforderung_A')
  const rohB = pickJson<SituationJson>(slug, 'herausforderung_B')
  const rohC = pickJson<SituationJson>(slug, 'herausforderung_C')

  // v4.2: jede Spur, die mindestens ein Heft führt, wird fertig aufgelöst. Die
  // Verdopplung des Kerns entsteht erst hier, im Speicher — nie auf der Platte.
  // Bestandseinheiten haben keine Spur: `varianten` bleibt leer, und das Ergebnis
  // bekommt weder `spur` noch `spur_varianten`.
  const varianten: NonNullable<EinheitFullSet['spur_varianten']> = {}
  for (const key of SPUR_KEYS) {
    if (![rohA, rohB].some((h) => spurenVerfuegbar(h).includes(key))) continue
    varianten[key] = { hf_A: ladeHeft(rohA, key, setRaw), hf_B: ladeHeft(rohB, key, setRaw) }
  }
  const verfuegbar = Object.keys(varianten) as SpurKey[]
  const wunsch = effektiveSpur(setRaw, opts?.spur)
  // Hat keines der Hefte die gewünschte Spur, gilt die erste vorhandene (Leitfaden §4.4).
  const spur: SpurKey | null = verfuegbar.length ? (verfuegbar.includes(wunsch) ? wunsch : verfuegbar[0]) : null

  // Die wirksame Spur ist dieselbe Instanz wie in `spur_varianten` — nichts wird doppelt aufgelöst.
  const hf_A = spur ? varianten[spur]!.hf_A : ladeHeft(rohA, wunsch)
  const hf_B = spur ? varianten[spur]!.hf_B : ladeHeft(rohB, wunsch)
  const hf_C = ladeHeft(rohC, spur ?? wunsch)
  const rawFile = Object.entries(begleiterFiles).find(([path]) => path.endsWith(`/${slug}/begleiter.md`))?.[1]
  // Die Leitfragen-Lösungen leben in den Herausforderungs-JSONs (C10) und werden hier
  // einmal in den Begleiter gespiegelt — danach sehen HTML, Word und ZIP dieselbe Form.
  // Davor werden die Feld-Marker (`<!--hko:…-->`) aufgelöst: Persona, Situationstext,
  // KN-Szene und KN-Fragen stehen kanonisch in den JSONs, der Begleiter zitiert sie nur.
  // Reihenfolge: erst Felder, dann Lösungen — letztere fügen ganze Blöcke ein und
  // sollen dabei bereits aufgelöste Marker sehen.
  // v4.2: Der Begleiter darf nicht davon abhängen, welche Spur wirksam ist. Die Lösungen
  // kommen darum aus den Rohheften (Kern + beide Spuren), der Quellen-Stand aus der
  // aufgelösten Medien-Spur. Bestandseinheiten (`spur` null) laufen wie bisher.
  const knRaw = pickJson<KnJson>(slug, 'kn')
  const prinzipRaw = pickJson<PrinzipJson>(slug, 'prinzip')
  const medien = varianten.mit_medien
  const raw = rawFile
    ? withLeitfragenLoesungen(
        withFeldern(rawFile, {
          hf_A, hf_B, hf_C, kn: knRaw, set: setRaw, prinzip: prinzipRaw,
          ...(medien ? { quellen: { A: medien.hf_A?.quellen ?? [], B: medien.hf_B?.quellen ?? [] } } : {}),
        }),
        spur ? [rohA, rohB, rohC] : [hf_A, hf_B, hf_C]
      )
    : undefined
  const begleiter = raw ? { raw, ...parseFrontmatter(raw) } : null
  const kiRaw = Object.entries(kiLiesmichFiles).find(([path]) => path.endsWith(`/${slug}/ki-liesmich.md`))?.[1]
  const kiLiesmich = kiRaw ? { raw: kiRaw, ...parseFrontmatter(kiRaw) } : null
  return {
    id: slug,
    hf_A,
    hf_B,
    hf_C,
    kn: knRaw,
    prinzip: prinzipRaw,
    set: setRaw,
    begleiter: begleiter ? { raw: begleiter.raw, meta: begleiter.meta } : null,
    kiLiesmich: kiLiesmich ? { raw: kiLiesmich.raw, meta: kiLiesmich.meta } : null,
    ki: pickJson<KiJson>(slug, 'ki'),
    lernprompt: pickJson<LernpromptJson>(slug, 'lernprompt'),
    lernbegleiter: pickJson<LernbegleiterJson>(slug, 'lernbegleiter'),
    dossier: pickJson<DossierJson>(slug, 'dossier'),
    // Nur v4.2 — bei Bestandseinheiten fehlen beide Schlüssel ganz (Invariante 4).
    ...(spur ? { spur, spur_varianten: varianten } : {}),
  }
}

export const ABTEILUNGEN = [
  '',
  'Abteilung Bau',
  'Abteilung Technik | Ernährung',
  'Abteilung Maschinenbau',
  'Abteilung Informatik | Naturwissenschaften',
]

export interface EinheitenFilters {
  thema_nr: string
  lehrgang: string
  aspekt: string
  sk: string
  q: string
}

export function emptyEinheitenFilters(): EinheitenFilters {
  return { thema_nr: '', lehrgang: '', aspekt: '', sk: '', q: '' }
}

export function applyEinheitenFilters(list: EinheitIndexEntry[], f: EinheitenFilters): EinheitIndexEntry[] {
  const qWords = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return list.filter((e) => {
    if (f.thema_nr && String(e.thema_nr ?? '') !== f.thema_nr) return false
    // Eine Einheit kann für mehrere Lehrgänge gelten (z. B. 1.1.1 ist in 3J und 4J
    // nummern- und textgleich) — deshalb Treffer auf der ganzen Liste, nicht nur
    // auf dem kanonischen Lehrgang.
    if (f.lehrgang && !lehrgaengeOf(e).includes(f.lehrgang)) return false
    if (f.aspekt && !e.aspekte.includes(f.aspekt)) return false
    if (f.sk && !e.sk.map(String).includes(f.sk)) return false
    if (qWords.length) {
      const hay = `${e.id} ${e.einheit_titel} ${e.titel} ${e.kompetenz_nr} ${(e.abgedeckte_kompetenzen ?? []).join(' ')} ${e.aspekte.join(' ')} ${e.modul_titel ?? ''}`.toLowerCase()
      if (!qWords.every((w) => hay.includes(w))) return false
    }
    return true
  })
}
