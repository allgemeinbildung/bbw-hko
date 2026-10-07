/**
 * loesungsfelder.mjs — die Lösungsfelder einer v4.2-Einheit als Liste, je mit
 * Pfad, Spur, Text und Hash. Gemeinsame Grundlage für check-belege (jedes Feld
 * hat genau eine Zeile in belege.json, der Hash stimmt noch) und für das
 * Lösungs-Audit (welche Felder zu prüfen sind). ENTSCHEIDE E38.
 *
 *   import { loesungsfelder, hashText, MUSTER } from './lib/loesungsfelder.mjs'
 *
 *   node scripts/lib/loesungsfelder.mjs <ordner> [<ordner> …]   # Zahl der Felder je Einheit
 *   node scripts/lib/loesungsfelder.mjs --v42                   # alle Einheiten im Format v4.2
 *   … --felder                                                  # jedes Feld: Pfad, Spur, Art, Hash (kein Text)
 *   … --json                                                    # die ganze Liste als JSON (mit Text)
 *   … --wurzel <ordner>                                         # anderer Baum statt dieses Repos
 *
 * WAS EIN LÖSUNGSFELD IST. Ein Feld, das nur die Lehrperson sieht und sagt, was
 * als Antwort gilt — hergeleitet aus `src/lib/einheiten/types.ts`
 * (LeitfrageLoesung, Erwartungshorizont, KastenS4, QuelleRef, ProduktBild,
 * AbschlussLoesung), dem Datenvertrag der Skill (§2.3, §2.6, §2.7, §3, §4, §5)
 * und der Gold-Einheit. Die Liste steht unten als MUSTER; sie ist die einzige
 * Stelle, an der sie steht.
 *
 * KEIN Lösungsfeld sind: Fragen, Raster-Spalten, Beispielbild (neutraler Fall,
 * im Heft), Methodenkarten, Glossar, KN (führt keine Lösung) und der Begleiter
 * (seine Lösungsstellen füllt das Marker-Skript aus genau diesen Feldern).
 *
 * KÖRNUNG. Ein Feld ist die kleinste Einheit mit eigener Fundstelle: jede
 * Lösungszeile (sie trägt ihr eigenes `quelle`), jede Rasterzeile, jede Zeile
 * der Denkhilfe, jede Verbindung des Begriffsnetzes, jeder Block des
 * Lösungsbilds. Listen ohne eigene Fundstelle je Eintrag (`gut_wenn`,
 * `mitnahme`, `eigene_knoten`) sind ein Feld.
 *
 * SPUR. `ohne_medien` | `mit_medien` für alles unter `spuren.<spur>` und für
 * `abschluss.loesung.eigene_knoten.<spur>`; sonst `beide` (Kern des Hefts und
 * gemeinsamer Auftrag gelten in beiden Spuren).
 *
 * HASH. SHA-256 (hex, klein) über den normalisierten Text des Felds, UTF-8.
 * Normalisierung: Unicode NFC · Zeilenenden zu \n · jede Folge von Leerraum zu
 * einem Leerzeichen · Rand weg. Nichts sonst: Gross/Klein, Satzzeichen und
 * Ziffern zählen — jede sichtbare Änderung einer Lösung macht die Belegzeile
 * ungültig. (Die Ankersuche normalisiert anders und gröber: lib/archiv.mjs.)
 *
 * TEXT EINES FELDS (`form`):
 *   text        die Zeichenkette
 *   liste       Einträge mit \n verbunden
 *   zellen      Zellen einer Zeile mit « | » verbunden
 *   zeile       `label | text | quelle` — fehlende Teile fallen weg
 *   verbindung  `von → nach: text`
 *   block       Titel, dann je Eintrag/Zeile/Absatz/Beitrag eine Zeile
 *               (Liste: `marke | text | notiz`; Tabelle: Kopf, dann Zellen;
 *               Wechselrede: `wer: text`)
 *
 * Reines Node, keine Abhängigkeiten, nur lesend.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname, resolve, basename } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

export const TEMPLATE_V42 = 'heft_8page_v42'
export const SPUREN = Object.freeze(['ohne_medien', 'mit_medien'])
export const HEFTE = Object.freeze(['A', 'B'])

// ------------------------------------------------------------------- Hash

/** Normalisierung für den Hash — siehe Kopfkommentar. */
export const normalisiereLoesungstext = (s) => String(s ?? '').normalize('NFC').replace(/\r\n?/g, '\n').replace(/\s+/g, ' ').trim()

/** SHA-256 (hex) über den normalisierten Text. */
export const hashText = (s) => createHash('sha256').update(normalisiereLoesungstext(s), 'utf8').digest('hex')

