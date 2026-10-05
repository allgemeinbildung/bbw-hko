#!/usr/bin/env node
/**
 * check-v42.mjs — prueft eine Einheit im Heft-Format v4.2 auf den ROHDATEIEN
 * (Kern + beide Spuren, set.json, prinzip.json, kn.json, Quellen- und
 * Methodenkartei). Nur lesend, reines Node, keine Abhaengigkeiten.
 *
 *   node scripts/check-v42.mjs 1.3.1_konsum_verantworten_v42
 *
 * Deckt ab (docs/upgrade-v4.2/01_Leitfaden_v4.2.md):
 *   §3.1   Zeichenbudgets, jede Zeile der Tabelle, Kern und beide Spuren (hart)
 *   §5     Hoechstlaenge der Pflichtquelle, gelesen aus der Karte
 *   §11.4  Pflichtfelder der Quellenkarte
 *   §11.5  Pruefregeln Nr. 1–10
 *   dazu   Methoden-Anker (4 Eintraege, genau ein «__spur__»), alle Karten-Refs,
 *          set.status = "entwurf", template = "heft_8page_v42", Platzhalter
 *
 * Jede Meldung: CODE  datei › feldpfad  [Regel]  Ist … | Soll …
 * Gruppiert nach (a) Budget, (b) Regel, (c) Platzhalter und fehlende Karten.
 * Pfade: Einheitsdateien relativ zu src/data/einheiten/<slug>/,
 *        `quellen/<id>.json` = src/data/quellen/, `methoden/<id>.json` = src/data/methoden/.
 *
 * Exit 0 nur ohne Befund. HINWEIS-Zeilen (nicht maschinell pruefbar) zaehlen nicht.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const EINHEITEN = join(ROOT, 'src/data/einheiten')
const QUELLEN = join(ROOT, 'src/data/quellen')
const METHODEN = join(ROOT, 'src/data/methoden')
const TEMPLATE_V42 = 'heft_8page_v42'

const slug = process.argv.slice(2).find((a) => !a.startsWith('--'))
if (!slug) {
  console.error('usage: node scripts/check-v42.mjs <ordnername>')
  process.exit(1)
}
const DIR = join(EINHEITEN, slug)
if (!existsSync(DIR)) {
  console.error(`Einheit nicht gefunden: src/data/einheiten/${slug}`)
  process.exit(1)
}

// ------------------------------------------------------------------ Geruest

/** kat: 'budget' (a) · 'regel' (b) · 'platzhalter' (c, inkl. fehlende Karten/Dateien) */
const befunde = []
const hinweise = []
const add = (kat, code, datei, pfad, regel, ist, soll) => befunde.push({ kat, code, datei, pfad, regel, ist, soll })
const hinweis = (datei, pfad, text) => hinweise.push({ datei, pfad, text })

/** Zeichen = Laenge des Strings inkl. Leerzeichen (Codepoints). */
const len = (s) => [...String(s ?? '')].length
const kurz = (s, n = 60) => {
  const t = String(s ?? '')
  return len(t) > n ? `${[...t].slice(0, n).join('')}…` : t
}
const istText = (s) => typeof s === 'string' && s.trim() !== ''
const zeige = (v) => (v === undefined ? 'nicht gesetzt' : JSON.stringify(v))

function lade(datei) {
  const pfad = join(DIR, datei)
  if (!existsSync(pfad)) {
    add('platzhalter', 'ERR_V42_DATEI', datei, '', 'Einheit', 'Datei fehlt', 'vorhanden')
    return null
  }
  try {
    return JSON.parse(readFileSync(pfad, 'utf8'))
  } catch (e) {
    add('platzhalter', 'ERR_V42_DATEI', datei, '', 'Einheit', `kein gueltiges JSON (${e.message})`, 'gueltiges JSON')
    return null
  }
}

/** Alle String-Felder mit Pfad. */
function* strings(o, p = '') {
  if (typeof o === 'string') yield [p, o]
  else if (Array.isArray(o)) for (let i = 0; i < o.length; i++) yield* strings(o[i], `${p}[${i}]`)
  else if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) yield* strings(v, p ? `${p}.${k}` : k)
  }
}

// ---------------------------------------------------------------- Karteien

const karteiCache = new Map()
/** Liest eine Karte ohne Befund. `null` = gibt es nicht, `undefined` = kaputt. */
function karte(ordner, id) {
  const key = `${ordner}|${id}`
  if (karteiCache.has(key)) return karteiCache.get(key)
  let wert = null
  const p = join(ordner, `${id}.json`)
  if (typeof id === 'string' && /^[\w.-]+$/.test(id) && existsSync(p)) {
    try {
      wert = JSON.parse(readFileSync(p, 'utf8'))
    } catch {
      wert = undefined
    }
  }
  karteiCache.set(key, wert)
  return wert
}

/** Karten dieser Einheit — fuer Budget, Platzhalter, Eszett, Fall-Ausschluss. */
const quellenDerEinheit = new Map() // id -> Karte
const methodenDerEinheit = new Map()

/** Prueft, dass eine Referenz als Karte existiert. Liefert die Karte oder null. */
function pruefeRef(art, id, datei, pfad) {
  const quelle = art === 'quelle'
  const ordner = quelle ? QUELLEN : METHODEN
  const wo = quelle ? 'src/data/quellen' : 'src/data/methoden'
  const code = quelle ? 'ERR_V42_KARTE_FEHLT_QUELLE' : 'ERR_V42_KARTE_FEHLT_METHODE'
  const regel = quelle ? '§11.5 Nr. 2 / §11.4' : 'Methoden-Anker'
  if (!istText(id)) {
    add('platzhalter', code, datei, pfad, regel, 'ref fehlt oder ist leer', `ID einer Karte in ${wo}/`)
    return null
  }
  const k = karte(ordner, id)
  if (k === null) {
    add('platzhalter', code, datei, pfad, regel, `«${id}»: ${wo}/${id}.json existiert nicht`, 'Karte vorhanden')
    return null
  }
  if (k === undefined) {
    add('platzhalter', code, datei, pfad, regel, `${wo}/${id}.json ist kein gueltiges JSON`, 'gueltiges JSON')
    return null
  }
  ;(quelle ? quellenDerEinheit : methodenDerEinheit).set(id, k)
  return k
}

const istQuellenId = (s) => typeof s === 'string' && /^q-[\w.-]+$/.test(s)

// ------------------------------------------------------------------ Budgets §3.1

const B = '§3.1'

/** Zeichenbudget, Obergrenze. */
function max(datei, pfad, wert, soll) {
  if (typeof wert !== 'string') return
  const ist = len(wert)
  if (ist > soll) add('budget', 'ERR_V42_BUDGET', datei, pfad, B, `${ist} Zeichen «${kurz(wert)}»`, `≤ ${soll} Zeichen`)
}

/** Anzahl (Zeilen, Eintraege), beide Grenzen inklusive. Fehlt die Liste, zaehlt sie 0. */
function anzahl(datei, pfad, liste, min, maxN, was = 'Eintraege') {
  const ist = Array.isArray(liste) ? liste.length : 0
  if (ist >= min && ist <= maxN) return
  const soll = min === maxN ? `genau ${min}` : min === 0 ? `≤ ${maxN}` : `${min}–${maxN}`
  add('budget', 'ERR_V42_BUDGET', datei, pfad, B, `${Array.isArray(liste) ? ist : 'fehlt (0)'} ${was}`, `${soll} ${was}`)
}

function feldHoehe(datei, pfad, ist, soll) {
  if (ist !== soll) add('budget', 'ERR_V42_BUDGET', datei, pfad, `${B} feld_hoehe_mm`, `${ist === undefined ? 'nicht gesetzt' : `${ist} mm`}`, `${soll} mm`)
}

function budgetLeitfrage(datei, pfad, lf, sollHoehe) {
  max(datei, `${pfad}.text`, lf.text, 220)
  if (typeof lf.liefert === 'string') {
    max(datei, `${pfad}.liefert`, lf.liefert, 50)
    const w = lf.liefert.trim().split(/\s+/).filter(Boolean).length
    if (w < 3 || w > 7) add('budget', 'ERR_V42_BUDGET', datei, `${pfad}.liefert`, B, `${w} Woerter «${lf.liefert}»`, '3–7 Woerter')
  }
  const sc = lf.scaffolding ?? {}
  anzahl(datei, `${pfad}.scaffolding.strategien`, sc.strategien, 2, 2)
  ;(sc.strategien ?? []).forEach((s, i) => max(datei, `${pfad}.scaffolding.strategien[${i}]`, s, 90))
  anzahl(datei, `${pfad}.scaffolding.satzanfaenge`, sc.satzanfaenge, 2, 3)
  ;(sc.satzanfaenge ?? []).forEach((s, i) => max(datei, `${pfad}.scaffolding.satzanfaenge[${i}]`, s, 60))
  max(datei, `${pfad}.scaffolding.produkt`, sc.produkt, 110)
  if (sollHoehe != null) feldHoehe(datei, `${pfad}.feld_hoehe_mm`, lf.feld_hoehe_mm, sollHoehe)
}

