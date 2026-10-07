#!/usr/bin/env node
/**
 * check-kohaerenz.mjs — der skriptbare Teil der Widersprüche innerhalb einer Einheit
 * (ENTSCHEIDE E38; ersetzt die Handprüfungen aus phase-9-tor.md §3 Nr. 2–5).
 *
 *   node scripts/check-kohaerenz.mjs <ordner> [<ordner> …]
 *   node scripts/check-kohaerenz.mjs --v42               # alle Einheiten im Format v4.2
 *   … --export <ordner>                                  # Ausgabe von export-v42.mjs dieser EINEN Einheit: prüft
 *                                                        # gesperrte Wörter und Lösungssätze auch am gedruckten Text
 *   … --streng                                           # jede Einheit wie ein Entwurf: Befunde sind Fehler
 *   … --protokoll <datei>                                # Fassung ohne Textauszug
 *   … --wurzel <ordner>                                  # anderer Baum statt dieses Repos (Gegenproben)
 *
 * Geprüft wird:
 *   WERTE      Prinzip, Hefte und Set tragen dieselben Werte: Kriterien je Heft, Pol-Typ je Heft
 *              und Spur, Zentrum des Begriffsnetzes, Lebensbereich des Auftrags, Sprachmodi
 *   LÖSUNG     kein Lösungssatz steht dort, wo Lernende ihn lesen (acht Wörter am Stück aus Befund,
 *              Erwartung, Lösungsbild oder Erwartungshorizont in einem Feld der Lernenden; mit
 *              --export auch im gedruckten Heft und Auftragsbogen)
 *   WÖRTER     «Spur», «Pflichtquelle», «Lektion» nie im Text der Lernenden; «Woche», «Minute»
 *              als Warnung (kann Inhalt sein); keine Du-Anrede ausserhalb wörtlicher Rede
 *   UMLAUTE    keine Transliteration (Muster aus references/umlaute.md)
 *   ANZAHL     dieselbe Sache trägt überall dieselbe Zahl: «Das geben Sie ab», Produktformat,
 *              Checkliste (S. 8), Schritte, Kriterien-Indikator, Lösungsbild; die Rasterzeilen der
 *              Checkliste gegen das Raster; im Auftragsbogen die Stationen
 *   BEZEICHNER das Produkt heisst in Checkliste, Abgaben und Format gleich
 *   KARTE      der Kurzbeschrieb einer Quellenkarte verrät die Lösung ihres Rasters nicht
 *              (Wortüberlappung über der Schwelle → Warnung)
 *   PUNKTE     Begleiter, Hefte und Auftragsbogen sagen «Punkte», nicht «Stufe 0–3», wo das Raster Punkte führt
 *
 * Codes:
 *   ERR_KOH_KRITERIEN        Die Kriterien eines Hefts sind nicht die, die das Prinzip ihm zuteilt.
 *   ERR_KOH_POLTYP           Der Pol-Typ von LF4 ist nicht der des Prinzips.
 *   ERR_KOH_ZENTRUM          Das Zentrum des Begriffsnetzes heisst nicht wie im Prinzip (oder in A und B verschieden).
 *   ERR_KOH_LEBENSBEREICH    Der Lebensbereich des Auftrags heisst nicht wie im Prinzip.
 *   ERR_KOH_MODI             Die Sprachmodi eines Hefts bzw. des Auftrags sind nicht die des Prinzips.
 *   ERR_KOH_LOESUNG_SICHTBAR Ein Lösungssatz steht in einem Feld bzw. Dokument der Lernenden.
 *   ERR_KOH_GESPERRT         «Spur», «Pflichtquelle» oder «Lektion» im Text der Lernenden.
 *   WARN_KOH_WOCHE_MINUTE    «Woche» oder «Minute» im Text der Lernenden — Unterrichtszeit oder Inhalt? Ansehen.
 *   ERR_KOH_ANREDE_DU        Du-Anrede im Text der Lernenden ausserhalb wörtlicher Rede.
 *   ERR_KOH_TRANSLIT         Transliterierter Umlaut in Prosa.
 *   ERR_KOH_ANZAHL           Eine Zahl im Text widerspricht den Daten: Stationen des Bogens, Zeilen oder Spalten des Lösungsbilds, Zeilen des Rasters.
 *   WARN_KOH_ANZAHL          Dasselbe Wort steht an zwei Stellen des Produkts mit verschiedener Zahl — dieselbe Sache? Ansehen.
 *   ERR_KOH_BEZEICHNER       Das Produkt der Checkliste kommt in Abgaben und Format nicht unter diesem Namen vor.
 *   WARN_KOH_KURZBESCHRIEB   Der Kurzbeschrieb der Karte überlappt die Lösung über der Schwelle — verrät er sie?
 *   ERR_KOH_STUFE_PUNKTE     «Stufe 0–3» statt «Punkte» beim Raster.
 *   HINWEIS_EXPORT_UNPASSEND --export enthält keine heft-*.html dieser Einheit.
 *   HINWEIS_KEIN_V42         Die Einheit ist nicht im Format v4.2 — nichts zu prüfen.
 *
 * Exit 0  keine Fehler (Warnungen und Hinweise möglich)
 * Exit 1  mindestens ein Fehler
 * Exit 2  Aufruf falsch
 *
 * Braucht weder Archiv noch Lehrmittel. Reines Node, keine Abhängigkeiten, nur lesend (ausser --protokoll).
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { aufruf, ladeEinheit, Bericht, schluss, textfelder, woerter, umfeld, ERFUNDEN, SPUREN } from './lib/pruefung.mjs'
import { loesungsfelder } from './lib/loesungsfelder.mjs'
import { seitenAusHtml } from './lib/seitentext.mjs'

const NAME = 'check-kohaerenz'
const A = aufruf(NAME, 'node scripts/check-kohaerenz.mjs <ordner>… | --v42  [--export <ordner>] [--streng] [--protokoll <datei>] [--wurzel <ordner>]', { export: 'wert' })
if (A.opt.export && A.ordner.length !== 1) { console.error(`${NAME}: --export gilt für genau eine Einheit`); process.exit(2) }
if (A.opt.export && !existsSync(A.opt.export)) { console.error(`${NAME}: kein Ordner ${A.opt.export}`); process.exit(2) }

const NGRAMM = 8
// Schwelle für «verrät die Lösung»: Anteil der Inhaltswörter des Kurzbeschriebs, die in der Lösung des Rasters
// (Befund, Rasterzeilen, Lösungszeilen von LF3) bzw. in der Erwartung der Vertiefung stehen. Gemessen an den
// 122 Paaren Karte–Lösung der 16 Einheiten (07.10.2026): Median 0.29, drei Viertel unter 0.42, 90 % unter 0.54,
// Höchstwert 0.89. Ein Kurzbeschrieb nennt das Thema, die Lösung auch — die Schwelle trifft darum nur das oberste
// Zehntel. Es ist eine Warnung: Ob der Kurzbeschrieb die Lösung verrät, entscheidet ein Mensch.
const SCHWELLE_KURZBESCHRIEB = 0.55
const STOPP = new Set('einer einem einen eines diese dieser dieses diesem diesen nicht oder aber auch noch nur sich wird werden wurde wurden kann können sind sein seine seiner ihrem ihren ihrer ihre haben hatte über unter nach beim beide beiden zwei drei vier fünf sowie dass damit dabei durch gegen ohne zwischen mehr sehr viel viele wenn weil welche welcher welches sagt sagen zeigt zeigen nennt nennen laut etwa rund jahr jahre jahren heute schweiz schweizer quelle text artikel beitrag video audio grafik seite seiten absatz absätze'.split(' '))
const inhaltswoerter = (s) => [...new Set(woerter(s).filter((w) => w.length >= 5 && !STOPP.has(w) && !/^\d/.test(w)))]
const gleich = (a, b) => { const x = [...new Set(a ?? [])].sort(); const y = [...new Set(b ?? [])].sort(); return x.length === y.length && x.every((v, i) => v === y[i]) }
const ohneRede = (s) => String(s).replace(/«[^»]*»/g, ' ').replace(/"[^"]*"/g, ' ')

// Muster aus references/umlaute.md («Pauschale Korrekturen»): Wortteile, die in Prosa nur als Umlaut richtig sind.
const RE_TRANSLIT = /(?<![\p{L}])[\p{L}]*(?:fuer|ueber|muess|moeg|aend|naeh|haeu|pruef|befuel|gemaess|staedte|oekolog|beduerfn|verfueg|auswae?l|guenst|loes|foerd|stoer|erklaer|erfaehr|waehl|maerk|geschae|koenn|wuerd|waere|haett|spaet|naechst|zusaetz|taegl|jaehr|schuel|uebung|gespraech|faehig|oeffentl|zurueck|natuerl|duerf|hoer|fuehr|gebuehr|praemie|vertraeg|betraeg|beitraeg|groess)[\p{L}]*/giu

