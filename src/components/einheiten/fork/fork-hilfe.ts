/**
 * Fork-Pilot — kleine Helfer für die Fork-Oberfläche der Workbench-Insel.
 * Läuft im Browser: keine Node-Importe, nur Typen und Konstanten aus `src/lib/fork/`.
 */
import { VERMERK, HEFT_DATEI, type BuendelHeft } from '../../../lib/fork/typen'
import type { AuftragKey, FassungsDatei } from '../../../lib/fork/typen'

/** Vermerk nach VERTRAG §5 im HTML: an die Fusszeile jeder Seite angehängt. */
export const VERMERK_CSS = `\n.page-foot .foot-titel::after { content: " · ${VERMERK}"; }\n`

/** Kopfzeile im Word (docx-*.ts liegen im Zaun): die Abteilung trägt den Vermerk. */
export const abteilungMitVermerk = (abteilung: string) => (abteilung ? `${abteilung} · ${VERMERK}` : VERMERK)

const musterCache = new Map<string, RegExp>()
/** Muster der Positivliste (`*` = beliebiger Schlüsselwert, `<s>` = Spur) gegen einen konkreten Pfad. */
export function passtMuster(pfad: string, muster: string): boolean {
  let re = musterCache.get(muster)
  if (!re) {
    const quelle = muster
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\*/g, '[^\\]]+')
      .replace(/<s>/g, '(?:ohne_medien|mit_medien)')
    re = new RegExp(`^${quelle}$`)
    musterCache.set(muster, re)
  }
  return re.test(pfad)
}

/** Welche Aufträge die Lehrperson für diesen Block wählen darf (VERTRAG §4 «Ziel»). */
export function auftraegeFuer(datei: FassungsDatei, pfad: string, zielMuster: Record<AuftragKey, string[]>): AuftragKey[] {
  if (datei === 'dossier') return []
  const istSet = datei === 'set'
  return (Object.keys(zielMuster) as AuftragKey[]).filter((a) => {
    // Eigener Text gilt nur für die Spur ohne Medien (VERTRAG §4).
    if (a === 'eigener_text' && pfad.startsWith('spuren.mit_medien.')) return false
    return (zielMuster[a] ?? []).some((m) => {
      const roh = m.includes(':') ? m.slice(m.indexOf(':') + 1) : m
      if (roh.startsWith('gemeinsamer_auftrag') !== istSet) return false
      return passtMuster(pfad, roh)
    })
  })
}

export function heftVon(datei: string): BuendelHeft | null {
  const h = (Object.keys(HEFT_DATEI) as BuendelHeft[]).find((k) => HEFT_DATEI[k] === datei)
  return h ?? null
}

export const HEFT_LABEL: Record<BuendelHeft, string> = { A: 'Heft A', B: 'Heft B', auftrag: 'Auftragsbogen', dossier: 'Dossier' }

const NAMEN: Record<string, string> = {
  titel: 'Titel', persona: 'Person', situation_text: 'Situation', zahlen_tabelle: 'Zahlen', leitfrage: 'Leitfrage',
  mehrdeutigkeit: 'Spannungsfeld', hint: 'Hinweis', wochen_plan: 'Übersicht', quellen_anker: 'Im Lehrmittel',
  leitfragen_intro: 'Einleitung Leitfragen', text: 'Frage', liefert: 'liefert', knoten_ref: 'Begriff im Netz',
  scaffolding: 'Hilfe', loesung: 'Lösung', raster: 'Raster', auftrag: 'Auftrag', spalten: 'Spalten',
  beispielzeile: 'Beispielzeile', kasten_s4: 'Kasten Seite 4', scaffold_90: 'Plus 90', scaffold_100: 'Plus 100',
  lernfortschritt: 'Lernfortschritt', handlungsprodukt: 'Handlungsprodukt', format: 'Format', format_detail: 'Format (Detail)',
  beschreibung: 'Beschreibung', schritte: 'Schritt', abgaben: 'Abgaben', beispielbild: 'Beispiel', loesungsbild: 'Lösungsbild',
  feedback_kriterien: 'Kriterium', indikator_produkt: 'Indikator', stufen: 'Stufen', name_lernende: 'Name (Lernende)',
  stufen_lernende: 'Stufen (Lernende)', methoden: 'Methode', mindmap_zentrum: 'Begriffsnetz (Mitte)', mindmap_aeste: 'Begriffsnetz (Äste)',
  abschluss: 'Abschluss', bewertungsraster: 'Checkliste', gemeinsamer_auftrag: '', sozialform: 'Sozialform', empfehlung: 'Empfehlung',
  heft_bezug: 'Bezug zum Heft', inhalte: 'Inhalte', produkte: 'Produkte', erwartungshorizont: 'Erwartungshorizont',
  woerter: 'Wörter', kontext_ausschluss: 'Ausschlüsse', nuggets: 'Wissensteil', glossar: 'Glossar', leseblatt: 'Leseblatt',
  einleitung: 'Einleitung', was_ist_das: 'Was ist das', sprachmodi_scaffolds: 'Sprachhilfe', transfer_wissensblatt: 'Transfer',
  richtig_falsch: 'Richtig/Falsch', w_fragen: 'W-Fragen', vokabeln: 'Vokabeln', spuren: '',
}

/** `herausforderung_A:spuren.ohne_medien.leitfragen[nr=3].text` → «Heft A · ohne Medien · Leitfrage 3 · Frage». */
export function lesbar(datei: string | null, pfad: string): string {
  let d = datei
  let p = pfad
  if (!d && p.includes(':') && !p.startsWith('[')) { d = p.slice(0, p.indexOf(':')); p = p.slice(p.indexOf(':') + 1) }
  const h = d ? heftVon(d) : null
  const teile: string[] = h ? [HEFT_LABEL[h]] : d ? [d] : []
  for (const seg of p.split(/\.(?![^[]*\])/)) {
    const m = /^([a-z0-9_]+)(?:\[([a-z_]+)=([^\]]+)\])?$/.exec(seg)
    if (!m) { teile.push(seg); continue }
    const [, name, schl, wert] = m
    if (name === 'ohne_medien') { teile.push('ohne Medien'); continue }
    if (name === 'mit_medien') { teile.push('mit Medien'); continue }
    if (name === 'leitfragen' && schl === 'nr') { teile.push(`Leitfrage ${wert}`); continue }
    const label = NAMEN[name] ?? name.replace(/_/g, ' ')
    if (schl) teile.push(`${label} «${wert}»`.trim())
    else if (label) teile.push(label)
  }
  return teile.join(' · ')
}

export const DATEI_MAX = 5 * 1024 * 1024
/** Prüft eine Datei für den eigenen Text; Fehlertext oder `null`. */
export function pruefeDatei(f: File): string | null {
  if (!/\.(docx|pdf|txt)$/i.test(f.name)) return 'Bitte eine Word-Datei (.docx), ein PDF oder eine Textdatei (.txt) wählen.'
  if (f.size > DATEI_MAX) return `Die Datei ist ${(f.size / 1024 / 1024).toFixed(1)} MB gross. Erlaubt sind höchstens 5 MB.`
  return null
}
