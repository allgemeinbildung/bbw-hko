#!/usr/bin/env node
/**
 * check-namen.mjs — Namen eindeutig: Ordner, IDs, Kurzlink, Quellenkarten,
 * Archivordner, Methodenkarten, Laufordner, Baupläne.
 *
 *   node scripts/check-namen.mjs                  # der ganze Bestand
 *   node scripts/check-namen.mjs <slug> [<slug> …] # nur diese Einheiten (so ruft check-all auf)
 *   node scripts/check-namen.mjs --vor <ordner> [--datum JJJJ-MM-TT] [--karte <id> …]
 *                                                 # VOR dem ersten Schreiben: sind Ordner, Laufordner,
 *                                                 # Quellen-Muster und neue Karten-IDs frei?
 *   … --cloud                                     # fehlendes Archiv ist ein Fehler (wie check-all --cloud)
 *   … --wurzel <ordner>                           # anderer Baum statt dieses Repos (Gegenproben, Tests)
 *
 * Die Regeln stehen in .claude/skills/bbw-hko-heft-v42/references/ableitungsregeln.md
 * (E21). Eine Einheit hat mehrere Nummern-Geschwister (heute 1.1.1 fuenfmal);
 * alles, was nur aus der Nummer abgeleitet ist, kann kollidieren. Dieses Skript
 * prueft, dass jeder abgeleitete Name genau einmal vorkommt.
 *
 * Schwere: Ein Verstoss an einer Einheit mit status "publiziert" (oder ohne
 * Feld — der Index-Builder behandelt das als live) ist eine WARNUNG: Der Name
 * ist gedruckt oder im Netz, er wird gemeldet und nie umbenannt (E21). Bei
 * einem Entwurf ist es ein FEHLER. Globale Befunde (doppelte ID, Kurzlink-
 * Kollision, unlesbare Datei, Laufordner ohne Einheit) sind immer Fehler.
 *
 * Archiv: Die archiv_ref-Pruefung gegen die Ordner des Quellenarchivs laeuft nur,
 * wenn das Archiv lokal da ist (QUELLEN_ARCHIV, sonst wie scripts/lib/leck.mjs).
 * Fehlt es, ist das ein HINWEIS und die Schlusszeile sagt es — nie «GRUEN».
 * Dass archiv_ref «<id>/gewaehlt» heisst, wird auch ohne Archiv geprueft.
 *
 * Exit 0  keine Fehler (Warnungen und Hinweise moeglich)
 * Exit 1  mindestens ein Fehler
 * Exit 2  Aufruf falsch oder Daten nicht lesbar
 *
 * Reines Node, keine Abhaengigkeiten, nur lesend.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// ----------------------------------------------------------------- Aufruf

const argv = process.argv.slice(2)
let wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
let vor = null
let datum = null
const karten = []
const slugsWunsch = []
let CLOUD = false
const bad = (m) => { console.error(`check-namen: ${m}`); process.exit(2) }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--wurzel') { wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner')) }
  else if (a === '--vor') { vor = argv[++i] ?? bad('--vor braucht einen Ordnernamen') }
  else if (a === '--datum') { datum = argv[++i] ?? bad('--datum braucht JJJJ-MM-TT') }
  else if (a === '--karte') { karten.push(argv[++i] ?? bad('--karte braucht eine ID')) }
  else if (a === '--cloud') CLOUD = true
  else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}\nusage: node scripts/check-namen.mjs [<slug>…] | --vor <ordner> [--datum JJJJ-MM-TT] [--karte <id>…]  [--cloud] [--wurzel <ordner>]`)
  else slugsWunsch.push(a)
}
if ((datum || karten.length) && !vor) bad('--datum und --karte gehoeren zu --vor')
if (datum && !/^\d{4}-\d{2}-\d{2}$/.test(datum)) bad('--datum: Form JJJJ-MM-TT')
if (vor && slugsWunsch.length) bad('--vor und Einheiten-Ordner schliessen sich aus')

const EINH = join(wurzel, 'src/data/einheiten')
const QUELL = join(wurzel, 'src/data/quellen')
const METH = join(wurzel, 'src/data/methoden')
const LAUF = join(wurzel, 'docs/cloud-run/laeufe')
const BAUPL = join(wurzel, 'docs/cloud-run/bauplaene')
const PUBLIC = join(wurzel, 'public')
const MPAGES = join(wurzel, 'src/pages/m')
if (!existsSync(EINH)) bad(`kein Ordner ${EINH}`)

// Archiv: QUELLEN_ARCHIV gewinnt (auch wenn es leer ist), sonst wie scripts/lib/leck.mjs.
const archivKandidaten = process.env.QUELLEN_ARCHIV ? [process.env.QUELLEN_ARCHIV] : [join(wurzel, 'material', '_quellen-archiv'), 'D:/OS/_lab/quellen-archiv/bbw-hko']
const archivDir = archivKandidaten.find((p) => existsSync(p) && statSync(p).isDirectory())
// «Da» heisst: es gibt mindestens einen Ordner q-*. Ein leerer Ordner ist kein Archiv.
const ARCHIV = archivDir && readdirSync(archivDir).some((n) => n.startsWith('q-')) ? archivDir : null

// ------------------------------------------------------- Regeln und Listen

/** Nur die Gold-Einheit traegt `_v42` im Namen, weil ihr Name vergeben war (E21). */
const GOLD = new Set(['1.3.1_konsum_verantworten_v42'])

