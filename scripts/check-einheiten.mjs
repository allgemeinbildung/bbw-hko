#!/usr/bin/env node
/**
 * check-einheiten.mjs — prueft die Herausforderungs-JSONs gegen die maschinell
 * pruefbaren Regeln der Skill `.claude/skills/bbw-hko-3er-set/`.
 *
 * Deckt ab:
 *   Check 33 — LF<->Produkt-Kopplung 4+1 (index-treu, Kontrollschritt)
 *   Check 34 — Voraussetzungsfreier Start (Autarkie)
 *
 * Urteilsgebundene Checks (Bloom-Treue, Quellendeckung, Register) bleiben bei
 * der Skill — die kann kein Skript ersetzen.
 *
 *   node scripts/check-einheiten.mjs                 # alle Einheiten
 *   node scripts/check-einheiten.mjs 3.2.1 5.4.2     # nur passende Slugs
 *   node scripts/check-einheiten.mjs --baseline      # Baseline neu schreiben
 *   node scripts/check-einheiten.mjs --strict        # Baseline ignorieren
 *
 * Exit 1, sobald ein Befund NICHT in der Baseline steht.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(ROOT, 'src/data/einheiten')
const BASELINE = join(ROOT, 'scripts/check-einheiten.baseline.json')

// ---------------------------------------------------------------- Regelwerk

/** Verbotsmuster: Material, das vor der ersten Lektion existieren muesste. */
const VORLAUF = [
  /\bvor der ersten Lektion\b/i,
  /\bbringen Sie\b[^.]{0,40}\bmit\b/i,
  /\berfragen Sie\s+(vorab|vorher|im Voraus)/i,
  /\bim Voraus\b/i,
  /\bschon (vorher|vorab)\b/i,
]

/** Querverweis auf eine andere Herausforderung. */
const QUERVERWEIS = /\b(aus|in|wie in)\s+(den\s+)?Herausforderung(en)?\s+[ABC]\b|\baus\s+[ABC]\s+und\s+[ABC]\b/i

/** Angebotsform — konditional, damit erlaubt. */
const ANGEBOT = /\b(falls|wenn|haben)\s+Sie\b[^.]{0,80}\bbearbeitet\b/i

/** Felder, in denen ein Querverweis "tragend" ist (Check 34). */
const TRAGEND = [
  'handlungsprodukt.beschreibung',
  'handlungsprodukt.format_detail',
  'leitfragen_intro',
  'situation_text',
  'prinzip_handoff.lehrmittel_anker',
]

/** Verifikationssprache fuer den Kontrollschritt. */
const VERIFIKATION = /pr[uü]f|kontroll|gegenles|abgleich|vergleich|[uü]berarbeit|korrig|abh[oö]r|check/i

/** Grobe Imperativ-Erkennung: "Verb Sie" am Satzanfang oder nach Satzzeichen. */
function zaehleAuftraege(text) {
  const m = text.match(/(^|[.;:!?]\s+|\bund\s+)([A-ZÄÖÜ][a-zäöüß]{2,})\s+Sie\b/g)
  return m ? m.length : 0
}

function walk(obj, path, fn) {
  if (obj === null || obj === undefined) return
  if (typeof obj === 'string') return fn(obj, path)
  if (Array.isArray(obj)) return obj.forEach((v, i) => walk(v, `${path}[${i}]`, fn))
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) walk(v, path ? `${path}.${k}` : k, fn)
  }
}

// ------------------------------------------------------------------ Checks

