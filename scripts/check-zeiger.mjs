#!/usr/bin/env node
/**
 * check-zeiger.mjs — jeder Zeiger einer Einheit zeigt auf etwas, das es gibt:
 * Archivordner, Wortzahl, Absatz, Zeitmarke, Heftseite, Lehrmittelseite (ENTSCHEIDE E38).
 *
 *   node scripts/check-zeiger.mjs <ordner> [<ordner> …]
 *   node scripts/check-zeiger.mjs --v42                  # alle Einheiten im Format v4.2
 *   … --export <ordner>                                  # Ausgabe von export-v42.mjs dieser EINEN Einheit: prüft
 *                                                        # zusätzlich am gedruckten Seitentext (dieses Skript exportiert nie selbst)
 *   … --streng                                           # jede Einheit wie ein Entwurf: Befunde sind Fehler
 *   … --protokoll <datei>                                # Fassung für den Laufordner
 *   … --wurzel <ordner>                                  # anderer Baum statt dieses Repos (Gegenproben)
 *
 * Geprüft wird:
 *   KARTE       je Quellenkarte der Einheit: `archiv_ref` zeigt auf einen Ordner mit quelle.md ·
 *               `woerter` stimmt mit dem Archivtext des Ausschnitts (±5 %) · `absaetze`: kein
 *               Absatz über der Absatzzahl des Archivtexts · `von` < `bis`, `dauer_sek` = bis − von,
 *               `bis` nicht nach der letzten Zeile des Transkripts
 *   IM HEFT     Zeitmarken und Absätze, die Heft oder Lösung der Medien-Spur nennen, liegen
 *               im Ausschnitt einer Karte dieses Hefts
 *   HEFTSEITE   «S. n» in Schritten, Hinweisen, Checkliste, Lösungen, Auftragsbogen und
 *               Begleiter: Die Seite gibt es (1–8, Bogen A1–A4), und nennt der Verweis ein
 *               Element mit festem Ort (Raster, Denkhilfe, Checkliste …), steht es auf dieser
 *               Seite. Die Zuordnung Feld → Seite ist am Renderer abgelesen (lib/pruefung.mjs,
 *               ELEMENT_SEITEN); mit --export wird zusätzlich der gedruckte Text der Seite gelesen.
 *   SCHRITT     jeder Schritt-Hinweis nennt eine Seite (Heft: «S. n»; Bogen: «A1–A4», ein Heft
 *               oder ein eigenes Blatt)
 *   LEHRMITTEL  «Kap. x.y, S. n» in Heften, Lösungen, Karten und Begleiter: Die Kapiteldatei
 *               gibt es, und die Seite liegt darin (Marker `[seite: N]`)
 *
 * Codes:
 *   ERR_ZEIGER_ARCHIV_REF        Die Karte hat kein `archiv_ref`, oder es zeigt nicht auf «<id>/gewaehlt».
 *   ERR_ZEIGER_ARCHIV_FEHLT      Den Ordner aus `archiv_ref` gibt es im Archiv nicht, oder er hat keine quelle.md.
 *   ERR_ZEIGER_WOERTER           `woerter` weicht um mehr als 5 % vom Archivtext des Ausschnitts ab.
 *   ERR_ZEIGER_ABSATZ            `verortung.absaetze` nennt einen Absatz über der Absatzzahl des Archivtexts.
 *   ERR_ZEIGER_ZEIT              `von`/`bis` stimmen nicht: von ≥ bis, `dauer_sek` ≠ bis − von, oder `bis` liegt nach dem Ende des Transkripts.
 *   ERR_ZEIGER_ZEIT_AUSSERHALB   Heft oder Lösung nennt eine Zeitmarke ausserhalb des Ausschnitts jeder Karte des Hefts.
 *   ERR_ZEIGER_ABSATZ_AUSSERHALB Heft oder Lösung nennt einen Absatz, den keine Karte des Hefts im Ausschnitt hat.
 *   ERR_ZEIGER_SEITE             Ein Verweis nennt eine Heftseite über 8 bzw. eine Bogenseite über A4.
 *   ERR_ZEIGER_SEITE_ELEMENT     Das genannte Element steht nicht auf der genannten Seite.
 *   ERR_ZEIGER_SCHRITT_OHNE_SEITE Ein Schritt-Hinweis sagt nicht, auf welcher Seite gearbeitet wird.
 *   ERR_ZEIGER_KAPITEL           Zum genannten Kapitel gibt es keine Kapiteldatei.
 *   ERR_ZEIGER_LEHRMITTEL_SEITE  Die genannte Seite liegt nicht im genannten Kapitel.
 *   HINWEIS_ZEIT_NUR_BLOCK       Transkript der Karte in Blöcken: Zeitmarken sind nur auf den Block genau prüfbar.
 *   HINWEIS_ZEIT_NICHT_PRUEFBAR  Audio/Video ohne Zeitmarken im Archivtext: Zeitmarken dieser Karte sind nicht geprüft.
 *   HINWEIS_ZEIT_VERMERK         Der Kopf der Archivdatei nennt die Zeitmarken berechnet, geschätzt oder nicht gegengehört.
 *   HINWEIS_WOERTER_NICHT_PRUEFBAR Der Ausschnitt ist am Archivtext nicht abgrenzbar (freie Beschreibung): Wortzahl nicht nachgezählt.
 *   HINWEIS_LEHRMITTEL_FEHLT     Das Lehrmittel fehlt lokal: Lehrmittelseiten sind nicht geprüft.
 *   HINWEIS_EXPORT_UNPASSEND     --export enthält keine Datei dieses Hefts: Seitentext nicht gelesen.
 *   HINWEIS_KEIN_V42             Die Einheit ist nicht im Format v4.2 — nichts zu prüfen.
 *
 * Exit 0  keine Fehler (Warnungen und Hinweise möglich)
 * Exit 1  mindestens ein Fehler
 * Exit 2  Aufruf falsch, oder Archiv bzw. Lehrmittel fehlt lokal — dann ist nichts «grün»
 *
 * Reines Node, keine Abhängigkeiten, ohne Netz, nur lesend (ausser --protokoll).
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { aufruf, ladeEinheit, Bericht, schluss, textfelder, zeitmarkenIn, seitenIn, absaetzeIn, lehrmittelVerweise, ELEMENT_SEITEN, HEFT_SEITEN, BOGEN_SEITEN, ERFUNDEN } from './lib/pruefung.mjs'
import { archivWurzel, lehrmittelWurzel, ladeArchivtext, ausschnittDerKarte, kapitelDateien, ladeKapitel, parseZeit, formatZeit, kopfFeld } from './lib/archiv.mjs'
import { seitenAusHtml } from './lib/seitentext.mjs'

const NAME = 'check-zeiger'
const A = aufruf(NAME, 'node scripts/check-zeiger.mjs <ordner>… | --v42  [--export <ordner>] [--streng] [--protokoll <datei>] [--wurzel <ordner>]', { export: 'wert' })
if (A.opt.export && A.ordner.length !== 1) { console.error(`${NAME}: --export gilt für genau eine Einheit`); process.exit(2) }
if (A.opt.export && !existsSync(A.opt.export)) { console.error(`${NAME}: kein Ordner ${A.opt.export}`); process.exit(2) }

const archiv = archivWurzel({ wurzel: A.wurzel })
const lehrmittel = lehrmittelWurzel({ wurzel: A.wurzel })
const TOL_WOERTER = 0.05
const NACHLAUF_SEK = 45 // die letzte Zeile eines Transkripts dauert selbst noch einige Sekunden

const kapitelSeiten = new Map()
/** Seitenzahlen aller Dateien eines Kapitels — null, wenn es keine Datei gibt. */
function seitenDesKapitels(kap) {
  if (!kapitelSeiten.has(kap)) {
    const dateien = kapitelDateien(lehrmittel.pfad, kap)
    kapitelSeiten.set(kap, dateien.length ? new Set(dateien.flatMap((d) => ladeKapitel(lehrmittel.pfad, d).seiten.map((s) => s.seite).filter((s) => s !== null))) : null)
  }
  return kapitelSeiten.get(kap)
}
const wortzahl = (zeilen) => zeilen.reduce((n, z) => n + z.text.split(/\s+/).filter(Boolean).length, 0)
const innerhalb = (ist, soll) => Math.abs(ist - soll) <= soll * TOL_WOERTER

