#!/usr/bin/env node
// check-ki-toolbox.mjs — prüft die KI-Toolbox einer Einheit (ki.json, lernprompt.json,
// lernbegleiter.json, ki-liesmich.md) gegen die Regeln der Skill `hko-ki-komplement`:
// Basis und Plus (references/basis-plus.md), B1-Sprach-Gate für EFZ
// (references/b1-language-rules.md) und — bei v4.2 — Fall-Ausschluss, Spur und Wörter.
//
//   node scripts/check-ki-toolbox.mjs <ordner> [<ordner> …]
//   node scripts/check-ki-toolbox.mjs            (alle Einheiten mit Toolbox)
//
// Geprüft wird nur eine Toolbox im neuen Zuschnitt: `ki.json › version` ab 2.0.0
// (E40/E41). Die Toolboxen der Bestandseinheiten (Version 1.x, volle Dichte) werden
// genannt und übersprungen — sie sind vor diesen Regeln entstanden.
//
// Was das Skript NICHT kann: beurteilen, ob ein Wort ein Fachbegriff ist (B6), ob ein
// Übungsfall wirklich neu ist, ob ein Prompt an die Einheit andockt. Das bleibt bei
// der Skill. Bei EBA prüft es Basis/Plus und Form, nicht die A2-Regeln.
//
// Exit 0 = keine Fehler · 1 = mindestens ein Fehler · 2 = Aufruf oder Datei unlesbar.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const EINHEITEN = join(ROOT, 'src', 'data', 'einheiten')

// ---------------------------------------------------------------- Messen (b1-language-rules.md §2)
const ABK = /\b(z\. B|Kap|S|bzw|usw|ca|Nr|Abs|Art)\.\s?/g
const saetze = (t) => t
  .replace(ABK, (m) => m.replace(/\./g, '·'))
  .replace(/(\d)\.(\s)/g, '$1·$2')
  .split(/(?<=[.!?])\s+|:\s+(?=[A-ZÄÖÜ«\[])/)
  .map((s) => s.trim()).filter(Boolean)
const woerter = (s) => s
  .replace(/\[[^\]]*\]/g, 'LUECKE').replace(/[«»—–]/g, ' ')
  .split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
// Auftrag = «Verb Sie» am Anfang eines Teilsatzes: am Satzanfang oder nach Komma,
// Strichpunkt, «und», «oder» — auch klein geschrieben («… und markieren Sie …»).
// Aussagen mit Umstellung («sonst üben Sie», «im KN arbeiten Sie allein») zählen nicht.
const IMPERATIV = /(?:^|[,;]\s+|\bund\s+|\boder\s+)[A-Za-zÄÖÜäöü]+en Sie\b/g
const SPRACHZEILE = /kurze[nr]?,? einfache/
const NUR_EINE_FRAGE = /nur eine Frage/
const NICHT_NEU = /nicht neu|nichts neu/

const MAX_SATZ = 22, MAX_SCHRITT = 16, MAX_PROMPT_BASIS = 45, MAX_PROMPT_PLUS = 70, MAX_LUECKE = 4
const BASIS_POOL = ['ai_lernassistent', 'ai_entscheidungscoach']
const KARTEN = ['retrieval', 'feynman', 'uebungs_feedback', 'mock_transfer', 'repetitionsplan']
const CALLOUTS = ['lernziel', 'hinweis', 'beispiel', 'warnung', 'reflexion', 'coaching', 'mehrdeutigkeit', 'differenzieren']
// b1-language-rules.md §4 — als Teilwort, ohne Gross/Klein.
const SPERRWOERTER = ['retrieval', 'feynman', 'stacking', 'mock', 'chain of thought', 'verifikation', 'verifizier', 'halluzin', 'rubrik', 'dimension', 'indikator', 'gütekriteri', 'formativ', 'summativ', 'dekontext', 'transfer-prinzip', 'konsistenz', 'trade-off', 'tragfähig', 'adressatengerecht', 'wertungsfrei', 'fluency', 'sparring', 'challeng', 'mini case', 'mini-case', 'werkschau', 'transfer-reflexion']
// Lehrt eine Einheit ein Sperrwort selbst, ist es dort Prüfstoff (b1-language-rules.md §4,
// Entscheid Pietro 07.10.2026: die Einheit über KI; 08.10.2026, E45: «Dimension» in der
// Einheit, deren Glossar die drei Dimensionen der Nachhaltigkeit führt).
const SPERRWORT_AUSNAHMEN = {
  '1.2.2_ki_kompetenznachweis_vorbereiten': ['halluzin'],
  '3.2.1_konsumfolgen_beurteilen': ['dimension'],
}
// SKILL.md «v4.2-Regeln» Nr. 3.
const V42_WOERTER = ['herausforderung', 'austausch & transfer', 'trade-off', 'pflichtquelle', 'stufe', 'niveau', 'lektion']

