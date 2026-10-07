#!/usr/bin/env node
/**
 * check-fakten.mjs — jede Rechts- oder Sachaussage im Text einer Einheit braucht eine
 * Zeile in fakten.json mit Urteil «belegt» (ENTSCHEIDE E38, references/belege.md §5).
 *
 *   node scripts/check-fakten.mjs <ordner> [<ordner> …]
 *   node scripts/check-fakten.mjs --v42                  # alle Einheiten im Format v4.2
 *   … --liste                                            # Arbeitsliste fürs Fakten-Audit: jede gefundene Aussage
 *                                                        # (Feld, Art, Umfeld bis 12 Wörter — eigener Text der Einheit)
 *   … --streng                                           # jede Einheit wie ein Entwurf: Befunde sind Fehler
 *   … --protokoll <datei>                                # Fassung ohne Treffertext
 *   … --heute JJJJ-MM-TT                                 # Stichtag für das Alter eines Abrufs (Vorgabe: heute)
 *   … --wurzel <ordner>                                  # anderer Baum statt dieses Repos (Gegenproben)
 *
 * Gesucht wird im sichtbaren Text: Hefte (Kern und beide Spuren), Lösungen, Auftragsbogen
 * und Glossar (set.json), KN, Begleiter und die Karten, die die Einheit führt. Gefunden
 * wird am Schriftbild (lib/aussagen.mjs): Gesetzeskürzel mit Artikel, «Stand …», Datum,
 * Betrag, Prozent, Frist, Menge, Abstimmungsergebnis. Was fall.json als Fallzahl führt,
 * ist keine Aussage über die Welt und braucht keine Zeile. In Beispielen mit erfundenem
 * Fall (Beispielbild, Beispiel einer Methodenkarte) zählen nur Artikel, Stand und Abstimmung.
 *
 * Gelesen wird `<Quellenarchiv>/_pruefung/<ordner>/fakten.json` und `fall.json`.
 * Fehlt fakten.json, gibt es genau EINE Zeile («nicht auditiert») mit der Zahl der Aussagen.
 *
 * Codes:
 *   ERR_FAKTEN_FEHLT            fakten.json fehlt — die Aussagen der Einheit sind nicht geprüft.
 *   ERR_FAKTEN_UNLESBAR         fakten.json ist kein gültiges JSON.
 *   ERR_FAKTEN_SCHEMA           fakten.json verletzt scripts/schema/fakten.schema.json.
 *   ERR_FAKTEN_EINHEIT          `einheit` nennt einen anderen Ordner (kopierte Datei).
 *   ERR_FAKT_OHNE_ZEILE         Eine Aussage im Text hat keine Zeile in fakten.json.
 *   ERR_FAKT_ZEILE_VERWAIST     Eine Zeile nennt ein Feld, das es nicht gibt, oder ihr Wortlaut steht nicht mehr im Feld.
 *   ERR_FAKT_ABWEICHEND         Urteil «abweichend»: Die Primärquelle sagt etwas anderes.
 *   ERR_FAKT_NICHT_BELEGBAR     Urteil «nicht_belegbar», und die Stelle ist nicht als Fallüberlegung gekennzeichnet.
 *   WARN_FAKT_ABRUF_ALT         Der Abruf der Primärquelle ist älter als zwölf Monate.
 *   WARN_FAKT_QUELLE_NICHT_AMTLICH  Die Primärquelle ist ein Medium oder ein Lexikon, keine amtliche Stelle.
 *   HINWEIS_FALL_FEHLT          fall.json fehlt: Fallzahlen sind nicht ausgenommen, die Liste ist länger als nötig.
 *   HINWEIS_KEIN_V42            Die Einheit ist nicht im Format v4.2 — nichts zu prüfen.
 *
 * Exit 0  keine Fehler (Warnungen und Hinweise möglich)
 * Exit 1  mindestens ein Fehler
 * Exit 2  Aufruf falsch, oder das Quellenarchiv fehlt lokal — dann ist nichts «grün»
 *
 * Reines Node, keine Abhängigkeiten, ohne Netz, nur lesend (ausser --protokoll).
 */
import { aufruf, ladeEinheit, Bericht, schluss, textfelder, RE_FALLKENNZEICHEN, umfeld, datumVon } from './lib/pruefung.mjs'
import { archivWurzel, liesBelegDatei } from './lib/archiv.mjs'
import { ladeSchema, validiere } from './lib/schema.mjs'
import { findeAussagen, fallzahlen, fallzahlenFuer, istFallzahl, ARTEN } from './lib/aussagen.mjs'

const NAME = 'check-fakten'
const A = aufruf(NAME, 'node scripts/check-fakten.mjs <ordner>… | --v42  [--liste] [--streng] [--protokoll <datei>] [--heute JJJJ-MM-TT] [--wurzel <ordner>]', { heute: 'wert' })
const heute = A.opt.heute ? datumVon(A.opt.heute) : new Date()
if (!heute) { console.error(`${NAME}: --heute braucht JJJJ-MM-TT`); process.exit(2) }