/**
 * Ausdruecklich geteilte Quellenkarten: Eine Einheit darf Karten einer anderen
 * Einheit fuehren, wenn Bauplan §9 es nennt (ableitungsregeln.md §4.1). Die Liste
 * steht hier und nicht als Feld `geteilt_mit` an der Karte: Der Datenvertrag
 * bleibt, wie er ist. Je Eintrag: Muster der Karten-IDs und die Einheiten, die
 * sie fuehren duerfen. Eine neue Ausnahme ist ein Entscheid und kommt mit
 * Bauplan-Zeile und Eintrag in ENTSCHEIDE hierher.
 */
const GETEILT = [
  // 3.1.1 ist die Anpassung der Gold-Einheit 1.3.1 an den 3J-Lehrgang (Bauplan §9, Lauf 2026-10-04-311).
  { karten: /^q-131[ab]-/, einheiten: ['1.3.1_konsum_verantworten_v42', '3.1.1_konsum_verantworten_3j'] },
]

const RE_ORDNER = /^(\d)\.(\d)\.(\d)_[a-z0-9]+(?:_[a-z0-9]+)*$/
const RE_QUELLE = /^q-(\d+)(?:\.(\d+))?([ab])-(pflicht-ersatz|pflicht|vertiefung-[12])$/
const RE_METHODE = /^(?:hko-[a-z0-9]+(?:-[a-z0-9]+)*|lm-\d+-\d+-[a-z0-9]+(?:-[a-z0-9]+)*)$/
const RE_LAUF_NEU = /^(\d{4})-(\d{2})-(\d{2})-(\d\.\d\.\d_[a-z0-9_]+?)(?:-(\d+))?$/
const RE_LAUF_ALT = /^\d{4}-\d{2}-\d{2}-\d{3}(?:-[a-z]+)?$/

const ziffern = (ordner) => ordner.slice(0, 5).replace(/\./g, '')
const ohneNummer = (ordner) => ordner.replace(/^\d\.\d\.\d_/, '').replace(/_(3j|4j)$/, '')
const datumOk = (j, m, t) => { const d = new Date(Date.UTC(+j, +m - 1, +t)); return d.getUTCFullYear() === +j && d.getUTCMonth() === +m - 1 && d.getUTCDate() === +t }

// ------------------------------------------------------------------- Lesen

const befunde = []
const hinweise = []
const lies = (p) => {
  try { return JSON.parse(readFileSync(p, 'utf8')) } catch (e) { return { __fehler: e.message } }
}
const rel = (p) => p.replace(wurzel, '').replace(/^[\\/]+/, '').replace(/\\/g, '/')
const melde = (art, code, wo, was) => befunde.push({ art, code, wo, was })
const FEHLER = 'FEHLER '
const WARN = 'warnung'

const dirs = (p) => (existsSync(p) ? readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort() : [])
const jsons = (p) => (existsSync(p) ? readdirSync(p).filter((f) => f.endsWith('.json')).sort() : [])

const einheiten = {}
for (const slug of dirs(EINH)) {
  const dir = join(EINH, slug)
  const u = { slug, dir, hf: {}, set: null, kn: null, prinzip: null }
  const nimm = (datei) => {
    if (!existsSync(join(dir, datei))) return null
    const j = lies(join(dir, datei))
    if (j.__fehler) { melde(FEHLER, 'ERR_JSON_UNLESBAR', rel(join(dir, datei)), j.__fehler); return null }
    return j
  }
  u.set = nimm('set.json')
  u.kn = nimm('kn.json')
  u.prinzip = nimm('prinzip.json')
  for (const l of ['A', 'B', 'C']) { const h = nimm(`herausforderung_${l}.json`); if (h) u.hf[l] = h }
  u.publ = u.set?.status !== 'entwurf'
  u.v42 = /^heft_8page_v4/.test(u.hf.A?.template ?? '')
  einheiten[slug] = u
}
const alleSlugs = Object.keys(einheiten)

const quellen = {}
for (const f of jsons(QUELL)) {
  const k = lies(join(QUELL, f))
  if (k.__fehler) { melde(FEHLER, 'ERR_JSON_UNLESBAR', rel(join(QUELL, f)), k.__fehler); continue }
  quellen[f.replace(/\.json$/, '')] = k
}
const methoden = {}
for (const f of jsons(METH)) {
  const k = lies(join(METH, f))
  if (k.__fehler) { melde(FEHLER, 'ERR_JSON_UNLESBAR', rel(join(METH, f)), k.__fehler); continue }
  methoden[f.replace(/\.json$/, '')] = k
}
const bauplaene = existsSync(BAUPL)
  ? readdirSync(BAUPL).filter((f) => f.endsWith('.md') && !f.startsWith('_')).sort()
  : []