const berichte = []
let nichtGeprueft = ''
for (const ordner of A.ordner) {
  const E = ladeEinheit(A.wurzel, ordner)
  const B = new Bericht(NAME, E, { streng: A.streng })
  berichte.push(B)
  if (!E.v42) { B.hinweis('HINWEIS_KEIN_V42', ordner, 'kein Heft im Format heft_8page_v42 — nichts zu prüfen'); continue }
  const texte = new Map() // Karten-ID → Archivtext
  if (archiv.pfad) for (const [id, { karte }] of E.quellen) pruefeKarte(B, id, karte, texte)
  else nichtGeprueft = `Quellenarchiv fehlt lokal (${archiv.grund}): Karten nicht gegen den Archivtext geprüft.`
  for (const k of E.kartenFehlen) B.fehler('ERR_ZEIGER_ARCHIV_REF', k, 'Karte, auf die die Einheit verweist, gibt es nicht')
  pruefeImHeft(E, B, texte)
  pruefeHeftseiten(E, B)
  pruefeLehrmittel(E, B)
}

// ---------------------------------------------------------------- KARTE

function pruefeKarte(B, id, karte, texte) {
  const wo = `quellen/${id}.json`
  if (karte.archiv_ref !== `${id}/gewaehlt`) B.fehler('ERR_ZEIGER_ARCHIV_REF', `${wo} › archiv_ref`, `«${karte.archiv_ref ?? 'fehlt'}» — Soll «${id}/gewaehlt»`)
  const t = ladeArchivtext(archiv.pfad, karte.archiv_ref ? karte : { ...karte, archiv_ref: `${id}/gewaehlt` })
  if (!t.vorhanden) { B.fehler('ERR_ZEIGER_ARCHIV_FEHLT', `${wo} › archiv_ref`, t.grund); return }
  texte.set(id, t)
  const av = karte.typ === 'audio' || karte.typ === 'video'

  // Zeit: von < bis, dauer_sek = bis − von, bis nicht nach dem Ende des Transkripts.
  const aus = ausschnittDerKarte(karte)
  if (aus.art === 'zeit') {
    if (aus.von_sek >= aus.bis_sek) B.fehler('ERR_ZEIGER_ZEIT', `${wo} › verortung`, `von ${karte.verortung.von} liegt nicht vor bis ${karte.verortung.bis}`)
    else if (Number.isFinite(karte.dauer_sek) && Math.abs(aus.bis_sek - aus.von_sek - karte.dauer_sek) > 1) B.fehler('ERR_ZEIGER_ZEIT', `${wo} › dauer_sek`, `${karte.dauer_sek} s, aber bis − von = ${aus.bis_sek - aus.von_sek} s`)
    const zeiten = t.zeilen.filter((z) => z.sek !== null).map((z) => z.sek_bis ?? z.sek)
    if (zeiten.length > 1) {
      const ende = Math.max(...zeiten)
      if (aus.bis_sek > ende + NACHLAUF_SEK) B.fehler('ERR_ZEIGER_ZEIT', `${wo} › verortung.bis`, `${karte.verortung.bis} liegt ${Math.round(aus.bis_sek - ende)} s nach der letzten Zeile des Transkripts (${formatZeit(ende)})`)
      if (aus.von_sek < Math.min(...t.zeilen.filter((z) => z.sek !== null).map((z) => z.sek)) - NACHLAUF_SEK) B.fehler('ERR_ZEIGER_ZEIT', `${wo} › verortung.von`, `${karte.verortung.von} liegt vor der ersten Zeile des Transkripts`)
    }
  } else if (av) B.fehler('ERR_ZEIGER_ZEIT', `${wo} › verortung`, 'Audio/Video ohne von/bis')
  if (av) {
    if (t.zeit.stufe === 'block') B.hinweis('HINWEIS_ZEIT_NUR_BLOCK', wo, `Transkript in Blöcken (Median ${t.zeit.median_sek ?? '—'} s) — jede Zeitmarke dieser Karte gehört auf die Gegenhör-Liste`)
    if (t.zeit.stufe === 'nein') B.hinweis('HINWEIS_ZEIT_NICHT_PRUEFBAR', wo, 'Archivtext ohne Zeitmarken — Zeitmarken dieser Karte sind NICHT geprüft')
    if (t.zeit.vermerk.length) B.hinweis('HINWEIS_ZEIT_VERMERK', wo, `Kopf der Archivdatei: ${t.zeit.vermerk.join(', ')}`)
  }

  // Absätze: keiner über der Absatzzahl.
  const maxAbs = Math.max(0, ...t.zeilen.filter((z) => z.absatz !== null).map((z) => z.absatz))
  const bereiche = aus.art === 'absaetze' ? absaetzeIn(aus.text) : []
  if (maxAbs) for (const b of bereiche) if (b.bis > maxAbs) B.fehler('ERR_ZEIGER_ABSATZ', `${wo} › verortung.absaetze`, `nennt Abs. ${b.bis}, der Archivtext hat ${maxAbs} Absätze`)

  // Wörter: am Ausschnitt nachzählen — wo er sich abgrenzen lässt.
  if (Number.isFinite(karte.woerter)) {
    const text = t.zeilen.filter((z) => z.art !== 'tabelle')
    const tabelle = t.zeilen.filter((z) => z.art === 'tabelle')
    const mitGrafik = /Grafik|Tabelle|Darstellung|Abbildung/i.test(aus.text ?? '')
    const zaehleBereich = (bs) => wortzahl(text.filter((z) => z.absatz !== null && bs.some((b) => z.absatz >= b.von && z.absatz <= b.bis))) + (mitGrafik ? wortzahl(tabelle) : 0)
    const kandidaten = []
    if (bereiche.length && maxAbs) kandidaten.push(['Ausschnitt der Karte', zaehleBereich(bereiche)])
    // Der Kopf der Archivdatei nennt den Ausschnitt oft genauer als die Karte («Abs. 1–3 = … Wörter»).
    const kopfLaenge = [kopfFeld(t, /^länge/), kopfFeld(t, /^ausschnitt/)].filter(Boolean).join(' ; ')
    const kopfBereiche = absaetzeIn(kopfLaenge)
    if (kopfBereiche.length && maxAbs) kandidaten.push(['Ausschnitt laut Kopf der Archivdatei', zaehleBereich(kopfBereiche)])
    const gewaehlt = text.filter((z) => z.im_ausschnitt_laut_datei === true)
    if (gewaehlt.length) kandidaten.push(['markierte Zeilen', wortzahl(gewaehlt)])
    const ganz = wortzahl(text) + (mitGrafik ? wortzahl(tabelle) : 0)
    const ganzerText = /ganze[rs]?\s|^$/i.test(aus.text ?? '') || (!bereiche.length && !kopfBereiche.length && !gewaehlt.length)
    if (kandidaten.some(([, n]) => innerhalb(n, karte.woerter)) || innerhalb(ganz, karte.woerter) || innerhalb(wortzahl(text), karte.woerter)) { /* stimmt */ }
    else if (kandidaten.length) B.fehler('ERR_ZEIGER_WOERTER', `${wo} › woerter`, `${karte.woerter} Wörter; gezählt: ${kandidaten.map(([n, z]) => `${n} ${z}`).join(' · ')} · ganzer Text ${ganz} (Toleranz 5 %)`)
    else if (ganzerText && /ganze[rs]?\s/i.test(aus.text ?? '')) B.fehler('ERR_ZEIGER_WOERTER', `${wo} › woerter`, `${karte.woerter} Wörter; der ganze Archivtext hat ${ganz} (Toleranz 5 %)`)
    else B.hinweis('HINWEIS_WOERTER_NICHT_PRUEFBAR', `${wo} › woerter`, `${karte.woerter} Wörter nicht nachgezählt: Ausschnitt «${aus.text ?? '—'}» ist am Archivtext nicht abgrenzbar (ganzer Text ${ganz})${new RegExp(`\\b${karte.woerter}\\s+W(ö|oe)rter`).test(kopfLaenge) ? ' — stimmt mit der Angabe im Kopf der Archivdatei' : ''}`)
  }
}

