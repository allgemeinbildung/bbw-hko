#!/usr/bin/env node
/**
 * check-leck.mjs — Leck-Pruefung fuer beliebige Pfade.
 *
 *   node scripts/check-leck.mjs <pfad> [<pfad> …]   # Dateien oder Ordner
 *   node scripts/check-leck.mjs --staged            # alles, was im Index zum Commit steht
 *   node scripts/check-leck.mjs --unversioniert     # alles, was git nicht kennt (ohne Ignoriertes)
 *   … --material <ordner>                           # anderer Ordner statt material/ (nur fuer Tests)
 *
 * Das Repo ist oeffentlich; Lehrmittel und Quellentexte duerfen nie hinein.
 * check-all.mjs prueft das fuer src/data/einheiten/, dieses Skript fuer alles
 * andere: Bauplaene, Laufberichte, Prompts, Quellenkarten, Uebergabedokumente.
 *
 * Verglichen wird absatzweise (JSON: Zeichenkette fuer Zeichenkette) gegen
 * material/_lehrmittel* / (.md und .txt) und das Quellenarchiv (q-* und
 * _kandidaten/). Schwellen wie im Tor: Warnung ab 14, Fehler ab 25 Woertern
 * am Stueck (scripts/lib/leck.mjs).
 *
 * Geprueft werden Textdateien (.md .json .txt, dazu .html, Code und
 * Konfiguration). Was kein Text ist (zip, pdf, docx, Bilder), kann nicht
 * geprueft werden und wird am Schluss aufgezaehlt — es gehoert nicht ins Repo,
 * solange niemand es von Hand angesehen hat.
 *
 * Exit 0  kein Treffer
 * Exit 1  mindestens eine Warnung oder ein Fehler
 * Exit 2  Pruefung nicht moeglich (Lehrmittel oder Archiv fehlt lokal,
 *         Aufruf falsch) — nie «gruen»
 *
 * Reines Node, keine Abhaengigkeiten, nur lesend.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative, extname, basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { ladeLehrmittel, alleUebernahmen, strings, ARCHIV, LECK_WARN, LECK_ERR } from './lib/leck.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TEXT = new Set(['.md', '.json', '.txt', '.html', '.htm', '.mjs', '.cjs', '.js', '.jsx', '.ts', '.tsx', '.astro', '.css', '.yml', '.yaml', '.csv', '.sql', '.py', '.sh', '.ps1', '.svg', '.xml', '.rels'])
const OHNE_ENDUNG = new Set(['.gitignore', '.gitattributes', '.npmrc', '.nvmrc', '.env.example'])
const NIE = new Set(['node_modules', '.git', 'dist', '.astro', '.vercel'])

const argv = process.argv.slice(2)
let material
let materialFehlt = false
const pfade = []
const schalter = new Set()
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--material') { material = argv[++i]; materialFehlt = !material }
  else if (argv[i].startsWith('--')) schalter.add(argv[i])
  else pfade.push(argv[i])
}
const STAGED = schalter.has('--staged')
const UNVERS = schalter.has('--unversioniert')
const unbekannt = [...schalter].filter((s) => !['--staged', '--unversioniert'].includes(s))

if (unbekannt.length || (!pfade.length && !STAGED && !UNVERS) || materialFehlt) {
  console.error('usage: node scripts/check-leck.mjs <pfad>… | --staged | --unversioniert   [--material <ordner>]')
  process.exit(2)
}

// ---------------------------------------------------------- Vergleichsbasis

const lm = ladeLehrmittel({ ...(material ? { material: resolve(material) } : {}), txt: true, kandidaten: true })
if (!lm) {
  console.error(`check-leck: Lehrmittel fehlt lokal (${material ?? 'material/_lehrmittel*/'}) — die Pruefung ist NICHT gelaufen. Kein «gruen».`)
  process.exit(2)
}
if (!ARCHIV || !lm.quellen) {
  console.error('check-leck: Quellenarchiv fehlt lokal (material/_quellen-archiv/ oder QUELLEN_ARCHIV) — die Pruefung ist NICHT gelaufen. Kein «gruen».')
  process.exit(2)
}

// ------------------------------------------------------------------ Umfang

const git = (args) => {
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'buffer', maxBuffer: 1 << 30 })
  if (r.status !== 0) {
    console.error(`check-leck: git ${args.join(' ')} — ${r.stderr?.toString().trim()}`)
    process.exit(2)
  }
  return r.stdout
}
const liste = (args) => git(args).toString('utf8').split('\0').filter(Boolean)

/** [anzeige, () => Buffer] */
const dateien = []
const vonPlatte = (abs) => dateien.push([relative(ROOT, abs).replace(/\\/g, '/') || abs, () => readFileSync(abs)])
const lauf = (abs) => {
  if (statSync(abs).isDirectory()) {
    for (const e of readdirSync(abs, { withFileTypes: true })) {
      if (e.isDirectory() && NIE.has(e.name)) continue
      lauf(join(abs, e.name))
    }
  } else vonPlatte(abs)
}