// ------------------------------------------------------------------ Anzahl

const ZAHL = { ein: 1, eine: 1, einem: 1, einen: 1, einer: 1, zwei: 2, beide: 2, beiden: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12 }
const ZW = Object.keys(ZAHL).join('|')
const RE_ANZAHL = new RegExp(String.raw`(?<![\p{L}\p{N}.,'’:])(mindestens\s|mind\.\s|höchstens\s|max\.\s|bis\s)?(\d{1,2}|${ZW})(?:\s(?:bis|oder|–|-)\s(\d{1,2}|${ZW}))?\s(?:(?:eigene[nr]?|beschriftete[nr]?|ganze[nr]?|kurze[nr]?|weitere[nr]?|verschiedene[nr]?|mögliche[nr]?|gefüllte[nr]?|neue[nr]?)\s)?([A-ZÄÖÜ][\p{L}-]{2,})`, 'gu')
// Keine Sachen, sondern Masse, Orte, Zeit: Ihre Zahl bedeutet je Stelle etwas anderes.
const KEIN_DING = /^(?:Sätze[n]?|Satz|Wörter[n]?|Wort|Worte[n]?|Fragen?|Gründe[n]?|Grund|Beispiele?[n]?|Stichworte[n]?|Stichwörter[n]?|Zeichen|Dinge[n]?|Seiten?|Franken|Jahr|Jahre[n]?|Lehrjahr|Minuten?|Min|Stunden?|Tage[n]?|Wochen?|Monate[n]?|Prozent|Punkte?|Uhr|Kapitel|Teil|Teile[n]?|Schritt|Schritte[n]?|Lektion|Lektionen|Personen?|Heft|Hefte[n]?|Mal|Rappen|Sekunden?|Kästchen|Stufe[n]?|Drittel|Viertel|Hälfte|Lernende[nr]?|Kolleg\p{L}*|Seiten)$/u
const stamm = (w) => w.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/(?:ern|en|er|es|e|n|s)$/, '')
const zahlVon = (s) => (/^\d/.test(s) ? +s : ZAHL[s.toLowerCase()])