// ------------------------------------------------------------------ Muster

// Die Teile einer Lösung unter `<leitfrage>.loesung` — gleich für Kern und Spur.
const LOESUNG = [
  { pfad: 'loesung.kern', form: 'text', art: 'lf_kern', was: 'Kurzzeile der Lösung' },
  { pfad: 'loesung.zeilen[*]', form: 'zeile', art: 'lf_zeile', was: 'Zeile des Massstabs, mit eigener Fundstelle' },
  { pfad: 'loesung.raster_zeilen[*]', form: 'zellen', art: 'rasterzeile', was: 'Zeile des ausgefüllten Rasters (LF3)' },
  { pfad: 'loesung.befund', form: 'text', art: 'befund', was: 'möglicher Befund (LF3)' },
  { pfad: 'loesung.erwartungshorizont.gut_wenn', form: 'liste', art: 'erwartung_gut_wenn', was: 'Merkmale einer guten Antwort (LF4)' },
  { pfad: 'loesung.erwartungshorizont.beispiel_pol_1', form: 'text', art: 'erwartung_pol', was: 'Beispielantwort Pol 1 (LF4)' },
  { pfad: 'loesung.erwartungshorizont.beispiel_pol_2', form: 'text', art: 'erwartung_pol', was: 'Beispielantwort Pol 2 (LF4)' },
  { pfad: 'loesung.erwartungshorizont.tragfaehig', form: 'text', art: 'erwartung_tragfaehig', was: 'tragfähiges Beispiel' },
  { pfad: 'loesung.erwartungshorizont.nicht_tragfaehig', form: 'text', art: 'erwartung_nicht_tragfaehig', was: 'was nicht genügt' },
]

/**
 * Die Lösungsfelder als Pfad-Muster je Datei. Pfad-Sprache:
 *   a.b        Schlüssel
 *   [*]        jedes Element einer Liste (im Feldpfad steht dann der Index: [0], [1], …)
 *   [LF*]      jede Leitfrage; im Feldpfad steht ihre Nummer: [LF1] … [LF4]
 *   <spur>     jeder vorhandene Schlüssel aus SPUREN; bestimmt die Spur des Felds
 * `datei` mit <H> steht für herausforderung_A.json und herausforderung_B.json.
 */
export const MUSTER = Object.freeze([
  ...LOESUNG.map((m) => ({ datei: 'herausforderung_<H>.json', pfad: `leitfragen[LF*].${m.pfad}`, form: m.form, art: m.art, spur: 'beide', was: `LF1, LF2 — ${m.was}` })),
  ...LOESUNG.map((m) => ({ datei: 'herausforderung_<H>.json', pfad: `spuren.<spur>.leitfragen[LF*].${m.pfad}`, form: m.form, art: m.art, spur: '<spur>', was: `LF3, LF4 — ${m.was}` })),
  { datei: 'herausforderung_<H>.json', pfad: 'spuren.<spur>.kasten_s4.loesung_zeilen[*]', form: 'zellen', art: 'denkhilfe', spur: '<spur>', was: 'Zeile der ausgefüllten Denkhilfe (S. 4)' },
  { datei: 'herausforderung_<H>.json', pfad: 'spuren.<spur>.quellen[*].erwartung', form: 'text', art: 'vertiefung_erwartung', spur: '<spur>', was: 'Erwartung zur Leitfrage einer Vertiefung (S. 4)' },
  { datei: 'herausforderung_<H>.json', pfad: 'handlungsprodukt.loesungsbild.hinweis', form: 'text', art: 'loesungsbild_hinweis', spur: 'beide', was: 'Hinweis zum Lösungsbild, mit den Annahmen' },
  { datei: 'herausforderung_<H>.json', pfad: 'handlungsprodukt.loesungsbild.bloecke[*]', form: 'block', art: 'loesungsbild_block', spur: 'beide', was: 'Block des Lösungsbilds (Liste, Tabelle, Fliesstext oder Wechselrede)' },
  { datei: 'herausforderung_<H>.json', pfad: 'abschluss.loesung.verbindungen[*]', form: 'verbindung', art: 'abschluss_verbindung', spur: 'beide', was: 'beschriftete Verbindung im Begriffsnetz (S. 8)' },
  { datei: 'herausforderung_<H>.json', pfad: 'abschluss.loesung.transfer', form: 'text', art: 'abschluss_transfer', spur: 'beide', was: 'Eintrag «gilt auch bei …»' },
  { datei: 'herausforderung_<H>.json', pfad: 'abschluss.loesung.eigene_knoten.<spur>', form: 'liste', art: 'abschluss_knoten', spur: '<spur>', was: 'Begriffe für die zwei leeren Knoten' },
  { datei: 'herausforderung_<H>.json', pfad: 'abschluss.loesung.quercheck[*]', form: 'text', art: 'abschluss_quercheck', spur: 'beide', was: 'Antwort auf eine Quer-Check-Frage' },
  { datei: 'herausforderung_<H>.json', pfad: 'abschluss.loesung.mitnahme', form: 'liste', art: 'abschluss_mitnahme', spur: 'beide', was: 'mögliche Einträge «Das nehme ich mit»' },
  { datei: 'set.json', pfad: 'gemeinsamer_auftrag.erwartungshorizont.gut_wenn', form: 'liste', art: 'erwartung_gut_wenn', spur: 'beide', was: 'Auftragsbogen — Merkmale einer guten Lösung' },
  { datei: 'set.json', pfad: 'gemeinsamer_auftrag.erwartungshorizont.tragfaehig', form: 'text', art: 'erwartung_tragfaehig', spur: 'beide', was: 'Auftragsbogen — tragfähiges Beispiel' },
  { datei: 'set.json', pfad: 'gemeinsamer_auftrag.erwartungshorizont.beispiel_pol_1', form: 'text', art: 'erwartung_pol', spur: 'beide', was: 'Auftragsbogen — Beispiel Pol 1 (in der Gold-Form unbenutzt)' },
  { datei: 'set.json', pfad: 'gemeinsamer_auftrag.erwartungshorizont.beispiel_pol_2', form: 'text', art: 'erwartung_pol', spur: 'beide', was: 'Auftragsbogen — Beispiel Pol 2 (in der Gold-Form unbenutzt)' },
  { datei: 'set.json', pfad: 'gemeinsamer_auftrag.erwartungshorizont.nicht_tragfaehig', form: 'text', art: 'erwartung_nicht_tragfaehig', spur: 'beide', was: 'Auftragsbogen — was nicht genügt' },
])

