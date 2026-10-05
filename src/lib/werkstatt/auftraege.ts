// Werkstatt — die Aufträge, also das, was eine Lehrperson zusätzlich zu einer
// fertigen Einheit erzeugen lassen kann.
//
// Ein Auftrag bestimmt drei Dinge, und nur diese drei:
//   1. `material`  — welche Stellen der Einheit der Prompt zitieren darf,
//   2. `aufgabe`   — was das LLM tun soll und was es dabei nicht verletzen darf,
//   3. `skelett`   — die Markdown-Überschriften, in denen die Antwort kommen muss.
//
// Der gemeinsame Rahmen (Rolle, Konsistenz-Vertrag, Sprachregeln) steht in prompt.ts
// und ist für alle Aufträge identisch. Ein neuer Auftrag ist damit ein Eintrag in
// AUFTRAEGE und sonst nichts.
//
// Zum `skelett`: Es ist heute reine Formvorgabe für die Lehrperson, die die Antwort in
// Word weiterverarbeitet. Es ist zugleich die Naht für einen späteren Rückweg — wenn
// die Antwort einmal wieder eingelesen und ins Hausformat gerendert werden soll, hat
// der Parser bereits eine feste Struktur zu greifen, und Prompts, die jemand vor
// Monaten kopiert hat, bleiben gültig. Deshalb steht es von Anfang an drin, auch
// solange nichts es liest.

import type { WerkstattKontext, WerkstattHf } from './kontext'
import { hfAusKontext, SPUR_LABEL } from './kontext'

export const NIVEAUS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type Niveau = (typeof NIVEAUS)[number]

export const NIVEAU_LABEL: Record<Niveau, string> = {
  A1: 'A1 — Einsteiger',
  A2: 'A2 — Grundlegende Kenntnisse',
  B1: 'B1 — Fortgeschrittene Sprachverwendung',
  B2: 'B2 — Selbstständige Sprachverwendung',
  C1: 'C1 — Fachkundige Sprachkenntnisse',
  C2: 'C2 — Annähernd muttersprachliche Kenntnisse',
}

export type AuftragKey = 'herausforderung_d' | 'differenzierung' | 'sprachniveau' | 'kn_uebung'

export interface WerkstattWahl {
  auftrag: AuftragKey
  /** Auf welche Herausforderung sich der Auftrag bezieht (A/B/C) — nicht bei allen nötig. */
  hf: string | null
  /** Zweite Achse innerhalb eines Auftrags (z. B. Stütze vs. Erweiterung). */
  richtung: string | null
  niveau: Niveau
  /** Freitext der Lehrperson: Beruf, Klasse, Abteilung. Darf leer bleiben. */
  zielgruppe: string
}

export interface AuftragDef {
  key: AuftragKey
  label: string
  /** Eine Zeile für die Karte in der Oberfläche. */
  zweck: string
  /** Braucht der Auftrag eine gewählte Herausforderung? */
  brauchtHf: boolean
  richtungen: { key: string; label: string; hinweis: string }[]
  niveauDefault: Niveau
  /** Beschriftung des Freitextfelds — null blendet es aus. */
  zielgruppeLabel: string | null
  /**
   * Darf die Abteilung aus dem Profil als Vorschlag ins Freitextfeld?
   * Nur dort, wo das Feld wirklich die Lerngruppe meint. Bei «Vierte Herausforderung D»
   * meint es den Beruf der neuen Persona — die Abteilung der Lehrperson wäre dort
   * eine falsche Antwort auf eine andere Frage.
   */
  zielgruppeVorschlag: boolean
  /** null = machbar; String = Grund, warum diese Einheit den Auftrag nicht hergibt. */
  blockiert: (k: WerkstattKontext, w: WerkstattWahl) => string | null
  material: (k: WerkstattKontext, w: WerkstattWahl) => string[]
  aufgabe: (k: WerkstattKontext, w: WerkstattWahl) => string[]
  skelett: (k: WerkstattKontext, w: WerkstattWahl) => string[]
  /**
   * Was bei einer v4.2-Einheit anders HEISST (E29). Nur Anzeige — die Logik verzweigt in
   * `blockiert`/`material`/`aufgabe`/`skelett` selbst an `k.v42`. Fehlt ein Feld, gilt das
   * des alten Formats; gelesen wird es ausschliesslich über {@link auftragAnzeige}.
   */
  v42?: Partial<Pick<AuftragDef, 'label' | 'zweck' | 'richtungen' | 'zielgruppeLabel' | 'zielgruppeVorschlag'>>
}

/** Die anzeigbaren Teile eines Auftrags für genau diese Einheit (altes Format oder v4.2). */
export function auftragAnzeige(
  def: AuftragDef,
  k: Pick<WerkstattKontext, 'v42'> | null
): Pick<AuftragDef, 'label' | 'zweck' | 'richtungen' | 'zielgruppeLabel' | 'zielgruppeVorschlag'> {
  const v = k?.v42 ? def.v42 ?? {} : {}
  return {
    label: v.label ?? def.label,
    zweck: v.zweck ?? def.zweck,
    richtungen: v.richtungen ?? def.richtungen,
    zielgruppeLabel: v.zielgruppeLabel !== undefined ? v.zielgruppeLabel : def.zielgruppeLabel,
    zielgruppeVorschlag: v.zielgruppeVorschlag ?? def.zielgruppeVorschlag,
  }
}

// ---------------------------------------------------------------------------
// Bausteine, die mehrere Aufträge teilen
// ---------------------------------------------------------------------------

const liste = (items: string[], prefix = '  - '): string[] =>
  items.filter(Boolean).map((x) => `${prefix}${x}`)

const zeile = (label: string, wert: string): string[] => (wert ? [`${label}: ${wert}`] : [])

/** Eine Herausforderung knapp — für Aufträge, die A/B/C nur als Nachbarn brauchen. */
function hfKurz(h: WerkstattHf): string[] {
  return [
    `Herausforderung ${h.buchstabe} — ${h.titel}`,
    ...zeile('  Leistet', h.label),
    ...zeile('  Persona', [h.persona.beruf, h.persona.betrieb, h.persona.ort].filter(Boolean).join(', ')),
    ...zeile('  Handlungsprodukt', [h.produkt.format, h.produkt.titel].filter(Boolean).join(' — ')),
    ...zeile('  Trade-off', h.tradeOff),
    ...zeile('  Kernkonzept', h.kernkonzept),
  ]
}

/** Eine Herausforderung vollständig — für Aufträge, die an ihrem Text arbeiten. */
function hfVoll(h: WerkstattHf): string[] {
  const out: string[] = [
    `HERAUSFORDERUNG ${h.buchstabe} — ${h.titel}`,
    ...zeile('Leistet', h.label),
    ...zeile('Emotion', h.emotionTag),
    ...zeile('Persona', [h.persona.beruf, h.persona.betrieb, h.persona.ort].filter(Boolean).join(', ')),
    '',
    'SITUATIONSTEXT:',
    h.situationText || '  (kein Text hinterlegt)',
  ]
  if (h.zahlen.length) {
    out.push('', 'ZAHLEN IM TEXT:', ...liste(h.zahlen.map((z) => `${z.label}: ${z.wert}`)))
  }
  if (h.leitfragen.length) {
    out.push(
      '',
      'LEITFRAGEN:',
      ...h.leitfragen.map((l) =>
        `  LF${l.nr} (${l.bloom || 'ohne Bloom-Angabe'}): ${l.text}` +
        (l.liefert ? `\n    liefert: ${l.liefert}` : '')
      )
    )
  }
  out.push(
    '',
    'HANDLUNGSPRODUKT:',
    ...zeile('  Format', [h.produkt.format, h.produkt.formatDetail].filter(Boolean).join(' — ')),
    ...zeile('  Titel', h.produkt.titel),
    ...zeile('  Beschreibung', h.produkt.beschreibung)
  )
  if (h.produkt.schritte.length) {
    out.push('  Schritte:', ...liste(h.produkt.schritte.map((x) => `${x.label}: ${x.hint}`), '    - '))
  }
  if (h.tradeOff) {
    out.push('', 'MEHRDEUTIGKEIT:', `  Trade-off: ${h.tradeOff}`, ...zeile('  Hinweis', h.tradeOffHint))
  }
  if (h.kriterien.length) {
    out.push('', 'BEURTEILUNGSKRITERIEN:', ...liste(h.kriterien.map((x) => `${x.kriterium} — ${x.indikator}`)))
  }
  return out
}

