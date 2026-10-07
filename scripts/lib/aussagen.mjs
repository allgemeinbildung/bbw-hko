/**
 * aussagen.mjs — findet im Text einer Einheit Aussagen über die Welt (Gesetzesartikel,
 * «Stand …», Daten, Beträge, Prozente, Fristen, Mengen, Abstimmungen) und die Zahlen
 * dahinter. Gemeinsame Grundlage für check-fakten (jede Aussage braucht eine Zeile in
 * fakten.json) und check-zahlen (Fallzahlen überall mit demselben Wert). ENTSCHEIDE E38.
 *
 *   import { findeAussagen, zahlWert, einheitKlasse, fallzahlen, istFallzahl } from './lib/aussagen.mjs'
 *
 * Gesucht wird am Schriftbild, nicht am Sinn: Eine Rechtsaussage ohne Artikel, Zahl
 * oder Datum findet dieses Skript nicht — die findet nur das Fakten-Audit selbst.
 *
 * Reines Node, keine Abhängigkeiten. Kein Quellen- oder Lehrmittelwortlaut.
 */

// Gesetzeskürzel, wie sie in den Einheiten vorkommen können (Bund). Gross/Klein zählt.
export const KUERZEL = ['OR', 'ZGB', 'SVG', 'KVG', 'KVV', 'KLV', 'UVG', 'UVV', 'VVG', 'BV', 'SchKG', 'StGB', 'StPO', 'ZPO', 'ArG', 'ArGV', 'BBG', 'BBV', 'UWG', 'DSG', 'URG', 'JStG', 'AHVG', 'IVG', 'BVG', 'AVIG', 'EOG', 'ELG', 'ATSG', 'MWSTG', 'DBG', 'KKG', 'PBV', 'PrSG', 'VRV', 'VZV', 'OBG', 'SSV', 'BPR', 'ParlG', 'RTVG', 'USG', 'GlG', 'AIG', 'AsylG', 'BüG', 'FMG', 'TSchG', 'BetmG', 'ZDG', 'EMRK', 'KG', 'PüG', 'StHG', 'VStG', 'WPEG', 'BGÖ', 'JSG', 'TabPG', 'AlkG', 'LMG', 'EnG']
const K = KUERZEL.join('|')
const MONAT = 'Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember'
const NUM = String.raw`\d[\d'’.,]*\d|\d`
const ZAHLWORT = 'ein|eine|einem|einen|einer|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|vierzehn|fünfzehn|zwanzig|dreissig|sechzig|neunzig|hundert'
const ARTNR = String.raw`\d+[a-z]{0,2}(?:bis|ter|quater)?`
const ABS = String.raw`(?:\s(?:Abs\.|Absatz|Ziff\.|Ziffer|Bst\.|lit\.)\s?[\w]+(?:bis)?(?:\s?(?:[–-]|und|,)\s?\w+)*)`

/** Die Arten in der Reihenfolge ihres Vorrangs: Überlappt ein Treffer einen höheren, fällt er weg. */
export const ARTEN = Object.freeze(['artikel', 'stand', 'abstimmung', 'datum', 'betrag', 'prozent', 'frist', 'zahl'])

const MUSTER = [
  // «Art. 40e Abs. 2 OR», «Art. 40c» · «OR Art. 41», «OR 40a–40e», «SVG 58»
  ['artikel', new RegExp(String.raw`(?:\bArt\.|\bArtikel)\s?${ARTNR}(?:\s?(?:[–-]|bis|und|,)\s?${ARTNR})*${ABS}*(?:\s(?:des\s|der\s)?(?:${K})\b)?`, 'g')],
  ['artikel', new RegExp(String.raw`\b(?:${K})\s(?:Art\.\s?)?${ARTNR}(?:\s?(?:[–-]|und|,)\s?${ARTNR})*${ABS}*`, 'g')],
  ['stand', new RegExp(String.raw`\bStand(?:\s(?:vom|per|am|des))?:?\s(?:\d{1,2}\.\s?\d{1,2}\.\s?\d{2,4}|\d{1,2}\.\s?(?:${MONAT})\s\d{4}|(?:${MONAT})\s\d{4}|(?:19|20)\d{2})`, 'g')],
  ['abstimmung', /\b(?:Volksabstimmung|Abstimmung|Volksinitiative|Initiative|Referendum|Vorlage|Stimmvolk|Stimmbevölkerung)\b[^.!?\n]{0,90}\b(?:angenommen|abgelehnt|verworfen|gutgeheissen|gescheitert|Ja-Anteil|Nein-Anteil|Ja-Stimmen|Nein-Stimmen)\b|\b(?:angenommen|abgelehnt|verworfen)\b[^.!?\n]{0,60}\b(?:Volksabstimmung|Abstimmung|Volksinitiative|Initiative|Referendum)\b|\bStimmbeteiligung\b[^.!?\n]{0,40}\d/g],
  ['datum', new RegExp(String.raw`\b\d{1,2}\.\s?(?:\d{1,2}\.\s?(?:19|20)\d{2}|(?:${MONAT})\s(?:19|20)\d{2})\b|\b(?:${MONAT})\s(?:19|20)\d{2}\b|\b(?:seit|ab|bis|vor|nach|per|von|im Jahr|im Jahre|Ende|Anfang|Mitte)\s(?:19|20)\d{2}\b`, 'g')],
  ['betrag', new RegExp(String.raw`(?:\bCHF|\bFr\.|\bSFr\.)\s?(?:${NUM})(?:\.–|\.-)?(?:\s?(?:Mio\.|Mrd\.|Millionen|Milliarden))?|(?:${NUM})\s?(?:Mio\.|Mrd\.|Millionen|Milliarden)?\s?(?:Franken|Rappen|CHF\b|Fr\.)`, 'g')],
  ['prozent', new RegExp(String.raw`(?:${NUM})\s?(?:%|Prozent\b|Promille\b|‰)`, 'g')],
  ['frist', new RegExp(String.raw`(?:(?:${NUM})|\b(?:${ZAHLWORT}))\s(?:Arbeitstag(?:e|en)?|Tag(?:e|en)?|Wochenstunden|Wochen?|Monat(?:e|en)?|Monatsl(?:ohn|öhne|öhnen)|Jahr(?:e|en)?|Stunden?)\b`, 'g')],
  ['zahl', new RegExp(String.raw`(?:${NUM})\s?(?:Mio\.|Mrd\.|Millionen|Milliarden|Personen|Menschen|Haushalte|Tonnen|Kilogramm|kg\b|Kilometer|km\b|km\/h|Liter|Grad\b|°C|Stimmen|Kantone|Mitglieder|Unterschriften|Sitze)`, 'g')],
]