const bauplanTexte = Object.fromEntries(bauplaene.map((f) => [f.replace(/\.md$/, ''), readFileSync(join(BAUPL, f), 'utf8')]))

const nrlp = {}
for (const lg of ['3j', '4j']) {
  const p = join(PUBLIC, `nrlp_${lg}.json`)
  if (!existsSync(p)) continue
  const j = lies(p)
  if (j.__fehler) continue
  const m = new Map()
  for (const t of j.themen ?? []) for (const lb of t.lebensbezuege ?? []) for (const k of lb.kompetenzen ?? []) if (k.nr) m.set(k.nr, k.text ?? '')
  nrlp[lg] = m
}

// ----------------------------------------------------------------- Umfang

const unbekannt = slugsWunsch.filter((s) => !einheiten[s])
if (unbekannt.length) bad(`kein Ordner src/data/einheiten/${unbekannt.join(', ')}`)
const ganz = slugsWunsch.length === 0
const umfang = new Set(ganz ? alleSlugs : slugsWunsch)

// Schwere eines Verstosses an Einheiten: publiziert → Warnung, Entwurf → Fehler.
// Eine Karte ohne Einheit (verwaist) ist nie mehr als eine Warnung.
const schwere = (slugs) => (!slugs.length || slugs.every((s) => einheiten[s]?.publ) ? WARN : FEHLER)

// ------------------------------------------------------------- Einheiten

for (const slug of alleSlugs) {
  const u = einheiten[slug]
  const imUmfang = umfang.has(slug)
  const sev = u.publ ? WARN : FEHLER
  const w = (code, wo, was) => imUmfang && melde(sev, code, wo, was)

  // Ordnername
  const m = RE_ORDNER.exec(slug)
  if (!m) w('NAME_ORDNER_FORM', slug, 'Ordnername ist nicht <X.Y.Z>_<slug> mit nur a–z, 0–9 und _')
  else {
    const nr = u.hf.A?.nrlp?.nr_primary?.[0]
    if (nr && slug.slice(0, 5) !== nr) w('NAME_ORDNER_NUMMER', slug, `Nummer ${slug.slice(0, 5)} ist nicht die erste Kompetenz von Heft A (${nr})`)
    if (/_v42$/.test(slug) && !GOLD.has(slug)) w('NAME_ORDNER_V42', slug, '«_v42» im Ordnernamen — das trug nur die Gold-Einheit (E21)')
  }

  // Lehrgang-Suffix (nur Format v4.2, EFZ): genau dann, wenn nur ein Lehrgang gilt und
  // dieselbe Nummer im anderen EFZ-Lehrgang mit anderem Text existiert.
  const lg = u.hf.A?.lehrgang
  if (u.v42 && m && (lg === 'EFZ_3J' || lg === 'EFZ_4J') && nrlp['3j'] && nrlp['4j']) {
    const eigen = nrlp[lg === 'EFZ_3J' ? '3j' : '4j'].get(slug.slice(0, 5))
    const anderer = nrlp[lg === 'EFZ_3J' ? '4j' : '3j'].get(slug.slice(0, 5))
    const einLehrgang = !(u.set?.lehrgaenge?.length > 1)
    const verlangt = einLehrgang && anderer !== undefined && anderer !== eigen
    const hat = new RegExp(`_${lg === 'EFZ_3J' ? '3j' : '4j'}$`).test(slug)
    const hatFalsch = /_(3j|4j)$/.test(slug) && !hat
    if (verlangt && !hat) w('NAME_SUFFIX_FEHLT', slug, `gilt nur für ${lg}, dieselbe Nummer steht im anderen Lehrgang mit anderem Text — Suffix fehlt`)
    else if (!verlangt && hat) w('NAME_SUFFIX_ZUVIEL', slug, 'Suffix, obwohl kein Fall der Regel (§1.3) vorliegt')
    else if (hatFalsch) w('NAME_SUFFIX_LEHRGANG', slug, `Suffix passt nicht zum kanonischen Lehrgang ${lg}`)
  }

  // IDs aus dem Ordnernamen
  const soll = { set: `${slug}_set`, kn: `${slug}_kn`, prinzip: `${slug}_prinzip` }
  for (const [k, id] of Object.entries(soll)) if (u[k] && u[k].id !== id) w('NAME_ID', `${slug}/${k === 'set' ? 'set' : k}.json › id`, `«${u[k].id}», Soll «${id}»`)
  for (const [l, h] of Object.entries(u.hf)) if (h.id !== `${slug}_hf_${l}`) w('NAME_ID', `${slug}/herausforderung_${l}.json › id`, `«${h.id}», Soll «${slug}_hf_${l}»`)

  // Verweise zwischen den Dateien
  const hfIds = Object.keys(u.hf).map((l) => `${slug}_hf_${l}`)
  const gleich = (wo, ist, sollwert) => { if (ist !== undefined && ist !== sollwert) w('NAME_VERWEIS', `${slug}/${wo}`, `«${ist}», Soll «${sollwert}»`) }
  for (const [l, h] of Object.entries(u.hf)) gleich(`herausforderung_${l}.json › prinzip_ref`, h.prinzip_ref, soll.prinzip)
  if (u.set) {
    gleich('set.json › prinzip_ref', u.set.prinzip_ref, soll.prinzip)
    gleich('set.json › kn_ref', u.set.kn_ref, soll.kn)
    const f = (u.set.herausforderungen ?? []).filter((x) => !hfIds.includes(x))
    if (f.length) w('NAME_VERWEIS', `${slug}/set.json › herausforderungen`, `${f.map((x) => `«${x}»`).join(', ')} — keine Heftdatei dieser Einheit`)
    const g = (u.set.konzept_progression ?? []).map((x) => x.herausforderung).filter((x) => x && !hfIds.includes(x))
    if (g.length) w('NAME_VERWEIS', `${slug}/set.json › konzept_progression`, `${g.map((x) => `«${x}»`).join(', ')} — keine Heftdatei dieser Einheit`)
  }
  if (u.kn) {
    gleich('kn.json › set_ref', u.kn.set_ref, soll.set)
    gleich('kn.json › prinzip_ref', u.kn.prinzip_ref, soll.prinzip)
    const f = (u.kn.anchored_situations ?? []).filter((x) => !hfIds.includes(x))
    if (f.length) w('NAME_VERWEIS', `${slug}/kn.json › anchored_situations`, `${f.map((x) => `«${x}»`).join(', ')} — keine Heftdatei dieser Einheit`)
  }
  if (u.v42) {
    const t = ohneNummer(slug).replace(GOLD.has(slug) ? /_v42$/ : /$^/, '')
    for (const [k, j] of [['kn', u.kn], ['prinzip', u.prinzip]]) if (j && j.topic_slug !== t) w('NAME_TOPIC_SLUG', `${slug}/${k}.json › topic_slug`, `«${j.topic_slug}», Soll «${t}»`)
  }
}