function budgetRaster(datei, pfad, r) {
  if (!r || typeof r !== 'object') return
  max(datei, `${pfad}.auftrag`, r.auftrag, 220)
  if (r.spalten !== undefined) {
    anzahl(datei, `${pfad}.spalten`, r.spalten, 4, 4, 'Spalten')
    ;(Array.isArray(r.spalten) ? r.spalten : []).forEach((s, i) => max(datei, `${pfad}.spalten[${i}]`, s, 18))
  }
  if (r.zeilen !== undefined && r.zeilen !== 4) add('budget', 'ERR_V42_BUDGET', datei, `${pfad}.zeilen`, B, `${zeige(r.zeilen)} Zeilen`, '4 Zeilen')
  if (r.beispielzeile !== undefined) {
    anzahl(datei, `${pfad}.beispielzeile`, r.beispielzeile, 4, 4, 'Zellen')
    ;(Array.isArray(r.beispielzeile) ? r.beispielzeile : []).forEach((s, i) => max(datei, `${pfad}.beispielzeile[${i}]`, s, 25))
  }
}

/** §3.1, Kern eines Hefts (in beiden Spuren gleich). */
function budgetKern(datei, sit) {
  max(datei, 'titel', sit.titel, 60)
  if (typeof sit.situation_text === 'string') {
    const n = len(sit.situation_text)
    if (n < 650 || n > 900) add('budget', 'ERR_V42_BUDGET', datei, 'situation_text', B, `${n} Zeichen`, '650–900 Zeichen')
  }
  anzahl(datei, 'zahlen_tabelle', sit.zahlen_tabelle, 0, 4, 'Zeilen')
  ;(sit.zahlen_tabelle ?? []).forEach((z, i) => {
    max(datei, `zahlen_tabelle[${i}].label`, z?.label, 45)
    max(datei, `zahlen_tabelle[${i}].wert`, z?.wert, 15)
  })
  max(datei, 'leitfrage', sit.leitfrage, 140)
  max(datei, 'mehrdeutigkeit.trade_off', sit.mehrdeutigkeit?.trade_off, 70)
  max(datei, 'mehrdeutigkeit.hint', sit.mehrdeutigkeit?.hint, 160)

  // Gemessen wird die gedruckte Zeile wie in DocS.tsx (RessourcenList):
  // Titel · Unterueberschrift · Ref · Seiten.
  anzahl(datei, 'quellen_anker', sit.quellen_anker, 0, 3)
  ;(sit.quellen_anker ?? []).forEach((q, i) => {
    const zeile = typeof q === 'string' ? q : [q?.titel, q?.unterueberschrift, q?.ref, q?.seiten].filter(Boolean).join(' · ')
    max(datei, `quellen_anker[${i}] (gedruckte Zeile)`, zeile, 90)
  })

  anzahl(datei, 'wochen_plan', sit.wochen_plan, 3, 3)
  ;(sit.wochen_plan ?? []).forEach((w, i) => max(datei, `wochen_plan[${i}].text`, typeof w === 'string' ? w : w?.text, 80))

  max(datei, 'leitfragen_intro', sit.leitfragen_intro, 300)
  ;(sit.leitfragen ?? []).forEach((lf, i) => {
    const soll = lf.nr === 1 ? 35 : lf.nr === 2 ? 45 : null
    budgetLeitfrage(datei, `leitfragen[${i}]`, lf, soll)
  })

  const hp = sit.handlungsprodukt ?? {}
  max(datei, 'handlungsprodukt.titel', hp.titel, 60)
  max(datei, 'handlungsprodukt.beschreibung', hp.beschreibung, 200)
  anzahl(datei, 'handlungsprodukt.schritte', hp.schritte, 5, 5, 'Schritte')
  ;(hp.schritte ?? []).forEach((s, i) => {
    max(datei, `handlungsprodukt.schritte[${i}].label`, s?.label, 30)
    max(datei, `handlungsprodukt.schritte[${i}].hint`, s?.hint, 140)
  })
  max(datei, 'handlungsprodukt.hilfe_verweis', hp.hilfe_verweis, 70)
  anzahl(datei, 'handlungsprodukt.abgaben', hp.abgaben, 0, 3)
  ;(hp.abgaben ?? []).forEach((a, i) => max(datei, `handlungsprodukt.abgaben[${i}]`, a, 80))

  ;(sit.feedback_kriterien ?? []).forEach((k, i) => {
    ;(k?.stufen ?? []).forEach((s, j) => max(datei, `feedback_kriterien[${i}].stufen[${j}]`, s, 120))
    max(datei, `feedback_kriterien[${i}].indikator_produkt`, k?.indikator_produkt, 90)
  })
  max(datei, 'lernfortschritt.scaffold_100', sit.lernfortschritt?.scaffold_100, 150)

  max(datei, 'mindmap_zentrum', sit.mindmap_zentrum, 40)
  anzahl(datei, 'mindmap_aeste', sit.mindmap_aeste, 4, 4, 'Aeste')
  ;(sit.mindmap_aeste ?? []).forEach((a, i) => {
    max(datei, `mindmap_aeste[${i}].titel`, a?.titel, 30)
    // Begriffsnetz (E17): jeder Punkt ist ein Knoten und ein Glossarbegriff; bis fünf je Ast.
    anzahl(datei, `mindmap_aeste[${i}].punkte`, a?.punkte, 0, 5, 'Punkte')
    ;(a?.punkte ?? []).forEach((p, j) => max(datei, `mindmap_aeste[${i}].punkte[${j}]`, p, 25))
  })
  anzahl(datei, 'mindmap_aeste (Knoten gesamt)', (sit.mindmap_aeste ?? []).flatMap((a) => a?.punkte ?? []), 0, 10, 'Knoten')
  budgetProduktBild(datei, 'handlungsprodukt.beispielbild', hp.beispielbild, { eintraege: 5, text: 105, e26: PB_E26.klein })
  budgetProduktBild(datei, 'handlungsprodukt.loesungsbild', hp.loesungsbild, { eintraege: 7, text: 130, e26: PB_E26.gross })
  anzahl(datei, 'abschluss.quercheck', sit.abschluss?.quercheck, 2, 2)
  ;(sit.abschluss?.quercheck ?? []).forEach((q, i) => max(datei, `abschluss.quercheck[${i}]`, q, 110))
  anzahl(datei, 'abschluss.mitnahme', sit.abschluss?.mitnahme, 3, 3)
  ;(sit.abschluss?.mitnahme ?? []).forEach((q, i) => max(datei, `abschluss.mitnahme[${i}]`, q, 50))
  anzahl(datei, 'bewertungsraster', sit.bewertungsraster, 4, 4, 'Zeilen')
  ;(sit.bewertungsraster ?? []).forEach((b, i) => {
    anzahl(datei, `bewertungsraster[${i}].vollstaendig_wenn`, b?.vollstaendig_wenn, 0, 3, 'Punkte')
    ;(b?.vollstaendig_wenn ?? []).forEach((p, j) => max(datei, `bewertungsraster[${i}].vollstaendig_wenn[${j}]`, p, 70))
  })
}

/** §3.1, spur-abhaengige Felder (Seiten 3 und 4). */
function budgetSpur(datei, spurKey, spur) {
  const basis = `spuren.${spurKey}`
  ;(spur.leitfragen ?? []).forEach((lf, i) => {
    const soll = lf.nr === 3 ? 25 : lf.nr === 4 ? (spurKey === 'mit_medien' ? 60 : 45) : null
    budgetLeitfrage(datei, `${basis}.leitfragen[${i}]`, lf, soll)
    budgetRaster(datei, `${basis}.leitfragen[${i}].raster`, lf.raster)
  })
  ;(spur.quellen ?? []).forEach((q, i) => {
    max(datei, `${basis}.quellen[${i}].auftrag`, q?.auftrag, 220)
    auftragSpalten(datei, `${basis}.quellen[${i}].auftrag`, q?.auftrag, q?.raster?.spalten)
    budgetRaster(datei, `${basis}.quellen[${i}].raster`, q?.raster)
    max(datei, `${basis}.quellen[${i}].leitfrage_vertiefung`, q?.leitfrage_vertiefung, 100)
  })
  const ks = spur.kasten_s4
  if (ks?.typ === 'denkhilfe') {
    anzahl(datei, `${basis}.kasten_s4.spalten`, ks.spalten, 2, 3, 'Spalten')
    ;(ks.spalten ?? []).forEach((s, i) => max(datei, `${basis}.kasten_s4.spalten[${i}]`, s, 30))
    max(datei, `${basis}.kasten_s4.hinweis`, ks.hinweis, 140)
  }
}