/** Anzahl-Angaben eines Texts: [{ ding, wort, min, max, mindestens, text }]. Teilsätze über Raster, LF und Begriffsnetz zählen nicht mit. */
function anzahlenIn(text, { alles = false } = {}) {
  const out = []
  for (const teil of String(text ?? '').split(/[;:.!?]\s|\s[–—]\s|\n/)) {
    // Zeilen, Spalten, Begriffe und Verbindungen zählen je Ort anders (Raster S. 3, Begriffsnetz S. 8, Tabelle S. 7).
    const andererOrt = !alles && /\bRaster|\bLF\s?\d|Begriffsnetz|Quer-Check|Glossar|Lehrmittel|Kap\.|Quelle\b/.test(teil)
    for (const m of teil.matchAll(RE_ANZAHL)) {
      if (KEIN_DING.test(m[4]) || /^(?:Sie|Ihre[nrms]?|Ich|Der|Die|Das|Den|Dem)$/.test(m[4])) continue
      // «je zwei», «pro Zeile ein»: eine Zahl je Stück — an anderer Stelle steht zu Recht die Summe.
      if (/(?:\bje|\bpro|\bjede[rnms]?|\bjeweils)\s(?:\p{L}+\s)?$/u.test(teil.slice(0, m.index))) continue
      const a = zahlVon(m[2]); const b = m[3] ? zahlVon(m[3]) : a
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue
      if (andererOrt && /^(?:zeil|spalt|begriff|verbindung|knot)/.test(stamm(m[4]))) continue
      out.push({ ding: stamm(m[4]), wort: m[4], min: Math.min(a, b), max: Math.max(a, b), mindestens: /mind/.test(m[1] ?? ''), hoechstens: /höchst|max|bis/.test(m[1] ?? ''), text: m[0].trim() })
    }
  }
  return out
}
const vertraeglich = (x, y) => {
  if (x.mindestens && y.max >= x.min) return true
  if (y.mindestens && x.max >= y.min) return true
  if (x.hoechstens && y.min <= x.max) return true
  if (y.hoechstens && x.min <= y.max) return true
  return x.min <= y.max && y.min <= x.max
}

