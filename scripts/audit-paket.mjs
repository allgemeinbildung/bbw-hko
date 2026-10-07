#!/usr/bin/env node
/**
 * audit-paket.mjs — baut die Pakete der Audits einer v4.2-Einheit und führt ihre
 * Teildateien zusammen (ENTSCHEIDE E38, Stufe C; Rollen: references/audits.md der Skill).
 *
 *   node scripts/audit-paket.mjs <ordner> --plan
 *        # welche Pakete die Einheit braucht (Heft, Spur, Zahl der Felder) — schreibt nichts
 *
 *   node scripts/audit-paket.mjs <ordner> --heft A|B|auftrag --spur ohne_medien|mit_medien --out <datei>
 *        # BLIND-PAKET des Lösungs-Audits: Aufgaben, was die Lernenden sehen, Quelle und
 *        # Lehrmittel in voller Auflösung (jede Zeile mit Zeit-, Absatz- bzw. Seitenmarke) — KEINE Lösung
 *   … --mit-loesung --antworten <datei> [--geruest <datei>]
 *        # VERGLEICHS-PAKET: je Lösungsfeld Text, Hash, Bezug. Nur, wenn die Antworten-Datei des
 *        # Auditors jede Aufgabe des Blind-Pakets trägt. --geruest schreibt dazu die Teildatei
 *        # belege.<heft>.<spur>.json mit Feld, Spur und Hash vor (Urteil, Anker, Stelle leer)
 *   … --kern auto|ja|nein|nur     # die Felder des Kerns (Spur «beide»): auto = im Paket der ersten
 *                                 # vorhandenen Spur des Hefts · nur = eigenes Paket ohne Spur
 *   … --nur-veraltet              # nur Felder, deren Zeile in belege.json fehlt oder deren Hash nicht mehr stimmt
 *
 *   node scripts/audit-paket.mjs <ordner> --probe --heft A|B|auftrag [--spur …] --out <datei>
 *        # PAKET DER LÖSBARKEITSPROBE: «Das geben Sie ab», Kriterien mit Stufen, Lösungsbild, Frage LF4
 *
 *   node scripts/audit-paket.mjs <ordner> --zusammenfuehren
 *        # Teildateien im Ordner <Quellenarchiv>/_pruefung/<ordner>/ → belege.json, probe.json, fall.json
 *        # (belege.<…>.json · probe.<…>.json · fall.A.json, fall.B.json, fall.auftrag.json)
 *   node scripts/audit-paket.mjs <ordner> --pruefen --heft … --spur …
 *        # zusammenführen, dann check-belege --streng — gezeigt werden nur die Befunde der eigenen Felder,
 *        # je als ZEILE (die Belegzeile stimmt nicht: der Auditor behebt sie) oder BEFUND (das Audit hat an
 *        # der Einheit etwas gefunden: bleibt stehen). Letzte Zeile «ABGABE IN ORDNUNG» oder «NICHT ABGABEREIF».
 *
 *   Beim Auftrag: --heft auftrag, mit «--spur beide» oder ohne --spur.
 *
 *   … --wurzel <ordner>           # anderer Baum statt dieses Repos (Temp-Kopie eines Altstands);
 *                                 # das Archiv kommt aus QUELLEN_ARCHIV, das Lehrmittel aus LEHRMITTEL
 *
 * NIE IM REPO. Blind- und Vergleichs-Paket tragen Wortlaut aus Quelle und Lehrmittel, die
 * Antworten-Datei und die Teildateien tragen Anker. Jede Ausgabedatei (--out, --geruest) und
 * die Antworten-Datei (--antworten) werden verweigert, wenn sie in diesem Repo, unter --wurzel
 * oder in irgendeinem Git-Repo liegen (Exit 2). Geschrieben wird sonst nur in den Ordner
 * `_pruefung/<ordner>/` des Quellenarchivs (--zusammenfuehren, --pruefen). Die Einheit, die
 * Karten und das Archiv der Quellen werden nur gelesen.
 *
 * BLIND heisst: Das Paket enthält kein Feld, das lib/pruefung.mjs als Lösung führt (`loesung`,
 * `loesungsbild`, `erwartungshorizont`, `loesung_zeilen`, `erwartung`), nicht den Kurzbeschrieb
 * der Quellenkarte, nicht Kopf und Notizen der Archivdatei (nur ihren Quellentext) und nichts
 * aus Begleiter, KN und Prinzip. Die Konsole zeigt nie Text, nur Zahlen und Pfade.
 *
 * Zusammenführen — eine Zeile je Feld: Es gewinnt die Zeile, deren Hash zum heutigen Text
 * passt; unter mehreren die mit dem jüngeren `geprueft_am`, dann die aus der jüngeren Datei.
 * Zeilen ohne Urteil (unausgefülltes Gerüst) und Zeilen zu Feldern, die es nicht mehr gibt,
 * fallen weg und werden gezählt. In probe.json bleibt eine vorhandene Zeile stehen, wie sie
 * ist (ihren Stand führt der Orchestrator nach); neue kommen dazu.
 *
 * Exit 0  geschrieben bzw. --pruefen: keine Fehler in den eigenen Belegzeilen (Befunde an der Einheit sind kein Fehler)
 * Exit 1  Teildatei unlesbar oder ungültig · --pruefen: Fehler in den eigenen Belegzeilen
 * Exit 2  Aufruf falsch · Ausgabe läge im Repo · Antworten unvollständig · Archiv oder Lehrmittel fehlt lokal
 *
 * Reines Node, keine Abhängigkeiten, ohne Netz. Kein Quellen- oder Lehrmittelwortlaut in dieser Datei.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, statSync, renameSync } from 'node:fs'
import { join, dirname, resolve, relative, isAbsolute, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { REPO, SPUREN, ladeEinheit, textfelder, seiteVonFeld, lehrmittelVerweise, absaetzeIn } from './lib/pruefung.mjs'
import { loesungsfelder } from './lib/loesungsfelder.mjs'
import { archivWurzel, lehrmittelWurzel, pruefOrdner, ladeArchivtext, ausschnittDerKarte, kapitelDateien, ladeKapitel } from './lib/archiv.mjs'
import { ladeSchema, validiere } from './lib/schema.mjs'

const NAME = 'audit-paket'
const USAGE = `node scripts/audit-paket.mjs <ordner> --plan
       node scripts/audit-paket.mjs <ordner> --heft A|B|auftrag --spur ohne_medien|mit_medien --out <datei> [--kern auto|ja|nein|nur] [--nur-veraltet]
       … --mit-loesung --antworten <datei> [--geruest <datei>]
       node scripts/audit-paket.mjs <ordner> --probe --heft A|B|auftrag [--spur …] --out <datei>
       node scripts/audit-paket.mjs <ordner> --zusammenfuehren | --pruefen --heft … --spur …
       … --wurzel <ordner>`

// ------------------------------------------------------------------ Aufruf

const bad = (m, code = 2) => { console.error(`${NAME}: ${m}\nusage: ${USAGE}`); process.exit(code) }
const argv = process.argv.slice(2)
const O = { wurzel: REPO, ordner: null, heft: null, spur: null, out: null, antworten: null, geruest: null, kern: 'auto' }
const F = new Set()
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  const wert = () => argv[++i] ?? bad(`${a} braucht einen Wert`)
  if (a === '--wurzel') O.wurzel = resolve(wert())
  else if (['--heft', '--spur', '--out', '--antworten', '--geruest', '--kern'].includes(a)) O[a.slice(2)] = wert()
  else if (['--plan', '--mit-loesung', '--nur-veraltet', '--probe', '--zusammenfuehren', '--pruefen'].includes(a)) F.add(a)
  else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}`)
  else if (O.ordner) bad('genau ein Ordner')
  else O.ordner = basename(a.replace(/[\\/]+$/, ''))
}
if (!O.ordner) bad('kein Ordner genannt')
if (!existsSync(join(O.wurzel, 'src', 'data', 'einheiten', O.ordner))) bad(`kein Ordner src/data/einheiten/${O.ordner} unter ${O.wurzel}`)
if (O.heft && !['A', 'B', 'auftrag'].includes(O.heft)) bad('--heft ist A, B oder auftrag')
if (O.heft === 'auftrag' && O.spur === 'beide') O.spur = null // der Auftrag gilt in beiden Spuren; «--spur beide» ist erlaubt und ohne Wirkung
if (O.spur && !SPUREN.includes(O.spur)) bad(`--spur ist ${SPUREN.join(' oder ')}${O.heft === 'auftrag' ? ' (beim Auftrag: beide oder weglassen)' : ''}`)
if (!['auto', 'ja', 'nein', 'nur'].includes(O.kern)) bad('--kern ist auto, ja, nein oder nur')

const heute = new Date().toISOString().slice(0, 10)
const E = ladeEinheit(O.wurzel, O.ordner)
if (!E.v42) bad(`${O.ordner} ist keine Einheit im Format heft_8page_v42`)
if (E.fehler.length) bad(`${O.ordner}: ${E.fehler.join(' · ')}`)
const L = loesungsfelder(E.dir)
if (L.fehler.length) bad(`${O.ordner}: ${L.fehler.join(' · ')}`)
const archiv = archivWurzel({ wurzel: O.wurzel })
const lehrmittel = lehrmittelWurzel({ wurzel: O.wurzel })

/** Grund, warum ein Pfad nicht beschrieben bzw. gelesen werden darf — leer, wenn er ausserhalb jedes Repos liegt. */
function imRepo(p) {
  const abs = resolve(p)
  const unter = (basis) => { const r = relative(basis, abs); return r === '' || (!r.startsWith('..') && !isAbsolute(r)) }
  if (unter(REPO)) return `liegt in diesem Repo (${REPO})`
  if (unter(O.wurzel)) return `liegt unter --wurzel (${O.wurzel})`
  for (let d = dirname(abs); ; d = dirname(d)) {
    if (existsSync(join(d, '.git'))) return `liegt in einem Git-Repo (${d})`
    if (dirname(d) === d) break
  }
  return ''
}
function ausserhalb(schalter, p) {
  if (!p) bad(`${schalter} fehlt`)
  const grund = imRepo(p)
  if (grund) { console.error(`${NAME}: VERWEIGERT — ${schalter} ${resolve(p)} ${grund}. Pakete, Antworten und Teildateien tragen Wortlaut der Quellen und liegen nie in einem Repo.`); process.exit(2) }
  return resolve(p)
}
function schreibe(pfad, text) {
  mkdirSync(dirname(pfad), { recursive: true })
  const tmp = `${pfad}.tmp-${process.pid}`
  writeFileSync(tmp, text, 'utf8')
  // Mehrere Auditoren führen gleichzeitig zusammen: Ist die Zieldatei gerade offen, kurz warten und nochmals.
  for (let n = 0; ; n++) {
    try { renameSync(tmp, pfad); return } catch (e) { if (n >= 9) throw e; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150) }
  }
}
const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex')
/** Ohne Byte-Order-Marke am Dateianfang (Windows-Editoren setzen sie). */
const ohneBom = (s) => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s)