function scaffoldingVorhanden(h: WerkstattHf): string[] {
  const out: string[] = []
  if (h.produkt.strategien.length) out.push('Bestehende Strategien:', ...liste(h.produkt.strategien))
  if (h.produkt.satzanfaenge.length) out.push('Bestehende Satzanfänge:', ...liste(h.produkt.satzanfaenge))
  if (h.produkt.struktur.length) out.push('Bestehende Struktur:', ...liste(h.produkt.struktur))
  if (h.scaffold90) out.push(`Stütze laut Einheit (90 %): ${h.scaffold90}`)
  if (h.scaffold100) out.push(`Erweiterung laut Einheit (100 %): ${h.scaffold100}`)
  return out.length ? out : ['(Die Einheit hat für diese Herausforderung noch keine Differenzierung hinterlegt.)']
}

const STOFF_REGEL =
  'Bleibe beim Stoff der Einheit (siehe Konzepte im Konsistenz-Vertrag). Führe keine neuen Fachbegriffe ein, die in der Einheit nicht vorkommen.'

// ---------------------------------------------------------------------------
// Heft v4.2 (ENTSCHEIDE E29) — Bausteine und die vier Aufträge in ihrer v4.2-Fassung.
//
// Situation, Leitfragen, Produkt und Kriterien beider Hefte stehen bei v4.2 bereits im
// Konsistenz-Vertrag (prompt.ts). `material` liefert darum nur, was der einzelne Auftrag
// ZUSÄTZLICH braucht: Scaffold-Spalte, Raster, Denkhilfe, Beispielbild, Glossar.
// ---------------------------------------------------------------------------

const punkte = (n: number): string => (n === 1 ? '1 Punkt' : `${n} Punkte`)

const STOFF_REGEL_V42 =
  'Bleibe beim Stoff der Einheit (Konzepte, Lehrmittel-Anker und Glossarbegriffe im Konsistenz-Vertrag). Führe keine neuen Fachbegriffe ein, die in der Einheit nicht vorkommen.'

const FALL_REGEL_V42 =
  'Kein Fall, kein Beispiel und keine Zahl darf aus einem verbrauchten Lebensbereich stammen oder einen Fall-Begriff verwenden, der im Konsistenz-Vertrag unter «VERBRAUCHT» oder «DEM KN VORBEHALTEN» steht.'

/** Die Werkzeuge eines Hefts in seiner Spur: Scaffold-Spalte, Raster, Kasten S. 4, Beispielbild, Schritte. */
function heftWerkzeuge(h: WerkstattHf): string[] {
  const v = h.v42
  if (!v) return []
  const out: string[] = [
    `HEFT ${h.buchstabe} — ${h.titel} (Spur ${SPUR_LABEL[v.spur] ?? v.spur})`,
    'Situation, Leitfragen, Produkt und Feedback-Kriterien dieses Hefts stehen im Konsistenz-Vertrag.',
  ]
  const mitScaffold = v.leitfragen.filter((l) => l.strategien.length || l.satzanfaenge.length || l.insProdukt)
  if (mitScaffold.length) {
    out.push('', 'SCAFFOLD-SPALTE NEBEN DEN LEITFRAGEN (steht so im Heft):')
    for (const l of mitScaffold) {
      out.push(`  LF${l.nr}:`)
      if (l.strategien.length) out.push('    So gehen Sie vor:', ...liste(l.strategien, '      - '))
      if (l.satzanfaenge.length) out.push('    Satzanfänge:', ...liste(l.satzanfaenge, '      - '))
      if (l.insProdukt) out.push(`    Ins Produkt: ${l.insProdukt}`)
    }
  }
  if (v.raster) {
    out.push(
      '',
      'RASTER ALS ANTWORTFELD VON LF3 (Seite 3):',
      ...zeile('  Lehrmittel-Abschnitt', v.raster.abschnitt),
      ...zeile('  Auftrag', v.raster.auftrag),
      ...zeile('  Spalten', v.raster.spalten.join(' | ')),
      ...(v.raster.zeilen ? [`  Zeilen: ${v.raster.zeilen}`] : []),
      ...zeile('  Ausgefüllte Beispielzeile', v.raster.beispielzeile.join(' | '))
    )
  }
  if (v.kasten) {
    out.push(
      '',
      v.kasten.typ === 'denkhilfe' ? 'DENKHILFE ZU LF4 (Seite 4, Tabelle):' : 'KASTEN AUF SEITE 4:',
      ...zeile('  Titel', v.kasten.titel),
      ...zeile('  Spaltenköpfe', v.kasten.spalten.join(' | ')),
      ...zeile('  Hinweis', v.kasten.hinweis)
    )
  }
  if (v.beispielbild) {
    out.push(
      '',
      'BEISPIELBILD (Seite 6) — das Produkt, ausgefüllt an einem anderen Fall:',
      ...zeile('  Titel', v.beispielbild.titel),
      ...zeile('  Blöcke', v.beispielbild.bloecke.join(' · '))
    )
  }
  if (h.produkt.schritte.length) {
    out.push('', 'SCHRITTE ZUM PRODUKT (Seite 5):', ...liste(h.produkt.schritte.map((x) => `${x.label}: ${x.hint}`)))
  }
  if (v.abgaben.length) out.push('', 'ABGABEN:', ...liste(v.abgaben))
  if (v.methoden.length) {
    out.push('', 'METHODENKARTEN (Seite 6):', ...liste(v.methoden.map((m) => (m.fuer ? `${m.name} — ${m.fuer}` : m.name))))
  }
  if (h.scaffold90 || h.scaffold100) out.push('')
  if (h.scaffold90) out.push(`Stütze laut Heft: ${h.scaffold90}`)
  if (h.scaffold100) out.push(`Plus laut Heft (für Schnelle): ${h.scaffold100}`)
  return out
}

function rubrikWortlaut(k: WerkstattKontext): string[] {
  const out: string[] = []
  for (const r of k.v42?.rubrik ?? []) {
    out.push(`  ${r.name} [${r.dimension}]`, ...r.stufen.map((t, i) => `    ${punkte(i)}: ${t}`))
  }
  return out
}