// ------------------------------------------------------------- Text je Form

const str = (v) => (typeof v === 'string' ? v : v === null || v === undefined ? '' : String(v))
const teile = (...xs) => xs.map(str).map((x) => x.trim()).filter(Boolean).join(' | ')

const FORM = {
  text: (v) => (typeof v === 'string' ? v : ''),
  liste: (v) => (Array.isArray(v) ? v.map(str).filter((x) => x.trim()).join('\n') : ''),
  zellen: (v) => (Array.isArray(v) ? v.map(str).join(' | ') : ''),
  zeile: (v) => (v && typeof v === 'object' ? teile(v.label, v.text, v.quelle) : ''),
  verbindung: (v) => (v && typeof v === 'object' && (v.von || v.nach || v.text) ? `${str(v.von)} → ${str(v.nach)}: ${str(v.text)}` : ''),
  block: (b) => {
    if (!b || typeof b !== 'object') return ''
    const z = []
    for (const e of b.eintraege ?? []) z.push(teile(e?.marke, e?.text, e?.notiz))
    if (Array.isArray(b.kopf) && b.kopf.length) z.push(b.kopf.map(str).join(' | '))
    for (const r of b.zeilen ?? []) z.push((r?.zellen ?? []).map(str).join(' | '))
    for (const t of b.text ?? []) z.push(str(t))
    for (const w of b.wechsel ?? []) z.push(`${str(w?.wer)}: ${str(w?.text)}`)
    const inhalt = z.filter((x) => x.trim())
    return inhalt.length ? [str(b.titel), ...inhalt].join('\n') : ''
  },
}

// ------------------------------------------------------------- Pfad-Sprache

const segmente = (pfad) => pfad.match(/[^.[\]]+|\[[^\]]*\]/g) ?? []

/**
 * Liest ein Feld über seinen konkreten Pfad (wie er in `feld` steht):
 * `leitfragen[LF3].loesung.zeilen[0]`. `[LFn]` wählt die Leitfrage mit `nr: n`.
 */
export function leseFeld(json, pfad) {
  let v = json
  for (const s of segmente(pfad)) {
    if (v === null || v === undefined) return undefined
    if (s.startsWith('[')) {
      const k = s.slice(1, -1)
      const lf = /^LF(\d)$/.exec(k)
      v = lf ? (Array.isArray(v) ? v.find((x) => x?.nr === +lf[1]) : undefined) : Array.isArray(v) ? v[+k] : undefined
    } else v = v[s]
  }
  return v
}