// ------------------------------------------------------------------ Umfang

const heftJson = (h) => E.json[`herausforderung_${h}.json`]
const spurenVon = (h) => SPUREN.filter((s) => heftJson(h)?.spuren?.[s])
/** Trägt das Paket (Heft, Spur) auch die Felder des Kerns? */
function mitKern(heft, spur, kern = O.kern) {
  if (kern === 'ja' || kern === 'nur') return true
  if (kern === 'nein') return false
  return spurenVon(heft)[0] === spur
}
/** Die Lösungsfelder eines Pakets. */
function umfang(heft, spur, kern = O.kern) {
  if (heft === 'auftrag') return L.felder.filter((f) => f.heft === 'auftrag')
  if (kern === 'nur') return L.felder.filter((f) => f.heft === heft && f.spur === 'beide')
  return L.felder.filter((f) => f.heft === heft && (f.spur === spur || (f.spur === 'beide' && mitKern(heft, spur, kern))))
}
const teilName = (heft, spur, kern = O.kern) => (heft === 'auftrag' ? 'auftrag.beide' : kern === 'nur' ? `${heft}.kern` : `${heft}.${spur}`)

/** Die Aufgabe, zu der ein Feld gehört: eine Leitfrage, die Denkhilfe, eine Vertiefung, das Lösungsbild, der Abschluss. */
function aufgabeVon(f) {
  const m = /^(?:spuren\.\w+\.)?leitfragen\[LF\d\]|^spuren\.\w+\.kasten_s4|^spuren\.\w+\.quellen\[\d+\]|^handlungsprodukt\.loesungsbild|^abschluss\.loesung|^gemeinsamer_auftrag\.erwartungshorizont/.exec(f.pfad)
  return `${f.datei} › ${m ? m[0] : f.pfad}`
}
function aufgaben(felder) {
  const m = new Map()
  for (const f of felder) (m.get(aufgabeVon(f)) ?? m.set(aufgabeVon(f), []).get(aufgabeVon(f))).push(f)
  return m
}
const WAS = [
  [/leitfragen\[LF[12]\]$/, 'Beantworte die Leitfrage vollständig: eine Kurzzeile und die Teile der Antwort, je mit Fundstelle im Lehrmittel (Kapiteldatei, Seite) und einem wörtlichen Anker.'],
  [/leitfragen\[LF3\]$/, 'Fülle das Raster aus (Spalten und Zeilenzahl stehen bei den Lernenden, Seite 3), nenne die Teile der Antwort mit Fundstelle und Anker, und schreibe den Befund, den das Raster ergibt.'],
  [/leitfragen\[LF4\]$/, 'Nenne, woran eine gute Antwort zu erkennen ist, schreibe je eine vertretbare Antwort für beide Seiten der Abwägung, und was nicht genügt. Halte fest, ob beide Seiten vertretbar SIND.'],
  [/kasten_s4$/, 'Fülle die Denkhilfe aus (Spalten bei den Lernenden, Seite 4).'],
  [/quellen\[\d+\]$/, 'Beantworte die Leitfrage dieser Vertiefung an ihrer Quelle, mit Fundstelle und Anker.'],
  [/loesungsbild$/, 'Stelle das Produkt her, wie «Das geben Sie ab», die Schritte und die Kriterien es verlangen — am Fall der Situation, in der Form des Beispielbilds. Nenne deine Annahmen.'],
  [/erwartungshorizont$/, 'Nenne, woran eine gute Lösung des Auftrags zu erkennen ist, skizziere ein tragfähiges Beispiel, und was nicht genügt.'],
]
// Der Abschluss gehört teils zum Kern, teils zur Spur: genannt wird nur, was das Paket führt.
const ABSCHLUSS = { abschluss_verbindung: 'beschrifte die Verbindungen des Begriffsnetzes (Seite 8)', abschluss_transfer: 'nenne den Übertrag («gilt auch bei …»)', abschluss_knoten: 'nenne zwei eigene Begriffe für die leeren Knoten, wie sie nach dieser Spur naheliegen', abschluss_quercheck: 'beantworte jede Quer-Check-Frage', abschluss_mitnahme: 'nenne mögliche Einträge «Das nehme ich mit»' }
function wasVon(aufgabe, fs) {
  if (/abschluss\.loesung$/.test(aufgabe)) return `Abschluss: ${Object.entries(ABSCHLUSS).filter(([art]) => fs.some((f) => f.art === art)).map(([, x]) => x).join('; ')}.`
  return WAS.find(([re]) => re.test(aufgabe))?.[1] ?? 'Löse die Aufgabe, mit Fundstelle und Anker.'
}
const zaehleArt = (felder) => { const m = {}; for (const f of felder) m[f.art] = (m[f.art] ?? 0) + 1; return Object.entries(m).map(([k, v]) => `${k} ${v}`).join(' · ') }