if (STAGED) for (const f of liste(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'])) dateien.push([f, () => git(['show', `:${f}`])])
if (UNVERS) for (const f of liste(['ls-files', '--others', '--exclude-standard', '-z'])) vonPlatte(join(ROOT, f))
for (const p of pfade) {
  const abs = resolve(p)
  if (!existsSync(abs)) {
    console.error(`check-leck: ${p} gibt es nicht`)
    process.exit(2)
  }
  lauf(abs)
}

// ----------------------------------------------------------------- Pruefung

const zeileVon = (text, index) => text.slice(0, Math.max(0, index)).split('\n').length

/** Text in Absaetze [zeile, text] zerlegen (Leerzeile trennt). */
function absaetze(text) {
  const out = []
  const re = /\n[ \t\r]*\n/g
  let start = 0
  let m
  const nimm = (ende) => {
    const stueck = text.slice(start, ende)
    const vor = stueck.length - stueck.trimStart().length
    if (stueck.trim()) out.push([zeileVon(text, start + vor), stueck])
  }
  while ((m = re.exec(text))) { nimm(m.index); start = m.index + m[0].length }
  nimm(text.length)
  return out
}

/** Auszeichnung entfernen, Zeilenumbrueche behalten (Zeilennummern bleiben gueltig). */
const leer = (m) => m.replace(/[^\n]/g, ' ')
const ohneHtml = (s) => s.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, leer).replace(/<!--[\s\S]*?-->/g, leer).replace(/<[^>]*>/g, leer).replace(/&nbsp;/g, ' ')

function stuecke(name, text) {
  const ext = extname(name).toLowerCase()
  if (ext === '.json') {
    try {
      const out = []
      let ab = 0
      for (const [pfad, s] of strings(JSON.parse(text))) {
        // Fundstelle: die Zeichenkette steht in der Datei in JSON-Schreibweise.
        const nadel = JSON.stringify(s).slice(1, 61)
        let i = text.indexOf(nadel, ab)
        if (i < 0) i = text.indexOf(nadel)
        if (i >= 0) ab = i
        out.push([i >= 0 ? zeileVon(text, i) : 1, s, pfad])
      }
      return out
    } catch { /* kein gueltiges JSON: wie Text behandeln */ }
  }
  return absaetze(ext === '.html' || ext === '.htm' ? ohneHtml(text) : text)
}

const treffer = []
const ungeprueft = []
let geprueft = 0
const gesehen = new Set()
for (const [name, lies] of dateien) {
  if (gesehen.has(name)) continue
  gesehen.add(name)
  const ext = extname(name).toLowerCase()
  if (!TEXT.has(ext) && !OHNE_ENDUNG.has(basename(name))) { ungeprueft.push(name); continue }
  let text
  try { text = lies().toString('utf8') } catch (e) { ungeprueft.push(`${name} (nicht lesbar: ${e.message})`); continue }
  geprueft++
  for (const [zeile, s, pfad] of stuecke(name, text)) {
    if (s.length <= 80) continue
    for (const u of alleUebernahmen(s, lm)) treffer.push({ name, zeile, pfad, ...u })
  }
}

// ------------------------------------------------------------------ Ausgabe

const umfang = [STAGED && 'Index (--staged)', UNVERS && 'unversioniert', pfade.length && pfade.join(' ')].filter(Boolean).join(' + ')
console.log(`check-leck — ${umfang}`)
console.log(`  Vergleichsbasis: ${lm.dateien} Kapiteldateien und ${lm.quellen} Quellentexte · Warnung ab ${LECK_WARN}, Fehler ab ${LECK_ERR} Woertern am Stueck`)
console.log(`  ${geprueft} Textdatei(en) geprueft${ungeprueft.length ? `, ${ungeprueft.length} nicht pruefbar` : ''}\n`)

const fehler = treffer.filter((t) => t.woerter >= LECK_ERR)
for (const t of treffer) {
  console.log(`  ${t.woerter >= LECK_ERR ? 'FEHLER ' : 'warnung'}  ${t.name}:${t.zeile}${t.pfad ? `  (${t.pfad})` : ''}`)
  console.log(`           ${t.woerter} Woerter am Stueck — ${t.quelle ?? 'Herkunft unbekannt'}`)
  console.log(`           «${t.auszug}»`)
}
if (ungeprueft.length) {
  console.log(`${treffer.length ? '\n' : ''}  NICHT PRUEFBAR (kein Text) — nicht committen, ohne es von Hand angesehen zu haben:`)
  for (const n of ungeprueft) console.log(`           ${n}`)
}

const warnungen = treffer.length - fehler.length
console.log(`\n${treffer.length ? `ROT — ${fehler.length} Fehler, ${warnungen} Warnung(en).` : `GRUEN — keine woertliche Uebernahme ab ${LECK_WARN} Woertern.`}`)
process.exit(treffer.length ? 1 : 0)
