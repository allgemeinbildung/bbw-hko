#!/usr/bin/env node
/**
 * check-zahlen.mjs — rechnet nach, was im Text einer Einheit gerechnet wird, und
 * prüft, dass jede Fallzahl überall denselben Wert hat (ENTSCHEIDE E38).
 *
 *   node scripts/check-zahlen.mjs <ordner> [<ordner> …]
 *   node scripts/check-zahlen.mjs --v42                  # alle Einheiten im Format v4.2
 *   … --liste                                            # gefundene Rechnungen und Zahlen mit Einheit (Arbeitsliste für fall.json)
 *   … --streng                                           # jede Einheit wie ein Entwurf: Befunde sind Fehler
 *   … --protokoll <datei>                                # Fassung ohne Textauszug
 *   … --wurzel <ordner>                                  # anderer Baum statt dieses Repos (Gegenproben)
 *
 * Geprüft wird:
 *   RECHNUNG   «a × b = c», «a + b + c = d», «a − b = c», «a : b = c», «p % von a = c»,
 *              «a von b sind p %» im Text der Hefte, Lösungen, des Auftrags, des KN, des
 *              Begleiters und der Karten. Gerundet wird auf die Stellen des Ergebnisses;
 *              steht «rund», «ca.», «etwa», «gut» oder «knapp» davor, gelten 5 %.
 *   SUMME      Tabellen der Situation, des Beispiel- und des Lösungsbilds: Eine Zeile
 *              «Total», «Summe», «Zusammen», «Gesamt» ist die Summe der Zeilen darüber.
 *   FALLZAHL   Jede Zahl aus `<Quellenarchiv>/_pruefung/<ordner>/fall.json` steht im Text
 *              ihres Hefts; steht ihr Name bei einer Zahl gleicher Einheit, ist es ihr Wert.
 *              Dasselbe gilt ohne fall.json für die Zeilen der `zahlen_tabelle` (Name = label).
 *   AUSSCHLUSS Was die Situation laut fall.json ausschliesst (ein Wochentag, ein Datum),
 *              zeigen Beispiel (S. 6), Lösungsbild und Lösungen nicht als möglich.
 *
 * Codes:
 *   ERR_FALL_FEHLT              fall.json fehlt — die Fallzahlen sind nicht erfasst (nur zahlen_tabelle geprüft).
 *   ERR_FALL_UNLESBAR           fall.json ist kein gültiges JSON.
 *   ERR_FALL_SCHEMA             fall.json verletzt scripts/schema/fall.schema.json.
 *   ERR_FALL_EINHEIT            `einheit` nennt einen anderen Ordner (kopierte Datei).
 *   ERR_FALL_DOPPELT            fall.json führt denselben Namen mit zwei Werten.
 *   ERR_RECHNUNG_FALSCH         Eine Rechnung im Text geht nicht auf.
 *   ERR_ZAHL_SUMME              Die Summenzeile einer Tabelle ist nicht die Summe der Zeilen darüber.
 *   ERR_FALLZAHL_ABWEICHEND     Der Name einer Fallzahl steht bei einer Zahl gleicher Einheit mit anderem Wert.
 *   ERR_FALLZAHL_NICHT_IM_TEXT  Eine Fallzahl aus fall.json kommt im Text ihres Hefts nicht vor.
 *   ERR_FALL_AUSGESCHLOSSEN     Beispiel, Lösungsbild oder Lösung zeigt etwas, das die Situation ausschliesst.
 *   HINWEIS_KEIN_V42            Die Einheit ist nicht im Format v4.2 — nichts zu prüfen.
 *
 * Exit 0  keine Fehler (Warnungen und Hinweise möglich)
 * Exit 1  mindestens ein Fehler
 * Exit 2  Aufruf falsch, oder das Quellenarchiv fehlt lokal — dann ist nichts «grün»
 *
 * Reines Node, keine Abhängigkeiten, ohne Netz, nur lesend (ausser --protokoll).
 */
import { aufruf, ladeEinheit, Bericht, schluss, textfelder, umfeld } from './lib/pruefung.mjs'
import { archivWurzel, liesBelegDatei } from './lib/archiv.mjs'
import { ladeSchema, validiere } from './lib/schema.mjs'
import { findeAussagen, zahlWert, einheitKlasse } from './lib/aussagen.mjs'

const NAME = 'check-zahlen'
const A = aufruf(NAME, 'node scripts/check-zahlen.mjs <ordner>… | --v42  [--liste] [--streng] [--protokoll <datei>] [--wurzel <ordner>]')
const archiv = archivWurzel({ wurzel: A.wurzel })

