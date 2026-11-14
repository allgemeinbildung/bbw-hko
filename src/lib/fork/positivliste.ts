/**
 * Fork-Pilot «Meine Fassung» — Positivliste (VERTRAG §3), Aufträge (§4),
 * Warnungen (§5), Budgets und Formprüfung (§6).
 *
 * Invariante 4: Dies ist die EINE Stelle im Code, an der steht, was eine Fassung
 * ersetzen darf. Alles, was `feldFuer` nicht kennt, verwirft der Server.
 * Läuft auch im Browser: keine Node-Importe, die Methodenkartei kommt als Parameter.
 */
import { parsePfad, lesePfad, formatPfad, kanonisch, type FassungsDatei, type Schluessel, type Segment } from './adresse.ts'
import type { SpurKey } from '../einheiten/types.ts'
export type AuftragKey = 'leitfrage_umformulieren' | 'eigener_text' | 'situation_umformulieren' | 'handlungsprodukt_aendern'
export const AUFTRAEGE: Record<AuftragKey, { label: string; beschreibung: string }> = {
  leitfrage_umformulieren: { label: 'Leitfrage umformulieren', beschreibung: 'Eine Leitfrage anders stellen. Die gespeicherte Lösung bleibt und muss weiter passen.' },
  eigener_text: { label: 'Eigenen Text verwenden', beschreibung: 'Leitfragen auf einen eigenen Text stützen statt auf das Lehrmittel. Gilt nur für die Spur ohne Medien.' },
  situation_umformulieren: { label: 'Situation umformulieren', beschreibung: 'Person, Betrieb und Fall anpassen. Lösungen, Beispiel und Begriffsnetz ziehen mit.' },
  handlungsprodukt_aendern: { label: 'Handlungsprodukt ändern', beschreibung: 'Ein anderes Produkt herstellen lassen. Schritte, Kriterien, Methoden und Beispiel ziehen mit.' },
}
const TEMPLATE_V42 = 'heft_8page_v42'
const SPUREN: SpurKey[] = ['ohne_medien', 'mit_medien']

// --- Form ---------------------------------------------------------------------------
/** 'T' Text · 'B' Wahrheitswert · 'Z' Zahl · [S] Liste · { k: S, 'k?': S } Objekt. */
export type Schema = 'T' | 'B' | 'Z' | Schema[] | { [k: string]: Schema }
export type Budget = 'text' | 'liste' | 'objekt' | 'elemente' | 'keins'
export type Spezial = 'blockart' | 'methode' | 'mindmap' | 'nugget' | 'glossar_ids' | 'vokabeln' | 'schrittnummern'
export interface Form {
  schema: Schema; budget: Budget
  /** Relative Pfade, deren Wert gleich bleiben muss: `[]` je Element, `#` Anzahl, `-1` letztes Element. */
  fix?: string[]
  /** Erlaubte Anzahl der Liste (inklusive). */
  anzahl?: [number, number]
  spezial?: Spezial[]
}
export interface Feld {
  nr: string; datei: 'heft' | 'set' | 'dossier'; muster: string; form: Form
  /** Feld nur für die Lehrperson (Invariante 6). `block` = Block im Heft (VERTRAG §3, Spalte data-feld). */
  lp: boolean; block: string
  /** Teilfelder eines Lernenden-Felds, die nur die Lehrperson sieht (H19, H36). */
  lpTeile?: string[]
  /** Nur bei EBA (H32, Teile von G10). */
  nurEba?: boolean
}
const PERSONA: Schema = { beruf: 'T', betrieb: 'T', ort: 'T' }
const ZAHLEN: Schema = [{ label: 'T', wert: 'T' }]
const ERWARTUNG: Schema = { 'gut_wenn?': ['T'], 'beispiel_pol_1?': 'T', 'beispiel_pol_2?': 'T', 'tragfaehig?': 'T', 'nicht_tragfaehig?': 'T' }
const LOESUNG: Schema = { 'kern?': 'T', 'zeilen?': [{ 'label?': 'T', text: 'T', 'quelle?': 'T' }], 'quelle_ref?': 'T', 'quelle_stand?': 'T',
  'erwartungshorizont?': ERWARTUNG, 'raster_zeilen?': [['T']], 'befund?': 'T' }
const BILD: Schema = {
  titel: 'T', 'hinweis?': 'T', 'legende?': [{ key: 'T', text: 'T' }], bloecke: [{ titel: 'T', 'eintraege?': [{ text: 'T', 'marke?': 'T', 'notiz?': 'T' }], 'kopf?': ['T'],
    'zeilen?': [{ zellen: ['T'], 'marke?': 'T', 'stark?': 'B' }], 'text?': ['T'], 'wechsel?': [{ wer: 'T', text: 'T', 'marke?': 'T' }] }],
}
const T: Form = { schema: 'T', budget: 'text' }
/** Ganze Schrittliste (F14): gleiche Anzahl, je Label dieselbe Nummer, Budget wie Objektliste. */
const SCHRITTE: Form = { schema: [{ label: 'T', hint: 'T' }], budget: 'objekt', fix: ['#'], spezial: ['schrittnummern'] }
const tl = (anzahl?: [number, number], fix?: string[]): Form => ({ schema: ['T'], budget: 'liste', anzahl, fix })
const ob = (schema: Schema, fix?: string[], spezial?: Spezial[]): Form => ({ schema, budget: 'objekt', fix, spezial })
type Roh = [nr: string, muster: string, form: Form, block: string, extra?: Partial<Feld>]
const LF = ['leitfragen[nr=*]', 'spuren.<s>.leitfragen[nr=*]']
const lf = (nr: string, rest: string, form: Form, block: string, extra?: Partial<Feld>): Roh[] =>
  LF.map((p) => [nr, `${p}.${rest}`, form, block, extra] as Roh)
