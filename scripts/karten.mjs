#!/usr/bin/env node
/**
 * karten.mjs — Methoden- und Quellenkarten: wer führt sie, darf man sie ändern,
 * und was ist gegenüber dem Stand, der live ist, geändert?
 *
 *   node scripts/karten.mjs verbraucher <karten-id>
 *        jede Einheit, jedes Heft, jede Spur, die die Karte führt — mit status
 *        (publiziert / archiviert / entwurf) und den Feldern, die die Einheit
 *        überschreibt. Auch indirekt: Ersatzkarte einer geführten Quellenkarte,
 *        Karten einer anderen Einheit, Nennung in einer Lösung (quelle_ref).
 *   node scripts/karten.mjs darf <karten-id>
 *        Entscheid nach der Regel «ändern oder neu» (docs/methodenkartei.md §9,
 *        Skill references/karten.md; ENTSCHEIDE E36). Exit 0 = ändern erlaubt
 *        (Fall a), Exit 1 = gebunden: nur als Fehler mit Vermerk (b, d) oder
 *        gar nicht (c → überschreiben oder neue Karte).
 *   node scripts/karten.mjs geaendert [--gegen origin/main]
 *        jede Karte, die sich gegenüber dem Vergleichsstand unterscheidet, mit
 *        Verbrauchern. Exit 1, wenn eine geänderte Karte von einer publizierten
 *        oder archivierten Einheit geführt wird und kein neuer Vermerk in
 *        src/data/<methoden|quellen>/_aenderungen.json vorliegt. Neue Karten
 *        sind kein Befund. So ruft check-all auf (Zeile «Karten»).
 *   node scripts/karten.mjs warnungen
 *        Regel e über die ganze Methodenkartei: Ziffern, Zahlwörter und
 *        Formatwörter in `merk` und `schritte`. Nur Warnungen, immer Exit 0.
 *   node scripts/karten.mjs belege [<karten-id>]
 *        Kartenbelege (ENTSCHEIDE E38 Stufe D): Was eine Karte über Lehrmittel,
 *        Quelle oder die Welt sagt, wird wie ein Lösungsfeld belegt — in
 *        `<Quellenarchiv>/_pruefung/_karten/<id>.json` (ausserhalb des Repos,
 *        Schema scripts/schema/karte-belege.schema.json). Ohne ID: alle
 *        Methodenkarten. Geprüft wird: Schema, Hash je Zeile gegen den heutigen
 *        Text des Kartenfelds, Anker im Kapitel bzw. Archivtext, Seite des Ankers
 *        in `seiten` der Karte, Urteil; dazu, welche Felder noch keine Zeile haben.
 *        Fehlt die Datei einer Karte, ist das ein HINWEIS («nicht belegt»), kein
 *        Fehler. Exit 1 nur, wenn eine vorhandene Datei einen Fehler zeigt.
 *        `geaendert` liest dieselben Dateien mit: Eine Karte, deren Text sich
 *        seit dem Audit geändert hat, macht ihre Belege ungültig (Hash) — Warnung
 *        KARTE_BELEGE_VERALTET.
 *   … --wurzel <ordner>      anderer Baum statt dieses Repos (Gegenproben, Tests).
 *                            Ist der Ordner kein eigenes Git-Repo, kommt der
 *                            Vergleichsstand aus dem Repo dieses Skripts.
 *
 * Status: «publiziert» ist auch ein fehlendes oder unbekanntes Feld (der
 * Index-Builder behandelt beides als live). «archiviert» wird getrennt
 * ausgewiesen und bindet wie publiziert: Die Hefte sind gedruckt im Umlauf,
 * die QR-Seite funktioniert weiter.
 *
 * Vermerk (ein Eintrag je Korrektur, in einem JSON-Array):
 *   { "karte": "<id>", "datum": "JJJJ-MM-TT", "art": "fehler",
 *     "beleg": "<Fundstelle, kein Zitat>", "verbraucher": ["<ordner>", …] }
 * Er zählt nur, wenn er im Vergleichsstand noch nicht steht — ein alter Vermerk
 * deckt keine neue Änderung.
 *
 * Exit 0  erlaubt bzw. keine Fehler (Warnungen möglich)
 * Exit 1  gebunden bzw. mindestens ein Fehler
 * Exit 2  Aufruf falsch, Daten nicht lesbar oder Vergleichsstand fehlt — nie «GRUEN»;
 *         bei `belege` auch: Quellenarchiv oder Lehrmittel fehlt lokal
 *
 * Codes von `belege`:
 *   KARTE_BELEGE_FORM         Datei unlesbar, verletzt das Schema, oder `karte`/`art` passen nicht zur Karte.
 *   KARTE_BELEGE_VERALTET     Hash einer Zeile passt nicht mehr zum Text des Kartenfelds bzw. der Wortlaut eines Fakts steht nicht mehr dort.
 *   KARTE_BELEG_OHNE_FELD     Eine Zeile nennt ein Feld, das die Karte nicht (mehr) führt.
 *   KARTE_URTEIL              Urteil «falsch», «fundstelle_falsch», «abweichend» oder «nicht_belegbar»: Fehler in der Karte (Regel b).
 *   KARTE_ANKER_NICHT_IM_TEXT Der Anker steht nicht in der Kapiteldatei bzw. im Archivtext.
 *   KARTE_STELLE_FALSCH       Der Anker steht an einer anderen Stelle als die Zeile sagt, oder in einem anderen Kapitel als `kap`.
 *   KARTE_SEITE_DANEBEN       Der Anker steht auf einer Seite, die `seiten` der Karte nicht nennt.
 *   KARTE_BELEG_FEHLT         (Warnung) Ein belegpflichtiges Feld oder eine Aussage über die Welt hat keine Zeile.
 *   KARTE_BELEGE_FEHLEN       (Hinweis) Die Karte hat keine Datei unter _pruefung/_karten/ — nicht belegt.
 *
 * Reines Node, keine Abhängigkeiten, nur lesend. Gibt Feldnamen aus, nie Kartentext und nie einen Anker.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { archivWurzel, lehrmittelWurzel, liesKartenBelege, ladeKapitel, sucheAnkerKapitel, ladeArchivtext, sucheAnker } from './lib/archiv.mjs'
import { hashText, leseFeld } from './lib/loesungsfelder.mjs'
import { ladeSchema, validiere } from './lib/schema.mjs'
import { findeAussagen } from './lib/aussagen.mjs'
import { seitenIn } from './lib/pruefung.mjs'

// ----------------------------------------------------------------- Aufruf

const SKRIPT_REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const USAGE = 'usage: node scripts/karten.mjs verbraucher <id> | darf <id> | geaendert [--gegen <stand>] | warnungen | belege [<id>]   [--wurzel <ordner>]'
const bad = (m) => { console.error(`karten: ${m}`); process.exit(2) }

const argv = process.argv.slice(2)
let wurzel = SKRIPT_REPO
let gegen = 'origin/main'
const pos = []
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--wurzel') wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
  else if (a === '--gegen') gegen = argv[++i] ?? bad('--gegen braucht einen Git-Stand (z. B. origin/main)')
  else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}\n${USAGE}`)
  else pos.push(a)
}
const [befehl, kartenId] = pos
if (!['verbraucher', 'darf', 'geaendert', 'warnungen', 'belege'].includes(befehl)) bad(USAGE)
if ((befehl === 'verbraucher' || befehl === 'darf') && !kartenId) bad(`${befehl} braucht eine Karten-ID\n${USAGE}`)
if (pos.length > (befehl === 'verbraucher' || befehl === 'darf' || befehl === 'belege' ? 2 : 1)) bad(`zu viele Angaben\n${USAGE}`)

const ORDNER = { methode: 'src/data/methoden', quelle: 'src/data/quellen' }
const VERMERK_DATEI = '_aenderungen.json'
const EINH = join(wurzel, 'src/data/einheiten')
const BAUPL = join(wurzel, 'docs/cloud-run/bauplaene')
if (!existsSync(EINH)) bad(`kein Ordner ${EINH}`)

// ------------------------------------------------------------------- Lesen

const lies = (p) => {
  try { return JSON.parse(readFileSync(p, 'utf8')) } catch (e) { bad(`${p} ist nicht lesbar: ${e.message}`) }
}

/** Kartei eines Ordners: Dateiname ohne .json → Karte. Dateien mit führendem «_» sind keine Karten. */
function kartei(art) {
  const dir = join(wurzel, ORDNER[art])
  if (!existsSync(dir)) return {}
  return Object.fromEntries(
    readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort()
      .map((f) => [f.replace(/\.json$/, ''), lies(join(dir, f))]),
  )
}
const karten = { methode: kartei('methode'), quelle: kartei('quelle') }
const artVon = (id) => (karten.methode[id] ? 'methode' : karten.quelle[id] ? 'quelle' : null)
const NAME = { methode: 'Methodenkarte', quelle: 'Quellenkarte' }