/** Entfaltet ein Muster an einem JSON: → [{ pfad, wert, spur }]. */
function entfalte(json, muster, spurFest) {
  let stand = [{ pfad: '', wert: json, spur: spurFest }]
  const an = (p, s) => (s.startsWith('[') ? p + s : p ? `${p}.${s}` : s)
  for (const s of segmente(muster)) {
    const next = []
    for (const k of stand) {
      const v = k.wert
      if (v === null || v === undefined) continue
      if (s === '[*]') { if (Array.isArray(v)) v.forEach((x, i) => next.push({ pfad: `${k.pfad}[${i}]`, wert: x, spur: k.spur })) }
      else if (s === '[LF*]') { if (Array.isArray(v)) for (const x of v) if (Number.isInteger(x?.nr)) next.push({ pfad: `${k.pfad}[LF${x.nr}]`, wert: x, spur: k.spur }) }
      else if (s === '<spur>') { if (typeof v === 'object') for (const sp of SPUREN) if (v[sp] !== undefined && v[sp] !== null) next.push({ pfad: an(k.pfad, sp), wert: v[sp], spur: sp }) }
      else if (typeof v === 'object' && !Array.isArray(v) && v[s] !== undefined) next.push({ pfad: an(k.pfad, s), wert: v[s], spur: k.spur })
    }
    stand = next
  }
  return stand
}

// ------------------------------------------------------------------- Liste

/**
 * Lösungsfelder aus bereits geladenen JSON-Dateien.
 * @param {Record<string, any>} dateien  `{ 'herausforderung_A.json': {...}, 'set.json': {...} }`
 * @returns Feld[] — in Dateireihenfolge (A, B, set), innerhalb der Datei in Musterreihenfolge
 *
 * Feld = {
 *   feld    'herausforderung_A.json › spuren.mit_medien.leitfragen[LF3].loesung.zeilen[1]'
 *   datei · pfad · heft ('A' | 'B' | 'auftrag') · spur ('beide' | 'ohne_medien' | 'mit_medien')
 *   art · form · lf (1–4 oder null)
 *   text    der Text, über den der Hash läuft (noch nicht normalisiert)
 *   hash    SHA-256 hex
 *   bezug   { karte?, knoten_ref?, quelle? } — woran die Lösung laut Heft hängt (Hinweis fürs Audit, kein Beleg)
 * }
 */
export function loesungsfelderAus(dateien) {
  const out = []
  const namen = [...HEFTE.map((h) => `herausforderung_${h}.json`), 'set.json']
  for (const datei of namen) {
    const json = dateien[datei]
    if (!json || typeof json !== 'object') continue
    const heft = datei === 'set.json' ? 'auftrag' : /_([AB])\.json$/.exec(datei)[1]
    const gattung = datei === 'set.json' ? 'set.json' : 'herausforderung_<H>.json'
    for (const m of MUSTER) {
      if (m.datei !== gattung) continue
      for (const k of entfalte(json, m.pfad, m.spur === '<spur>' ? null : m.spur)) {
        const text = FORM[m.form](k.wert)
        if (!text.trim()) continue
        const lf = /\[LF(\d)\]/.exec(k.pfad)
        out.push({
          feld: `${datei} › ${k.pfad}`, datei, pfad: k.pfad, heft, spur: k.spur ?? 'beide',
          art: m.art, form: m.form, lf: lf ? +lf[1] : null,
          text, hash: hashText(text), bezug: bezugVon(json, k, m),
        })
      }
    }
  }
  return out
}

function bezugVon(json, k, m) {
  const b = {}
  const lfPfad = /^(.*?\[LF\d\])/.exec(k.pfad)?.[1]
  if (lfPfad) {
    const lf = leseFeld(json, lfPfad)
    const karte = lf?.raster?.quelle_ref ?? (/^q-/.test(lf?.loesung?.quelle_ref ?? '') ? lf.loesung.quelle_ref : null)
    if (karte) b.karte = karte
    const knoten = lf?.raster?.knoten_ref ?? lf?.knoten_ref
    if (knoten) b.knoten_ref = knoten
  }
  if (m.form === 'zeile' && k.wert?.quelle) b.quelle = k.wert.quelle
  if (m.art === 'vertiefung_erwartung') {
    const q = leseFeld(json, k.pfad.replace(/\.erwartung$/, ''))
    if (q?.ref) b.karte = q.ref
  }
  return b
}

/**
 * Lösungsfelder eines Einheiten-Ordners.
 * @param {string} ordner  Pfad des Ordners (`…/src/data/einheiten/<ordnername>`)
 * @returns {{ ordner: string, pfad: string, v42: boolean, status: string|undefined, fehler: string[], felder: any[] }}
 */