function pruefe(sit, slug) {
  const f = []
  const id = `${slug} ${sit.buchstabe ?? '?'}`
  const add = (code, feld, detail) => f.push({ id, slug, hf: sit.buchstabe, code, feld, detail })

  const lfs = sit.leitfragen ?? []
  const schritte = sit.handlungsprodukt?.schritte ?? []

  // --- Check 33: Kopplung 4+1 -------------------------------------------
  if (lfs.length !== 4 || schritte.length !== 5) {
    add('ERR_KOPPLUNG_NICHT_1ZU1', 'handlungsprodukt.schritte',
      `${lfs.length} Leitfragen / ${schritte.length} Schritte (erwartet 4 / 5)`)
  }

  lfs.forEach((lf, i) => {
    if (!lf.liefert) {
      add('ERR_LF_LIEFERT_MISSING', `leitfragen[${i}]`, `LF${lf.nr ?? i + 1} ohne liefert`)
    } else {
      const w = lf.liefert.trim().split(/\s+/).length
      if (w < 3 || w > 7) add('WARN_LIEFERT_LAENGE', `leitfragen[${i}].liefert`, `${w} Woerter: "${lf.liefert}"`)
      if (/\bSie\b|\bIhre?\b/.test(lf.liefert)) {
        add('WARN_LIEFERT_VERBFORM', `leitfragen[${i}].liefert`, `Anrede in liefert: "${lf.liefert}"`)
      }
    }
    // Rueckweg: schritte[i].hint nennt LF(i+1) woertlich
    const s = schritte[i]
    if (s && !new RegExp(`\\bLF\\s?${i + 1}\\b|\\bLeitfrage\\s${i + 1}\\b`, 'i').test(s.hint ?? '')) {
      add('WARN_HINT_OHNE_ABSENDER', `handlungsprodukt.schritte[${i}].hint`,
        `Schritt ${i + 1} "${s.label}" nennt LF${i + 1} nicht woertlich`)
    }
  })

  // --- Kontrollschritt schritte[4] ---------------------------------------
  const ks = schritte[4]
  if (ks) {
    const txt = `${ks.label ?? ''} ${ks.hint ?? ''}`
    if (!VERIFIKATION.test(txt)) {
      add('WARN_KONTROLLSCHRITT_PRODUZIERT', 'handlungsprodukt.schritte[4]',
        `"${ks.label}" ist kein Kontrollschritt (keine Verifikationssprache)`)
    }
    const abgaben = (sit.handlungsprodukt?.abgaben ?? []).join(' ').toLowerCase()
    const lab = (ks.label ?? '').toLowerCase().split(/\s+/).filter((w) => w.length > 5)
    if (lab.some((w) => abgaben.includes(w))) {
      add('WARN_KONTROLLSCHRITT_PRODUZIERT', 'handlungsprodukt.abgaben',
        `Kontrollschritt "${ks.label}" taucht in abgaben[] auf`)
    }
    if (!/vollst[aä]ndig|kriteri|raster|haken/i.test(ks.hint ?? '')) {
      add('WARN_KONTROLLSCHRITT_OHNE_KRITERIEN', 'handlungsprodukt.schritte[4].hint',
        'verweist nicht auf die vollstaendig_wenn-Kriterien')
    }
  }

  // --- Check 34: Autarkie -------------------------------------------------
  walk(sit, '', (text, path) => {
    for (const re of VORLAUF) {
      if (re.test(text)) {
        add('ERR_VORAUSSETZUNG_VOR_START', path, text.slice(0, 90))
        break
      }
    }
    if (QUERVERWEIS.test(text) && !ANGEBOT.test(text)) {
      const tragend = TRAGEND.some((t) => path.startsWith(t)) ||
        /^leitfragen\[\d+\]\.text$/.test(path) ||
        /^handlungsprodukt\.schritte\[\d+\]\.hint$/.test(path) ||
        /^quellen_anker/.test(path) || /^bewertungsraster/.test(path)
      add(tragend ? 'ERR_QUERVERWEIS_ALS_BEDINGUNG' : 'WARN_QUERVERWEIS', path, text.slice(0, 90))
    }
  })

  // Ein LF-Text traegt einen Auftrag
  lfs.forEach((lf, i) => {
    const n = zaehleAuftraege(lf.text ?? '')
    if (n >= 3) {
      add('WARN_LF_MEHRFACHAUFTRAG', `leitfragen[${i}].text`,
        `LF${lf.nr ?? i + 1}: ${n} Arbeitsauftraege in einer Frage`)
    }
  })

  // bereitet_vor
  const bv = sit.bereitet_vor
  if (bv) {
    if (bv.verbindlich !== false) {
      add('ERR_BEREITET_VOR_VERBINDLICH', 'bereitet_vor', 'verbindlich muss false sein')
    }
    if (sit.buchstabe !== 'A') {
      add('WARN_BEREITET_VOR_NICHT_A', 'bereitet_vor', `steht in ${sit.buchstabe}, vorgesehen ist A`)
    }
  }

  // --- Check 14: Persona neutral (Stufe 1 oder 2) ------------------------
  const pers = sit.persona ?? {}
  const NEUTRAL_BERUF = /^Lernende\/r\s+(EFZ|EBA)(,\s*\d\.\s*Lehrjahr)?$/
  if (pers.beruf && !NEUTRAL_BERUF.test(pers.beruf.trim())) {
    add('ERR_PERSONA_SPEZIFISCH', 'persona.beruf', `"${pers.beruf}" — erwartet "Lernende/r EFZ, N. Lehrjahr"`)
  }
  if (pers.betrieb && !/^(eigener Lehrbetrieb|Berufsfachschule)$/.test(pers.betrieb.trim())) {
    add('ERR_PERSONA_SPEZIFISCH', 'persona.betrieb', `"${pers.betrieb}" — erwartet "eigener Lehrbetrieb"`)
  }
  if (pers.ort && !/^(eigener Wohnort|Schweiz)$/.test(pers.ort.trim())) {
    add('ERR_PERSONA_SPEZIFISCH', 'persona.ort', `"${pers.ort}" — erwartet "eigener Wohnort"`)
  }

  // auftakt_typ: vorbereitung entfernt den Absatz ueber LF1
  if (sit.auftakt_typ === 'vorbereitung') {
    add('WARN_AUFTAKT_VORBEREITUNG', 'auftakt_typ',
      'entfernt den Auftakt-Absatz ueber LF1 — nur zulaessig, wenn Seite 1 wirklich etwas einrichtet')
  }

  return f
}