function lies(dir, f) {
  const p = join(dir, f)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}

function pruefe(slug) {
  const dir = join(EINHEITEN, slug)
  const fehler = [], warnungen = []
  const err = (code, wo, was) => fehler.push({ code, wo, was })
  const warn = (code, wo, was) => warnungen.push({ code, wo, was })

  const ki = lies(dir, 'ki.json'), lp = lies(dir, 'lernprompt.json'), lb = lies(dir, 'lernbegleiter.json')
  if (!ki && !lp && !lb) return { status: 'keine' }
  if (!(parseInt(String(ki?.version ?? '1'), 10) >= 2)) return { status: 'bestand', version: ki?.version ?? '—' }

  const prinzip = lies(dir, 'prinzip.json'), kn = lies(dir, 'kn.json'), set = lies(dir, 'set.json'), hfA = lies(dir, 'herausforderung_A.json')
  const liesmichPfad = join(dir, 'ki-liesmich.md')
  const md = existsSync(liesmichPfad) ? readFileSync(liesmichPfad, 'utf8') : null
  for (const [f, x] of [['ki.json', ki], ['lernprompt.json', lp], ['lernbegleiter.json', lb], ['ki-liesmich.md', md], ['prinzip.json', prinzip], ['kn.json', kn]]) {
    if (!x) err('ERR_INPUTS', f, 'fehlt')
  }
  if (fehler.length) return { status: 'geprueft', fehler, warnungen }

  const lehrgang = prinzip.lehrgang
  const istEba = lehrgang === 'EBA_2J'
  const istV42 = /^heft_8page_v4/.test(hfA?.template ?? '')
  const L = lp.lernprompt ?? {}, B = lb.lernbegleiter ?? {}
  const assignments = ki.assignments ?? []
  const [k1, k2] = assignments

  // ------------------------------------------------------------ Felder für Lernende
  const felder = [] // [datei, wo, text, art]  art: prosa | schritt | prompt_basis | prompt_plus | verbatim
  const add = (datei, wo, t, art = 'prosa') => { if (typeof t === 'string' && t) felder.push([datei, wo, t, art]) }
  assignments.forEach((a) => {
    const p = a.key, basis = a === k1
    for (const k of ['titel', 'ziel', 'bezug', 'auftrag', 'ki_frei_vorher']) add('ki.json', `${p}.${k}`, a[k])
    ;(a.prompt_strategie ?? []).forEach((s, i) => {
      add('ki.json', `${p}.prompt_strategie[${i}]`, s)
      const m = /«([^«»]+)»\.?\s*$/.exec(s)
      if (m) add('ki.json', `${p}.prompt_strategie[${i}] › Prompt`, m[1], basis ? 'prompt_basis' : 'prompt_plus')
    })
    ;(a.schritte ?? []).forEach((s, i) => add('ki.json', `${p}.schritte[${i}]`, s, 'schritt'))
    ;(a.guetekriterien ?? []).forEach((g, i) => { add('ki.json', `${p}.guetekriterien[${i}].kriterium`, g.kriterium); add('ki.json', `${p}.guetekriterien[${i}].indikator`, g.indikator) })
    ;(a.reflexion ?? []).forEach((s, i) => add('ki.json', `${p}.reflexion[${i}]`, s))
  })
  for (const [k, v] of Object.entries(ki.ki_leitfragen ?? {})) add('ki.json', `ki_leitfragen.${k}`, v)
  add('lernprompt.json', 'thema_kontext', L.thema_kontext)
  ;(L.techniken ?? []).forEach((t, i) => {
    const p = `techniken[${i}]`, art = i < 2 ? 'prompt_basis' : 'prompt_plus'
    for (const k of ['titel', 'erklaerung', 'thema_bezug', 'warnung']) add('lernprompt.json', `${p}.${k}`, t[k])
    add('lernprompt.json', `${p}.beispiel_basis`, t.beispiel_basis, art)
    add('lernprompt.json', `${p}.beispiel_fortgeschritten`, t.beispiel_fortgeschritten, 'prompt_plus')
  })
  add('lernprompt.json', 'beispiel_dialog.frage', L.beispiel_dialog?.frage, 'prompt_basis')
  add('lernprompt.json', 'beispiel_dialog.antwort', L.beispiel_dialog?.antwort)
  add('lernprompt.json', 'beispiel_dialog.pruefung', L.beispiel_dialog?.pruefung)
  for (const [k, art] of [['stacking_seite_1', 'prompt_basis'], ['stacking_seite_2', 'prompt_plus']]) {
    add('lernprompt.json', `${k}.logik_und_ziel`, L[k]?.logik_und_ziel)
    add('lernprompt.json', `${k}.prompt_1`, L[k]?.prompt_1, art)
    add('lernprompt.json', `${k}.prompt_2`, L[k]?.prompt_2, art)
  }
  add('lernbegleiter.json', 'titel', B.titel); add('lernbegleiter.json', 'ziel', B.ziel)
  add('lernbegleiter.json', 'kompetenzversprechen', B.kompetenzversprechen, 'verbatim')
  add('lernbegleiter.json', 'ki_frei_zuerst.auftrag', B.ki_frei_zuerst?.auftrag)
  ;(B.ki_frei_zuerst?.selbsteinschaetzung ?? []).forEach((s, i) => add('lernbegleiter.json', `selbsteinschaetzung[${i}]`, s))
  ;(B.strategie_karten ?? []).forEach((s, i) => {
    const p = `strategie_karten[${i}]`
    for (const k of ['technik', 'wann', 'warnung']) add('lernbegleiter.json', `${p}.${k}`, s[k])
    add('lernbegleiter.json', `${p}.prompt_basis`, s.prompt_basis, i < 2 ? 'prompt_basis' : 'prompt_plus')
    add('lernbegleiter.json', `${p}.prompt_fortgeschritten`, s.prompt_fortgeschritten, 'prompt_plus')
  })
  ;(B.kn_typ_tracks ?? []).forEach((t) => { add('lernbegleiter.json', `kn_typ_tracks.${t.typ}.uebungsfokus`, t.uebungsfokus); add('lernbegleiter.json', `kn_typ_tracks.${t.typ}.prompt`, t.prompt, 'prompt_basis') })
  ;(B.rubrik_fokus ?? []).forEach((r) => add('lernbegleiter.json', `rubrik_fokus.${r.dimension}.so_uebst_du`, r.so_uebst_du))
  add('lernbegleiter.json', 'integritaet_warnung', B.integritaet_warnung)
  ;(B.selbstcheck ?? []).forEach((s, i) => add('lernbegleiter.json', `selbstcheck[${i}]`, s))

  // ------------------------------------------------------------ B1 (nur EFZ) und Prompts
  let n = 0, summe = 0, laengster = 0
  for (const [datei, wo, t, art] of felder) {
    const ort = `${datei} › ${wo}`
    if (t.includes('ß')) err('ERR_SPRACHE', ort, 'Eszett')
    if (art === 'verbatim') continue
    const ss = saetze(t)
    if (!istEba) {
      for (const s of ss) {
        const w = woerter(s); n++; summe += w; if (w > laengster) laengster = w
        if (w > MAX_SATZ) err('ERR_B1_SATZ_ZU_LANG', ort, `${w} Wörter: «${s.slice(0, 80)}»`)
        if ((s.match(IMPERATIV) ?? []).length > 1) err('ERR_B1_MEHRFACHAUFTRAG', ort, `«${s.slice(0, 80)}»`)
      }
      if (art === 'schritt' && (ss.length > 1 || woerter(t) > MAX_SCHRITT)) err('ERR_B1_SCHRITT_ZU_LANG', ort, `${ss.length} Satz/Sätze, ${woerter(t)} Wörter`)
      const klein = t.toLowerCase()
      const frei = SPERRWORT_AUSNAHMEN[slug] ?? []
      for (const w of SPERRWOERTER) if (!frei.includes(w) && klein.includes(w)) err('ERR_B1_SPERRWORT', ort, `«${w}»`)
    }
    if (art === 'prompt_basis' || art === 'prompt_plus') {
      const w = woerter(t), grenze = art === 'prompt_basis' ? MAX_PROMPT_BASIS : MAX_PROMPT_PLUS
      if (w > grenze) err('ERR_BP_LAENGE', ort, `Prompt ${w} Wörter, Grenze ${grenze}`)
      if (!SPRACHZEILE.test(t)) err('ERR_BP_SPRACHZEILE', ort, 'keine Sprachzeile («kurze, einfache Sätze»)')
      if (/\b(Frag mich|Stell mir)\b/.test(t) && /Fragen\b/.test(t) && !NUR_EINE_FRAGE.test(t) && !/\b(drei|zwei|je eine) /.test(t)) warn('WARN_BP_SPRACHZEILE', ort, 'KI stellt Fragen, aber «immer nur eine Frage» fehlt')
      if (/\[mein(e|en)? (Text|Erklärung)\]/.test(t) && !NICHT_NEU.test(t)) err('ERR_BP_SPRACHZEILE', ort, 'Rückmeldung auf eigenen Text ohne «schreib … nicht neu»')
      const luecken = t.match(/\[[^\]]*\]/g) ?? []
      if (art === 'prompt_basis' && luecken.length > 1) err('ERR_BP_ANDOCKEN', ort, `${luecken.length} Lücken, höchstens eine`)
      for (const l of luecken) if (l.slice(1, -1).trim().split(/\s+/).length > MAX_LUECKE) err('ERR_BP_LAENGE', ort, `Lücke ${l} hat mehr als ${MAX_LUECKE} Wörter`)
      if (/\b(Sie|Ihr|Ihre[nmrs]?)\b/.test(t)) warn('WARN_SPRACHE', ort, 'Prompt an die KI in Sie-Form')
    }
  }

  // ------------------------------------------------------------ BP1–BP3, Form
  const zahl = (wo, ist, ok, soll) => { if (!ok(ist)) err('ERR_BP_ANZAHL', wo, `${ist}, Soll ${soll}`) }
  if (assignments.length !== 2) err('ERR_SHAPE', 'ki.json › assignments', `${assignments.length}, Soll 2`)
  if (k1 && k2) {
    if (!BASIS_POOL.includes(k1.pattern)) err('ERR_BP_REIHENFOLGE', 'ki.json › ki_1.pattern', `«${k1.pattern}» — Basis-Auftrag kommt aus ${BASIS_POOL.join(' / ')}`)
    if (BASIS_POOL.includes(k2.pattern)) warn('WARN_BP_REIHENFOLGE', 'ki.json › ki_2.pattern', `«${k2.pattern}» ist ein Basis-Muster`)
    zahl('ki.json › ki_1.prompt_strategie', k1.prompt_strategie?.length ?? 0, (x) => x === 3, 3)
    zahl('ki.json › ki_1.schritte', k1.schritte?.length ?? 0, (x) => x === 3, 3)
    zahl('ki.json › ki_1.guetekriterien', k1.guetekriterien?.length ?? 0, (x) => x === 3, 3)
    zahl('ki.json › ki_1.reflexion', k1.reflexion?.length ?? 0, (x) => x === 2, 2)
    zahl('ki.json › ki_2.prompt_strategie', k2.prompt_strategie?.length ?? 0, (x) => x >= 3 && x <= 4, '3–4')
    zahl('ki.json › ki_2.schritte', k2.schritte?.length ?? 0, (x) => x >= 4 && x <= 5, '4–5')
    zahl('ki.json › ki_2.guetekriterien', k2.guetekriterien?.length ?? 0, (x) => x >= 3 && x <= 4, '3–4')
    zahl('ki.json › ki_2.reflexion', k2.reflexion?.length ?? 0, (x) => x === 3, 3)
    if (!/^Plus: /.test(k2.titel ?? '')) err('ERR_BP_REIHENFOLGE', 'ki.json › ki_2.titel', 'beginnt nicht mit «Plus: »')
    for (const a of [k1, k2]) {
      for (const k of ['ziel', 'bezug', 'auftrag', 'ki_frei_vorher']) if (!a[k]) err('ERR_SHAPE', `ki.json › ${a.key}.${k}`, 'fehlt')
      if (!(a.guetekriterien ?? []).some((g) => /nachgeschlagen|nachgeprüft|geprüft|nachgerechnet/i.test(`${g.kriterium} ${g.indikator}`))) err('ERR_GUETE', `ki.json › ${a.key}.guetekriterien`, 'kein Kriterium prüft das Nachschlagen (P5)')
    }
    // Die Brücke nennt den Kompetenznachweis in Worten für Lernende — nie mit dem
    // Namen einer KN-Form («Mini Case …», «Werkschau …» sind Sperrwörter).
    if (![k1, k2].some((a) => /Kompetenznachweis|Fachgespräch|Kurzgespräch/.test((a.reflexion ?? []).at(-1) ?? ''))) err('ERR_KN_BRIDGE', 'ki.json › reflexion', 'keine letzte Reflexionsfrage schlägt die Brücke zum Kompetenznachweis')
  }
  zahl('ki.json › ki_leitfragen', Object.keys(ki.ki_leitfragen ?? {}).length, (x) => x === 2, '2 (offen, kritisch)')
  zahl('ki.json › nrlp_anker.schluesselkompetenzen_texte', ki.nrlp_anker?.schluesselkompetenzen_texte?.length ?? 0, (x) => x <= 3, 'höchstens 3')
  if (JSON.stringify(ki.anchored_situations) !== JSON.stringify(kn.anchored_situations)) err('ERR_SHAPE', 'ki.json › anchored_situations', 'nicht gleich kn.anchored_situations')
  for (const [f, x] of [['ki.json', ki], ['lernprompt.json', lp], ['lernbegleiter.json', lb]]) if (x.lehrgang !== lehrgang) err('ERR_SHAPE', `${f} › lehrgang`, `«${x.lehrgang}», prinzip sagt «${lehrgang}»`)

  const tk = (L.techniken ?? [])
  zahl('lernprompt.json › techniken', tk.length, (x) => x === 4, 4)
  if (tk.slice(0, 2).map((t) => t.key).join() !== 'rollen_prompting,kontextualisieren') err('ERR_BP_REIHENFOLGE', 'lernprompt.json › techniken', 'Technik 1 + 2 sind nicht rollen_prompting, kontextualisieren')
  tk.slice(0, 2).forEach((t, i) => { if (t.beispiel_fortgeschritten || t.baukasten) err('ERR_BP_PLUS_IN_BASIS', `lernprompt.json › techniken[${i}]`, 'Basis-Technik mit beispiel_fortgeschritten oder baukasten') })
  tk.slice(2).forEach((t, i) => { if (!t.beispiel_fortgeschritten || !t.baukasten) err('ERR_LP_SHAPE', `lernprompt.json › techniken[${i + 2}]`, 'Plus-Technik ohne beispiel_fortgeschritten oder baukasten') })
  for (const k of ['stacking_seite_1', 'stacking_seite_2']) {
    if (!L[k]?.prompt_1 || !L[k]?.prompt_2) err('ERR_LP_SHAPE', `lernprompt.json › ${k}`, 'prompt_1 oder prompt_2 fehlt')
    for (const key of L[k]?.technik_keys ?? []) if (/^[a-z_]+$/.test(key)) err('ERR_BP_REIHENFOLGE', `lernprompt.json › ${k}.technik_keys`, `«${key}» ist ein Schlüssel — hier steht der Titel der Technik`)
  }

  // BP7 — Beispiel-Verlauf und Begriffe (E42)
  const dlg = L.beispiel_dialog
  if (!dlg?.frage || !dlg?.antwort || !dlg?.pruefung) err('ERR_BP_ZUSATZ', 'lernprompt.json › beispiel_dialog', 'frage, antwort oder pruefung fehlt')
  else {
    if (/\[[^\]]*\]/.test(dlg.frage)) err('ERR_BP_ZUSATZ', 'lernprompt.json › beispiel_dialog.frage', 'Beispiel-Prompt mit Lücke — hier sind die Angaben ausgefüllt')
    if (woerter(dlg.antwort) > 30) err('ERR_BP_LAENGE', 'lernprompt.json › beispiel_dialog.antwort', `${woerter(dlg.antwort)} Wörter, Grenze 30`)
    if (woerter(dlg.pruefung) > 30) err('ERR_BP_LAENGE', 'lernprompt.json › beispiel_dialog.pruefung', `${woerter(dlg.pruefung)} Wörter, Grenze 30`)
    if (!/\bIch\b|\bich\b/.test(dlg.pruefung)) err('ERR_BP_ZUSATZ', 'lernprompt.json › beispiel_dialog.pruefung', 'nicht in Ich-Form')
  }
  const begriffe = B.begriffe ?? []
  if (begriffe.length < 6 || begriffe.length > 20) err('ERR_BP_ZUSATZ', 'lernbegleiter.json › begriffe', `${begriffe.length} Einträge, Soll 6–20`)
  if (istV42) {
    const erlaubt = (set?.glossar ?? []).filter((g) => !g.spur).map((g) => g.begriff)
    for (const b of begriffe) if (!erlaubt.includes(b)) err('ERR_BP_ZUSATZ', 'lernbegleiter.json › begriffe', `«${b}» ist kein Glossarbegriff ohne Spur (Schreibweise wie in set.glossar)`)
    for (const b of erlaubt.slice(0, 20)) if (!begriffe.includes(b)) err('ERR_BP_ZUSATZ', 'lernbegleiter.json › begriffe', `Glossarbegriff «${b}» fehlt`)
  }

  const karten = B.strategie_karten ?? []
  if (karten.map((s) => s.key).join() !== KARTEN.join()) err('ERR_BP_REIHENFOLGE', 'lernbegleiter.json › strategie_karten', `Reihenfolge ${karten.map((s) => s.key).join(', ')} — Soll ${KARTEN.join(', ')}`)
  karten.forEach((s, i) => {
    if (!s.prompt_basis || !s.warnung) err('ERR_LB_SHAPE', `lernbegleiter.json › strategie_karten[${i}]`, 'prompt_basis oder warnung fehlt (L3)')
    if (i < 2 && s.prompt_fortgeschritten) err('ERR_BP_PLUS_IN_BASIS', `lernbegleiter.json › strategie_karten[${i}]`, 'Basis-Karte mit prompt_fortgeschritten')
    if (i >= 2 && !s.prompt_fortgeschritten) err('ERR_LB_SHAPE', `lernbegleiter.json › strategie_karten[${i}]`, 'Plus-Karte ohne prompt_fortgeschritten')
    if (/[()]/.test(s.technik ?? '')) err('ERR_BP_LAENGE', `lernbegleiter.json › strategie_karten[${i}].technik`, 'Name mit Klammer')
  })
  const mock = karten.find((s) => s.key === 'mock_transfer')
  if (mock && !/neu/i.test(mock.prompt_basis ?? '')) err('ERR_LB_INTEGRITAET', 'lernbegleiter.json › mock_transfer.prompt_basis', 'verlangt keinen neuen Fall (L2)')
  if (mock && !/Kompetenznachweis|KN/.test(mock.warnung ?? '')) err('ERR_LB_INTEGRITAET', 'lernbegleiter.json › mock_transfer.warnung', 'verbietet die KN-Lösung nicht (L2)')
  if (B.kompetenzversprechen !== prinzip.kern_kompetenzversprechen) err('ERR_LB_SHAPE', 'lernbegleiter.json › kompetenzversprechen', 'nicht wörtlich wie prinzip.kern_kompetenzversprechen (L1)')
  const soll = (kn.kn_typen ?? []).map((t) => `${t.typ}|${t.label}`).join(' · '), ist = (B.kn_typ_tracks ?? []).map((t) => `${t.typ}|${t.label}`).join(' · ')
  if (soll !== ist) err('ERR_LB_SHAPE', 'lernbegleiter.json › kn_typ_tracks', `«${ist}» — Soll «${soll}» (L1)`)
  const namen = (kn.rubrik_shared?.kriterien ?? []).map((k) => k.name)
  for (const r of B.rubrik_fokus ?? []) for (const k of r.kriterien ?? []) if (!namen.includes(k)) err('ERR_LB_SHAPE', `lernbegleiter.json › rubrik_fokus.${r.dimension}`, `«${k}» ist kein Kriterium aus kn.rubrik_shared`)
  zahl('lernbegleiter.json › selbsteinschaetzung', B.ki_frei_zuerst?.selbsteinschaetzung?.length ?? 0, (x) => x >= 2 && x <= 3, '2–3')
  zahl('lernbegleiter.json › selbstcheck', B.selbstcheck?.length ?? 0, (x) => x >= 3 && x <= 4, '3–4')

  // ------------------------------------------------------------ v4.2: Fall, Spur, Wörter
  const roh = { 'ki.json': JSON.stringify(ki), 'lernprompt.json': JSON.stringify(lp), 'lernbegleiter.json': JSON.stringify(lb), 'ki-liesmich.md': md }
  if (istV42) {
    const fall = prinzip.hybrid_situation_spec?.fall_ausschluss_hefte_und_auftrag ?? []
    if (!fall.length) err('ERR_INPUTS', 'prinzip.json › fall_ausschluss_hefte_und_auftrag', 'leer — V42_FALL nicht prüfbar')
    for (const [f, t] of Object.entries(roh)) for (const b of fall) if (t.toLowerCase().includes(b.toLowerCase())) err('ERR_V42_FALL', f, `Begriff des KN-Falls: «${b}»`)
    // Ein Begriff, den das Glossar auch ohne `spur` führt (Heft A: «graue Energie»), gehört zum Kern (E45).
    const ohneSpur = new Set((set?.glossar ?? []).filter((g) => !g.spur).map((g) => g.begriff))
    const nurSpur = (set?.glossar ?? []).filter((g) => g.spur && !ohneSpur.has(g.begriff)).map((g) => g.begriff)
    for (const [datei, wo, t] of felder) {
      const klein = t.toLowerCase()
      for (const w of V42_WOERTER) if (klein.includes(w)) err('ERR_V42_WORT', `${datei} › ${wo}`, `«${w}»`)
      if (/\bspur(en)?\b/i.test(t)) err('ERR_V42_WORT', `${datei} › ${wo}`, '«Spur» in einem Text für Lernende')
      for (const b of nurSpur) if (new RegExp(`(^|[^\\p{L}])${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'iu').test(t)) err('ERR_V42_SPUR', `${datei} › ${wo}`, `«${b}» steht nur im Glossar einer Spur`)
    }
    if (!/gemeinsame[nr]? Auftrag/.test(ki.timing ?? '')) err('ERR_V42_WORT', 'ki.json › timing', `«${ki.timing}» — bei v4.2 «nach dem gemeinsamen Auftrag, …»`)
  }

  // ------------------------------------------------------------ Liesmich (LM1–LM3)
  for (const m of md.matchAll(/\[!(\w+)\]/g)) if (!CALLOUTS.includes(m[1])) err('ERR_LIESMICH', 'ki-liesmich.md', `Callout [!${m[1]}] wird nicht gezeichnet (LM3)`)
  if (!/^titel:/m.test(md) || !/^untertitel:/m.test(md)) err('ERR_LIESMICH', 'ki-liesmich.md', 'Frontmatter ohne titel oder untertitel (LM3)')
  for (const a of assignments) if (a.titel && !md.includes(a.titel)) err('ERR_LIESMICH', 'ki-liesmich.md', `Auftrags-Titel «${a.titel}» fehlt (LM1)`)
  for (const t of tk) if (t.titel && !md.includes(t.titel)) err('ERR_LIESMICH', 'ki-liesmich.md', `Technik «${t.titel}» fehlt (LM1)`)
  for (const s of karten) if (s.technik && !md.includes(s.technik)) err('ERR_LIESMICH', 'ki-liesmich.md', `Karte «${s.technik}» fehlt (LM2)`)
  if (/\{\{|\}\}/.test(md)) err('ERR_LIESMICH', 'ki-liesmich.md', 'geschweifte Klammern eines Platzhalters')
  if (md.includes('ß')) err('ERR_SPRACHE', 'ki-liesmich.md', 'Eszett')

  return { status: 'geprueft', fehler, warnungen, format: istV42 ? 'v4.2' : istEba ? 'EBA' : '3er-Set', lehrgang, mass: n ? { saetze: n, mittel: summe / n, laengster } : null }
}

// ---------------------------------------------------------------- Lauf
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const alle = readdirSync(EINHEITEN, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
for (const a of args) if (!alle.includes(a)) { console.error(`Einheit «${a}» nicht gefunden unter src/data/einheiten/`); process.exit(2) }
const slugs = args.length ? args : alle

let fehlerGesamt = 0, geprueft = 0
const bestand = []
console.log(`check-ki-toolbox — ${args.length ? `${slugs.length} Einheit(en)` : 'alle Einheiten mit Toolbox'}\n`)
for (const slug of slugs) {
  let r
  try { r = pruefe(slug) } catch (e) { console.error(`${slug}\n  FEHLER  unlesbar: ${e.message}\n`); process.exit(2) }
  if (r.status === 'keine') { if (args.length) console.log(`${slug}\n  —       keine Toolbox\n`); continue }
  if (r.status === 'bestand') { bestand.push(`${slug} (Version ${r.version})`); continue }
  geprueft++
  console.log(`${slug}  ·  ${r.format ?? ''} ${r.lehrgang ?? ''}`)
  for (const f of r.fehler) console.log(`  FEHLER   ${f.code}  ${f.wo}  ${f.was}`)
  for (const w of r.warnungen) console.log(`  warnung  ${w.code}  ${w.wo}  ${w.was}`)
  if (r.mass) console.log(`  Sprache  ${r.mass.saetze} Sätze · Mittel ${r.mass.mittel.toFixed(1)} Wörter · längster ${r.mass.laengster} (Grenze ${MAX_SATZ})`)
  console.log(`  ${r.fehler.length ? 'ROT' : 'ok'}      ${r.fehler.length} Fehler, ${r.warnungen.length} Warnung(en)\n`)
  fehlerGesamt += r.fehler.length
}
if (bestand.length) console.log(`Übersprungen — Bestand in voller Dichte (ki.json › version < 2):\n  ${bestand.join('\n  ')}\n`)
console.log(fehlerGesamt ? `ROT — ${fehlerGesamt} Fehler in ${geprueft} geprüften Toolbox(en).` : `GRUEN — ${geprueft} Toolbox(en) geprüft, keine Fehler.`)
process.exit(fehlerGesamt ? 1 : 0)