/** Zeilen von belege.json, wie sie heute im Archiv liegt — für --nur-veraltet. */
function heutigeBelege() {
  const p = join(pruefOrdner(archiv.pfad, O.ordner), 'belege.json')
  if (!existsSync(p)) return new Map()
  try { return new Map((JSON.parse(ohneBom(readFileSync(p, 'utf8'))).zeilen ?? []).map((z) => [z.feld, z])) } catch { return new Map() }
}
function gewaehlterUmfang({ alle = false } = {}) {
  if (!O.heft) bad('--heft fehlt')
  if (O.heft !== 'auftrag' && O.kern !== 'nur' && !O.spur) bad('--spur fehlt')
  if (O.heft !== 'auftrag' && O.spur && !spurenVon(O.heft).includes(O.spur)) bad(`Heft ${O.heft} hat keine Spur ${O.spur}`)
  let felder = umfang(O.heft, O.spur)
  if (F.has('--nur-veraltet') && !alle) {
    if (!archiv.pfad) bad(`--nur-veraltet braucht das Quellenarchiv (${archiv.grund})`)
    const b = heutigeBelege()
    felder = felder.filter((f) => b.get(f.feld)?.hash !== f.hash)
  }
  return felder
}

// --------------------------------------------------- Was die Lernenden sehen

const NICHT_GEDRUCKT = /^dekontextualisierung|^herausforderung\.|^modul_titel$|^wochen$/
/** Sichtbare Felder eines Hefts in einer Spur, je mit Seite. Zahlen und Verweise, die textfelder() nicht führt, kommen dazu. */
function sichtbar(heft, spur) {
  const json = heftJson(heft)
  const out = []
  for (const f of textfelder(E, { karten: false, begleiter: false, kn: false })) {
    if (f.traeger !== heft || f.loesung || (f.spur && f.spur !== spur) || NICHT_GEDRUCKT.test(f.pfad)) continue
    out.push({ seite: seiteVonFeld(f.pfad), pfad: f.pfad, text: f.text })
  }
  const lfs = [...(json.leitfragen ?? []).map((lf) => ['', lf]), ...((json.spuren?.[spur]?.leitfragen ?? []).map((lf) => [`spuren.${spur}.`, lf]))]
  for (const [vor, lf] of lfs) {
    const p = `${vor}leitfragen[LF${lf.nr}]`
    const teile = [`Antwortform ${lf.antwortform ?? '—'}`]
    if (lf.pol_typ) teile.push(`Abwägung ${lf.pol_typ}`)
    if (Number.isFinite(lf.raster?.zeilen)) teile.push(`Raster mit ${lf.raster.zeilen} leeren Zeilen`)
    if (lf.raster?.quelle_ref) teile.push(`Raster zur Quelle ${lf.raster.quelle_ref}`)
    out.push({ seite: seiteVonFeld(p), pfad: `${p} (Form)`, text: teile.join(' · ') })
  }
  ;(json.spuren?.[spur]?.quellen ?? []).forEach((q, i) => out.push({ seite: i ? 4 : 3, pfad: `spuren.${spur}.quellen[${i}] (Form)`, text: `Quelle ${q.ref} · Rolle ${q.rolle}${Number.isFinite(q.raster?.zeilen) ? ` · Raster mit ${q.raster.zeilen} leeren Zeilen` : ''}` }))
  for (const g of E.json['set.json']?.glossar ?? []) if (g?.heft === heft && (!g.spur || g.spur === spur)) out.push({ seite: 8, pfad: 'set.json › glossar', text: `${g.begriff}: ${g.definition}` })
  for (const [id, { karte, heft: h }] of E.methoden) if (h === heft) out.push({ seite: 6, pfad: `methoden/${id}.json`, text: [karte.name, karte.kap ? `Kap. ${karte.kap}, ${karte.seiten ?? ''}` : '', karte.lesen, ...(karte.schritte ?? []), karte.merk].filter((x) => typeof x === 'string' && x.trim()).join(' — ') })
  return out
}
function druckeSichtbar(felder) {
  const z = []
  for (const s of [1, 2, 3, 4, 5, 6, 7, 8, null]) {
    const da = felder.filter((f) => f.seite === s)
    if (!da.length) continue
    z.push('', `### ${s ? `Seite ${s}` : 'ohne feste Seite'}`, '')
    for (const f of da) z.push(`- \`${f.pfad}\`: ${f.text.replace(/\s*\n\s*/g, ' ⏎ ')}`)
  }
  return z
}