const HEFT: Roh[] = [
  ['H1', 'titel', T, 'S1 Kopf'],
  ['H2', 'persona', ob(PERSONA), 'S1 Kopf'],
  ['H3', 'situation_text', T, 'S1 Situation'],
  ['H4', 'zahlen_tabelle', ob(ZAHLEN, ['#']), 'S1 Situation'],
  ['H5', 'leitfrage', T, 'S1 Situation'],
  ['H6', 'mehrdeutigkeit.hint', T, 'S1 Spannungsfeld'],
  ['H7', 'wochen_plan', ob([{ label: 'T', text: 'T', aktiv: 'B' }], ['#', '[].label', '[].aktiv']), 'S1 Übersicht'],
  ['H8', 'quellen_anker', { schema: [{ ref: 'T', titel: 'T', 'unterueberschrift?': 'T', 'seiten?': 'T', 'fuer_leitfrage?': ['Z'] }], budget: 'elemente', anzahl: [1, 3] }, 'S1 Im Lehrmittel'],
  ['H9', 'leitfragen_intro', T, 'S2 Intro'],
  ...lf('H10', 'text', T, 'LF n'),
  ...lf('H11', 'liefert', T, 'LF n'),
  ...lf('H12', 'knoten_ref', T, 'LF n'),
  ...lf('H13', 'scaffolding', ob({ 'strategien?': ['T'], 'satzanfaenge?': ['T'], 'produkt?': 'T' }, ['strategien.#', 'satzanfaenge.#']), 'LF n Hilfe'),
  ...lf('H14', 'loesung', ob(LOESUNG, ['raster_zeilen.[].#']), 'LF n Lösung', { lp: true }),
  ['H15', 'spuren.<s>.leitfragen[nr=*].raster.auftrag', T, 'S3 Auftrag'],
  ['H16', 'spuren.ohne_medien.leitfragen[nr=*].raster.knoten_ref', T, 'S3 Auftrag'],
  ['H17', 'spuren.<s>.leitfragen[nr=*].raster.spalten', tl(undefined, ['#', '-1']), 'S3 Raster'],
  ['H18', 'spuren.ohne_medien.leitfragen[nr=*].raster.beispielzeile', tl(undefined, ['#']), 'S3 Raster'],
  ['H19', 'spuren.ohne_medien.kasten_s4', ob({ typ: 'T', titel: 'T', 'spalten?': ['T'], 'hinweis?': 'T', 'loesung_zeilen?': [['T']] }, ['typ', 'spalten.#']), 'S4 Kasten', { lpTeile: ['loesung_zeilen'] }],
  ['H20', 'spuren.<s>.scaffold_90', T, 'Lösungen/Begleitung'],
  ['H21', 'lernfortschritt.scaffold_90', T, 'S5/7 Plus'],
  ['H21', 'lernfortschritt.scaffold_100', T, 'S5/7 Plus'],
  ['H22', 'handlungsprodukt.titel', T, 'S5 Auftrag'],
  ['H23', 'handlungsprodukt.format', T, 'S5 Auftrag'],
  ['H23', 'handlungsprodukt.format_detail', T, 'S5 Auftrag'],
  ['H23', 'handlungsprodukt.beschreibung', T, 'S5 Auftrag'],
  ['H24', 'handlungsprodukt.schritte[label=*].hint', T, 'S5 Schritt n'],
  ['H24L', 'handlungsprodukt.schritte', SCHRITTE, 'S5 Schritte'],
  ['H25', 'handlungsprodukt.hilfe_verweis', T, 'S5'],
  ['H25', 'handlungsprodukt.schreib_label', T, 'S5'],
  ['H25', 'handlungsprodukt.schreib_note', T, 'S5'],
  ['H26', 'handlungsprodukt.abgaben', tl([1, 4]), 'S5 Abgabe'],
  ['H27', 'handlungsprodukt.scaffolding', ob({ 'satzanfaenge?': ['T'], 'strategien?': ['T'], 'struktur?': ['T'] }), 'S5'],
  ['H28', 'handlungsprodukt.beispielbild', ob(BILD, undefined, ['blockart']), 'S6 Beispiel'],
  ['H29', 'handlungsprodukt.loesungsbild', ob(BILD, undefined, ['blockart']), 'Lösungen', { lp: true }],
  ['H30', 'feedback_kriterien[kn_kriterium=*].indikator_produkt', T, 'S5/7 Kriterium'],
  ['H31', 'feedback_kriterien[kn_kriterium=*].stufen', tl([4, 4]), 'S5/7 Kriterium'],
  ['H32', 'feedback_kriterien[kn_kriterium=*].name_lernende', T, 'S7 Kriterium', { nurEba: true }],
  ['H32', 'feedback_kriterien[kn_kriterium=*].stufen_lernende', tl([4, 4]), 'S7 Kriterium', { nurEba: true }],
  ['H33', 'methoden[ref=*]', ob({ ref: 'T', 'fuer?': 'T', 'tun?': 'T', 'beispiel?': ['T'] }, undefined, ['methode']), 'S6 Karte'],
  ['H34', 'mindmap_zentrum', T, 'S8 Netz'],
  ['H35', 'mindmap_aeste', ob([{ titel: 'T', 'punkte?': ['T'], 'optional?': 'B', 'transfer?': 'B' }], ['#', '[].transfer', '[].optional'], ['mindmap']), 'S8 Netz'],
  ['H36', 'abschluss', ob({ 'quercheck?': ['T'], 'mitnahme?': ['T'], 'loesung?': { 'verbindungen?': [{ von: 'T', nach: 'T', text: 'T' }], 'transfer?': 'T', 'eigene_knoten?': { 'ohne_medien?': ['T'], 'mit_medien?': ['T'] }, 'quercheck?': ['T'], 'mitnahme?': ['T'] } }, ['quercheck.#', 'mitnahme.#']), 'S8 Abschluss', { lpTeile: ['loesung'] }],
  ['H37', 'bewertungsraster', ob([{ produkt: 'T', vollstaendig_wenn: ['T'] }], ['#']), 'S8 Checkliste'],
]
const GA = 'gemeinsamer_auftrag'
const KRIT = `${GA}.feedback_kriterien[kn_kriterium=*]`
const SET: Roh[] = [
  ['G1', `${GA}.titel`, T, 'Auftragsbogen'],
  ['G2', `${GA}.persona`, ob(PERSONA), 'Auftragsbogen'],
  ['G3', `${GA}.situation_text`, T, 'Auftragsbogen'],
  ['G4', `${GA}.zahlen_tabelle`, ob(ZAHLEN, ['#']), 'Auftragsbogen'],
  ['G5', `${GA}.leitfrage`, T, 'Auftragsbogen'],
  ['G5', `${GA}.mehrdeutigkeit.hint`, T, 'Auftragsbogen'],
  ['G5', `${GA}.auftrag`, T, 'Auftragsbogen'],
  ['G5', `${GA}.sozialform.empfehlung`, T, 'Auftragsbogen'],
  ['G6', `${GA}.schritte[label=*].hint`, T, 'Auftragsbogen'],
  ['G6L', `${GA}.schritte`, SCHRITTE, 'Auftragsbogen'],
  ['G7', `${GA}.abgaben`, tl([1, 4]), 'Auftragsbogen'],
  ['G8', `${GA}.heft_bezug[heft=*].inhalte`, tl([1, 99]), 'Auftragsbogen'],
  ['G9', `${GA}.produkte`, ob([{ schritt: 'Z', form: 'T', modus: 'T', 'stationen?': ['T'], 'hinweis?': 'T', 'dauer?': 'T' }], ['#', '[].schritt', '[].form', '[].modus']), 'Auftragsbogen'],
  ['G10', `${KRIT}.indikator_produkt`, T, 'Auftragsbogen'],
  ['G10', `${KRIT}.stufen`, tl([4, 4]), 'Auftragsbogen'],
  ['G10', `${KRIT}.name_lernende`, T, 'Auftragsbogen', { nurEba: true }],
  ['G10', `${KRIT}.stufen_lernende`, tl([4, 4]), 'Auftragsbogen', { nurEba: true }],
  ['G11', `${GA}.erwartungshorizont`, ob(ERWARTUNG), 'Lösungen', { lp: true }],
  ['G12', `${GA}.woerter`, { schema: [{ begriff: 'T', definition: 'T' }], budget: 'elemente' }, 'Auftragsbogen'],
  ['G13', `${GA}.kontext_ausschluss`, tl([0, 99]), 'Auftragsbogen'],
]
const DOSSIER: Roh[] = [
  ['D1', 'einleitung.was_ist_das', T, 'Dossier'],
  ['D2', 'nuggets[id=*]', ob({ id: 'T', tag: 'T', titel: 'T', inhalt: 'T', 'beispiel?': 'T', fuer_leitfrage: ['Z'], fakten_anker: [{}],
    'glossar_refs?': ['T'], 'recherche?': { 'suchbegriffe?': ['T'], 'selbst_pruefen?': 'T' } }, ['id', 'tag', 'fuer_leitfrage'], ['nugget']), 'Dossier'],
  ['D3', 'sprachmodi_scaffolds[tag=*]', ob({ tag: 'T', sm_id: 'T', modus_label: 'T', 'satzanfaenge?': ['T'], 'strategien?': ['T'], 'struktur?': ['T'], 'so_gehst_du_vor?': ['T'] }, ['tag', 'sm_id', 'modus_label', 'strategien', 'so_gehst_du_vor.#']), 'Dossier'],
  ['D4', 'transfer_wissensblatt', ob({ fachsystematik: 'T', prinzip_in_einfach: 'T' }), 'Dossier'],
  ['D5', 'glossar', { schema: [{ id: 'T', begriff: 'T', erklaerung_a2: 'T', beispiel: 'T' }], budget: 'elemente', anzahl: [12, 30], spezial: ['glossar_ids'] }, 'Dossier'],
  ['D6', 'leseblatt.richtig_falsch', { ...ob([{ text: 'T', loesung: 'B' }]), anzahl: [5, 5] }, 'Dossier'],
  ['D7', 'leseblatt.w_fragen', tl([3, 3]), 'Dossier'],
  ['D8', 'leseblatt.vokabeln', { schema: ['T'], budget: 'keins', anzahl: [6, 6], spezial: ['vokabeln'] }, 'Dossier'],
]
const bau = (datei: Feld['datei'], liste: Roh[]): Feld[] =>
  liste.map(([nr, muster, form, block, extra]) => ({ nr, datei, muster, form, lp: false, block, ...extra }))
