#!/usr/bin/env node
/**
 * check-links.mjs — ruft jede URL der Quellenkarten und Hefte ab: Status und Weiterleitung.
 * MIT NETZ. Läuft NICHT im Tor (check-all); gedacht für einen wöchentlichen Lauf, auch nach
 * der Freigabe (ENTSCHEIDE E38, Rückblick §5.2).
 *
 *   node scripts/check-links.mjs <ordner> [<ordner> …]   # die URLs dieser Einheiten und ihrer Karten
 *   node scripts/check-links.mjs --alle                  # alle Einheiten im Format v4.2
 *   … --out <datei>                                      # Protokoll dorthin statt nach docs/cloud-run/laeufe/links-<datum>.txt
 *   … --kein-protokoll                                   # nur Konsole
 *   … --liste                                            # OHNE Netz: nur die Adressen zeigen, die abgerufen würden
 *   … --wurzel <ordner>                                  # anderer Baum statt dieses Repos
 *
 * Wöchentlicher Lauf (nichts ist eingeplant — nur dieser Befehl):
 *   node scripts/check-links.mjs --alle
 *
 * Geprüft wird je URL: zuerst HEAD, bei Ablehnung GET; Weiterleitungen werden verfolgt
 * (höchstens fünf) und gemeldet. Gelesen werden `url` der Quellenkarten und jede
 * http(s)-Adresse in den Dateien der Einheit (Hefte, Set, KN, Begleiter). Das Protokoll
 * nennt Status, URL und wo sie steht — nie Inhalt der Seite.
 *
 * Codes:
 *   ERR_LINK_TOT           Die Adresse antwortet mit 404, 410 oder einem Serverfehler, oder der Name löst nicht auf.
 *   WARN_LINK_UMLEITUNG    Die Adresse leitet dauerhaft weiter (301/308) — Ziel in die Karte übernehmen?
 *   WARN_LINK_ZUGANG       401, 403 oder 429: Die Seite verweigert den Abruf durch ein Skript — im Browser ansehen.
 *   WARN_LINK_ZEIT         Keine Antwort innert 20 Sekunden.
 *   HINWEIS_LINK_VORUEBERGEHEND  Vorübergehende Weiterleitung (302/303/307) — nur genannt.
 *
 * Exit 0  keine tote Adresse (Warnungen möglich)
 * Exit 1  mindestens eine tote Adresse
 * Exit 2  Aufruf falsch
 *
 * Reines Node (fetch), keine Abhängigkeiten. Schreibt nur das Protokoll.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
let wurzel = REPO
let out = null
let alle = false
let keinProtokoll = false
let nurListe = false
const ordner = []
const bad = (m) => { console.error(`check-links: ${m}\nusage: node scripts/check-links.mjs <ordner>… | --alle  [--out <datei>] [--kein-protokoll] [--wurzel <ordner>]`); process.exit(2) }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--wurzel') wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
  else if (a === '--out') out = resolve(argv[++i] ?? bad('--out braucht eine Datei'))
  else if (a === '--alle' || a === '--v42') alle = true
  else if (a === '--kein-protokoll') keinProtokoll = true
  else if (a === '--liste') nurListe = true
  else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}`)
  else ordner.push(basename(a.replace(/[\\/]+$/, '')))
}
const EINH = join(wurzel, 'src', 'data', 'einheiten')
if (!existsSync(EINH)) bad(`kein Ordner ${EINH}`)
const lies = (p) => { try { return JSON.parse(readFileSync(p, 'utf8').replace(/^﻿/, '')) } catch { return null } }
const vorhanden = readdirSync(EINH, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
const slugs = alle ? vorhanden.filter((s) => lies(join(EINH, s, 'herausforderung_A.json'))?.template === 'heft_8page_v42') : ordner
const fehlt = slugs.filter((s) => !vorhanden.includes(s))
if (fehlt.length) bad(`kein Ordner src/data/einheiten/${fehlt.join(', ')}`)
if (!slugs.length) bad('kein Ordner genannt')

// ------------------------------------------------------------- URLs sammeln

// Bis zum ersten Zeichen, das in Prosa und Markdown eine Adresse beendet (auch der Backtick einer Code-Spanne).
const RE_URL = /https?:\/\/[^\s"'<>)\]|»`]+/g
const urls = new Map() // url → Set(wo)
const nimm = (url, wo) => { const u = url.replace(/[.,;:!?*_]+$/, ''); (urls.get(u) ?? urls.set(u, new Set()).get(u)).add(wo) }
function* strings(o, p = '') {
  if (typeof o === 'string') yield [p, o]
  else if (Array.isArray(o)) for (let i = 0; i < o.length; i++) yield* strings(o[i], `${p}[${i}]`)
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) yield* strings(v, p ? `${p}.${k}` : k)
}
for (const slug of slugs) {
  const dir = join(EINH, slug)
  const karten = new Set()
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.json')) {
      const j = lies(join(dir, f))
      for (const [p, s] of strings(j)) {
        for (const m of s.matchAll(RE_URL)) nimm(m[0], `${slug}/${f} › ${p}`)
        if (/(^|\.)(ref|quelle_ref|ersatz_ref)$/.test(p) && /^q-/.test(s)) karten.add(s)
      }
    } else if (f.endsWith('.md')) for (const m of readFileSync(join(dir, f), 'utf8').matchAll(RE_URL)) nimm(m[0], `${slug}/${f}`)
  }
  for (const id of [...karten]) { const k = lies(join(wurzel, 'src', 'data', 'quellen', `${id}.json`)); if (k?.ersatz_ref) karten.add(k.ersatz_ref) }
  for (const id of karten) {
    const k = lies(join(wurzel, 'src', 'data', 'quellen', `${id}.json`))
    if (!k) continue
    for (const [p, s] of strings(k)) for (const m of s.matchAll(RE_URL)) nimm(m[0], `quellen/${id}.json › ${p} (${slug})`)
  }
}

// ----------------------------------------------------------------- Abrufen

const KOPF = { 'user-agent': 'Mozilla/5.0 (compatible; bbw-hko-check-links/1.0; +https://bbw-hko.ch)', accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'accept-language': 'de-CH,de;q=0.9' }
const ZEIT_MS = 20_000

async function einmal(url, method) {
  const ctl = new AbortController()
  const uhr = setTimeout(() => ctl.abort(), ZEIT_MS)
  try {
    const r = await fetch(url, { method, redirect: 'manual', headers: KOPF, signal: ctl.signal })
    try { await r.body?.cancel() } catch { /* Verbindung war schon zu */ }
    return { status: r.status, ziel: r.headers.get('location') }
  } catch (e) {
    return { status: 0, fehler: e.name === 'AbortError' ? 'zeit' : (e.cause?.code ?? e.code ?? e.message) }
  } finally { clearTimeout(uhr) }
}
async function pruefe(url) {
  const kette = []
  let akt = url
  for (let hop = 0; hop < 6; hop++) {
    let r = await einmal(akt, 'HEAD')
    // Manche Server lehnen HEAD ab oder antworten darauf falsch.
    if (r.status === 0 || [400, 403, 404, 405, 406, 501].includes(r.status)) { const g = await einmal(akt, 'GET'); if (g.status) r = g }
    kette.push({ url: akt, ...r })
    if (r.status >= 300 && r.status < 400 && r.ziel) { akt = new URL(r.ziel, akt).href; continue }
    break
  }
  return kette
}