// Kurzlink /m/<ordner>: paarweise verschieden — auch ohne Gross-/Kleinschreibung und
// gegen die festen Seiten unter src/pages/m/.
{
  const fest = new Set(existsSync(MPAGES) ? readdirSync(MPAGES).filter((f) => !f.startsWith('[')).map((f) => f.replace(/\.[^.]+$/, '').toLowerCase()) : [])
  const gesehen = new Map()
  for (const slug of alleSlugs) {
    const k = slug.toLowerCase()
    if (fest.has(k)) melde(FEHLER, 'NAME_KURZLINK', `/m/${slug}`, 'gleicht einer festen Seite unter src/pages/m/ — diese hat Vorrang, die Einheit wäre unerreichbar')
    if (gesehen.has(k)) melde(FEHLER, 'NAME_KURZLINK', `/m/${slug}`, `kollidiert mit /m/${gesehen.get(k)} (Gross-/Kleinschreibung)`)
    else gesehen.set(k, slug)
  }
}

// IDs insgesamt einmalig: Hefte, Sets, KN, Prinzipien, Quellen- und Methodenkarten.
{
  const orte = new Map()
  const reg = (id, wo) => { if (typeof id !== 'string') return; (orte.get(id) ?? orte.set(id, []).get(id)).push(wo) }
  for (const u of Object.values(einheiten)) {
    for (const [l, h] of Object.entries(u.hf)) reg(h.id, `${u.slug}/herausforderung_${l}.json`)
    reg(u.set?.id, `${u.slug}/set.json`); reg(u.kn?.id, `${u.slug}/kn.json`); reg(u.prinzip?.id, `${u.slug}/prinzip.json`)
  }
  for (const [d, k] of Object.entries(quellen)) reg(k.id, `src/data/quellen/${d}.json`)
  for (const [d, k] of Object.entries(methoden)) reg(k.id, `src/data/methoden/${d}.json`)
  for (const [id, wo] of orte) if (wo.length > 1) melde(FEHLER, 'NAME_ID_DOPPELT', id, `steht in ${wo.join(' und ')}`)
}

// ------------------------------------------------------- Quellenkarten

