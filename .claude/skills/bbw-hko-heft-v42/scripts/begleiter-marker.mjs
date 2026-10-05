#!/usr/bin/env node
// Fuellt die Feld-Marker in `begleiter.md` aus den fertigen Dateien der Einheit.
//
//   node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs <ordner>
//   node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs <ordner> --check
//   node .claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs --dir <pfad> [--check]
//
// <ordner>  Ordnername unter src/data/einheiten/
// --dir     ein beliebiger Ordner mit den sechs Dateien (zum Testen an einer Kopie)
// --check   schreibt nichts; meldet jeden Marker, dessen Rueckfalltext vom Datenwert abweicht
//
// Exit 0: alles aufgeloest (und bei --check: keine Abweichung).
// Exit 1: ein Marker loest nicht auf, oder --check hat eine Abweichung gefunden.
// Exit 2: Aufruf oder Dateien fehlerhaft.
//
// Die Formatierung ist dieselbe wie in `src/lib/einheiten/begleiter-felder.ts` (Loader)
// und `scripts/check-einheiten.mjs` (Drift-Pruefung). Wer dort etwas aendert, zieht es
// hier nach — diese Datei ist die dritte Stelle, nicht die Quelle.

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..')
const EINHEITEN = join(ROOT, 'src', 'data', 'einheiten')
const QUELLEN = join(ROOT, 'src', 'data', 'quellen')

const args = process.argv.slice(2)
const check = args.includes('--check')
const iDir = args.indexOf('--dir')
const frei = args.filter((a, i) => !a.startsWith('--') && (iDir < 0 || i !== iDir + 1))
const dir = iDir >= 0 ? args[iDir + 1] : frei[0] ? join(EINHEITEN, frei[0]) : null

if (!dir || (iDir >= 0 && !args[iDir + 1])) {
  console.error('Aufruf: begleiter-marker.mjs <ordner> [--check]  |  begleiter-marker.mjs --dir <pfad> [--check]')
  process.exit(2)
}
const mdPfad = join(dir, 'begleiter.md')
if (!existsSync(mdPfad)) {
  console.error(`Nicht gefunden: ${mdPfad}`)
  process.exit(2)
}

// ------------------------------------------------------------------ Daten
const q = {}
for (const [k, f] of [['hf_A', 'herausforderung_A'], ['hf_B', 'herausforderung_B'],
                      ['set', 'set'], ['kn', 'kn'], ['prinzip', 'prinzip']]) {
  const fp = join(dir, `${f}.json`)
  if (!existsSync(fp)) continue
  try {
    q[k] = JSON.parse(readFileSync(fp, 'utf8').replace(/^﻿/, ''))
  } catch (e) {
    console.error(`Kein gueltiges JSON: ${fp} — ${e.message}`)
    process.exit(2)
  }
}

// ------------------------------------------------- wie der Loader formatiert
const MARKER = /(<!--\s*hko:([^|\s>]+?)(?:\s*\|\s*([a-z]+))?\s*-->)([\s\S]*?)(<!--\s*\/hko\s*-->)/g

function pfadWert(wurzel, pfadStr) {
  let cur = wurzel
  for (const teil of pfadStr.split('.')) {
    const m = /^([^[\]]+)((?:\[\d+\])*)$/.exec(teil)
    if (!m || cur == null || typeof cur !== 'object') return undefined
    cur = cur[m[1]]
    for (const idx of m[2].match(/\d+/g) ?? []) {
      if (!Array.isArray(cur)) return undefined
      cur = cur[Number(idx)]
    }
  }
  return cur
}

function formatiere(roh, fmt) {
  if (roh == null) return null
  if (fmt === 'persona') {
    if (typeof roh !== 'object' || !roh.beruf) return null
    const rechts = [roh.betrieb, roh.ort].filter(Boolean).join(', ')
    return rechts ? `${roh.beruf} — ${rechts}` : roh.beruf
  }
  if (fmt === 'quote') {
    return typeof roh === 'string' ? roh.split('\n').map((z) => `> ${z}`.trimEnd()).join('\n') : null
  }
  if (fmt === 'checkliste') {
    return Array.isArray(roh) ? roh.map((x) => `☐ ${String(x)}`).join('\n') : null
  }
  if (fmt === 'liste') {
    return Array.isArray(roh) ? roh.map((x) => `- ${String(x)}`).join('\n') : null
  }
  return typeof roh === 'string' || typeof roh === 'number' ? String(roh) : null
}