/**
 * Zaehlt der Auftrag ueber dem Raster nach einem Doppelpunkt auf, was in die Zeile
 * gehoert, muss jedes Glied ein Spaltenkopf sein (oder die Fundstelle, die vorn in
 * der ersten Zelle steht). Sonst suchen Lernende eine Spalte, die es nicht gibt
 * (REVIEW-lernende-t2.md, B26: «Zeitmarke, wer spricht, Grund, Absicht» ueber
 * «Wer spricht · Kernaussage · Absicht · → Begriff»). Greift erst, wenn mindestens
 * zwei Glieder Spaltenkoepfe sind — eine Aufzaehlung von Inhalten («zwei haeufige,
 * zwei seltene Pruefwege») ist keine Spaltenliste.
 */
function auftragSpalten(datei, pfad, auftrag, spalten) {
  if (!istText(auftrag) || !Array.isArray(spalten)) return
  const i = auftrag.lastIndexOf(': ')
  if (i < 0) return
  const koepfe = spalten.flatMap((s) => String(s).replace(/^→\s*/, '').toLowerCase().split(/\s*\/\s*/)).filter(Boolean)
  const glieder = auftrag
    .slice(i + 2)
    .split(/[.;]/)[0]
    .replace(/\([^)]*\)/g, ' ')
    .split(/,| und | dann | sowie /)
    .map((g) => g.toLowerCase().replace(/[«»]/g, '').replace(/(^|\s)(vorn|hinten|dann|je|ein|eine|einen|die|der|das)(?=\s|$)/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  const fundstelle = /zeitmarke|seite|absatz|fundstelle|abschnitt/
  const istKopf = (g) => koepfe.some((k) => g.includes(k) || k.includes(g))
  const treffer = glieder.filter(istKopf)
  const fremd = glieder.filter((g) => !istKopf(g) && !fundstelle.test(g))
  if (treffer.length >= 2 && fremd.length)
    add('regel', 'ERR_V42_AUFTRAG_SPALTEN', datei, pfad, 'phase-5-spuren.md §8', `nennt «${fremd.join('», «')}»`, `nur Spaltenkoepfe woertlich: ${spalten.join(' · ')} (Fundstelle vorn in der ersten Zelle)`)
}

/** §3.1 Gemeinsamer Auftrag (Auftragsbogen). */
function budgetAuftrag(ga) {
  const datei = 'set.json'
  const b = 'gemeinsamer_auftrag'
  max(datei, `${b}.situation_text`, ga.situation_text, 900)
  anzahl(datei, `${b}.zahlen_tabelle`, ga.zahlen_tabelle, 0, 4, 'Zeilen')
  anzahl(datei, `${b}.schritte`, ga.schritte, 5, 5, 'Schritte')
  ;(ga.schritte ?? []).forEach((s, i) => {
    max(datei, `${b}.schritte[${i}].label`, s?.label, 30)
    max(datei, `${b}.schritte[${i}].hint`, s?.hint, 140)
  })
  anzahl(datei, `${b}.abgaben`, ga.abgaben, 0, 3)
  ;(ga.abgaben ?? []).forEach((a, i) => max(datei, `${b}.abgaben[${i}]`, a, 80))
  // Bezug auf die Hefte (Auftragsbogen A1): je Heft höchstens drei kurze Verweise.
  anzahl(datei, `${b}.heft_bezug`, ga.heft_bezug, 0, 2)
  ;(ga.heft_bezug ?? []).forEach((h, i) => {
    max(datei, `${b}.heft_bezug[${i}].titel`, h?.titel, 60)
    anzahl(datei, `${b}.heft_bezug[${i}].inhalte`, h?.inhalte, 1, 3)
    ;(h?.inhalte ?? []).forEach((t, j) => max(datei, `${b}.heft_bezug[${i}].inhalte[${j}]`, t, 60))
  })
}

/**
 * E25: `gemeinsamer_auftrag.produkte` — die zwei Produkte des Auftrags, das erste auf A2,
 * das zweite auf A3 des Auftragsbogens. Geprueft nur, wenn das Feld vorhanden ist; ohne
 * das Feld rendert der Bogen wie bisher.
 */
function regelAuftragProdukte(ga) {
  const pr = ga?.produkte
  if (pr === undefined) return
  const datei = 'set.json'
  const b = 'gemeinsamer_auftrag.produkte'
  const E = 'Entscheid E25'
  const err = (pfad, ist, soll, kat = 'regel') => add(kat, 'ERR_V42_AUFTRAG_PRODUKTE', datei, pfad, E, ist, soll)
  if (!Array.isArray(pr) || pr.length !== 2) {
    err(b, Array.isArray(pr) ? `${pr.length} Eintraege` : zeige(pr), 'genau 2 Eintraege (A2, A3)')
    return
  }
  const modi = Array.isArray(ga.sprachmodi) ? ga.sprachmodi : []
  pr.forEach((x, i) => {
    const p = `${b}[${i}]`
    if (!Number.isInteger(x?.schritt) || x.schritt < 1 || x.schritt > 5) err(`${p}.schritt`, zeige(x?.schritt), 'ganze Zahl 1–5')
    if (x?.form !== 'flaeche' && x?.form !== 'spur') err(`${p}.form`, zeige(x?.form), '"flaeche" oder "spur"')
    if (!modi.includes(x?.modus)) err(`${p}.modus`, zeige(x?.modus), `woertlich einer aus sprachmodi [${modi.join(' · ')}]`)
    if (x?.form === 'spur') {
      const st = x.stationen
      if (!Array.isArray(st) || st.length < 2 || st.length > 4 || !st.every(istText)) err(`${p}.stationen`, Array.isArray(st) ? `${st.length} Stationen` : zeige(st), '2–4 Stationen, keine leer')
      ;(Array.isArray(st) ? st : []).forEach((t, j) => {
        if (len(t) > 60) err(`${p}.stationen[${j}]`, `${len(t)} Zeichen «${kurz(t)}»`, '≤ 60 Zeichen', 'budget')
      })
      if (!istText(x.hinweis)) err(`${p}.hinweis`, zeige(x.hinweis), 'gesetzt (Satz ueber den Stationen)')
      else if (len(x.hinweis) > 260) err(`${p}.hinweis`, `${len(x.hinweis)} Zeichen`, '≤ 260 Zeichen', 'budget')
      // Die Zeile «Ziel … · Probelauf» ist einzeilig bemessen.
      if (x.dauer !== undefined && (!istText(x.dauer) || len(x.dauer) > 30)) err(`${p}.dauer`, zeige(x.dauer), 'Text ≤ 30 Zeichen oder weglassen', 'budget')
    }
  })
  if (Number.isInteger(pr[0]?.schritt) && pr[0].schritt === pr[1]?.schritt) err(b, `beide schritt ${pr[0].schritt}`, 'zwei verschiedene Schritte')
  // Abdeckung: zwei Eintraege duerfen denselben Modus tragen (Auftrag mit nur einem Sprachmodus).
  for (const m of [...new Set(modi)]) {
    const n = pr.filter((x) => x?.modus === m).length
    if (n < 1) err(b, `«${m}» ist modus keines Eintrags`, 'jeder Modus aus sprachmodi ist modus mindestens eines Eintrags')
  }
}

/** §3.1 Seiten 1/3/4, Quellenkarte. `rolle` aus dem Heft, das sie einbindet. */
function budgetKarte(id, k, rolle) {
  const datei = `quellen/${id}.json`
  max(datei, 'titel', k.titel, rolle === 'vertiefung' ? 70 : 80)
  if (typeof k.herausgeber === 'string' || typeof k.datum === 'string') {
    const ist = len(k.herausgeber ?? '') + len(k.datum ?? '')
    if (ist > 40) add('budget', 'ERR_V42_BUDGET', datei, 'herausgeber + datum', B, `${ist} Zeichen zusammen («${kurz(k.herausgeber, 30)}» + «${kurz(k.datum, 15)}»)`, '≤ 40 Zeichen')
  }
  max(datei, 'kurzbeschrieb', k.kurzbeschrieb, 180)
  const v = k.verortung
  const vText = typeof v === 'string' ? v
    : v && typeof v === 'object' ? (v.absaetze ?? [v.von, v.bis].filter((x) => x != null).join('–')) : null
  if (typeof vText === 'string') max(datei, 'verortung (gedruckt)', vText, 40)
  if (rolle === 'pflicht') {
    // S. 1, Kurzeintrag der Pflichtquelle: «Titel · Herausgeber, Datum» (+ QR).
    const zeile = `${k.titel ?? ''} · ${[k.herausgeber, k.datum].filter(Boolean).join(', ')}`
    max(datei, 'Kurzeintrag S. 1 (titel · herausgeber, datum)', zeile, 100)
  }
}

// -------------------------------------------------------------- §11.5 Regeln

const SPUR_KEYS = ['ohne_medien', 'mit_medien']
const POL_TYPEN = ['lehrmittel_quelle', 'position_gegenposition', 'modell_eigener_fall', 'recht_praxis', 'quelle_quelle']
const NUR_MEDIEN = ['lehrmittel_quelle', 'quelle_quelle']
const R = (n) => `§11.5 Nr. ${n}`

/** Nr. 1: Kern = genau LF1, LF2; jede Spur = genau LF3 (Raster) + LF4 (pol_typ). */
function regel1(datei, sit) {
  const kern = sit.leitfragen ?? []
  const nrs = kern.map((l) => l.nr)
  if (kern.length !== 2 || !nrs.includes(1) || !nrs.includes(2)) {
    add('regel', 'ERR_V42_R1', datei, 'leitfragen', R(1), `${kern.length} Leitfragen (nr ${nrs.join(', ') || '—'})`, 'genau LF1 und LF2')
  }
  for (const key of SPUR_KEYS) {
    const spur = sit.spuren?.[key]
    if (!spur) continue
    const lfs = spur.leitfragen ?? []
    const p = `spuren.${key}.leitfragen`
    const snrs = lfs.map((l) => l.nr)
    if (lfs.length !== 2 || !snrs.includes(3) || !snrs.includes(4)) {
      add('regel', 'ERR_V42_R1', datei, p, R(1), `${lfs.length} Leitfragen (nr ${snrs.join(', ') || '—'})`, 'genau LF3 und LF4')
    }
    lfs.forEach((lf, i) => {
      if (lf.nr === 3 && lf.antwortform !== 'raster') {
        add('regel', 'ERR_V42_R1', datei, `${p}[${i}].antwortform`, R(1), zeige(lf.antwortform), '"raster"')
      }
      if (lf.nr === 4 && !istText(lf.pol_typ)) {
        add('regel', 'ERR_V42_R1', datei, `${p}[${i}].pol_typ`, R(1), zeige(lf.pol_typ), 'gesetzt')
      }
    })
  }
}

/** Nr. 2: Medien-Spur hat genau 1 Pflichtquelle, hoechstens 2 Vertiefungen. */
function regel2(datei, sit) {
  const spur = sit.spuren?.mit_medien
  if (!spur) return
  const p = 'spuren.mit_medien.quellen'
  const q = Array.isArray(spur.quellen) ? spur.quellen : []
  const pflicht = q.filter((x) => x?.rolle === 'pflicht').length
  const vert = q.filter((x) => x?.rolle === 'vertiefung').length
  if (pflicht !== 1) add('regel', 'ERR_V42_R2', datei, p, R(2), `${pflicht} mit rolle "pflicht"`, 'genau 1')
  if (vert > 2) add('regel', 'ERR_V42_R2', datei, p, R(2), `${vert} mit rolle "vertiefung"`, '≤ 2')
  q.forEach((x, i) => {
    if (x?.rolle !== 'pflicht' && x?.rolle !== 'vertiefung') {
      add('regel', 'ERR_V42_R2', datei, `${p}[${i}].rolle`, R(2), zeige(x?.rolle), '"pflicht" oder "vertiefung"')
    }
  })
}

/** Nr. 2 / §5: Laenge aus der Karte. `rolle` = Einsatz im Heft (Ersatz erbt die Rolle). */
function regel2Laenge(id, k, rolle) {
  const datei = `quellen/${id}.json`
  const typ = String(k.typ ?? '').toLowerCase()
  const zahl = (feld, soll, einheit) => {
    const v = k[feld]
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      add('regel', 'ERR_V42_R2_LAENGE', datei, feld, `${R(2)} / §5`, `${zeige(v)} (keine Zahl)`, `Zahl ≤ ${soll} ${einheit} (${rolle}, Typ ${typ})`)
    } else if (v > soll) {
      add('regel', 'ERR_V42_R2_LAENGE', datei, feld, `${R(2)} / §5`, `${v} ${einheit}`, `≤ ${soll} ${einheit} (${rolle}, Typ ${typ})`)
    }
  }
  if (rolle === 'vertiefung') {
    if (typ === 'video' || typ === 'audio') zahl('dauer_sek', 360, 'Sek.')
    return
  }
  if (typ === 'video' || typ === 'audio') zahl('dauer_sek', 240, 'Sek.')
  else if (typ === 'artikel') zahl('woerter', 450, 'Woerter')
  else if (typ === 'grafik' || typ === 'datensatz') zahl('woerter', 250, 'Woerter')
  else if (typ === 'rechtstext') hinweis(datei, 'typ', 'Rechtstext: «≤ 3 Artikel» (§5) hat kein Datenfeld — von Hand pruefen')
  else add('regel', 'ERR_V42_R2_LAENGE', datei, 'typ', `${R(2)} / §5`, zeige(k.typ), 'video, audio, artikel, grafik, datensatz oder rechtstext')
}

