/**
 * archiv.mjs — Quellenarchiv und Lehrmittel lesen: die gemeinsame Grundlage
 * für check-belege, check-zeiger, check-fakten und die Audits (ENTSCHEIDE E38).
 *
 *   import { archivWurzel, ladeArchivtext, sucheAnker, pruefOrdner, … } from './lib/archiv.mjs'
 *
 *   node scripts/lib/archiv.mjs --formen              # jede Archivkarte: Form, Zeilen, Zeitmarken prüfbar
 *   node scripts/lib/archiv.mjs <karten-id> [<id> …]  # nur diese Karten
 *   … --wurzel <ordner>                               # anderer Baum statt dieses Repos (Gegenproben)
 *
 * Was hier steht:
 *   ORT        Archiv auflösen (QUELLEN_ARCHIV gewinnt, wie in check-namen.mjs),
 *              Ordner der Beleg-Dateien `_pruefung/<ordnername>/`, Karten-Belege
 *              `_pruefung/_karten/<id>.json`, Lehrmittel `material/_lehrmittel/`
 *   ARCHIVTEXT `<id>/gewaehlt/quelle.md` zerlegen: Kopf · Quellentext · Notiz.
 *              Quellentext sind die Zeilen mit einer Marke in eckigen Klammern
 *              (Zeit, Absatz, Seite + Absatz, Etikett) und die Tabellen darunter.
 *   STELLE     Je Textzeile die kanonische Stelle: «mm:ss», «Abs. N»,
 *              «S. P, Abs. N», das Etikett, «Tabelle» oder leer.
 *   ANKER      Normalisierung (Gross/Klein, Satzzeichen, Leerraum) und Suche
 *              einer Wortfolge über Zeilengrenzen hinweg, mit Zeitfenster.
 *   LEHRMITTEL Kapiteldatei nach Seitenmarken `[seite: N]` zerlegen, Anker mit Seite.
 *
 * Die Formen sind an allen Archivordnern erhoben (07.10.2026) und in
 * .claude/skills/bbw-hko-heft-v42/references/belege.md §4 beschrieben.
 *
 * Kein Quellen- oder Lehrmittelwortlaut in dieser Datei: Beispiele in den
 * Kommentaren sind erfunden. Auf die Konsole schreibt die CLI nur Formen und
 * Zahlen, nie Text.
 *
 * Reines Node, keine Abhängigkeiten, nur lesend.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const ARCHIV_LOKAL = 'D:/OS/_lab/quellen-archiv/bbw-hko'

// ===================================================================== ORT

/**
 * Löst das Quellenarchiv auf. Reihenfolge wie scripts/check-namen.mjs:
 * QUELLEN_ARCHIV gewinnt (auch wenn es leer oder falsch ist — dann fehlt das
 * Archiv), sonst `<wurzel>/material/_quellen-archiv` (privater Spiegel), sonst
 * der lokale Ordner. «Da» heisst: mindestens ein Ordner `q-…`.
 *
 * @returns {{ pfad: string|null, kandidaten: string[], grund: string }}
 */
export function archivWurzel({ wurzel = REPO, env = process.env } = {}) {
  const kandidaten = env.QUELLEN_ARCHIV ? [env.QUELLEN_ARCHIV] : [join(wurzel, 'material', '_quellen-archiv'), ARCHIV_LOKAL]
  for (const p of kandidaten) {
    if (!existsSync(p) || !statSync(p).isDirectory()) continue
    if (readdirSync(p).some((n) => n.startsWith('q-'))) return { pfad: p, kandidaten, grund: '' }
    return { pfad: null, kandidaten, grund: `${p} enthält keinen Ordner q-…` }
  }
  return { pfad: null, kandidaten, grund: `kein Ordner unter ${kandidaten.join(' · ')}` }
}

/**
 * Löst das Lehrmittel auf: LEHRMITTEL (Ordner mit den Kapiteldateien) gewinnt,
 * sonst `<wurzel>/material/_lehrmittel`, sonst — für eine Temp-Kopie ohne das
 * gitignorierte `material/` — der Ordner dieses Repos.
 *
 * @returns {{ pfad: string|null, kandidaten: string[] }}
 */
export function lehrmittelWurzel({ wurzel = REPO, env = process.env } = {}) {
  const kandidaten = env.LEHRMITTEL ? [env.LEHRMITTEL] : [...new Set([join(wurzel, 'material', '_lehrmittel'), join(REPO, 'material', '_lehrmittel')])]
  const pfad = kandidaten.find((p) => existsSync(p) && statSync(p).isDirectory() && readdirSync(p).some((f) => f.endsWith('.md'))) ?? null
  return { pfad, kandidaten }
}