const v42HeftC = {
  blockiert: (k: WerkstattKontext): string | null => {
    const v = k.v42!
    if (k.hfs.length === 0) return 'Diese Einheit hat noch kein Heft, an dem sich ein weiteres orientieren könnte.'
    if (!k.ankerStatement) return 'Dieser Einheit fehlt das Prinzip (Anker-Statement) — ohne es hat ein weiteres Heft keinen roten Faden.'
    if (!v.zentrum) return 'Dieser Einheit fehlt das gemeinsame Zentrum des Begriffsnetzes — ein weiteres Heft könnte nicht daran anschliessen.'
    if (v.rubrik.length < 4 || v.rubrik.some((r) => r.stufen.length < 4))
      return 'Der Kompetenznachweis dieser Einheit führt noch nicht vier Kriterien mit ihrem Wortlaut — ein weiteres Heft könnte seine zwei Feedback-Kriterien nicht daraus übernehmen.'
    return null
  },
  material: (k: WerkstattKontext): string[] => {
    const v = k.v42!
    const out: string[] = [
      'DIE VIER KN-KRITERIEN IM WORTLAUT — zwei davon trägt das neue Heft, unverändert:',
      ...rubrikWortlaut(k),
    ]
    if (v.kriterienVerteilung.length) {
      out.push(
        '',
        'So sind sie bisher verteilt:',
        ...liste(v.kriterienVerteilung.map((x) => `Heft ${x.heft}: ${x.kriterien.join(' · ')}`))
      )
    }
    const typen = k.hfs.map((h) => `Heft ${h.buchstabe}: ${h.v42?.produktTyp || h.produkt.format}`).filter((x) => !x.endsWith(': '))
    if (typen.length) out.push('', 'PRODUKTTYPEN, DIE BEREITS VERGEBEN SIND:', ...liste(typen))
    if (v.musterOhneMedien.length) {
      out.push('', 'MUSTER DER SPUR OHNE MEDIEN — so sehen Raster und Denkhilfe in dieser Einheit aus:')
      for (const m of v.musterOhneMedien) {
        out.push(
          `  Heft ${m.heft}:`,
          ...zeile('    Lehrmittel-Abschnitt', m.abschnitt),
          ...zeile('    Auftrag zum Raster', m.auftrag),
          ...zeile('    Spalten', m.spalten.join(' | ')),
          ...zeile('    Ausgefüllte Beispielzeile', m.beispielzeile.join(' | ')),
          ...(m.denkhilfe
            ? [
                ...zeile('    Denkhilfe, Spaltenköpfe', m.denkhilfe.spalten.join(' | ')),
                ...zeile('    Denkhilfe, Hinweis', m.denkhilfe.hinweis),
              ]
            : [])
        )
      }
    }
    const methoden = unique(k.hfs.flatMap((h) => (h.v42?.methoden ?? []).map((m) => m.name)))
    if (methoden.length) out.push('', 'METHODENKARTEN, DIE IN DEN HEFTEN VORKOMMEN:', ...liste(methoden))
    return out
  },
  aufgabe: (k: WerkstattKontext, w: WerkstattWahl): string[] => {
    const v = k.v42!
    const abschnitte = v.musterOhneMedien.map((m) => m.abschnitt).filter(Boolean)
    return [
      `Entwirf ein weiteres Heft C für diese Einheit — ein drittes Heft im selben Gerüst und zum selben Prinzip wie ${
        k.hfs.map((h) => `Heft ${h.buchstabe}`).join(' und ')
      }${w.zielgruppe ? `. Wunsch der Lehrperson zum Fall oder Lebensbereich: ${w.zielgruppe}` : ''}.`,
      '',
      'Verbindlich:',
      ...liste([
        `Dasselbe Prinzip (Anker-Statement im Konsistenz-Vertrag) und dasselbe Zentrum im Begriffsnetz: «${v.zentrum}». Heft C führt eine der abgedeckten Kompetenzen der Einheit weiter und nennt sie.`,
        `Die Persona bleibt die neutrale der Einheit${v.personaNeutral ? ` (${v.personaNeutral})` : ''}. Neu ist der Fall, nicht die Person: kein Vorname, kein erfundener Beruf, kein erfundener Betrieb.`,
        `Ein eigener Fall in einem UNVERBRAUCHTEN Lebensbereich. Gesperrt sind die Lebensbereiche und Fälle von ${
          k.hfs.map((h) => `Heft ${h.buchstabe}`).join(', ')
        }, des gemeinsamen Auftrags und des Kompetenznachweises sowie jeder Fall-Begriff unter «VERBRAUCHT» und «DEM KN VORBEHALTEN». Nenne den gewählten Lebensbereich ausdrücklich.`,
        'Der Fall aktiviert mindestens ein Spannungsfeld aus dem Trade-off-Raum — benannt, nicht aufgelöst. Beide Seiten bleiben begründbar.',
        'Vier Leitfragen mit fester Funktion: LF1 verstehen (Begriffe und Modell aus dem Lehrmittel), LF2 anwenden (auf den eigenen Fall), LF3 analysieren (Raster als Antwortfeld, danach ein Befund in zwei bis drei Sätzen), LF4 beurteilen (zwei Pole gegeneinander halten und entscheiden). Jede Leitfrage nennt in drei bis sieben Wörtern ohne Verb, welchen Baustein des Produkts sie liefert, und bekommt eine Scaffold-Spalte: zwei Schritte «So gehen Sie vor», zwei bis drei Satzanfänge, ein Satz «Ins Produkt».',
        'Pol-Typ von LF4: Modell ↔ eigener Fall, Position ↔ Gegenposition oder Recht ↔ Praxis. Ein Pol-Typ, der eine Quelle braucht, ist ausgeschlossen.',
        `Spur OHNE MEDIEN. LF3 arbeitet an einem Abschnitt des Lehrmittels aus den Lehrmittel-Ankern der Einheit${
          abschnitte.length ? ` — nach Möglichkeit nicht an einem, den die Hefte schon lesen (${abschnitte.join('; ')})` : ''
        }: Raster mit vier Spalten (die letzte heisst «→ Begriff»), vier Zeilen, die erste als ausgefüllte Beispielzeile. Zu LF4 gehört eine Denkhilfe als Tabelle mit zwei bis drei Spaltenköpfen und einem Hinweis.`,
        'Du darfst KEINE Medienquelle erfinden: keinen Artikel, keinen Radio- oder Fernsehbeitrag, kein Video, keinen Link, keine Studie, keine Statistik mit Herkunftsangabe, keinen QR-Code. Ein erzeugtes Heft kann keine geprüfte Quelle mitbringen.',
        'Du kennst den Wortlaut des Lehrmittels nicht. Zitiere es nicht und erfinde keine Seitenzahlen: Nenne nur Kapitel und Seiten, die im Konsistenz-Vertrag stehen. Alles, was am Buch zu prüfen ist (Abschnitt, Beispielzeile, Fachaussagen in LF1), führst du im letzten Abschnitt der Antwort einzeln auf.',
        `Ein Produkt mit genau fünf Schritten (01 bis 05, je ein kurzer Titel und ein Hinweis in der Sie-Form) und höchstens drei Abgaben. Der Produkttyp unterscheidet sich von den bereits vergebenen (siehe Material); nenne seinen Sprachmodus.`,
        'Genau zwei der vier KN-Kriterien als Feedback-Kriterien — eines aus Sprache und Kommunikation (SuK), eines aus Gesellschaft (Ges). Name und die Beschreibungen zu 0 bis 3 Punkten übernimmst du WÖRTLICH aus dem Material; neu formulierst du nur je einen Indikator «Woran sehe ich das in meinem Produkt?».',
        'Seite 6 nennt vier Methoden mit je einem Satz, wofür sie in diesem Heft dienen — bevorzugt Karten, die in den Heften schon vorkommen —, und beschreibt ein Beispiel des Produkts an einem ANDEREN, neutralen Fall (nicht der Fall von Heft C und kein verbrauchter).',
        'Begriffsnetz auf Seite 8: das gemeinsame Zentrum, vier Äste mit je zwei bis drei Begriffen, einer davon der Ast «gilt auch bei …». Jeder Begriff im Netz steht im Glossar des Hefts mit einer Erklärung in einem Satz. Übernimm Glossarbegriffe der Einheit, wo sie passen; neue Begriffe nur aus dem Stoff der Einheit.',
        'Seite 8 schliesst mit dem Quer-Check (zwei Fragen in der Ich-Form, die auf den Fall zurückführen) und «Das nehme ich mit» (drei kurze Zeilenanfänge).',
        'Umfang wie in den Heften: Situation 650 bis 900 Zeichen in der Ich-Perspektive, höchstens vier Zahlen in einer Tabelle, Leitfragen je höchstens 220 Zeichen. Seite 7 ist die leere Arbeitsfläche — beschreibe in einem Satz, was darauf entsteht.',
        STOFF_REGEL_V42,
      ]),
    ]
  },
  skelett: (): string[] => [
    '## Seite 1 — Herausforderung',
    '## Seite 2 — Wissensecke I (LF1 und LF2)',
    '## Seite 3 — Lehrmittel-Abschnitt und Raster (LF3)',
    '## Seite 4 — Wissensecke II (LF4 und Denkhilfe)',
    '## Seite 5 — Auftrag (Produkt, Schritte, Feedback-Kriterien)',
    '## Seite 6 — Methoden und Beispiel',
    '## Seite 7 — Arbeitsfläche',
    '## Seite 8 — Abschluss (Begriffsnetz, Glossar, Quer-Check, Das nehme ich mit)',
    '## Für die Lehrperson — am Lehrmittel zu prüfen',
  ],
}