const eigner = {}   // Karten-ID → Slugs, die sie fuehren (Heft-Verweis oder Ersatzkarte einer gefuehrten Karte)
const verweisNach = {} // Slug → [{id, heft}]
for (const u of Object.values(einheiten)) {
  for (const [l, h] of Object.entries(u.hf)) {
    const refs = Object.values(h.spuren ?? {}).flatMap((s) => (Array.isArray(s?.quellen) ? s.quellen : [])).map((q) => q?.ref).filter(Boolean)
    for (const id of refs) {
      ;(verweisNach[u.slug] ??= []).push({ id, heft: l })
      const kette = [id]
      if (quellen[id]?.ersatz_ref) kette.push(quellen[id].ersatz_ref)
      for (const x of kette) { const e = (eigner[x] ??= new Set()); e.add(u.slug) }
    }
  }
}

for (const [id, k] of Object.entries(quellen)) {
  const owners = [...(eigner[id] ?? [])]
  const imUmfang = ganz || owners.some((s) => umfang.has(s))
  const sev = schwere(owners)
  const w = (code, was) => imUmfang && melde(sev, code, `src/data/quellen/${id}.json`, was)

  if (k.id !== id && imUmfang) melde(FEHLER, 'NAME_KARTE_DATEINAME', `src/data/quellen/${id}.json`, `Feld id «${k.id}» ist nicht der Dateiname «${id}»`)
  if (!RE_QUELLE.test(id)) w('NAME_KARTE_MUSTER', 'ID folgt nicht dem Muster q-<n>[.<k>]<a|b>-<pflicht|pflicht-ersatz|vertiefung-1|vertiefung-2>')

  // Archivordner: gleicher Name wie die id, relativ zum Archiv, auf «gewaehlt»
  if (k.archiv_ref === undefined) w('NAME_ARCHIV_REF', 'archiv_ref fehlt')
  else if (k.archiv_ref !== `${id}/gewaehlt`) w('NAME_ARCHIV_REF', `archiv_ref «${k.archiv_ref}» zeigt nicht auf den Archivordner gleichen Namens («${id}/gewaehlt»)`)
  else if (ARCHIV) {
    if (!existsSync(join(ARCHIV, id, 'gewaehlt'))) w('NAME_ARCHIV_ORDNER', `Archivordner ${id}/gewaehlt fehlt im Archiv`)
    else if (!existsSync(join(ARCHIV, id, 'gewaehlt', 'quelle.md'))) w('NAME_ARCHIV_ORDNER', `${id}/gewaehlt/quelle.md fehlt im Archiv`)
  }
  if (ARCHIV && k.archiv_ref && k.archiv_ref !== `${id}/gewaehlt` && !existsSync(join(ARCHIV, k.archiv_ref.split('/')[0]))) w('NAME_ARCHIV_ORDNER', `archiv_ref «${k.archiv_ref}» zeigt auf einen Ordner, den es im Archiv nicht gibt`)
  if (k.ersatz_ref && !quellen[k.ersatz_ref]) w('NAME_ERSATZ_REF', `ersatz_ref «${k.ersatz_ref}» — keine Karte`)
  else if (k.ersatz_ref && k.ersatz_ref !== `${id}-ersatz`) w('NAME_ERSATZ_REF', `ersatz_ref «${k.ersatz_ref}», Soll «${id}-ersatz»`)

  // Besitz: genau eine Einheit, ausser ausdruecklich geteilt
  const erlaubt = GETEILT.filter((g) => g.karten.test(id)).flatMap((g) => g.einheiten)
  if (owners.length > 1) {
    const fremd = owners.filter((s) => !erlaubt.includes(s))
    if (fremd.length || !owners.every((s) => erlaubt.includes(s))) w('NAME_KARTE_GETEILT', `wird von ${owners.length} Einheiten geführt (${owners.join(', ')}) und steht nicht in der Liste GETEILT`)
  }
  // Muster passt zum Eigner: Ziffern der Ordnernummer, .k-Satz, Buchstabe des Hefts
  const m = RE_QUELLE.exec(id)
  if (m && owners.length && !(erlaubt.length && owners.every((s) => erlaubt.includes(s)))) {
    for (const s of owners) {
      if (ziffern(s) !== m[1]) w('NAME_KARTE_EIGNER', `Ziffern «${m[1]}» passen nicht zur Ordnernummer von ${s} («${ziffern(s)}»)`)
    }
  }
}

// Ein Satz, ein Muster: je Einheit nur IDs ohne .<k> oder nur mit demselben .<k>; Heft A traegt «a», Heft B «b».
for (const [slug, liste] of Object.entries(verweisNach)) {
  if (!umfang.has(slug)) continue
  const u = einheiten[slug]
  const sev = u.publ ? WARN : FEHLER
  const alle = [...new Set(liste.flatMap(({ id }) => [id, quellen[id]?.ersatz_ref].filter(Boolean)))]
  const ks = new Set(alle.map((id) => RE_QUELLE.exec(id)?.[2] ?? '-'))
  const geteilt = alle.filter((id) => GETEILT.some((g) => g.karten.test(id) && g.einheiten.includes(slug)))
  if (ks.size > 1 && !geteilt.length) melde(sev, 'NAME_QUELLEN_MISCHMUSTER', `${slug}`, `Quellen-IDs mit verschiedenem .<k>: ${[...ks].join(', ')} — ein Satz, ein Muster`)
  for (const { id, heft } of liste) {
    const m = RE_QUELLE.exec(id)
    if (!quellen[id]) melde(sev, 'NAME_QUELLE_UNBEKANNT', `${slug} › Heft ${heft}`, `Quellen-ID «${id}» — keine Karte unter src/data/quellen/`)
    else if (m && m[3] !== heft.toLowerCase()) melde(sev, 'NAME_QUELLE_HEFT', `${slug} › Heft ${heft}`, `«${id}» trägt «${m[3]}» im Namen, geführt von Heft ${heft}`)
  }
}