/** Die Positivliste (VERTRAG §3). Eine Nummer kann mehrere Muster haben (H10 im Kern und in der Spur). */
export const FELDER: readonly Feld[] = [...bau('heft', HEFT), ...bau('set', SET), ...bau('dossier', DOSSIER)]

// --- Muster und Pfade ---------------------------------------------------------------
interface MusterSeg { name: string; schluessel?: string }
const musterCache = new Map<string, MusterSeg[]>()
function musterSeg(muster: string): MusterSeg[] {
  const s = musterCache.get(muster) ?? muster.split('.').map((t) => {
    const m = /^([a-z0-9_<>]+)(?:\[([a-z_]+)=\*\])?$/.exec(t)
    if (!m) throw new Error(`Ungültiges Muster «${muster}»`)
    return { name: m[1], schluessel: m[2] }
  })
  musterCache.set(muster, s)
  return s
}
const dateiArt = (d: FassungsDatei): Feld['datei'] => d === 'herausforderung_A' || d === 'herausforderung_B' ? 'heft' : d
function passtMuster(seg: Segment[], muster: MusterSeg[]): boolean {
  if (seg.length !== muster.length) return false
  return muster.every((m, i) => {
    const s = seg[i]
    if (m.name === '<s>' ? !(SPUREN as string[]).includes(s.name) : m.name !== s.name) return false
    if (!m.schluessel) return !s.wahl
    if (!s.wahl || s.wahl.schluessel !== m.schluessel) return false
    return m.schluessel !== 'nr' || /^\d+$/.test(s.wahl.wert)
  })
}
/** Ordnet einen konkreten Pfad seinem Eintrag der Positivliste zu, sonst `null` (Invariante 4). */
export function feldFuer(datei: FassungsDatei, pfad: string): Feld | null {
  let seg: Segment[]
  try { seg = parsePfad(pfad) } catch { return null }
  // Der Platzhalter der Spur-Karte ist nie ersetzbar (§3 H33).
  if (seg.some((s) => s.wahl?.schluessel === 'ref' && s.wahl.wert === '__spur__')) return null
  const art = dateiArt(datei)
  return FELDER.find((f) => f.datei === art && passtMuster(seg, musterSeg(f.muster))) ?? null
}
/** Alle konkreten Pfade zu `muster`, deren Wert im Rohobjekt vorhanden ist. */
export function konkretePfade(muster: string, roh: unknown): string[] {
  let stand: { seg: Segment[]; wert: unknown }[] = [{ seg: [], wert: roh }]
  for (const m of musterSeg(muster)) {
    const weiter: typeof stand = []
    for (const { seg, wert } of stand) {
      if (!wert || typeof wert !== 'object' || Array.isArray(wert)) continue
      const rec = wert as Record<string, unknown>
      for (const name of m.name === '<s>' ? SPUREN : [m.name]) {
        const v = rec[name]
        if (!m.schluessel) { weiter.push({ seg: [...seg, { name }], wert: v }); continue }
        if (!Array.isArray(v)) continue
        for (const el of v) {
          const k = el && typeof el === 'object' ? (el as Record<string, unknown>)[m.schluessel] : undefined
          if (k == null || String(k).includes(']') || k === '__spur__') continue
          weiter.push({ seg: [...seg, { name, wahl: { schluessel: m.schluessel as Schluessel, wert: String(k) } }], wert: el })
        }
      }
    }
    stand = weiter
  }
  return stand.map((s) => formatPfad(s.seg)).filter((p) => lesePfad(roh, p) !== undefined)
}