/** §11.4: Pflichtfelder der Karte. */
function pflichtfelderKarte(id, k) {
  const datei = `quellen/${id}.json`
  const regel = '§11.4'
  if (k.id !== id) add('regel', 'ERR_V42_KARTE_PFLICHTFELD', datei, 'id', regel, zeige(k.id), `"${id}" (= Dateiname)`)
  for (const f of ['typ', 'titel', 'herausgeber', 'datum', 'url', 'kurzbeschrieb', 'sachlage_geprueft']) {
    if (!istText(k[f])) add('regel', 'ERR_V42_KARTE_PFLICHTFELD', datei, f, regel, zeige(k[f]), 'nicht-leerer Text')
  }
  if (k.konstruiert !== false) add('regel', 'ERR_V42_KARTE_PFLICHTFELD', datei, 'konstruiert', regel, zeige(k.konstruiert), 'false')
}

/** Nr. 3: Ohne-Medien-Spur hat Lehrmittel-Knoten und Beispielzeile, keine Quellen. */
function regel3(datei, sit) {
  const spur = sit.spuren?.ohne_medien
  if (!spur) return
  const i = (spur.leitfragen ?? []).findIndex((l) => l.nr === 3)
  const p = `spuren.ohne_medien.leitfragen[${i < 0 ? '?' : i}].raster`
  const r = i < 0 ? null : spur.leitfragen[i].raster
  if (!r) add('regel', 'ERR_V42_R3', datei, p, R(3), 'kein raster', 'raster mit knoten_ref und beispielzeile')
  else {
    if (!istText(r.knoten_ref)) add('regel', 'ERR_V42_R3', datei, `${p}.knoten_ref`, R(3), zeige(r.knoten_ref), 'gesetzt')
    if (!Array.isArray(r.beispielzeile) || !r.beispielzeile.length || !r.beispielzeile.every(istText)) {
      add('regel', 'ERR_V42_R3', datei, `${p}.beispielzeile`, R(3), zeige(r.beispielzeile), 'gesetzt, alle Zellen gefuellt')
    }
  }
  if (Array.isArray(spur.quellen) ? spur.quellen.length : spur.quellen != null) {
    add('regel', 'ERR_V42_R3', datei, 'spuren.ohne_medien.quellen', R(3), 'quellen vorhanden', 'keine quellen')
  }
}

/** Nr. 4: keine Ohne-Medien-Spur, wenn Rezeption muendlich/audiovisuell verlangt ist. */
function regel4(datei, sit, L, prinzip) {
  if (!SPUR_KEYS.some((k) => sit.spuren?.[k])) {
    add('regel', 'ERR_V42_R4', datei, 'spuren', R(4), 'keine Spur', 'ohne_medien und/oder mit_medien')
    return
  }
  const modi = [...new Set([...(sit.nrlp?.sprachmodi ?? []), ...(prinzip?.modi_pro_heft?.[L] ?? [])])]
  const verlangt = modi.filter((m) => /^Rezeption\s+(m[uü]ndlich|audiovisuell)/i.test(m))
  if (verlangt.length && sit.spuren.ohne_medien) {
    add('regel', 'ERR_V42_R4', datei, 'spuren.ohne_medien', R(4), `Spur vorhanden, Heft verlangt «${verlangt.join('», «')}»`, 'keine Spur ohne_medien')
  }
}

const polTyp = (sit, key) => (sit?.spuren?.[key]?.leitfragen ?? []).find((l) => l.nr === 4)?.pol_typ

/** Nr. 5: Pol-Typ A ≠ B je Spur; lehrmittel_quelle / quelle_quelle nur in der Medien-Spur. */
function regel5(hefte) {
  for (const [L, sit] of Object.entries(hefte)) {
    for (const key of SPUR_KEYS) {
      const t = polTyp(sit, key)
      if (!istText(t)) continue
      const i = sit.spuren[key].leitfragen.findIndex((l) => l.nr === 4)
      const p = `spuren.${key}.leitfragen[${i}].pol_typ`
      if (!POL_TYPEN.includes(t)) add('regel', 'ERR_V42_R5', `herausforderung_${L}.json`, p, `${R(5)} / §6.1`, `"${t}"`, POL_TYPEN.join(' | '))
      if (key === 'ohne_medien' && NUR_MEDIEN.includes(t)) {
        add('regel', 'ERR_V42_R5', `herausforderung_${L}.json`, p, R(5), `"${t}" in Spur ohne_medien`, 'lehrmittel_quelle / quelle_quelle nur in mit_medien')
      }
    }
  }
  for (const key of SPUR_KEYS) {
    const a = polTyp(hefte.A, key)
    const b = polTyp(hefte.B, key)
    if (istText(a) && a === b) {
      add('regel', 'ERR_V42_R5', 'herausforderung_A.json + herausforderung_B.json', `spuren.${key} › LF4.pol_typ`, R(5), `A = B = "${a}"`, 'A ≠ B innerhalb derselben Spur')
    }
  }
}