// Verwaiste Karten: keine Einheit fuehrt sie, kein Bauplan nennt sie. In einem Teilumfang nur
// die Karten, deren Ziffern zu einer geprueften Einheit passen.
{
  const bauplanAlles = Object.values(bauplanTexte).join('\n')
  const ziele = new Set([...umfang].map(ziffern))
  for (const id of Object.keys(quellen)) {
    if (eigner[id]?.size) continue
    const m = RE_QUELLE.exec(id)
    if (!ganz && !(m && ziele.has(m[1]))) continue
    if (bauplanAlles.includes(id)) continue
    melde(WARN, 'NAME_KARTE_VERWAIST', `src/data/quellen/${id}.json`, 'keine Einheit führt die Karte und kein freigegebener Bauplan nennt sie')
  }
}

// Methodenkarten: id = Dateiname, Muster. (Verbraucher: scripts/karten.mjs, sobald vorhanden.)
for (const [id, k] of Object.entries(methoden)) {
  if (!ganz) break
  if (k.id !== id) melde(FEHLER, 'NAME_KARTE_DATEINAME', `src/data/methoden/${id}.json`, `Feld id «${k.id}» ist nicht der Dateiname «${id}»`)
  if (!RE_METHODE.test(id)) melde(WARN, 'NAME_METHODE_MUSTER', `src/data/methoden/${id}.json`, 'ID ist weder hko-<slug> noch lm-<kap>-<slug>')
}
// Verweise der Hefte auf Methodenkarten
for (const u of Object.values(einheiten)) {
  if (!umfang.has(u.slug)) continue
  for (const [l, h] of Object.entries(u.hf)) {
    for (const r of Array.isArray(h.methoden) ? h.methoden : []) {
      if (r?.ref && r.ref !== '__spur__' && !methoden[r.ref]) melde(u.publ ? WARN : FEHLER, 'NAME_METHODE_UNBEKANNT', `${u.slug} › Heft ${l}`, `Methodenkarte «${r.ref}» — keine Datei unter src/data/methoden/`)
    }
  }
}

// ------------------------------------------------------------ Laufordner

const laufDirs = dirs(LAUF)
let index = null
if (existsSync(join(LAUF, 'INDEX.md'))) {
  index = new Map()
  for (const z of readFileSync(join(LAUF, 'INDEX.md'), 'utf8').split('\n')) {
    if (!z.trim().startsWith('|')) continue
    const zellen = z.split('|').slice(1, -1).map((c) => c.trim())
    const name = /^`([^`]+)`$/.exec(zellen[0] ?? '')?.[1]
    if (!name) continue
    const einheit = /^`([^`]+)`$/.exec(zellen[1] ?? '')?.[1] ?? null
    index.set(name, { einheit, keinLauf: /kein Einheiten-Lauf/i.test(z) })
  }
}
const alsInfo = (n) => RE_LAUF_NEU.exec(n)

// --vor <ordner>: nur die Namen eines geplanten Laufs pruefen, bevor etwas geschrieben wird.
if (vor) process.exit(vorpruefung(vor))