/** Dateinamen im Ordner `_pruefung/<ordnername>/` — wer sie schreibt: references/belege.md §2. */
export const BELEG_DATEIEN = Object.freeze({
  belege: 'belege.json',
  fakten: 'fakten.json',
  fall: 'fall.json',
  probe: 'probe.json',
  herkunft: 'herkunft.json',
})

/** `<archiv>/_pruefung/<ordnername>/` — ein Ordner je Einheit, nicht je Lauf. */
export const pruefOrdner = (archiv, ordnername) => join(archiv, '_pruefung', ordnername)

/** `<archiv>/_pruefung/_karten/<id>.json` — Belege einer Methoden- oder Quellenkarte. */
export const kartenBelegDatei = (archiv, kartenId) => join(archiv, '_pruefung', '_karten', `${kartenId}.json`)

/**
 * Liest eine Beleg-Datei. Nie werfen: Der Aufrufer entscheidet, ob «fehlt» ein
 * Fehler (Entwurf) oder eine Warnung (publiziert) ist.
 *
 * @param {'belege'|'fakten'|'fall'|'probe'|'herkunft'} name
 * @returns {{ pfad: string, vorhanden: boolean, daten: any, fehler: string|null }}
 */
export function liesBelegDatei(archiv, ordnername, name) {
  const datei = BELEG_DATEIEN[name]
  if (!datei) throw new Error(`liesBelegDatei: unbekannte Beleg-Datei «${name}»`)
  return liesJson(join(pruefOrdner(archiv, ordnername), datei))
}

/** Wie liesBelegDatei, für `_pruefung/_karten/<id>.json`. */
export const liesKartenBelege = (archiv, kartenId) => liesJson(kartenBelegDatei(archiv, kartenId))

function liesJson(pfad) {
  if (!existsSync(pfad)) return { pfad, vorhanden: false, daten: null, fehler: null }
  try { return { pfad, vorhanden: true, daten: JSON.parse(readFileSync(pfad, 'utf8').replace(/^\uFEFF/, '')), fehler: null } }
  catch (e) { return { pfad, vorhanden: true, daten: null, fehler: e.message } }
}

// ==================================================================== ZEIT

/** «mm:ss», «h:mm:ss», «mm:ss.d» → Sekunden (Zahl, mit Bruchteil) oder null. */
export function parseZeit(s) {
  const m = /^\s*(\d{1,3}):(\d{2})(?::(\d{2}))?(?:[.,](\d{1,3}))?\s*$/.exec(String(s ?? ''))
  return m ? zeitAus(m[1], m[2], m[3], m[4]) : null
}
const zeitAus = (a, b, c, bruch) => (c !== undefined ? +a * 3600 + +b * 60 + +c : +a * 60 + +b) + (bruch ? +`0.${bruch}` : 0)

