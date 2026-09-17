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
import { hfAusKontext } from './kontext'

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
  blockiert: (k) =>
    k.hfs.length === 0 ? 'Diese Einheit hat noch keine Herausforderung, an der sich eine vierte orientieren könnte.' : null,
  material: (k) => {
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
  skelett: () => [
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
  blockiert: (k, w) => {
    const h = hfAusKontext(k, w.hf)
    if (!h) return 'Wähle zuerst die Herausforderung, zu der die Differenzierung gehört.'
    if (!h.situationText && !h.leitfragen.length) return `Herausforderung ${h.buchstabe} hat noch keinen Inhalt, an dem sich differenzieren liesse.`
    return null
  },
  material: (k, w) => {
    const h = hfAusKontext(k, w.hf)
    if (!h) return []
    return [...hfVoll(h), '', 'BEREITS VORHANDENE DIFFERENZIERUNG:', ...scaffoldingVorhanden(h)]
  },
  aufgabe: (k, w) => {
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
  blockiert: (k, w) => {
    const h = hfAusKontext(k, w.hf)
    if (!h) return 'Wähle zuerst die Herausforderung, deren Texte angepasst werden sollen.'
    if (!h.situationText) return `Herausforderung ${h.buchstabe} hat keinen Situationstext zum Umschreiben.`
    return null
  },
  material: (k, w) => {
    const h = hfAusKontext(k, w.hf)
    if (!h) return []
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
  aufgabe: (k, w) => [
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
  skelett: () => [
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
  blockiert: (k, w) => {
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
  skelett: (_k, w) =>
    w.richtung === 'repetition'
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
