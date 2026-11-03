#!/usr/bin/env node
/** EBA-v4.2-Profil: Datenregeln ergänzend zu check-v42; ohne Schreibzugriff. */
import { aufruf, ladeEinheit, Bericht, schluss, textfelder } from './lib/pruefung.mjs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

/** Nur Datenfelder, die DOC-KN-S bei EBA druckt; LP-/Technikfelder bleiben draussen. */
export function knLernendentexte(kn) {
  const out = []
  const nimm = (pfad, text) => { if (typeof text === 'string') out.push({ pfad, text }) }
  for (const key of ['titel', 'text', 'leitfrage', 'definition_kurz']) nimm(`hybrid_situation.${key}`, kn.hybrid_situation?.[key])
  for (const [i, t] of (kn.kn_typen ?? []).entries()) {
    const p = `kn_typen[${i}]`
    for (const key of ['label', 'format']) nimm(`${p}.${key}`, t[key])
    for (const [j, text] of (t.ablauf ?? []).entries()) nimm(`${p}.ablauf[${j}]`, text)
    for (const [j, f] of (t.fragestruktur ?? []).entries()) nimm(`${p}.fragestruktur[${j}].frage`, f.frage)
    for (const [j, a] of (t.aufgaben ?? []).entries()) {
      nimm(`${p}.aufgaben[${j}].aufgabe`, a.aufgabe)
      for (const [k, text] of (Array.isArray(a.tabelle?.spalten) ? a.tabelle.spalten : []).entries()) nimm(`${p}.aufgaben[${j}].tabelle.spalten[${k}]`, text)
    }
    for (const [j, text] of (t.reflexionsfragen ?? []).entries()) nimm(`${p}.reflexionsfragen[${j}]`, text)
  }
  for (const [i, k] of (kn.rubrik_shared?.kriterien ?? []).entries()) {
    const p = `rubrik_shared.kriterien[${i}]`
    nimm(`${p}.name_lernende`, k.name_lernende || k.name)
    const stufen = Array.isArray(k.stufen_lernende) && k.stufen_lernende.length === k.stufen?.length ? k.stufen_lernende : k.stufen
    for (const [j, text] of (stufen ?? []).entries()) nimm(`${p}.stufen_lernende[${j}]`, text)
  }
  for (const [i, n] of (kn.rubrik_shared?.niveaubaender ?? []).entries()) {
    nimm(`rubrik_shared.niveaubaender[${i}].label`, n.label)
    nimm(`rubrik_shared.niveaubaender[${i}].definition_lernende`, n.definition_lernende || n.definition)
  }
  return out
}