// ---------------------------------------------------------------- IM HEFT

function pruefeImHeft(E, B, texte) {
  if (!texte.size) return
  const felder = textfelder(E, { karten: false, begleiter: false, kn: false })
  for (const h of E.hefte) {
    const karten = [...E.quellen].filter(([, v]) => v.heft === h.heft).map(([id, v]) => ({ id, karte: v.karte, t: texte.get(id) })).filter((k) => k.t)
    const zeitKarten = karten.filter((k) => ausschnittDerKarte(k.karte).art === 'zeit')
    const absKarten = karten.filter((k) => k.t.zeilen.some((z) => z.absatz !== null))
    for (const f of felder.filter((x) => x.traeger === h.heft && !ERFUNDEN.test(x.pfad))) {
      // Zeitmarken: überall im Heft, sobald das Heft eine Karte mit von/bis führt.
      if (zeitKarten.length) for (const z of zeitmarkenIn(f.text)) {
        // Eine Karte, die das Feld beim Slot nennt, ist die gemeinte; sonst genügt irgendeine des Hefts.
        const slot = /quellen\[(\d+)\]/.exec(f.pfad)
        const gemeint = slot ? zeitKarten.filter((k) => { const ref = h.json.spuren?.mit_medien?.quellen?.[+slot[1]]?.ref; return k.id === ref || k.id === E.quellen.get(ref)?.karte?.ersatz_ref }) : zeitKarten
        const kand = gemeint.length ? gemeint : zeitKarten
        if (!kand.some((k) => { const a = ausschnittDerKarte(k.karte); return z.sek >= a.von_sek && z.sek <= a.bis_sek })) B.fehler('ERR_ZEIGER_ZEIT_AUSSERHALB', f.feld, `nennt ${z.text}; Ausschnitt ${kand.map((k) => `${k.id} ${k.karte.verortung.von}–${k.karte.verortung.bis}`).join(' · ')}`)
      }
      // Absätze: nur in der Medien-Spur (ohne Medien meint «Absatz» das Lehrmittel).
      if (f.spur === 'mit_medien' && absKarten.length) for (const a of absaetzeIn(f.text)) {
        const ok = absKarten.some((k) => {
          const max = Math.max(...k.t.zeilen.filter((z) => z.absatz !== null).map((z) => z.absatz))
          const ber = absaetzeIn(ausschnittDerKarte(k.karte).text ?? '')
          return a.bis <= max && (!ber.length || ber.some((b) => a.von >= b.von && a.bis <= b.bis))
        })
        if (!ok) B.fehler('ERR_ZEIGER_ABSATZ_AUSSERHALB', f.feld, `nennt Abs. ${a.von}${a.bis !== a.von ? `–${a.bis}` : ''}; ${absKarten.map((k) => `${k.id}: ${Math.max(...k.t.zeilen.filter((z) => z.absatz !== null).map((z) => z.absatz))} Absätze, Ausschnitt «${ausschnittDerKarte(k.karte).text ?? `${k.karte.verortung?.von}–${k.karte.verortung?.bis}`}»`).join(' · ')}`)
      }
    }
  }
}