// --- Zugang (Invarianten 11, 12) ------------------------------------------------------
export const darfForken = (role: string | null | undefined): boolean => role === 'kt1'
/** true nur, wenn beide Hefte `template: "heft_8page_v42"` tragen. */
export function istV42Einheit(hefte: { A?: unknown; B?: unknown } | null | undefined): boolean {
  const t = (h: unknown) => (h && typeof h === 'object' ? (h as { template?: unknown }).template : undefined)
  return !!hefte && t(hefte.A) === TEMPLATE_V42 && t(hefte.B) === TEMPLATE_V42
}

// --- Aufträge (§4) --------------------------------------------------------------------
const bereich = (p: string, von: number, bis: number) => Array.from({ length: bis - von + 1 }, (_, i) => `${p}${von + i}`)
const ERLAUBT: Record<AuftragKey, string[]> = {
  // Für den Auftragsbogen nennt §4 nur das Ziel G5 `leitfrage`; erlaubt ist darum nur dieses.
  leitfrage_umformulieren: ['H10', 'H11', 'H13', 'H15', 'G5'],
  eigener_text: [...bereich('H', 8, 19), ...bereich('H', 34, 36), ...bereich('D', 1, 8)],
  situation_umformulieren: [...bereich('H', 1, 7), ...bereich('H', 9, 14), ...bereich('H', 17, 21), 'H24', 'H26', 'H28', 'H29', 'H30', ...bereich('H', 34, 37), ...bereich('G', 1, 13), ...bereich('D', 1, 8)],
  // F14: H24L/G6L ganze Schrittliste (Labels nach der Nummer); F15: Dossier bei EBA.
  handlungsprodukt_aendern: ['H7', 'H9', 'H10', 'H11', 'H13', 'H20', ...bereich('H', 21, 33), 'H24L', 'H37', ...bereich('G', 5, 10), 'G6L', ...bereich('D', 1, 8)],
}
const ZIEL: Record<AuftragKey, (f: Feld) => boolean> = {
  leitfrage_umformulieren: (f) => f.nr === 'H10' || f.muster === `${GA}.leitfrage`,
  eigener_text: (f) => f.nr === 'H10',
  situation_umformulieren: (f) => ['H1', 'H2', 'H3', 'H4', 'H5', 'G1', 'G2', 'G3', 'G4'].includes(f.nr),
  handlungsprodukt_aendern: (f) => ['H22', 'H23', 'H24L', 'G6L', 'G9'].includes(f.nr) || f.muster === `${GA}.auftrag`,
}
/** Was die Lehrperson für den Auftrag markieren darf (§4 «Ziel»). */
export const zielFelder = (auftrag: AuftragKey): Feld[] => FELDER.filter(ZIEL[auftrag])
/** Aufträge, bei denen das EBA-Dossier mitzieht (eigener Aufruf, F15). */
export const DOSSIER_AUFTRAEGE: readonly AuftragKey[] = ['eigener_text', 'situation_umformulieren', 'handlungsprodukt_aendern']
const lfNr = (pfad: string): number | null => { const m = /leitfragen\[nr=(\d+)\]/.exec(pfad); return m ? Number(m[1]) : null }
/** Grund, warum der Auftrag das Feld nicht ersetzen darf, oder `null`. `zielLeitfragen`: «derselben Leitfrage» (§4). */
export function erlaubtFuerAuftrag(auftrag: AuftragKey, datei: FassungsDatei, pfad: string, ctx: { eba: boolean; zielLeitfragen?: number[] }): string | null {
  const feld = feldFuer(datei, pfad)
  if (!feld) return 'Feld steht nicht auf der Positivliste'
  if (datei === 'dossier' && !(DOSSIER_AUFTRAEGE.includes(auftrag) && ctx.eba)) return 'Das Dossier ist nur bei EBA mit eigenem Text, neuer Situation oder neuem Handlungsprodukt ersetzbar'
  if (auftrag === 'eigener_text' && pfad.startsWith('spuren.mit_medien.')) return 'Eigener Text gilt nur für die Spur ohne Medien'
  if (auftrag === 'leitfrage_umformulieren' && feld.nr === 'H14') return 'Die Lösung darf beim Umformulieren nicht geändert werden'
  if (feld.nurEba && !ctx.eba) return 'Feld gibt es nur bei EBA'
  if (!ERLAUBT[auftrag].includes(feld.nr)) return `${feld.nr} ist für «${AUFTRAEGE[auftrag].label}» nicht erlaubt`
  if (auftrag === 'leitfrage_umformulieren' && feld.datei === 'set' && feld.muster !== `${GA}.leitfrage`) return 'Im Auftragsbogen nur die Leitfrage'
  if (auftrag === 'leitfrage_umformulieren' && ctx.zielLeitfragen && feld.datei === 'heft') {
    const n = lfNr(pfad)
    if (n === null || !ctx.zielLeitfragen.includes(n)) return 'Nur Felder derselben Leitfrage'
  }
  return null
}
const PFLICHT: Record<AuftragKey, { heft: string[]; set: string[] }> = {
  leitfrage_umformulieren: { heft: [], set: [] },
  eigener_text: { heft: ['H8', 'H36'], set: [] },
  situation_umformulieren: { heft: ['H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H9', 'H14', 'H19', 'H28', 'H29', 'H36'], set: ['G2', 'G3', 'G4', 'G5', 'G11', 'G13'] },
  handlungsprodukt_aendern: { heft: ['H22', 'H23', 'H24L', 'H26', 'H27', 'H28', 'H29', 'H30', 'H31', 'H32', 'H33', 'H37', 'H11', 'H13', 'H20', 'H21', 'H7', 'H9'], set: ['G6L', 'G7', 'G9', 'G10'] },
}
function pfadeZu(nrs: string[], art: Feld['datei'], roh: unknown, eba: boolean): string[] {
  return FELDER.filter((f) => f.datei === art && nrs.includes(f.nr) && (eba || !f.nurEba)).flatMap((f) => konkretePfade(f.muster, roh))
}
/** Leitfrage `n` aus Kern oder Spur ohne Medien (Rohform). */
function leitfrageRoh(roh: unknown, n: number): Record<string, unknown> | undefined {
  for (const p of [`leitfragen[nr=${n}]`, `spuren.ohne_medien.leitfragen[nr=${n}]`]) {
    const v = lesePfad(roh, p)
    if (v && typeof v === 'object') return v as Record<string, unknown>
  }
  return undefined
}
/**
 * Pflicht-Abhängigkeiten (4a) als konkrete Pfade der übergebenen Rohdatei. Nur Pfade,
 * deren Feld existiert. `eigener_text` ohne `geaenderteLeitfragen` gilt für alle Leitfragen.
 * `heft` (optional, nur Dossier): nur Nuggets mit diesem `tag`. Bei Situations- und
 * Produktwechsel (F15) sind Info-Karten und Sprachkarte des Hefts Pflicht.
 */