// ------------------------------------------------------------------ Material

/** Quellentext einer Karte, jede Zeile mit ihrer Stelle. Kopf und Notizen der Archivdatei bleiben draussen. */
function druckeQuelle(id, karte) {
  const t = ladeArchivtext(archiv.pfad, karte.archiv_ref ? karte : { ...karte, archiv_ref: `${id}/gewaehlt` })
  const aus = ausschnittDerKarte(karte)
  const ausText = aus.art === 'zeit' ? `${karte.verortung.von}–${karte.verortung.bis}` : aus.art === 'absaetze' ? aus.text : '—'
  const z = ['', `### ${id}`, '', `- Typ ${karte.typ ?? '—'} · «${karte.titel ?? '—'}» · ${karte.herausgeber ?? '—'} · ${karte.datum ?? '—'}`, `- Ausschnitt laut Karte: ${ausText}`]
  if (!t.vorhanden) return { zeilen: [...z, `- **Kein Archivtext: ${t.grund}.** Eine Lösung, die sich auf diese Karte stützt, ist nicht prüfbar.`], n: 0 }
  z.push(`- Form des Archivtexts: ${t.form} · Zeitmarken prüfbar: ${t.zeit.stufe}${t.zeit.stufe === 'block' ? ' (nur auf den Block genau — jede Zeitmarke gehört auf die Gegenhör-Liste)' : ''}${t.zeit.vermerk.length ? ` · Kopf der Archivdatei: ${t.zeit.vermerk.join(', ')}` : ''}`, '')
  const bereiche = aus.art === 'absaetze' ? absaetzeIn(aus.text) : []
  const draussen = (x) => x.im_ausschnitt_laut_datei === false
    || (aus.art === 'zeit' && x.sek !== null && x.sek !== undefined && (x.sek < aus.von_sek || x.sek > aus.bis_sek))
    || (bereiche.length > 0 && x.absatz !== null && x.absatz !== undefined && !bereiche.some((b) => x.absatz >= b.von && x.absatz <= b.bis))
  for (const x of t.zeilen) z.push(`${draussen(x) ? '(ausserhalb) ' : ''}[${x.stelle || x.art}] ${x.text}`)
  for (const x of t.lose) z.push(`[ohne Marke] ${x.text}`)
  return { zeilen: z, n: t.zeilen.length + t.lose.length }
}
/** Kapitelnummern, die ein Text nennt. */
const kapitelIn = (texte) => [...new Set(texte.flatMap((t) => lehrmittelVerweise(t).map((v) => v.kapitel)))].sort()
function druckeKapitel(nummern) {
  const z = []; let n = 0
  for (const nr of nummern) for (const datei of kapitelDateien(lehrmittel.pfad, nr)) {
    const k = ladeKapitel(lehrmittel.pfad, datei)
    z.push('', `### ${datei}`, '')
    for (const s of k.seiten) for (const l of s.zeilen) { z.push(`[${s.seite === null ? 'ohne Seite' : `S. ${s.seite}`}] ${l.text}`); n++ }
  }
  return { zeilen: z, n }
}
const kapitelSichtbar = (heft, felder) => kapitelIn([...felder.map((f) => f.text), ...(heftJson(heft)?.quellen_anker ?? []).map((q) => `${q?.ref ?? ''}, ${q?.seiten ?? ''}`)])

// ------------------------------------------------------------------- --plan

if (F.has('--plan')) {
  console.log(`${NAME} — ${O.ordner} · ${L.felder.length} Lösungsfelder · status ${E.status ?? 'kein Feld'}\n`)
  const basis = `node scripts/audit-paket.mjs ${O.ordner}${O.wurzel !== REPO ? ` --wurzel "${O.wurzel}"` : ''}`
  let summe = 0
  for (const h of ['A', 'B']) for (const s of spurenVon(h)) {
    const f = umfang(h, s, 'auto'); summe += f.length
    console.log(`  Heft ${h} · ${s.padEnd(11)} ${String(f.length).padStart(3)} Felder in ${aufgaben(f).size} Aufgaben${mitKern(h, s, 'auto') ? ' (mit Kern)' : ''}\n      ${basis} --heft ${h} --spur ${s} --out <tmp>/blind.${h}.${s}.md`)
  }
  const a = umfang('auftrag'); summe += a.length
  console.log(`  Auftrag               ${String(a.length).padStart(3)} Felder in ${aufgaben(a).size} Aufgaben\n      ${basis} --heft auftrag --out <tmp>/blind.auftrag.beide.md`)
  console.log(`\n${summe} von ${L.felder.length} Feldern verteilt.${summe !== L.felder.length ? ' FEHLER: Die Pakete decken die Felder nicht genau einmal.' : ''}`)
  process.exit(summe === L.felder.length ? 0 : 1)
}

// --------------------------------------------------------- --zusammenfuehren