/** Status, wie ihn Katalog und Index-Builder lesen: alles ausser "entwurf" ist sichtbar. */
function statusVon(set) {
  const s = set?.status
  if (s === 'entwurf') return { gruppe: 'entwurf', text: 'entwurf' }
  if (s === 'archiviert') return { gruppe: 'archiviert', text: 'archiviert' }
  if (s === 'publiziert') return { gruppe: 'publiziert', text: 'publiziert' }
  if (s === undefined) return { gruppe: 'publiziert', text: 'publiziert (Feld fehlt — gilt als live)' }
  return { gruppe: 'publiziert', text: `«${s}» (unbekannter Wert — gilt als live)` }
}
const bindet = (gruppe) => gruppe !== 'entwurf'

const einheiten = {}
for (const d of readdirSync(EINH, { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name).sort()) {
  const dir = join(EINH, d)
  const u = { slug: d, hefte: {}, status: statusVon(existsSync(join(dir, 'set.json')) ? lies(join(dir, 'set.json')) : null) }
  for (const l of ['A', 'B', 'C']) if (existsSync(join(dir, `herausforderung_${l}.json`))) u.hefte[l] = lies(join(dir, `herausforderung_${l}.json`))
  einheiten[d] = u
}

// Baupläne: wer nennt eine Karte, und ist er freigegeben?
const bauplaene = existsSync(BAUPL)
  ? readdirSync(BAUPL).filter((f) => f.endsWith('.md') && !f.startsWith('_')).sort().map((f) => {
      const text = readFileSync(join(BAUPL, f), 'utf8')
      const zeile = text.split('\n').find((z) => z.includes('**Freigabe:**')) ?? ''
      return { ordner: f.replace(/\.md$/, ''), text, freigegeben: /\d{1,2}\.\d{1,2}\.\d{4}|\d{4}-\d{2}-\d{2}/.test(zeile) }
    })
  : []
const nenntId = (text, id) => new RegExp(`(?<![A-Za-z0-9.-])${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9.-])`).test(text)
const bauplaeneZu = (id) => bauplaene.filter((b) => nenntId(b.text, id))

// ------------------------------------------------------------- Verbraucher

/**
 * Jede Stelle in einem Heft, an der eine Karten-ID als Wert steht.
 * `zusatz`: IDs, die es in der Kartei nicht mehr gibt (gelöschte Karten des Vergleichsstands).
 */
function fundstellen(zusatz = []) {
  const bekannt = new Set([...Object.keys(karten.methode), ...Object.keys(karten.quelle), ...zusatz])
  const out = {} // id → [{slug, heft, spur, rolle, pfad, ueberschreibt, setzt}]
  const merke = (id, f) => (out[id] ??= []).push(f)
  for (const u of Object.values(einheiten)) {
    for (const [l, h] of Object.entries(u.hefte)) {
      const spurenDesHefts = Object.keys(h.spuren ?? {})
      const geh = (wert, pfad, eltern) => {
        if (typeof wert === 'string') {
          if (!bekannt.has(wert)) return
          const p = pfad.join('.')
          const spur = pfad[0] === 'spuren' ? pfad[1] : null
          let rolle = 'verweis'
          if (/^methoden\.\d+\.ref$/.test(p)) rolle = 'kern'
          else if (/^spuren\.[^.]+\.methoden_ref_rezeption\.ref$/.test(p)) rolle = 'rezeption'
          else if (/^spuren\.[^.]+\.quellen\.\d+\.ref$/.test(p)) rolle = 'quelle'
          const karte = karten.methode[wert] ?? karten.quelle[wert] ?? {}
          const felder = rolle === 'verweis' || !eltern ? [] : Object.keys(eltern).filter((k) => k !== 'ref')
          merke(wert, {
            slug: u.slug, heft: l, rolle, pfad: p,
            // Der Kern gilt in jeder Spur des Hefts; Bestandshefte ohne Spuren zählen als eine Fassung.
            spuren: spur ? [spur] : spurenDesHefts.length ? spurenDesHefts : ['—'],
            ueberschreibt: felder.filter((k) => k in karte),
            setzt: felder.filter((k) => !(k in karte)),
          })
          return
        }
        if (Array.isArray(wert)) wert.forEach((x, i) => geh(x, [...pfad, String(i)], wert))
        else if (wert && typeof wert === 'object') for (const [k, x] of Object.entries(wert)) geh(x, [...pfad, k], wert)
      }
      geh(h, [], null)
    }
  }
  // Indirekt: Die Ersatzkarte einer geführten Quellenkarte erscheint im selben Heft (QR-Seite, Begleiter).
  for (const [id, k] of Object.entries(karten.quelle)) {
    if (!k?.ersatz_ref || !bekannt.has(k.ersatz_ref)) continue
    for (const f of out[id] ?? []) {
      if (f.rolle !== 'quelle') continue
      merke(k.ersatz_ref, { ...f, rolle: 'ersatz', pfad: `${f.pfad} → ${id}.ersatz_ref`, ueberschreibt: [], setzt: [] })
    }
  }
  return out
}

const ROLLE = { kern: 'Kern', rezeption: 'Rezeptionskarte', quelle: 'Quelle', ersatz: 'Ersatzquelle (indirekt)', verweis: 'Verweis' }
const GRUPPEN = ['publiziert', 'archiviert', 'entwurf']

function uebersicht(stellen) {
  const jeGruppe = Object.fromEntries(GRUPPEN.map((g) => [g, []]))
  for (const f of stellen) jeGruppe[einheiten[f.slug].status.gruppe].push(f)
  const zaehle = (liste) => ({
    einheiten: new Set(liste.map((f) => f.slug)).size,
    hefte: new Set(liste.map((f) => `${f.slug}/${f.heft}`)).size,
    fassungen: new Set(liste.flatMap((f) => f.spuren.map((s) => `${f.slug}/${f.heft}/${s}`))).size,
    stellen: liste.length,
  })
  return { jeGruppe, zaehle }
}
const slugsDer = (stellen, test) => [...new Set(stellen.filter((f) => test(einheiten[f.slug].status.gruppe)).map((f) => f.slug))].sort()

function druckeVerbraucher(id, stellen) {
  const { jeGruppe, zaehle } = uebersicht(stellen)
  for (const g of GRUPPEN) {
    const z = zaehle(jeGruppe[g])
    console.log(`\n  ${g} — ${z.einheiten} Einheit(en), ${z.hefte} Heft(e), ${z.fassungen} Heft-Spur(en)`)
    const sortiert = [...jeGruppe[g]].sort((a, b) => (a.slug + a.heft + a.pfad).localeCompare(b.slug + b.heft + b.pfad))
    for (const f of sortiert) {
      const spur = f.rolle === 'kern' ? (f.spuren[0] === '—' ? 'ohne Spuren' : `alle Spuren: ${f.spuren.join(', ')}`) : (f.spuren[0] === '—' ? 'ohne Spuren' : f.spuren.join(', '))
      const teile = [`Heft ${f.heft}`, ROLLE[f.rolle], spur]
      if (f.ueberschreibt.length) teile.push(`überschreibt: ${f.ueberschreibt.join(', ')}`)
      if (f.setzt.length) teile.push(`setzt: ${f.setzt.join(', ')}`)
      if (f.rolle === 'verweis' || f.rolle === 'ersatz') teile.push(f.pfad)
      const st = einheiten[f.slug].status.text
      console.log(`    ${f.slug}  ·  ${teile.join(' · ')}${st === g ? '' : `  [${st}]`}`)
    }
  }
  const z = zaehle(stellen)
  console.log(`\n  Summe: ${z.einheiten} Einheit(en) · ${z.hefte} Heft(e) · ${z.fassungen} Heft-Spur(en) · ${z.stellen} Fundstelle(n)`)
  // Baupläne, die die Karte nennen, ohne dass ihre Einheit sie (schon) führt: künftige oder frühere Verbraucher.
  const fuehrt = new Set(stellen.map((f) => f.slug))
  const nurBauplan = bauplaeneZu(id).filter((b) => !fuehrt.has(b.ordner))
  if (nurBauplan.length) {
    console.log('  Nur im Bauplan genannt (die Einheit führt die Karte nicht):')
    for (const b of nurBauplan) console.log(`    ${b.ordner}  ·  Bauplan ${b.freigegeben ? 'freigegeben' : 'nicht freigegeben'} · ${einheiten[b.ordner] ? `Einheit vorhanden (${einheiten[b.ordner].status.text})` : 'noch keine Einheit'}`)
  }
}

// --------------------------------------------------- Regel e (nur Warnung)

const ZAHLWORT = /(?<![A-Za-zÄÖÜäöüß])(zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf)(?![A-Za-zÄÖÜäöüß])/i
const ZIFFER = /(?<![A-Za-zÄÖÜäöü\d.])\d+(?:[.,:–-]\d+)*(?![A-Za-zÄÖÜäöü\d])/
const FORMAT = /(?<![A-Za-z0-9])(A[3-6]|Hochformat|Querformat|Halbseite|Viertelseite|Doppelseite)(?![A-Za-z0-9])/
// Verweise auf Buch und Gesetz sind keine Vorgabe an das Produkt.
const VERWEIS = /\b(?:S\.|Seiten?|Kap\.|Kapitel|Art\.|Abs\.|Ziff\.)\s*\d+(?:[.,–-]\d+)*/g

function regelE(karte) {
  const out = []
  const pruefe = (feld, text) => {
    if (typeof text !== 'string') return
    const t = text.replace(VERWEIS, ' ')
    const treffer = []
    const z = ZIFFER.exec(t); if (z) treffer.push(`Ziffer «${z[0]}»`)
    const w = ZAHLWORT.exec(t); if (w) treffer.push(`Zahlwort «${w[0]}»`)
    const f = FORMAT.exec(t); if (f) treffer.push(`Format «${f[0]}»`)
    if (treffer.length) out.push({ feld, treffer })
  }
  pruefe('merk', karte?.merk)
  ;(Array.isArray(karte?.schritte) ? karte.schritte : []).forEach((s, i) => pruefe(`schritte[${i}]`, s))
  return out
}
const druckeRegelE = (id, einzug = '  ') => {
  const w = regelE(karten.methode[id])
  for (const x of w) console.log(`${einzug}warnung  KARTE_FESTE_ZAHL  ${id} › ${x.feld}: ${x.treffer.join(', ')} — Zahlen und Formate nennt die Einheit, nicht die Karte (Regel e)`)
  return w.length
}

// ------------------------------------------------------- Felder Quellenkarte

/** Regel d: Inhalt, der nach der ersten Freigabe nie getauscht wird. */
const Q_INHALT = ['id', 'titel', 'url', 'urn']
/** Regel d: korrigierbar (bei gebundener Karte nur mit Vermerk). */
const Q_ZEIGER = ['verortung', 'woerter', 'dauer_sek', 'sachlage_geprueft', 'kurzbeschrieb']

// ---------------------------------------------------------------- Befehle

if (befehl === 'verbraucher') {
  const art = artVon(kartenId) ?? bad(`keine Karte «${kartenId}» unter ${ORDNER.methode}/ oder ${ORDNER.quelle}/`)
  const stellen = fundstellen()[kartenId] ?? []
  console.log(`karten verbraucher ${kartenId} — ${NAME[art]} (${ORDNER[art]}/${kartenId}.json)`)
  druckeVerbraucher(kartenId, stellen)
  if (art === 'methode') { console.log(''); druckeRegelE(kartenId) }
  process.exit(0)
}

if (befehl === 'darf') {
  const art = artVon(kartenId) ?? bad(`keine Karte «${kartenId}» unter ${ORDNER.methode}/ oder ${ORDNER.quelle}/`)
  const stellen = fundstellen()[kartenId] ?? []
  const gebunden = slugsDer(stellen, bindet)
  const publ = slugsDer(stellen, (g) => g === 'publiziert')
  const arch = slugsDer(stellen, (g) => g === 'archiviert')
  const entwurf = slugsDer(stellen, (g) => g === 'entwurf')
  const freiBauplan = bauplaeneZu(kartenId).filter((b) => b.freigegeben).map((b) => b.ordner)
  console.log(`karten darf ${kartenId} — ${NAME[art]}`)
  console.log(`  Verbraucher: ${publ.length} publiziert, ${arch.length} archiviert, ${entwurf.length} Entwurf${freiBauplan.length ? ` · freigegebene Baupläne, die sie nennen: ${freiBauplan.length}` : ''}`)

  if (!gebunden.length) {
    console.log('\n  JA — Fall a: Keine publizierte und keine archivierte Einheit führt die Karte.')
    if (art === 'quelle' && (entwurf.length || freiBauplan.length)) {
      console.log('  Aber Regel d: Die Quelle ist mit dem Bauplan freigegeben. Korrigierbar sind Zeitmarken,')
      console.log('  Wortzahl bzw. Dauer, Prüfdatum und kurzbeschrieb — nie Titel, URL/URN oder der Ausschnitt.')
      console.log('  Eine andere Quelle ist eine neue Karte mit neuer ID.')
    }
    if (entwurf.length) console.log(`  Danach neu prüfen und messen: ${entwurf.join(', ')}`)
    if (art === 'methode') { console.log(''); druckeRegelE(kartenId) }
    process.exit(0)
  }

  console.log(`\n  NEIN — gebunden: ${gebunden.length} Einheit(en) sind publiziert oder archiviert; ihre Hefte sind gedruckt im Umlauf.`)
  if (publ.length) console.log(`    publiziert: ${publ.join(', ')}`)
  if (arch.length) console.log(`    archiviert: ${arch.join(', ')}`)
  if (art === 'methode') {
    console.log('  Erlaubt ist nur:')
    console.log('    Fall b — FEHLER in der Karte (Aussage steht nicht auf der genannten Seite, falsche Seite,')
    console.log('             Rechenfehler, Widerspruch in sich): ändern mit Vermerk in')
    console.log(`             ${ORDNER.methode}/${VERMERK_DATEI}, danach für jeden Verbraucher check-all, Export, Messung.`)
    console.log('    Fall c — PASSUNG (Karte stimmt, passt aber nicht zu einer Einheit): Karte NICHT ändern.')
    console.log('             1. Die Einheit überschreibt (`fuer`, ausnahmsweise `beispiel`).')
    console.log('             2. Reicht das nicht: neue Karte mit eigener ID; die alte bleibt, wie sie ist.')
  } else {
    console.log('  Fall d — Quellenkarte:')
    console.log('    Nie getauscht werden Titel, URL/URN und der Ausschnitt. Eine andere Quelle ist eine neue Karte mit neuer ID.')
    console.log('    Korrigierbar sind Zeitmarken, Wortzahl bzw. Dauer, Prüfdatum und kurzbeschrieb — mit Vermerk in')
    console.log(`    ${ORDNER.quelle}/${VERMERK_DATEI}, danach für jeden Verbraucher check-all, Export, Messung.`)
  }
  console.log('  Im Auto-Modus wird keine bestehende Karte geändert: Ein Fehler in der Karte gehört in den Bericht («offen», Kürzel S).')
  if (art === 'methode') { console.log(''); druckeRegelE(kartenId) }
  process.exit(1)
}

if (befehl === 'warnungen') {
  const alle = fundstellen()
  console.log('karten warnungen — Regel e: feste Zahlen und Formate in `merk` und `schritte` der Methodenkarten\n')
  let n = 0; let k = 0
  for (const id of Object.keys(karten.methode)) {
    const e = new Set((alle[id] ?? []).map((f) => f.slug)).size
    const w = regelE(karten.methode[id])
    if (!w.length) continue
    k++; n += w.length
    console.log(`  ${id}  (${e} Einheit(en)${e >= 2 ? ', geteilt' : ''})`)
    for (const x of w) console.log(`      warnung  KARTE_FESTE_ZAHL  ${x.feld}: ${x.treffer.join(', ')}`)
  }
  console.log(`\n${n} Warnung(en) in ${k} von ${Object.keys(karten.methode).length} Methodenkarten. Warnungen sind nie Fehler.`)
  process.exit(0)
}

// ------------------------------------------------------------ Kartenbelege

const K_FEHLER = 'FEHLER '
const K_WARN = 'warnung'
const K_HINWEIS = 'HINWEIS'
const TEXTFELDER = { methode: ['fuer', 'lesen', 'schritte', 'ankommt', 'beispiel', 'fehler', 'merk'], quelle: ['kurzbeschrieb'] }
// Im Musterbeispiel einer Karte (neutraler, erfundener Fall) zählen nur Artikel, «Stand» und Abstimmungen — wie in check-fakten.
const NUR_IMMER = new Set(['artikel', 'stand', 'abstimmung'])
const kNorm = (x) => String(x ?? '').normalize('NFKC').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim()

/** Text eines Kartenfelds, über den der Hash läuft: die Zeichenkette, oder eine Liste mit Zeilenwechsel verbunden. */
function kartenText(karte, feld) {
  const v = leseFeld(karte, feld)
  if (typeof v === 'string') return v
  if (Array.isArray(v) && v.every((x) => typeof x === 'string')) return v.join('\n')
  return null
}

/**
 * Was an einer Karte belegt sein muss.
 *   belege  Lehrmittelkarte: `lesen` und `merk` sagen, was im Kapitel steht — je eine Belegzeile mit Anker auf einer
 *           Seite aus `seiten`. Eigene Karten (`hko-…`) und Quellenkarten: nichts.
 *   fakten  jede Aussage über die Welt (lib/aussagen.mjs) in einem Textfeld der Karte — je ein Fakt oder eine Belegzeile.
 */
function belegPflicht(art, karte) {
  const belege = art === 'methode' && karte?.quelle === 'lehrmittel' ? ['lesen', 'merk'].filter((f) => typeof karte[f] === 'string' && karte[f].trim()) : []
  const fakten = []
  for (const k of TEXTFELDER[art]) {
    const v = karte?.[k]
    const teile = typeof v === 'string' ? [[k, v]] : Array.isArray(v) ? v.map((x, i) => [`${k}[${i}]`, x]).filter(([, x]) => typeof x === 'string') : []
    for (const [feld, text] of teile) for (const a of findeAussagen(text)) if (k !== 'beispiel' || NUR_IMMER.has(a.art)) fakten.push({ feld, art: a.art, treffer: kNorm(a.treffer) })
  }
  return { belege, fakten }
}

let kapitelCache = null
/**
 * Prüft die Kartenbelege einer Karte. Gibt Feldnamen und Stellen zurück, nie Kartentext oder Anker.
 * @returns {{ datei: boolean, pfad: string, befunde: {art:string, code:string, wo:string, was:string}[], veraltet: number, zeilen: number, lehrmittelFehlt: boolean }}
 */
function pruefeKartenBelege(archivPfad, art, id) {
  const karte = karten[art][id]
  const d = liesKartenBelege(archivPfad, id)
  const rel = `_pruefung/_karten/${id}.json`
  const r = { datei: d.vorhanden, pfad: rel, befunde: [], veraltet: 0, zeilen: 0, lehrmittelFehlt: false, pflicht: belegPflicht(art, karte) }
  const m = (a, code, wo, was) => r.befunde.push({ art: a, code, wo, was })
  if (!d.vorhanden) return r
  if (d.fehler) { m(K_FEHLER, 'KARTE_BELEGE_FORM', rel, 'kein gültiges JSON'); return r }
  const v = validiere(ladeSchema('karte-belege'), d.daten)
  for (const x of v.slice(0, 8)) m(K_FEHLER, 'KARTE_BELEGE_FORM', rel, x)
  if (d.daten?.karte !== id) m(K_FEHLER, 'KARTE_BELEGE_FORM', `${rel} › karte`, `«${d.daten?.karte}» — die Datei gehört nicht zu dieser Karte`)
  if (d.daten?.art !== art) m(K_FEHLER, 'KARTE_BELEGE_FORM', `${rel} › art`, `«${d.daten?.art}», die Karte ist eine ${NAME[art]}`)
  const belege = (Array.isArray(d.daten?.belege) ? d.daten.belege : []).filter((z) => z && typeof z === 'object')
  const fakten = (Array.isArray(d.daten?.fakten) ? d.daten.fakten : []).filter((z) => z && typeof z === 'object')
  r.zeilen = belege.length + fakten.length
  const lm = lehrmittelWurzel({ wurzel })
  kapitelCache ??= new Map()
  const seitenDerKarte = seitenIn(karte?.seiten ?? '')

  for (const z of belege) {
    const wo = `${id} › ${z.feld}`
    const text = typeof z.feld === 'string' ? kartenText(karte, z.feld) : null
    if (text === null) { m(K_FEHLER, 'KARTE_BELEG_OHNE_FELD', wo, 'Belegzeile ohne Feld in der Karte — Feld entfernt oder Pfad verschoben'); continue }
    if (z.hash !== hashText(text)) { r.veraltet++; m(K_FEHLER, 'KARTE_BELEGE_VERALTET', wo, `Karte nach dem Audit geändert (geprüft am ${z.geprueft_am ?? '—'}) — dieses Feld neu prüfen`); continue }
    if (z.urteil === 'falsch' || z.urteil === 'fundstelle_falsch') m(K_FEHLER, 'KARTE_URTEIL', wo, `Urteil «${z.urteil}» — Fehler in der Karte: Regel b (Vermerk, jeden Verbraucher neu prüfen)${z.urteil === 'fundstelle_falsch' ? `; richtig laut Audit: ${z.wo || '—'}, ${z.stelle || '—'}` : ''}`)
    if (!z.anker) continue
    if (z.herkunft === 'lehrmittel') {
      if (!lm.pfad) { r.lehrmittelFehlt = true; continue }
      const datei = String(z.wo ?? '')
      if (karte?.kap && !datei.startsWith(`${karte.kap}_`)) m(K_FEHLER, 'KARTE_STELLE_FALSCH', wo, `Beleg aus «${datei}», die Karte nennt Kap. ${karte.kap}`)
      if (!kapitelCache.has(datei)) kapitelCache.set(datei, existsSync(join(lm.pfad, datei)) ? ladeKapitel(lm.pfad, datei) : null)
      const k = kapitelCache.get(datei)
      if (!k) { m(K_FEHLER, 'KARTE_ANKER_NICHT_IM_TEXT', wo, `Kapiteldatei «${datei}» gibt es nicht unter material/_lehrmittel/`); continue }
      const t = sucheAnkerKapitel(k, z.anker)
      if (!t.treffer.length) { m(K_FEHLER, 'KARTE_ANKER_NICHT_IM_TEXT', wo, `Anker (${t.woerter} Wörter) steht nicht in ${datei}`); continue }
      const sagt = /^S\.\s?(\d+)$/.exec(String(z.stelle ?? '').trim())?.[1]
      const tr = t.treffer.find((x) => sagt !== undefined && x.seite === +sagt)
      if (!tr) { m(K_FEHLER, 'KARTE_STELLE_FALSCH', wo, `Anker steht auf ${t.treffer.map((x) => x.stelle || 'ohne Seite').join(', ')}, die Zeile sagt «${z.stelle || 'leer'}»`); continue }
      if (seitenDerKarte.length && !seitenDerKarte.some((g) => tr.seite >= g.von && tr.seite <= g.bis)) m(K_FEHLER, 'KARTE_SEITE_DANEBEN', wo, `Anker steht auf S. ${tr.seite}, die Karte nennt «${karte.seiten}»`)
    } else if (z.herkunft === 'quelle') {
      const q = karten.quelle[z.wo]
      const t = ladeArchivtext(archivPfad, q ?? String(z.wo ?? ''))
      if (!t.vorhanden) { m(K_FEHLER, 'KARTE_ANKER_NICHT_IM_TEXT', wo, `${z.wo}: ${t.grund || 'kein Archivtext'}`); continue }
      const su = sucheAnker(t, z.anker)
      if (!su.treffer.length) { m(K_FEHLER, 'KARTE_ANKER_NICHT_IM_TEXT', wo, `Anker (${su.woerter} Wörter) steht nicht im Quellentext von ${z.wo}`); continue }
      const sagt = String(z.stelle ?? '').trim()
      if (!su.treffer.some((x) => x.stelle === sagt || (x.zeile.absatz !== null && sagt === `Abs. ${x.zeile.absatz}`))) m(K_FEHLER, 'KARTE_STELLE_FALSCH', wo, `Anker steht bei ${su.treffer.map((x) => x.stelle || 'ohne Marke').join(', ')}, die Zeile sagt «${sagt || 'leer'}»`)
    }
  }
  for (const [i, z] of fakten.entries()) {
    const wo = `${id} › ${z.feld}`
    const text = typeof z.feld === 'string' ? kartenText(karte, z.feld) : null
    if (text === null) { m(K_FEHLER, 'KARTE_BELEG_OHNE_FELD', wo, `Fakt ${i + 1} ohne Feld in der Karte`); continue }
    if (!kNorm(text).includes(kNorm(z.wortlaut_in_der_karte))) { r.veraltet++; m(K_FEHLER, 'KARTE_BELEGE_VERALTET', wo, `Fakt ${i + 1}: der Wortlaut steht nicht mehr im Feld — Karte nach dem Audit geändert, neu prüfen`); continue }
    if (z.urteil === 'abweichend' || z.urteil === 'nicht_belegbar') m(K_FEHLER, 'KARTE_URTEIL', wo, `Fakt ${i + 1}: Urteil «${z.urteil}» — Fehler in der Karte: Regel b`)
  }
  // Was noch keine Zeile hat.
  const belegt = new Set(belege.map((z) => z.feld))
  for (const f of r.pflicht.belege) if (!belegt.has(f)) m(K_WARN, 'KARTE_BELEG_FEHLT', `${id} › ${f}`, 'sagt, was im Kapitel steht — keine Belegzeile')
  for (const a of r.pflicht.fakten) {
    const hat = belegt.has(a.feld) || fakten.some((z) => z.feld === a.feld && kNorm(z.wortlaut_in_der_karte).includes(a.treffer))
    if (!hat) m(K_WARN, 'KARTE_BELEG_FEHLT', `${id} › ${a.feld}`, `Aussage der Art ${a.art} ohne Fakt und ohne Belegzeile`)
  }
  return r
}

if (befehl === 'belege') {
  const archiv = archivWurzel({ wurzel })
  if (!archiv.pfad) {
    console.log(`karten belege\n  HINWEIS Quellenarchiv fehlt lokal (${archiv.grund}) — Kartenbelege NICHT geprüft.\n\nNICHT GEPRUEFT — ohne Archiv gibt es keine Kartenbelege.`)
    process.exit(2)
  }
  let liste
  if (kartenId) { const art = artVon(kartenId) ?? bad(`keine Karte «${kartenId}» unter ${ORDNER.methode}/ oder ${ORDNER.quelle}/`); liste = [[art, kartenId]] }
  else liste = Object.keys(karten.methode).map((id) => ['methode', id])
  console.log(`karten belege — ${liste.length} Karte(n) · ${archiv.pfad.replace(/\\/g, '/')}/_pruefung/_karten/\n`)
  const alle = []
  let ohne = 0; let lmFehlt = false
  for (const [art, id] of liste) {
    const r = pruefeKartenBelege(archiv.pfad, art, id)
    const pf = [...r.pflicht.belege, ...new Set(r.pflicht.fakten.map((a) => a.feld))]
    if (!r.datei) { ohne++; console.log(`  —        ${id}  nicht belegt${pf.length ? ` · zu belegen: ${[...new Set(pf)].join(', ')}` : ' · nichts zu belegen (kein Lehrmittelbezug, keine Aussage über die Welt)'}`); continue }
    lmFehlt ||= r.lehrmittelFehlt
    const f = r.befunde.filter((b) => b.art === K_FEHLER).length
    console.log(`  ${f ? 'FEHLER  ' : 'ok      '} ${id}  ${r.zeilen} Zeile(n), ${r.veraltet} veraltet`)
    for (const b of r.befunde) console.log(`      ${b.art}  ${b.code}  ${b.wo}\n               ${b.was}`)
    alle.push(...r.befunde)
  }
  if (ohne) console.log(`\n  ${K_HINWEIS}  KARTE_BELEGE_FEHLEN  ${ohne} von ${liste.length} Karte(n) ohne Datei unter _pruefung/_karten/ — nicht belegt (Karten-Audit: references/audits.md der Skill)`)
  if (lmFehlt) console.log(`  ${K_HINWEIS}  Lehrmittel fehlt lokal — Anker mit Herkunft «lehrmittel» sind NICHT geprüft.`)
  const nF = alle.filter((b) => b.art === K_FEHLER).length
  const nW = alle.filter((b) => b.art === K_WARN).length
  console.log(`\n${nF ? `ROT — ${nF} Fehler, ${nW} Warnung(en).` : lmFehlt ? `NICHT GEPRUEFT — Lehrmittel fehlt lokal; keine Fehler in dem, was prüfbar war, ${nW} Warnung(en).` : `GRUEN — keine Fehler in den vorhandenen Kartenbelegen, ${nW} Warnung(en); ${ohne} Karte(n) nicht belegt.`}`)
  process.exit(nF ? 1 : lmFehlt ? 2 : 0)
}

// --------------------------------------------------------------- geaendert

function git(repo, args, input) {
  const r = spawnSync('git', args, { cwd: repo, input, maxBuffer: 256 * 1024 * 1024 })
  if (r.error) bad(`git nicht ausführbar (${r.error.message}) — ohne Git gibt es keinen Vergleichsstand.`)
  return { ok: r.status === 0, out: r.stdout ?? Buffer.alloc(0), err: (r.stderr ?? '').toString().trim() }
}
const norm = (p) => resolve(p).replace(/\\/g, '/').replace(/\/$/, '').toLowerCase()

// Vergleichsstand: aus dem Baum selbst, wenn er ein eigenes Git-Repo ist — sonst aus dem Repo dieses Skripts.
let repo = SKRIPT_REPO
{
  const top = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: wurzel, encoding: 'utf8' })
  if (top.error) bad(`git nicht ausführbar (${top.error.message}) — ohne Git gibt es keinen Vergleichsstand.`)
  if (top.status === 0 && norm(top.stdout.trim()) === norm(wurzel)) repo = wurzel
}
const stand = git(repo, ['rev-parse', '--verify', '--quiet', `${gegen}^{commit}`])
if (!stand.ok) {
  console.error(`karten: Vergleichsstand «${gegen}» ist in ${repo} nicht lesbar — nichts verglichen, kein «GRUEN».`)
  console.error(gegen.startsWith('origin/') ? '        Hinweis: git fetch origin main' : '        Hinweis: Commit, Branch oder Tag prüfen.')
  process.exit(2)
}
const standKurz = stand.out.toString().trim().slice(0, 7)