const v42Differenzierung = {
  material: (k: WerkstattKontext, w: WerkstattWahl): string[] => {
    const h = hfAusKontext(k, w.hf)
    return h ? heftWerkzeuge(h) : []
  },
  aufgabe: (k: WerkstattKontext, w: WerkstattWahl): string[] => {
    const h = hfAusKontext(k, w.hf)
    const v = h?.v42
    const medien = v?.spur === 'mit_medien'
    const gruppe = w.zielgruppe ? ` (${w.zielgruppe})` : ''
    if (w.richtung !== 'erweiterung') {
      return [
        `Erstelle eine Stütze zu Heft ${h?.buchstabe ?? ''} für Lernende, die den Auftrag sonst nicht schaffen${gruppe}.`,
        '',
        'Verbindlich:',
        ...liste([
          'Situation, Leitfragen, Raster und Produkt bleiben unverändert. Gestützt wird der Weg dorthin, nicht das Ziel.',
          'Das Spannungsfeld wird NICHT aufgelöst. Eine Stütze, die den Entscheid vorwegnimmt, nimmt dem Heft seinen Sinn — die Lernenden wägen weiterhin selbst ab und begründen.',
          `Knüpfe an das an, was das Heft schon mitgibt — Scaffold-Spalte${v?.kasten?.typ === 'denkhilfe' ? ', Denkhilfe' : ''}${
            v?.beispielbild ? ', Beispielbild' : ''
          }${v?.raster?.beispielzeile.length ? ', Beispielzeile im Raster' : ''} —, statt eine zweite, konkurrierende Struktur zu erfinden. Sage zu jeder Hilfe, an welcher Seite des Hefts sie ansetzt.`,
          medien
            ? 'Spur mit Medien: Die Quelle wird weder ersetzt noch zusammengefasst noch nacherzählt — du kennst ihren Inhalt nicht. Gestützt wird der Zugang: Lesen, Sehen oder Hören in Etappen, worauf in welcher Etappe zu achten ist, wie eine Rasterzeile entsteht.'
            : 'Spur ohne Medien: Gestützt wird das Lesen des Lehrmittel-Abschnitts — in Etappen, mit einer Frage je Etappe. Du kennst den Wortlaut des Lehrmittels nicht; gib keine Inhalte daraus wieder und fülle keine weitere Rasterzeile aus.',
          'Ein einziges Teilbeispiel wird vorgemacht — an einem anderen Fall als dem des Hefts, damit es Muster zeigt und nicht Lösung.',
          FALL_REGEL_V42,
          'Benenne am Schluss ausdrücklich, was trotz Stütze selbst entschieden werden muss.',
          STOFF_REGEL_V42,
        ]),
      ]
    }
    return [
      `Erstelle einen Erweiterungsauftrag zu Heft ${h?.buchstabe ?? ''} für Lernende, die früh fertig sind${gruppe}.`,
      '',
      'Verbindlich:',
      ...liste([
        'Mehr Anspruch, nicht mehr Umfang: Die Erweiterung verlangt übertragen, bewerten oder die Gegenposition prüfen — nicht mehr Wörter derselben Sorte.',
        h?.scaffold100
          ? `Das Heft nennt bereits ein Plus: «${h.scaffold100}» Baue darauf auf, statt ein zweites daneben zu stellen.`
          : 'Das Heft nennt noch kein Plus für Schnelle — der Erweiterungsauftrag füllt genau diese Stelle (Seite 5).',
        h?.dekontext.frage
          ? `Nutze die Transferfrage des Hefts als Ausgangspunkt: «${h.dekontext.frage}»`
          : 'Setze bei der Übertragung auf ein anderes Feld an (siehe Transferfeld im Konsistenz-Vertrag).',
        'Der Auftrag bleibt beim Fall und beim Produkt des Hefts — er kommt hinzu, er ersetzt nicht.',
        'Erfinde keine Quelle: keinen Artikel, keinen Beitrag, keinen Link, keine Statistik mit Herkunftsangabe.',
        FALL_REGEL_V42,
        'Er muss ohne zusätzliche Betreuung durch die Lehrperson bearbeitbar sein.',
        'Gib an, woran erkennbar ist, dass die Erweiterung gelungen ist — als Ergänzung zu den zwei Feedback-Kriterien des Hefts, nicht als neues Raster.',
        STOFF_REGEL_V42,
      ]),
    ]
  },
}

const v42Sprachniveau = {
  material: (k: WerkstattKontext, w: WerkstattWahl): string[] => {
    const h = hfAusKontext(k, w.hf)
    const v = h?.v42
    if (!h || !v) return []
    const out = [...heftWerkzeuge(h)]
    if (h.produkt.beschreibung) out.push('', `PRODUKT IN EINEM SATZ: ${h.produkt.beschreibung}`)
    if (v.abschluss.quercheck.length) out.push('', 'QUER-CHECK (Seite 8):', ...liste(v.abschluss.quercheck))
    if (v.glossar.length) {
      out.push(
        '',
        'FACHBEGRIFFE, DIE ERHALTEN BLEIBEN MÜSSEN — mit der Erklärung aus dem Glossar des Hefts:',
        ...liste(v.glossar.map((g) => (g.definition ? `${g.begriff}: ${g.definition}` : g.begriff)))
      )
    }
    return out
  },
  aufgabe: (k: WerkstattKontext, w: WerkstattWahl): string[] => {
    const h = hfAusKontext(k, w.hf)
    const medien = h?.v42?.spur === 'mit_medien'
    return [
      `Schreibe die Texte von Heft ${h?.buchstabe ?? ''} auf Sprachniveau ${w.niveau} um${
        w.zielgruppe ? ` (${w.zielgruppe})` : ''
      }: Situation, die vier Leitfragen, den Auftrag zum Raster, die Schritte zum Produkt und den Quer-Check.`,
      '',
      'Verbindlich — der wichtigste Punkt zuerst:',
      ...liste([
        'Vereinfacht wird die SPRACHE, nicht die AUFGABE. Fall, Spannungsfeld, Produkt und Denkstufe jeder Leitfrage bleiben exakt gleich. Wer den neuen Text liest, muss denselben Entscheid treffen wie vorher.',
        'Die Fachbegriffe des Hefts bleiben erhalten. Sie sind der Lernstoff — sie werden bei der ersten Nennung im Text selbst erklärt, nicht ersetzt. Nimm dafür die Erklärungen aus dem Glossar.',
        'Kurze Hauptsätze. Höchstens ein Nebensatz pro Satz. Aktiv statt Passiv. Keine Nominalisierungen, wo ein Verb reicht.',
        'Zahlen und Beträge bleiben unverändert — sie tragen den Fall. Füge keine Namen, Berufe oder Orte hinzu: Die Persona ist neutral.',
        'Behalte die ICH-Perspektive im Situationstext und die Sie-Form in den Arbeitsaufträgen bei.',
        'Nicht umgeschrieben werden: die Spaltenköpfe des Rasters, die Namen der Feedback-Kriterien und ihre Beschreibungen je Punktzahl (sie gelten wörtlich auch im Kompetenznachweis)' +
          (medien ? ' sowie Titel und Angaben der Quelle. Die Quelle selbst liegt dir nicht vor — schreibe sie weder um noch fasse sie zusammen.' : '. Das Lehrmittel selbst liegt dir nicht vor — gib nichts daraus wieder.'),
        'Führe am Schluss die erhaltenen Fachbegriffe als Wortliste mit je einer einfachen Erklärung auf.',
        'Benenne ausdrücklich, was du bewusst NICHT vereinfacht hast und warum — damit die Lehrperson sieht, dass der Anspruch steht.',
      ]),
    ]
  },
  skelett: (): string[] => [
    '## Situationstext (angepasst)',
    '## Leitfragen (angepasst)',
    '## Auftrag zum Raster (angepasst)',
    '## Produkt und Schritte (angepasst)',
    '## Quer-Check (angepasst)',
    '## Wortliste',
    '## Was bewusst nicht vereinfacht wurde',
  ],
}