/// -------------------------------------------------------------- HEFTSEITE

/**
 * «S. n»-Verweise eines Texts, die eine Heftseite meinen. An ein Kapitel gebundene Seiten
 * sind Lehrmittelseiten — ausser sie liegen bei 1–8: «zu Kap. 4.2 (S. 3)» meint die Heftseite.
 * Aufzählungen («S. 5, 7, 8») kommen als EIN Verweis mit mehreren Bereichen zurück.
 */
function heftseitenIn(text) {
  const lm = lehrmittelVerweise(text)
  const nachPos = new Map()
  for (const s of seitenIn(text)) {
    if (s.von > HEFT_SEITEN && lm.some((v) => s.pos >= v.pos && s.pos < v.ende)) continue
    const e = nachPos.get(s.pos) ?? nachPos.set(s.pos, { pos: s.pos, text: s.text, bereiche: [] }).get(s.pos)
    e.bereiche.push({ von: s.von, bis: s.bis })
  }
  return [...nachPos.values()].map((e) => ({ ...e, von: Math.min(...e.bereiche.map((b) => b.von)), bis: Math.max(...e.bereiche.map((b) => b.bis)), seiten: e.bereiche.flatMap((b) => { const a = []; for (let n = b.von; n <= b.bis && n <= 99; n++) a.push(n); return a }) }))
}
/**
 * Das Element, das ein Verweis nennt: ein Wort mit festem Ort UNMITTELBAR vor «S. n» —
 * dazwischen höchstens Klammer, Komma und ein Verhältniswort («Checkliste (S. 8)»,
 * «Raster auf S. 3», «Beispiel, S. 6»). «Übertragen Sie LF3 … auf S. 7» ist kein solcher Verweis.
 */