function zusammenfuehren() {
  if (!archiv.pfad) { console.error(`${NAME}: Quellenarchiv fehlt lokal (${archiv.grund}) — nichts zusammengeführt.`); process.exit(2) }
  const dir = pruefOrdner(archiv.pfad, O.ordner)
  if (!existsSync(dir)) { console.error(`${NAME}: kein Ordner ${dir} — es gibt keine Teildatei.`); process.exit(2) }
  const dateien = readdirSync(dir)
  let rot = 0
  const lies = (n) => { try { return JSON.parse(ohneBom(readFileSync(join(dir, n), 'utf8'))) } catch { rot++; console.log(`  FEHLER  ${n}: kein gültiges JSON`); return null } }
  const kopf = (format) => ({ format, einheit: O.ordner })
  console.log(`${NAME} --zusammenfuehren — ${O.ordner} · ${dir}`)

  // belege: Teildateien und die bestehende belege.json; je Feld gewinnt die Zeile mit heutigem Hash.
  const bTeile = dateien.filter((n) => /^belege\..+\.json$/.test(n)).sort()
  if (bTeile.length) {
    const heutig = new Map(L.felder.map((f) => [f.feld, f.hash]))
    const kand = new Map(); let leer = 0; let fremd = 0
    for (const n of [...(dateien.includes('belege.json') ? ['belege.json'] : []), ...bTeile]) {
      const d = lies(n); if (!d) continue
      if (d.einheit !== O.ordner) { rot++; console.log(`  FEHLER  ${n}: einheit «${d.einheit}» ist nicht ${O.ordner}`); continue }
      const mtime = n === 'belege.json' ? 0 : statSync(join(dir, n)).mtimeMs
      for (const z of Array.isArray(d.zeilen) ? d.zeilen : []) {
        if (!z || typeof z !== 'object' || !z.urteil) { leer++; continue }
        if (!heutig.has(z.feld)) { fremd++; continue }
        ;(kand.get(z.feld) ?? kand.set(z.feld, []).get(z.feld)).push({ z, mtime, passt: z.hash === heutig.get(z.feld) })
      }
    }
    const zeilen = []
    for (const f of L.felder) {
      const k = kand.get(f.feld); if (!k) continue
      k.sort((a, b) => (b.passt - a.passt) || String(b.z.geprueft_am ?? '').localeCompare(String(a.z.geprueft_am ?? '')) || (b.mtime - a.mtime))
      zeilen.push(k[0].z)
    }
    const daten = { ...kopf('bbw-hko/belege@1'), zeilen }
    const v = validiere(ladeSchema('belege'), daten)
    schreibe(join(dir, 'belege.json'), JSON.stringify(daten, null, 2) + '\n')
    const veraltet = zeilen.filter((z) => z.hash !== heutig.get(z.feld)).length
    console.log(`  belege.json   ${zeilen.length} von ${L.felder.length} Feldern · aus ${bTeile.length} Teildatei(en) · ${veraltet} mit altem Hash · ${leer} Zeile(n) ohne Urteil übergangen · ${fremd} Zeile(n) ohne Feld übergangen · Schema: ${v.length ? `${v.length} Verstoss/Verstösse (check-belege nennt sie)` : 'gültig'}`)
  } else console.log('  belege.json   keine Teildatei belege.<…>.json — unverändert')

  // probe: Läufe und Befunde aller Teildateien; eine vorhandene Zeile bleibt, wie sie ist.
  const pTeile = dateien.filter((n) => /^probe\..+\.json$/.test(n)).sort()
  if (pTeile.length) {
    const alt = dateien.includes('probe.json') ? lies('probe.json') : null
    const laeufe = [...(alt?.laeufe ?? [])]; const zeilen = [...(alt?.zeilen ?? [])]
    const kl = (l) => [l.heft, l.spur, l.geprueft_am, l.von?.modell].join('|')
    const kz = (z) => [z.feld, z.heft, z.spur, z.art, z.befund].join('|')
    let neu = 0
    for (const n of pTeile) {
      const d = lies(n); if (!d) continue
      if (d.einheit !== O.ordner) { rot++; console.log(`  FEHLER  ${n}: einheit «${d.einheit}» ist nicht ${O.ordner}`); continue }
      const v = validiere(ladeSchema('probe'), d)
      if (v.length) { rot++; console.log(`  FEHLER  ${n}: ${v.length} Verstoss/Verstösse gegen probe.schema.json — ${v.slice(0, 3).join(' · ')}`); continue }
      for (const l of d.laeufe) if (!laeufe.some((x) => kl(x) === kl(l))) laeufe.push(l)
      for (const z of d.zeilen) if (!zeilen.some((x) => kz(x) === kz(z))) { zeilen.push(z); neu++ }
    }
    schreibe(join(dir, 'probe.json'), JSON.stringify({ ...kopf('bbw-hko/probe@1'), laeufe, zeilen }, null, 2) + '\n')
    console.log(`  probe.json    ${laeufe.length} Lauf/Läufe · ${zeilen.length} Befund(e), davon ${zeilen.filter((z) => z.stand === 'offen').length} offen · ${neu} neu aus ${pTeile.length} Teildatei(en)`)
  } else console.log('  probe.json    keine Teildatei probe.<…>.json — unverändert')

  // fall: je Träger ein Block; fall.json verlangt A und B.
  const fTeile = dateien.filter((n) => /^fall\.(A|B|auftrag)\.json$/.test(n)).sort()
  if (fTeile.length) {
    const alt = dateien.includes('fall.json') ? lies('fall.json') : null
    const faelle = { ...(alt?.faelle ?? {}) }
    const schema = ladeSchema('fall')
    for (const n of fTeile) {
      const d = lies(n); if (!d) continue
      const v = validiere(schema.$defs.fall, d, schema)
      if (v.length) { rot++; console.log(`  FEHLER  ${n}: ${v.length} Verstoss/Verstösse gegen den Block «fall» aus fall.schema.json — ${v.slice(0, 3).join(' · ')}`); continue }
      faelle[/^fall\.(\w+)\.json$/.exec(n)[1]] = d
    }
    if (faelle.A && faelle.B) {
      schreibe(join(dir, 'fall.json'), JSON.stringify({ ...kopf('bbw-hko/fall@1'), faelle: { A: faelle.A, B: faelle.B, ...(faelle.auftrag ? { auftrag: faelle.auftrag } : {}) } }, null, 2) + '\n')
      console.log(`  fall.json     ${Object.keys(faelle).join(', ')} · ${Object.values(faelle).reduce((n, f) => n + (f.zahlen?.length ?? 0), 0)} Fallzahlen aus ${fTeile.length} Teildatei(en)`)
    } else console.log(`  fall.json     NICHT geschrieben: Es fehlt der Block ${['A', 'B'].filter((k) => !faelle[k]).join(' und ')} (fall.A.json, fall.B.json)`)
  } else console.log('  fall.json     keine Teildatei fall.<A|B|auftrag>.json — unverändert')
  return rot
}

