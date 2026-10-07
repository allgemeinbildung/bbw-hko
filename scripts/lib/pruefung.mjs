/**
 * pruefung.mjs — gemeinsamer Unterbau der fünf Tor-Skripte aus ENTSCHEIDE E38
 * (check-belege, check-fakten, check-zeiger, check-zahlen, check-kohaerenz).
 *
 *   import { aufruf, ladeEinheit, Bericht, schluss, textfelder, … } from './lib/pruefung.mjs'
 *
 * Was hier steht:
 *   AUFRUF     gleiche Schalter in allen fünf: <ordner>… · --wurzel · --streng ·
 *              --protokoll <datei> · --liste
 *   EINHEIT    die Dateien einer Einheit, ihr Status, ihre Quellen- und Methodenkarten
 *   SCHWERE    «gebunden» (publiziert, archiviert, kein Feld) → Befunde sind Warnungen;
 *              Entwurf oder --streng → Fehler (wie scripts/check-namen.mjs)
 *   BERICHT    je Befund: Code · Datei › Feld · Kurzbefund. Auf der Konsole darf ein
 *              Zusatz stehen (Anker, Treffertext); ins Protokoll (--protokoll) kommt er nie.
 *   TEXT       die sichtbaren Textfelder einer Einheit mit Pfad, Heft und Sicht
 *   SEITEN     welches Feld der Renderer auf welche Seite setzt — hergeleitet aus
 *              src/components/einheiten/docs/DocHeftV42.tsx (feste Folge Seite1…Seite8),
 *              heft-v42/seiten-1-4.tsx, seiten-5-8.tsx und DocAuftragsbogen.tsx (A1…A4)
 *   MARKEN     Zeitmarken, Seiten, Absätze und Kapitel aus einem Text lesen
 *
 * Kein Quellen- oder Lehrmittelwortlaut in dieser Datei. Reines Node, nur lesend
 * (ausser dem Protokoll, das der Aufrufer ausdrücklich verlangt).
 */
import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const TEMPLATE_V42 = 'heft_8page_v42'
export const SPUREN = Object.freeze(['ohne_medien', 'mit_medien'])

// ================================================================== AUFRUF

/**
 * Liest die Kommandozeile. Unbekannte Schalter beenden mit Exit 2.
 * @param {string} name     Skriptname für Meldungen
 * @param {string} usage    Aufrufzeile
 * @param {Record<string,'flag'|'wert'>} [eigene]  zusätzliche Schalter dieses Skripts
 */
export function aufruf(name, usage, eigene = {}) {
  const argv = process.argv.slice(2)
  const a = { wurzel: REPO, ordner: [], streng: false, protokoll: null, liste: false, alle: false, opt: {} }
  const bad = (m) => { console.error(`${name}: ${m}\nusage: ${usage}`); process.exit(2) }
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i]
    if (x === '--wurzel') a.wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
    else if (x === '--protokoll') a.protokoll = resolve(argv[++i] ?? bad('--protokoll braucht eine Datei'))
    else if (x === '--streng') a.streng = true
    else if (x === '--liste') a.liste = true
    else if (x === '--v42' || x === '--alle') a.alle = true
    else if (eigene[x.replace(/^--/, '')] === 'flag' && x.startsWith('--')) a.opt[x.slice(2)] = true
    else if (eigene[x.replace(/^--/, '')] === 'wert' && x.startsWith('--')) a.opt[x.slice(2)] = argv[++i] ?? bad(`${x} braucht einen Wert`)
    else if (x.startsWith('--')) bad(`unbekannter Schalter ${x}`)
    else a.ordner.push(basename(x.replace(/[\\/]+$/, '')))
  }
  a.einheitenDir = join(a.wurzel, 'src', 'data', 'einheiten')
  if (!existsSync(a.einheitenDir)) bad(`kein Ordner ${a.einheitenDir}`)
  const vorhanden = readdirSync(a.einheitenDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
  if (a.alle) a.ordner = vorhanden.filter((s) => istV42(join(a.einheitenDir, s)))
  const fehlt = a.ordner.filter((s) => !vorhanden.includes(s))
  if (fehlt.length) bad(`kein Ordner src/data/einheiten/${fehlt.join(', ')}`)
  if (!a.ordner.length) bad('kein Ordner genannt')
  return a
}

