#!/usr/bin/env node
/**
 * cloud-preflight.mjs — erster Befehl eines unbeaufsichtigten Produktionslaufs.
 * Bricht hart ab, wenn etwas fehlt, ohne das die Skill aus Modellwissen statt
 * aus dem Lehrmittel schreiben wuerde. Nur lesend.
 *
 *   node scripts/cloud-preflight.mjs
 *
 * Hintergrund: docs/cloud-run/README.md
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OEFFENTLICH = /allgemeinbildung\/bbw-hko(\.git)?\/?$/
const git = (...a) => (spawnSync('git', a, { cwd: ROOT, encoding: 'utf8' }).stdout ?? '').trim()

const befunde = []
const ok = []
const pruefe = (gut, name, wennNicht) => (gut ? ok.push(name) : befunde.push(`${name} — ${wennNicht}`))

pruefe(Number(process.versions.node.split('.')[0]) >= 20, `Node ${process.versions.node}`, 'Node 20 oder neuer noetig')

const lm = join(ROOT, 'material/_lehrmittel')
const kapitel = existsSync(lm) ? readdirSync(lm).filter((f) => /^\d+\.\d+_.+\.md$/.test(f)) : []
pruefe(kapitel.length >= 70, `Lehrmittel: ${kapitel.length} Kapitel`, 'material/_lehrmittel/ fehlt oder ist unvollstaendig (Soll: LM-26, 73 Kapitel). Ohne Quelltext KEINE Einheit erzeugen.')
if (kapitel.length) {
  const ohneMarker = kapitel.filter((f) => !/\[seite:\s*\d+\]/.test(readFileSync(join(lm, f), 'utf8')))
  pruefe(ohneMarker.length === 0, 'Seitenmarker [seite: NN] in jedem Kapitel', `fehlen in: ${ohneMarker.slice(0, 5).join(', ')}`)
}

// Jedes Kapitel, das der Crosswalk nennt, muss als Datei da sein.
const cw = join(ROOT, '.claude/skills/bbw-hko-3er-set/references/nrlp-lehrmittel-crosswalk.md')
pruefe(existsSync(cw), 'Crosswalk nRLP → Lehrmittel', 'Datei fehlt')
if (existsSync(cw) && kapitel.length) {
  const nummern = new Set(kapitel.map((f) => f.split('_')[0]))
  const genannt = new Set()
  for (const z of readFileSync(cw, 'utf8').split('\n').filter((l) => /^\| \*\*/.test(l))) {
    for (const m of z.split('|').slice(3).join('|').matchAll(/(?:^|[·|*\s])(\d{1,2}\.\d)\s+\p{Lu}/gu)) genannt.add(m[1])
  }
  const fehlt = [...genannt].filter((n) => !nummern.has(n))
  pruefe(fehlt.length === 0, `Crosswalk-Kapitel vorhanden (${genannt.size})`, `im Crosswalk genannt, aber ohne Datei: ${fehlt.join(', ')}`)
}

const archiv = join(ROOT, 'material/_quellen-archiv')
console.log(existsSync(archiv) ? `  ok      Quellenarchiv: ${readdirSync(archiv).filter((d) => d.startsWith('q-')).length} Quellen mit Volltext` : '  HINWEIS Quellenarchiv fehlt — Medien-Spur ist in diesem Klon nicht erzeugbar')
pruefe(existsSync(join(ROOT, 'CLAUDE.md')), 'CLAUDE.md', 'fehlt — Architektur- und Designregeln sind der Session unbekannt')
pruefe(existsSync(join(ROOT, '.claude/skills/bbw-hko-3er-set/SKILL.md')), 'Skill bbw-hko-3er-set', 'fehlt')
pruefe(existsSync(join(ROOT, 'node_modules/astro')), 'node_modules', 'fehlt — zuerst `npm ci`')

// Jede Zeile der Auftragsliste braucht einen freigegebenen Bauplan.
const liste = join(ROOT, 'docs/cloud-run/auftragsliste.md')
if (existsSync(liste)) {
  const ordner = readFileSync(liste, 'utf8').split('\n')
    .map((l) => /^\|\s*`?(\d+\.\d+\.\d+_[a-z0-9_]+)`?\s*\|/.exec(l)?.[1]).filter(Boolean)
  pruefe(ordner.length > 0, `Auftragsliste: ${ordner.length} Zeile(n)`, 'leer — nichts zu produzieren')
  for (const o of ordner) {
    const bp = join(ROOT, 'docs/cloud-run/bauplaene', o + '.md')
    const text = existsSync(bp) ? readFileSync(bp, 'utf8') : ''
    pruefe(/\*\*Freigabe:\*\*\s*freigegeben am \d{4}-\d{2}-\d{2}/.test(text), `Bauplan ${o}`, text ? 'nicht freigegeben' : 'fehlt')
    pruefe(!existsSync(join(ROOT, 'src/data/einheiten', o)), `Ordner ${o} ist frei`, 'existiert bereits unter src/data/einheiten/')
  }
}

const branch = git('rev-parse', '--abbrev-ref', 'HEAD')
pruefe(branch !== 'main', `Branch ${branch}`, 'auf main wird nicht produziert')

// Liegt das Lehrmittel im Arbeitsbaum versioniert vor, darf dieser Klon nie zum
// oeffentlichen Repo pushen — dort waere der Text fuer immer in der Historie.
const lmVersioniert = git('ls-files', 'material/_lehrmittel').length > 0
const origin = git('remote', 'get-url', 'origin')
if (lmVersioniert) pruefe(!OEFFENTLICH.test(origin), 'Remote ist nicht das oeffentliche Repo', `origin = ${origin}, aber das Lehrmittel ist hier versioniert. Sofort stoppen.`)

const nrlp = spawnSync(process.execPath, [join(ROOT, 'scripts/check-nrlp-consistency.mjs')], { cwd: ROOT, encoding: 'utf8' })
pruefe(nrlp.status === 0, 'nRLP-Datensaetze konsistent', (nrlp.stdout ?? '').trim().split('\n').slice(-3).join(' / '))

for (const o of ok) console.log(`  ok      ${o}`)
for (const b of befunde) console.log(`  FEHLER  ${b}`)
console.log(befunde.length ? `\nPREFLIGHT ROT — Lauf nicht starten.` : `\nPREFLIGHT GRUEN.`)
process.exit(befunde.length ? 1 : 0)