/**
 * Aussagen in einem Text.
 * @returns {{ art: string, treffer: string, pos: number }[]}  in Textreihenfolge, ohne Überlappung
 */
export function findeAussagen(text) {
  const t = String(text ?? '')
  const alle = []
  for (const [art, re] of MUSTER) for (const m of t.matchAll(re)) alle.push({ art, treffer: m[0].trim(), pos: m.index, ende: m.index + m[0].length, rang: ARTEN.indexOf(art) })
  alle.sort((a, b) => a.rang - b.rang || (b.ende - b.pos) - (a.ende - a.pos))
  const out = []
  for (const x of alle) if (!out.some((y) => x.pos < y.ende && y.pos < x.ende)) out.push(x)
  return out.sort((a, b) => a.pos - b.pos).map(({ art, treffer, pos }) => ({ art, treffer, pos }))
}

/** «1'080», «9,2», «2'200.50», «1.5» → Zahl; Zahlwort → Zahl; sonst null. */
export function zahlWert(s) {
  const wort = { ein: 1, eine: 1, einem: 1, einen: 1, einer: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, vierzehn: 14, fünfzehn: 15, zwanzig: 20, dreissig: 30, sechzig: 60, neunzig: 90, hundert: 100 }
  const t = String(s ?? '').trim().toLowerCase()
  const m = /\d[\d'’.,]*/.exec(t)
  if (!m) { const w = t.split(/\s+/)[0]; return Object.hasOwn(wort, w) ? wort[w] : null }
  let z = m[0].replace(/['’]/g, '').replace(/[.,]+$/, '')
  // Tausenderpunkt («1.500»): Punkt vor genau drei Ziffern am Ende, nicht nach einer führenden Null («0.125»).
  if (/^[1-9]\d{0,2}(\.\d{3})+$/.test(z)) z = z.replace(/\./g, '')
  z = z.replace(',', '.')
  const n = Number(z)
  return Number.isFinite(n) ? n : null
}

/** Einheit eines Treffers bzw. eines Eintrags in fall.json als Klasse — für den Vergleich. */
export function einheitKlasse(s) {
  const t = String(s ?? '').toLowerCase()
  if (/chf|fr\.|franken|rappen/.test(t)) return 'geld'
  if (/%|prozent|promille|‰/.test(t)) return 'prozent'
  if (/arbeitstag|tag/.test(t)) return 'tage'
  if (/wochenstunde|stunde/.test(t)) return 'stunden'
  if (/woche/.test(t)) return 'wochen'
  if (/monat/.test(t)) return 'monate'
  if (/jahr/.test(t)) return 'jahre'
  return t.replace(/[^a-zäöü]/g, '') || ''
}

const norm = (s) => String(s ?? '').normalize('NFKC').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim()

/**
 * Die Fallzahlen aus fall.json, je Träger.
 * @param {any} fall  Inhalt von fall.json (oder null)
 * @returns {Record<string, { name: string, wert: any, einheit: string, klasse: string, schreibweisen: string[], traeger: string }[]>}
 */
export function fallzahlen(fall) {
  const out = { A: [], B: [], auftrag: [] }
  for (const [traeger, f] of Object.entries(fall?.faelle ?? {})) {
    out[traeger] ??= []
    for (const z of f?.zahlen ?? []) out[traeger].push({ name: z.name, wert: z.wert, einheit: z.einheit ?? '', klasse: einheitKlasse(z.einheit), schreibweisen: (z.schreibweisen ?? []).map(norm), traeger })
  }
  return out
}

/** Die Fallzahlen, die für ein Feld gelten: die des eigenen Hefts; Auftrag, KN, Begleiter und Karten alle. */
export function fallzahlenFuer(fz, traeger) {
  if (traeger === 'A' || traeger === 'B') return fz[traeger] ?? []
  return Object.values(fz).flat()
}

/** Ist dieser Treffer eine Fallzahl? Gleiche Schreibweise, oder gleicher Wert bei gleicher Einheitsklasse. */
export function istFallzahl(treffer, liste) {
  const t = norm(treffer)
  const w = zahlWert(treffer)
  const k = einheitKlasse(treffer.replace(/[\d'’.,]/g, ' '))
  return liste.some((z) => z.schreibweisen.some((s) => s && t.includes(s)) || (typeof z.wert === 'number' && w !== null && z.wert === w && (!z.klasse || !k || z.klasse === k)) || (typeof z.wert === 'string' && t.includes(norm(z.wert))))
}