// -------------------------------------------------------------------- Lauf

const args = process.argv.slice(2)
const schreibeBaseline = args.includes('--baseline')
const strict = args.includes('--strict')
const filter = args.filter((a) => !a.startsWith('--'))

const slugs = readdirSync(DATA, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((s) => !filter.length || filter.some((f) => s.includes(f)))
  .sort()

// --------------------------------------------------- Begleiter-Feldmarker
//
// Spiegelbild von `src/lib/einheiten/begleiter-felder.ts`: dort werden die Marker
// beim Laden aufgeloest, hier wird geprueft, ob der eingecheckte Rueckfalltext noch
// stimmt. Die Aufloesung ist bewusst zweimal implementiert (TS fuer die Laufzeit,
// JS hier) — der Checker soll ohne Build laufen. Beide Seiten sind klein; weicht
// eine ab, faellt es hier als Falschmeldung sofort auf.

const MARKER = /<!--\s*hko:([^|\s>]+?)(?:\s*\|\s*([a-z]+))?\s*-->([\s\S]*?)<!--\s*\/hko\s*-->/g

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

/** LF/CRLF im Korpus gemischt — der Vergleich darf daran nicht scheitern. */
const norm = (s) => s.replace(/\r\n/g, '\n').trim()

/**
 * Feldarten, die im Begleiter als Kopie auftauchen und darum in einen Marker
 * gehoeren. Bewusst eine Positivliste: Begleiter-eigene Prosa — Coaching,
 * Erwartungshorizonte, Fahrplan — hat keine Quelle im JSON und soll hier nie
 * gemeldet werden.
 */
const KOPIERBAR = [
  /^hf_[ABC]\.(titel|situation_text|leitfrage|mindmap_zentrum)$/,
  /^hf_[ABC]\.herausforderung\.label$/,
  /^hf_[ABC]\.mehrdeutigkeit\.trade_off$/,
  /^hf_[ABC]\.mindmap_aeste\[\d+\]\.punkte\[\d+\]$/,
  /^hf_[ABC]\.bewertungsraster\[\d+\]\.vollstaendig_wenn\[\d+\]$/,
  /^hf_[ABC]\.leitfragen\[\d+\]\.text$/,
  /^kn\.(kern_kompetenzversprechen|mehrdeutigkeits_pflicht)$/,
  /^kn\.hybrid_situation\.(titel|text|leitfrage)$/,
  /^kn\.kn_typen\[\d+\]\.(fragestruktur\[\d+\]\.frage|aufgaben\[\d+\]\.aufgabe|reflexionsfragen\[\d+\])$/,
  /^set\.dekontextualisierungs_aufgabe\.(ziel|auftrag)$/,
]

function* stringFelder(o, p = '') {
  if (o && typeof o === 'object' && !Array.isArray(o)) {
    for (const [k, v] of Object.entries(o)) yield* stringFelder(v, p ? `${p}.${k}` : k)
  } else if (Array.isArray(o)) {
    for (let i = 0; i < o.length; i++) yield* stringFelder(o[i], `${p}[${i}]`)
  } else if (typeof o === 'string') {
    yield [p, o]
  }
}

/**
 * Meldet Text, der woertlich aus einem JSON stammt und AUSSERHALB jedes Markers
 * im Begleiter steht — die Kopien, die morgen auseinanderlaufen. Ein Befund pro
 * Einheit statt pro Fundstelle: die Antwort ist immer dieselbe (Begleiter
 * migrieren), eine Liste von 60 Zeilen waere nur Laerm.
 */
function pruefeBegleiterKopien(slug, quellen, ganz) {
  // Das YAML-Frontmatter bleibt aussen vor: ein HTML-Kommentar darin wuerde
  // `parseFrontmatter` brechen. Die Kopie dort (meist `kompetenz:`) ist gewollt.
  const fm = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(ganz)
  const versatz = fm ? fm[0].length : 0
  const raw = ganz.slice(versatz)

  const spans = []
  for (const m of raw.matchAll(MARKER)) spans.push([m.index, m.index + m[0].length])
  const drin = (i) => spans.some(([a, b]) => i >= a && i < b)

  const pfade = new Set()
  for (const [wurzel, obj] of Object.entries(quellen)) {
    for (const [pfad, wert] of stringFelder(obj, wurzel)) {
      if (wert.length < 45 || !KOPIERBAR.some((r) => r.test(pfad))) continue
      const i = raw.indexOf(wert)
      if (i >= 0 && !drin(i)) pfade.add(pfad)
    }
  }
  if (!pfade.size) return []
  const liste = [...pfade].sort()
  return [{
    id: `${slug} begleiter.md`, slug,
    code: 'WARN_BEGLEITER_KOPIE_OHNE_MARKER',
    feld: `${liste.length} Feld${liste.length === 1 ? '' : 'er'} wörtlich kopiert`,
    detail: `${liste.slice(0, 4).join(', ')}${liste.length > 4 ? ` … (+${liste.length - 4})` : ''}`,
  }]
}

function pruefeBegleiter(slug) {
  const p = join(DATA, slug, 'begleiter.md')
  if (!existsSync(p)) return []
  const raw = readFileSync(p, 'utf8')
  const q = {}
  for (const [k, f] of [['hf_A', 'herausforderung_A'], ['hf_B', 'herausforderung_B'],
                        ['hf_C', 'herausforderung_C'], ['kn', 'kn'], ['set', 'set'], ['prinzip', 'prinzip']]) {
    const fp = join(DATA, slug, `${f}.json`)
    if (existsSync(fp)) q[k] = JSON.parse(readFileSync(fp, 'utf8'))
  }
  const f = pruefeBegleiterKopien(slug, q, raw)
  for (const m of raw.matchAll(MARKER)) {
    const [, pfad, fmt, rueckfall] = m
    const soll = formatiere(pfadWert(q, pfad), fmt)
    const id = `${slug} begleiter.md`
    if (soll == null) {
      f.push({ id, slug, code: 'ERR_BEGLEITER_MARKER_UNAUFLOESBAR', feld: `<!--hko:${pfad}-->`,
               detail: 'Pfad zeigt ins Leere — Feld umbenannt oder entfernt?' })
    } else if (norm(soll) !== norm(rueckfall)) {
      f.push({ id, slug, code: 'WARN_BEGLEITER_DRIFT', feld: `<!--hko:${pfad}-->`,
               detail: `Rueckfalltext veraltet. Quelle: "${soll.trim().slice(0, 70)}…"` })
    }
  }
  return f
}

/**
 * Eingefroren: alles, was nicht ausdruecklich `status: "entwurf"` traegt, ist
 * live (CLAUDE.md: fehlendes Feld = live fuer alle) — und EBA ist vorerst
 * ausgenommen (Entscheid Pietro, 2026-09-04). Befunde werden weiterhin
 * angezeigt, aber als nicht anzufassen markiert und nie als offen gezaehlt.
 */
function frozenReason(slug) {
  const sp = join(DATA, slug, 'set.json')
  const status = existsSync(sp) ? (JSON.parse(readFileSync(sp, 'utf8')).status ?? null) : null
  if (status !== 'entwurf') return status ? `live (${status})` : 'live (kein status-Feld)'
  const hp = join(DATA, slug, 'herausforderung_A.json')
  const lg = existsSync(hp) ? (JSON.parse(readFileSync(hp, 'utf8')).lehrgang ?? '') : ''
  if (lg.startsWith('EBA')) return 'EBA — vorerst ausgenommen'
  return null
}

let alle = []
const frozen = {}
for (const slug of slugs) {
  frozen[slug] = frozenReason(slug)
  for (const L of ['A', 'B', 'C']) {
    const p = join(DATA, slug, `herausforderung_${L}.json`)
    if (!existsSync(p)) continue
    alle = alle.concat(pruefe(JSON.parse(readFileSync(p, 'utf8')), slug))
  }
  alle = alle.concat(pruefeBegleiter(slug))
}

const key = (x) => `${x.id}|${x.code}|${x.feld}`

if (schreibeBaseline) {
  writeFileSync(BASELINE, JSON.stringify({
    erzeugt: new Date().toISOString().slice(0, 10),
    hinweis: 'Bestandsbefunde, eingefroren. Neue Befunde muessen gruen sein; diese Liste darf nur schrumpfen.',
    befunde: alle.map(key).sort(),
  }, null, 2) + '\n')
  console.log(`Baseline geschrieben: ${alle.length} Befunde in ${slugs.length} Einheiten.`)
  process.exit(0)
}

const baseline = !strict && existsSync(BASELINE)
  ? new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).befunde)
  : new Set()

const neu = alle.filter((x) => !baseline.has(key(x)))

const gruppen = {}
for (const x of neu) (gruppen[x.id] ??= []).push(x)

for (const [id, list] of Object.entries(gruppen)) {
  const why = frozen[list[0].slug]
  console.log(`\n${id}${why ? `   [EINGEFROREN: ${why} — NICHT anfassen]` : ''}`)
  for (const x of list) {
    const mark = x.code.startsWith('ERR') ? 'FEHLER ' : 'warnung'
    console.log(`  ${mark}  ${x.code}`)
    console.log(`            ${x.feld}`)
    console.log(`            ${x.detail}`)
  }
}

const offen = neu.filter((x) => !frozen[x.slug])
const eingefroren = neu.length - offen.length
const errs = offen.filter((x) => x.code.startsWith('ERR')).length
console.log(`\n${slugs.length} Einheiten geprueft — ${offen.length} offene Befunde (${errs} Fehler)` +
  (eingefroren ? `, ${eingefroren} in eingefrorenen Einheiten (live oder EBA — nicht anfassen)` : '') +
  (baseline.size ? `, ${baseline.size} in der Baseline.` : '.'))
process.exit(offen.length ? 1 : 0)