for (const name of laufDirs) {
  const neu = alsInfo(name)
  const eintrag = index?.get(name)
  let ordner = null
  if (neu) ordner = neu[4]
  else if (eintrag?.einheit) ordner = eintrag.einheit
  if (!ganz && !(ordner && umfang.has(ordner))) continue
  const wo = `docs/cloud-run/laeufe/${name}`
  const hatBericht = existsSync(join(LAUF, name, 'BERICHT.md'))

  if (neu) {
    if (!datumOk(neu[1], neu[2], neu[3])) melde(FEHLER, 'NAME_LAUF_DATUM', wo, `«${neu[1]}-${neu[2]}-${neu[3]}» ist kein Datum`)
    const k = neu[5] ? +neu[5] : 1
    if (neu[5] && k < 2) melde(FEHLER, 'NAME_LAUF_NUMMER', wo, 'der erste Lauf eines Tages trägt keine Nummer; -2, -3 gibt es erst für weitere Läufe')
    else if (k >= 2) {
      const vorher = k === 2 ? `${neu[1]}-${neu[2]}-${neu[3]}-${ordner}` : `${neu[1]}-${neu[2]}-${neu[3]}-${ordner}-${k - 1}`
      if (!laufDirs.includes(vorher)) melde(FEHLER, 'NAME_LAUF_NUMMER', wo, `«${name}» setzt «${vorher}» voraus, den es nicht gibt`)
    }
    const abgebrochen = existsSync(join(LAUF, name, 'abgebrochen', ordner))
    const nichtErzeugbar = hatBericht && /nicht erzeugbar/i.test(readFileSync(join(LAUF, name, 'BERICHT.md'), 'utf8')) && existsSync(join(BAUPL, `${ordner}.md`))
    if (!einheiten[ordner] && !abgebrochen && !nichtErzeugbar) melde(FEHLER, 'NAME_LAUF_OHNE_EINHEIT', wo, `«${ordner}» ist kein Ordner unter src/data/einheiten/ (auch nicht unter abgebrochen/, und der Bericht sagt nicht «nicht erzeugbar»)`)
    continue
  }
  // Alte Form oder fremde Form: Zuordnung steht in INDEX.md.
  if (eintrag?.keinLauf) continue
  if (eintrag?.einheit) {
    if (!einheiten[eintrag.einheit]) melde(FEHLER, 'NAME_LAUF_OHNE_EINHEIT', wo, `INDEX.md ordnet «${eintrag.einheit}» zu — kein Ordner unter src/data/einheiten/`)
    else if (RE_LAUF_ALT.test(name) && name.slice(11, 14) !== ziffern(eintrag.einheit)) melde(FEHLER, 'NAME_LAUF_INDEX', wo, `Nummer «${name.slice(11, 14)}» im Namen passt nicht zu «${eintrag.einheit}»`)
    continue
  }
  if (!hatBericht) continue // kein Bericht → kein Lauf einer Einheit (z. B. das Protokoll eines Umbaus)
  melde(FEHLER, 'NAME_LAUF_OHNE_INDEX', wo, index ? 'Laufordner alter oder fremder Form ohne Zeile in INDEX.md' : 'docs/cloud-run/laeufe/INDEX.md fehlt')
}
if (index && ganz) {
  for (const name of index.keys()) if (!laufDirs.includes(name)) melde(FEHLER, 'NAME_LAUF_INDEX', 'docs/cloud-run/laeufe/INDEX.md', `Zeile «${name}» — den Ordner gibt es nicht`)
}

// --------------------------------------------------------------- Baupläne

for (const f of bauplaene) {
  const ordner = f.replace(/\.md$/, '')
  if (!ganz && !umfang.has(ordner)) continue
  if (!RE_ORDNER.test(ordner)) melde(WARN, 'NAME_BAUPLAN', `docs/cloud-run/bauplaene/${f}`, 'Dateiname ist nicht <X.Y.Z>_<slug>.md')
}

// ---------------------------------------------------------------- Ausgabe

console.log(`check-namen — ${ganz ? 'ganzer Bestand' : `${slugsWunsch.length} Einheit(en)`}${CLOUD ? ' · --cloud' : ''}`)
console.log(`  ${alleSlugs.length} Einheiten, ${Object.keys(quellen).length} Quellenkarten, ${Object.keys(methoden).length} Methodenkarten, ${laufDirs.length} Laufordner, ${bauplaene.length} Baupläne gelesen`)
if (!ARCHIV) {
  if (CLOUD) melde(FEHLER, 'NAME_ARCHIV_FEHLT', 'Quellenarchiv', 'fehlt lokal (QUELLEN_ARCHIV) — ohne Archiv darf kein Lauf starten')
  else hinweise.push('Quellenarchiv fehlt lokal (QUELLEN_ARCHIV oder material/_quellen-archiv/) — Existenz der Archivordner ist NICHT geprüft.')
}
for (const h of hinweise) console.log(`  HINWEIS ${h}`)

const rang = (b) => (b.art === FEHLER ? 0 : 1)
befunde.sort((a, b) => rang(a) - rang(b))
console.log('')
for (const b of befunde) console.log(`  ${b.art}  ${b.code}  ${b.wo}\n           ${b.was}`)

const nF = befunde.filter((b) => b.art === FEHLER).length
const nW = befunde.length - nF
const schluss = nF
  ? `ROT — ${nF} Fehler, ${nW} Warnung(en).`
  : hinweise.length
    ? `KEINE FEHLER, ${nW} Warnung(en) — aber ohne Archiv geprüft (archiv_ref nur als Text); kein «GRUEN».`
    : `GRUEN — keine Fehler, ${nW} Warnung(en).`
console.log(`${befunde.length ? '\n' : ''}${schluss}`)
process.exit(nF ? 1 : 0)

// ------------------------------------------------- --vor <ordner> (Funktion)