const archiv = archivWurzel({ wurzel: A.wurzel })
const norm = (s) => String(s ?? '').normalize('NFKC').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim()
// Felder mit erfundenem Fall: Zahlen und Daten dort sind keine Aussagen über die Welt.
const ERFUNDEN = /(^|\.)beispielbild(\.|$)|(^|\.)beispiel(\[|$)|(^|\.)beispielzeile(\[|$)/
const NUR_IMMER = new Set(['artikel', 'stand', 'abstimmung'])
const NICHT_AMTLICH = /(^|\.)(wikipedia\.org|srf\.ch|nzz\.ch|tagesanzeiger\.ch|20min\.ch|blick\.ch|watson\.ch|beobachter\.ch|comparis\.ch|moneyland\.ch)$/

/** Alle Aussagen einer Einheit: [{ feld, datei, traeger, art, treffer, umfeld, text }]. */
function aussagenVon(E, fz) {
  const out = []
  for (const f of textfelder(E)) {
    const erfunden = ERFUNDEN.test(f.pfad)
    const liste = fallzahlenFuer(fz, f.traeger)
    for (const a of findeAussagen(f.text)) {
      if (erfunden && !NUR_IMMER.has(a.art)) continue
      if (!NUR_IMMER.has(a.art) && liste.length && istFallzahl(a.treffer, liste)) continue
      out.push({ feld: f.feld, datei: f.datei, traeger: f.traeger, art: a.art, treffer: a.treffer, umfeld: umfeld(f.text, a.pos, a.treffer.length), text: f.text })
    }
  }
  return out
}
const zaehle = (liste, k) => { const m = {}; for (const x of liste) m[x[k]] = (m[x[k]] ?? 0) + 1; return m }
const nachArt = (liste) => { const m = zaehle(liste, 'art'); return ARTEN.filter((a) => m[a]).map((a) => `${a} ${m[a]}`).join(' · ') || 'keine' }

function ladeFall(ordner) {
  if (!archiv.pfad) return { vorhanden: false, fz: fallzahlen(null) }
  const d = liesBelegDatei(archiv.pfad, ordner, 'fall')
  return { vorhanden: d.vorhanden && !d.fehler, fz: fallzahlen(d.vorhanden && !d.fehler ? d.daten : null) }
}

if (A.liste) {
  let summe = 0
  for (const o of A.ordner) {
    const E = ladeEinheit(A.wurzel, o)
    const fall = ladeFall(o)
    const liste = aussagenVon(E, fall.fz)
    summe += liste.length
    console.log(`${o} — ${liste.length} Aussagen (${nachArt(liste)})${fall.vorhanden ? '' : ' · ohne fall.json: Fallzahlen nicht ausgenommen'}`)
    console.log(`  je Datei: ${Object.entries(zaehle(liste, 'datei')).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
    for (const a of liste) console.log(`  ${a.art.padEnd(10)} ${a.feld}\n             «${a.umfeld}»`)
    console.log('')
  }
  console.log(`${summe} Aussagen in ${A.ordner.length} Einheit(en).`)
  process.exit(0)
}

if (!archiv.pfad) {
  console.log(`${NAME} — ${A.ordner.length} Einheit(en)\n  HINWEIS Quellenarchiv fehlt lokal (${archiv.grund}) — Fakten NICHT geprüft.\n\nNICHT GEPRUEFT — ohne Archiv gibt es keine fakten.json.`)
  process.exit(2)
}

const berichte = []
for (const ordner of A.ordner) {
  const E = ladeEinheit(A.wurzel, ordner)
  const B = new Bericht(NAME, E, { streng: A.streng })
  berichte.push(B)
  if (!E.v42) { B.hinweis('HINWEIS_KEIN_V42', ordner, 'kein Heft im Format heft_8page_v42 — nichts zu prüfen'); continue }
  const rel = `_pruefung/${ordner}`
  const fall = ladeFall(ordner)
  const liste = aussagenVon(E, fall.fz)
  const datei = liesBelegDatei(archiv.pfad, ordner, 'fakten')
  if (!datei.vorhanden) { B.fehler('ERR_FAKTEN_FEHLT', `${rel}/fakten.json`, `nicht auditiert: ${liste.length} Aussagen ohne Beleg (${nachArt(liste)})${fall.vorhanden ? '' : ' — ohne fall.json gezählt'}`); continue }
  if (datei.fehler) { B.fehler('ERR_FAKTEN_UNLESBAR', `${rel}/fakten.json`, 'kein gültiges JSON'); continue }
  if (!fall.vorhanden) B.hinweis('HINWEIS_FALL_FEHLT', `${rel}/fall.json`, 'fehlt — Fallzahlen sind nicht ausgenommen')

  const v = validiere(ladeSchema('fakten'), datei.daten)
  for (const x of v.slice(0, 12)) B.fehler('ERR_FAKTEN_SCHEMA', `${rel}/fakten.json`, x)
  if (datei.daten.einheit !== ordner) B.fehler('ERR_FAKTEN_EINHEIT', `${rel}/fakten.json › einheit`, `«${datei.daten.einheit}» — die Datei gehört nicht zu dieser Einheit`)
  const zeilen = (Array.isArray(datei.daten.zeilen) ? datei.daten.zeilen : []).filter((z) => z && typeof z === 'object')

  const felder = new Map(textfelder(E).map((f) => [f.feld, f]))
  const begleiterTexte = [...felder.values()].filter((f) => f.datei === 'begleiter.md')
  /** Felder, in denen der Wortlaut einer Zeile wirklich steht. Im Begleiter zählt jeder Absatz (die Zählung verschiebt sich mit jeder Änderung). */
  const orte = (z) => {
    const w = norm(z.wortlaut_im_heft)
    const out = []
    for (const name of [z.feld, ...(Array.isArray(z.auch_in) ? z.auch_in : [])]) {
      if (typeof name !== 'string') continue
      if (name.startsWith('begleiter.md')) out.push(...begleiterTexte.filter((f) => norm(f.text).includes(w)).map((f) => f.feld))
      else if (felder.has(name) && norm(felder.get(name).text).includes(w)) out.push(name)
    }
    return out
  }
  const zeilenOrte = zeilen.map((z) => ({ z, orte: new Set(orte(z)), w: norm(z.wortlaut_im_heft) }))

  for (const [i, { z, orte: o }] of zeilenOrte.entries()) {
    const wo = typeof z.feld === 'string' ? z.feld : `${rel}/fakten.json › zeilen[${i}]`
    const gemeint = [z.feld, ...(Array.isArray(z.auch_in) ? z.auch_in : [])].filter((x) => typeof x === 'string')
    for (const name of gemeint) {
      const da = name.startsWith('begleiter.md') ? [...o].some((x) => x.startsWith('begleiter.md')) : o.has(name)
      if (!da) B.fehler('ERR_FAKT_ZEILE_VERWAIST', name, `Zeile ${i + 1}: ${name.startsWith('begleiter.md') || felder.has(name) ? 'der Wortlaut der Zeile steht nicht (mehr) im Feld — neu prüfen' : 'dieses Feld gibt es nicht'}`)
    }
    if (z.urteil === 'abweichend') B.fehler('ERR_FAKT_ABWEICHEND', wo, `Zeile ${i + 1}: Urteil «abweichend» (Art ${z.art ?? '—'}, Abruf ${z.abgerufen_am ?? '—'})`, z.wortlaut_im_heft ? `· «${z.wortlaut_im_heft}»` : '')
    if (z.urteil === 'nicht_belegbar') {
      const gekennzeichnet = [...o].some((name) => RE_FALLKENNZEICHEN.test(felder.get(name)?.text ?? ''))
      if (!gekennzeichnet) B.fehler('ERR_FAKT_NICHT_BELEGBAR', wo, `Zeile ${i + 1}: Urteil «nicht_belegbar», und das Feld kennzeichnet die Aussage nicht als Fallüberlegung oder Annahme`, z.wortlaut_im_heft ? `· «${z.wortlaut_im_heft}»` : '')
    }
    const abruf = datumVon(z.abgerufen_am)
    if (abruf && heute - abruf > 366 * 86400000) B.warnung('WARN_FAKT_ABRUF_ALT', wo, `Zeile ${i + 1}: Abruf ${z.abgerufen_am} ist älter als zwölf Monate`)
    let host = ''
    try { host = z.primaerquelle ? new URL(z.primaerquelle).hostname.replace(/^www\./, '') : '' } catch { /* Schema meldet es */ }
    if (host && NICHT_AMTLICH.test(host)) B.warnung('WARN_FAKT_QUELLE_NICHT_AMTLICH', wo, `Zeile ${i + 1}: Primärquelle ${host} ist keine amtliche Stelle`)
  }

  // Jede gefundene Aussage braucht eine Zeile, deren Wortlaut im selben Feld steht und den Treffer enthält.
  for (const a of liste) {
    const t = norm(a.treffer)
    const hat = zeilenOrte.some(({ orte: o, w }) => w.includes(t) && o.has(a.feld))
    if (!hat) B.fehler('ERR_FAKT_OHNE_ZEILE', a.feld, `Aussage der Art ${a.art} ohne Zeile in fakten.json`, `· «${a.umfeld}»`)
  }
}
schluss(NAME, berichte, { protokoll: A.protokoll, vorspann: [`  Archiv ${archiv.pfad}`] })