function istV42(dir) {
  try { return JSON.parse(readFileSync(join(dir, 'herausforderung_A.json'), 'utf8')).template === TEMPLATE_V42 } catch { return false }
}

// ================================================================= EINHEIT

const liesJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^﻿/, ''))

/**
 * Lädt eine Einheit samt ihren Karten.
 * `gebunden`: alles ausser status "entwurf" (publiziert, archiviert, kein Feld).
 * `quellen`: jede Quellenkarte, die ein Heft führt (Slots der Medien-Spur, deren
 * Ersatzkarte, `raster.quelle_ref`, `loesung.quelle_ref`) — id → { karte, heft, rolle }.
 * `methoden`: jede Methodenkarte der Hefte — id → { karte, heft }.
 */
export function ladeEinheit(wurzel, ordner) {
  const dir = join(wurzel, 'src', 'data', 'einheiten', ordner)
  const E = { ordner, dir, wurzel, json: {}, begleiter: null, fehler: [], quellen: new Map(), methoden: new Map(), kartenFehlen: [] }
  for (const f of ['herausforderung_A.json', 'herausforderung_B.json', 'set.json', 'kn.json', 'prinzip.json']) {
    const p = join(dir, f)
    if (!existsSync(p)) { E.fehler.push(`${f} fehlt`); continue }
    try { E.json[f] = liesJson(p) } catch (e) { E.fehler.push(`${f}: ${e.message}`) }
  }
  const b = join(dir, 'begleiter.md')
  if (existsSync(b)) E.begleiter = readFileSync(b, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n')
  E.status = E.json['set.json']?.status
  E.gebunden = E.status !== 'entwurf'
  E.hefte = ['A', 'B'].filter((h) => E.json[`herausforderung_${h}.json`]).map((h) => ({ heft: h, datei: `herausforderung_${h}.json`, json: E.json[`herausforderung_${h}.json`] }))
  E.v42 = E.hefte.some((h) => h.json.template === TEMPLATE_V42)

  const karte = (art, id) => {
    const p = join(wurzel, 'src', 'data', art, `${id}.json`)
    if (typeof id !== 'string' || !/^[\w.-]+$/.test(id) || !existsSync(p)) return null
    try { return liesJson(p) } catch { return null }
  }
  const nimmQuelle = (id, heft, rolle) => {
    if (typeof id !== 'string' || !/^q-/.test(id) || E.quellen.has(id)) return
    const k = karte('quellen', id)
    if (!k) { E.kartenFehlen.push(`quellen/${id}.json`); return }
    E.quellen.set(id, { karte: k, heft, rolle })
    if (k.ersatz_ref) nimmQuelle(k.ersatz_ref, heft, `${rolle}-ersatz`)
  }
  const nimmMethode = (id, heft) => {
    if (typeof id !== 'string' || id === '__spur__' || E.methoden.has(id)) return
    const k = karte('methoden', id)
    if (!k) { E.kartenFehlen.push(`methoden/${id}.json`); return }
    E.methoden.set(id, { karte: k, heft })
  }
  for (const { heft, json } of E.hefte) {
    for (const m of json.methoden ?? []) nimmMethode(m?.ref, heft)
    for (const sp of SPUREN) {
      const s = json.spuren?.[sp]
      if (!s) continue
      nimmMethode(s.methoden_ref_rezeption?.ref, heft)
      let v = 0
      for (const q of s.quellen ?? []) nimmQuelle(q?.ref, heft, q?.rolle === 'pflicht' ? 'pflicht' : `vertiefung-${++v}`)
      for (const lf of s.leitfragen ?? []) { nimmQuelle(lf?.raster?.quelle_ref, heft, 'pflicht'); nimmQuelle(lf?.loesung?.quelle_ref, heft, 'pflicht') }
    }
  }
  return E
}

// ================================================================= BERICHT

const FEHLER = 'FEHLER '
const WARNUNG = 'warnung'
const HINWEIS = 'HINWEIS'

/**
 * Sammelt die Befunde einer Einheit. Jeder Befund: Art · Code · wo (Datei › Feld) ·
 * was (Kurzbefund ohne Quellentext) · zusatz (nur Konsole: Anker, Treffertext).
 */
export class Bericht {
  constructor(skript, E, { streng = false } = {}) {
    this.skript = skript
    this.einheit = E.ordner
    this.streng = streng
    this.gebunden = E.gebunden
    this.status = E.status
    this.befunde = []
  }
  /** Befund, der bei einem Entwurf (oder --streng) ein Fehler ist, bei einer gebundenen Einheit eine Warnung. */
  fehler(code, wo, was, zusatz = '') { this.befunde.push({ art: this.gebunden && !this.streng ? WARNUNG : FEHLER, code, wo, was, zusatz }) }
  /** Immer eine Warnung. */
  warnung(code, wo, was, zusatz = '') { this.befunde.push({ art: WARNUNG, code, wo, was, zusatz }) }
  /** Nicht prüfbar oder nicht geprüft — zählt nie als bestanden. */
  hinweis(code, wo, was, zusatz = '') { this.befunde.push({ art: HINWEIS, code, wo, was, zusatz }) }
  zahl(art) { return this.befunde.filter((b) => b.art === art).length }
  get fehlerZahl() { return this.zahl(FEHLER) }
  kopf() {
    const s = this.status ?? 'kein Feld'
    return `${this.einheit} · status ${s}${this.streng ? ' · --streng: Befunde sind Fehler' : this.gebunden ? ' · gebunden: Befunde sind Warnungen' : ''}`
  }
  zeilen({ protokoll = false } = {}) {
    const out = []
    for (const b of this.befunde) {
      out.push(`  ${b.art}  ${b.code}  ${b.wo}`)
      const text = [b.was, !protokoll && b.zusatz ? b.zusatz : ''].filter(Boolean).join(' ')
      if (text) out.push(`           ${text}`)
    }
    const codes = {}
    for (const b of this.befunde) codes[b.code] = (codes[b.code] ?? 0) + 1
    const liste = Object.entries(codes).map(([k, v]) => `${k} ${v}`).join(' · ')
    out.push(`  — ${this.zahl(FEHLER)} Fehler · ${this.zahl(WARNUNG)} Warnung(en) · ${this.zahl(HINWEIS)} Hinweis(e)${liste ? `   [${liste}]` : ''}`)
    return out
  }
}

/**
 * Gibt die Berichte aus, schreibt wahlweise das Protokoll und beendet den Prozess.
 * Exit 1 bei Fehlern; sonst Exit 2, wenn etwas nicht prüfbar war (`nichtGeprueft`); sonst 0.
 */
export function schluss(skript, berichte, { protokoll = null, nichtGeprueft = '', vorspann = [] } = {}) {
  const fehler = berichte.reduce((n, b) => n + b.zahl(FEHLER), 0)
  const warn = berichte.reduce((n, b) => n + b.zahl(WARNUNG), 0)
  const hinw = berichte.reduce((n, b) => n + b.zahl(HINWEIS), 0)
  const ende = fehler
    ? `ROT — ${fehler} Fehler, ${warn} Warnung(en), ${hinw} Hinweis(e).`
    : nichtGeprueft
      ? `NICHT GEPRUEFT — ${nichtGeprueft} Keine Fehler in dem, was prüfbar war; ${warn} Warnung(en), ${hinw} Hinweis(e).`
      : `GRUEN — keine Fehler, ${warn} Warnung(en), ${hinw} Hinweis(e).`
  const drucke = (p) => [`${skript} — ${berichte.length} Einheit(en)`, ...vorspann, '', ...berichte.flatMap((b) => [b.kopf(), ...b.zeilen({ protokoll: p }), '']), ende]
  console.log(drucke(false).join('\n'))
  if (protokoll) {
    mkdirSync(dirname(protokoll), { recursive: true })
    // Ohne Anker und ohne Treffertext: nur Feld, Urteil, Fundstelle, Code.
    writeFileSync(protokoll, drucke(true).join('\n') + '\n', 'utf8')
    console.log(`Protokoll (ohne Anker): ${protokoll}`)
  }
  process.exit(fehler ? 1 : nichtGeprueft ? 2 : 0)
}

// ==================================================================== TEXT

// Schlüssel ohne gedruckten Text (Kennungen, Verweise, Technik) und Teilbäume, die kein Dokument druckt.
const KEIN_TEXT = new Set(['id', 'template', 'modul', 'lehrgang', 'lehrgaenge', 'buchstabe', 'sit_farbe', 'sit_farbe_light', 'sit_farbe_mid', 'prinzip_ref', 'kn_ref', 'set_ref', 'ref', 'quelle_ref', 'ersatz_ref', 'archiv_ref', 'rubrik_ref', 'url', 'urn', 'typ', 'rolle', 'bloom', 'antwortform', 'auftakt_typ', 'form', 'dimension', 'herkunft', 'heft', 'status', 'version', 'spur', 'topic_slug', 'thema', 'kompetenz_nr', 'erstellt_am', 'quelle_stand', 'herausforderung', 'modus', 'emotion_tag', 'ersetzt_durch'])
const KEIN_BAUM = new Set(['nrlp', 'prinzip_handoff', 'sk_anker', 'herausforderungen', 'anchored_situations', 'bogen', 'legacy', 'source_refs', 'registry_tags', 'alignment_note', 'konzept_progression', 'sprachmodi', 'entwurf_komponenten'])
const LOESUNG_PFAD = /(^|\.)(loesung|loesungsbild|erwartungshorizont|loesung_zeilen)(\.|\[|$)|\.erwartung$/

function* strings(o, p = '') {
  if (typeof o === 'string') { if (o.trim()) yield [p, o] } else if (Array.isArray(o)) for (let i = 0; i < o.length; i++) yield* strings(o[i], `${p}[${i}]`)
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (!KEIN_BAUM.has(k) && !(KEIN_TEXT.has(k) && typeof v === 'string')) yield* strings(v, p ? `${p}.${k}` : k) }
}

/**
 * Die Textfelder einer Einheit: Hefte (Kern, beide Spuren, Lösungen), `set.json`
 * (Auftragsbogen, Glossar), `kn.json`, der Begleiter (je Absatz) und — mit `karten` —
 * die Texte der Quellen- und Methodenkarten, die die Einheit führt.
 *
 * Je Feld: { feld, datei, pfad, text, traeger ('A'|'B'|'auftrag'|'kn'|'begleiter'|'karte'),
 *            loesung (true = nur die Lehrperson sieht es), spur (null | 'ohne_medien' | 'mit_medien') }
 * Leitfragen werden wie in lib/loesungsfelder.mjs über ihre Nummer angesprochen ([LF3]).
 */
export function textfelder(E, { karten = true, begleiter = true, kn = true } = {}) {
  const out = []
  const nimm = (datei, json, traeger) => {
    // Der Spur-Anker `methoden[i].ref: "__spur__"` ist ein Platzhalter: Gedruckt wird die Rezeptionskarte der Spur.
    const anker = new Set((Array.isArray(json.methoden) ? json.methoden : []).map((m, i) => (m?.ref === '__spur__' ? `methoden[${i}]` : null)).filter(Boolean))
    for (const [p, s] of strings(json)) {
      if (anker.size && anker.has(/^methoden\[\d+\]/.exec(p)?.[0])) continue
      const pfad = lfPfad(json, p)
      out.push({ feld: `${datei} › ${pfad}`, datei, pfad, text: s, traeger, loesung: LOESUNG_PFAD.test(p), spur: /^spuren\.(ohne_medien|mit_medien)\b/.exec(p)?.[1] ?? /eigene_knoten\.(ohne_medien|mit_medien)/.exec(p)?.[1] ?? null })
    }
  }
  for (const h of E.hefte) nimm(h.datei, h.json, h.heft)
  if (E.json['set.json']) nimm('set.json', E.json['set.json'], 'auftrag')
  if (kn && E.json['kn.json']) nimm('kn.json', E.json['kn.json'], 'kn')
  if (begleiter && E.begleiter) {
    // Absätze wie in check-all («begleiter.md › Absatz N»); Feld-Marker bleiben stehen, ihr Inhalt zählt als Text.
    E.begleiter.split(/\n\s*\n/).forEach((abs, i) => { if (abs.trim()) out.push({ feld: `begleiter.md › Absatz ${i + 1}`, datei: 'begleiter.md', pfad: `Absatz ${i + 1}`, text: abs.replace(/<!--[\s\S]*?-->/g, ' '), traeger: 'begleiter', loesung: true, spur: null }) })
  }
  if (karten) {
    for (const [id, { karte }] of E.quellen) for (const [p, s] of strings(karte)) if (!['lizenz_hinweis', 'sprachmodus', 'datum', 'sachlage_geprueft', 'titel_original'].includes(p)) out.push({ feld: `quellen/${id}.json › ${p}`, datei: `quellen/${id}.json`, pfad: p, text: s, traeger: 'karte', loesung: false, spur: 'mit_medien' })
    for (const [id, { karte }] of E.methoden) for (const [p, s] of strings(karte)) if (!['quelle', 'kap'].includes(p)) out.push({ feld: `methoden/${id}.json › ${p}`, datei: `methoden/${id}.json`, pfad: p, text: s, traeger: 'karte', loesung: false, spur: null })
  }
  return out
}

/** `leitfragen[2]` → `leitfragen[LF3]` (über `nr` der Leitfrage), wie in lib/loesungsfelder.mjs. */
function lfPfad(json, p) {
  return p.replace(/((?:^|\.)leitfragen)\[(\d+)\]/g, (ganz, vor, i, pos) => {
    const basis = p.slice(0, pos) + vor
    let v = json
    for (const s of basis.match(/[^.[\]]+|\[\d+\]/g) ?? []) v = s.startsWith('[') ? v?.[+s.slice(1, -1)] : v?.[s]
    const nr = v?.[+i]?.nr
    return Number.isInteger(nr) ? `${vor}[LF${nr}]` : ganz
  })
}

/**
 * Wörter, mit denen ein Feld sagt, dass eine Aussage nicht aus Quelle oder Lehrmittel
 * stammt (Fallüberlegung, Deutung, Annahme). Erhoben an den Lösungen der 16 Einheiten
 * (07.10.2026); `references/sprache.md` führt bisher keine solche Liste.
 */
export const RE_FALLKENNZEICHEN = /Fallüberlegung|Fallangabe|Fallannahme|\bAnnahmen?\b|\bangenommen\b|Auslegung|\bDeutung\b|gedeutet|nicht belegt|nicht belegbar|nicht aus dem Lehrmittel|keine Lehrmittelaussage|nicht Lehrmittelaussage|Vertragssache|eigene Überlegung|Einzelfall|mögliche Lösung|mögliche Antwort|\b(?:erfunden|Beispielwert)/i

/**
 * Felder mit erfundenem, neutralem Fall: Beispielbild (S. 6), Beispiel einer Methodenkarte,
 * Beispielzeile des Rasters. Zahlen, Seiten und Zeitmarken dort gehören nicht zur Situation
 * und zeigen auf nichts.
 */
export const ERFUNDEN = /(^|\.)beispielbild(\.|$)|(^|\.)beispiel(\[|$)|(^|\.)beispielzeile(\[|$)/

// ================================================================== SEITEN

/**
 * Welche Felder auf welcher Heftseite stehen — abgelesen an den Seiten-Komponenten:
 * Seite1 (situation, zahlen, leitfrage, mehrdeutigkeit, quellen_anker, wochen_plan) ·
 * Seite2 (leitfragen_intro, LF1, LF2) · Seite3 (LF3 mit Raster, Quelle bzw. Lehrmittel-
 * Abschnitt) · Seite4 (LF4, Kasten: Denkhilfe oder Vertiefung) · Seite5 (Produkt, Schritte,
 * «Das geben Sie ab», Kriterien, Plus) · Seite6 (Methoden, Beispielbild) · Seite7
 * (Arbeitsfläche) · Seite8 (Begriffsnetz, Glossar, Quer-Check, «Das nehme ich mit», Checkliste).
 */
export const HEFT_SEITEN = 8
export const BOGEN_SEITEN = 4
export function seiteVonFeld(pfad) {
  const p = pfad.replace(/^spuren\.(ohne_medien|mit_medien)\./, '')
  if (/^(titel|persona|situation_text|zahlen_tabelle|leitfrage$|mehrdeutigkeit|quellen_anker|wochen_plan)/.test(p)) return 1
  if (/^leitfragen_intro|^leitfragen\[LF[12]\]/.test(p)) return 2
  if (/^leitfragen\[LF3\]/.test(p)) return 3
  if (/^quellen\[/.test(p)) return /^quellen\[0\]/.test(p) ? 3 : 4
  if (/^leitfragen\[LF4\]|^kasten_s4/.test(p)) return 4
  if (/^handlungsprodukt\.(titel|beschreibung|schritte|hilfe_verweis|abgaben|format)|^feedback_kriterien|^lernfortschritt/.test(p)) return 5
  if (/^methoden|^handlungsprodukt\.beispielbild/.test(p)) return 6
  if (/^mindmap|^abschluss\.(quercheck|mitnahme)|^bewertungsraster|^glossar/.test(p)) return 8
  return null
}

/**
 * Elemente, die ein Verweis beim Namen nennt, und die Seite, auf der der Renderer sie
 * druckt. Nur Wörter, die im Heft eine feste Stelle haben; «Tabelle», «Blatt», «Text»
 * stehen nicht in der Liste (sie meinen je Einheit etwas anderes).
 */
export const ELEMENT_SEITEN = Object.freeze([
  { wort: /\bSituation\b/, seiten: [1], name: 'Situation' },
  { wort: /\bLF\s?1\b|\bLF\s?2\b|Wissensecke I\b/, seiten: [2], name: 'LF1/LF2' },
  { wort: /\bLF\s?3\b|\bRaster(?:s|zeilen?)?\b|\bBeispielzeile\b|\bQuellenkarte\b/, seiten: [3], name: 'Raster/LF3' },
  { wort: /\bLF\s?4\b|\bDenkhilfe\b|\bVertiefung(?:en)?\b|Wissensecke II\b/, seiten: [4], name: 'LF4/Denkhilfe/Vertiefung' },
  { wort: /«Das geben Sie ab»|\bKriterien\b|\bSelbsteinschätzung\b/, seiten: [5], name: 'Abgaben/Kriterien' },
  { wort: /\bMethoden(?:karten?|seite)?\b|\bBeispiel(?:bild|blatt)?\b/, seiten: [6, 3], name: 'Methoden/Beispiel' },
  { wort: /\bArbeitsfläche\b/, seiten: [7], name: 'Arbeitsfläche' },
  { wort: /\bCheckliste\b|\bBegriffsnetz(?:es)?\b|\bGlossar\b|\bQuer-Check\b|«Das nehme ich mit»/, seiten: [8], name: 'Checkliste/Begriffsnetz/Glossar' },
])

// ================================================================== MARKEN

/** Zeitmarken «mm:ss» (auch Spannen) in einem Text → [{ text, sek, pos }]. Uhrzeiten mit «Uhr» zählen nicht. */
export function zeitmarkenIn(text) {
  const out = []
  for (const m of String(text ?? '').matchAll(/(?<![\d:.])(\d{1,3}):([0-5]\d)(?![\d:]|\s*Uhr)/g)) out.push({ text: m[0], sek: +m[1] * 60 + +m[2], pos: m.index })
  return out
}

/** Seiten «S. 12», «S. 12–14», «S. 55, 60, 63», «Seite 12» → [{ von, bis, pos, text }]. */
export function seitenIn(text) {
  const out = []
  for (const m of String(text ?? '').matchAll(/\b(?:S\.|Seiten?)\s?(\d{1,3})(?:\s?[–-]\s?(\d{1,3}))?((?:\s?(?:,|und)\s?\d{1,3}(?:\s?[–-]\s?\d{1,3})?(?!\d|[.,:]\d|\s?(?:Abs|%|Prozent|Franken|Tag|Woche|Monat|Jahr|Punkt|Minute|Zeile|Wört|Wort|Sätze|Satz|Stund|Lektion|Beleg|Begriff)))*)/g)) {
    out.push({ von: +m[1], bis: m[2] ? +m[2] : +m[1], pos: m.index, text: m[0] })
    for (const w of (m[3] ?? '').matchAll(/(\d{1,3})(?:\s?[–-]\s?(\d{1,3}))?/g)) out.push({ von: +w[1], bis: w[2] ? +w[2] : +w[1], pos: m.index, text: m[0] })
  }
  return out
}

/**
 * Absätze einer Quelle: «Abs. 3», «Abs. 4–7», «Absätze 1–13», «Abs. 2 und 9» → [{ von, bis, pos }].
 * Nicht: «Art. 40e Abs. 2», «OR 210 Abs. 4» (Gesetz) und «S. 62, Absatz 2» (Absatz einer
 * Lehrmittelseite — die Kapiteldatei zählt keine Absätze; geprüft wird dort die Seite).
 */
export function absaetzeIn(text) {
  const out = []
  const t = String(text ?? '')
  for (const m of t.matchAll(/\b(?:Abs\.|Absatz|Absätze[n]?)\s?(\d{1,3})(?:\s?[–-]\s?(\d{1,3}))?((?:\s?(?:,|und)\s?\d{1,3}(?:\s?[–-]\s?\d{1,3})?)*)/g)) {
    const vor = t.slice(Math.max(0, m.index - 24), m.index)
    if (/(?:Art\.|Artikel|\b[A-Z][A-Za-z]{1,5})\s?\d+[a-z]{0,4}\s*$/.test(vor) || /\bS\.\s?\d{1,3}(?:\s?[–-]\s?\d{1,3})?,?\s*$/.test(vor)) continue
    out.push({ von: +m[1], bis: m[2] ? +m[2] : +m[1], pos: m.index })
    for (const w of (m[3] ?? '').matchAll(/(\d{1,3})(?:\s?[–-]\s?(\d{1,3}))?/g)) out.push({ von: +w[1], bis: w[2] ? +w[2] : +w[1], pos: m.index })
  }
  return out
}

/**
 * Lehrmittel-Verweise «Kap. 4.2 (S. 128–129)», «Kap. 2.4, S. 60», «2.4, S. 55; 1.3, S. 25-27»,
 * «Kap. 12.1 S. 292, 12.2 S. 299», «Kap. 1.2 oder 1.5, S. 38», «Kap. 4.2 | S. 128-131»
 * → [{ kapitel, seiten: [{von, bis}], pos, ende }].
 *
 * Ein Kapitel ist «Kap. x.y» — oder eine nackte Nummer «x.y», wenn sie nach Komma, Strichpunkt,
 * «·», «oder», «und» steht und ihr «S.» folgt bzw. sie in einer Kapitelliste steht. Die Seiten
 * gehören zum Kapitel davor, bis das nächste Kapitel, ein Strichpunkt, «·», ein Satzende, eine
 * schliessende Klammer ohne öffnende oder 60 Zeichen kommen.
 */
export function lehrmittelVerweise(text) {
  const t = String(text ?? '')
  const marken = []
  for (const m of t.matchAll(/\bKap(?:itel|\.)?\s?(\d{1,2}\.\d{1,2})(?![.\d])/g)) marken.push({ kapitel: m[1], pos: m.index, nach: m.index + m[0].length })
  for (const m of t.matchAll(/(?<=(?:[;,·]|\boder|\bund)\s)(\d{1,2}\.\d{1,2})(?![.\d])(?=\s?[,|(]?\s?S\.\s?\d)/g)) {
    // Nur im Umfeld eines ausgeschriebenen Kapitels («Kap. 2.4, S. 55; 1.3, S. 25»), nie ein Betrag oder eine Uhrzeit.
    if (marken.some((k) => k.pos < m.index && m.index - k.pos < 80)) marken.push({ kapitel: m[1], pos: m.index, nach: m.index + m[0].length })
  }
  marken.sort((a, b) => a.pos - b.pos)
  return marken.map((k, i) => {
    let ende = Math.min(marken[i + 1]?.pos ?? t.length, k.nach + 60, t.length)
    let tail = t.slice(k.nach, ende)
    const schnitt = [/[;·\n]/.exec(tail)?.index, /\.(?=\s+[A-ZÄÖÜ«])/.exec(tail)?.index].filter((x) => x !== undefined)
    let offen = 0
    // «Kap. 5.2 (S. 150–152) und …»: Stehen die Seiten in einer Klammer direkt nach dem Kapitel, endet der Verweis mit ihr.
    const klammerVorn = /^\s*\(/.test(tail)
    for (let j = 0; j < tail.length; j++) { if (tail[j] === '(') offen++; else if (tail[j] === ')') { if (!offen) { schnitt.push(j); break } offen--; if (!offen && klammerVorn) { schnitt.push(j + 1); break } } }
    if (schnitt.length) tail = tail.slice(0, Math.min(...schnitt))
    ende = k.nach + tail.length
    return { kapitel: k.kapitel, seiten: seitenIn(tail).map(({ von, bis }) => ({ von, bis })), pos: k.pos, ende }
  })
}

/** Wörter eines eigenen Texts, klein, ohne Satzzeichen — für Überlappungen. */
export const woerter = (s) => String(s ?? '').normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []

/** Kürzt einen eigenen Hefttext auf höchstens n Wörter rund um eine Stelle (für --liste). */
export function umfeld(text, pos, laenge, n = 12) {
  const t = String(text).replace(/\s+/g, ' ')
  const vor = t.slice(0, pos).split(' ').filter(Boolean)
  const nach = t.slice(pos + laenge).split(' ').filter(Boolean)
  const mitte = t.slice(pos, pos + laenge).split(' ').filter(Boolean)
  const rest = Math.max(0, n - mitte.length)
  const v = vor.slice(-Math.ceil(rest / 2)); const h = nach.slice(0, Math.floor(rest / 2))
  return `${v.length < vor.length ? '…' : ''}${[...v, ...mitte, ...h].join(' ')}${h.length < nach.length ? '…' : ''}`
}

/** Datum «JJJJ-MM-TT» → Date (UTC) oder null. */
export const datumVon = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s ?? '')); return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null }