function vorpruefung(ordner) {
  const heute = datum ?? new Date().toLocaleDateString('sv-SE')
  let rot = 0
  const zeile = (ok, was, detail = '') => { if (!ok) rot++; console.log(`  ${ok ? 'frei  ' : 'BELEGT'}  ${was}${detail ? '  ' + detail : ''}`) }
  console.log(`check-namen --vor ${ordner}\n`)

  // Ordner
  const m = RE_ORDNER.exec(ordner)
  zeile(!!m, 'Ordnername', m ? '' : '— nicht <X.Y.Z>_<slug> mit nur a–z, 0–9 und _')
  if (!m) { console.log('\nROT — Name unbrauchbar.'); return 1 }
  if (/_v42$/.test(ordner)) zeile(false, 'Ordnername', '— «_v42» trug nur die Gold-Einheit (E21)')
  zeile(!einheiten[ordner], `src/data/einheiten/${ordner}/`, einheiten[ordner] ? '— existiert; nie überschreiben, slug um das nächste Kernwort verlängern (§1.4)' : '')
  const gleicheNummer = alleSlugs.filter((s) => s.slice(0, 5) === ordner.slice(0, 5))
  if (gleicheNummer.length) console.log(`          gleiche Nummer ${ordner.slice(0, 5)} tragen schon: ${gleicheNummer.join(', ')}`)

  // Suffix
  if (nrlp['3j'] && nrlp['4j']) {
    const nr = ordner.slice(0, 5)
    const t3 = nrlp['3j'].get(nr); const t4 = nrlp['4j'].get(nr)
    const verschieden = t3 !== undefined && t4 !== undefined && t3 !== t4
    console.log(`  Hinweis  Nummer ${nr}: 3J ${t3 === undefined ? 'fehlt' : 'vorhanden'}, 4J ${t4 === undefined ? 'fehlt' : 'vorhanden'}${verschieden ? ', Texte verschieden → Einheit nur für einen Lehrgang trägt _3j bzw. _4j (§1.3)' : t3 !== undefined && t4 !== undefined ? ', Texte gleich → kein Suffix' : ' → kein Suffix'}`)
  }

  // Laufordner
  const heuteOk = /^(\d{4})-(\d{2})-(\d{2})$/.exec(heute)
  if (!heuteOk || !datumOk(...heuteOk.slice(1))) { zeile(false, 'Datum', `«${heute}» ist kein Datum`); return 1 }
  let k = 1
  const lauf = () => `${heute}-${ordner}${k > 1 ? `-${k}` : ''}`
  while (laufDirs.includes(lauf())) k++
  console.log(`  frei    Laufordner: docs/cloud-run/laeufe/${lauf()}/${k > 1 ? '   (weiterer Lauf am selben Tag)' : ''}`)

  // Bauplan
  console.log(`  ${existsSync(join(BAUPL, `${ordner}.md`)) ? 'da    ' : 'fehlt '}  docs/cloud-run/bauplaene/${ordner}.md`)

  // Quellen-IDs
  const n = ziffern(ordner)
  const belegt = (id) => !!quellen[id] || (ARCHIV && existsSync(join(ARCHIV, id)))
  const bauplanText = bauplanTexte[ordner] ?? ''
  const gehoertDieser = (id) => (eigner[id]?.has(ordner) ?? false) || bauplanText.includes(id)
  const pflichtA = `q-${n}a-pflicht`; const pflichtB = `q-${n}b-pflicht`
  const fremd = [pflichtA, pflichtB].filter((id) => belegt(id) && !gehoertDieser(id))
  if (!fremd.length) console.log(`  frei    Quellen-IDs: Muster q-${n}<a|b>-…${[pflichtA, pflichtB].some(belegt) ? ' (vorhanden, gehört dieser Einheit)' : ''}`)
  else {
    let kk = 2
    while (belegt(`q-${n}.${kk}a-pflicht`) || belegt(`q-${n}.${kk}b-pflicht`)) kk++
    console.log(`  ableiten  Quellen-IDs: ${fremd.join(', ')} gehört einer anderen Einheit → Muster q-${n}.${kk}<a|b>-… (§4.1; Ausnahme nur mit Bauplan §9)`)
  }
  if (!ARCHIV) console.log('  HINWEIS Quellenarchiv fehlt lokal — Archivordner sind NICHT geprüft; nur Karten wurden verglichen.')

  // Neue Methodenkarten
  for (const id of karten) {
    zeile(RE_METHODE.test(id), `Methodenkarte ${id}`, RE_METHODE.test(id) ? '' : '— ID ist weder hko-<slug> noch lm-<kap>-<slug>')
    zeile(!methoden[id] && !existsSync(join(METH, `${id}.json`)), `src/data/methoden/${id}.json`, methoden[id] ? '— existiert; nie überschreiben (E31)' : '')
  }

  console.log(`\n${rot ? 'ROT — mindestens ein Name ist vergeben; nichts schreiben.' : 'OK — die Namen sind frei.'}`)
  return rot ? 1 : 0
}
