#!/usr/bin/env node
/**
 * gleiche-stelle.mjs — der Rückweg: eine gefundene Fehlerform in allen Einheiten suchen.
 * Stammt ein Fehler aus einer Regel der Skill, einem Skelett, einer Karte oder dem Renderer,
 * steht er wahrscheinlich nicht nur in der Einheit, in der er auffiel (ENTSCHEIDE E38,
 * Stufe D — keine Vererbung; Rückblick RUECKBLICK-produktion-2026-10-06.md §5.4 «Rückweg»).
 *
 *   node scripts/gleiche-stelle.mjs <feldpfad> <muster>
 *   node scripts/gleiche-stelle.mjs "spuren.*.leitfragen[*].loesung.**" "OR\s?40[a-g]"
 *   node scripts/gleiche-stelle.mjs "handlungsprodukt.schritte[*].hint" "Arbeitsfläche" --v42
 *   node scripts/gleiche-stelle.mjs "**" "Stufe\s[0-3]" --datei "herausforderung_*.json" --ohne 3.3.1_kaufvertrag_beurteilen
 *
 *   <feldpfad>   Pfad eines Felds mit Platzhaltern — er muss den ganzen Pfad treffen:
 *                  *     ein Stück eines Segments (kein Punkt, keine Klammer): «spuren.*.quellen»
 *                  [*]   jeder Index einer Liste, auch «[LF3]»
 *                  **    beliebig viele Segmente (auch keines): «**.loesung.**», «**» = jedes Feld
 *                Leitfragen heissen wie in den Prüfskripten nach ihrer Nummer: «leitfragen[LF3]».
 *                Begleiter: «Absatz N» (alle: «Absatz *»). Karten: der Pfad in der Karte.
 *   <muster>     regulärer Ausdruck (JavaScript, Unicode); Gross/Klein zählt, ausser mit --egal
 *   --datei <glob>     nur Dateien mit diesem Namen: «set.json», «herausforderung_*.json», «begleiter.md»
 *   --v42              nur Einheiten im Format v4.2 (Vorgabe: alle Einheiten)
 *   --einheit <ordner> nur diese Einheit (mehrfach möglich)
 *   --ohne <ordner>    diese Einheit auslassen — die, in der der Fehler gefunden wurde (mehrfach möglich)
 *   --ohne-karten      Methoden- und Quellenkarten nicht durchsuchen
 *   --egal             Gross- und Kleinschreibung nicht unterscheiden
 *   --zaehlen          nur die Zahl der Treffer je Einheit — diese Fassung gehört in Bericht und OFFEN.md
 *   --wurzel <ordner>  anderer Baum statt dieses Repos (Gegenproben, Altstand in einer Temp-Kopie)
 *
 * Durchsucht wird jede Zeichenkette (auch jede Zahl, als Text) jeder JSON-Datei im Ordner einer Einheit (auch
 * herausforderung_C.json und die KI-Dateien eines 3er-Sets), dazu begleiter.md je Absatz und —
 * einmal, nicht je Einheit — jede Karte unter src/data/methoden/ und src/data/quellen/.
 *
 * Ausgabe je Treffer: Einheit · Datei › Pfad · Ausschnitt von höchstens acht Wörtern rund um den
 * Treffer. Der Ausschnitt ist eigener Text der Einheit bzw. Karte, nie Text aus Quelle oder
 * Lehrmittel — die liest dieses Skript nicht.
 *
 * Das Skript ändert nichts und entscheidet nichts: Ob ein Treffer derselbe Fehler ist, sagt ein
 * Mensch oder der Orchestrator. Die Regel dazu: references/phase-9-tor.md §4 der Skill.
 *
 * Exit 0  gesucht, kein Treffer
 * Exit 1  gesucht, mindestens ein Treffer (ein Treffer ist ein Befund für die Liste «Offen»)
 * Exit 2  Aufruf falsch (Muster kein gültiger Ausdruck, Ordner fehlt)
 *
 * Reines Node, keine Abhängigkeiten, ohne Netz, nur lesend.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { umfeld, TEMPLATE_V42 } from './lib/pruefung.mjs'

const NAME = 'gleiche-stelle'
const USAGE = 'usage: node scripts/gleiche-stelle.mjs <feldpfad> <muster> [--datei <glob>] [--v42] [--einheit <ordner>]… [--ohne <ordner>]… [--ohne-karten] [--egal] [--zaehlen] [--wurzel <ordner>]'
const bad = (m) => { console.error(`${NAME}: ${m}\n${USAGE}`); process.exit(2) }

// ----------------------------------------------------------------- Aufruf

const argv = process.argv.slice(2)
let wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const pos = []
const nur = []; const ohne = []
let dateiGlob = null; let V42 = false; let KARTEN = true; let EGAL = false; let ZAEHLEN = false
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--wurzel') wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
  else if (a === '--datei') dateiGlob = argv[++i] ?? bad('--datei braucht ein Muster')
  else if (a === '--einheit') nur.push(argv[++i] ?? bad('--einheit braucht einen Ordner'))
  else if (a === '--ohne') ohne.push(argv[++i] ?? bad('--ohne braucht einen Ordner'))
  else if (a === '--v42') V42 = true
  else if (a === '--alle') V42 = false
  else if (a === '--ohne-karten') KARTEN = false
  else if (a === '--egal') EGAL = true
  else if (a === '--zaehlen') ZAEHLEN = true
  else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}`)
  else pos.push(a)
}
if (pos.length !== 2) bad(`erwartet werden genau <feldpfad> und <muster>, erhalten: ${pos.length}`)
const [feldpfad, musterText] = pos
let muster
try { muster = new RegExp(musterText, EGAL ? 'giu' : 'gu') } catch (e) { bad(`<muster> ist kein gültiger regulärer Ausdruck: ${e.message}`) }
if (muster.test('')) bad('<muster> trifft die leere Zeichenkette — das trifft jedes Feld')

/** Platzhalter-Pfad → RegExp über den ganzen Pfad. */
function glob(g, { pfad = true } = {}) {
  let re = ''
  for (let i = 0; i < g.length; i++) {
    const c = g[i]
    if (pfad && g.startsWith('.**.', i)) { re += '(?:\\..*\\.|\\.)'; i += 3 }        // «a.**.b» trifft auch «a.b»
    else if (pfad && g.startsWith('**.', i) && i === 0) { re += '(?:.*[.\\]])?'; i += 2 } // «**.b» trifft auch «b»
    else if (pfad && g.startsWith('.**', i) && i + 3 === g.length) { re += '(?:[.\\[].*)?'; i += 2 } // «a.**» trifft auch «a»
    else if (g.startsWith('**', i)) { re += '.*'; i += 1 }
    else if (pfad && g.startsWith('[*]', i)) { re += '\\[[^\\]]*\\]'; i += 2 }
    else if (c === '*') re += pfad ? '[^.\\[\\]]*' : '.*'
    else re += c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  return new RegExp(`^${re}$`, 'u')
}
const rePfad = glob(feldpfad)
const reDatei = dateiGlob ? glob(dateiGlob, { pfad: false }) : null

const EINH = join(wurzel, 'src', 'data', 'einheiten')
if (!existsSync(EINH)) bad(`kein Ordner ${EINH}`)
const alle = readdirSync(EINH, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
for (const s of [...nur, ...ohne]) if (!alle.includes(s)) bad(`kein Ordner src/data/einheiten/${s}`)

// ------------------------------------------------------------------ Lesen

const liesText = (p) => readFileSync(p, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n')
function* strings(o, p = '') {
  if (typeof o === 'string') { if (o.trim()) yield [p, o] } else if (typeof o === 'number' || typeof o === 'boolean') yield [p, String(o)]
  else if (Array.isArray(o)) {
    for (let i = 0; i < o.length; i++) {
      // Leitfragen heissen nach ihrer Nummer, wie in lib/loesungsfelder.mjs und lib/pruefung.mjs.
      const lf = /(?:^|\.)leitfragen$/.test(p) && Number.isInteger(o[i]?.nr) ? `LF${o[i].nr}` : i
      yield* strings(o[i], `${p}[${lf}]`)
    }
  } else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) yield* strings(v, p ? `${p}.${k}` : k)
}

/** Felder eines Ordners: jede JSON-Datei, dazu begleiter.md je Absatz. → [{ datei, pfad, text }] */
function felderVon(dir) {
  const out = []; const fehler = []
  for (const f of readdirSync(dir).sort()) {
    if (reDatei && !reDatei.test(f)) continue
    const p = join(dir, f)
    if (f.endsWith('.json')) {
      try { for (const [pfad, text] of strings(JSON.parse(liesText(p)))) out.push({ datei: f, pfad, text }) } catch (e) { fehler.push(`${f}: ${e.message}`) }
    } else if (f.endsWith('.md')) {
      liesText(p).split(/\n\s*\n/).forEach((abs, i) => { if (abs.trim()) out.push({ datei: f, pfad: `Absatz ${i + 1}`, text: abs }) })
    }
  }
  return { felder: out, fehler }
}

function suche(felder) {
  const treffer = []
  for (const f of felder) {
    if (!rePfad.test(f.pfad)) continue
    for (const m of f.text.matchAll(muster)) treffer.push({ datei: f.datei, pfad: f.pfad, ausschnitt: umfeld(f.text, m.index, m[0].length, 8) })
  }
  return treffer
}

// ---------------------------------------------------------------- Suchen

const istV42 = (s) => { try { return JSON.parse(liesText(join(EINH, s, 'herausforderung_A.json'))).template === TEMPLATE_V42 } catch { return false } }
const umfang = alle.filter((s) => (!nur.length || nur.includes(s)) && !ohne.includes(s) && (!V42 || istV42(s)))
const kopf = `${NAME} — Feld «${feldpfad}»${dateiGlob ? ` in «${dateiGlob}»` : ''} · Muster /${musterText}/${EGAL ? 'i' : ''} · ${umfang.length} Einheit(en)${V42 ? ' im Format v4.2' : ''}${ohne.length ? ` · ohne ${ohne.join(', ')}` : ''}`
console.log(kopf + '\n')

let summe = 0; let mitTreffer = 0; let unlesbar = 0
const jeEinheit = []
for (const s of umfang) {
  const { felder, fehler } = felderVon(join(EINH, s))
  unlesbar += fehler.length
  for (const f of fehler) console.log(`  HINWEIS ${s} · ${f} — nicht durchsucht`)
  const t = suche(felder)
  jeEinheit.push([s, t.length])
  if (!t.length) continue
  summe += t.length; mitTreffer++
  if (ZAEHLEN) continue
  console.log(`${s} — ${t.length} Treffer`)
  for (const x of t) console.log(`  ${s} · ${x.datei} › ${x.pfad} · «${x.ausschnitt}»`)
}

let kartenTreffer = 0
const kartenZeilen = []
if (KARTEN && !nur.length) {
  for (const art of ['methoden', 'quellen']) {
    const dir = join(wurzel, 'src', 'data', art)
    if (!existsSync(dir)) continue
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.json') && !x.startsWith('_')).sort()) {
      if (reDatei && !reDatei.test(f)) continue
      let j
      try { j = JSON.parse(liesText(join(dir, f))) } catch { unlesbar++; continue }
      const t = suche([...strings(j)].map(([pfad, text]) => ({ datei: `${art}/${f}`, pfad, text })))
      kartenTreffer += t.length
      for (const x of t) kartenZeilen.push(`  Karte · ${x.datei} › ${x.pfad} · «${x.ausschnitt}»`)
    }
  }
  if (kartenZeilen.length && !ZAEHLEN) { console.log(`Karten — ${kartenTreffer} Treffer (wer sie führt: node scripts/karten.mjs verbraucher <id>)`); for (const z of kartenZeilen) console.log(z) }
}

// --------------------------------------------------------------- Schluss

if (!ZAEHLEN && (summe || kartenTreffer)) console.log('')
console.log('Treffer je Einheit:')
for (const [s, n] of jeEinheit) if (n) console.log(`  ${String(n).padStart(4)}  ${s}`)
if (!mitTreffer) console.log('     —  keine')
if (KARTEN && !nur.length) console.log(`  ${String(kartenTreffer).padStart(4)}  Karten (src/data/methoden, src/data/quellen)`)
console.log(`\n${summe + kartenTreffer} Treffer: ${summe} in ${mitTreffer} von ${umfang.length} Einheit(en)${KARTEN && !nur.length ? `, ${kartenTreffer} in Karten` : ''}.${unlesbar ? ` ${unlesbar} Datei(en) unlesbar — nicht durchsucht.` : ''} Nichts geändert.`)
process.exit(summe + kartenTreffer ? 1 : 0)