/** Alle JSON-Dateien der zwei Kartenordner im Vergleichsstand: Pfad → geparster Inhalt. */
function vergleichsstand() {
  const ls = git(repo, ['ls-tree', '-r', '-z', '--name-only', gegen, '--', ORDNER.methode, ORDNER.quelle])
  if (!ls.ok) bad(`git ls-tree ${gegen}: ${ls.err}`)
  const pfade = ls.out.toString('utf8').split('\0').filter((p) => p.endsWith('.json'))
  if (!pfade.length) return {}
  const cat = git(repo, ['cat-file', '--batch'], pfade.map((p) => `${gegen}:${p}`).join('\n') + '\n')
  if (!cat.ok) bad(`git cat-file: ${cat.err}`)
  const out = {}
  let o = 0
  for (const p of pfade) {
    const nl = cat.out.indexOf(0x0a, o)
    const kopf = cat.out.subarray(o, nl).toString('utf8')
    const m = /^[0-9a-f]+ blob (\d+)$/.exec(kopf)
    if (!m) bad(`git cat-file lieferte für ${p} «${kopf}»`)
    const ende = nl + 1 + Number(m[1])
    try { out[p] = JSON.parse(cat.out.subarray(nl + 1, ende).toString('utf8').replace(/^﻿/, '')) } catch (e) { bad(`${gegen}:${p} ist kein JSON: ${e.message}`) }
    o = ende + 1
  }
  return out
}