const v42KnUebung = {
  blockiert: (k: WerkstattKontext, w: WerkstattWahl): string | null => {
    if (w.richtung === 'repetition') {
      return k.hfs.length < 2 ? 'Für eine Repetition braucht es beide Hefte der Einheit.' : null
    }
    if (!k.hybrid) {
      return 'Diese Einheit hat noch keinen Kompetenznachweis mit Hybrid-Herausforderung, an dem sich ein Übungsfall orientieren könnte.'
    }
    if (!k.v42!.kn.fallBegriffe.length) {
      return 'Diese Einheit nennt keine Fall-Begriffe, die dem Kompetenznachweis vorbehalten sind — ohne sie lässt sich nicht sichern, dass ein Übungsfall die Prüfung nicht vorwegnimmt.'
    }
    return null
  },
  material: (k: WerkstattKontext, w: WerkstattWahl): string[] => {
    const v = k.v42!
    if (w.richtung === 'repetition') {
      const out: string[] = ['Die Hefte, über die repetiert wird (Situation und Leitfragen stehen im Konsistenz-Vertrag):', '']
      k.hfs.forEach((h, i) => {
        out.push(
          `Heft ${h.buchstabe} — ${h.titel}`,
          ...zeile('  Leistet', h.label),
          ...zeile('  Kernkonzept', h.kernkonzept),
          ...zeile('  Transferziel', h.dekontext.ziel),
          ...zeile('  Begriffe', (h.v42?.glossar ?? []).map((g) => g.begriff).join(' · '))
        )
        if (i < k.hfs.length - 1) out.push('')
      })
      if (k.konzeptProgression.length) {
        out.push(
          '',
          'KONZEPT-PROGRESSION DER EINHEIT:',
          ...liste(k.konzeptProgression.map((p) => `${p.position}. ${p.konzept}`))
        )
      }
      if (v.auftrag) {
        out.push(
          '',
          'Der gemeinsame Auftrag hat beide Hefte bereits einmal zusammengeführt (siehe Konsistenz-Vertrag). Die Repetition wiederholt ihn nicht.'
        )
      }
      return out
    }
    const h = k.hybrid
    if (!h) return []
    const out = [
      'DIE HYBRID-HERAUSFORDERUNG DES KOMPETENZNACHWEISES — sie ist das Muster, nicht die Vorlage zum Abschreiben:',
      '',
      `Titel: ${h.titel}`,
      '',
      h.text,
      '',
      ...zeile('Leitfrage', h.leitfrage),
    ]
    if (h.tradeOffs.length) out.push('', 'Aktivierte Spannungen:', ...liste(h.tradeOffs))
    out.push(
      '',
      'FORMVORGABEN DES KOMPETENZNACHWEISES:',
      ...liste(
        [
          h.maxWoerter ? `höchstens ${h.maxWoerter} Wörter` : '',
          h.perspektive ? `${h.perspektive}-Perspektive` : '',
          h.minTradeOffs ? `aktiviert mindestens ${h.minTradeOffs === 1 ? 'ein Spannungsfeld' : `${h.minTradeOffs} Spannungsfelder`}` : '',
          'führt beide Hefte in EINER Szene zusammen',
          'endet mit einer Leitfrage',
        ].filter(Boolean)
      )
    )
    if (k.knTypen.length) {
      out.push('', 'PRÜFUNGSFORMEN DIESER EINHEIT:', ...liste(k.knTypen.map((t) => `${t.label} (${t.typ})`)))
    }
    if (v.rubrik.length) {
      out.push('', 'DIE VIER KN-KRITERIEN IM WORTLAUT:', ...rubrikWortlaut(k))
    }
    return out
  },
  aufgabe: (k: WerkstattKontext, w: WerkstattWahl): string[] => {
    const v = k.v42!
    const gruppe = w.zielgruppe ? ` (${w.zielgruppe})` : ''
    const hefte = k.hfs.map((h) => `Heft ${h.buchstabe}`).join(' und ')
    if (w.richtung === 'repetition') {
      return [
        `Erstelle eine Repetition über ${hefte}, direkt vor dem Kompetenznachweis${gruppe}.`,
        '',
        'Verbindlich:',
        ...liste([
          `Kein neuer Stoff. Repetiert wird ausschliesslich, was in ${hefte} bereits vorkam.`,
          'Die Aufgaben verlangen verknüpfen, vergleichen, übertragen. Reine Abfragen (nenne, beschreibe, liste auf) sind ausgeschlossen: sie prüfen nicht, was der Kompetenznachweis verlangt.',
          'Mindestens eine Aufgabe hält beide Hefte gegeneinander und macht den gemeinsamen Kern sichtbar.',
          `Die Repetition endet auf dem Prinzip der Einheit und seinem Zentrum «${v.zentrum}» — nicht auf einer Liste von Begriffen.`,
          'Sie nimmt den Kompetenznachweis nicht vorweg: keiner der Fall-Begriffe unter «DEM KN VORBEHALTEN», kein Fall aus dessen Lebensbereich.',
          'Umfang: eine Lektion.',
          STOFF_REGEL_V42,
        ]),
      ]
    }
    return [
      `Erstelle einen Übungsfall, mit dem sich die Lernenden auf den Kompetenznachweis vorbereiten${gruppe}.`,
      '',
      'Verbindlich:',
      ...liste([
        'Der Übungsfall hat dieselbe Anatomie wie die Hybrid-Herausforderung oben — gleiche Länge, gleiche Perspektive, eine einzige Szene, endet auf einer Leitfrage, aktiviert ebenso viele Spannungen.',
        'Er ist ein ANDERER Fall. Übernimm weder Gegenstand noch Beteiligte noch Zahlen noch Szene aus der Hybrid-Herausforderung: Diese gehört dem Kompetenznachweis, und wer sie vorher übt, entwertet ihn.',
        `Gesperrt ist jeder Fall-Begriff unter «DEM KN VORBEHALTEN»${
          v.kn.fallBegriffe.length ? ` (${v.kn.fallBegriffe.join(', ')})` : ''
        } — auch als Nebensache, Vergleich oder Beispiel.`,
        `Der Fall liegt AUSSERHALB aller verbrauchten Lebensbereiche: nicht der von ${hefte}, nicht der des gemeinsamen Auftrags, nicht der des Kompetenznachweises. Nenne den gewählten Lebensbereich ausdrücklich.`,
        `Die Persona bleibt die neutrale der Einheit${v.personaNeutral ? ` (${v.personaNeutral})` : ''} — neu ist der Fall, nicht die Person.`,
        `Der Fall führt ${hefte} in einer Szene zusammen, so wie der echte Kompetenznachweis: Aus jedem Heft muss ein Element nötig sein, um ihn zu lösen.`,
        'Gib zu jeder Prüfungsform dieser Einheit Übungsaufgaben an, die dem Format der echten Prüfung entsprechen.',
        'Ergänze einen Selbstcheck, der die vier KN-Kriterien in die Ich-Form der Lernenden übersetzt. Die Namen der Kriterien bleiben wörtlich; bewertet wird mit 0 bis 3 Punkten je Kriterium.',
        'Erfinde keine Quelle: keinen Artikel, keinen Beitrag, keinen Link, keine Statistik mit Herkunftsangabe.',
        'Für die Lehrperson: benenne, woran sie im Übungsdurchgang sieht, wer für den Kompetenznachweis noch nicht bereit ist.',
        STOFF_REGEL_V42,
      ]),
    ]
  },
  skelett: (w: WerkstattWahl): string[] =>
    w.richtung === 'repetition'
      ? [
          '## Worum es geht',
          '## Rückblick auf die Hefte',
          '## Verknüpfungsaufgaben',
          '## Das Prinzip in einem Satz',
          '## Lösungshinweise für die Lehrperson',
        ]
      : [
          '## Übungsfall',
          '## Leitfrage',
          '## Aktivierte Spannungen',
          '## Übungsaufgaben nach Prüfungsform',
          '## Selbstcheck für Lernende',
          '## Hinweise für die Lehrperson',
        ],
}

