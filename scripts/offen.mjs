#!/usr/bin/env node
/**
 * offen.mjs — stehen die offenen Punkte der Laufberichte in docs/cloud-run/OFFEN.md?
 *
 *   node scripts/offen.mjs                       # alle Laufordner unter docs/cloud-run/laeufe/
 *   node scripts/offen.mjs <laufordner> [...]    # nur diese (Name oder Pfad)
 *   … --liste                                    # je Bericht: erkannte Punkte und wo sie in OFFEN.md stehen
 *   … --riegel                                   # nur den Start-Riegel pruefen (references/lauf.md §3 Zeile 9)
 *   … --messen                                   # Verteilung der besten Ueberlappung (Treffer gegen Gegenprobe)
 *   … --wurzel <ordner>                          # anderer Baum statt dieses Repos (Gegenproben, Tests)
 *
 * Was gelesen wird.
 *   OFFEN.md: die Tabellen «Alle offenen Punkte», «Erledigt, belegt», «Im Lauf hingenommen»,
 *   «Doppelt geführt». Ein Punkt, der in einer davon steht, «fehlt» nicht.
 *   Berichte: in BERICHT.md, NACHTRAG.md, ENTSCHEIDE.md jeder Laufordner jeder Abschnitt, dessen
 *   Ueberschrift auf /\boffen(e[nrs]?)?\b/i passt (neue Berichte: «## 10. Offen» nach
 *   .claude/skills/bbw-hko-heft-v42/assets/bericht-template.md). Ueberschriften mit «entschieden»
 *   («… vier offene Punkte entschieden») sind Rueckblicke und zaehlen nicht. Der Abschnitt reicht bis
 *   zur naechsten Ueberschrift gleicher oder hoeherer Ebene. Ein Punkt ist ein Listenpunkt (-, *, 1.),
 *   eine Tabellenzeile oder — nur wenn der Abschnitt weder Liste noch Tabelle hat — ein Absatz;
 *   eingerueckte Zeilen und Unterpunkte gehoeren zum Punkt. Tabellenzeilen mit Stand
 *   «behoben» / «erledigt» / «entschieden am» sind abgeschlossen und werden nicht verlangt;
 *   die Tabelle «Feldpfad» (Suche nach derselben Stelle) und leere Vorlagenzeilen sind keine Punkte.
 *
 * Entscheidung je Punkt, in dieser Reihenfolge.
 *   a) Der Punkt nennt eine ID O-nnnn: gibt es sie in OFFEN.md → gefunden, sonst OFFEN_ID_UNBEKANNT.
 *      (Weg fuer neue Berichte: Lauf traegt die Punkte in OFFEN.md ein und nennt die ID im Bericht.)
 *   b) Sonst: eine Zeile von OFFEN.md, deren Fundstelle (oder Beleg) dieselbe Berichtsdatei nennt,
 *      teilt genuegend Woerter mit dem Punkt (Normalisierung: klein, ohne Satzzeichen, Stoppwoerter
 *      weg, Woerter auf die ersten 6 Buchstaben gekuerzt; Mass = geteilte Woerter / Woerter der
 *      OFFEN-Zeile; Schwelle SCHWELLE_ANTEIL und MIN_GETEILT unten, begruendet und gemessen mit --messen).
 *   c) Sonst OFFEN_PUNKT_FEHLT.
 *
 * Codes.
 *   OFFEN_PUNKT_FEHLT  ein offener Punkt eines Berichts steht nicht in OFFEN.md        Fehler
 *   OFFEN_ID_UNBEKANNT ein Bericht nennt eine ID O-nnnn, die OFFEN.md nicht kennt       Fehler
 *   OFFEN_FORM         Zeile der vollen Tabelle: nicht 8 Spalten, ID doppelt oder nicht O-nnnn,
 *                      Art nicht aus E S K R P Q H D F, wer nicht Pietro | Session,
 *                      Stand leer, seit nicht JJJJ-MM-TT                                 Fehler
 *   OFFEN_RIEGEL       Zeile Art S/P, Stand ^(offen|braucht Entscheid)\b, «[erzeugt Fehler]»
 *                      im Punkt: ein Lauf darf nicht starten (Fehler nur mit --riegel)
 *   HINWEIS            Bericht ohne Abschnitt «offen», Laufordner ohne Bericht, uebergangene
 *                      Rueckblick-Abschnitte                                              kein Fehler
 *
 * Exit 0  alles steht in OFFEN.md (bzw. mit --riegel: kein Riegel)
 * Exit 1  mindestens ein Fehler
 * Exit 2  OFFEN.md oder Laufordner fehlen, Aufruf falsch
 *
 * Reines Node, keine Abhaengigkeiten, nur lesend. Die Ausgabe nennt nur eigenen Berichtstext
 * (die ersten zwoelf Woerter eines Punkts), keine Quellen- oder Lehrmitteltexte.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

// ------------------------------------------------------------------ Schwelle
//
// Gemessen mit `--messen` an den 16 vorhandenen Berichten (167 Punkte): Beste Ueberlappung gegen Zeilen derselben
// Berichtsdatei 82 Punkte >= 0.9, 110 erreichen die Schwelle; gegen Zeilen desselben Laufordners (Punkte wandern
// zwischen BERICHT und NACHTRAG, und «erledigt»-Zeilen nennen nur den Beleg) 120 >= 0.9, 152 erreichen sie. Die Verteilung
// ist zweigipflig (viele um 0.9–1.0, Rest verstreut unter 0.5): 0.5 liegt im Tal. Die Gegenprobe «Zeilen anderer Berichte»
// liegt mit Gipfel bei 0.5–0.6 — aber dort stehen dieselben Mängel in anderen Einheiten wirklich (gleiche Karte, gleicher
// Renderer-Text), das ist kein Fehltreffer. Fuer erfundene Punkte siehe die Gegenprobe im Auftrag: sie teilen nur
// Allerweltswoerter (Heft, Karte, Seite sind Stoppwoerter oder zu kurz) und bleiben unter 3 geteilten Woertern.
// Daher: Ordner-Zuordnung, Anteil >= 0.5, mindestens min(4, Woerter beider Seiten) und nie weniger als 3 geteilte Woerter.
const SCHWELLE_ANTEIL = 0.5
const MIN_GETEILT = 4

// ------------------------------------------------------------------- Aufruf

const argv = process.argv.slice(2)
let wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
let LISTE = false
let RIEGEL = false
let MESSEN = false
const wunsch = []
const bad = (m) => { console.error(`offen: ${m}`); process.exit(2) }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--wurzel') wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
  else if (a === '--liste') LISTE = true
  else if (a === '--riegel') RIEGEL = true
  else if (a === '--messen') MESSEN = true
  else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}\nusage: node scripts/offen.mjs [<laufordner>…] [--liste] [--riegel] [--messen] [--wurzel <ordner>]`)
  else wunsch.push(basename(a.replace(/[\\/]+$/, '')))
}

const OFFEN = join(wurzel, 'docs/cloud-run/OFFEN.md')
const LAUF = join(wurzel, 'docs/cloud-run/laeufe')
if (!existsSync(OFFEN)) bad(`OFFEN.md fehlt: ${OFFEN}`)
if (!existsSync(LAUF)) bad(`Laufordner fehlen: ${LAUF}`)
const laufDirs = readdirSync(LAUF, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
const unbekannt = wunsch.filter((n) => !laufDirs.includes(n))
if (unbekannt.length) bad(`kein Laufordner ${unbekannt.join(', ')} unter docs/cloud-run/laeufe/`)
const umfang = wunsch.length ? wunsch : laufDirs

// ---------------------------------------------------------------- Hilfsmittel

const zellen = (z) => {
  const t = z.trim().replace(/^\|/, '').replace(/\|$/, '')
  const out = []
  let cur = ''
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '\\' && t[i + 1] === '|') { cur += '|'; i++ }
    else if (t[i] === '|') { out.push(cur.trim()); cur = '' }
    else cur += t[i]
  }
  out.push(cur.trim())
  return out
}
const istTrenner = (z) => /^\|?\s*:?-{2,}/.test(z.trim()) && /^[\s|:\-]+$/.test(z)
const plain = (s) => s.replace(/`/g, '').replace(/\*\*|__|~~/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim()

const STOP = new Set(('aber alle allen aller alles also auch auf aus bei beim bein bereits dann dass dazu dem den der des die dies diese diesem diesen dieser dieses doch durch ein eine einem einen einer eines einen erst fuer für gibt habe haben hat hier hinter ihre immer ist kann keine keinen keiner koennen können man mehr mit nach nicht noch nur oder ohne sich sind sonst soll sollte sowie statt steht stehen ueber über und uns unter vom von vor waere wäre war wegen weil wenn werden wird wie wir wird wurde wurden zum zur zwei drei vier fuenf fünf sehr schon dort bleibt bleiben ganz genau ersten zweiten dritten heft einheit bericht seite abschnitt punkt befund lauf').split(/\s+/))
const woerter = (s) => {
  const out = new Set()
  for (const w of plain(s).toLowerCase().replace(/[^a-zäöüß0-9]+/g, ' ').split(' ')) {
    if (!w) continue
    const hatZiffer = /\d/.test(w)
    if (w.length < (hatZiffer ? 3 : 4)) continue
    if (STOP.has(w)) continue
    out.add(w.slice(0, 6))
  }
  return out
}
const ersteWorte = (s, n = 12) => plain(s).split(' ').slice(0, n).join(' ')

// ---------------------------------------------------------------- OFFEN.md lesen

const offenText = readFileSync(OFFEN, 'utf8').split(/\r?\n/)
const tabellen = { offen: [], erledigt: [], hingenommen: [], doppelt: [] }
{
  let ziel = null
  for (let i = 0; i < offenText.length; i++) {
    const z = offenText[i]
    const h = /^##\s+(.*)$/.exec(z)
    if (h) {
      const t = h[1].toLowerCase()
      ziel = /^alle offenen punkte/.test(t) ? 'offen' : /^erledigt, belegt/.test(t) ? 'erledigt' : /^im lauf hingenommen/.test(t) ? 'hingenommen' : /^doppelt gef/.test(t) ? 'doppelt' : null
      continue
    }
    if (!ziel || !z.trim().startsWith('|') || istTrenner(z)) continue
    const c = zellen(z)
    if (/^ID$/i.test(c[0])) continue
    tabellen[ziel].push({ zeile: i + 1, zellen: c, tabelle: ziel })
  }
}
const alleZeilen = Object.values(tabellen).flat()

// Fundstellen: laeufe/<ordner>/<DATEI>.md; ein nacktes «NACHTRAG.md» erbt den letzten Ordner derselben Zeile.
const zitate = (text) => {
  const out = new Set()
  const re = /(?:docs\/cloud-run\/)?laeufe\/([^\/\s;,()]+)\/([A-Za-z0-9_.\-]+\.md)|\b(BERICHT|NACHTRAG|ENTSCHEIDE)\.md\b/g
  let m
  let letzterOrdner = null
  while ((m = re.exec(text))) {
    if (m[1]) { letzterOrdner = m[1]; out.add(`${m[1]}/${m[2]}`) }
    else if (letzterOrdner) out.add(`${letzterOrdner}/${m[3]}.md`)
  }
  return out
}
const ids = new Map() // ID -> Zeile
const formFehler = []
for (const t of alleZeilen) {
  const id = t.zellen[0]
  t.id = id
  t.punkt = t.zellen[3] ?? ''
  t.woerter = woerter(t.punkt)
  t.zitate = zitate(t.zellen.slice(4).join(' | '))
  t.ordner = new Set([...t.zitate].map((x) => x.split('/')[0]))
  if (/^O-\d{4}$/.test(id)) {
    if (ids.has(id)) formFehler.push({ id, was: `ID doppelt (Zeilen ${ids.get(id).zeile} und ${t.zeile} von OFFEN.md)`, zeile: t.zeile })
    else ids.set(id, t)
  }
}

// ---------------------------------------------------- Formpruefung der vollen Tabelle

for (const t of tabellen.offen) {
  const c = t.zellen
  const f = (was) => formFehler.push({ id: c[0] || '(ohne ID)', was, zeile: t.zeile })
  if (c.length !== 8) { f(`${c.length} statt 8 Spalten (ID · Einheit · Art · Punkt · Fundstelle · wer · Stand · seit)`); continue }
  if (!/^O-\d{4}$/.test(c[0])) f(`ID «${c[0]}» hat nicht die Form O-nnnn`)
  if (!/^[ESKRPQHDF]$/.test(c[2])) f(`Art «${c[2]}» ist keine aus E S K R P Q H D F`)
  if (!c[3]) f('Punkt leer')
  if (!/^(Pietro|Session)$/.test(c[5])) f(`wer «${c[5]}» — Pietro oder Session; kein Punkt ohne «wer»`)
  if (!c[6]) f('Stand leer')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c[7])) f(`seit «${c[7]}» ist kein Datum JJJJ-MM-TT`)
}

// -------------------------------------------------------------- Start-Riegel

const riegel = tabellen.offen.filter((t) => t.zellen.length === 8 && /^[SP]$/.test(t.zellen[2]) && /^(offen|braucht Entscheid)\b/.test(t.zellen[6]) && t.zellen[3].includes('[erzeugt Fehler]'))

// ----------------------------------------------------------- Berichte lesen

const DATEIEN = ['BERICHT.md', 'NACHTRAG.md', 'ENTSCHEIDE.md']
const RE_OFFEN = /\boffen(e[nrs]?)?\b/i
const RE_RUECKBLICK = /entschieden/i

/** Zerlegt einen Abschnitt (Zeilen ohne Ueberschrift) in Punkte. */
function punkteAus(zeilen) {
  const punkte = []
  const bloecke = []
  let strukturen = 0
  const itemRe = /^(\s*)([-*+]|\d{1,2}[.)])\s+(.*)$/
  const itemZeilen = zeilen.map((z) => itemRe.exec(z))
  const basis = Math.min(...itemZeilen.filter(Boolean).map((m) => m[1].length), Infinity)
  let aktuell = null
  let tabelle = null // { kopf: [...], stand: idx, punkt: idx, ueberspringen }
  let vorherLeer = true
  const schliesse = () => { if (aktuell) { punkte.push(aktuell); aktuell = null } }
  let absatz = []
  const schliesseAbsatz = () => {
    if (absatz.length) {
      const text = absatz.join(' ')
      if (!/^\**[^.!?]{0,120}:\**$/.test(plain(text))) bloecke.push({ text, art: 'absatz' })
      absatz = []
    }
  }
  for (let i = 0; i < zeilen.length; i++) {
    const z = zeilen[i]
    if (!z.trim()) { vorherLeer = true; tabelle = tabelle && z.trim().startsWith('|') ? tabelle : null; continue }
    if (z.trim().startsWith('|')) {
      schliesse(); schliesseAbsatz()
      if (!tabelle) {
        const kopf = zellen(z)
        tabelle = { kopf, stand: kopf.findIndex((x) => /^stand$/i.test(x)), punkt: kopf.findIndex((x) => /^punkt\b/i.test(x)), skip: kopf.some((x) => /^feldpfad$/i.test(x)), kopfZeile: true }
        strukturen++
        continue
      }
      if (istTrenner(z)) continue
      if (tabelle.skip) continue
      const c = zellen(z)
      const text = tabelle.punkt >= 0 ? (c[tabelle.punkt] ?? '') : c.filter((x) => !/^\d+$/.test(x)).join(' ')
      if (!plain(text)) continue // Vorlagenzeile
      const stand = tabelle.stand >= 0 ? (c[tabelle.stand] ?? '') : ''
      punkte.push({ text, art: 'tabelle', stand })
      continue
    }
    tabelle = null
    const m = itemZeilen[i]
    if (m && m[1].length === basis) {
      schliesse(); schliesseAbsatz()
      aktuell = { text: m[3], art: 'liste' }
      strukturen++
      vorherLeer = false
      continue
    }
    if (aktuell) {
      // Fortsetzung oder Unterpunkt — ausser ein nicht eingerueckter Absatz nach Leerzeile
      if (vorherLeer && /^\S/.test(z)) { schliesse(); absatz.push(z.trim()) }
      else aktuell.text += ' ' + z.trim()
    } else absatz.push(z.trim())
    vorherLeer = false
  }
  schliesse(); schliesseAbsatz()
  const echte = punkte.length
  return { punkte: echte || strukturen ? punkte : bloecke, strukturen }
}