export function pflichtPfade(auftrag: AuftragKey, datei: FassungsDatei, roh: unknown, ctx: { eba: boolean; geaenderteLeitfragen?: number[]; heft?: string }): string[] {
  const art = dateiArt(datei)
  let pfade: string[]
  if (art === 'dossier') {
    if (!ctx.eba || !DOSSIER_AUFTRAEGE.includes(auftrag)) return []
    if (auftrag !== 'eigener_text') {
      const vomHeft = (muster: string) => konkretePfade(muster, roh)
        .filter((p) => !ctx.heft || (lesePfad(roh, p) as { tag?: string }).tag === ctx.heft)
      return [...new Set([...vomHeft('nuggets[id=*]'), ...vomHeft('sprachmodi_scaffolds[tag=*]')])].filter((p) => feldFuer(datei, p) !== null)
    }
    const lf = ctx.geaenderteLeitfragen
    const nuggets = konkretePfade('nuggets[id=*]', roh).filter((p) => {
      const n = lesePfad(roh, p) as { tag?: string; fuer_leitfrage?: number[] }
      if (ctx.heft && n.tag !== ctx.heft) return false
      return !lf || (n.fuer_leitfrage ?? []).some((x) => lf.includes(x))
    })
    pfade = [...nuggets, ...pfadeZu(['D5', 'D6', 'D7', 'D8'], art, roh, true)]
  } else if (art === 'set') {
    pfade = pfadeZu(PFLICHT[auftrag].set, art, roh, ctx.eba)
  } else {
    pfade = pfadeZu(PFLICHT[auftrag].heft, art, roh, ctx.eba)
    if (auftrag === 'eigener_text') {
      const alle = pfadeZu(['H10'], art, roh, ctx.eba).map(lfNr).filter((n): n is number => n !== null)
      const lfs = ctx.geaenderteLeitfragen ?? [...new Set(alle)]
      const proLf = pfadeZu(['H10', 'H12', 'H14', 'H15', 'H16', 'H18', 'H19'], art, roh, ctx.eba)
      for (const n of lfs) {
        const lfRoh = leitfrageRoh(roh, n)
        const nrs = ['H10', 'H12', 'H14']
        if (lfRoh?.antwortform === 'raster') nrs.push('H15', 'H16', 'H18')
        pfade.push(...proLf.filter((p) => lfNr(p) === n && nrs.includes(feldFuer(datei, p)!.nr)))
        if (lfRoh?.pol_typ) pfade.push(...proLf.filter((p) => feldFuer(datei, p)!.nr === 'H19'))
      }
      pfade = pfade.filter((p) => !p.startsWith('spuren.mit_medien.'))
    }
  }
  return [...new Set(pfade)].filter((p) => feldFuer(datei, p) !== null)
}