function unique(list: string[]): string[] {
  return list.filter((x, i) => x && list.indexOf(x) === i)
}

// ---------------------------------------------------------------------------
// 1 — Vierte Herausforderung D
// ---------------------------------------------------------------------------

const herausforderungD: AuftragDef = {
  key: 'herausforderung_d',
  label: 'Vierte Herausforderung D',
  zweck:
    'Eine zusätzliche Herausforderung für ein anderes Berufsfeld — gleiches Prinzip, gleicher Trade-off-Raum, neue Persona.',
  brauchtHf: false,
  richtungen: [],
  niveauDefault: 'B1',
  zielgruppeLabel: 'Beruf oder Branche der neuen Persona',
  zielgruppeVorschlag: false,
  v42: {
    label: 'Weiteres Heft C',
    zweck:
      'Ein drittes Heft im selben Gerüst zum selben Prinzip — eigener Fall in einem unverbrauchten Lebensbereich, in der Spur ohne Medien.',
    zielgruppeLabel: 'Wunsch zum Fall oder Lebensbereich',
  },
  blockiert: (k) =>
    k.v42
      ? v42HeftC.blockiert(k)
      : k.hfs.length === 0 ? 'Diese Einheit hat noch keine Herausforderung, an der sich eine vierte orientieren könnte.' : null,
  material: (k) => {
    if (k.v42) return v42HeftC.material(k)
    const out = ['Die drei bestehenden Herausforderungen dieser Einheit:', '']
    k.hfs.forEach((h, i) => {
      out.push(...hfKurz(h))
      if (i < k.hfs.length - 1) out.push('')
    })
    if (k.hybrid) {
      out.push(
        '',
        'Der Kompetenznachweis führt sie später in einer Hybrid-Herausforderung zusammen:',
        `  ${k.hybrid.titel}`,
        ...zeile('  Leitfrage', k.hybrid.leitfrage)
      )
    }
    return out
  },
  aufgabe: (k, w) => {
    if (k.v42) return v42HeftC.aufgabe(k, w)
    const bloom = k.bloom.map((b) => `${b.lf} → ${b.stufe}`).join(', ')
    const lfAnzahl = k.hfs[0]?.leitfragen.length ?? 4
    const produkte = k.hfs.map((h) => h.produkt.format).filter(Boolean)
    const template = k.hfs[0]?.template ?? 'default_4page_v2'
    return [
      `Entwirf eine vierte Herausforderung D für diese Einheit${
        w.zielgruppe ? ` — für ${w.zielgruppe}` : ''
      }. Sie muss neben A, B und C gleichwertig bestehen können.`,
      '',
      'Verbindlich:',
      ...liste([
        'Sie trägt dasselbe Prinzip wie A/B/C (siehe Anker-Statement im Konsistenz-Vertrag) und führt dieselbe Kompetenz weiter.',
        'Sie aktiviert mindestens einen Trade-off aus dem Trade-off-Raum — benannt, nicht aufgelöst. Die Lernenden müssen entscheiden.',
        'Die Persona ist neu. Weder Beruf noch Ort dürfen aus den bereits verbrauchten stammen, und keiner der für den Kompetenznachweis reservierten darf vorweggenommen werden (beide Listen im Konsistenz-Vertrag).',
        `Der Bloom-Korridor der Leitfragen entspricht dem der Einheit${bloom ? ` (${bloom})` : ''}: einstieg beschreibend, danach entscheiden und begründen.`,
        `Gleiche Anatomie wie A/B/C: Situationstext in der ICH-Perspektive, ${lfAnzahl} Leitfragen, ein Handlungsprodukt, explizite Mehrdeutigkeit, Differenzierung, Beurteilungskriterien.`,
        produkte.length
          ? `Das Handlungsprodukt ist von derselben Gattung wie in A/B/C (${produkte.join(', ')}), aber nicht dasselbe Produkt.`
          : 'Das Handlungsprodukt ist ein Text- oder Gesprächsprodukt, das real vorkommt und beurteilbar ist.',
        'Die Herausforderung muss im Kompetenznachweis dieser Einheit aufgehen können — benenne am Schluss, welches Element sie dort beisteuert.',
        STOFF_REGEL,
      ]),
      '',
      template === 'default_4page_v3'
        ? 'Die Einheit nutzt den Bogen v3: Jede Leitfrage nennt zusätzlich, welchen Baustein des Handlungsprodukts sie liefert. Halte das durch.'
        : 'Die Einheit nutzt den Bogen v2. Halte dich an dessen Umfang und erfinde keine zusätzlichen Felder.',
    ]
  },
  skelett: (k) =>
    k.v42
      ? v42HeftC.skelett()
      : [
          '## Titel',
          '## Persona',
          '## Situationstext',
          '## Leitfragen',
          '## Handlungsprodukt',
          '## Mehrdeutigkeit',
          '## Differenzierung',
          '## Beurteilungskriterien',
          '## Anschluss an den Kompetenznachweis',
        ],
}

// ---------------------------------------------------------------------------
// 2 — Differenzierung
// ---------------------------------------------------------------------------