export function pruefeEba(E, B) {
  if (!E.v42 || !E.hefte.some((h) => h.json.lehrgang === 'EBA_2J')) return
  const err = (code, feld, was) => B.fehler(code, feld, was)
  const nichtleer = (s) => typeof s === 'string' && !!s.trim()
  const kriterien = (liste, pfad) => {
    if (!Array.isArray(liste) || !liste.length) {
      err('ERR_EBA_KRITERIEN', pfad, 'Kriterien mit Lernendenfassung erforderlich')
      return
    }
    for (const [i, k] of liste.entries()) {
      if (!nichtleer(k?.name_lernende) || !Array.isArray(k?.stufen_lernende) ||
          k.stufen_lernende.length !== 4 || k.stufen_lernende.length !== k.stufen?.length ||
          !Array.from(k.stufen_lernende).every(nichtleer)) {
        err('ERR_EBA_KRITERIEN', `${pfad}[${i}]`, 'Lernendenname und vier nichtleere Stufen, gleiche Anzahl wie stufen, erforderlich')
      } else if (k.stufen_lernende.some((s) => !/\b(?:ich|mein[emnrsa]*)\b/i.test(s))) {
        err('ERR_EBA_KRITERIEN', `${pfad}[${i}].stufen_lernende`, 'Ich-Fassung fehlt')
      }
    }
  }
  const d = E.json['dossier.json']
  if (!d) err('ERR_EBA_DOSSIER', 'dossier.json', 'EBA braucht ein lesbares Dossier')
  const nuggets = d?.nuggets ?? []
  const ids = new Set(nuggets.map((n) => n.id))
  const glossar = new Set((d?.glossar ?? []).map((g) => g.id))
  if (ids.size !== nuggets.length) err('ERR_EBA_DOSSIER', 'dossier.json › nuggets', 'Info-Karten-IDs sind nicht eindeutig')
  if (d && (d.lehrgang !== 'EBA_2J' || d.sprachniveau !== 'A2' || d.template !== 'dossier_eba_v1')) err('ERR_EBA_DOSSIER', 'dossier.json', 'EBA_2J, A2 und dossier_eba_v1 erforderlich')
  for (const n of nuggets) {
    if (!/^nugget_[AB]_\d{2}$/.test(n.id ?? '') || !(typeof n.inhalt === 'string' && n.inhalt.trim())) err('ERR_EBA_DOSSIER', `dossier.json › ${n.id}`, 'Info-Karte braucht ID und Inhalt')
    for (const id of n.glossar_refs ?? []) if (!glossar.has(id)) err('ERR_EBA_GLOSSAR', `dossier.json › ${n.id}.glossar_refs`, `unbekannte Glossar-ID ${id}`)
    if (n.recherche?.ki_beispiel || n.recherche?.ki_lernen) err('ERR_EBA_DOSSIER', `dossier.json › ${n.id}.recherche`, 'KI-Prompts gehören zur KI-Toolbox')
  }
  if (d?.transfer_wissensblatt?.austausch_scaffolds) err('ERR_EBA_DOSSIER', 'dossier.json › transfer_wissensblatt', 'Austausch-Scaffolds gehören zum gemeinsamen Auftrag')
  for (const { datei, json: h } of E.hefte) {
    if (h.lehrgang !== 'EBA_2J') err('ERR_EBA_PROFIL', datei, 'beide Hefte müssen EBA_2J führen')
    // Spur ohne_medien immer; mit_medien nur zusätzlich (Entscheid Pietro 03.11.2026: wenn die
    // Kompetenz audiovisuelle Rezeption verlangt). Dann braucht sie eine Pflichtquelle.
    const spurKeys = Object.keys(h.spuren ?? {}).sort().join()
    if (spurKeys !== 'ohne_medien' && spurKeys !== 'mit_medien,ohne_medien') err('ERR_EBA_PROFIL', `${datei} › spuren`, 'Spur ohne_medien erforderlich, mit_medien nur zusätzlich')
    const medien = h.spuren?.mit_medien
    if (medien) {
      const pflicht = (medien.quellen ?? []).filter((q) => q?.rolle === 'pflicht')
      if (pflicht.length !== 1) err('ERR_EBA_MEDIEN', `${datei} › spuren.mit_medien.quellen`, 'genau eine Pflichtquelle (Video) erforderlich')
      if (medien.kasten_s4?.titel !== 'Denkhilfe – zuerst hier Stichworte, dann schreiben') err('ERR_EBA_LABEL', `${datei} › spuren.mit_medien.kasten_s4.titel`, 'funktionaler Denkhilfe-Titel fehlt')
      if ((medien.leitfragen ?? []).map((lf) => lf.nr).join() !== '2,3') err('ERR_EBA_MEDIEN', `${datei} › spuren.mit_medien.leitfragen`, 'Leitfrage 2 (Raster) und 3 erforderlich, wie ohne Medien')
    }
    const lfs = [
      ...(h.leitfragen ?? []).map((lf) => ({ lf, medien: false })),
      ...(h.spuren?.ohne_medien?.leitfragen ?? []).map((lf) => ({ lf, medien: false })),
      ...(medien?.leitfragen ?? []).map((lf) => ({ lf, medien: true })),
    ]
    for (const { lf, medien: mitMedien } of lfs) {
      const p = `${datei} › ${mitMedien ? 'mit_medien › ' : ''}Leitfrage ${lf.nr}`
      const codes = [...String(lf.knoten_ref ?? '').matchAll(/Info-Karte ([AB])-([0-9]{2})/g)]
      // Medien-Spur: die Quelle (Video) darf die Fundstelle sein; Info-Karten bleiben erlaubt.
      const quelleAlsAnker = mitMedien && /^\s*Quelle\b/.test(String(lf.knoten_ref ?? ''))
      if (!codes.length && !quelleAlsAnker) err('ERR_EBA_ANKER', p, mitMedien ? 'Quelle oder Dossier | Info-Karte als Fundstelle erforderlich' : 'Dossier | Info-Karte als Fundstelle erforderlich')
      for (const [, tag, nr] of codes) {
        const id = `nugget_${tag}_${nr}`
        if (!ids.has(id)) err('ERR_EBA_ANKER', p, `Info-Karte ${tag}-${nr} fehlt im Dossier`)
        else if (!nuggets.find((n) => n.id === id)?.fuer_leitfrage?.includes(lf.nr)) err('ERR_EBA_ANKER', p, 'Info-Karte deckt diese Leitfrage laut fuer_leitfrage nicht ab')
      }
      for (const k of ['strategien', 'satzanfaenge']) if (lf.scaffolding?.[k]?.length !== 3) err('ERR_EBA_HILFEN', `${p}.scaffolding.${k}`, 'drei Einträge erforderlich')
    }
    if (h.spuren?.ohne_medien?.kasten_s4?.titel !== 'Denkhilfe – zuerst hier Stichworte, dann schreiben') err('ERR_EBA_LABEL', `${datei} › kasten_s4.titel`, 'funktionaler Denkhilfe-Titel fehlt')
    kriterien(h.feedback_kriterien, `${datei} › feedback_kriterien`)
    const raster = h.bewertungsraster ?? []
    if (raster[1]?.produkt !== 'Raster') err('ERR_EBA_ABSCHLUSS', `${datei} › bewertungsraster`, 'zweite Zeile heisst Raster')
    const schluss = raster[3]?.vollstaendig_wenn ?? []
    if (!schluss.includes('Quer-Check: jede Frage abgehakt und beantwortet') || !schluss.includes('«Das nehme ich mit» ausgefüllt')) err('ERR_EBA_ABSCHLUSS', `${datei} › bewertungsraster[3]`, 'Quer-Check mit Antworten und Mitnahme erforderlich')
    if (/Begriffsnetz|Mindmap/i.test(JSON.stringify(raster))) err('ERR_EBA_ABSCHLUSS', `${datei} › bewertungsraster`, 'kein Netz als Lernendenabgabe')
  }
  const set = E.json['set.json'] ?? {}
  const mitMedien = E.hefte.some((h) => h.json.spuren?.mit_medien)
  if (set.spur !== (mitMedien ? 'wahl' : 'ohne_medien')) err('ERR_EBA_PROFIL', 'set.json › spur', mitMedien ? 'mit Medien-Spur: set.spur «wahl» (LP wählt)' : 'ohne_medien erforderlich')
  if (JSON.stringify(set.gemeinsamer_auftrag?.sozialform?.zulaessig) !== '["partner"]') err('ERR_EBA_SOZIALFORM', 'set.json › gemeinsamer_auftrag.sozialform', 'ausschliesslich partner erforderlich')
  if (set.austausch_phase) err('ERR_EBA_SOZIALFORM', 'set.json › austausch_phase', 'gemeinsamer Auftrag ersetzt den alten Austausch')
  if (!/Freiwillig für dich/i.test(E.begleiter ?? '')) err('ERR_EBA_BEGLEITER', 'begleiter.md › gemeinsamer Auftrag', 'Hinweis auf freiwilligen Auftrag für die LP fehlt')
  const auftrag = set.gemeinsamer_auftrag ?? {}
  const kn = E.json['kn.json'] ?? {}
  kriterien(auftrag.feedback_kriterien, 'set.json › gemeinsamer_auftrag.feedback_kriterien')
  kriterien(kn.rubrik_shared?.kriterien, 'kn.json › rubrik_shared.kriterien')
  const baender = kn.rubrik_shared?.niveaubaender
  if (!Array.isArray(baender) || !baender.length) err('ERR_EBA_NIVEAU', 'kn.json › rubrik_shared.niveaubaender', 'Niveaubänder mit Lernendenfassung erforderlich')
  for (const [i, n] of (Array.isArray(baender) ? baender : []).entries()) {
    if (!nichtleer(n?.definition_lernende)) err('ERR_EBA_NIVEAU', `kn.json › rubrik_shared.niveaubaender[${i}].definition_lernende`, 'nichtleere A2-Definition erforderlich')
  }
  if (!Array.isArray(auftrag.woerter) || !auftrag.woerter.length ||
      !Array.from(auftrag.woerter).every((w) => nichtleer(w?.begriff) && nichtleer(w?.definition))) {
    err('ERR_EBA_WOERTER', 'set.json › gemeinsamer_auftrag.woerter', 'nichtleere Liste mit Begriff und Definition erforderlich')
  }
  for (const [i, bezug] of (auftrag.heft_bezug ?? []).entries()) {
    for (const text of bezug.inhalte ?? []) {
      if (/\bGlossar\b/i.test(text) || (/Wichtige Wörter/i.test(text) && !/Wichtige Wörter\s*\(S\.\s*2\)/i.test(text))) {
        err('ERR_EBA_HEFT_BEZUG', `set.json › gemeinsamer_auftrag.heft_bezug[${i}]`, 'Wichtige Wörter (S. 2) verwenden; kein Glossar auf S. 8')
      }
    }
  }
  for (const [i, typ] of (kn.kn_typen ?? []).entries()) {
    for (const [j, a] of (typ.aufgaben ?? []).entries()) {
      const t = a.tabelle
      // Tabellenauftrag braucht die gedruckte Ausfüllfläche, auch bei zusammengesetzten Namen.
      const brauchtTabelle = /(?:füll|trag|ergänz|vervollständig)[\s\S]*(?:Tabelle|Raster)|(?:Tabelle|Raster)[\s\S]*(?:ausfüll|eintrag|ergänz|vervollständig)/i.test(a.aufgabe ?? '')
      if ((t !== undefined || brauchtTabelle) && (!t || !Array.isArray(t.spalten) || !t.spalten.length ||
          !Array.from(t.spalten).every(nichtleer) || !Number.isInteger(t.zeilen) || t.zeilen < 1)) {
        err('ERR_EBA_TABELLE', `kn.json › kn_typen[${i}].aufgaben[${j}].tabelle`, 'Tabelle braucht nichtleere Spalten und eine positive ganze Zeilenzahl')
      }
    }
  }
  for (const f of knLernendentexte(kn)) {
    if (/Hybrid|K[-– ]?Decke|\bK\s?[1-6]\b|\bLF\s?[1-4]\b|Bloom|Taxonomie|Komplexität|Werthaltung|Rezeption|Produktion|Interaktion|Kollaboration/i.test(f.text)) {
      err('ERR_EBA_KN_SPRACHE', `kn.json › ${f.pfad}`, 'KN-Lernendentext enthält ein EBA-Sperrwort; einfach formulieren')
    }
  }
  const lese = d?.leseblatt
  if (lese) {
    if (lese.richtig_falsch?.length !== 5 || lese.w_fragen?.length !== 3 || lese.vokabeln?.length !== 6) err('ERR_EBA_LESEBLATT', 'dossier.json › leseblatt', '5 Richtig/Falsch, 3 W-Fragen, 6 Wörter erforderlich')
    for (const id of lese.vokabeln ?? []) if (!glossar.has(id)) err('ERR_EBA_LESEBLATT', 'dossier.json › leseblatt.vokabeln', `Wort ${id} fehlt im Glossar`)
  }
  // Nur Lernendenprosa; Metadaten und LP-Lösungen dürfen technische LF-IDs behalten.
  for (const f of textfelder(E, { karten: false, begleiter: false, kn: false })) {
    if (f.loesung || /mindmap|dekontextualisierung|\.wo$/.test(f.pfad)) continue
    if (/\bLF\s?[1-4]\b/.test(f.text)) err('ERR_EBA_LF_KUERZEL', f.feld, 'Leitfrage ausschreiben')
  }
  pruefeEbaQualitaet(E, B)
}