/** Nr. 6 (Wortlaut): Name, Dimension und vier Stufen zeichengenau aus kn.rubrik_shared. */
function wortlaut(datei, basis, liste, knKriterien) {
  ;(liste ?? []).forEach((k, i) => {
    const p = `${basis}[${i}]`
    const kn = knKriterien.find((x) => x.name === k?.kn_kriterium)
    if (!kn) {
      add('regel', 'ERR_V42_R6', datei, `${p}.kn_kriterium`, R(6), zeige(k?.kn_kriterium), `ein Name aus kn.rubrik_shared.kriterien: ${knKriterien.map((x) => `«${x.name}»`).join(', ')}`)
      return
    }
    if (k.dimension !== kn.dimension) add('regel', 'ERR_V42_R6', datei, `${p}.dimension`, R(6), zeige(k.dimension), `"${kn.dimension}" (KN)`)
    const soll = kn.stufen ?? []
    const ist = Array.isArray(k.stufen) ? k.stufen : []
    if (ist.length !== 4) add('regel', 'ERR_V42_R6', datei, `${p}.stufen`, R(6), `${ist.length} Stufen`, '4 Stufen')
    for (let j = 0; j < Math.max(ist.length, soll.length); j++) {
      if (ist[j] !== soll[j]) {
        add('regel', 'ERR_V42_R6', datei, `${p}.stufen[${j}]`, `${R(6)} Wortlaut`, `«${kurz(ist[j] ?? '—', 70)}»`, `«${kurz(soll[j] ?? '—', 70)}» (kn.rubrik_shared, zeichengenau)`)
      }
    }
  })
}

function regel6(hefte, set, kn) {
  const knKriterien = kn?.rubrik_shared?.kriterien
  if (!Array.isArray(knKriterien) || !knKriterien.length) {
    add('regel', 'ERR_V42_R6', 'kn.json', 'rubrik_shared.kriterien', R(6), 'fehlt', 'Liste der KN-Kriterien')
    return
  }
  const alle = new Set()
  for (const [L, sit] of Object.entries(hefte)) {
    const datei = `herausforderung_${L}.json`
    const fk = Array.isArray(sit.feedback_kriterien) ? sit.feedback_kriterien : []
    const dim = (k) => knKriterien.find((x) => x.name === k?.kn_kriterium)?.dimension ?? k?.dimension
    const suk = fk.filter((k) => dim(k) === 'SuK').length
    const ges = fk.filter((k) => dim(k) === 'Ges').length
    if (fk.length !== 2 || suk !== 1 || ges !== 1) {
      add('regel', 'ERR_V42_R6', datei, 'feedback_kriterien', R(6), `${fk.length} Kriterien (${suk} SuK, ${ges} Ges)`, 'genau 2 (1 SuK + 1 Ges)')
    }
    fk.forEach((k) => alle.add(k?.kn_kriterium))
    wortlaut(datei, 'feedback_kriterien', fk, knKriterien)
  }
  if (hefte.A && hefte.B) {
    const fehlt = knKriterien.map((k) => k.name).filter((n) => !alle.has(n))
    if (fehlt.length) {
      add('regel', 'ERR_V42_R6', 'herausforderung_A.json + herausforderung_B.json', 'feedback_kriterien', R(6), `A ∪ B ohne ${fehlt.map((x) => `«${x}»`).join(', ')}`, `alle ${knKriterien.length} KN-Kriterien`)
    }
  }
  if (set) {
    const fk = Array.isArray(set.gemeinsamer_auftrag?.feedback_kriterien) ? set.gemeinsamer_auftrag.feedback_kriterien : []
    const namen = new Set(fk.map((k) => k?.kn_kriterium))
    const fehlt = knKriterien.map((k) => k.name).filter((n) => !namen.has(n))
    if (fk.length !== knKriterien.length || fehlt.length) {
      add('regel', 'ERR_V42_R6', 'set.json', 'gemeinsamer_auftrag.feedback_kriterien', R(6), `${fk.length} Kriterien${fehlt.length ? `, es fehlt ${fehlt.map((x) => `«${x}»`).join(', ')}` : ''}`, `alle ${knKriterien.length} KN-Kriterien`)
    }
    wortlaut('set.json', 'gemeinsamer_auftrag.feedback_kriterien', fk, knKriterien)
  }
}

/**
 * Produkt als Bild (E17): drei Blöcke nebeneinander, Liste oder Tabelle. Das Beispielbild
 * steht im Heft auf S. 6 und ist darum enger als das Blatt im Dokument «Lösungen» der Lehrperson.
 */
// Budgets der Blockarten `text` und `wechsel` (E26), gemessen am gerenderten Blatt
// (messen-v42.mjs fuer das HTML, Seitenzahl in Word fuer das .docx; Gold-Einheit als Traeger,
// je das engere der beiden Hefte und das engere der beiden Formate): `klein` = Heft
// S. 6 unter den Methodenkarten, `gross` = Dokument «Lösungen». Zeichen zaehlen je Block,
// ueber alle Absaetze bzw. Beitraege. Die Spalten sind bei drei Bloecken schmaler als bei
// zwei — darum je Blockzahl eine Grenze. Gemessen an Blaettern mit lauter gleichen Bloecken;
// ein gemischtes Blatt (Text neben Tabelle) zusaetzlich mit messen-v42.mjs pruefen.
const PB_E26 = {
  klein: {
    2: { absaetze: 4, textZeichen: 520, beitraege: 5, wechselZeichen: 360 },
    3: { absaetze: 3, textZeichen: 320, beitraege: 5, wechselZeichen: 180 },
  },
  gross: {
    2: { absaetze: 5, textZeichen: 1100, beitraege: 8, wechselZeichen: 550 },
    3: { absaetze: 5, textZeichen: 750, beitraege: 6, wechselZeichen: 240 },
  },
}
/** Sprecher der Wechselrede: die Spalte ist so breit wie der laengste Name. */
const PB_WER = 12

function budgetProduktBild(datei, basis, bild, grenze) {
  if (!bild) {
    add('regel', 'ERR_V42_PRODUKTBILD', datei, basis, 'Entscheid E17', 'fehlt', 'vorhanden (Beispiel im Heft und Blatt im Dokument «Lösungen»)')
    return
  }
  max(datei, `${basis}.titel`, bild.titel, 90)
  anzahl(datei, `${basis}.legende`, bild.legende, 0, 3)
  ;(bild.legende ?? []).forEach((l, i) => max(datei, `${basis}.legende[${i}].text`, l?.text, 28))
  const keys = new Set((bild.legende ?? []).map((l) => l?.key))
  anzahl(datei, `${basis}.bloecke`, bild.bloecke, 2, 3, 'Bloecke')
  const e26 = grenze.e26[(bild.bloecke ?? []).length === 2 ? 2 : 3]
  ;(bild.bloecke ?? []).forEach((b, i) => {
    max(datei, `${basis}.bloecke[${i}].titel`, b?.titel, 32)
    anzahl(datei, `${basis}.bloecke[${i}].eintraege`, b?.eintraege, 0, grenze.eintraege)
    ;(b?.eintraege ?? []).forEach((e, j) => {
      max(datei, `${basis}.bloecke[${i}].eintraege[${j}].text`, e?.text, grenze.text)
      max(datei, `${basis}.bloecke[${i}].eintraege[${j}].notiz`, e?.notiz, 60)
    })
    anzahl(datei, `${basis}.bloecke[${i}].zeilen`, b?.zeilen, 0, 12, 'Zeilen')
    ;(b?.zeilen ?? []).forEach((z, j) => max(datei, `${basis}.bloecke[${i}].zeilen[${j}].zellen[0]`, z?.zellen?.[0], 30))
    // E26: genau eine Blockart je Block.
    const voll = (x) => Array.isArray(x) && x.length > 0
    const arten = [
      voll(b?.eintraege) && 'eintraege', (voll(b?.kopf) || voll(b?.zeilen)) && 'kopf/zeilen',
      b?.text !== undefined && 'text', b?.wechsel !== undefined && 'wechsel',
    ].filter(Boolean)
    if (arten.length !== 1) {
      add('regel', 'ERR_V42_PRODUKTBILD', datei, `${basis}.bloecke[${i}]`, 'Entscheid E26', arten.length ? `${arten.length} Blockarten (${arten.join(' + ')})` : 'keine Blockart', 'genau eine von eintraege · kopf/zeilen · text · wechsel')
    }
    if (b?.text !== undefined) {
      const pfad = `${basis}.bloecke[${i}].text`
      if (!Array.isArray(b.text) || !b.text.every(istText)) add('regel', 'ERR_V42_PRODUKTBILD', datei, pfad, 'Entscheid E26', zeige(b.text), 'Liste nicht-leerer Absaetze')
      else {
        anzahl(datei, pfad, b.text, 1, e26.absaetze, 'Absaetze')
        const summe = b.text.reduce((n, t) => n + len(t), 0)
        if (summe > e26.textZeichen) add('budget', 'ERR_V42_BUDGET', datei, `${pfad} (alle Absaetze)`, B, `${summe} Zeichen`, `≤ ${e26.textZeichen} Zeichen je Block`)
      }
    }
    if (b?.wechsel !== undefined) {
      const pfad = `${basis}.bloecke[${i}].wechsel`
      if (!Array.isArray(b.wechsel) || !b.wechsel.every((w) => istText(w?.wer) && istText(w?.text))) add('regel', 'ERR_V42_PRODUKTBILD', datei, pfad, 'Entscheid E26', kurz(zeige(b.wechsel), 80), 'Liste von Beitraegen mit wer und text')
      else {
        anzahl(datei, pfad, b.wechsel, 2, e26.beitraege, 'Beitraege')
        b.wechsel.forEach((w, j) => max(datei, `${pfad}[${j}].wer`, w.wer, PB_WER))
        const summe = b.wechsel.reduce((n, w) => n + len(w.text), 0)
        if (summe > e26.wechselZeichen) add('budget', 'ERR_V42_BUDGET', datei, `${pfad} (alle Beitraege)`, B, `${summe} Zeichen`, `≤ ${e26.wechselZeichen} Zeichen je Block`)
      }
    }
    for (const [liste, name] of [[b?.eintraege, 'eintraege'], [b?.zeilen, 'zeilen'], [Array.isArray(b?.wechsel) ? b.wechsel : [], 'wechsel']]) {
      ;(liste ?? []).forEach((e, j) => {
        if (e?.marke && !keys.has(e.marke)) {
          add('regel', 'ERR_V42_PRODUKTBILD', datei, `${basis}.bloecke[${i}].${name}[${j}].marke`, 'Entscheid E17', zeige(e.marke), 'ein key aus legende')
        }
      })
    }
  })
}