export function loesungsfelder(ordner) {
  const name = basename(resolve(ordner))
  const r = { ordner: name, pfad: ordner, v42: false, status: undefined, fehler: [], felder: [] }
  if (!existsSync(ordner)) { r.fehler.push(`kein Ordner ${ordner}`); return r }
  const dateien = {}
  for (const f of [...HEFTE.map((h) => `herausforderung_${h}.json`), 'set.json']) {
    const p = join(ordner, f)
    if (!existsSync(p)) { r.fehler.push(`${f} fehlt`); continue }
    try { dateien[f] = JSON.parse(readFileSync(p, 'utf8').replace(/^﻿/, '')) } catch (e) { r.fehler.push(`${f}: ${e.message}`) }
  }
  r.v42 = HEFTE.some((h) => dateien[`herausforderung_${h}.json`]?.template === TEMPLATE_V42)
  r.status = dateien['set.json']?.status
  if (!r.v42) return r
  r.felder = loesungsfelderAus(dateien)
  const doppelt = r.felder.map((f) => f.feld).filter((f, i, a) => a.indexOf(f) !== i)
  if (doppelt.length) r.fehler.push(`Feldpfad doppelt: ${[...new Set(doppelt)].join(', ')} (zwei Leitfragen mit gleicher nr?)`)
  return r
}

/** Zählt Felder nach einem Schlüssel — für Übersichten. */
export const zaehle = (felder, nach) => felder.reduce((m, f) => { const k = typeof nach === 'function' ? nach(f) : f[nach]; m[k] = (m[k] ?? 0) + 1; return m }, {})

// ---------------------------------------------------------------------- CLI

function cli() {
  const argv = process.argv.slice(2)
  let wurzel = REPO
  const wunsch = []
  const schalter = new Set()
  const bad = (m) => { console.error(`loesungsfelder: ${m}\nusage: node scripts/lib/loesungsfelder.mjs <ordner>… | --v42  [--felder | --json] [--wurzel <ordner>]`); process.exit(2) }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--wurzel') wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
    else if (['--v42', '--felder', '--json'].includes(a)) schalter.add(a)
    else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}`)
    else wunsch.push(a)
  }
  const EINH = join(wurzel, 'src', 'data', 'einheiten')
  if (!existsSync(EINH)) bad(`kein Ordner ${EINH}`)
  const alle = readdirSync(EINH, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
  let slugs = wunsch.map((w) => basename(w))
  const fehlt = slugs.filter((s) => !alle.includes(s))
  if (fehlt.length) bad(`kein Ordner src/data/einheiten/${fehlt.join(', ')}`)
  if (schalter.has('--v42')) slugs = alle
  if (!slugs.length) bad('nichts zu tun')

  const ergebnisse = slugs.map((s) => loesungsfelder(join(EINH, s))).filter((r) => r.v42 || !schalter.has('--v42'))
  if (schalter.has('--json')) { console.log(JSON.stringify(ergebnisse, null, 2)); process.exit(ergebnisse.some((r) => r.fehler.length) ? 1 : 0) }

  console.log(`loesungsfelder — ${ergebnisse.length} Einheit(en)\n`)
  let rot = 0; let summe = 0
  for (const r of ergebnisse) {
    if (!r.v42) { console.log(`  —       ${r.ordner}  kein Heft im Format ${TEMPLATE_V42}`); continue }
    const z = (f) => r.felder.filter(f).length
    summe += r.felder.length
    console.log(`  ${String(r.felder.length).padStart(4)}  ${r.ordner.padEnd(36)} A ${String(z((f) => f.heft === 'A')).padStart(3)} · B ${String(z((f) => f.heft === 'B')).padStart(3)} · Auftrag ${z((f) => f.heft === 'auftrag')}   beide ${String(z((f) => f.spur === 'beide')).padStart(3)} · ohne_medien ${String(z((f) => f.spur === 'ohne_medien')).padStart(3)} · mit_medien ${String(z((f) => f.spur === 'mit_medien')).padStart(3)}`)
    for (const f of r.fehler) { rot++; console.log(`        FEHLER  ${f}`) }
    if (schalter.has('--felder')) {
      for (const f of r.felder) console.log(`        ${f.hash.slice(0, 12)}  ${f.spur.padEnd(11)} ${f.art.padEnd(26)} ${f.feld}`)
      console.log(`        nach Art: ${Object.entries(zaehle(r.felder, 'art')).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
    }
  }
  console.log(`\n${summe} Lösungsfelder in ${ergebnisse.filter((r) => r.v42).length} Einheit(en).${rot ? ` ${rot} Fehler.` : ''}`)
  process.exit(rot ? 1 : 0)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) cli()