// ================================================================ QUALITÄT (Gegenlesung 03.11.2026)
// Befunde der Argon-Gegenlesungen von 2.1.1 und 1.2.1, die kein Tor fand: lange Sätze,
// tote Verweise, kopierte Hilfen, vorweggenommene Fallzahlen, Legende ohne Zeichen,
// fehlendes Plus auf S. 7, Gold-Kopien. Regeln: references/eba-profil.md §6.

const GOLD = '1.1.1_lehrvertrag_orientieren_v42'
const KN_TYPEN = new Set(['fachgespraech', 'mini_case_schriftlich', 'werkschau_transfer'])
/** Vom Template vorgegebene Strategien; sie dürfen in jeder Leitfrage gleich stehen. */
const FESTE_STRATEGIE = /^(Lesen Sie zuerst die Beispielzeile im Raster|Füllen Sie zuerst die Denkhilfe aus)/
const ABK = /\b(z\. ?B|Abs|Art|lit|Nr|S|ca|bzw|usw|inkl|evtl|Fr|vgl|d\. ?h)\.(?=\s)/g

export function saetzeA2(text) {
  return String(text).replace(/\s+/g, ' ').replace(ABK, (m) => m.replace(/\./g, '․'))
    .split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ«"„0-9])/).map((s) => s.trim()).filter(Boolean)
}
export const woerterA2 = (s) => s.split(/\s+/).filter((w) => /[A-Za-zÄÖÜäöü0-9]/.test(w)).length