const kanon = (x) => (Array.isArray(x) ? x.map(kanon) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, kanon(x[k])])) : x)
const gleich = (a, b) => JSON.stringify(kanon(a)) === JSON.stringify(kanon(b))

const alt = vergleichsstand()
const altKarten = { methode: {}, quelle: {} }
const altVermerke = { methode: [], quelle: [] }
for (const [p, j] of Object.entries(alt)) {
  const art = p.startsWith(ORDNER.methode + '/') ? 'methode' : 'quelle'
  const datei = p.split('/').pop()
  if (datei === VERMERK_DATEI) altVermerke[art] = Array.isArray(j) ? j : []
  else if (!datei.startsWith('_')) altKarten[art][datei.replace(/\.json$/, '')] = j
}

const befunde = []
const FEHLER = 'FEHLER '
const WARN = 'warnung'
const melde = (art, code, wo, was) => befunde.push({ art, code, wo, was })

// Vermerke lesen und prüfen
const vermerke = { methode: [], quelle: [] }
for (const art of ['methode', 'quelle']) {
  const p = join(wurzel, ORDNER[art], VERMERK_DATEI)
  const wo = `${ORDNER[art]}/${VERMERK_DATEI}`
  if (!existsSync(p)) continue
  let j
  try { j = JSON.parse(readFileSync(p, 'utf8')) } catch (e) { melde(FEHLER, 'KARTE_VERMERK_FORM', wo, `kein JSON: ${e.message}`); continue }
  if (!Array.isArray(j)) { melde(FEHLER, 'KARTE_VERMERK_FORM', wo, 'muss ein Array sein (leer: [])'); continue }
  j.forEach((v, i) => {
    const w = `${wo} › [${i}]`
    const maengel = []
    if (typeof v?.karte !== 'string' || !v.karte) maengel.push('`karte` fehlt')
    else if (!karten[art][v.karte] && !altKarten[art][v.karte]) maengel.push(`\`karte\` «${v.karte}» — keine ${NAME[art]}`)
    if (typeof v?.datum !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v.datum)) maengel.push('`datum` ist nicht JJJJ-MM-TT')
    if (v?.art !== 'fehler') maengel.push('`art` ist nicht "fehler" — nur ein Fehler erlaubt die Änderung einer gebundenen Karte')
    if (typeof v?.beleg !== 'string' || v.beleg.trim().length < 10) maengel.push('`beleg` fehlt (Fundstelle: Kapitel und Seite, Bericht, Primärquelle — kein Zitat)')
    if (!Array.isArray(v?.verbraucher) || v.verbraucher.some((s) => typeof s !== 'string')) maengel.push('`verbraucher` ist keine Liste von Ordnernamen')
    if (maengel.length) melde(FEHLER, 'KARTE_VERMERK_FORM', w, maengel.join('; '))
    else vermerke[art].push(v)
  })
}
const neueVermerke = (art, id) => vermerke[art].filter((v) => v.karte === id && !altVermerke[art].some((a) => gleich(a, v)))