if (F.has('--zusammenfuehren')) process.exit(zusammenfuehren() ? 1 : 0)

if (F.has('--pruefen')) {
  // Immer alle Felder des Pakets, auch nach einer Nachprüfung: Nach dem Zusammenführen ist kein Feld mehr «veraltet».
  const eigene = new Set(gewaehlterUmfang({ alle: true }).map((f) => f.feld))
  const rot = zusammenfuehren()
  const r = spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'check-belege.mjs'), O.ordner, '--streng', '--wurzel', O.wurzel], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.status === 2) { console.log((r.stdout || r.stderr).trim()); process.exit(2) }
  const karten = new Set(O.heft === 'auftrag' ? [] : [...E.quellen].filter(([, v]) => v.heft === O.heft).map(([id]) => `quellen/${id}.json`))
  const zeilen = r.stdout.split(/\r?\n/)
  const mein = []
  for (let i = 0; i < zeilen.length; i++) {
    const m = /^ {2}(FEHLER |warnung|HINWEIS) {2}(\S+) {2}(.*)$/.exec(zeilen[i])
    if (!m) continue
    const wo = m[3].replace(/ \(weiterer Beleg \d+\)$/, '')
    if (eigene.has(wo) || (m[1] === 'HINWEIS' && karten.has(wo))) mein.push({ art: m[1], code: m[2], wo, text: [zeilen[i], /^ {11}/.test(zeilen[i + 1] ?? '') ? zeilen[i + 1] : ''].filter(Boolean).join('\n') })
  }
  // Zwei Sorten Fehler: BEFUND = das Audit hat an der Einheit etwas gefunden (bleibt stehen) ·
  // ZEILE = die Belegzeile selbst stimmt nicht (der Auditor behebt sie). Die vier «daneben»-Codes sind
  // ein Befund nur an einem Feld mit Urteil «fundstelle_falsch» — sonst fehlt ein Beleg.
  const BEFUND = new Set(['ERR_URTEIL_FALSCH', 'ERR_URTEIL_FUNDSTELLE', 'ERR_ABLEITUNG_UNGEKENNZEICHNET'])
  const DANEBEN = new Set(['ERR_ZEITMARKE_DANEBEN', 'ERR_SEITE_DANEBEN', 'ERR_ABSATZ_DANEBEN', 'ERR_FUNDSTELLE_OHNE_BELEG'])
  const urteil = heutigeBelege()
  const schema = ladeSchema('belege')
  for (const [feld, zl] of urteil) if (eigene.has(feld)) for (const v of validiere(schema.$defs.zeile, zl, schema)) mein.push({ art: 'FEHLER ', code: 'ERR_BELEGE_SCHEMA', wo: feld, text: `  FEHLER   ERR_BELEGE_SCHEMA  ${feld}\n           ${v}` })
  const sorte = (b) => (b.art !== 'FEHLER ' ? 'hinweis' : BEFUND.has(b.code) || (DANEBEN.has(b.code) && urteil.get(b.wo)?.urteil === 'fundstelle_falsch') ? 'befund' : 'zeile')
  const zaehle = (s) => { const c = {}; for (const b of mein) if (sorte(b) === s) c[b.code] = (c[b.code] ?? 0) + 1; return { n: Object.values(c).reduce((a, x) => a + x, 0), text: Object.entries(c).map(([k, v]) => `${k} ${v}`).join(' · ') } }
  console.log(`\n${NAME} --pruefen — ${O.ordner} · Paket ${teilName(O.heft, O.spur)} · ${eigene.size} eigene Felder (check-belege --streng, nur diese)\n`)
  for (const b of mein) console.log(`${{ zeile: 'ZEILE  ', befund: 'BEFUND ', hinweis: '       ' }[sorte(b)]}${b.text.replace(/\n/g, '\n       ')}`)
  const zl = zaehle('zeile'); const bf = zaehle('befund'); const urteile = {}
  for (const f of eigene) { const u = urteil.get(f)?.urteil ?? 'ohne Zeile'; urteile[u] = (urteile[u] ?? 0) + 1 }
  console.log(`\nUrteile: ${Object.entries(urteile).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
  console.log(zl.n || rot
    ? `NICHT ABGABEREIF — ${zl.n} Fehler in den Belegzeilen [${zl.text}]${rot ? ` · ${rot} Teildatei(en) ungültig` : ''} · ${bf.n} Befund(e) an der Einheit${bf.n ? ` [${bf.text}]` : ''}`
    : `ABGABE IN ORDNUNG — ${eigene.size} Felder, 0 Fehler in den Belegzeilen · ${bf.n} Befund(e) an der Einheit${bf.n ? ` [${bf.text}]` : ''}`)
  process.exit(zl.n || rot ? 1 : 0)
}

// ------------------------------------------------------------------- --probe

if (F.has('--probe')) {
  if (!O.heft) bad('--heft fehlt')
  const out = ausserhalb('--out', O.out)
  const z = [`# Paket Lösbarkeitsprobe · ${O.ordner} · ${O.heft === 'auftrag' ? 'Auftragsbogen' : `Heft ${O.heft} · Spur ${O.spur ?? spurenVon(O.heft)[0]}`}`, '',
    `Erzeugt am ${heute} von scripts/audit-paket.mjs. **Enthält das Lösungsbild** — nie an einen Lernenden-Gegenleser geben. Liegt ausserhalb des Repos.`, '']
  // Je Abschnitt der Feldname, den ein Befund in probe.json trägt (`feld`), und die Werte für `heft` und `spur`.
  const feldZeile = (f) => `- Feld für probe.json: \`${f}\``
  const kriterien = (datei, basis, liste) => { (liste ?? []).forEach((k, i) => { z.push('', `### ${k.kn_kriterium} (${k.dimension})`, '', feldZeile(`${datei} › ${basis}[${i}].stufen[3]`), `- Woran am Produkt: ${k.indikator_produkt ?? '—'}`); (k.stufen ?? []).forEach((s, n) => z.push(`- ${n} Punkte: ${s}`)) }) }
  const feldTexte = (re) => L.felder.filter((f) => f.heft === O.heft && re.test(f.pfad)).flatMap((f) => [`**${f.feld}**`, '', ...f.text.split('\n').map((l) => `> ${l}`), ''])
  if (O.heft === 'auftrag') {
    const g = E.json['set.json'].gemeinsamer_auftrag ?? {}
    z.push('In probe.json: `"heft": "auftrag"`, `"spur": "beide"`.', '')
    z.push('## 1. «Das geben Sie ab»', '', feldZeile('set.json › gemeinsamer_auftrag.abgaben'), `- Auftrag: ${g.auftrag ?? '—'}`, ...(g.abgaben ?? []).map((a) => `- Abgabe: ${a}`), ...(g.produkte ?? []).map((p) => `- Produkt bei Schritt ${p.schritt}: Form ${p.form}${p.stationen ? ` · Stationen: ${p.stationen.join(' | ')}` : ''}${p.dauer ? ` · Dauer ${p.dauer}` : ''}${p.hinweis ? ` · ${p.hinweis}` : ''}`))
    z.push('', '## 2. Kriterien mit Stufen (0 bis 3 Punkte)'); kriterien('set.json', 'gemeinsamer_auftrag.feedback_kriterien', g.feedback_kriterien)
    z.push('', '## 3. Erwartungshorizont (steht für das Lösungsbild)', '', feldZeile('set.json › gemeinsamer_auftrag.erwartungshorizont'), '', ...feldTexte(/^gemeinsamer_auftrag\.erwartungshorizont/))
    z.push('## 4. Die Frage des Auftrags (für den Befund «keine echte Wahl»)', '', feldZeile('set.json › gemeinsamer_auftrag.leitfrage'), `- ${g.leitfrage ?? '—'}`, `- Spannung: ${g.mehrdeutigkeit?.trade_off ?? '—'}`)
  } else {
    const j = heftJson(O.heft); const spur = O.spur ?? spurenVon(O.heft)[0]
    const hp = j.handlungsprodukt ?? {}; const datei = `herausforderung_${O.heft}.json`
    z.push(`In probe.json: \`"heft": "${O.heft}"\`, \`"spur": "${spur}"\`.`, '')
    z.push('## 1. «Das geben Sie ab»', '', feldZeile(`${datei} › handlungsprodukt.abgaben`), `- Produkt: ${hp.titel ?? '—'} — ${hp.format ?? '—'}`, `- Form im Einzelnen: ${hp.format_detail ?? '—'}`, ...(hp.abgaben ?? []).map((a) => `- Abgabe: ${a}`))
    z.push('', '## 2. Kriterien mit Stufen (0 bis 3 Punkte)'); kriterien(datei, 'feedback_kriterien', j.feedback_kriterien)
    z.push('', '## 3. Lösungsbild', '', feldZeile(`${datei} › handlungsprodukt.loesungsbild`), `- Titel: ${hp.loesungsbild?.titel ?? '—'}`, '', ...feldTexte(/^handlungsprodukt\.loesungsbild/))
    const lf4 = (j.spuren?.[spur]?.leitfragen ?? []).find((l) => l.nr === 4)
    z.push('## 4. Die Frage LF4 (für den Befund «keine echte Wahl»)', '', feldZeile(`${datei} › spuren.${spur}.leitfragen[LF4].text`), `- ${lf4?.text ?? '—'}`, `- Abwägung: ${lf4?.pol_typ ?? '—'}`)
  }
  schreibe(out, z.join('\n') + '\n')
  console.log(`${NAME} — Paket der Lösbarkeitsprobe geschrieben: ${out} (${z.length} Zeilen)`)
  process.exit(0)
}