/** Sekunden → «mm:ss» (abgerundet; Minuten laufen über 59 weiter, wie im Player eines langen Beitrags). */
export function formatZeit(sek) {
  const s = Math.max(0, Math.floor(sek))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// ============================================================== ARCHIVTEXT

const ZEIT = String.raw`(\d{1,3}):(\d{2})(?::(\d{2}))?(?:[.,](\d{1,3}))?`
// Vor der Marke: Einzug, das Zeichen «»» (Zeile gehört zum gewählten Ausschnitt), Fettdruck.
const RE_VORSPANN = /^\s*(»\s*)?(\*\*)?/
const RE_M_ZEIT = new RegExp(String.raw`^\[${ZEIT}(?:\s*[–—-]\s*${ZEIT})?\](?:\*\*)?\s*`)
const RE_M_ABSATZ = /^\[(?:S\.\s*(\d+),\s*)?(?:Abs(?:atz|\.)?\s*)?(\d{1,3})\](?:\*\*)?\s*/
const RE_M_ETIKETT = /^\[([A-Za-zÄÖÜäöü][^\]]{0,40})\](?!\()(?:\*\*)?\s*/
// Nach einer Absatzmarke: Einsatzzeit des Absatzes, wahlweise bis-Zeit, wahlweise die Zeit der
// ganzen Sendung in Klammern, wahlweise ein Strich. Erfundene Beispiele: «[4] 01:12 — Text»,
// «[4] 01:12–01:20 Text», «[4] 01:12 (Sendung 00:09:30) Text».
const RE_ABSATZZEIT = new RegExp(String.raw`^${ZEIT}(?:\s*[–—-]\s*${ZEIT})?(?:\s*\(\s*Sendung\s+[\d:.,]+\s*\))?\s*(?:[—–-]\s+)?(?=\S)`)
// Zeit ohne Klammer am Zeilenanfang. Erfundenes Beispiel: «00:14 Text».
const RE_M_NACKT = new RegExp(String.raw`^${ZEIT}\s+(?=\S)`)
const RE_AUSSERHALB = /\s*\((?:ausserhalb|nicht im|nicht Teil) de[sr] Ausschnitts?\)\s*$/i
// Überschriften und Zeilenanfänge, die eine Notiz der Recherche einleiten — kein Quellentext.
const RE_NOTIZ_KOPF = /Audit|Notiz|Bildprotokoll|eigene Beschreibung|Arbeitsfassung|Kohärenz|Prüfnachweis|Hinweis für|Raster-Stichwort/i
const RE_NOTIZ_ZEILE = /^\s*(?:[_*]{0,2})(?:Audit-Notiz|Hinweis|Notiz|Anmerkung|Zeilen mit »|— nicht vorhanden —|\(?eigene Beschreibung)/i

/**
 * Liest die Marke am Zeilenanfang.
 * @returns {null | { art: 'zeit'|'absatz'|'absatz_zeit'|'etikett', rest: string, sek: number|null,
 *            sek_bis: number|null, absatz: number|null, seite: number|null, etikett: string|null, gewaehlt: boolean }}
 */
export function liesMarke(zeile) {
  const v = RE_VORSPANN.exec(zeile)
  const gewaehlt = !!v[1]
  let s = zeile.slice(v[0].length)
  const leer = { sek: null, sek_bis: null, absatz: null, seite: null, etikett: null, gewaehlt }
  let m = RE_M_ZEIT.exec(s)
  if (m) return { ...leer, art: 'zeit', rest: s.slice(m[0].length), sek: zeitAus(m[1], m[2], m[3], m[4]), sek_bis: m[5] !== undefined ? zeitAus(m[5], m[6], m[7], m[8]) : null }
  m = RE_M_ABSATZ.exec(s)
  if (m) {
    s = s.slice(m[0].length)
    const z = RE_ABSATZZEIT.exec(s)
    return z
      ? { ...leer, art: 'absatz_zeit', rest: s.slice(z[0].length), ohne_zeit: s, absatz: +m[2], seite: m[1] ? +m[1] : null, sek: zeitAus(z[1], z[2], z[3], z[4]), sek_bis: z[5] !== undefined ? zeitAus(z[5], z[6], z[7], z[8]) : null }
      : { ...leer, art: 'absatz', rest: s, absatz: +m[2], seite: m[1] ? +m[1] : null }
  }
  m = RE_M_ETIKETT.exec(s)
  if (m) return { ...leer, art: 'etikett', rest: s.slice(m[0].length), etikett: m[1].trim() }
  m = RE_M_NACKT.exec(s)
  if (m) return { ...leer, art: 'zeit', rest: s.slice(m[0].length), sek: zeitAus(m[1], m[2], m[3], m[4]) }
  return null
}

/** Kanonische Stelle einer Textzeile — das, was `stelle` in belege.json trägt. */
export function stelleVon(z) {
  if (z.sek !== null && z.sek !== undefined) return formatZeit(z.sek)
  if (z.absatz !== null && z.absatz !== undefined) return z.seite ? `S. ${z.seite}, Abs. ${z.absatz}` : `Abs. ${z.absatz}`
  if (z.etikett) return z.etikett
  if (z.art === 'tabelle') return 'Tabelle'
  return ''
}

/**
 * Zerlegt den Text einer Archivdatei.
 *
 * Bereiche:
 *   kopf    alles vor der ersten Textzeile: Titel (`# …`) und die Liste `- Schlüssel: Wert`
 *   text    Zeilen mit Marke; Tabellenzeilen ausserhalb einer Notiz; unmarkierte
 *           Folgezeilen direkt unter einer Textzeile (ohne Leerzeile)
 *   notiz   ein Abschnitt, dessen Überschrift RE_NOTIZ_KOPF trifft, bis zur
 *           nächsten Überschrift; einzelne Zeilen, die RE_NOTIZ_ZEILE trifft;
 *           Listenzeilen `- …` nach dem Kopf (Beschreibung einer Grafik, Metadaten)
 *           und HTML-Kommentare
 *   lose    übrige unmarkierte Zeilen nach dem Kopf — Text ohne Stelle
 *
 * @param {string} roh    Dateiinhalt
 */
export function zerlegeArchivtext(roh) {
  const zeilenRoh = roh.replace(/^\uFEFF/, '').split(/\r?\n/)
  const kopf = { titel: null, felder: [] }
  const zeilen = []   // Quellentext mit Stelle
  const lose = []     // Quellentext ohne Stelle
  const notizen = []
  let begonnen = false   // erste Textzeile gesehen
  let kopfZu = false     // Trennlinie nach der Kopf-Liste gesehen
  let inNotiz = false
  let letzteWarText = false
  let hatGewaehlt = false

  for (let i = 0; i < zeilenRoh.length; i++) {
    const l = zeilenRoh[i]
    const nr = i + 1
    if (!l.trim()) { letzteWarText = false; continue }
    const ueberschrift = /^#{1,6}\s+(.*)$/.exec(l)
    if (ueberschrift) {
      letzteWarText = false
      if (!kopf.titel && /^#\s/.test(l) && !begonnen) kopf.titel = ueberschrift[1].trim()
      inNotiz = RE_NOTIZ_KOPF.test(ueberschrift[1])
      if (begonnen || kopfZu) notizen.push({ nr, art: 'ueberschrift', text: ueberschrift[1].trim() })
      continue
    }
    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(l)) { letzteWarText = false; if (!begonnen) kopfZu = true; inNotiz = false; continue }
    if (inNotiz) { notizen.push({ nr, art: 'notiz', text: l.trim() }); letzteWarText = false; continue }

    const marke = liesMarke(l)
    if (marke) {
      begonnen = true
      let text = marke.rest.replace(/^#{1,6}\s+/, '').trim()
      const ausserhalb = RE_AUSSERHALB.test(text)
      if (ausserhalb) text = text.replace(RE_AUSSERHALB, '')
      if (marke.gewaehlt) hatGewaehlt = true
      const z = { nr, art: marke.art, text, ohne_zeit: marke.ohne_zeit, sek: marke.sek, sek_bis: marke.sek_bis, absatz: marke.absatz, seite: marke.seite, etikett: marke.etikett, gewaehlt: marke.gewaehlt, ausserhalb }
      z.stelle = stelleVon(z)
      zeilen.push(z)
      letzteWarText = true
      continue
    }
    if (/^\s*\|/.test(l) && (begonnen || kopfZu)) {
      letzteWarText = false
      if (/^\s*\|[\s:|-]+\|?\s*$/.test(l)) continue // Trennzeile der Tabelle
      begonnen = true
      const z = { nr, art: 'tabelle', text: l.replace(/\|/g, ' ').trim(), sek: null, sek_bis: null, absatz: null, seite: null, etikett: null, gewaehlt: false, ausserhalb: false }
      z.stelle = stelleVon(z)
      zeilen.push(z)
      continue
    }
    const liste = /^\s*[-*+]\s+(.*)$/.exec(l)
    if (!begonnen && !kopfZu) {
      // Kopf: `- Schlüssel: Wert` oder `- **Schlüssel:** Wert`
      const kv = liste && /^(?:\*\*)?([^:*]{1,60}?)(?:\*\*)?\s*:(?:\*\*)?\s*(.*)$/.exec(liste[1])
      if (kv) kopf.felder.push({ nr, schluessel: schluesselNorm(kv[1]), roh: kv[1].trim(), wert: kv[2].replace(/^\*\*\s*/, '').trim() })
      else notizen.push({ nr, art: 'kopf', text: l.trim() })
      continue
    }
    if (/^\s*#+\s*$/.test(l)) continue
    if (RE_NOTIZ_ZEILE.test(l) || liste || /^\s*<!--/.test(l)) { notizen.push({ nr, art: 'notiz', text: l.trim() }); letzteWarText = false; continue }
    if (letzteWarText && zeilen.length) { zeilen[zeilen.length - 1].text += ' ' + l.trim(); continue }
    lose.push({ nr, art: 'lose', text: l.trim(), stelle: '' })
  }

  // Ein Artikelabsatz, der mit einer Uhrzeit beginnt, ist kein Transkript: Tragen weniger
  // Absätze eine Einsatzzeit als keine, gilt die Zeit als Teil des Texts.
  const mitZeit = zeilen.filter((z) => z.art === 'absatz_zeit')
  if (mitZeit.length && mitZeit.length < zeilen.filter((z) => z.art === 'absatz').length) {
    for (const z of mitZeit) { z.art = 'absatz'; z.text = z.ohne_zeit.replace(/^#{1,6}\s+/, '').trim(); z.sek = null; z.sek_bis = null; z.stelle = stelleVon(z) }
  }
  for (const z of zeilen) delete z.ohne_zeit

  // Trägt die Datei das Zeichen «»», sagt sie selbst, welche Zeilen zum Ausschnitt gehören.
  for (const z of zeilen) z.im_ausschnitt_laut_datei = hatGewaehlt ? z.gewaehlt : z.ausserhalb ? false : null
  return { kopf, zeilen, lose, notizen }
}

const schluesselNorm = (s) => s.toLowerCase().replace(/\*\*/g, '').replace(/\s*\(.*$/, '').replace(/\s+/g, ' ').trim()

/** Erstes Kopffeld, dessen Schlüssel (klein, ohne Klammerzusatz) das Muster trifft. */
export const kopfFeld = (archivtext, muster) => archivtext?.kopf?.felder.find((f) => muster.test(f.schluessel))?.wert ?? null

/**
 * Form eines zerlegten Archivtexts — die fünf Formen aus references/belege.md §4.
 *   zeitzeilen    jede Zeile trägt ihre Einsatzzeit (Untertitel)
 *   absatz_zeit   Absätze mit Nummer und Einsatzzeit (Transkript in Blöcken)
 *   absatz        nummerierte Absätze ohne Zeit (Artikel, Webseite, Rechtstext)
 *   etikett       nur Zeilen mit Wort-Etikett (z. B. ein Begleittext)
 *   ohne_marken   Text ohne jede Marke, oder gar kein Text
 */
export function formVon({ zeilen, lose }) {
  const n = (a) => zeilen.filter((z) => z.art === a).length
  const zeit = n('zeit'); const az = n('absatz_zeit'); const abs = n('absatz'); const et = n('etikett'); const tab = n('tabelle')
  if (zeit && zeit >= az + abs) return 'zeitzeilen'
  if (az && az >= abs) return 'absatz_zeit'
  if (abs) return 'absatz'
  if (et) return 'etikett'
  if (tab) return 'tabelle'
  return lose.length ? 'ohne_marken' : 'ohne_text'
}

// Median des Abstands zweier Einsatzzeiten, ab dem ein Transkript als «in Blöcken» gilt.
// Gemessen am Archiv (07.10.2026): Untertitelzeilen liegen im Median bei 2–5 s, die
// Blocktranskripte bei 8–35 s; die Zeitmarken-Fehler vom 05.10. kamen aus Blöcken um 20 s.
export const BLOCK_AB_SEK = 6

/**
 * Wie genau lassen sich Zeitmarken an diesem Text prüfen?
 *   zeile      jede Zeile hat ihre Einsatzzeit — die Prüfung «höchstens 3 s daneben» ist möglich
 *   block      nur Blöcke: geprüft wird das Fenster des Blocks; jede Zeitmarke gehört auf die Gegenhör-Liste
 *   nein       Audio/Video ohne Zeitmarken im Archivtext — HINWEIS je Karte, nie still bestehen
 *   entfaellt  Textquelle: Die Stelle ist ein Absatz, keine Zeit
 *
 * `vermerk` nennt als Stichwörter, was der Kopf der Datei über die Zeitmarken sagt
 * (berechnet · geschaetzt · nicht_gegengehoert · toleranz_im_kopf · kein_transkript · maschinell).
 *
 * @param {{zeilen: any[], kopf: any}} t
 * @param {string|undefined} kartenTyp  `typ` der Quellenkarte, falls bekannt
 */
export function zeitPruefbar(t, kartenTyp) {
  const mitZeit = t.zeilen.filter((z) => z.sek !== null)
  const av = kartenTyp === 'audio' || kartenTyp === 'video'
  // Was der Kopf selbst über Transkript und Zeitmarken sagt — als Stichwort, nie als Text.
  const kopfText = (t.kopf?.felder ?? []).filter((f) => /zeitmarke|transkript|textart|art des text|untertitel/.test(f.schluessel)).map((f) => f.wert).join(' ')
  const vermerk = [
    [/berechnet/i, 'berechnet'], [/gesch(ä|ae)tzt/i, 'geschaetzt'], [/nicht gegengeh(ö|oe)rt/i, 'nicht_gegengehoert'],
    [/±\s*\d+/, 'toleranz_im_kopf'], [/begleittext|kein transkript|volltext fehlt/i, 'kein_transkript'], [/whisper|automatische transkription|maschinell/i, 'maschinell'],
  ].filter(([re]) => re.test(kopfText)).map(([, k]) => k)
  if (!mitZeit.length) return { stufe: av ? 'nein' : 'entfaellt', zeilen: 0, median_sek: null, max_sek: null, vermerk }
  const sek = [...new Set(mitZeit.map((z) => z.sek))].sort((a, b) => a - b)
  const abst = sek.slice(1).map((s, i) => s - sek[i]).sort((a, b) => a - b)
  const median = abst.length ? abst[Math.floor(abst.length / 2)] : null
  const max = abst.length ? abst[abst.length - 1] : null
  const block = median === null || median > BLOCK_AB_SEK
  return { stufe: block ? 'block' : 'zeile', zeilen: mitZeit.length, median_sek: median, max_sek: max, vermerk }
}

/**
 * Lädt den Archivtext einer Karte: `<archiv>/<id>/gewaehlt/quelle.md`, dazu
 * Beilagen mit Text (`transkript.md`) als weitere Textzeilen.
 *
 * @param {string} archiv        Pfad aus archivWurzel()
 * @param {string|{id:string, archiv_ref?:string, typ?:string}} karte  Karten-ID oder Karte
 * @returns {{ id, ordner, vorhanden, grund, datei, beilagen, kopf, zeilen, lose, notizen, form, zeit }}
 */
export function ladeArchivtext(archiv, karte) {
  const id = typeof karte === 'string' ? karte : karte.id
  const ref = (typeof karte === 'object' && karte.archiv_ref) || `${id}/gewaehlt`
  const ordner = join(archiv, ...ref.split('/'))
  const leer = { id, ordner, vorhanden: false, grund: '', datei: null, beilagen: [], kopf: { titel: null, felder: [] }, zeilen: [], lose: [], notizen: [], form: 'fehlt', zeit: { stufe: 'nein', zeilen: 0, median_sek: null, max_sek: null, vermerk: [] } }
  if (!existsSync(ordner) || !statSync(ordner).isDirectory()) return { ...leer, grund: `Ordner ${ref} fehlt im Archiv` }
  const dateien = readdirSync(ordner)
  const beilagen = dateien.filter((f) => f !== 'quelle.md')
  const datei = join(ordner, 'quelle.md')
  if (!existsSync(datei)) return { ...leer, beilagen, grund: beilagen.length ? `keine quelle.md, nur ${beilagen.join(', ')}` : 'Ordner ist leer' }
  const t = zerlegeArchivtext(readFileSync(datei, 'utf8'))
  for (const z of t.zeilen) z.datei = 'quelle.md'
  for (const z of t.lose) z.datei = 'quelle.md'
  // Beilage mit Text: ein Transkript neben der quelle.md.
  for (const b of beilagen.filter((f) => /^transkript.*\.(md|txt)$/i.test(f))) {
    const tb = zerlegeArchivtext(readFileSync(join(ordner, b), 'utf8'))
    for (const z of tb.zeilen) { z.datei = b; t.zeilen.push(z) }
    for (const z of tb.lose) { z.datei = b; t.lose.push(z) }
  }
  const typ = typeof karte === 'object' ? karte.typ : undefined
  return { id, ordner, vorhanden: true, grund: '', datei, beilagen, ...t, form: formVon(t), zeit: zeitPruefbar(t, typ) }
}

/** Alle Ordner `q-…` des Archivs, sortiert. */
export const archivKarten = (archiv) => readdirSync(archiv, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name.startsWith('q-')).map((d) => d.name).sort()

/**
 * Ausschnitt einer Quellenkarte als Zahlen.
 * @returns {{ art: 'zeit', von_sek: number, bis_sek: number } | { art: 'absaetze', text: string } | { art: 'fehlt' }}
 */
export function ausschnittDerKarte(karte) {
  const v = karte?.verortung
  const von = parseZeit(v?.von); const bis = parseZeit(v?.bis)
  if (von !== null && bis !== null) return { art: 'zeit', von_sek: von, bis_sek: bis }
  if (typeof v?.absaetze === 'string' && v.absaetze.trim()) return { art: 'absaetze', text: v.absaetze }
  return { art: 'fehlt' }
}

// =================================================================== ANKER

/**
 * Wörter eines Texts für die Ankersuche: klein geschrieben, Unicode NFKC, ohne
 * Satzzeichen, ohne Leerraum. Anführungszeichen, Apostrophe, Striche, Trennstriche
 * am Zeilenende und Markdown-Zeichen fallen damit weg; Umlaute und Ziffern bleiben.
 * «40'000» wird zu «40», «000» — auf beiden Seiten gleich.
 */
export const ankerWoerter = (s) => String(s ?? '').normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []

/** Der normalisierte Anker als Zeichenkette (ein Leerzeichen zwischen den Wörtern). */
export const normalisiereAnker = (s) => ankerWoerter(s).join(' ')

function folge(zeilen) {
  const w = []; const zu = []
  zeilen.forEach((z, i) => { for (const x of ankerWoerter(z.text)) { w.push(x); zu.push(i) } })
  return { w, zu }
}
function treffer(w, a) {
  const out = []
  if (!a.length || a.length > w.length) return out
  for (let i = 0; i + a.length <= w.length; i++) {
    let j = 0
    while (j < a.length && w[i + j] === a[j]) j++
    if (j === a.length) out.push(i)
  }
  return out
}

/**
 * Sucht einen Anker im Quellentext einer Karte. Der Anker darf über
 * Zeilengrenzen laufen (Untertitelzeilen sind kürzer als ein Anker).
 *
 * Je Treffer:
 *   zeile      die Textzeile, in der der Anker beginnt (mit `stelle`, `sek`, `absatz` …)
 *   bis        die Textzeile, in der er endet
 *   stelle     kanonische Stelle des Beginns («mm:ss», «Abs. N», …; leer bei Text ohne Marke)
 *   fenster    nur mit Zeit: { von_sek, bis_sek } — Einsatz der Beginnzeile bis Einsatz der
 *              nächsten Zeile nach dem Ende des Ankers (bzw. `sek_bis`, bzw. offen = null).
 *              Eine Zeitmarke «stimmt», wenn sie in diesem Fenster ± Toleranz liegt.
 *
 * `ausserhalb_text`: Der Anker steht (auch) im Kopf oder in einer Notiz. Steht er
 * NUR dort (`treffer` leer), ist er kein Beleg aus der Quelle.
 *
 * @returns {{ woerter: number, treffer: any[], ausserhalb_text: {nr:number, bereich:string}[] }}
 */
export function sucheAnker(archivtext, anker) {
  const a = ankerWoerter(anker)
  const out = { woerter: a.length, treffer: [], ausserhalb_text: [] }
  if (!a.length) return out
  // Markierte Zeilen in Dateireihenfolge; Text ohne Marke getrennt, damit kein Anker
  // über die Grenze zwischen beiden «gefunden» wird.
  for (const gruppe of [archivtext.zeilen, archivtext.lose]) {
    const { w, zu } = folge(gruppe)
    for (const i of treffer(w, a)) {
      const von = gruppe[zu[i]]; const bisIdx = zu[i + a.length - 1]; const bis = gruppe[bisIdx]
      let fenster = null
      if (von.sek !== null && von.sek !== undefined) {
        const naechste = gruppe.slice(bisIdx + 1).find((z) => z.sek !== null && z.sek !== undefined && z.sek > bis.sek)
        fenster = { von_sek: von.sek, bis_sek: bis.sek_bis ?? naechste?.sek ?? null }
      }
      out.treffer.push({ zeile: von, bis, stelle: von.stelle ?? '', fenster })
    }
  }
  const neben = [...archivtext.kopf.felder.map((f) => ({ nr: f.nr, bereich: 'kopf', text: `${f.roh} ${f.wert}` })), ...archivtext.notizen.map((n) => ({ nr: n.nr, bereich: n.art === 'kopf' ? 'kopf' : 'notiz', text: n.text }))]
  const { w, zu } = folge(neben)
  for (const i of treffer(w, a)) out.ausserhalb_text.push({ nr: neben[zu[i]].nr, bereich: neben[zu[i]].bereich })
  return out
}

/**
 * Für die Fehlersuche: die längste zusammenhängende Wortfolge des Ankers, die im
 * Quellentext steht. Gibt Länge und Stelle zurück, nie den Text.
 */
export function laengsterTeilanker(archivtext, anker) {
  const a = ankerWoerter(anker)
  let best = { woerter: 0, von_wort: 0, stelle: '', nr: null }
  for (const gruppe of [archivtext.zeilen, archivtext.lose]) {
    const { w, zu } = folge(gruppe)
    for (let i = 0; i < w.length; i++) for (let s = 0; s < a.length; s++) {
      if (w[i] !== a[s]) continue
      let j = 0
      while (i + j < w.length && s + j < a.length && w[i + j] === a[s + j]) j++
      if (j > best.woerter) best = { woerter: j, von_wort: s, stelle: gruppe[zu[i]].stelle ?? '', nr: gruppe[zu[i]].nr }
    }
  }
  return { ...best, von: a.length }
}

/** Liegt eine Zeit (Sekunden) im Fenster eines Treffers, mit Toleranz? Offenes Ende zählt als im Fenster. */
export const imFenster = (sek, fenster, toleranzSek = 3) => !!fenster && sek >= fenster.von_sek - toleranzSek && (fenster.bis_sek === null || sek <= fenster.bis_sek + toleranzSek)

// ============================================================== LEHRMITTEL

/**
 * Kapiteldateien zu einer Kapitelnummer («2.4») oder einem Verweis («Kap. 2.4 | S. 55-60»).
 * Der Dateiname beginnt mit `<Nummer>_`. Zwei Nummern tragen heute zwei Dateien —
 * dann kommen beide zurück, und gesucht wird in beiden.
 */
export function kapitelDateien(lehrmittel, kapitel) {
  const nr = /(\d{1,2}\.\d{1,2})/.exec(String(kapitel))?.[1]
  if (!nr || !lehrmittel) return []
  return readdirSync(lehrmittel).filter((f) => f.endsWith('.md') && f.startsWith(`${nr}_`)).sort()
}

/**
 * Zerlegt eine Kapiteldatei nach Seitenmarken. Eine Zeile `[seite: N]` beginnt
 * die Buchseite N; alles bis zur nächsten Marke gehört zu ihr. Kommentare
 * `<!-- header|footer|style: … -->` sind Satzangaben, kein Text. Text vor der
 * ersten Marke hat keine Seite (`seite: null`).
 *
 * @returns {{ datei: string, seiten: { seite: number|null, zeilen: {nr:number, text:string}[] }[], ungeordnet: boolean }}
 */
export function ladeKapitel(lehrmittel, datei) {
  const roh = readFileSync(join(lehrmittel, datei), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)
  const seiten = []
  let akt = { seite: null, zeilen: [] }
  let ungeordnet = false
  let letzte = -1
  roh.forEach((l, i) => {
    const m = /^\s*\[seite:\s*(\d+)\]\s*$/i.exec(l)
    if (m) {
      if (akt.zeilen.length || akt.seite !== null) seiten.push(akt)
      akt = { seite: +m[1], zeilen: [] }
      if (akt.seite <= letzte) ungeordnet = true
      letzte = akt.seite
      return
    }
    const text = l.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\[seite:\s*\d+\]/gi, ' ').trim()
    if (text) akt.zeilen.push({ nr: i + 1, text })
  })
  if (akt.zeilen.length || akt.seite !== null) seiten.push(akt)
  return { datei, seiten, ungeordnet }
}

/**
 * Sucht einen Anker in einer Kapiteldatei. Je Treffer die Seite, auf der er
 * beginnt, und die Seite, auf der er endet (ein Anker darf über einen
 * Seitenwechsel laufen). `stelle` ist «S. N».
 *
 * @returns {{ woerter: number, treffer: { seite: number|null, seite_bis: number|null, stelle: string, nr: number }[] }}
 */
export function sucheAnkerKapitel(kapitel, anker) {
  const a = ankerWoerter(anker)
  const w = []; const zu = []
  for (const s of kapitel.seiten) for (const z of s.zeilen) for (const x of ankerWoerter(z.text)) { w.push(x); zu.push({ seite: s.seite, nr: z.nr }) }
  return {
    woerter: a.length,
    treffer: treffer(w, a).map((i) => ({ seite: zu[i].seite, seite_bis: zu[i + a.length - 1].seite, stelle: zu[i].seite === null ? '' : `S. ${zu[i].seite}`, nr: zu[i].nr })),
  }
}

// ===================================================================== CLI

function cli() {
  const argv = process.argv.slice(2)
  let wurzel = REPO
  const ids = []
  let alle = false
  const bad = (m) => { console.error(`archiv: ${m}\nusage: node scripts/lib/archiv.mjs --formen | <karten-id>…  [--wurzel <ordner>]`); process.exit(2) }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--wurzel') wurzel = resolve(argv[++i] ?? bad('--wurzel braucht einen Ordner'))
    else if (a === '--formen') alle = true
    else if (a.startsWith('--')) bad(`unbekannter Schalter ${a}`)
    else ids.push(a)
  }
  if (!alle && !ids.length) bad('nichts zu tun')
  const A = archivWurzel({ wurzel })
  if (!A.pfad) { console.error(`archiv: Quellenarchiv fehlt lokal (${A.grund}) — nichts geprüft.`); process.exit(2) }
  const liste = alle ? archivKarten(A.pfad) : ids
  const kartenDir = join(wurzel, 'src', 'data', 'quellen')
  const summe = {}; const stufen = {}
  console.log(`archiv — ${liste.length} Karte(n) · ${A.pfad}\n`)
  for (const id of liste) {
    const kp = join(kartenDir, `${id}.json`)
    let karte = { id }
    try { if (existsSync(kp)) karte = JSON.parse(readFileSync(kp, 'utf8')) } catch { /* unlesbare Karte: wie ohne Karte */ }
    const t = ladeArchivtext(A.pfad, { ...karte, archiv_ref: `${id}/gewaehlt` })
    summe[t.form] = (summe[t.form] ?? 0) + 1
    stufen[t.zeit.stufe] = (stufen[t.zeit.stufe] ?? 0) + 1
    const n = (a) => t.zeilen.filter((z) => z.art === a).length
    console.log(`  ${id.padEnd(26)} ${String(karte.typ ?? '—').padEnd(10)} ${t.form.padEnd(12)} Zeit ${t.zeit.stufe.padEnd(9)} ${t.vorhanden ? `Kopf ${String(t.kopf.felder.length).padStart(2)} · Text ${String(t.zeilen.length).padStart(3)} (Zeit ${n('zeit') + n('absatz_zeit')}, Abs. ${n('absatz')}, Tab. ${n('tabelle')}, Etikett ${n('etikett')}) · lose ${t.lose.length} · Notiz ${t.notizen.length}${t.zeit.median_sek !== null ? ` · Abstand Median ${t.zeit.median_sek.toFixed(1)} s` : ''}${t.zeit.vermerk.length ? ` · Kopf: ${t.zeit.vermerk.join(', ')}` : ''}${t.beilagen.length ? ` · Beilagen ${t.beilagen.length}` : ''}` : t.grund}`)
  }
  console.log(`\nFormen: ${Object.entries(summe).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
  console.log(`Zeitmarken prüfbar: ${Object.entries(stufen).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) cli()