/** Meldet je Ding das erste Paar von Stellen mit unverträglicher Zahl. */
function vergleicheAnzahlen(B, stellen) {
  const nachDing = new Map()
  for (const s of stellen) for (const a of anzahlenIn(s.text, s)) (nachDing.get(a.ding) ?? nachDing.set(a.ding, []).get(a.ding)).push({ ...a, feld: s.feld })
  for (const [, liste] of nachDing) {
    let gemeldet = false
    for (let i = 0; i < liste.length && !gemeldet; i++) for (let j = i + 1; j < liste.length && !gemeldet; j++) {
      if (liste[i].feld === liste[j].feld || vertraeglich(liste[i], liste[j])) continue
      B.warnung('WARN_KOH_ANZAHL', liste[j].feld, `«${liste[j].text}» — dasselbe Wort steht in ${liste[i].feld} mit «${liste[i].text}»: dieselbe Sache?`)
      gemeldet = true
    }
  }
}

// --------------------------------------------------------------------- Lauf

const berichte = []
for (const ordner of A.ordner) {
  const E = ladeEinheit(A.wurzel, ordner)
  const B = new Bericht(NAME, E, { streng: A.streng })
  berichte.push(B)
  if (!E.v42) { B.hinweis('HINWEIS_KEIN_V42', ordner, 'kein Heft im Format heft_8page_v42 — nichts zu prüfen'); continue }
  const prinzip = E.json['prinzip.json'] ?? {}
  const set = E.json['set.json'] ?? {}
  const ga = set.gemeinsamer_auftrag ?? {}
  const felder = textfelder(E, { karten: false, kn: false })
  const lernende = felder.filter((f) => (f.traeger === 'A' || f.traeger === 'B' || (f.datei === 'set.json' && (f.pfad.startsWith('gemeinsamer_auftrag') || f.pfad.startsWith('glossar')))) && !f.loesung && !/kontext_ausschluss|aktivierte_trade_offs|dekontextualisierung|\.wo$|sozialform\.zulaessig/.test(f.pfad))

  // WERTE
  for (const h of E.hefte) {
    const soll = prinzip.kn_kriterien_verteilung?.[h.heft]
    const ist = (h.json.feedback_kriterien ?? []).map((k) => k?.kn_kriterium)
    if (soll && !gleich(soll, ist)) B.fehler('ERR_KOH_KRITERIEN', `${h.datei} › feedback_kriterien`, `Heft: ${ist.join(' · ')} — Prinzip (kn_kriterien_verteilung.${h.heft}): ${soll.join(' · ')}`)
    for (const sp of SPUREN) {
      const lf4 = (h.json.spuren?.[sp]?.leitfragen ?? []).find((l) => l?.nr === 4)
      const s = prinzip.pol_typ_verteilung?.[h.heft]?.[sp]
      if (lf4 && s && lf4.pol_typ !== s) B.fehler('ERR_KOH_POLTYP', `${h.datei} › spuren.${sp}.leitfragen[LF4].pol_typ`, `«${lf4.pol_typ ?? 'fehlt'}» — Prinzip (pol_typ_verteilung.${h.heft}.${sp}): «${s}»`)
    }
    if (prinzip.mindmap_zentrum_kurz && h.json.mindmap_zentrum !== prinzip.mindmap_zentrum_kurz) B.fehler('ERR_KOH_ZENTRUM', `${h.datei} › mindmap_zentrum`, `«${h.json.mindmap_zentrum ?? 'fehlt'}» — Prinzip (mindmap_zentrum_kurz): «${prinzip.mindmap_zentrum_kurz}»`)
    const modi = prinzip.modi_pro_heft?.[h.heft]
    if (modi && !gleich(modi, h.json.nrlp?.sprachmodi)) B.fehler('ERR_KOH_MODI', `${h.datei} › nrlp.sprachmodi`, `Heft: ${(h.json.nrlp?.sprachmodi ?? []).join(' · ')} — Prinzip (modi_pro_heft.${h.heft}): ${modi.join(' · ')}`)
  }
  if (E.hefte.length === 2 && E.hefte[0].json.mindmap_zentrum !== E.hefte[1].json.mindmap_zentrum) B.fehler('ERR_KOH_ZENTRUM', 'herausforderung_B.json › mindmap_zentrum', 'Heft A und Heft B führen verschiedene Zentren')
  if (prinzip.auftrag_lebensbereich && ga.lebensbereich !== prinzip.auftrag_lebensbereich) B.fehler('ERR_KOH_LEBENSBEREICH', 'set.json › gemeinsamer_auftrag.lebensbereich', `«${ga.lebensbereich ?? 'fehlt'}» — Prinzip (auftrag_lebensbereich): «${prinzip.auftrag_lebensbereich}»`)
  if (Array.isArray(prinzip.modi_auftrag) && Array.isArray(ga.sprachmodi) && !gleich(prinzip.modi_auftrag, ga.sprachmodi)) B.fehler('ERR_KOH_MODI', 'set.json › gemeinsamer_auftrag.sprachmodi', `Auftrag: ${ga.sprachmodi.join(' · ')} — Prinzip (modi_auftrag): ${prinzip.modi_auftrag.join(' · ')}`)

  // LÖSUNG: acht Wörter am Stück aus einem markanten Lösungsfeld in einem Feld der Lernenden.
  const L = loesungsfelder(E.dir).felder.filter((f) => ['befund', 'vertiefung_erwartung', 'loesungsbild_block', 'loesungsbild_hinweis', 'erwartung_pol', 'erwartung_tragfaehig', 'erwartung_nicht_tragfaehig'].includes(f.art))
  const ngramme = (ws) => { const s = []; for (let i = 0; i + NGRAMM <= ws.length; i++) s.push(ws.slice(i, i + NGRAMM).join(' ')); return s }
  // Je Zeile und Zelle: Ein Lösungssatz ist ein Satz. Zeilennamen einer Tabelle, die das Produktformat vorgibt, sind keiner.
  const stuecke = (text) => String(text).split(/\n| \| /).flatMap((s) => ngramme(woerter(s)))
  // Felder, die die Frage stellen oder das Produkt beschreiben, darf die Lösung wiederholen — verraten kann sie
  // nur eine Hilfe: Gerüst, Hinweis, Beispiel, Karte, Glossar.
  const FRAGE = /(^|\.)(situation_text|leitfrage|leitfragen_intro|auftrag|titel|format|format_detail|beschreibung|abgaben\[\d+\]|quercheck\[\d+\]|mitnahme\[\d+\]|leitfrage_vertiefung|zahlen_tabelle\[\d+\]\.(label|wert)|vollstaendig_wenn\[\d+\]|stufen\[\d+\]|kn_kriterium|stationen\[\d+\])$|leitfragen\[LF\d\]\.text$|schritte\[\d+\]\.(label|hint)$/
  const sichtbar = new Map() // n-Gramm → Feld
  for (const f of lernende) if (!FRAGE.test(f.pfad)) for (const g of stuecke(f.text)) if (!sichtbar.has(g)) sichtbar.set(g, f.feld)
  const exportSeiten = [] // { datei, text }
  if (A.opt.export) {
    const dir = resolve(A.opt.export)
    const dateien = readdirSync(dir).filter((n) => /^(heft-.*|auftragsbogen)\.html$/.test(n))
    if (!dateien.length) B.hinweis('HINWEIS_EXPORT_UNPASSEND', dir, 'keine heft-*.html — gedruckter Text nicht gelesen')
    for (const n of dateien) seitenAusHtml(readFileSync(join(dir, n), 'utf8')).forEach((t, i) => exportSeiten.push({ datei: n, seite: i + 1, text: t, woerter: woerter(t).join(' ') }))
  }
  for (const l of L) {
    // Ein Heft zeigt seine eigenen Lösungen nicht; die Lösungen des Auftrags stehen in keinem Dokument der Lernenden.
    const gs = stuecke(l.text)
    const feld = gs.map((g) => sichtbar.get(g)).find(Boolean)
    if (feld) B.fehler('ERR_KOH_LOESUNG_SICHTBAR', l.feld, `${NGRAMM} Wörter am Stück stehen auch in ${feld}`)
    else if (exportSeiten.length) {
      const s = exportSeiten.find((p) => gs.some((g) => p.woerter.includes(g)))
      if (s) B.fehler('ERR_KOH_LOESUNG_SICHTBAR', l.feld, `${NGRAMM} Wörter am Stück sind laut Export gedruckt in ${s.datei}, S. ${s.seite}`)
    }
  }

  // WÖRTER — an den Feldern der Lernenden; mit --export zusätzlich am gedruckten Text (feste Texte des Renderers).
  const RE_GESPERRT = /\bSpur(?:en)?\b|\bPflichtquellen?\b|\bLektion(?:en)?\b/g
  // Unterrichtszeit: «in dieser Woche», «nächste Woche», «20 Minuten». Die Woche und die Minuten eines Falls
  // (Situation, Zahlen, Beispiel) und die Dauer eines Produkts sind Inhalt und erlaubt (sprache.md §2).
  const RE_ZEIT = /\b(?:(?:in|nach|vor|pro|je)\s(?:der|dieser|einer|jeder|die|diese)?\s?|diese[rn]?\s|nächste[rn]?\s|erste[rn]?\s|zweite[rn]?\s|dritte[rn]?\s|vierte[rn]?\s|letzte[rn]?\s)Wochen?\b|(?:\d+|\b(?:zwei|drei|vier|fünf|zehn|fünfzehn|zwanzig|dreissig))\s?(?:Minuten?\b|Min\.(?=\s|$|\)))/g
  const KEINE_UNTERRICHTSZEIT = /situation_text|zahlen_tabelle|(^|\.)titel$|(^|\.)leitfrage$|handlungsprodukt\.(format|format_detail|beschreibung|abgaben)|produkte\[\d+\]\.dauer|gemeinsamer_auftrag\.abgaben|stationen|persona/
  const heftfelder = lernende.filter((f) => f.traeger === 'A' || f.traeger === 'B' || f.pfad.startsWith('gemeinsamer_auftrag'))
  for (const f of heftfelder) {
    for (const m of f.text.matchAll(RE_GESPERRT)) B.fehler('ERR_KOH_GESPERRT', f.feld, `«${m[0]}» im Text der Lernenden`, `· «${umfeld(f.text, m.index, m[0].length, 8)}»`)
    if (!ERFUNDEN.test(f.pfad) && !KEINE_UNTERRICHTSZEIT.test(f.pfad)) for (const m of f.text.matchAll(RE_ZEIT)) B.warnung('WARN_KOH_WOCHE_MINUTE', f.feld, `«${m[0]}» — Unterrichtszeit oder Inhalt?`, `· «${umfeld(f.text, m.index, m[0].length, 8)}»`)
    // Situationen stehen in der Ich-Form und dürfen Mitmenschen duzen; Beispiele und Stationen zeigen, was Lernende
    // zueinander sagen. Die Anrede der Lernenden durch das Heft ist «Sie».
    if (ERFUNDEN.test(f.pfad) || /situation_text|persona|hybrid_situation|stationen|satzanfaenge/.test(f.pfad)) continue
    const du = /(?<![\p{L}])(?:du|dir|dich|dein|deine[nmrs]?|euch|euer|eure[nmrs]?)(?![\p{L}])/iu.exec(ohneRede(f.text))
    if (du) B.fehler('ERR_KOH_ANREDE_DU', f.feld, `«${du[0]}» ausserhalb wörtlicher Rede — Aufträge stehen in der Sie-Form`)
  }
  for (const p of exportSeiten.filter((x) => x.datei.startsWith('heft-'))) {
    // Nur was die Felder nicht schon gemeldet haben: feste Texte des Renderers.
    const feldtexte = heftfelder.map((f) => f.text).join('\n')
    for (const m of p.text.matchAll(RE_GESPERRT)) { const um = p.text.slice(Math.max(0, m.index - 20), m.index + m[0].length + 20).replace(/\s+/g, ' ').trim(); if (!feldtexte.includes(um)) B.fehler('ERR_KOH_GESPERRT', `${p.datei} › S. ${p.seite}`, `«${m[0]}» im gedruckten Text (nicht aus einem Feld der Einheit)`, `· «…${um}…»`) }
  }

  // UMLAUTE — überall in Prosa (Hefte, Lösungen, Auftrag, Glossar, Begleiter).
  for (const f of felder) for (const m of f.text.matchAll(RE_TRANSLIT)) {
    // Schlüssel einer Legende und ihre Marken sind Kennungen, kein gedruckter Text.
    if (/\.(key|marke)$/.test(f.pfad) && /^[a-z_]+$/.test(f.text.trim())) continue
    // Dateinamen, Pfade und Kennungen im Begleiter sind keine Prosa.
    const um = f.text.slice(Math.max(0, m.index - 3), m.index + m[0].length + 6)
    if (/[_./\\`-]$/.test(f.text.slice(0, m.index)) || /^[\p{L}]*[_./\\`]/u.test(f.text.slice(m.index + m[0].length - 1)) || /[_`]|\.json|\.md/.test(um)) continue
    B.fehler('ERR_KOH_TRANSLIT', f.feld, `«${m[0]}» — Umlaut transliteriert`)
  }

  // ANZAHL und BEZEICHNER je Heft.
  for (const h of E.hefte) {
    const hp = h.json.handlungsprodukt ?? {}
    const d = h.datei
    const br = h.json.bewertungsraster ?? []
    const produktZeile = br.find((b) => !/^(Leitfragen|Quelle|Lehrmittel|Abschluss)\b/.test(b?.produkt ?? ''))
    const stellen = [
      { feld: `${d} › handlungsprodukt.format_detail`, text: hp.format_detail },
      { feld: `${d} › handlungsprodukt.beschreibung`, text: hp.beschreibung },
      ...(hp.abgaben ?? []).map((t, i) => ({ feld: `${d} › handlungsprodukt.abgaben[${i}]`, text: t })),
      ...(hp.schritte ?? []).map((s, i) => ({ feld: `${d} › handlungsprodukt.schritte[${i}].hint`, text: s?.hint })),
      ...(produktZeile?.vollstaendig_wenn ?? []).map((t, i) => ({ feld: `${d} › bewertungsraster[${br.indexOf(produktZeile)}].vollstaendig_wenn[${i}]`, text: t })),
      ...(h.json.feedback_kriterien ?? []).map((k, i) => ({ feld: `${d} › feedback_kriterien[${i}].indikator_produkt`, text: k?.indikator_produkt })),
    ].filter((s) => typeof s.text === 'string')
    vergleicheAnzahlen(B, stellen)

    // Tabelle des Lösungsbilds gegen «N Zeilen», «N Spalten» im Produktformat (nur bei genau einer Tabelle).
    const tabellen = (hp.loesungsbild?.bloecke ?? []).filter((b) => Array.isArray(b?.zeilen) && b.zeilen.length)
    if (tabellen.length === 1 && /Tabelle/.test(hp.format_detail ?? '')) {
      const t = tabellen[0]
      for (const a of anzahlenIn(hp.format_detail)) {
        if (a.ding === 'zeil' && !a.mindestens && ![t.zeilen.length, t.zeilen.length + 1].some((n) => n >= a.min && n <= a.max)) B.fehler('ERR_KOH_ANZAHL', `${d} › handlungsprodukt.loesungsbild.bloecke[${hp.loesungsbild.bloecke.indexOf(t)}]`, `Lösungsbild hat ${t.zeilen.length} Zeilen; das Produktformat verlangt «${a.text}»`)
        const spalten = (t.kopf ?? t.zeilen[0]?.zellen ?? []).length
        if (a.ding === 'spalt' && !a.mindestens && spalten && ![spalten, spalten - 1].some((n) => n >= a.min && n <= a.max)) B.fehler('ERR_KOH_ANZAHL', `${d} › handlungsprodukt.loesungsbild.bloecke[${hp.loesungsbild.bloecke.indexOf(t)}]`, `Lösungsbild hat ${spalten} Spalten; das Produktformat verlangt «${a.text}»`)
      }
    }
    // Rasterzeilen: Was die Checkliste zum Raster sagt, gegen `raster.zeilen` jeder Spur (mit oder ohne Beispielzeile).
    br.forEach((b, bi) => (b?.vollstaendig_wenn ?? []).forEach((t, i) => {
      if (!/Raster/.test(t)) return
      for (const a of anzahlenIn(t, { alles: true }).filter((x) => x.ding === 'zeil')) for (const sp of SPUREN) {
        const lf3 = (h.json.spuren?.[sp]?.leitfragen ?? []).find((l) => l?.nr === 3)
        const n = lf3?.raster?.zeilen ?? h.json.spuren?.[sp]?.quellen?.[0]?.raster?.zeilen
        if (!Number.isFinite(n)) continue
        const moeglich = [n, n - 1, n + 1].filter((x) => x === n || lf3?.raster?.beispielzeile || h.json.spuren?.[sp]?.quellen?.[0]?.raster?.beispielzeile)
        if (!a.mindestens && !moeglich.some((x) => x >= a.min && x <= a.max)) B.fehler('ERR_KOH_ANZAHL', `${d} › bewertungsraster[${bi}].vollstaendig_wenn[${i}]`, `Checkliste sagt «${a.text}»; das Raster der Spur ${sp} hat ${n} Zeilen`)
      }
    }))
    // Das Produkt der Checkliste heisst in Abgaben, Format oder Titel gleich.
    if (produktZeile?.produkt) {
      const name = produktZeile.produkt.replace(/\s*\([^)]*\)\s*$/, '')
      const ws = inhaltswoerter(name).map((w) => w.slice(0, Math.max(6, w.length - 3)))
      const wo = woerter([hp.format, hp.titel, hp.format_detail, ...(hp.abgaben ?? [])].join(' ')).join(' ')
      if (ws.length && !ws.some((w) => wo.includes(w))) B.fehler('ERR_KOH_BEZEICHNER', `${d} › bewertungsraster[${br.indexOf(produktZeile)}].produkt`, `«${name}» kommt in Format, Titel und «Das geben Sie ab» nicht vor`)
    }
  }
  // Auftragsbogen: Zahlen derselben Sache, und die Stationen der Sprechspur.
  if (ga && Object.keys(ga).length) {
    const stellen = [
      { feld: 'set.json › gemeinsamer_auftrag.auftrag', text: ga.auftrag },
      ...(ga.abgaben ?? []).map((t, i) => ({ feld: `set.json › gemeinsamer_auftrag.abgaben[${i}]`, text: t })),
      ...(ga.schritte ?? []).map((s, i) => ({ feld: `set.json › gemeinsamer_auftrag.schritte[${i}].hint`, text: s?.hint })),
      ...(ga.produkte ?? []).map((p, i) => ({ feld: `set.json › gemeinsamer_auftrag.produkte[${i}].hinweis`, text: p?.hinweis })),
      ...(ga.feedback_kriterien ?? []).map((k, i) => ({ feld: `set.json › gemeinsamer_auftrag.feedback_kriterien[${i}].indikator_produkt`, text: k?.indikator_produkt })),
    ].filter((s) => typeof s.text === 'string')
    vergleicheAnzahlen(B, stellen)
    ;(ga.produkte ?? []).forEach((p, i) => {
      if (!Array.isArray(p?.stationen)) return
      for (const s of stellen) for (const a of anzahlenIn(s.text).filter((x) => x.ding === 'station')) if (!a.mindestens && (p.stationen.length < a.min || p.stationen.length > a.max)) B.fehler('ERR_KOH_ANZAHL', s.feld, `«${a.text}»; produkte[${i}].stationen führt ${p.stationen.length}`)
    })
  }

  // KARTE: Kurzbeschrieb gegen die Lösung des Rasters bzw. die Erwartung der Vertiefung.
  for (const h of E.hefte) {
    const mit = h.json.spuren?.mit_medien
    if (!mit) continue
    const lf3 = (mit.leitfragen ?? []).find((l) => l?.nr === 3)
    const rasterLoesung = [lf3?.loesung?.befund, ...(lf3?.loesung?.raster_zeilen ?? []).flat(), ...(lf3?.loesung?.zeilen ?? []).map((z) => z?.text)].filter(Boolean).join(' ')
    for (const q of mit.quellen ?? []) {
      const k = E.quellen.get(q?.ref)?.karte
      if (!k?.kurzbeschrieb) continue
      const paare = q.rolle === 'pflicht' ? [[q.ref, k, rasterLoesung], ...(k.ersatz_ref && E.quellen.get(k.ersatz_ref) ? [[k.ersatz_ref, E.quellen.get(k.ersatz_ref).karte, rasterLoesung]] : [])] : [[q.ref, k, q.erwartung ?? '']]
      for (const [id, karte, loesung] of paare) {
        const kw = inhaltswoerter(karte.kurzbeschrieb)
        const lw = new Set(inhaltswoerter(loesung))
        if (kw.length < 5 || !lw.size) continue
        const anteil = kw.filter((w) => lw.has(w)).length / kw.length
        if (anteil >= SCHWELLE_KURZBESCHRIEB) B.warnung('WARN_KOH_KURZBESCHRIEB', `quellen/${id}.json › kurzbeschrieb`, `${Math.round(anteil * 100)} % der Inhaltswörter stehen auch in der Lösung von Heft ${h.heft} (Schwelle ${SCHWELLE_KURZBESCHRIEB * 100} %) — verrät der Kurzbeschrieb die Lösung?`)
      }
    }
  }

  // PUNKTE: Das Raster der v4.2-Hefte führt Punkte (0–3). «Stufe 2» beim Raster ist das alte Wort.
  const RE_STUFE = /\bStufe\s?[0-3]\b|\bStufen\s?[0-3]\s?(?:bis|–|-|und)\s?[0-3]\b/g
  for (const f of felder) {
    if (/feedback_kriterien\[\d+\]\.stufen|rubrik/.test(f.pfad)) continue
    for (const m of f.text.matchAll(RE_STUFE)) {
      // R-Stufen des Lehrplans («R4») und Niveaustufen sind etwas anderes.
      if (/Niveau|Bloom|R\d|Iteration|Lehrplan/.test(f.text.slice(Math.max(0, m.index - 40), m.index + 30))) continue
      B.fehler('ERR_KOH_STUFE_PUNKTE', f.feld, `«${m[0]}» — das Raster führt Punkte`)
    }
  }
}
schluss(NAME, berichte, { protokoll: A.protokoll, vorspann: [A.opt.export ? `  Export ${resolve(A.opt.export)}` : '  ohne --export (nur die Felder der Einheit)'] })