/**
 * Glossar je Heft und Begriffsnetz (E17): Die Knoten der Mindmap sind Glossarbegriffe des
 * Hefts, die in beiden Spuren gelten; jeder solche Begriff ist auch ein Knoten.
 */
function regelGlossar(set, hefte) {
  const glossar = Array.isArray(set?.glossar) ? set.glossar : []
  glossar.forEach((g, i) => {
    max('set.json', `glossar[${i}].begriff`, g?.begriff, 25)
    max('set.json', `glossar[${i}].definition`, g?.definition, 90)
  })
  for (const [L, sit] of Object.entries(hefte)) {
    const kern = glossar.filter((g) => g?.heft === L && !g?.spur).map((g) => g.begriff)
    const knoten = (sit.mindmap_aeste ?? []).filter((a) => !a?.transfer).flatMap((a) => a?.punkte ?? [])
    if (!kern.length) add('regel', 'ERR_V42_GLOSSAR', 'set.json', 'glossar', 'Entscheid E17', `kein Eintrag für Heft ${L}`, 'Glossar je Heft')
    for (const k of knoten) {
      if (!kern.includes(k)) add('regel', 'ERR_V42_GLOSSAR', `herausforderung_${L}.json`, 'mindmap_aeste', 'Entscheid E17', `Knoten ${zeige(k)} steht nicht im Glossar von Heft ${L}`, 'jeder Knoten ist ein Glossarbegriff (ohne spur)')
    }
    for (const b of kern) {
      if (!knoten.includes(b)) add('regel', 'ERR_V42_GLOSSAR', 'set.json', 'glossar', 'Entscheid E17', `Begriff ${zeige(b)} (Heft ${L}) ist kein Knoten der Mindmap`, 'jeder Glossarbegriff ohne spur ist ein Knoten')
    }
    for (const spur of ['ohne_medien', 'mit_medien']) {
      anzahl('set.json', `glossar (Heft ${L}, nur ${spur})`, glossar.filter((g) => g?.heft === L && g?.spur === spur), 0, 2)
    }
  }
}

/**
 * Lösungen für alle Felder (E19): Das Dokument «Lösungen» der Lehrperson braucht je Heft
 * und Spur ein ausgefülltes Raster mit Befund, die Denkhilfe bzw. die Erwartungen zu den
 * Vertiefungen und eine Lösung des Abschlusses.
 */
function regelLoesungen(hefte) {
  const E = 'Entscheid E19'
  for (const [L, sit] of Object.entries(hefte)) {
    const datei = `herausforderung_${L}.json`
    for (const [key, spur] of Object.entries(sit.spuren ?? {})) {
      const basis = `spuren.${key}`
      const lf3 = (spur?.leitfragen ?? []).find((l) => l?.antwortform === 'raster')
      const r = lf3?.raster ?? {}
      const zeilen = lf3?.loesung?.raster_zeilen
      const soll = Number(r.zeilen) || 0
      const spalten = (r.spalten ?? []).length || ((spur?.quellen ?? []).find((q) => q?.rolle === 'pflicht')?.raster?.spalten ?? []).length
      if (!Array.isArray(zeilen) || zeilen.length !== soll || zeilen.some((z) => !Array.isArray(z) || z.length !== spalten)) {
        add('regel', 'ERR_V42_LOESUNG', datei, `${basis}.leitfragen[LF3].loesung.raster_zeilen`, E, Array.isArray(zeilen) ? `${zeilen.length} Zeilen` : 'fehlt', `${soll} Zeilen mit je ${spalten} Zellen`)
      } else if (Array.isArray(r.beispielzeile) && JSON.stringify(zeilen[0]) !== JSON.stringify(r.beispielzeile)) {
        add('regel', 'ERR_V42_LOESUNG', datei, `${basis}.leitfragen[LF3].loesung.raster_zeilen[0]`, E, zeige(zeilen[0].join(' | ')), 'gleich wie raster.beispielzeile')
      }
      if (!istText(lf3?.loesung?.befund)) add('regel', 'ERR_V42_LOESUNG', datei, `${basis}.leitfragen[LF3].loesung.befund`, E, 'fehlt', 'ein möglicher Befund')
      const k = spur?.kasten_s4
      if (k?.typ === 'denkhilfe') {
        const n = (k.spalten ?? []).length
        const lz = k.loesung_zeilen
        if (!Array.isArray(lz) || !lz.length || lz.some((z) => !Array.isArray(z) || z.length !== n)) {
          add('regel', 'ERR_V42_LOESUNG', datei, `${basis}.kasten_s4.loesung_zeilen`, E, Array.isArray(lz) ? `${lz.length} Zeilen` : 'fehlt', `mindestens 1 Zeile mit je ${n} Zellen`)
        }
      }
      ;(spur?.quellen ?? []).forEach((q, i) => {
        if (q?.rolle === 'vertiefung' && !istText(q.erwartung)) add('regel', 'ERR_V42_LOESUNG', datei, `${basis}.quellen[${i}].erwartung`, E, 'fehlt', 'Erwartung zur Leitfrage der Vertiefung')
      })
      const eigene = sit.abschluss?.loesung?.eigene_knoten?.[key]
      if (!Array.isArray(eigene) || eigene.length !== 2) add('regel', 'ERR_V42_LOESUNG', datei, `abschluss.loesung.eigene_knoten.${key}`, E, zeige(eigene), '2 Begriffe für die leeren Knoten')
    }
    const lo = sit.abschluss?.loesung
    if (!lo) { add('regel', 'ERR_V42_LOESUNG', datei, 'abschluss.loesung', E, 'fehlt', 'vorhanden'); continue }
    const transferTitel = (sit.mindmap_aeste ?? []).find((a) => a?.transfer)?.titel
    const knoten = new Set((sit.mindmap_aeste ?? []).flatMap((a) => a?.punkte ?? []))
    const v = lo.verbindungen ?? []
    if (v.length < 5) add('regel', 'ERR_V42_LOESUNG', datei, 'abschluss.loesung.verbindungen', E, `${v.length} Verbindungen`, 'mindestens 5')
    if (!v.some((x) => x?.nach === transferTitel || x?.von === transferTitel)) add('regel', 'ERR_V42_LOESUNG', datei, 'abschluss.loesung.verbindungen', E, 'keine Verbindung zum Transfer-Feld', `eine zu ${zeige(transferTitel)}`)
    v.forEach((x, i) => {
      for (const ende of [x?.von, x?.nach]) {
        if (ende !== transferTitel && !knoten.has(ende)) add('regel', 'ERR_V42_LOESUNG', datei, `abschluss.loesung.verbindungen[${i}]`, E, zeige(ende), 'ein Knoten des Begriffsnetzes oder das Transfer-Feld')
      }
    })
    if (!istText(lo.transfer)) add('regel', 'ERR_V42_LOESUNG', datei, 'abschluss.loesung.transfer', E, 'fehlt', 'Eintrag für das Transfer-Feld')
    if ((lo.quercheck ?? []).length !== (sit.abschluss?.quercheck ?? []).length) add('regel', 'ERR_V42_LOESUNG', datei, 'abschluss.loesung.quercheck', E, `${(lo.quercheck ?? []).length} Antworten`, 'eine je Quer-Check-Frage')
    if ((lo.mitnahme ?? []).length !== (sit.abschluss?.mitnahme ?? []).length) add('regel', 'ERR_V42_LOESUNG', datei, 'abschluss.loesung.mitnahme', E, `${(lo.mitnahme ?? []).length} Einträge`, 'einer je Zeile')
  }
}