const differenzierung: AuftragDef = {
  key: 'differenzierung',
  label: 'Differenzierung',
  zweck:
    'Stütze für Lernende, die Mühe haben, oder ein Erweiterungsauftrag für Schnelle — zu einer bestehenden Herausforderung.',
  brauchtHf: true,
  richtungen: [
    {
      key: 'stuetze',
      label: 'Stütze (unter 70 %)',
      hinweis: 'Gleiche Aufgabe, gestützter Weg dorthin.',
    },
    {
      key: 'erweiterung',
      label: 'Erweiterung (100 %)',
      hinweis: 'Höhere Denkstufe, nicht mehr Umfang.',
    },
  ],
  niveauDefault: 'B1',
  zielgruppeLabel: 'Klasse oder Lerngruppe',
  zielgruppeVorschlag: true,
  v42: {
    zweck:
      'Stütze für Lernende, die Mühe haben, oder ein Erweiterungsauftrag für Schnelle — zu einem der zwei Hefte, in seiner Spur.',
  },
  blockiert: (k, w) => {
    const h = hfAusKontext(k, w.hf)
    if (k.v42 && !h) return 'Wählen Sie zuerst das Heft, zu dem die Differenzierung gehört.'
    if (k.v42 && h && !h.situationText && !h.leitfragen.length) return `Heft ${h.buchstabe} hat noch keinen Inhalt, an dem sich differenzieren liesse.`
    if (!h) return 'Wähle zuerst die Herausforderung, zu der die Differenzierung gehört.'
    if (!h.situationText && !h.leitfragen.length) return `Herausforderung ${h.buchstabe} hat noch keinen Inhalt, an dem sich differenzieren liesse.`
    return null
  },
  material: (k, w) => {
    const h = hfAusKontext(k, w.hf)
    if (!h) return []
    if (k.v42) return v42Differenzierung.material(k, w)
    return [...hfVoll(h), '', 'BEREITS VORHANDENE DIFFERENZIERUNG:', ...scaffoldingVorhanden(h)]
  },
  aufgabe: (k, w) => {
    if (k.v42) return v42Differenzierung.aufgabe(k, w)
    const h = hfAusKontext(k, w.hf)
    const stuetze = w.richtung !== 'erweiterung'
    if (stuetze) {
      return [
        `Erstelle eine Stütze zu Herausforderung ${h?.buchstabe ?? ''} für Lernende, die den Auftrag sonst nicht schaffen${
          w.zielgruppe ? ` (${w.zielgruppe})` : ''
        }.`,
        '',
        'Verbindlich:',
        ...liste([
          'Situation, Leitfragen und Handlungsprodukt bleiben unverändert. Gestützt wird der Weg dorthin, nicht das Ziel.',
          'Die Mehrdeutigkeit wird NICHT aufgelöst. Eine Stütze, die die Entscheidung vorwegnimmt, nimmt der Aufgabe ihren Sinn — die Lernenden müssen weiterhin selbst abwägen und begründen.',
          'Knüpfe an die bereits vorhandene Differenzierung an, statt eine zweite, konkurrierende Struktur zu erfinden.',
          'Arbeite mit dem, was sich bewährt hat: vorstrukturierte Teilschritte, Satzanfänge, eine ausgefüllte Beispielzeile, eine Tabelle mit Spaltenköpfen.',
          'Ein einziges Teilbeispiel wird vorgemacht — mit einem anderen Sujet als dem der Aufgabe, damit es Muster zeigt und nicht Lösung.',
          'Benenne am Schluss ausdrücklich, was trotz Stütze selbst entschieden werden muss.',
          STOFF_REGEL,
        ]),
      ]
    }
    return [
      `Erstelle einen Erweiterungsauftrag zu Herausforderung ${h?.buchstabe ?? ''} für Lernende, die früh fertig sind${
        w.zielgruppe ? ` (${w.zielgruppe})` : ''
      }.`,
      '',
      'Verbindlich:',
      ...liste([
        'Mehr Anspruch, nicht mehr Umfang: Die Erweiterung liegt eine Bloom-Stufe höher (K5 — übertragen, bewerten, Gegenposition prüfen), nicht bei mehr Wörtern derselben Sorte.',
        h?.dekontext.frage
          ? `Nutze die Transferfrage der Herausforderung als Ausgangspunkt: «${h.dekontext.frage}»`
          : 'Setze bei der Übertragung auf ein anderes Feld an (siehe Transferfeld im Konsistenz-Vertrag).',
        'Der Auftrag bleibt in derselben Situation und beim selben Produkt — er kommt hinzu, er ersetzt nicht.',
        'Er muss ohne zusätzliche Betreuung durch die Lehrperson bearbeitbar sein.',
        'Gib an, woran erkennbar ist, dass die Erweiterung gelungen ist — als Ergänzung zu den bestehenden Kriterien, nicht als neues Raster.',
        STOFF_REGEL,
      ]),
    ]
  },
  skelett: (_k, w) =>
    w.richtung === 'erweiterung'
      ? [
          '## Erweiterungsauftrag',
          '## Warum das anspruchsvoller ist',
          '## Woran die Lehrperson es erkennt',
        ]
      : [
          '## Wofür diese Hilfe gedacht ist',
          '## Vorstrukturierte Schritte',
          '## Satzanfänge',
          '## Ein vorgemachtes Teilbeispiel',
          '## Was trotzdem selbst entschieden werden muss',
        ],
}

// ---------------------------------------------------------------------------
// 3 — Sprachniveau-Anpassung
// ---------------------------------------------------------------------------

const sprachniveau: AuftragDef = {
  key: 'sprachniveau',
  label: 'Sprachniveau anpassen',
  zweck:
    'Situationstext, Leitfragen und Auftrag einer Herausforderung auf ein tieferes Sprachniveau bringen — ohne die Aufgabe zu vereinfachen.',
  brauchtHf: true,
  richtungen: [],
  niveauDefault: 'A2',
  zielgruppeLabel: 'Klasse oder Lerngruppe',
  zielgruppeVorschlag: true,
  v42: {
    zweck:
      'Situation, Leitfragen und Auftrag eines Hefts auf ein tieferes Sprachniveau bringen — ohne die Aufgabe zu vereinfachen.',
  },
  blockiert: (k, w) => {
    const h = hfAusKontext(k, w.hf)
    if (k.v42 && !h) return 'Wählen Sie zuerst das Heft, dessen Texte angepasst werden sollen.'
    if (k.v42 && h && !h.situationText) return `Heft ${h.buchstabe} hat keinen Situationstext zum Umschreiben.`
    if (!h) return 'Wähle zuerst die Herausforderung, deren Texte angepasst werden sollen.'
    if (!h.situationText) return `Herausforderung ${h.buchstabe} hat keinen Situationstext zum Umschreiben.`
    return null
  },
  material: (k, w) => {
    const h = hfAusKontext(k, w.hf)
    if (!h) return []
    if (k.v42) return v42Sprachniveau.material(k, w)
    const out = [...hfVoll(h)]
    if (k.konzepte.length) {
      out.push(
        '',
        'FACHBEGRIFFE, DIE ERHALTEN BLEIBEN MÜSSEN:',
        ...liste(k.konzepte)
      )
    }
    if (k.hatDossier) {
      out.push(
        '',
        'Hinweis: Diese Einheit hat ein eigenes Wissens-Dossier (EBA, kein Lehrmittel). Die Begriffe stammen von dort, nicht aus einem Buch.'
      )
    }
    return out
  },
  aufgabe: (k, w) => k.v42 ? v42Sprachniveau.aufgabe(k, w) : [
    `Schreibe Situationstext, Leitfragen und Produktauftrag der Herausforderung ${
      hfAusKontext(k, w.hf)?.buchstabe ?? ''
    } auf Sprachniveau ${w.niveau} um${w.zielgruppe ? ` (${w.zielgruppe})` : ''}.`,
    '',
    'Verbindlich — der wichtigste Punkt zuerst:',
    ...liste([
      'Vereinfacht wird die SPRACHE, nicht die AUFGABE. Persona, Situation, Trade-off, Handlungsprodukt und Denkstufe bleiben exakt gleich. Wer den neuen Text liest, muss dieselbe Entscheidung treffen wie vorher.',
      'Die Fachbegriffe der Einheit bleiben erhalten. Sie sind der Lernstoff — sie werden bei der ersten Nennung im Text selbst erklärt, nicht ersetzt.',
      'Kurze Hauptsätze. Höchstens ein Nebensatz pro Satz. Aktiv statt Passiv. Keine Nominalisierungen, wo ein Verb reicht.',
      'Konkrete Zahlen, Namen und Orte bleiben unverändert — sie tragen die Situation.',
      'Behalte die ICH-Perspektive im Situationstext und die Sie-Form in den Arbeitsaufträgen bei.',
      'Führe am Schluss die erhaltenen Fachbegriffe als Wortliste mit je einer einfachen Erklärung auf.',
      'Benenne ausdrücklich, was du bewusst NICHT vereinfacht hast und warum — damit die Lehrperson sieht, dass der Anspruch steht.',
    ]),
  ],
  skelett: (k) =>
    k.v42
      ? v42Sprachniveau.skelett()
      : [
          '## Situationstext (angepasst)',
          '## Leitfragen (angepasst)',
          '## Auftrag zum Handlungsprodukt (angepasst)',
          '## Wortliste',
          '## Was bewusst nicht vereinfacht wurde',
        ],
}

// ---------------------------------------------------------------------------
// 4 — KN-Übungsfall / Repetition
// ---------------------------------------------------------------------------