// ------------------------------------------------- Blind- und Vergleichs-Paket

const felder = gewaehlterUmfang()
const out = ausserhalb('--out', O.out)
if (!felder.length) { console.log(`${NAME} — ${O.ordner} · Paket ${teilName(O.heft, O.spur)}: kein Feld im Umfang${F.has('--nur-veraltet') ? ' (alle Zeilen tragen den heutigen Hash)' : ''} — nichts geschrieben.`); process.exit(0) }
if (!lehrmittel.pfad) { console.error(`${NAME}: Lehrmittel fehlt lokal (${lehrmittel.kandidaten.join(' · ')}) — kein Paket.`); process.exit(2) }
if (!archiv.pfad) { console.error(`${NAME}: Quellenarchiv fehlt lokal (${archiv.grund}) — kein Paket.`); process.exit(2) }
const A = aufgaben(felder)
const titel = `${O.ordner} · ${O.heft === 'auftrag' ? 'Auftragsbogen' : `Heft ${O.heft} · ${O.kern === 'nur' ? 'Kern' : `Spur ${O.spur}`}`}${F.has('--nur-veraltet') ? ' · nur veraltete Felder' : ''}`
// Was die Lernenden sehen: das Heft in der Spur des Pakets; beim Auftrag der Bogen und der Kern beider Hefte.
const sichtSpur = (h) => (h === O.heft && O.spur ? O.spur : spurenVon(h)[0])
const sicht = O.heft === 'auftrag'
  ? textfelder(E, { karten: false, begleiter: false, kn: false }).filter((f) => f.datei === 'set.json' && f.pfad.startsWith('gemeinsamer_auftrag') && !f.loesung).map((f) => ({ seite: null, pfad: f.pfad, text: f.text }))
  : sichtbar(O.heft, sichtSpur(O.heft))
// Beim Auftrag nur die Kapitel, die die Hefte als Grundlage führen (quellen_anker) — nicht die der Methodenkarten.
const kapSicht = O.heft === 'auftrag' ? [...new Set(['A', 'B'].flatMap((h) => kapitelSichtbar(h, [])))].sort() : kapitelSichtbar(O.heft, sicht)