// --- Formprüfung und Budget (§6) ------------------------------------------------------
function passtSchema(v: unknown, s: Schema): boolean {
  if (s === 'T') return typeof v === 'string'
  if (s === 'B') return typeof v === 'boolean'
  if (s === 'Z') return typeof v === 'number' && Number.isFinite(v)
  if (Array.isArray(s)) return Array.isArray(v) && v.every((x) => passtSchema(x, s[0]))
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  const rec = v as Record<string, unknown>, schluessel = Object.keys(s)
  if (!schluessel.length) return true // {} = beliebiges Objekt (nur in `fakten_anker`, das leer sein muss)
  const namen = new Set(schluessel.map((k) => k.replace(/\?$/, '')))
  if (Object.keys(rec).some((k) => rec[k] !== undefined && !namen.has(k))) return false
  return schluessel.every((k) => { const x = rec[k.replace(/\?$/, '')]; return x === undefined ? k.endsWith('?') : passtSchema(x, s[k]) })
}
/** Projektion für `fix`: `[]` je Element, `#` Anzahl, `-1` letztes Element. */
function proj(v: unknown, teile: string[]): unknown {
  if (!teile.length) return v
  const [t, ...rest] = teile
  if (t === '#') return Array.isArray(v) ? v.length : null
  if (t === '[]') return Array.isArray(v) ? v.map((x) => proj(x, rest)) : null
  if (t === '-1') return Array.isArray(v) && v.length ? proj(v[v.length - 1], rest) : null
  return v && typeof v === 'object' && !Array.isArray(v) ? proj((v as Record<string, unknown>)[t], rest) : null
}
const zeichen = (s: string) => [...s].length
/** Textregel §6: Original × 1.15 aufgerundet, bei Originalen unter 40 Zeichen höchstens 60. */
export const textMax = (original: number) => (original < 40 ? 60 : Math.ceil((original * 115) / 100))
/** Zeichensumme aller Texte; `ref` ist ein Schlüssel, kein Text. */
function summe(v: unknown): number {
  if (typeof v === 'string') return zeichen(v)
  if (Array.isArray(v)) return v.reduce((a, x) => a + summe(x), 0)
  if (v && typeof v === 'object') return Object.entries(v).reduce((a, [k, x]) => a + (k === 'ref' ? 0 : summe(x)), 0)
  return 0
}
function texte(v: unknown, ohne: string[] = []): string[] {
  if (typeof v === 'string') return [v]
  if (Array.isArray(v)) return v.flatMap((x) => texte(x))
  if (v && typeof v === 'object') return Object.entries(v).filter(([k]) => !ohne.includes(k)).flatMap(([, x]) => texte(x))
  return []
}
const BLOCKARTEN = ['eintraege', 'kopf', 'zeilen', 'text', 'wechsel']
const blockarten = (bild: unknown) =>
  ((bild as { bloecke?: Record<string, unknown>[] })?.bloecke ?? []).map((b) => BLOCKARTEN.filter((k) => b[k] !== undefined))
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
/**
 * LP-Leck (Invariante 6): ≥ 40 gleiche Zeichen aus einem LP-Text in einem Lernenden-Feld.
 * Zählt nur, was nicht schon im Original dieses Felds stand: Lösungen zitieren oft
 * Situation oder Leitfrage, und unverändertes Original ist kein Verschieben.
 */