// Karten vergleichen
const alleStellen = fundstellen([...Object.keys(altKarten.methode), ...Object.keys(altKarten.quelle)])
const zeilen = []
const zahl = { neu: 0, geaendert: 0, geloescht: 0 }
const neueMethoden = []

for (const art of ['methode', 'quelle']) {
  const wo = (id) => `${ORDNER[art]}/${id}.json`
  for (const id of Object.keys(karten[art])) {
    if (!(id in altKarten[art])) { zahl.neu++; if (art === 'methode') neueMethoden.push(id) }
  }
  for (const [id, vorher] of Object.entries(altKarten[art])) {
    const jetzt = karten[art][id]
    const stellen = alleStellen[id] ?? []
    const gebunden = slugsDer(stellen, bindet)
    const entwurf = slugsDer(stellen, (g) => g === 'entwurf')
    const verbraucherText = `${slugsDer(stellen, (g) => g === 'publiziert').length} publiziert, ${slugsDer(stellen, (g) => g === 'archiviert').length} archiviert, ${entwurf.length} Entwurf`

    if (jetzt === undefined) {
      zahl.geloescht++
      zeilen.push(`  gelöscht  ${id}  (${NAME[art]}; ${verbraucherText})`)
      if (gebunden.length) melde(FEHLER, 'KARTE_GELOESCHT', wo(id), `gelöscht oder umbenannt, aber geführt von ${gebunden.join(', ')} — eine Karte, die ein publiziertes Heft führt, bleibt`)
      else melde(WARN, 'KARTE_GELOESCHT', wo(id), `gelöscht oder umbenannt${entwurf.length ? `; Entwürfe, die sie führen: ${entwurf.join(', ')}` : ''}`)
      continue
    }
    if (gleich(vorher, jetzt)) continue
    zahl.geaendert++
    const felder = [...new Set([...Object.keys(vorher), ...Object.keys(jetzt)])].filter((k) => !gleich(vorher[k], jetzt[k]))
    zeilen.push(`  geändert  ${id}  (${NAME[art]}; Felder: ${felder.join(', ')}; ${verbraucherText})`)
    if (gebunden.length) zeilen.push(`            gebunden durch: ${gebunden.join(', ')}`)
    if (entwurf.length) zeilen.push(`            Entwürfe, neu zu messen: ${entwurf.join(', ')}`)

    const inhalt = art === 'quelle' ? felder.filter((k) => Q_INHALT.includes(k)) : []
    if (!gebunden.length) {
      // Fall a. Bei Quellenkarten bleibt Regel d als Warnung stehen.
      if (inhalt.length && (stellen.length || bauplaeneZu(id).some((b) => b.freigegeben))) melde(WARN, 'KARTE_INHALT_GETAUSCHT', wo(id), `${inhalt.join(', ')} geändert — nach der Freigabe des Bauplans ist eine andere Quelle eine neue Karte (Regel d)`)
      continue
    }
    if (inhalt.length) {
      melde(FEHLER, 'KARTE_INHALT_GETAUSCHT', wo(id), `${inhalt.join(', ')} geändert an einer Karte, die ${gebunden.join(', ')} führt — der Inhalt einer Quellenkarte wird nie getauscht; eine andere Quelle ist eine neue Karte mit neuer ID (Regel d). Ein Vermerk hebt das nicht auf.`)
      continue
    }
    const v = neueVermerke(art, id)
    if (!v.length) {
      melde(FEHLER, 'KARTE_OHNE_VERMERK', wo(id), `geändert (${felder.join(', ')}), geführt von ${gebunden.join(', ')} — kein neuer Vermerk in ${ORDNER[art]}/${VERMERK_DATEI}. Passung: Karte zurücksetzen, die Einheit überschreibt oder bekommt eine neue Karte (Regel c). Fehler: Vermerk eintragen (Regel b).`)
      continue
    }
    const genannt = new Set(v.flatMap((x) => x.verbraucher))
    const fehlt = gebunden.filter((s) => !genannt.has(s))
    if (fehlt.length) { melde(FEHLER, 'KARTE_VERMERK_VERBRAUCHER', wo(id), `der Vermerk nennt nicht jeden gebundenen Verbraucher — es fehlt: ${fehlt.join(', ')}`); continue }
    const fehltEntwurf = entwurf.filter((s) => !genannt.has(s))
    if (fehltEntwurf.length) melde(WARN, 'KARTE_VERMERK_VERBRAUCHER', wo(id), `der Vermerk nennt die Entwürfe nicht: ${fehltEntwurf.join(', ')} — auch sie werden neu gemessen`)
    if (art === 'quelle' && felder.includes('verortung')) melde(WARN, 'KARTE_VERORTUNG', wo(id), 'verortung geändert — zulässig als Korrektur der Marken; ein anderer Ausschnitt ist eine neue Karte (Regel d). Der Beleg des Vermerks sagt, welches von beiden.')
    zeilen.push(`            mit Vermerk vom ${v.map((x) => x.datum).join(', ')} — jetzt für jeden Verbraucher: check-all, Export, Messung; bei sichtbarer Änderung bestand-v42 neu schreiben`)
  }
}