// -------------------------------------- Quellen-Stand (Loader: alsQuellenStand)
const datumCh = (s) => {
  if (!s) return '—'
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (t) return `${t[3]}.${t[2]}.${t[1]}`
  const m = /^(\d{4})-(\d{2})$/.exec(s)
  return m ? `${m[2]}.${m[1]}` : s
}
const zelle = (s) => (s ? String(s).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ') : '—')

function zeileQuelle(rolle, k) {
  const v = k.verortung
  const verortung = v?.absaetze ?? (v?.von && v?.bis ? `${v.von}–${v.bis}` : undefined)
  const laenge = k.dauer_sek
    ? `${Math.floor(k.dauer_sek / 60)}:${String(k.dauer_sek % 60).padStart(2, '0')} Min.`
    : k.woerter ? `${k.woerter} Wörter` : undefined
  let link = '—'
  if (k.url) {
    let host = k.url
    try { host = new URL(k.url).hostname.replace(/^www\./, '') } catch { /* URL bleibt Linktext */ }
    link = `[${host}](${k.url})`
  }
  return `| ${[
    `${rolle}${k.id ? ` (${k.id})` : ''}`, zelle(k.titel), zelle(k.herausgeber), datumCh(k.datum),
    zelle(verortung), zelle(laenge), datumCh(k.sachlage_geprueft), link,
  ].join(' | ')} |`
}

const karte = (id) => {
  const fp = join(QUELLEN, `${id}.json`)
  return existsSync(fp) ? JSON.parse(readFileSync(fp, 'utf8').replace(/^﻿/, '')) : null
}

/** Tabelle aus den Karten der Medien-Spur — oder null, wenn es keine gibt oder eine Karte fehlt. */
function quellenStand() {
  const zeilen = []
  for (const [heft, key] of [['A', 'hf_A'], ['B', 'hf_B']]) {
    const refs = q[key]?.spuren?.mit_medien?.quellen
    if (!Array.isArray(refs)) continue
    let vertiefung = 0
    for (const r of refs) {
      if (!r?.ref) continue
      const k = karte(r.ref)
      if (!k) return { fehlt: r.ref }
      if (r.rolle === 'pflicht') {
        zeilen.push(zeileQuelle(`${heft} · Quelle`, k))
        if (k.ersatz_ref) {
          const e = karte(k.ersatz_ref)
          if (!e) return { fehlt: k.ersatz_ref }
          zeilen.push(zeileQuelle(`${heft} · Ersatzquelle`, e))
        }
      } else {
        zeilen.push(zeileQuelle(`${heft} · Vertiefung ${++vertiefung}`, k))
      }
    }
  }
  if (!zeilen.length) return { leer: true }
  return {
    wert: ['| Rolle | Titel | Herausgeber | Datum | Verortung | Länge | Geprüft am | Link |',
           '|---|---|---|---|---|---|---|---|', ...zeilen].join('\n'),
  }
}

// ------------------------------------------------------------------ Lauf
const roh = readFileSync(mdPfad, 'utf8')
const crlf = roh.includes('\r\n')
const nl = (s) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n'))
const norm = (s) => s.replace(/\r\n/g, '\n').trim()
const zeileVon = (index) => roh.slice(0, index).split('\n').length

let marker = 0, geaendert = 0
const unaufloesbar = [], abweichung = [], hinweis = []

const neu = roh.replace(MARKER, (ganz, start, pfad, fmt, rueckfall, ende, index) => {
  marker++
  const ort = `Zeile ${zeileVon(index)}  <!--hko:${pfad}${fmt ? `|${fmt}` : ''}-->`
  let wert
  if (fmt === 'quellenstand') {
    // Den Marker fuellt der Loader aus der Kartei; check-einheiten prueft ihn nicht.
    // Hier entsteht derselbe Rueckfall — wenn alle Karten vorliegen, sonst bleibt er stehen.
    const s = quellenStand()
    if (s.fehlt) { hinweis.push(`${ort} — Karte «${s.fehlt}» fehlt unter src/data/quellen/; Rueckfall bleibt stehen`); return ganz }
    if (s.leer) { hinweis.push(`${ort} — kein Heft fuehrt die Medien-Spur; Marker-Block gehoert nicht in diese Einheit`); return ganz }
    wert = s.wert
  } else {
    wert = formatiere(pfadWert(q, pfad), fmt)
    if (wert == null) { unaufloesbar.push(ort); return ganz }
  }
  if (norm(wert) === norm(rueckfall)) return ganz
  geaendert++
  // Gezeigt wird die erste Zeile, die abweicht — bei Tabellen und Listen sonst nur der gleiche Kopf.
  const ist = norm(rueckfall).split('\n'), soll = norm(wert).split('\n')
  const z = Math.max(0, soll.findIndex((s, i) => s !== ist[i]))
  const kurz = (s) => (s == null ? '(fehlt)' : s.length > 110 ? `${s.slice(0, 110)}…` : s)
  abweichung.push(`${ort}${soll.length > 1 ? ` · Zeile ${z + 1} von ${soll.length}` : ''}\n      ist:  ${kurz(ist[z])}\n      soll: ${kurz(soll[z])}`)
  const mehrzeilig = /^\s*\n/.test(rueckfall)
  return `${start}${nl(mehrzeilig ? `\n${wert}\n` : wert)}${ende}`
})

for (const h of hinweis) console.log(`HINWEIS       ${h}`)
for (const u of unaufloesbar) console.log(`UNAUFLOESBAR  ${u} — Pfad zeigt ins Leere oder auf den falschen Typ`)
for (const a of abweichung) console.log(`${check ? 'ABWEICHUNG  ' : 'GEFUELLT    '}  ${a}`)

if (!check && geaendert) writeFileSync(mdPfad, neu, 'utf8')

console.log(
  `${marker} Marker · ${check ? `${geaendert} abweichend` : `${geaendert} neu gefuellt`} · ` +
  `${unaufloesbar.length} unaufloesbar${check ? ' · nichts geschrieben' : ''}`,
)
process.exit(unaufloesbar.length || (check && geaendert) ? 1 : 0)