/** Nr. 7: Mindmap-Zentrum gleich in A und B; genau ein Transfer-Ast je Heft. */
function regel7(hefte) {
  const { A, B: Bh } = hefte
  if (A && Bh && A.mindmap_zentrum !== Bh.mindmap_zentrum) {
    add('regel', 'ERR_V42_R7', 'herausforderung_A.json + herausforderung_B.json', 'mindmap_zentrum', R(7), `A ${zeige(A.mindmap_zentrum)}, B ${zeige(Bh.mindmap_zentrum)}`, 'identisch in A und B')
  }
  for (const [L, sit] of Object.entries(hefte)) {
    const n = (sit.mindmap_aeste ?? []).filter((a) => a?.transfer === true).length
    if (n !== 1) add('regel', 'ERR_V42_R7', `herausforderung_${L}.json`, 'mindmap_aeste', R(7), `${n} Aeste mit transfer: true`, 'genau 1')
  }
}

/** Nr. 8: Sprachmodi des Auftrags = prinzip.modi_auftrag (als Menge); Interaktion schliesst Einzelarbeit aus. */
function regel8(set, prinzip) {
  const ga = set?.gemeinsamer_auftrag
  if (!ga) {
    if (set) add('regel', 'ERR_V42_R8', 'set.json', 'gemeinsamer_auftrag', R(8), 'fehlt', 'vorhanden')
    return
  }
  const ist = Array.isArray(ga.sprachmodi) ? ga.sprachmodi : []
  const soll = Array.isArray(prinzip?.modi_auftrag) ? prinzip.modi_auftrag : null
  if (!soll) {
    add('regel', 'ERR_V42_R8', 'prinzip.json', 'modi_auftrag', R(8), 'fehlt', 'Liste der Sprachmodi des Auftrags')
  } else {
    const a = [...new Set(ist)].sort()
    const b = [...new Set(soll)].sort()
    if (a.length !== b.length || a.some((x, i) => x !== b[i])) {
      add('regel', 'ERR_V42_R8', 'set.json', 'gemeinsamer_auftrag.sprachmodi', R(8), `[${ist.join(' · ')}]`, `= prinzip.modi_auftrag [${soll.join(' · ')}]`)
    }
  }
  const interaktion = ist.filter((m) => /^Interaktion/i.test(m))
  const einzel = (ga.sozialform?.zulaessig ?? []).filter((s) => /einzel/i.test(String(s)))
  if (interaktion.length && einzel.length) {
    add('regel', 'ERR_V42_R8', 'set.json', 'gemeinsamer_auftrag.sozialform.zulaessig', R(8), `enthaelt «${einzel.join('», «')}» bei «${interaktion.join('», «')}»`, 'keine Einzelarbeit')
  }
}

/**
 * Nr. 9, soweit ein Skript sie fassen kann: Lebensbereich und `kontext_ausschluss`
 * sind gefuehrt, und kein dort genannter Gegenstand von A/B steht im Text des
 * gemeinsamen Auftrags. Der KN-Fall laeuft ueber den Fall-Ausschluss (unten).
 * Ob die Lebensbereiche inhaltlich verschieden sind, bleibt ein Urteil.
 */
function regel9Kontext(set, fallBegriffe) {
  const ga = set?.gemeinsamer_auftrag
  if (!ga) return
  if (!istText(ga.lebensbereich)) add('regel', 'ERR_V42_R9', 'set.json', 'gemeinsamer_auftrag.lebensbereich', R(9), zeige(ga.lebensbereich), 'gesetzt')
  const ka = ga.kontext_ausschluss
  if (!Array.isArray(ka) || !ka.length) {
    add('regel', 'ERR_V42_R9', 'set.json', 'gemeinsamer_auftrag.kontext_ausschluss', R(9), zeige(ka), 'nicht-leere Liste')
    return
  }
  const begriffe = ka
    .flatMap((e) => String(e).replace(/\s*\([^)]*\)\s*$/, '').split(','))
    .map((s) => s.trim())
    .filter((s) => len(s) >= 4)
    .filter((s) => !fallBegriffe.some((f) => s.toLowerCase().includes(f)))
  const sichtbar = {
    titel: ga.titel, situation_text: ga.situation_text, zahlen_tabelle: ga.zahlen_tabelle, leitfrage: ga.leitfrage,
    mehrdeutigkeit: ga.mehrdeutigkeit, auftrag: ga.auftrag, schritte: ga.schritte, abgaben: ga.abgaben,
  }
  for (const [pfad, text] of strings(sichtbar, 'gemeinsamer_auftrag')) {
    const t = text.toLowerCase()
    const treffer = begriffe.filter((b) => t.includes(b.toLowerCase()))
    if (treffer.length) {
      add('regel', 'ERR_V42_R9', 'set.json', pfad, R(9), `nennt ${treffer.map((x) => `«${x}»`).join(', ')} (steht in kontext_ausschluss)`, 'kein Gegenstand von A/B im Auftrag')
    }
  }
}

/** Nr. 9, Fall-Ausschluss: kein Begriff des KN-Falls. `ausnahme(pfad)` nimmt Felder aus. */
function fallAusschluss(datei, wurzel, basis, begriffe, ausnahme) {
  for (const [pfad, text] of strings(wurzel, basis)) {
    if (ausnahme(pfad)) continue
    const t = text.toLowerCase()
    const treffer = begriffe.filter((b) => t.includes(b))
    if (treffer.length) {
      add('regel', 'ERR_V42_R9_FALL', datei, pfad, `${R(9)} Fall-Ausschluss`, `nennt ${treffer.map((x) => `«${x}»`).join(', ')}: «${kurz(text)}»`, 'kein Begriff des KN-Falls')
    }
  }
}

/** Ausnahmen beim Fall-Ausschluss: woertlicher KN-Wortlaut, das Ausschluss-Feld selbst, KN-Uebergabe. */
const FALL_AUSNAHME = (p) =>
  /(^|\.)feedback_kriterien\[\d+\]\.stufen\[\d+\]$/.test(p) ||
  /(^|\.)kontext_ausschluss(\[\d+\])?$/.test(p) ||
  /(^|\.)prinzip_handoff\.kn_aktivierung$/.test(p)

/** Platzhalter: genau die benannten Zeichenfolgen. */
const PLATZHALTER = ['[QUELLE SUCHEN', '[URL', '[JJJJ', '[HERAUSGEBER', 'verifizieren]', '[Beispiel aus', '[nach ', '[abhängig', '[Datum', '[Vier ']

function platzhalter(datei, wurzel) {
  for (const [pfad, text] of strings(wurzel)) {
    const treffer = PLATZHALTER.filter((m) => text.includes(m))
    if (treffer.length) add('platzhalter', 'ERR_V42_PLATZHALTER', datei, pfad, 'Platzhalter', `${treffer.map((m) => `«${m}»`).join(' + ')} in «${kurz(text)}»`, 'kein Platzhalter')
  }
}

/** Nr. 10, erster Teil: kein «ß». */
function eszett(datei, wurzel) {
  for (const [pfad, text] of strings(wurzel)) {
    if (text.includes('ß')) add('regel', 'ERR_V42_R10_ESZETT', datei, pfad, R(10), `«ß» in «${kurz(text)}»`, 'kein «ß»')
  }
}

/** Nr. 10, zweiter Teil: keine Volltexte — kein String-Feld einer Quellenkarte > 400 Zeichen. */
function regel10Volltext(id, k) {
  for (const [pfad, text] of strings(k)) {
    if (len(text) > 400) add('regel', 'ERR_V42_R10_VOLLTEXT', `quellen/${id}.json`, pfad, R(10), `${len(text)} Zeichen`, '≤ 400 Zeichen (kein Volltext im Repo)')
  }
}

// -------------------------------------------------------------------- Lauf

const set = lade('set.json')
const prinzip = lade('prinzip.json')
const kn = lade('kn.json')
const hefte = {}
for (const L of ['A', 'B']) {
  const sit = lade(`herausforderung_${L}.json`)
  if (sit) hefte[L] = sit
}

// Seit der Freigabe vom 05.10.2026 (E32) darf eine v4.2-Einheit publiziert sein. Dass ein
// frisch erzeugter Ordner «entwurf» trägt, erzwingt check-all unter --neu und --cloud.
if (set && set.status !== 'entwurf' && set.status !== 'publiziert') {
  add('regel', 'ERR_V42_STATUS', 'set.json', 'status', 'E32', zeige(set.status), '"entwurf" oder "publiziert"')
}