function elementVor(text, pos) {
  const vor = text.slice(Math.max(0, pos - 48), pos)
  for (const e of ELEMENT_SEITEN) {
    const m = new RegExp(`(?:${e.wort.source})[»”"]?\\s*[(,]?\\s*(?:(?:auf|von|der|des|im|in|zu|zur|zum|siehe|vgl\\.)\\s)?(?:Heft [AB],?\\s)?$`).exec(vor)
    if (m) return { ...e, treffer: m[0].replace(/[\s(,]+$/, '').trim() }
  }
  return null
}
/** Ein Wort in Guillemets unmittelbar vor dem Verweis — für die Prüfung am Seitentext. */
function zitatVor(text, pos) { return /«([^»]{3,40})»\s*\(?\s*(?:auf\s)?$/.exec(text.slice(Math.max(0, pos - 60), pos))?.[1] ?? null }

function pruefeHeftseiten(E, B) {
  const seitentexte = {} // 'A' → [ { datei, seiten[] } je Spur ]
  if (A.opt.export) {
    const dir = resolve(A.opt.export)
    for (const h of E.hefte) {
      const dateien = readdirSync(dir).filter((n) => new RegExp(`^heft-${h.heft.toLowerCase()}-.*\\.html$`).test(n))
      if (!dateien.length) { B.hinweis('HINWEIS_EXPORT_UNPASSEND', `Heft ${h.heft}`, `keine heft-${h.heft.toLowerCase()}-*.html in ${dir} — Seitentext nicht gelesen`); continue }
      seitentexte[h.heft] = dateien.map((n) => ({ datei: n, seiten: seitenAusHtml(readFileSync(join(dir, n), 'utf8')) }))
    }
  }
  const felder = textfelder(E, { karten: false, kn: false })
  for (const f of felder) {
    const imHeft = f.traeger === 'A' || f.traeger === 'B'
    const imBogen = f.datei === 'set.json' && f.pfad.startsWith('gemeinsamer_auftrag')
    if (!imHeft && !imBogen && f.traeger !== 'begleiter') continue
    if (ERFUNDEN.test(f.pfad)) continue
    // Bogenseiten «A1»–«A4».
    if (imBogen || f.traeger === 'begleiter') for (const m of f.text.matchAll(/(?<![\p{L}\p{N}])A([1-9])(?![\p{L}\p{N}.])/gu)) if (+m[1] > BOGEN_SEITEN) B.fehler('ERR_ZEIGER_SEITE', f.feld, `nennt A${m[1]}; der Auftragsbogen hat ${BOGEN_SEITEN} Seiten`)
    for (const s of heftseitenIn(f.text)) {
      // Über 8: eine Lehrmittelseite ohne Kapitel — die prüft LEHRMITTEL.
      if (s.von > HEFT_SEITEN) continue
      // Im Bogen und im Begleiter meint «S. n» das Heft nur, wenn es dabeisteht (sonst den Bogen, eine Quelle, ein Dokument).
      const heftGenannt = /Heft(?:s|e|en)?\s?(?:([AB])\b)?[^.;:!?\n]{0,25}$/.exec(f.text.slice(Math.max(0, s.pos - 45), s.pos))
      if (!imHeft && !heftGenannt) continue
      if (s.bis > HEFT_SEITEN) { B.fehler('ERR_ZEIGER_SEITE', f.feld, `nennt «${s.text}»; das Heft hat ${HEFT_SEITEN} Seiten`); continue }
      const e = elementVor(f.text, s.pos)
      if (e && !s.seiten.some((n) => e.seiten.includes(n))) { B.fehler('ERR_ZEIGER_SEITE_ELEMENT', f.feld, `«${e.treffer} … ${s.text}»: ${e.name} steht im Heft auf S. ${e.seiten[0]}`); continue }
      // Mit Export: Das Element bzw. ein Wort in Guillemets vor dem Verweis muss auf der Seite gedruckt sein.
      const heft = imHeft ? f.traeger : heftGenannt?.[1]
      const wort = e ? e.treffer.replace(/[«»]/g, '').replace(/\s*(?:auf|von|der|des|im|in|zu|zur|zum|siehe|vgl\.)$/, '').replace(/\s*Heft [AB],?$/, '').trim() : zitatVor(f.text, s.pos)
      if (wort && heft && seitentexte[heft] && !s.seiten.some((n) => seitentexte[heft].some((d) => (d.seiten[n - 1] ?? '').toLowerCase().includes(wort.toLowerCase())))) B.fehler('ERR_ZEIGER_SEITE_ELEMENT', f.feld, `«${wort}» ist laut Export in keiner Fassung von Heft ${heft} auf ${s.text} gedruckt`)
    }
  }
  // SCHRITT: jeder Hinweis nennt eine Seite.
  for (const h of E.hefte) (h.json.handlungsprodukt?.schritte ?? []).forEach((s, i) => {
    if (typeof s?.hint === 'string' && s.hint.trim() && !heftseitenIn(s.hint).some((x) => x.von <= HEFT_SEITEN)) B.fehler('ERR_ZEIGER_SCHRITT_OHNE_SEITE', `${h.datei} › handlungsprodukt.schritte[${i}].hint`, `Schritt «${s.label ?? i + 1}» nennt keine Heftseite`)
  })
  ;(E.json['set.json']?.gemeinsamer_auftrag?.schritte ?? []).forEach((s, i) => {
    if (typeof s?.hint === 'string' && s.hint.trim() && !/(?<![\p{L}\p{N}])A[1-4](?![\p{L}\p{N}])|\bHeft [AB]\b|\bS\.\s?\d|eigene[sn]? Blatt/iu.test(s.hint)) B.fehler('ERR_ZEIGER_SCHRITT_OHNE_SEITE', `set.json › gemeinsamer_auftrag.schritte[${i}].hint`, `Schritt «${s.label ?? i + 1}» nennt weder eine Bogenseite (A1–A4) noch ein Heft noch ein eigenes Blatt`)
  })
}

// -------------------------------------------------------------- LEHRMITTEL

function pruefeLehrmittel(E, B) {
  if (!lehrmittel.pfad) { B.hinweis('HINWEIS_LEHRMITTEL_FEHLT', 'material/_lehrmittel', 'fehlt lokal — Lehrmittelseiten NICHT geprüft'); nichtGeprueft ||= 'Lehrmittel fehlt lokal: Lehrmittelseiten nicht geprüft.'; return }
  const felder = textfelder(E, { kn: false })
  // Verweise, deren Kapitel und Seiten in zwei Feldern stehen.
  const zusatz = []
  for (const h of E.hefte) (h.json.quellen_anker ?? []).forEach((q, i) => { if (q && typeof q === 'object' && q.ref && q.seiten) zusatz.push({ feld: `${h.datei} › quellen_anker[${i}]`, traeger: h.heft, pfad: 'quellen_anker', text: `${q.ref}, ${q.seiten}` }) })
  for (const [id, { karte, heft }] of E.methoden) if (karte.kap && karte.seiten) zusatz.push({ feld: `methoden/${id}.json › kap, seiten`, traeger: heft, pfad: 'kap', text: `Kap. ${karte.kap}, ${karte.seiten}` })

  // Kapitel, die ein Heft irgendwo nennt — für Seiten ohne Kapitel im selben Feld.
  const kapitelVon = {}
  const alle = [...felder, ...zusatz]
  for (const f of alle) for (const v of lehrmittelVerweise(f.text)) (kapitelVon[f.traeger] ??= new Set()).add(v.kapitel)

  const gemeldet = new Set()
  const melde = (code, f, schluessel, was) => { const k = `${f.feld}|${schluessel}`; if (!gemeldet.has(k)) { gemeldet.add(k); B.fehler(code, f.feld, was) } }
  for (const f of alle) {
    const lm = lehrmittelVerweise(f.text)
    for (const v of lm) {
      const seiten = seitenDesKapitels(v.kapitel)
      if (!seiten) { melde('ERR_ZEIGER_KAPITEL', f, v.kapitel, `Kap. ${v.kapitel}: keine Kapiteldatei unter material/_lehrmittel/`); continue }
      // Seiten 1–8 nach einem Kapitel sind Heftseiten («zu Kap. 4.2 (S. 3)»), sobald das Kapitel selbst später beginnt.
      for (const s of v.seiten) for (const n of [s.von, s.bis]) if (!seiten.has(n) && !(n <= HEFT_SEITEN && Math.min(...seiten) > HEFT_SEITEN)) melde('ERR_ZEIGER_LEHRMITTEL_SEITE', f, `${v.kapitel}|${n}`, `S. ${n} liegt nicht in Kap. ${v.kapitel} (${Math.min(...seiten)}–${Math.max(...seiten)})`)
    }
    // Seite über 8 ohne Kapitel im Feld: Sie muss in einem Kapitel liegen, das dieses Heft nennt. Nur in den
    // Heften ohne Medien-Spur-Bezug — im Begleiter, in Karten und in der Medien-Spur kann «S. n» eine Quelle meinen.
    if ((f.traeger !== 'A' && f.traeger !== 'B') || f.spur === 'mit_medien' || ERFUNDEN.test(f.pfad ?? '')) continue
    const kandidaten = [...(kapitelVon[f.traeger] ?? [])]
    if (!kandidaten.length) continue
    for (const s of seitenIn(f.text)) {
      if (s.von <= HEFT_SEITEN || lm.some((v) => s.pos >= v.pos && s.pos < v.ende) || /PDF-?\s?$/.test(f.text.slice(Math.max(0, s.pos - 5), s.pos))) continue
      for (const n of [s.von, s.bis]) if (!kandidaten.some((k) => seitenDesKapitels(k)?.has(n))) melde('ERR_ZEIGER_LEHRMITTEL_SEITE', f, `|${n}`, `S. ${n} liegt in keinem Kapitel, das Heft ${f.traeger} nennt (${kandidaten.join(', ')})`)
    }
  }
}

schluss(NAME, berichte, {
  protokoll: A.protokoll,
  vorspann: [`  Archiv ${archiv.pfad ?? 'fehlt lokal'} · Lehrmittel ${lehrmittel.pfad ?? 'fehlt lokal'}${A.opt.export ? ` · Export ${resolve(A.opt.export)}` : ' · ohne --export (Seiten nach der Zuordnung des Renderers)'}`],
  nichtGeprueft,
})