const INHALT = /situation_text|(^|\.)leitfrage$|leitfragen\[LF\d\]\.text$|(^|\.)raster\.(zeilen|spalten|beispiel)|kasten_s4\.spalten|nuggets|glossar|erwartungshorizont|hybrid_situation\.text|beispielbild|loesungsbild|loesung\.|fragestruktur|aufgaben\[\d+\]\.aufgabe/
const TECHNIK = /mindmap|dekontextualisierung|\.wo$|knoten_ref|quellen_anker|(^|\.)(id|key|ref|typ|nr|sm_id|kompetenz\w*|lebensbezug\w*|nrlp\w*|bloom\w*|pol_typ|antwortform|template|lehrgang|sprachniveau|status|spur)$/

/** Gedruckte Lernendenprosa ohne LP-Lösungen und ohne technische Felder. */
export function ebaLernendenprosa(E) {
  const out = textfelder(E, { karten: false, begleiter: false, kn: false, dossier: true })
    .filter((f) => !f.loesung && !TECHNIK.test(f.pfad))
  for (const f of knLernendentexte(E.json['kn.json'] ?? {})) out.push({ feld: `kn.json › ${f.pfad}`, datei: 'kn.json', pfad: f.pfad, text: f.text })
  return out
}

function zahlen(text) {
  return [...String(text).matchAll(/(?<![\d.,])(\d{2,5})(?![\d.,]?\d)/g)].map((m) => m[1]).filter((z) => !/^20\d\d$/.test(z))
}