// Fall-Begriffe: aus dem Prinzip, plus Wortformen. Vergleich in Kleinbuchstaben.
const fallListe = prinzip?.hybrid_situation_spec?.fall_ausschluss_hefte_und_auftrag
if (prinzip && (!Array.isArray(fallListe) || !fallListe.length)) {
  add('regel', 'ERR_V42_R9', 'prinzip.json', 'hybrid_situation_spec.fall_ausschluss_hefte_und_auftrag', R(9), zeige(fallListe), 'Liste der Begriffe des KN-Falls')
}
const FALL_BEGRIFFE = [...new Set([
  ...(Array.isArray(fallListe) ? fallListe : []).map((s) => String(s).toLowerCase().trim()).filter(Boolean),
])]

/** Rolle, unter der eine Quellenkarte eingebunden ist (Budget, §5). Pflicht schlaegt Vertiefung. */
const rolleDerKarte = new Map()
const setzeRolle = (id, rolle) => {
  if (rolle && (!rolleDerKarte.has(id) || rolle === 'pflicht')) rolleDerKarte.set(id, rolle)
}

for (const [L, sit] of Object.entries(hefte)) {
  const datei = `herausforderung_${L}.json`

  if (sit.template !== TEMPLATE_V42) {
    add('regel', 'ERR_V42_TEMPLATE', datei, 'template', '§11.1', zeige(sit.template), `"${TEMPLATE_V42}"`)
  }

  regel1(datei, sit)
  regel2(datei, sit)
  regel3(datei, sit)
  regel4(datei, sit, L, prinzip)

  // Methoden-Anker: genau 4 Eintraege, genau einer «__spur__», alle Refs als Karte.
  const methoden = Array.isArray(sit.methoden) ? sit.methoden : []
  if (methoden.length !== 4) add('regel', 'ERR_V42_METHODEN', datei, 'methoden', 'Methoden-Anker §3 S. 6', `${Array.isArray(sit.methoden) ? methoden.length : 'fehlt (0)'} Eintraege`, 'genau 4')
  const spurPlatz = methoden.filter((m) => m?.ref === '__spur__').length
  if (spurPlatz !== 1) add('regel', 'ERR_V42_METHODEN', datei, 'methoden', 'Methoden-Anker §4.1', `${spurPlatz} Eintraege mit ref "__spur__"`, 'genau 1')
  methoden.forEach((m, i) => {
    if (m?.ref !== '__spur__') pruefeRef('methode', m?.ref, datei, `methoden[${i}].ref`)
  })

  for (const key of SPUR_KEYS) {
    const spur = sit.spuren?.[key]
    if (!spur) continue
    const basis = `spuren.${key}`
    pruefeRef('methode', spur.methoden_ref_rezeption?.ref, datei, `${basis}.methoden_ref_rezeption.ref`)

    ;(Array.isArray(spur.quellen) ? spur.quellen : []).forEach((q, i) => {
      if (pruefeRef('quelle', q?.ref, datei, `${basis}.quellen[${i}].ref`)) setzeRolle(q.ref, q.rolle)
    })
    budgetSpur(datei, key, spur)
  }

  // raster.quelle_ref und loesung.quelle_ref (wenn Quellen-ID) in Kern und Spuren.
  const lfMitPfad = [
    ...(sit.leitfragen ?? []).map((lf, i) => [`leitfragen[${i}]`, lf]),
    ...SPUR_KEYS.flatMap((key) => (sit.spuren?.[key]?.leitfragen ?? []).map((lf, i) => [`spuren.${key}.leitfragen[${i}]`, lf])),
  ]
  for (const [p, lf] of lfMitPfad) {
    if (lf?.raster?.quelle_ref !== undefined) pruefeRef('quelle', lf.raster.quelle_ref, datei, `${p}.raster.quelle_ref`)
    if (istQuellenId(lf?.loesung?.quelle_ref)) pruefeRef('quelle', lf.loesung.quelle_ref, datei, `${p}.loesung.quelle_ref`)
  }

  budgetKern(datei, sit)
  fallAusschluss(datei, sit, '', FALL_BEGRIFFE, FALL_AUSNAHME)
}

// Ersatzketten: jede Karte mit ersatz_ref -> Ersatzkarte existiert, gleicher Typ ODER gleicher Sprachmodus.
for (const [id, k] of [...quellenDerEinheit]) {
  const gesehen = new Set([id])
  let cur = k
  let curId = id
  while (cur && cur.ersatz_ref != null && cur.ersatz_ref !== '') {
    const eid = cur.ersatz_ref
    if (gesehen.has(eid)) {
      add('regel', 'ERR_V42_ERSATZ', `quellen/${curId}.json`, 'ersatz_ref', '§5 Ersatzquelle', `Kette laeuft im Kreis (${eid})`, 'Kette ohne Kreis')
      break
    }
    gesehen.add(eid)
    const e = pruefeRef('quelle', eid, `quellen/${curId}.json`, 'ersatz_ref')
    if (!e) break
    if (e.typ !== cur.typ && e.sprachmodus !== cur.sprachmodus) {
      add('regel', 'ERR_V42_ERSATZ', `quellen/${eid}.json`, 'typ / sprachmodus', `${R(2)} Ersatzquelle`,
        `typ ${zeige(e.typ)}, sprachmodus ${zeige(e.sprachmodus)}`, `typ ${zeige(cur.typ)} ODER sprachmodus ${zeige(cur.sprachmodus)} (wie ${curId})`)
    }
    // Die Ersatzkarte tritt an die Stelle der Karte — gleiche Rolle, gleiche Grenzen.
    setzeRolle(eid, rolleDerKarte.get(curId))
    cur = e
    curId = eid
  }
}

regel5(hefte)
regel6(hefte, set, kn)
regel7(hefte)
regelGlossar(set, hefte)
regelLoesungen(hefte)
regel8(set, prinzip)
regel9Kontext(set, FALL_BEGRIFFE)

if (set) {
  if (set.gemeinsamer_auftrag) budgetAuftrag(set.gemeinsamer_auftrag)
  regelAuftragProdukte(set.gemeinsamer_auftrag)
  fallAusschluss('set.json', set.gemeinsamer_auftrag ?? {}, 'gemeinsamer_auftrag', FALL_BEGRIFFE, FALL_AUSNAHME)
  fallAusschluss('set.json', set.glossar ?? [], 'glossar', FALL_BEGRIFFE, FALL_AUSNAHME)
}

// Platzhalter und Eszett: alle fuenf Dateien.
for (const [datei, obj] of [['herausforderung_A.json', hefte.A], ['herausforderung_B.json', hefte.B],
  ['set.json', set], ['prinzip.json', prinzip], ['kn.json', kn]]) {
  if (!obj) continue
  platzhalter(datei, obj)
  eszett(datei, obj)
}

for (const [id, k] of quellenDerEinheit) {
  const datei = `quellen/${id}.json`
  const rolle = rolleDerKarte.get(id)
  pflichtfelderKarte(id, k)
  budgetKarte(id, k, rolle)
  if (rolle) regel2Laenge(id, k, rolle)
  regel10Volltext(id, k)
  fallAusschluss(datei, k, '', FALL_BEGRIFFE, () => false)
  platzhalter(datei, k)
  eszett(datei, k)
}
for (const [id, k] of methodenDerEinheit) eszett(`methoden/${id}.json`, k)

// ----------------------------------------------------------------- Ausgabe

const KAT = [
  ['budget', '(a) Budget-Ueberlauf (§3.1)'],
  ['regel', '(b) Regelverstoss (§11.5, §11.4, §5, Methoden, Status, Template)'],
  ['platzhalter', '(c) Platzhalter und fehlende Karten/Dateien'],
]

console.log(`check-v42 · ${slug}`)
console.log('Pfade: Einheitsdateien relativ zu src/data/einheiten/<slug>/ · quellen/ = src/data/quellen/ · methoden/ = src/data/methoden/')
if (!existsSync(QUELLEN)) console.log('Hinweis: src/data/quellen/ existiert nicht — jede Quellen-Referenz ist eine fehlende Karte.')

for (const [kat, titel] of KAT) {
  const liste = befunde.filter((b) => b.kat === kat)
  console.log(`\n${titel} — ${liste.length}`)
  for (const b of liste) {
    console.log(`  ${b.code}  ${b.datei}${b.pfad ? ` › ${b.pfad}` : ''}  [${b.regel}]`)
    console.log(`      Ist: ${b.ist}  |  Soll: ${b.soll}`)
  }
}

if (hinweise.length) {
  console.log(`\nHinweise (nicht maschinell pruefbar, kein Befund) — ${hinweise.length}`)
  for (const h of hinweise) console.log(`  HINWEIS  ${h.datei}${h.pfad ? ` › ${h.pfad}` : ''}  — ${h.text}`)
}

const proCode = {}
for (const b of befunde) proCode[b.code] = (proCode[b.code] ?? 0) + 1
console.log('')
for (const [code, n] of Object.entries(proCode).sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`${String(n).padStart(4)}  ${code}`)
}
console.log(`\n${slug}: ${befunde.length} Befunde (${KAT.map(([k]) => befunde.filter((b) => b.kat === k).length).join(' / ')} in a / b / c).`)
process.exit(befunde.length ? 1 : 0)