function leck(lernende: string[], lpTexte: string[], original: string[]): boolean {
  const ziel = lernende.map(norm).join('\n')
  const alt = original.map(norm).join('\n')
  return lpTexte.map(norm).some((t) => {
    for (let i = 0; i + 40 <= t.length; i++) { const z = t.slice(i, i + 40); if (ziel.includes(z) && !alt.includes(z)) return true }
    return false
  })
}
export interface PruefKontext {
  /** Dateinamen in `src/data/methoden/` ohne `.json`, ohne `_aenderungen`. */
  methodenRefs: Set<string>
  /** Begriffe aus `set.glossar` für dieses Heft (F9). Pflicht für H35. */
  glossarBegriffe?: string[]
  /** Texte der LP-Felder desselben Hefts, Original und Vorschlag (siehe `lpTexte`). */
  lpTexte?: string[]
  /** IDs des Dossier-Glossars nach Ersetzung. Pflicht für D8. */
  glossarIds?: string[]
}
/** Prüft Form und Budget eines neuen Werts (§3, §6). Gibt den Grund oder `null` zurück. */
export function pruefeWert(datei: FassungsDatei, pfad: string, originalWert: unknown, neuerWert: unknown, ctx: PruefKontext): string | null {
  const feld = feldFuer(datei, pfad)
  if (!feld) return 'Feld steht nicht auf der Positivliste'
  if (originalWert === undefined || originalWert === null) {
    // F14, bekannte Kante: Nach einem Label-Wechsel (H24L/G6L) zeigt der Einzel-Hint auf ein Label, das es im Original nicht gibt.
    return feld.nr === 'H24' || feld.nr === 'G6' ? 'Dieser Schritt wurde umbenannt — bitte die ganze Schrittliste markieren.' : 'Feld fehlt im Original'
  }
  const { form } = feld
  if (!passtSchema(neuerWert, form.schema)) return 'Wert hat nicht die erwartete Form'
  for (const f of form.fix ?? []) {
    const t = f.split('.')
    if (kanonisch(proj(originalWert, t)) !== kanonisch(proj(neuerWert, t))) return `«${f}» muss unverändert bleiben`
  }
  const n = (neuerWert as unknown[]).length
  if (form.anzahl && (n < form.anzahl[0] || n > form.anzahl[1])) return `Anzahl ${n} ausserhalb ${form.anzahl[0]}–${form.anzahl[1]}`
  for (const s of form.spezial ?? []) { const grund = spezial(s, originalWert, neuerWert, ctx); if (grund) return grund }
  const b = budget(form.budget, originalWert, neuerWert)
  if (b) return b
  const leckt = !feld.lp && !!ctx.lpTexte?.length && leck(texte(neuerWert, feld.lpTeile), ctx.lpTexte, texte(originalWert, feld.lpTeile))
  return leckt ? 'Text aus einer Lösung im Feld für Lernende' : null
}
function budget(art: Budget, o: unknown, n: unknown): string | null {
  const zuLang = (ist: number, max: number) => (ist > max ? `zu lang: ${ist} Zeichen, erlaubt ${max}` : null)
  if (art === 'text') return zuLang(zeichen(n as string), textMax(zeichen(o as string)))
  if (art === 'objekt') return zuLang(summe(n), textMax(summe(o)))
  if (art === 'liste' || art === 'elemente') {
    const max = textMax(Math.max(0, ...(o as unknown[]).map(summe)))
    for (const x of n as unknown[]) { const g = zuLang(summe(x), max); if (g) return g }
  }
  return null
}
function spezial(s: Spezial, o: unknown, n: unknown, ctx: PruefKontext): string | null {
  if (s === 'blockart') return kanonisch(blockarten(o)) === kanonisch(blockarten(n)) ? null : 'Blockart je Block muss gleich bleiben'
  if (s === 'methode') {
    const ref = (n as { ref: string }).ref
    if (ref === '__spur__') return 'Der Platzhalter __spur__ ist nicht ersetzbar'
    return ctx.methodenRefs.has(ref) ? null : `Methodenkarte «${ref}» gibt es nicht`
  }
  if (s === 'mindmap') {
    if (!ctx.glossarBegriffe) return 'Glossar der Einheit fehlt für die Prüfung'
    const erlaubt = new Set(ctx.glossarBegriffe)
    const fremd = (n as { punkte?: string[] }[]).flatMap((a) => a.punkte ?? []).filter((p) => !erlaubt.has(p))
    return fremd.length ? `Nicht im Glossar: ${fremd.join(', ')}` : null
  }
  if (s === 'nugget') {
    const nug = n as { inhalt: string; fakten_anker: unknown[] }
    if (nug.fakten_anker.length) return '`fakten_anker` muss leer sein'
    return zeichen(nug.inhalt) > 700 ? `Info-Karte zu lang: ${zeichen(nug.inhalt)} Zeichen, erlaubt 700` : null
  }
  if (s === 'schrittnummern') {
    const nummer = (x: unknown) => String((x as { label?: unknown })?.label ?? '').trim().split(/\s/)[0]
    const alt = o as unknown[]
    const i = (n as unknown[]).findIndex((x, j) => nummer(x) !== nummer(alt[j]))
    return i < 0 ? null : `Schritt ${i + 1}: Das Label muss mit «${nummer(alt[i])}» beginnen`
  }
  if (s === 'glossar_ids') { const ids = (n as { id: string }[]).map((g) => g.id); return new Set(ids).size === ids.length ? null : 'Glossar-IDs sind nicht eindeutig' }
  if (s === 'vokabeln') {
    if (!ctx.glossarIds) return 'Glossar des Dossiers fehlt für die Prüfung'
    const ids = new Set(ctx.glossarIds)
    const fremd = (n as string[]).filter((v) => !ids.has(v))
    return fremd.length ? `Nicht im Glossar des Dossiers: ${fremd.join(', ')}` : null
  }
  return null
}
/** Alle Texte der LP-Felder (und LP-Teile) einer Rohdatei — Eingabe für `lpTexte` in `pruefeWert`. */
export function lpTexte(datei: FassungsDatei, roh: unknown): string[] {
  const art = dateiArt(datei)
  return FELDER.filter((f) => f.datei === art && (f.lp || f.lpTeile)).flatMap((f) =>
    konkretePfade(f.muster, roh).flatMap((p) => {
      const v = lesePfad(roh, p)
      if (f.lp) return texte(v)
      return (f.lpTeile ?? []).flatMap((t) => texte((v as Record<string, unknown>)[t]))
    }))
}