// Kartenbelege (E38 Stufe D): Eine Karte, deren Text sich seit ihrem Audit geändert hat, macht ihre Belege ungültig.
// Gelesen wird jede Datei unter _pruefung/_karten/ — unabhängig vom Vergleichsstand: Der Hash gilt gegen heute.
let kartenBelegZeile = ''
{
  const archiv = archivWurzel({ wurzel })
  if (!archiv.pfad) kartenBelegZeile = '  HINWEIS Kartenbelege: Quellenarchiv fehlt lokal — NICHT geprüft (node scripts/karten.mjs belege).'
  else {
    let dateien = 0; let veraltet = 0
    for (const art of ['methode', 'quelle']) for (const id of Object.keys(karten[art])) {
      const d = liesKartenBelege(archiv.pfad, id)
      if (!d.vorhanden) continue
      dateien++
      const r = pruefeKartenBelege(archiv.pfad, art, id)
      if (!r.veraltet) continue
      veraltet += r.veraltet
      const felder = [...new Set(r.befunde.filter((b) => b.code === 'KARTE_BELEGE_VERALTET').map((b) => b.wo.split(' › ')[1]))]
      melde(WARN, 'KARTE_BELEGE_VERALTET', `${ORDNER[art]}/${id}.json`, `${r.veraltet} Zeile(n) der Kartenbelege passen nicht mehr zum Text der Karte (${felder.join(', ')}) — diese Felder neu prüfen: node scripts/karten.mjs belege ${id}`)
    }
    kartenBelegZeile = `  Kartenbelege unter _pruefung/_karten/: ${dateien} Datei(en), ${veraltet} Zeile(n) veraltet`
  }
}