if (!F.has('--mit-loesung')) {
  const z = [`# Blind-Paket · Lösungs-Audit · ${titel}`, '',
    `Erzeugt am ${heute} von scripts/audit-paket.mjs. **Enthält Wortlaut aus Quelle und Lehrmittel** — die Datei liegt ausserhalb des Repos und bleibt dort.`,
    'Enthält **keine Lösung**. Öffne keine Datei der Einheit, keine Karte, keinen Begleiter und kein Dokument «Lösungen», bevor deine Antworten-Datei steht.', '',
    `## A. Aufgaben (${A.size}) — ${felder.length} Lösungsfelder`, '',
    'Deine Antworten-Datei trägt je Aufgabe eine Überschrift, die mit `## ` beginnt und den Namen der Aufgabe **zeichengleich** enthält.', '']
  for (const [name, fs] of A) z.push(`### \`## ${name}\``, '', `- ${wasVon(name, fs)}`, `- Die Lösung der Einheit führt hier ${fs.length} Feld(er): ${zaehleArt(fs)}`, ...(fs[0].bezug?.karte ? [`- Quelle dieser Aufgabe: ${fs[0].bezug.karte}`] : []), '')
  z.push(`## B. Was die Lernenden sehen${O.heft === 'auftrag' ? ' — Auftragsbogen' : ` — Heft ${O.heft}, Spur ${sichtSpur(O.heft)}`}`, ...druckeSichtbar(sicht))
  if (O.heft === 'auftrag') for (const h of ['A', 'B']) z.push('', `## B${h}. Was die Lernenden mitbringen — Heft ${h}, Spur ${sichtSpur(h)}`, ...druckeSichtbar(sichtbar(h, sichtSpur(h))))
  const karten = O.heft === 'auftrag' || sichtSpur(O.heft) !== 'mit_medien' ? [] : [...E.quellen].filter(([, v]) => v.heft === O.heft)
  let nQ = 0
  z.push('', `## C. Quellen in voller Auflösung (${karten.length})`, '', karten.length ? 'Jede Zeile beginnt mit ihrer Stelle: `[mm:ss]` Einsatzzeit · `[Abs. N]` Absatz · `[ohne Marke]`. «(ausserhalb)» heisst: nicht im Ausschnitt der Karte — ein Anker von dort belegt nichts.' : 'Dieses Paket hat keine Quelle: Grundlage ist das Lehrmittel.')
  for (const [id, { karte }] of karten) { const q = druckeQuelle(id, karte); nQ += q.n; z.push(...q.zeilen) }
  const kap = druckeKapitel(kapSicht)
  z.push('', `## D. Lehrmittel mit Seitenmarken (Kapitel ${kapSicht.join(', ') || '—'})`, '', 'Jede Zeile beginnt mit der Buchseite `[S. N]`, auf der sie steht.', ...kap.zeilen)
  schreibe(out, z.join('\n') + '\n')
  console.log(`${NAME} — Blind-Paket geschrieben: ${out}\n  ${titel}\n  ${A.size} Aufgaben · ${felder.length} Lösungsfelder · ${sicht.length} sichtbare Felder · ${karten.length} Quelle(n) mit ${nQ} Zeilen · Lehrmittel Kap. ${kapSicht.join(', ') || '—'} mit ${kap.n} Zeilen\n  Teildatei des Auditors: _pruefung/${O.ordner}/belege.${teilName(O.heft, O.spur)}.json`)
  process.exit(0)
}

// Vergleichs-Paket: erst, wenn die Antworten-Datei jede Aufgabe trägt.
const antworten = ausserhalb('--antworten', O.antworten)
if (!existsSync(antworten)) { console.error(`${NAME}: VERWEIGERT — keine Antworten-Datei ${antworten}. Erst blind lösen, dann vergleichen.`); process.exit(2) }
const antText = readFileSync(antworten, 'utf8')
const abschnitte = antText.split(/^(?=## )/m)
const fehlt = [...A.keys()].filter((name) => !abschnitte.some((a) => a.split(/\r?\n/, 1)[0].includes(name) && a.split(/\r?\n/).slice(1).join('').replace(/\s/g, '').length >= 30))
if (fehlt.length) { console.error(`${NAME}: VERWEIGERT — die Antworten-Datei trägt ${fehlt.length} von ${A.size} Aufgaben nicht (Überschrift «## <Aufgabe>» mit mindestens 30 Zeichen Antwort):\n${fehlt.map((n) => `  ## ${n}`).join('\n')}`); process.exit(2) }
let geruest = null
if (O.geruest) {
  geruest = ausserhalb('--geruest', O.geruest)
  if (existsSync(geruest)) { console.error(`${NAME}: VERWEIGERT — ${geruest} gibt es schon; eine Teildatei wird nie überschrieben (Nachprüfung: belege.<heft>.<spur>.r2.json).`); process.exit(2) }
}
{
  const z = [`# Vergleichs-Paket · Lösungs-Audit · ${titel}`, '',
    `Erzeugt am ${heute} von scripts/audit-paket.mjs — **nach** der Antworten-Datei ${antworten} (SHA-256 ${sha(antText).slice(0, 16)}…, geändert ${statSync(antworten).mtime.toISOString()}).`,
    '**Enthält die Lösungen der Einheit.** Liegt ausserhalb des Repos.', '',
    'Je Feld ein Urteil: `stimmt` · `fundstelle_falsch` · `ableitung` · `falsch` (references/belege.md §4.1). Der Text unter «Lösung» ist der Text, über den der Hash läuft: Zeile = `label | text | quelle`, Rasterzeile = Zellen mit ` | `.', '']
  for (const [name, fs] of A) {
    z.push(`## ${name}`, '')
    for (const f of fs) {
      const bezug = Object.entries(f.bezug ?? {}).map(([k, v]) => `${k} ${v}`).join(' · ')
      z.push(`### ${f.feld}`, '', `- Art ${f.art} · Spur ${f.spur} · Hash ${f.hash}`, ...(bezug ? [`- Worauf sich das Feld laut Heft stützt: ${bezug}`] : []), '- Lösung:', '', ...f.text.split('\n').map((l) => `> ${l}`), '')
    }
  }
  const mehr = kapitelIn(felder.map((f) => f.text)).filter((k) => !kapSicht.includes(k))
  if (mehr.length) { const kap = druckeKapitel(mehr); z.push(`## Weitere Kapitel, die eine Lösung nennt und das Blind-Paket nicht trug (${mehr.join(', ')})`, '', ...kap.zeilen) }
  schreibe(out, z.join('\n') + '\n')
  console.log(`${NAME} — Vergleichs-Paket geschrieben: ${out}\n  ${titel}\n  ${A.size} Aufgaben · ${felder.length} Lösungsfelder · Antworten ${antworten}`)
}
if (geruest) {
  const daten = { format: 'bbw-hko/belege@1', einheit: O.ordner, zeilen: felder.map((f) => ({ feld: f.feld, spur: f.spur, herkunft: '', anker: '', wo: '', stelle: '', urteil: '', hash: f.hash, geprueft_am: heute, von: { rolle: 'Lösungs-Audit', modell: '' } })) }
  schreibe(geruest, JSON.stringify(daten, null, 2) + '\n')
  console.log(`  Gerüst der Teildatei: ${geruest} (${felder.length} Zeilen; herkunft, anker, wo, stelle, urteil und von.modell sind auszufüllen)`)
}
process.exit(0)