function marken(x, out = new Set()) {
  if (Array.isArray(x)) x.forEach((y) => marken(y, out))
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) { if (k === 'marke' && typeof v === 'string') out.add(v); else marken(v, out) }
  return out
}

export function pruefeEbaQualitaet(E, B) {
  const err = (code, feld, was) => B.fehler(code, feld, was)
  const warn = (code, feld, was) => (B.warnung ? B.warnung(code, feld, was) : undefined)
  const nichtleer = (s) => typeof s === 'string' && !!s.trim()
  const d = E.json['dossier.json'] ?? {}
  const set = E.json['set.json'] ?? {}
  const kn = E.json['kn.json'] ?? {}
  const ga = set.gemeinsamer_auftrag ?? {}
  const prosa = ebaLernendenprosa(E)

  // 1 · A2-Satzlänge (a2-language-rules.md, Regel A2) und Meta-/Paragraphenwörter
  for (const f of prosa) {
    for (const s of saetzeA2(f.text)) {
      const w = woerterA2(s)
      if (w > 18) err('ERR_A2_SATZ_ZU_LANG', f.feld, `${w} Wörter: «${s.slice(0, 90)}»`)
    }
    if (/§|\bAbs\.\s?\d|\blit\.\s?[a-z]\b|\bArt\.\s?\d|\bOR\s+Art/.test(f.text)) err('ERR_EBA_PARAGRAPH', f.feld, 'Paragraphenangabe im Lernendentext; gehört in fakten_anker, Lösung oder Begleiter')
    if (/\bErfundener Fall\b/i.test(f.text)) err('ERR_EBA_META', f.feld, '«Erfundener Fall» ist ein Prüferhinweis, kein Lernendentext')
  }

  // 2 · Hilfen je Leitfrage aufgabenspezifisch, nicht kopiert
  const anfaenge = new Map(), strategien = new Map(), einzeln = new Map()
  for (const { datei, json: h } of E.hefte) {
    for (const lf of [...(h.leitfragen ?? []), ...(h.spuren?.ohne_medien?.leitfragen ?? [])]) {
      const wo = `${datei} › Leitfrage ${lf.nr}`
      for (const s of lf.scaffolding?.satzanfaenge ?? []) {
        const k = String(s).trim()
        if (anfaenge.has(k)) err('ERR_EBA_HILFEN_KOPIE', `${wo}.scaffolding.satzanfaenge`, `«${k}» steht schon bei ${anfaenge.get(k)}; je Leitfrage eigene Satzanfänge`)
        else anfaenge.set(k, wo)
      }
      // Einzelne gleiche Arbeitsschritte («Schreiben Sie nur Stichworte in das Raster.») sind
      // vertretbar; drei gleiche Strategien wie bei einer anderen Leitfrage nicht.
      const drei = JSON.stringify((lf.scaffolding?.strategien ?? []).map((x) => String(x).trim()))
      if (strategien.has(drei)) err('ERR_EBA_HILFEN_KOPIE', `${wo}.scaffolding.strategien`, `dieselben drei Strategien wie ${strategien.get(drei)}; je Leitfrage den eigenen Denkschritt nennen`)
      else strategien.set(drei, wo)
      for (const x of lf.scaffolding?.strategien ?? []) {
        const k = String(x).trim()
        if (FESTE_STRATEGIE.test(k)) continue
        if (einzeln.has(k)) warn('WARN_EBA_HILFEN_KOPIE', `${wo}.scaffolding.strategien`, `«${k.slice(0, 60)}» steht schon bei ${einzeln.get(k)}`)
        else einzeln.set(k, wo)
      }
    }
  }
  const pruefe = new Map()
  for (const n of d.nuggets ?? []) {
    const k = String(n.recherche?.selbst_pruefen ?? '').trim()
    if (k && pruefe.has(k)) err('ERR_EBA_HILFEN_KOPIE', `dossier.json › ${n.id}.recherche.selbst_pruefen`, `gleich wie ${pruefe.get(k)}; je Karte konkret`)
    else if (k) pruefe.set(k, n.id)
  }
  const wege = (d.sprachmodi_scaffolds ?? []).map((s) => JSON.stringify(s.so_gehst_du_vor ?? []))
  if (wege.length > 1 && new Set(wege).size < wege.length) err('ERR_EBA_HILFEN_KOPIE', 'dossier.json › sprachmodi_scaffolds[].so_gehst_du_vor', 'gleiche Schritte für verschiedene Sprachmodi; je Modus eigen (mündlich: üben, Zeit, Rückmeldung)')

  // 3 · Info-Karten: Sie-Form, keine Fallzahlen des eigenen Hefts (Lösung vorweggenommen)
  for (const n of d.nuggets ?? []) {
    if (/(^|[.!?:]\s+)(Ich|Mein|Meine|Mir|Mich)\b/.test(String(n.inhalt ?? ''))) err('ERR_EBA_DOSSIER_FORM', `dossier.json › ${n.id}.inhalt`, 'Info-Karte in Sie-Form; Ich-Form nur im Beispiel')
    const heft = E.hefte.find((h) => String(n.id).startsWith(`nugget_${h.heft}_`))?.json
    if (!heft) continue
    const fall = new Set(zahlen([heft.situation_text, JSON.stringify(heft.zahlen_tabelle ?? [])].join(' ')))
    const treffer = [...new Set(zahlen(`${n.inhalt ?? ''} ${n.beispiel ?? ''}`))].filter((z) => fall.has(z))
    if (treffer.length >= 2) err('ERR_EBA_VORWEG', `dossier.json › ${n.id}`, `Fallzahlen des Hefts auf der Info-Karte (${treffer.join(', ')}); Beispiel mit eigenen Zahlen`)
  }

  // 4 · Tote Verweise
  const tabelleS1 = /Tabelle (?:auf |von )?(?:Seite|S\.)\s?1\b(?:[^.]*?Heft ([AB]))?/
  for (const f of prosa) {
    const m = tabelleS1.exec(f.text)
    if (!m) continue
    const tag = m[1] ?? /^herausforderung_([AB])/.exec(f.datei ?? '')?.[1] ?? /nugget_([AB])_/.exec(f.pfad)?.[1]
    const h = E.hefte.find((x) => x.heft === tag)?.json
    if (h && !(h.zahlen_tabelle ?? []).length) err('ERR_EBA_VERWEIS', f.feld, `verweist auf eine Tabelle auf Seite 1 von Heft ${tag}, die es nicht gibt`)
  }
  for (const f of prosa) for (const [, t, nr] of String(f.text).matchAll(/Info-Karte ([AB])-(\d{2})/g)) {
    if (!(d.nuggets ?? []).some((n) => n.id === `nugget_${t}_${nr}`)) err('ERR_EBA_VERWEIS', f.feld, `Info-Karte ${t}-${nr} gibt es nicht`)
  }
  for (const [i, s] of (ga.schritte ?? []).entries()) {
    if (!/Raster|Tabelle/i.test(`${s.label ?? ''} ${s.hint ?? ''}`)) continue
    const p = (ga.produkte ?? []).find((x) => Number(x.schritt) === i + 1)
    if (p && p.form === 'flaeche') err('ERR_EBA_VERWEIS', `set.json › gemeinsamer_auftrag.schritte[${i}]`, 'Schritt bestellt ein Raster/eine Tabelle, die Seite druckt nur ein Schreibfeld')
  }

  // 5 · Gedruckte Form: Legende mit Zeichen, Plus auf S. 7, KN-Formen
  for (const { datei, json: h } of E.hefte) {
    for (const bild of ['beispielbild', 'loesungsbild']) {
      const b = h.handlungsprodukt?.[bild]
      if (!b?.legende?.length) continue
      const benutzt = marken(b.bloecke ?? [])
      for (const l of b.legende) if (!benutzt.has(l.key)) err('ERR_EBA_LEGENDE', `${datei} › handlungsprodukt.${bild}.legende`, `Zeichen «${l.key}» kommt im Bild nicht vor; marke setzen oder Legende kürzen`)
    }
    const lf = h.lernfortschritt
    if (!lf || Array.isArray(lf) || !nichtleer(lf.scaffold_90) || !nichtleer(lf.scaffold_100)) err('ERR_EBA_PLUS', `${datei} › lernfortschritt`, 'Objekt mit scaffold_90 und scaffold_100 erforderlich, sonst fehlt das freiwillige Plus auf S. 7')
  }
  for (const [i, t] of (kn.kn_typen ?? []).entries()) if (!KN_TYPEN.has(t.typ)) err('ERR_EBA_KN_TYP', `kn.json › kn_typen[${i}].typ`, `unbekannter Typ «${t.typ}» (${[...KN_TYPEN].join(', ')})`)

  // 6 · Kriterien an den Produktmodus angepasst (Warnung: das Urteil bleibt menschlich)
  const fassungen = new Map()
  const merk = (liste, wo) => {
    for (const k of liste ?? []) {
      const key = k.kn_kriterium ?? k.name
      if (!fassungen.has(key)) fassungen.set(key, [])
      fassungen.get(key).push([wo, JSON.stringify(k.stufen_lernende ?? [])])
    }
  }
  for (const { datei, json: h } of E.hefte) merk(h.feedback_kriterien, datei)
  merk(ga.feedback_kriterien, 'set.json')
  for (const [key, l] of fassungen) if (l.length > 2 && new Set(l.map(([, s]) => s)).size === 1) warn('WARN_EBA_STUFEN_MODUS', `Kriterium «${key}»`, `stufen_lernende in ${l.map(([w]) => w).join(', ')} wortgleich; an den Produktmodus anpassen (beim Sprechen / beim Schreiben)`)

  // 7 · Kopien aus der Gold-Einheit (Denkhilfe-Spalten, ganze Sätze)
  if (E.ordner !== GOLD) {
    let G = null
    try { G = ladeEinheit(E.wurzel, GOLD) } catch { G = null }
    if (G?.hefte?.length) {
      const spalten = new Set(G.hefte.map((h) => JSON.stringify(h.json.spuren?.ohne_medien?.kasten_s4?.spalten ?? null)))
      for (const { datei, json: h } of E.hefte) {
        const s = JSON.stringify(h.spuren?.ohne_medien?.kasten_s4?.spalten ?? null)
        if (s !== 'null' && spalten.has(s)) err('ERR_EBA_GOLD_KOPIE', `${datei} › kasten_s4.spalten`, 'Denkhilfe-Spalten aus der Gold-Einheit; aus Leitfrage 3 dieses Hefts ableiten')
      }
      // Nur Inhaltsfelder (Fall, Fragen, Raster, Info-Karten, Lösungen): feste Rahmensätze wie
      // «Lesen Sie die zwei Kriterien (S. 7).» stehen in jeder Einheit gleich und sind gewollt.
      const inhalt = (X) => textfelder(X, { karten: false, begleiter: false, kn: true, dossier: true }).filter((f) => INHALT.test(f.pfad) && !TECHNIK.test(f.pfad))
      const gold = new Set(inhalt(G).flatMap((f) => saetzeA2(f.text)).filter((s) => woerterA2(s) >= 6))
      for (const f of inhalt(E)) for (const s of saetzeA2(f.text)) if (woerterA2(s) >= 6 && gold.has(s)) warn('WARN_EBA_GOLD_KOPIE', f.feld, `Satz wörtlich aus Gold: «${s.slice(0, 80)}»; passt er zu diesem Fall?`)
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const A = aufruf('check-eba', 'node scripts/check-eba.mjs <ordner>… [--wurzel <pfad>] [--streng]')
  const berichte = A.ordner.map((o) => {
    const E = ladeEinheit(A.wurzel, o)
    const B = new Bericht('check-eba', E, { streng: A.streng })
    for (const f of E.fehler) B.fehler('ERR_EBA_DATEI', o, f)
    pruefeEba(E, B)
    return B
  })
  schluss('check-eba', berichte, { protokoll: A.protokoll })
}