// Ausgabe
console.log(`karten geaendert — gegen ${gegen} (${standKurz})${repo === wurzel ? '' : ` · Vergleichsstand aus ${repo}`}`)
console.log(`  ${Object.keys(karten.methode).length} Methodenkarten, ${Object.keys(karten.quelle).length} Quellenkarten · neu: ${zahl.neu} · geändert: ${zahl.geaendert} · gelöscht: ${zahl.geloescht}`)
console.log(kartenBelegZeile)
if (zeilen.length) console.log('\n' + zeilen.join('\n'))

// Regel e nur für geänderte und neue Methodenkarten — der Bestand: `karten.mjs warnungen`.
const fuerRegelE = [...neueMethoden, ...Object.keys(altKarten.methode).filter((id) => karten.methode[id] && !gleich(altKarten.methode[id], karten.methode[id]))]
for (const id of fuerRegelE) for (const x of regelE(karten.methode[id])) melde(WARN, 'KARTE_FESTE_ZAHL', `${ORDNER.methode}/${id}.json › ${x.feld}`, `${x.treffer.join(', ')} — Zahlen und Formate nennt die Einheit, nicht die Karte (Regel e)`)

befunde.sort((a, b) => (a.art === FEHLER ? 0 : 1) - (b.art === FEHLER ? 0 : 1))
if (befunde.length) console.log('')
for (const b of befunde) console.log(`  ${b.art}  ${b.code}  ${b.wo}\n           ${b.was}`)

const nF = befunde.filter((b) => b.art === FEHLER).length
const nW = befunde.length - nF
console.log(`\n${nF ? `ROT — ${nF} Fehler, ${nW} Warnung(en).` : `GRUEN — keine gebundene Karte ohne Vermerk geändert, ${nW} Warnung(en).`}`)
process.exit(nF ? 1 : 0)