const knUebung: AuftragDef = {
  key: 'kn_uebung',
  label: 'Vorbereitung auf den Kompetenznachweis',
  zweck:
    'Ein Übungsfall nach dem Muster der Hybrid-Herausforderung — oder eine Repetition über A, B und C vor dem Kompetenznachweis.',
  brauchtHf: false,
  richtungen: [
    {
      key: 'uebungsfall',
      label: 'Übungsfall',
      hinweis: 'Gleiche Anatomie wie der KN, neuer Fall.',
    },
    {
      key: 'repetition',
      label: 'Repetition über A + B + C',
      hinweis: 'Vorhandenes verknüpfen, nichts Neues.',
    },
  ],
  niveauDefault: 'B1',
  zielgruppeLabel: 'Klasse oder Lerngruppe',
  zielgruppeVorschlag: true,
  v42: {
    zweck:
      'Ein Übungsfall nach dem Muster der Hybrid-Herausforderung, ausserhalb aller verbrauchten Lebensbereiche — oder eine Repetition über Heft A und B vor dem Kompetenznachweis.',
    richtungen: [
      { key: 'uebungsfall', label: 'Übungsfall', hinweis: 'Gleiche Anatomie wie der KN, neuer Fall.' },
      { key: 'repetition', label: 'Repetition über A + B', hinweis: 'Vorhandenes verknüpfen, nichts Neues.' },
    ],
  },
  blockiert: (k, w) => {
    if (k.v42) return v42KnUebung.blockiert(k, w)
    if (w.richtung === 'repetition') {
      return k.hfs.length < 2
        ? 'Für eine Repetition braucht es mindestens zwei Herausforderungen in der Einheit.'
        : null
    }
    return k.hybrid
      ? null
      : 'Diese Einheit hat noch keinen Kompetenznachweis mit Hybrid-Herausforderung, an dem sich ein Übungsfall orientieren könnte.'
  },
  material: (k, w) => {
    if (k.v42) return v42KnUebung.material(k, w)
    if (w.richtung === 'repetition') {
      const out: string[] = ['Die Herausforderungen, über die repetiert wird:', '']
      k.hfs.forEach((h, i) => {
        out.push(...hfKurz(h))
        if (h.dekontext.ziel) out.push(`  Transferziel: ${h.dekontext.ziel}`)
        if (i < k.hfs.length - 1) out.push('')
      })
      if (k.konzeptProgression.length) {
        out.push(
          '',
          'KONZEPT-PROGRESSION DER EINHEIT:',
          ...liste(k.konzeptProgression.map((p) => `${p.position}. ${p.konzept}${p.hf ? ` (${p.hf})` : ''}`))
        )
      }
      if (k.dekontextAufgabe.auftrag) {
        out.push('', 'TRANSFER-AUFGABE DER EINHEIT:', `  ${k.dekontextAufgabe.auftrag}`)
      }
      return out
    }
    const h = k.hybrid
    if (!h) return []
    const out = [
      'DIE HYBRID-HERAUSFORDERUNG DES KOMPETENZNACHWEISES — sie ist das Muster, nicht die Vorlage zum Abschreiben:',
      '',
      `Titel: ${h.titel}`,
      '',
      h.text,
      '',
      ...zeile('Leitfrage', h.leitfrage),
    ]
    if (h.tradeOffs.length) out.push('', 'Aktivierte Spannungen:', ...liste(h.tradeOffs))
    out.push(
      '',
      'FORMVORGABEN DES KOMPETENZNACHWEISES:',
      ...liste(
        [
          h.maxWoerter ? `höchstens ${h.maxWoerter} Wörter` : '',
          h.perspektive ? `${h.perspektive}-Perspektive` : '',
          h.minTradeOffs ? `mindestens ${h.minTradeOffs} aktivierte Trade-offs` : '',
          'endet mit einer Leitfrage',
        ].filter(Boolean)
      )
    )
    if (k.knTypen.length) {
      out.push('', 'PRÜFUNGSFORMEN DIESER EINHEIT:', ...liste(k.knTypen.map((t) => `${t.label} (${t.typ})`)))
    }
    return out
  },
  aufgabe: (k, w) => {
    if (k.v42) return v42KnUebung.aufgabe(k, w)
    if (w.richtung === 'repetition') {
      return [
        `Erstelle eine Repetition über die Herausforderungen dieser Einheit, direkt vor dem Kompetenznachweis${
          w.zielgruppe ? ` (${w.zielgruppe})` : ''
        }.`,
        '',
        'Verbindlich:',
        ...liste([
          'Kein neuer Stoff. Repetiert wird ausschliesslich, was in A, B und C bereits vorkam.',
          'Die Aufgaben liegen auf K3/K4 — verknüpfen, vergleichen, übertragen. Reine Abfragen (nenne, beschreibe, liste auf) sind ausgeschlossen: sie prüfen nicht, was der Kompetenznachweis verlangt.',
          'Mindestens eine Aufgabe muss zwei Herausforderungen gegeneinander halten und den gemeinsamen Kern sichtbar machen.',
          'Die Repetition endet auf dem Prinzip der Einheit — nicht auf einer Liste von Begriffen.',
          'Umfang: eine Lektion.',
          STOFF_REGEL,
        ]),
      ]
    }
    return [
      `Erstelle einen Übungsfall, mit dem sich die Lernenden auf den Kompetenznachweis vorbereiten${
        w.zielgruppe ? ` (${w.zielgruppe})` : ''
      }.`,
      '',
      'Verbindlich:',
      ...liste([
        'Der Übungsfall hat dieselbe Anatomie wie die Hybrid-Herausforderung oben — gleiche Länge, gleiche Perspektive, endet auf einer Leitfrage, aktiviert ebenso viele Spannungen.',
        'Er ist ein ANDERER Fall. Übernimm weder Persona noch Ort noch Szene aus der Hybrid-Herausforderung: Diese gehört dem Kompetenznachweis, und wer sie vorher übt, entwertet ihn.',
        'Auch die für den Kompetenznachweis reservierten Personas sind gesperrt (Liste im Konsistenz-Vertrag) — ebenso die bereits in A/B/C verbrauchten.',
        'Der Fall muss dieselben Elemente aus A, B und C zusammenführen wie der echte Kompetenznachweis.',
        'Gib zu jeder Prüfungsform dieser Einheit Übungsaufgaben an, die dem Format der echten Prüfung entsprechen.',
        'Ergänze einen Selbstcheck, der die Kriterien des Beurteilungsrasters in die Du-Form der Lernenden übersetzt.',
        'Für die Lehrperson: benenne, woran sie im Übungsdurchgang sieht, wer für den Kompetenznachweis noch nicht bereit ist.',
        STOFF_REGEL,
      ]),
    ]
  },
  skelett: (k, w) =>
    k.v42
      ? v42KnUebung.skelett(w)
      : w.richtung === 'repetition'
      ? [
          '## Worum es geht',
          '## Rückblick auf die Herausforderungen',
          '## Verknüpfungsaufgaben',
          '## Das Prinzip in einem Satz',
          '## Lösungshinweise für die Lehrperson',
        ]
      : [
          '## Übungsfall',
          '## Leitfrage',
          '## Aktivierte Spannungen',
          '## Übungsaufgaben nach Prüfungsform',
          '## Selbstcheck für Lernende',
          '## Hinweise für die Lehrperson',
        ],
}

export const AUFTRAEGE: AuftragDef[] = [herausforderungD, differenzierung, sprachniveau, knUebung]

export function auftragDef(key: string): AuftragDef | undefined {
  return AUFTRAEGE.find((a) => a.key === key)
}

/** Startwahl für die Oberfläche — erster Auftrag, erste Herausforderung, dessen Default-Niveau. */
export function defaultWahl(k: WerkstattKontext): WerkstattWahl {
  const def = AUFTRAEGE[0]
  return {
    auftrag: def.key,
    hf: k.hfs[0]?.buchstabe ?? null,
    richtung: def.richtungen[0]?.key ?? null,
    niveau: def.niveauDefault,
    zielgruppe: '',
  }
}