// ---------------------------------------------------------------- Rechnungen

// Felder mit erfundenem, neutralem Fall (Beispielbild, Beispiel einer Karte): Ihre Zahlen sind nicht die der Situation.
const ERFUNDEN = /(^|\.)beispielbild(\.|$)|(^|\.)beispiel(\[|$)|(^|\.)beispielzeile(\[|$)/
const esc = (s) => s.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&')
const NUM = String.raw`\d[\d'’.,]*\d|\d`
const WAEHR = String.raw`(?:(?:CHF|Fr\.|SFr\.)\s?)?`
// Nach der Zahl höchstens ein Einheitswort («Franken», «%», «Monate», «Mio.») — nie der Operator «x».
const EINH = String.raw`(?:\.–|\.-)?(?:\s?(?:%|(?!x\b)[A-Za-zÄÖÜäöü]{1,14}\.?))?`
const OPND = String.raw`${WAEHR}(?:${NUM})${EINH}`
// × · + ÷ − dürfen kleben; x * : / - – brauchen Leerraum (Seitenbereich «128-131», Uhrzeit «12:30», Bruch «1/2»).
const OP = String.raw`(?:\s?[×·+÷−]\s?|\s[x*:/–-]\s)`
const RE_LINKS = new RegExp(String.raw`(${OPND}(?:${OP}${OPND})+)\s?$`)
const RE_RECHTS = new RegExp(String.raw`^\s?((?:rund|ca\.|circa|etwa|gut|knapp|fast|ungefähr)\s)?${WAEHR}(${NUM})(?:\.–|\.-)?(\s?(?:%|Prozent))?`)
const UNGEFAEHR = String.raw`((?:rund|ca\.|circa|etwa|gut|knapp|fast|ungefähr)\s)?`
const RE_PROZENT_VON = new RegExp(String.raw`(${NUM})\s?(?:%|Prozent)\s(?:von|auf)\s${WAEHR}(${NUM})(\s?(?:Mio\.|Mrd\.|Millionen|Milliarden))?[^=.;:\n%]{0,25}?(?:=|\bsind\b|\bergibt\b|\bergeben\b|\bmacht\b)\s?${UNGEFAEHR}${WAEHR}(${NUM})(\s?(?:Mio\.|Mrd\.|Millionen|Milliarden))?(?!\s?(?:%|Prozent))`, 'g')
const RE_ANTEIL = new RegExp(String.raw`(?<![\d'’.,])${WAEHR}(${NUM})\s(?:von|auf)\s${WAEHR}(${NUM})[^=.;:\n%]{0,25}?(?:=|\bsind\b|\bentspricht\b|\bentsprechen\b|\bergibt\b)\s?${UNGEFAEHR}(${NUM})\s?(?:%|Prozent)`, 'g')

const stellen = (s) => { const t = String(s).replace(/['’]/g, '').replace(/[.,]+$/, ''); const m = /[.,](\d+)$/.exec(t); return m && !/^\d{1,3}(\.\d{3})+$/.test(t) ? m[1].length : 0 }
const nahe = (ist, soll, sollText, ungefaehr) => (ungefaehr ? Math.abs(ist - soll) <= Math.max(Math.abs(soll) * 0.05, 0.5) : Math.abs(ist - soll) <= 0.5 * 10 ** -stellen(sollText) + 1e-9)
const zeige = (n) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000))

/** Rechnungen in einem Text: [{ ausdruck, ist, soll, ok, pos }]. */
function rechnungenIn(text) {
  const t = String(text ?? '')
  const out = []
  for (let i = t.indexOf('='); i >= 0; i = t.indexOf('=', i + 1)) {
    const links = RE_LINKS.exec(t.slice(Math.max(0, i - 140), i))
    const rechts = RE_RECHTS.exec(t.slice(i + 1, i + 60))
    if (!links || !rechts) continue
    const ausdr = links[1]
    const werte = []; const prozent = []; const ops = []
    let letzte = 0
    for (const m of ausdr.matchAll(new RegExp(String.raw`${WAEHR}(${NUM})(\.–|\.-)?(\s?%)?`, 'g'))) {
      if (werte.length) {
        const zw = ausdr.slice(letzte, m.index)
        const op = /[×·*x]\s?$/.test(zw) ? '*' : /[÷:/]\s?$/.test(zw) ? '/' : /\+\s?$/.test(zw) ? '+' : /[−–-]\s?$/.test(zw) ? '-' : null
        if (!op) { werte.length = 0; break }
        ops.push(op)
      }
      werte.push(zahlWert(m[1])); prozent.push(!!m[3])
      letzte = m.index + m[0].length
    }
    if (werte.length < 2 || werte.some((w) => w === null)) continue
    const soll = zahlWert(rechts[2])
    if (soll === null) continue
    const ergProzent = !!rechts[3]
    const alleProzent = prozent.every(Boolean)
    // «a × 10 %»: Prozent als Faktor — ausser alle Glieder sind Prozente (dann sind es Punkte).
    const v = werte.map((w, k) => (prozent[k] && !alleProzent && !ergProzent ? w / 100 : w))
    // Punkt vor Strich.
    const sum = [v[0]]; const sops = []
    for (let k = 0; k < ops.length; k++) {
      if (ops[k] === '*') sum[sum.length - 1] *= v[k + 1]
      else if (ops[k] === '/') sum[sum.length - 1] /= v[k + 1]
      else { sops.push(ops[k]); sum.push(v[k + 1]) }
    }
    let ist = sum[0]
    sops.forEach((o, k) => { ist = o === '+' ? ist + sum[k + 1] : ist - sum[k + 1] })
    // «24 : 262 = 9,2 %»: Quotient als Prozent.
    if (ergProzent && !prozent.some(Boolean) && ops.includes('/')) ist *= 100
    if (!Number.isFinite(ist)) continue
    out.push({ ausdruck: `${ausdr.trim()} = ${rechts[0].trim()}`, ist, soll, ok: nahe(ist, soll, rechts[2], !!rechts[1]), pos: i })
  }
  const mio = (s) => (/Mrd|Milliarden/.test(s ?? '') ? 1e9 : /Mio|Millionen/.test(s ?? '') ? 1e6 : 1)
  for (const m of t.matchAll(RE_PROZENT_VON)) {
    const ist = (zahlWert(m[1]) / 100) * zahlWert(m[2]) * mio(m[3]); const soll = zahlWert(m[5]) * mio(m[6])
    const tol = mio(m[6]) > 1 ? Math.abs(ist - soll) <= 0.5 * 10 ** -stellen(m[5]) * mio(m[6]) + 1e-6 : nahe(ist, soll, m[5], !!m[4])
    out.push({ ausdruck: m[0].trim(), ist, soll, ok: tol || (!!m[4] && Math.abs(ist - soll) <= Math.abs(soll) * 0.05), pos: m.index })
  }
  for (const m of t.matchAll(RE_ANTEIL)) {
    const a = zahlWert(m[1]); const b = zahlWert(m[2]); const soll = zahlWert(m[4])
    if (!b) continue
    const ist = (a / b) * 100
    out.push({ ausdruck: m[0].trim(), ist, soll, ok: nahe(ist, soll, m[4], !!m[3]), pos: m.index })
  }
  return out
}

// ------------------------------------------------------------------- Tabellen

const RE_SUMME = /^\s*(?:\*\*)?(?:Total|Summe|Zusammen|Gesamt(?:betrag|kosten|total)?|Insgesamt)\b/i
const zellZahl = (s) => { const t = String(s ?? '').trim(); const m = new RegExp(String.raw`^${WAEHR}(${NUM})(?:\.–|\.-)?(?:\s?(?:CHF|Fr\.|Franken|%))?$`).exec(t); return m ? zahlWert(m[1]) : null }

/** Tabellen einer Heftdatei: [{ pfad, zeilen: string[][] }] — Situation, Beispielbild, Lösungsbild. */
function tabellenVon(json, basis = '') {
  const out = []
  if (Array.isArray(json?.zahlen_tabelle)) out.push({ pfad: `${basis}zahlen_tabelle`, zeilen: json.zahlen_tabelle.map((z) => [z?.label ?? '', z?.wert ?? '']) })
  for (const bild of ['beispielbild', 'loesungsbild']) {
    ;(json?.handlungsprodukt?.[bild]?.bloecke ?? []).forEach((b, i) => {
      if (Array.isArray(b?.zeilen)) out.push({ pfad: `handlungsprodukt.${bild}.bloecke[${i}]`, zeilen: b.zeilen.map((z) => (z?.zellen ?? []).map(String)) })
    })
  }
  return out
}

// ------------------------------------------------------------------ Fallzahlen

const kernwoerter = (name) => (String(name).toLowerCase().match(/[a-zäöü]{4,}|\d[\d'’]*/g) ?? []).filter((w) => !['eine', 'einer', 'einem', 'einen', 'oder', 'mein', 'meine', 'meiner', 'meinem', 'meinen', 'nach', 'beim', 'unter', 'über', 'jede', 'jeden', 'jeder', 'pro', 'laut', 'wert'].includes(w))
const stamm = (w) => (/^\d/.test(w) ? w.replace(/['’]/g, '') : w.slice(0, Math.max(4, Math.min(w.length, 6))))

/**
 * Sucht den Namen einer Fallzahl im Text und vergleicht die Zahl daneben.
 * Treffer nur, wenn ALLE Kernwörter des Namens im Fenster stehen (±90 Zeichen um die Zahl,
 * im selben Satz) und die Zahl dieselbe Einheitsklasse hat.
 */
function abweichungen(fz, felder) {
  const out = []
  const kw = kernwoerter(fz.name).map(stamm)
  if (!kw.length || typeof fz.wert !== 'number' || !fz.klasse) return out
  for (const f of felder) {
    const klein = f.text.toLowerCase().replace(/['’]/g, '')
    if (!kw.every((w) => klein.includes(w))) continue
    for (const a of findeAussagen(f.text)) {
      if (!['betrag', 'prozent', 'frist', 'zahl'].includes(a.art)) continue
      const wert = zahlWert(a.treffer)
      if (wert === null || einheitKlasse(a.treffer.replace(/[\d'’.,]/g, ' ')) !== fz.klasse) continue
      const von = Math.max(f.text.lastIndexOf('. ', a.pos) + 1, f.text.lastIndexOf('\n', a.pos) + 1, a.pos - 90)
      let bis = Math.min(a.pos + a.treffer.length + 90, f.text.length)
      for (const grenze of ['. ', '\n']) { const g = f.text.indexOf(grenze, a.pos + a.treffer.length); if (g >= 0 && g < bis) bis = g }
      // Die Zahlen des Namens selbst («Franchise 300») gehören zum Namen, nicht zum Wert.
      const fenster = (f.text.slice(von, a.pos) + ' ' + f.text.slice(a.pos + a.treffer.length, bis)).toLowerCase().replace(/['’]/g, '')
      if (!kw.every((w) => fenster.includes(w))) continue
      if (kw.includes(String(wert)) && wert !== fz.wert) continue
      if (wert !== fz.wert) out.push({ feld: f.feld, wert, umfeld: umfeld(f.text, a.pos, a.treffer.length) })
    }
  }
  return out
}

// ----------------------------------------------------------------------- Lauf

if (A.liste) {
  for (const o of A.ordner) {
    const E = ladeEinheit(A.wurzel, o)
    const felder = textfelder(E)
    const rechn = felder.flatMap((f) => rechnungenIn(f.text).map((r) => ({ ...r, feld: f.feld })))
    console.log(`${o} — ${rechn.length} Rechnungen (${rechn.filter((r) => !r.ok).length} gehen nicht auf)`)
    for (const r of rechn) console.log(`  ${r.ok ? 'ok    ' : 'FALSCH'}  ${r.feld}\n          «${r.ausdruck}»${r.ok ? '' : `  → gerechnet ${zeige(r.ist)}`}`)
    const zahlen = new Map()
    for (const f of felder) for (const a of findeAussagen(f.text)) {
      if (!['betrag', 'prozent', 'frist', 'zahl'].includes(a.art)) continue
      const k = a.treffer.replace(/\s+/g, ' ')
      const e = zahlen.get(k) ?? zahlen.set(k, { art: a.art, n: 0, traeger: new Set() }).get(k)
      e.n++; e.traeger.add(f.traeger)
    }
    console.log(`  Zahlen mit Einheit: ${zahlen.size} verschiedene`)
    for (const [k, e] of [...zahlen].sort((a, b) => b[1].n - a[1].n)) console.log(`    ${String(e.n).padStart(3)}×  ${e.art.padEnd(8)} ${k.padEnd(28)} ${[...e.traeger].join(', ')}`)
    console.log('')
  }
  process.exit(0)
}

const berichte = []
for (const ordner of A.ordner) {
  const E = ladeEinheit(A.wurzel, ordner)
  const B = new Bericht(NAME, E, { streng: A.streng })
  berichte.push(B)
  if (!E.v42) { B.hinweis('HINWEIS_KEIN_V42', ordner, 'kein Heft im Format heft_8page_v42 — nichts zu prüfen'); continue }
  const rel = `_pruefung/${ordner}`
  const felder = textfelder(E)

  // RECHNUNG
  for (const f of felder) for (const r of rechnungenIn(f.text)) if (!r.ok) B.fehler('ERR_RECHNUNG_FALSCH', f.feld, `gerechnet ${zeige(r.ist)}, im Text ${zeige(r.soll)}`, `· «${r.ausdruck}»`)

  // SUMME
  for (const h of E.hefte) for (const tab of tabellenVon(h.json)) pruefeSummen(B, `${h.datei} › ${tab.pfad}`, tab.zeilen)
  const ga = E.json['set.json']?.gemeinsamer_auftrag
  if (ga) for (const tab of tabellenVon({ zahlen_tabelle: ga.zahlen_tabelle }, 'gemeinsamer_auftrag.')) pruefeSummen(B, `set.json › ${tab.pfad}`, tab.zeilen)

  // FALLZAHL — aus fall.json, sonst (und zusätzlich) aus der zahlen_tabelle.
  const fall = archiv.pfad ? liesBelegDatei(archiv.pfad, ordner, 'fall') : { vorhanden: false }
  const zahlen = [] // { name, wert, klasse, traeger, herkunft, schreibweisen }
  let ausgeschlossen = []
  if (!archiv.pfad) { /* Schlusszeile sagt es */ } else if (!fall.vorhanden) B.fehler('ERR_FALL_FEHLT', `${rel}/fall.json`, 'Fallzahlen nicht erfasst — geprüft sind nur Rechnungen, Summen und die Zeilen der zahlen_tabelle')
  else if (fall.fehler) B.fehler('ERR_FALL_UNLESBAR', `${rel}/fall.json`, 'kein gültiges JSON')
  else {
    const v = validiere(ladeSchema('fall'), fall.daten)
    for (const x of v.slice(0, 12)) B.fehler('ERR_FALL_SCHEMA', `${rel}/fall.json`, x)
    if (fall.daten.einheit !== ordner) B.fehler('ERR_FALL_EINHEIT', `${rel}/fall.json › einheit`, `«${fall.daten.einheit}» — die Datei gehört nicht zu dieser Einheit`)
    for (const [traeger, f] of Object.entries(fall.daten.faelle ?? {})) {
      const namen = new Map()
      for (const z of f?.zahlen ?? []) {
        if (namen.has(z.name) && namen.get(z.name) !== z.wert) B.fehler('ERR_FALL_DOPPELT', `${rel}/fall.json › faelle.${traeger}`, `«${z.name}» steht mit zwei Werten (${namen.get(z.name)} und ${z.wert})`)
        namen.set(z.name, z.wert)
        zahlen.push({ name: z.name, wert: z.wert, einheit: z.einheit ?? '', klasse: einheitKlasse(z.einheit), traeger, herkunft: 'fall.json', schreibweisen: z.schreibweisen ?? [] })
      }
      for (const a of f?.ausgeschlossen ?? []) ausgeschlossen.push({ ...a, traeger })
    }
  }
  const tabelle = (traeger, liste) => (liste ?? []).forEach((z) => {
    const wert = zellZahl(z?.wert)
    if (wert === null || !z?.label || zahlen.some((x) => x.traeger === traeger && x.name === z.label)) return
    zahlen.push({ name: z.label, wert, einheit: z.wert, klasse: einheitKlasse(String(z.wert).replace(/[\d'’.,]/g, ' ')), traeger, herkunft: 'zahlen_tabelle', schreibweisen: [] })
  })
  for (const h of E.hefte) tabelle(h.heft, h.json.zahlen_tabelle)
  tabelle('auftrag', ga?.zahlen_tabelle)

  const felderVon = (traeger) => felder.filter((f) => (traeger === 'auftrag' ? f.datei === 'set.json' && f.pfad.startsWith('gemeinsamer_auftrag') : f.traeger === traeger) && !/zahlen_tabelle/.test(f.pfad) && !ERFUNDEN.test(f.pfad))
  for (const z of zahlen) {
    const eigene = felderVon(z.traeger)
    if (z.herkunft === 'fall.json') {
      const schreib = [String(z.wert), ...z.schreibweisen].map((s) => String(s).toLowerCase().replace(/['’\s]/g, ''))
      const alleFelder = felder.filter((f) => (z.traeger === 'auftrag' ? f.datei === 'set.json' : f.traeger === z.traeger))
      if (!alleFelder.some((f) => { const t = f.text.toLowerCase().replace(/['’\s]/g, ''); return schreib.some((s) => s && new RegExp(`(?<![\\d.,])${esc(s)}(?![\\d])`).test(t)) })) B.fehler('ERR_FALLZAHL_NICHT_IM_TEXT', `${rel}/fall.json › faelle.${z.traeger}`, `«${z.name}» (${z.wert} ${z.einheit}) kommt im Text von ${z.traeger === 'auftrag' ? 'set.json' : `Heft ${z.traeger}`} nicht vor`)
    }
    // Vergleich im eigenen Träger und im Begleiter (der beide Hefte bespricht — dort nur, wenn der Name eindeutig ist).
    const mehrdeutig = zahlen.filter((x) => x.name === z.name && x.wert !== z.wert).length > 0
    const suchfelder = [...eigene, ...(mehrdeutig ? [] : felder.filter((f) => f.traeger === 'begleiter'))]
    for (const a of abweichungen(z, suchfelder)) {
      // Eine andere Fallzahl mit denselben Kernwörtern und genau diesem Wert ist kein Widerspruch.
      if (zahlen.some((x) => x !== z && x.wert === a.wert && x.klasse === z.klasse && (x.traeger === z.traeger || a.feld.startsWith('begleiter')))) continue
      B.fehler('ERR_FALLZAHL_ABWEICHEND', a.feld, `«${z.name}» ist laut ${z.herkunft} ${z.wert}; hier steht bei demselben Namen ${a.wert}`, `· «${a.umfeld}»`)
    }
  }

  // AUSSCHLUSS
  const NEIN = /\b(?:nicht|kein|keine|keinen|keinem|ausser|ohne|statt|fällt weg|entfällt|besetzt|belegt|ausgeschlossen|geht nicht|unmöglich|nie)\b/i
  for (const a of ausgeschlossen) {
    const ziel = felder.filter((f) => (a.traeger === 'auftrag' ? f.datei === 'set.json' && /erwartungshorizont/.test(f.pfad) : f.traeger === a.traeger && (/beispielbild|loesungsbild|(^|\.)loesung(\.|$)|loesung_zeilen|\.erwartung$/.test(f.pfad))))
    for (const w of a.werte ?? []) {
      const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc(String(w))}(?![\\p{L}\\p{N}])`, 'iu')
      for (const f of ziel) {
        const m = re.exec(f.text)
        if (!m) continue
        const satz = f.text.slice(Math.max(f.text.lastIndexOf('. ', m.index) + 1, 0), (f.text.indexOf('. ', m.index) + 1) || f.text.length)
        if (NEIN.test(satz)) continue
        B.fehler('ERR_FALL_AUSGESCHLOSSEN', f.feld, `zeigt «${w}» (${a.was}) — die Situation schliesst das aus${a.grund ? `: ${a.grund}` : ''}`)
      }
    }
  }
}

function pruefeSummen(B, wo, zeilen) {
  zeilen.forEach((z, i) => {
    // Nur die eindeutige Form: genau eine Summenzeile, und sie ist die letzte. Mehrere «Total …»-Zeilen
    // sind je eine eigene Rechnung (Fall 1, Fall 2 …) — die prüft RECHNUNG, wo sie ausgeschrieben ist.
    if (!RE_SUMME.test(z[0] ?? '') || i < 2 || i !== zeilen.length - 1 || zeilen.filter((r) => RE_SUMME.test(r[0] ?? '')).length !== 1) return
    for (let c = 1; c < z.length; c++) {
      const soll = zellZahl(z[c])
      if (soll === null) continue
      const oben = zeilen.slice(0, i).filter((r) => !RE_SUMME.test(r[0] ?? '')).map((r) => zellZahl(r[c]))
      if (oben.length < 2 || oben.some((x) => x === null)) continue
      const ist = oben.reduce((a, b) => a + b, 0)
      if (Math.abs(ist - soll) > 0.005) B.fehler('ERR_ZAHL_SUMME', `${wo} › Zeile ${i + 1}, Spalte ${c + 1}`, `Summe der ${oben.length} Zeilen darüber ist ${zeige(ist)}, in der Zeile steht ${zeige(soll)}`)
    }
  })
}

schluss(NAME, berichte, {
  protokoll: A.protokoll,
  vorspann: [`  Archiv ${archiv.pfad ?? 'fehlt lokal'}`],
  nichtGeprueft: archiv.pfad ? '' : `Quellenarchiv fehlt lokal (${archiv.grund}): fall.json nicht gelesen.`,
})