const liste = [...urls.keys()].sort()
if (nurListe) {
  // Ohne Netz: nur zeigen, was abgerufen würde.
  for (const u of liste) console.log(`${u}\n    ${[...urls.get(u)].join(' · ')}`)
  console.log(`\n${liste.length} Adresse(n) in ${slugs.length} Einheit(en) — nichts abgerufen.`)
  process.exit(0)
}
console.log(`check-links — ${slugs.length} Einheit(en), ${liste.length} Adresse(n) · mit Netz, nicht im Tor\n`)
const ergebnisse = new Array(liste.length)
let naechste = 0
async function arbeiter() { while (naechste < liste.length) { const i = naechste++; ergebnisse[i] = await pruefe(liste[i]) } }
await Promise.all(Array.from({ length: 4 }, arbeiter))

// ----------------------------------------------------------------- Ausgabe

const zeilen = []
const zahl = { 'FEHLER ': 0, warnung: 0, HINWEIS: 0, ok: 0 }
liste.forEach((url, i) => {
  const k = ergebnisse[i]
  const erste = k[0]; const letzte = k[k.length - 1]
  let art = 'ok     '; let code = ''; let was = `${letzte.status}`
  if (letzte.status === 0) { if (letzte.fehler === 'zeit') { art = 'warnung'; code = 'WARN_LINK_ZEIT'; was = `keine Antwort innert ${ZEIT_MS / 1000} s` } else { art = 'FEHLER '; code = 'ERR_LINK_TOT'; was = `Netzfehler ${letzte.fehler}` } }
  else if ([401, 403, 429].includes(letzte.status)) { art = 'warnung'; code = 'WARN_LINK_ZUGANG'; was = `${letzte.status} — verweigert den Abruf durch ein Skript` }
  else if (letzte.status >= 400) { art = 'FEHLER '; code = 'ERR_LINK_TOT'; was = `${letzte.status}` }
  else if (k.length > 1 && [301, 308].includes(erste.status)) { art = 'warnung'; code = 'WARN_LINK_UMLEITUNG'; was = `${erste.status} → ${letzte.url} (${letzte.status})` }
  else if (k.length > 1) { art = 'HINWEIS'; code = 'HINWEIS_LINK_VORUEBERGEHEND'; was = `${erste.status} → ${letzte.url} (${letzte.status})` }
  zahl[art.trim() === 'ok' ? 'ok' : art]++
  zeilen.push(`  ${art}  ${code ? code + '  ' : ''}${url}\n           ${was} · steht in: ${[...urls.get(url)].slice(0, 4).join(' · ')}${urls.get(url).size > 4 ? ` · und ${urls.get(url).size - 4} weitere` : ''}`)
})
const ende = zahl['FEHLER '] ? `ROT — ${zahl['FEHLER ']} tote Adresse(n), ${zahl.warnung} Warnung(en), ${zahl.HINWEIS} Hinweis(e), ${zahl.ok} in Ordnung.` : `GRUEN — keine tote Adresse, ${zahl.warnung} Warnung(en), ${zahl.HINWEIS} Hinweis(e), ${zahl.ok} in Ordnung.`
const heute = new Date().toISOString().slice(0, 10)
const text = [`check-links — ${heute} — ${slugs.join(', ')}`, `${liste.length} Adressen`, '', ...zeilen, '', ende].join('\n')
console.log(zeilen.join('\n'))
console.log(`\n${ende}`)
if (!keinProtokoll) {
  const ziel = out ?? join(wurzel, 'docs', 'cloud-run', 'laeufe', `links-${heute}.txt`)
  mkdirSync(dirname(ziel), { recursive: true })
  writeFileSync(ziel, text + '\n', 'utf8')
  console.log(`Protokoll: ${ziel}`)
}
process.exit(zahl['FEHLER '] ? 1 : 0)