// --- Warnungen (§5) -------------------------------------------------------------------
export const WARNTEXTE = {
  handlungsprodukt: 'Das Handlungsprodukt Ihrer Fassung ist ein anderes als in der Einheit. Der Kompetenznachweis der Plattform prüft möglicherweise etwas anderes, als Ihre Klasse geübt hat. Prüfen Sie den KN vor dem Einsatz.',
  kriterien: 'Die Kriterien {liste} haben in Ihrer Fassung einen anderen Wortlaut als im Kompetenznachweis der Plattform. Für die Bewertung gilt der KN.',
  situation: 'Die Situation ist angepasst. Begleitdokument, KI-Toolbox und Präsentation erzählen weiter die ursprüngliche Situation.',
  eigener_text: 'Ihre Fassung stützt sich auf Ihren eigenen Text. Begleitdokument, KI-Toolbox und Präsentation beziehen sich weiter auf das Lehrmittel. Die Fassung gilt nur für die Spur ohne Medien.',
  fusszeile: 'Angepasst, nicht von KT1 geprüft',
} as const
export function warnungen(ersetzungen: { datei: FassungsDatei; pfad: string; auftrag: AuftragKey }[]): { code: string; text: string }[] {
  const nrs = ersetzungen.map((e) => ({ e, nr: feldFuer(e.datei, e.pfad)?.nr }))
  const hat = (...n: string[]) => nrs.some((x) => x.nr && n.includes(x.nr))
  const out: { code: keyof typeof WARNTEXTE; text: string }[] = []
  if (hat('H22', 'H23')) out.push({ code: 'handlungsprodukt', text: WARNTEXTE.handlungsprodukt })
  const kriterien = [...new Set(nrs.filter((x) => x.nr && ['H31', 'H32', 'G10'].includes(x.nr))
    .map((x) => /\[kn_kriterium=([^\]]+)\]/.exec(x.e.pfad)?.[1]).filter((k): k is string => !!k))]
  if (kriterien.length) out.push({ code: 'kriterien', text: WARNTEXTE.kriterien.replace('{liste}', kriterien.map((k) => `«${k}»`).join(', ')) })
  if (hat('H3', 'H5', 'G3')) out.push({ code: 'situation', text: WARNTEXTE.situation })
  if (ersetzungen.some((e) => e.auftrag === 'eigener_text')) out.push({ code: 'eigener_text', text: WARNTEXTE.eigener_text })
  if (ersetzungen.length) out.push({ code: 'fusszeile', text: WARNTEXTE.fusszeile })
  return out
}