#!/usr/bin/env node
/**
 * check-all.mjs — das Tor fuer erzeugte Einheiten. Ein Befehl, ein Exit-Code.
 *
 *   node scripts/check-all.mjs <slug> [<slug> …]   # genau diese Ordner
 *   node scripts/check-all.mjs --neu               # alles, was origin/main nicht kennt
 *   node scripts/check-all.mjs --entwurf           # alle mit status "entwurf"
 *   node scripts/check-all.mjs --alle              # der ganze Bestand (nur zur Kalibrierung)
 *   … --cloud                                      # unbeaufsichtigter Lauf: Lehrmittel MUSS da sein
 *
 * Buendelt die bestehenden Checks (nRLP, check-einheiten, check-lf-loesung,
 * check-v42, sync-einheiten-nrlp --check) und ergaenzt, was bisher kein Skript
 * prueft (docs/pipeline-review-2026-10-01.md, Abschnitt D):
 *
 *   STRUKTUR   Pflichtdateien, jedes JSON parsbar, IDs tragen den Ordnernamen,
 *              ein Lehrgang ueber alle Herausforderungen
 *   STATUS     set.status ist exakt "entwurf" | "publiziert" | "archiviert" | fehlt —
 *              der Index-Builder bricht bei jedem anderen Wert ab (E37). Unter --neu
 *              und --cloud muss er "entwurf" sein.
 *   METHODEN   Refs existieren in src/data/methoden/, genau vier Eintraege,
 *              genau zwei mit Beispiel (docs/methodenkartei.md)
 *   SPRACHE    kein «ß», keine stehengebliebenen Platzhalter
 *   KARTEN     keine Karte geaendert, die ein publiziertes Heft fuehrt — ausser
 *              als Fehler mit Vermerk (scripts/karten.mjs geaendert, gegen origin/main)
 *   LECK       keine woertliche Lehrmittelpassage in den Daten — das Repo ist
 *              oeffentlich, das Lehrmittel nicht. Verglichen wird gegen
 *              material/_lehrmittel/ (gitignored) und das Quellenarchiv
 *              (Transkripte, Artikel); fehlt das Lehrmittel, ist die
 *              Pruefung nicht moeglich: HINWEIS, unter --cloud ein Fehler.
 *
 * Reines Node, keine Abhaengigkeiten, nur lesend. Exit 0 nur ohne FEHLER.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
// Leck-Pruefung: geteilt mit scripts/check-leck.mjs (beliebige Pfade).
import { ladeLehrmittel, laengsteUebernahme, strings, LECK_WARN, LECK_ERR } from './lib/leck.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const EINHEITEN = join(ROOT, 'src/data/einheiten')
const METHODEN = join(ROOT, 'src/data/methoden')
const LEHRGAENGE = ['EBA_2J', 'EFZ_3J', 'EFZ_4J']
const STATUS_OK = [undefined, 'entwurf', 'publiziert', 'archiviert']
const PFLICHT = ['set.json', 'prinzip.json', 'kn.json', 'begleiter.md', 'herausforderung_A.json', 'herausforderung_B.json']
const PLATZHALTER = /\[QUELLE SUCHEN|\[URL\b|\[JJJJ|\[HERAUSGEBER|verifizieren\]|\[Beispiel aus|\bTODO\b|\bTBD\b|\{\{[^}]*\}\}|\{[A-Z][A-Z0-9_.]{3,}\}/

const argv = process.argv.slice(2)
const flag = (f) => argv.includes(f)
const CLOUD = flag('--cloud')
const wunsch = argv.filter((a) => !a.startsWith('--'))

const alleSlugs = readdirSync(EINHEITEN, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

function aufMain() {
  const r = spawnSync('git', ['ls-tree', '-d', '--name-only', 'origin/main', 'src/data/einheiten/'], { cwd: ROOT, encoding: 'utf8' })
  if (r.status !== 0) {
    console.error('check-all: origin/main nicht lesbar (git fetch origin main?) — --neu braucht den Vergleich.')
    process.exit(2)
  }
  return new Set(r.stdout.split('\n').map((l) => l.trim().split('/').pop()).filter(Boolean))
}

let slugs
let mussEntwurf = CLOUD
if (wunsch.length) {
  slugs = alleSlugs.filter((s) => wunsch.includes(s))
  const fehlt = wunsch.filter((w) => !alleSlugs.includes(w))
  if (fehlt.length) {
    console.error(`check-all: kein Ordner src/data/einheiten/${fehlt.join(', ')}`)
    process.exit(2)
  }
} else if (flag('--neu')) {
  const main = aufMain()
  slugs = alleSlugs.filter((s) => !main.has(s))
  mussEntwurf = true
} else if (flag('--entwurf')) {
  slugs = alleSlugs.filter((s) => {
    try { return readJson(join(EINHEITEN, s, 'set.json')).status === 'entwurf' } catch { return true }
  })
} else if (flag('--alle')) {
  slugs = alleSlugs
} else {
  console.error('usage: node scripts/check-all.mjs <slug>… | --neu | --entwurf | --alle   [--cloud]')
  process.exit(2)
}

// ------------------------------------------------------------ Eigene Checks

const lehrmittel = ladeLehrmittel()
const karten = existsSync(METHODEN)
  ? Object.fromEntries(readdirSync(METHODEN).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => {
      try { const k = readJson(join(METHODEN, f)); return [k.id, k] } catch { return [f, null] }
    }))
  : {}

function pruefeEinheit(slug) {
  const dir = join(EINHEITEN, slug)
  const out = []
  const err = (code, wo, was) => out.push({ art: 'FEHLER ', code, wo, was })
  const warn = (code, wo, was) => out.push({ art: 'warnung', code, wo, was })

  for (const f of PFLICHT) if (!existsSync(join(dir, f))) err('ERR_DATEI_FEHLT', f, 'Pflichtdatei fehlt')

  const json = {}
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json')) continue
    try { json[f] = readJson(join(dir, f)) } catch (e) { err('ERR_JSON_INVALID', f, e.message) }
  }

  const status = json['set.json']?.status
  if (!STATUS_OK.includes(status)) err('ERR_STATUS_UNBEKANNT', 'set.json › status', `«${status}» — erlaubt: entwurf, publiziert, archiviert oder kein Feld; der Index-Builder bricht sonst ab`)
  else if (mussEntwurf && status !== 'entwurf') err('ERR_STATUS_NICHT_ENTWURF', 'set.json › status', `«${status ?? 'fehlt'}» — eine neu erzeugte Einheit muss "entwurf" tragen, sonst ist sie nach dem Index-Bau fuer alle sichtbar`)

  const hfs = ['A', 'B', 'C'].map((l) => [l, json[`herausforderung_${l}.json`]]).filter(([, h]) => h)
  const lehrgaenge = new Set(hfs.map(([, h]) => h.lehrgang))
  for (const lg of lehrgaenge) if (!LEHRGAENGE.includes(lg)) err('ERR_LEHRGANG', 'herausforderung_* › lehrgang', `«${lg}» — erlaubt: ${LEHRGAENGE.join(', ')}`)
  if (lehrgaenge.size > 1) err('ERR_LEHRGANG_UNEINIG', 'herausforderung_* › lehrgang', [...lehrgaenge].join(' / '))

  for (const [l, h] of hfs) {
    const f = `herausforderung_${l}.json`
    if (typeof h.id !== 'string' || !h.id.startsWith(slug + '_')) err('ERR_ID', `${f} › id`, `«${h.id}» beginnt nicht mit dem Ordnernamen`)
    if (h.buchstabe && h.buchstabe !== l) err('ERR_BUCHSTABE', `${f} › buchstabe`, `«${h.buchstabe}» in Datei ${l}`)
    if (!h.template) err('ERR_TEMPLATE', `${f} › template`, 'fehlt')

    // v4.x-Hefte fuehren einen Spur-Anker in `methoden`; das prueft check-v42.
    if (Array.isArray(h.methoden) && !/^heft_8page_v4/.test(h.template ?? '')) {
      const refs = h.methoden
      if (refs.length !== 4) err('ERR_METHODEN_ANZAHL', `${f} › methoden`, `${refs.length} Eintraege, Soll 4`)
      let mitBeispiel = 0
      for (const [i, r] of refs.entries()) {
        const k = karten[r?.ref]
        if (!k) { err('ERR_METHODE_UNBEKANNT', `${f} › methoden[${i}].ref`, `«${r?.ref}» — keine Karte in src/data/methoden/ (wird zur Laufzeit still uebersprungen)`); continue }
        if ((r.beispiel?.length || k.beispiel?.length) && k.fehler) mitBeispiel++
      }
      if (refs.length === 4 && mitBeispiel !== 2) warn('WARN_METHODEN_BEISPIELE', `${f} › methoden`, `${mitBeispiel} Karten mit Beispiel/Fehler, Soll genau 2 — sonst schneidet .a4-page still ab`)
    }
  }

  const texte = []
  for (const [f, j] of Object.entries(json)) for (const [p, s] of strings(j)) texte.push([`${f} › ${p}`, s])
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    readFileSync(join(dir, f), 'utf8').split(/\n\s*\n/).forEach((abs, i) => texte.push([`${f} › Absatz ${i + 1}`, abs]))
  }

  for (const [wo, s] of texte) {
    if (s.includes('ß')) err('ERR_ESZETT', wo, s.slice(Math.max(0, s.indexOf('ß') - 20), s.indexOf('ß') + 10))
    const m = PLATZHALTER.exec(s)
    if (m) err('ERR_PLATZHALTER', wo, m[0])
    if (lehrmittel && s.length > 80) {
      const u = laengsteUebernahme(s, lehrmittel)
      if (u && u.woerter >= LECK_ERR) err('ERR_LEHRMITTEL_WOERTLICH', wo, `${u.woerter} Woerter am Stueck aus Lehrmittel oder Quellenarchiv: «${u.auszug}»`)
      else if (u && u.woerter >= LECK_WARN) warn('WARN_LEHRMITTEL_NAH', wo, `${u.woerter} Woerter am Stueck: «${u.auszug}»`)
    }
  }
  return { out, template: hfs[0]?.[1]?.template ?? '' }
}

// ---------------------------------------------------------------- Lauf

function lauf(script, args) {
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts', script), ...args], { cwd: ROOT, encoding: 'utf8' })
  return { ok: r.status === 0, text: ((r.stdout ?? '') + (r.stderr ?? '')).trim() }
}
const einruecken = (t) => t.split('\n').map((l) => '      ' + l).join('\n')

console.log(`check-all — ${slugs.length} Einheit(en)${mussEntwurf ? ' · status muss "entwurf" sein' : ''}${CLOUD ? ' · --cloud' : ''}\n`)

let rot = 0
const zeile = (ok, name, detail = '') => console.log(`  ${ok ? 'ok    ' : 'FEHLER'}  ${name}${detail ? '  ' + detail : ''}`)

if (!lehrmittel) {
  if (CLOUD) { rot++; zeile(false, 'Lehrmittel', 'material/_lehrmittel/ fehlt — ohne Quelltext darf kein Lauf starten (scripts/cloud-preflight.mjs)') }
  else console.log('  HINWEIS Lehrmittel fehlt lokal — die Leck-Pruefung (LECK) ist NICHT gelaufen.')
} else zeile(true, 'Lehrmittel', `${lehrmittel.dateien} Kapitel und ${lehrmittel.quellen} Quellentexte fuer die Leck-Pruefung geladen`)

const nrlp = lauf('check-nrlp-consistency.mjs', [])
zeile(nrlp.ok, 'nRLP-Datensaetze')
if (!nrlp.ok) { rot++; console.log(einruecken(nrlp.text)) }

// Namen eindeutig (Ordner, IDs, Quellenkarten, Archiv, Laufordner): scripts/check-namen.mjs, nur die geprueften Einheiten.
if (slugs.length) {
  const namen = lauf('check-namen.mjs', [...slugs, ...(CLOUD ? ['--cloud'] : [])])
  zeile(namen.ok, 'Namen', 'Ordner · IDs · Quellenkarten · Archiv · Laufordner')
  if (!namen.ok || /warnung|HINWEIS/.test(namen.text)) { if (!namen.ok) rot++; console.log(einruecken(namen.text)) }
}

// Karten: scripts/karten.mjs geaendert — jede Methoden- und Quellenkarte, die sich gegenueber origin/main
// unterscheidet. Rot, wenn eine publizierte oder archivierte Einheit sie fuehrt und kein Vermerk vorliegt
// (docs/methodenkartei.md §9). Gilt fuer den ganzen Baum: Eine Karte aendert auch Hefte ausserhalb des Umfangs.
{
  const k = lauf('karten.mjs', ['geaendert'])
  zeile(k.ok, 'Karten', 'geaenderte Methoden- und Quellenkarten gegen origin/main · Verbraucher · Vermerk')
  if (!k.ok || /warnung|HINWEIS|  (geändert|gelöscht)  /.test(k.text)) { if (!k.ok) rot++; console.log(einruecken(k.text)) }
}

if (!slugs.length) console.log('\n  Keine Einheit im Umfang.')

const sync = slugs.length ? lauf('sync-einheiten-nrlp.mjs', ['--check']) : { text: '' }

for (const slug of slugs) {
  console.log(`\n${slug}`)
  const { out, template } = pruefeEinheit(slug)
  const fehler = out.filter((x) => x.art.startsWith('FEHLER'))
  zeile(!fehler.length, 'Struktur · Status · Methoden · Sprache · Leck', `${fehler.length} Fehler, ${out.length - fehler.length} Warnungen`)
  for (const x of out) console.log(`      ${x.art}  ${x.code}  ${x.wo}\n               ${x.was}`)
  if (fehler.length) rot++

  // sync --check ist als Ganzes dauerrot (EBA-Datensatz); hier zaehlen nur die Zeilen dieser Einheit.
  const drift = sync.text.split('\n').filter((l) => l.includes(slug + '/') || (/LEHRGANG/.test(l) && l.includes(slug)))
  zeile(!drift.length, 'nRLP-Abgleich (Kompetenz-/Lebensbezugstexte, Lehrgaenge)')
  if (drift.length) { rot++; console.log(einruecken(drift.join('\n'))) }

  const sub = [
    ['Kopplung · Autarkie · Begleiter-Marker', 'check-einheiten.mjs', [slug]],
    ['Leitfragen-Loesungen', 'check-lf-loesung.mjs', [slug]],
  ]
  if (/^heft_8page_v4/.test(template)) sub.push(['Heft v4.x (Budgets, Spuren, Quellen)', 'check-v42.mjs', [slug]])
  for (const [name, script, args] of sub) {
    const r = lauf(script, args)
    zeile(r.ok, name)
    if (!r.ok) { rot++; console.log(einruecken(r.text)) }
  }
}

console.log(`\n${rot ? `ROT — ${rot} Pruefung(en) mit Fehlern.` : 'GRUEN — keine Fehler.'}`)
process.exit(rot ? 1 : 0)