function berichtLesen(ordner, datei) {
  const pfad = join(LAUF, ordner, datei)
  if (!existsSync(pfad)) return null
  const zeilen = readFileSync(pfad, 'utf8').split(/\r?\n/)
  const abschnitte = []
  const uebergangen = []
  let i = 0
  let imCodeblock = false
  const ueberschriften = []
  zeilen.forEach((z, n) => {
    if (/^```/.test(z)) imCodeblock = !imCodeblock
    if (imCodeblock) return
    const h = /^(#{1,6})\s+(.*)$/.exec(z)
    if (h) ueberschriften.push({ n, ebene: h[1].length, titel: h[2].trim() })
  })
  let bis = -1
  for (let k = 0; k < ueberschriften.length; k++) {
    const u = ueberschriften[k]
    if (u.n <= bis || !RE_OFFEN.test(u.titel)) continue
    if (RE_RUECKBLICK.test(u.titel)) { uebergangen.push(u.titel); continue }
    const naechste = ueberschriften.slice(k + 1).find((x) => x.ebene <= u.ebene)
    const ende = naechste ? naechste.n : zeilen.length
    bis = ende
    const { punkte } = punkteAus(zeilen.slice(u.n + 1, ende))
    abschnitte.push({ titel: u.titel, zeile: u.n + 1, ende, punkte })
  }
  // Fettes Etikett am Zeilenanfang («**Offen nach drei Runden** …»): so schreiben die alten Berichte ihre Liste.
  // Der Block reicht bis zur naechsten Ueberschrift oder zum naechsten Etikett am Zeilenanfang.
  const belegt = abschnitte.map((x) => [x.zeile - 1, x.ende])
  imCodeblock = false
  for (let n = 0; n < zeilen.length; n++) {
    if (/^```/.test(zeilen[n])) imCodeblock = !imCodeblock
    if (imCodeblock || !/^\*\*offen\b/i.test(zeilen[n]) || belegt.some(([von, bis2]) => n >= von && n < bis2)) continue
    let ende = n + 1
    while (ende < zeilen.length && !/^#{1,6}\s/.test(zeilen[ende]) && !/^\*\*/.test(zeilen[ende])) ende++
    abschnitte.push({ titel: plain(zeilen[n]).slice(0, 80), zeile: n + 1, ende, punkte: punkteAus(zeilen.slice(n + 1, ende)).punkte })
  }
  abschnitte.sort((x, y) => x.zeile - y.zeile)
  void i
  return { abschnitte, uebergangen }
}

// ---------------------------------------------------------------- Abgleich

const idImText = (s) => [...new Set(s.match(/\bO-\d{4}\b/g) ?? [])]
/**
 * Beste Zeile fuer einen Punkt. Mass: geteilte Woerter / Woerter der OFFEN-Zeile (die kuerzere, verdichtete Fassung);
 * ist der Berichtspunkt selbst sehr kurz, zaehlt stattdessen der Anteil seiner Woerter, den die Zeile deckt
 * (Mass = das Groessere von beiden). Fuer die Schwelle muessen mindestens min(MIN_GETEILT, Woerter beider Seiten) geteilt sein.
 */
const beste = (punktWoerter, kandidaten) => {
  let best = { anteil: 0, geteilt: 0, zeile: null, ok: false }
  for (const t of kandidaten) {
    if (!t.woerter.size || !punktWoerter.size) continue
    let g = 0
    for (const w of t.woerter) if (punktWoerter.has(w)) g++
    const anteil = Math.max(g / t.woerter.size, g / punktWoerter.size)
    const ok = g >= Math.min(MIN_GETEILT, t.woerter.size, punktWoerter.size) && g >= 3
    // eine Zeile, die die Schwelle erreicht, schlaegt jede, die sie verfehlt; sonst zaehlt der Anteil
    if (!best.zeile || (ok && anteil >= SCHWELLE_ANTEIL) > (best.ok && best.anteil >= SCHWELLE_ANTEIL) || ((ok && anteil >= SCHWELLE_ANTEIL) === (best.ok && best.anteil >= SCHWELLE_ANTEIL) && (anteil > best.anteil || (anteil === best.anteil && g > best.geteilt)))) best = { anteil, geteilt: g, zeile: t, ok, nB: t.woerter.size }
  }
  return best
}
const trifft = (b) => b.zeile && b.ok && b.anteil >= SCHWELLE_ANTEIL

// ---------------------------------------------------------------- Lauf

const befunde = []
const hinweise = []
const bericht = []     // je Berichtsdatei: { ordner, datei, abschnitte:[{titel, punkte:[{...}]}] }
const messTreffer = []
const messGegen = []
let nPunkte = 0, nAbschnitte = 0, nBerichte = 0, nErledigtImBericht = 0
const arten = { id: 0, text: 0, fehlt: 0, idFalsch: 0 }

if (!RIEGEL) {
  for (const ordner of umfang) {
    const vorhanden = DATEIEN.filter((d) => existsSync(join(LAUF, ordner, d)))
    if (!vorhanden.length) { hinweise.push(`${ordner}: kein BERICHT.md, NACHTRAG.md oder ENTSCHEIDE.md — übersprungen`); continue }
    for (const datei of vorhanden) {
      nBerichte++
      const { abschnitte, uebergangen } = berichtLesen(ordner, datei)
      for (const u of uebergangen) hinweise.push(`${ordner}/${datei}: Abschnitt «${ersteWorte(u, 10)}» ist ein Rückblick (entschieden) — nicht gelesen`)
      if (!abschnitte.length) { hinweise.push(`${ordner}/${datei}: kein Abschnitt «offen» — nichts abzugleichen`); bericht.push({ ordner, datei, abschnitte: [] }); continue }
      const eintrag = { ordner, datei, abschnitte: [] }
      bericht.push(eintrag)
      const schluessel = `${ordner}/${datei}`
      const dateiZeilen = alleZeilen.filter((t) => t.zitate.has(schluessel))
      const ordnerZeilen = alleZeilen.filter((t) => t.ordner.has(ordner))
      const fremd = alleZeilen.filter((t) => t.ordner.size && !t.ordner.has(ordner))
      for (const ab of abschnitte) {
        nAbschnitte++
        const out = { titel: ab.titel, zeile: ab.zeile, punkte: [] }
        eintrag.abschnitte.push(out)
        for (const p of ab.punkte) {
          if (/^(\*\*)?(behoben|erledigt|entschieden am)\b/i.test(plain(p.stand ?? ''))) { nErledigtImBericht++; out.punkte.push({ ...p, status: 'abgeschlossen im Bericht' }); continue }
          nPunkte++
          const ww = woerter(p.text)
          const pi = { ...p, kopf: ersteWorte(p.text) }
          out.punkte.push(pi)
          const genannt = idImText(p.text)
          if (genannt.length) {
            const unbekanntIds = genannt.filter((x) => !ids.has(x))
            if (unbekanntIds.length) {
              arten.idFalsch++
              pi.status = `ID ${unbekanntIds.join(', ')} unbekannt`
              befunde.push({ code: 'OFFEN_ID_UNBEKANNT', wo: `${ordner}/${datei} › ${ersteWorte(ab.titel, 8)} (Z. ${ab.zeile})`, was: `«${pi.kopf}» nennt ${unbekanntIds.join(', ')} — keine Zeile in OFFEN.md` })
            } else { arten.id++; pi.status = `ID ${genannt.join(', ')}` }
            continue
          }
          const bDatei = beste(ww, dateiZeilen)
          const bOrdner = beste(ww, ordnerZeilen)
          const bGegen = beste(ww, fremd)
          messTreffer.push({ datei: schluessel, anteil: bDatei.anteil, geteilt: bDatei.geteilt, ordnerAnteil: bOrdner.anteil, dateiOk: trifft(bDatei), ordnerOk: trifft(bOrdner) })
          messGegen.push({ anteil: bGegen.anteil, geteilt: bGegen.geteilt, ok: trifft(bGegen) })
          if (trifft(bOrdner)) { arten.text++; pi.status = `Text ≈ ${bOrdner.zeile.id} (${bOrdner.geteilt}/${bOrdner.zeile.woerter.size})`; continue }
          const b = bOrdner
          arten.fehlt++
          pi.status = `FEHLT${b.zeile ? ` (beste: ${b.zeile.id} ${b.geteilt}/${b.zeile.woerter.size})` : ''}`
          befunde.push({ code: 'OFFEN_PUNKT_FEHLT', wo: `${ordner}/${datei} › ${ersteWorte(ab.titel, 8)} (Z. ${ab.zeile})`, was: `«${pi.kopf}» — beste Zeile: ${b.zeile ? `${b.zeile.id}, ${b.geteilt} von ${b.zeile.woerter.size} Wörtern (${Math.round(b.anteil * 100)} %)` : 'keine mit dieser Fundstelle'}` })
        }
      }
    }
  }
}
for (const f of formFehler) befunde.push({ code: 'OFFEN_FORM', wo: `OFFEN.md Z. ${f.zeile} (${f.id})`, was: f.was })

// ---------------------------------------------------------------- Ausgabe

if (RIEGEL) {
  console.log(`offen --riegel — ${tabellen.offen.length} Zeilen der Tabelle «Alle offenen Punkte»`)
  for (const t of riegel) console.log(`  RIEGEL  ${t.zellen[0]}  Art ${t.zellen[2]}  ${t.zellen[6]}\n          ${ersteWorte(t.zellen[3], 30)}`)
  console.log(`\n${riegel.length ? `ROT — ${riegel.length} Zeile(n) sperren den Start eines Laufs.` : 'GRUEN — keine Zeile der Art S oder P mit «[erzeugt Fehler]» und Stand offen oder braucht Entscheid.'}`)
  process.exit(riegel.length ? 1 : 0)
}

console.log(`offen — ${wunsch.length ? `${wunsch.length} Laufordner` : 'alle Laufordner'}`)
console.log(`  OFFEN.md: ${tabellen.offen.length} offen · ${tabellen.erledigt.length} erledigt · ${tabellen.hingenommen.length} hingenommen · ${tabellen.doppelt.length} doppelt geführt`)
console.log(`  Berichte: ${umfang.length} Laufordner, ${nBerichte} Dateien, ${nAbschnitte} Abschnitte «offen», ${nPunkte} Punkte (${nErledigtImBericht} im Bericht abgeschlossen, nicht verlangt)`)
console.log(`  Abgleich: ${arten.id} über ID · ${arten.text} über Text · ${arten.fehlt} fehlen · ${arten.idFalsch} unbekannte ID`)
for (const h of hinweise) console.log(`  HINWEIS ${h}`)
if (riegel.length) console.log(`  HINWEIS Start-Riegel zu (${riegel.map((t) => t.zellen[0]).join(', ')}) — \`--riegel\` prüft das allein`)

if (LISTE) {
  console.log('')
  for (const b of bericht) {
    console.log(`  ${b.ordner}/${b.datei}`)
    if (!b.abschnitte.length) { console.log('    (kein Abschnitt «offen»)'); continue }
    for (const ab of b.abschnitte) {
      console.log(`    § ${ab.titel} (Z. ${ab.zeile}) — ${ab.punkte.length} Punkt(e)`)
      ab.punkte.forEach((p, n) => console.log(`      ${n + 1}. [${p.status ?? '?'}] ${p.kopf ?? ersteWorte(p.text)}`))
    }
  }
}

if (MESSEN) {
  const klassen = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0001]
  const hist = (liste, f) => klassen.slice(0, -1).map((lo, i) => liste.filter((x) => f(x) >= lo && f(x) < klassen[i + 1]).length)
  const zeile = (name, h) => console.log(`    ${name.padEnd(34)} ${h.map((n) => String(n).padStart(4)).join('')}`)
  console.log('\n  Verteilung der besten Überlappung je Punkt (Anteil der OFFEN-Zeilen-Wörter im Berichtspunkt)')
  console.log(`    ${''.padEnd(34)} ${klassen.slice(0, -1).map((k) => k.toFixed(1).padStart(4)).join('')}`)
  zeile('Treffer: Zeilen derselben Datei', hist(messTreffer, (x) => x.anteil))
  zeile('Treffer: Zeilen desselben Ordners', hist(messTreffer, (x) => x.ordnerAnteil))
  zeile('Gegenprobe: Zeilen anderer Berichte', hist(messGegen, (x) => x.anteil))
  console.log(`    Schwelle ${SCHWELLE_ANTEIL}, mindestens min(${MIN_GETEILT}, Wörter) geteilt (und 3): Treffer in derselben Datei ${messTreffer.filter((x) => x.dateiOk).length}, im selben Ordner ${messTreffer.filter((x) => x.ordnerOk).length} von ${messTreffer.length} Punkten; Gegenprobe (andere Berichte) ${messGegen.filter((x) => x.ok).length} von ${messGegen.length}`)
}

console.log('')
const rang = (b) => ({ OFFEN_ID_UNBEKANNT: 0, OFFEN_PUNKT_FEHLT: 1, OFFEN_FORM: 2 })[b.code] ?? 3
befunde.sort((a, b) => rang(a) - rang(b))
for (const b of befunde) console.log(`  FEHLER  ${b.code}  ${b.wo}\n          ${b.was}`)
const n = befunde.length
const nFehlt = befunde.filter((b) => b.code === 'OFFEN_PUNKT_FEHLT').length
const nAnder = n - nFehlt
console.log(`${n ? '\n' : ''}${n
  ? `ROT — ${nFehlt} Punkt(e) fehlen in OFFEN.md${nAnder ? `, ${nAnder} weitere Fehler (ID unbekannt oder Form)` : ''}.`
  : `GRUEN — alle ${nPunkte} offenen Punkte aus ${nBerichte} Berichtsdateien stehen in OFFEN.md (${arten.id} über ID, ${arten.text} über Text); ${tabellen.offen.length} Zeilen der Tabelle sind formgerecht.`}`)
process.exit(n ? 1 : 0)
