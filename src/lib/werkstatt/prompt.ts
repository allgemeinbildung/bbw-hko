// Werkstatt — aus Einheit + Auftrag wird ein Prompt.
//
// Bewusst eine reine Funktion: sie bekommt Kontext und Wahl, sie gibt einen String
// zurück, sie fasst nichts an. Die Seite kümmert sich um Zwischenablage und Download.
// Soll der Prompt später einmal serverseitig an ein Modell gehen, konsumiert dieser
// Aufruf denselben String — an dieser Stelle ändert sich dann nichts.
//
// Der Aufbau ist für alle Aufträge gleich:
//
//   ROLLE                  wer schreibt, für wen
//   EINHEIT                wo im Lehrplan wir sind
//   KONSISTENZ-VERTRAG     was das Ergebnis nicht verletzen darf   ← der eigentliche Punkt
//   MATERIAL AUS DER EINHEIT   was zitiert werden darf             ← pro Auftrag
//   DEINE AUFGABE          was zu tun ist                          ← pro Auftrag
//   AUSGABEFORMAT          in welcher Form die Antwort kommt       ← pro Auftrag
//   SPRACHE UND STIL       die Hausregeln
//
// Der Konsistenz-Vertrag ist der Grund, warum sich das Ergebnis von dem unterscheidet,
// was dieselbe Frage in einem leeren Chatfenster ergäbe: Er trägt Prinzip, Trade-off-
// Raum, Bloom-Korridor, verbrauchte Personas und Beurteilungsmassstab der Einheit als
// Auflagen — nicht als Hintergrundinformation.

import type { WerkstattKontext, WerkstattHf } from './kontext'
import { POL_TYP_LABEL, SPUR_LABEL } from './kontext'
import type { WerkstattWahl } from './auftraege'
import { auftragDef, auftragAnzeige, NIVEAU_LABEL } from './auftraege'

function block(titel: string, zeilen: string[]): string[] {
  const inhalt = zeilen.filter((z) => z !== undefined && z !== null)
  if (!inhalt.some((z) => z.trim())) return []
  return [titel, ...inhalt, '']
}

const liste = (items: string[]): string[] => items.filter(Boolean).map((x) => `  - ${x}`)

function konsistenzVertrag(k: WerkstattKontext): string[] {
  const out: string[] = []

  if (k.kompetenzversprechen) {
    out.push('KOMPETENZVERSPRECHEN — das Versprechen, das diese Einheit einlöst:', `  ${k.kompetenzversprechen}`, '')
  }
  if (k.ankerStatement) {
    out.push(
      'PRINZIP — der rote Faden, den jedes Material dieser Einheit tragen muss:',
      `  ${k.ankerStatement}`,
      ...(k.transferfeld ? [`  Transferfeld: ${k.transferfeld}`] : []),
      ''
    )
  }
  if (k.mehrdeutigkeitVerbindlich || k.tradeOffRaum.length) {
    out.push('MEHRDEUTIGKEIT — verbindlich, nicht optional:')
    if (k.mehrdeutigkeitVerbindlich) out.push(`  ${k.mehrdeutigkeitVerbindlich}`)
    if (k.tradeOffRaum.length) {
      out.push('  Der Trade-off-Raum dieser Einheit:', ...k.tradeOffRaum.map((t) => `    - ${t}`))
    }
    out.push(
      '  Ein Material, das die Spannung auflöst oder gar nicht erst aufmacht, gehört nicht in diese Einheit.',
      ''
    )
  }
  if (k.bloom.length) {
    out.push(
      'BLOOM-KORRIDOR — die Denkstufen, auf denen diese Einheit arbeitet:',
      ...liste(k.bloom.map((b) => `${b.lf}: ${b.stufe}`)),
      '  Unterhalb dieses Korridors zu bleiben (nenne, beschreibe, liste auf) verfehlt die Einheit.',
      ''
    )
  }
  if (k.aspekte.length) {
    out.push(
      'GESELLSCHAFTLICHE ASPEKTE mit ihrer Progressionsstufe in dieser Einheit:',
      ...liste(k.aspekte.map((x) => `${x.aspekt}: ${x.r}${progressionsHinweis(x.r)}`)),
      ''
    )
  }
  if (k.zirkularitaet.r2 || k.zirkularitaet.r3) {
    out.push(
      'ZIRKULARITÄT — was später auf dieser Einheit aufbaut, darf hier nicht vorweggenommen werden:',
      ...liste([k.zirkularitaet.r2 && `R2: ${k.zirkularitaet.r2}`, k.zirkularitaet.r3 && `R3: ${k.zirkularitaet.r3}`].filter(Boolean) as string[]),
      ''
    )
  }
  if (k.personaVerbraucht.berufe.length || k.personaVerbraucht.orte.length) {
    out.push('BEREITS VERBRAUCHTE PERSONAS — nicht wiederverwenden:')
    if (k.personaVerbraucht.berufe.length) out.push(`  Berufe: ${k.personaVerbraucht.berufe.join(' · ')}`)
    if (k.personaVerbraucht.orte.length) out.push(`  Orte: ${k.personaVerbraucht.orte.join(' · ')}`)
    out.push('')
  }
  if (k.personaKnReserviert.berufe.length || k.personaKnReserviert.orte.length) {
    out.push('FÜR DEN KOMPETENZNACHWEIS RESERVIERT — gesperrt, damit die Prüfung neu bleibt:')
    if (k.personaKnReserviert.berufe.length) out.push(`  Berufe: ${k.personaKnReserviert.berufe.join(' · ')}`)
    if (k.personaKnReserviert.orte.length) out.push(`  Orte: ${k.personaKnReserviert.orte.join(' · ')}`)
    out.push('')
  }
  if (k.rubrikKriterien.length) {
    out.push(
      'BEURTEILUNGSMASSSTAB der Einheit (SuK = Sprache und Kommunikation, Ges = Gesellschaft):',
      ...liste(k.rubrikKriterien.map((x) => `${x.name} [${x.dimension}]`)),
      '  Was du erzeugst, muss an diesen Kriterien beurteilbar bleiben.',
      ''
    )
  }
  if (k.konzepte.length) {
    out.push('KONZEPTE, die in dieser Einheit vorkommen:', `  ${k.konzepte.join(' · ')}`, '')
  }
  if (k.kapitel.length) {
    out.push('LEHRMITTEL-ANKER der Einheit:', ...liste(k.kapitel), '')
  }
  return out
}

// ---------------------------------------------------------------------------
// Heft v4.2 (ENTSCHEIDE E29) — derselbe Rahmen, ein anderer Vertrag.
//
// Statt drei Herausforderungen mit je eigener Persona: zwei Hefte in einer Spur, eine
// neutrale Persona, ein gemeinsamer Auftrag. Verbraucht werden darum nicht Berufe und
// Orte, sondern Fälle und Lebensbereiche; dem Kompetenznachweis vorbehalten sind seine
// Fall-Begriffe. Die Hefte stehen ganz im Vertrag — jeder Auftrag muss an ihnen
// vorbeikommen, nicht nur der, der an einem Heft arbeitet.
// ---------------------------------------------------------------------------

const spurName = (key: string): string => `«${SPUR_LABEL[key] ?? key}»`

function heftImVertrag(h: WerkstattHf): string[] {
  const v = h.v42
  if (!v) return []
  const out: string[] = [`HEFT ${h.buchstabe} — ${h.titel} (Spur ${spurName(v.spur)})`]
  if (h.label) out.push(`  Leistet: ${h.label}`)
  if (v.konfliktart) out.push(`  Konfliktart: ${v.konfliktart}`)
  if (h.kompetenzen.length) {
    out.push('  Kompetenzen:', ...h.kompetenzen.map((x) => `    - ${x.nr}${x.text ? `: ${x.text}` : ''}`))
  }
  if (h.sprachmodi.length) out.push(`  Sprachmodi: ${h.sprachmodi.join(' · ')}`)
  if (h.sk.length) out.push(`  Schlüsselkompetenzen: ${h.sk.map((n) => `SK ${n}`).join(' · ')}`)
  if (h.situationText) out.push('  Situation:', `    ${h.situationText}`)
  if (h.zahlen.length) out.push('  Zahlen:', ...h.zahlen.map((z) => `    - ${z.label}: ${z.wert}`))
  if (h.leitfrage) out.push(`  Leitfrage: ${h.leitfrage}`)
  if (h.tradeOff) out.push(`  Spannungsfeld: ${h.tradeOff}${h.tradeOffHint ? ` — ${h.tradeOffHint}` : ''}`)
  if (v.leitfragen.length) {
    out.push('  Die vier Leitfragen:')
    for (const l of v.leitfragen) {
      const marken = [l.bloom, l.polTyp ? `Pol-Typ ${POL_TYP_LABEL[l.polTyp] ?? l.polTyp}` : ''].filter(Boolean).join(', ')
      out.push(`    LF${l.nr}${marken ? ` (${marken})` : ''}: ${l.text}`)
      if (l.liefert) out.push(`      liefert: ${l.liefert}`)
    }
  }
  if (v.quelle) {
    const angaben = [v.quelle.herausgeber, v.quelle.datum].filter(Boolean).join(', ')
    out.push(
      `  Quelle zu LF3: ${v.quelle.titel}${angaben ? ` — ${angaben}` : ''}${
        v.quelle.ausschnitt ? ` · Ausschnitt: ${v.quelle.ausschnitt}` : ''
      }`,
      '    Dir liegen nur diese Angaben vor, nicht der Inhalt der Quelle.'
    )
  } else if (v.raster?.abschnitt) {
    out.push(`  Lehrmittel-Abschnitt zu LF3: ${v.raster.abschnitt}`)
  }
  const produkt = [h.produkt.titel, h.produkt.format].filter(Boolean).join(' — ')
  if (produkt) out.push(`  Produkt: ${produkt}`)
  if (h.produkt.schritte.length) {
    out.push('  Schritte:', ...h.produkt.schritte.map((x) => `    - ${x.label}${x.hint ? `: ${x.hint}` : ''}`))
  }
  if (v.feedbackKriterien.length) {
    out.push(
      '  Feedback-Kriterien (zwei der vier KN-Kriterien):',
      ...v.feedbackKriterien.map(
        (f) => `    - ${f.name} [${f.dimension}]${f.indikator ? ` — im Produkt sichtbar an: ${f.indikator}` : ''}`
      )
    )
  }
  if (v.glossar.length) out.push(`  Glossarbegriffe: ${v.glossar.map((g) => g.begriff).join(' · ')}`)
  return out
}

function konsistenzVertragV42(k: WerkstattKontext): string[] {
  const v = k.v42
  if (!v) return []
  const out: string[] = []

  if (k.kompetenzversprechen) {
    out.push('KOMPETENZVERSPRECHEN — das Versprechen, das diese Einheit einlöst:', `  ${k.kompetenzversprechen}`, '')
  }
  if (k.ankerStatement) {
    out.push(
      'PRINZIP — der rote Faden, den jedes Material dieser Einheit tragen muss:',
      `  ${k.ankerStatement}`,
      ...(k.transferfeld ? [`  Transferfeld: ${k.transferfeld}`] : []),
      ...(v.zentrum ? [`  Gemeinsames Zentrum im Begriffsnetz beider Hefte: «${v.zentrum}»`] : []),
      ''
    )
  }
  if (k.mehrdeutigkeitVerbindlich || k.tradeOffRaum.length) {
    out.push('MEHRDEUTIGKEIT — verbindlich, nicht optional:')
    if (k.mehrdeutigkeitVerbindlich) out.push(`  ${k.mehrdeutigkeitVerbindlich}`)
    if (k.tradeOffRaum.length) {
      out.push('  Der Trade-off-Raum dieser Einheit:', ...k.tradeOffRaum.map((t) => `    - ${t}`))
    }
    out.push(
      '  Ein Material, das die Spannung auflöst oder gar nicht erst aufmacht, gehört nicht in diese Einheit.',
      ''
    )
  }
  if (k.bloom.length) {
    out.push(
      'BLOOM-ZIELPROFIL — die Denkstufen der vier Leitfragen, in jedem Heft gleich:',
      ...liste(k.bloom.map((b) => `${b.lf}: ${b.stufe}`)),
      '  Unterhalb dieses Korridors zu bleiben (nenne, beschreibe, liste auf) verfehlt die Einheit.',
      ''
    )
  }
  if (k.aspekte.length) {
    out.push(
      'GESELLSCHAFTLICHE ASPEKTE mit ihrer Progressionsstufe in dieser Einheit:',
      ...liste(k.aspekte.map((x) => `${x.aspekt}: ${x.r}${progressionsHinweis(x.r)}`)),
      ''
    )
  }
  // Ein blosser Strich («—») heisst in den Daten «nichts vorgesehen» und ist keine Auflage.
  const spaeter = [
    ['R2', k.zirkularitaet.r2],
    ['R3', k.zirkularitaet.r3],
  ].filter(([, text]) => text && !/^[—–-]+$/.test(text))
  if (spaeter.length) {
    out.push(
      'ZIRKULARITÄT — was später auf dieser Einheit aufbaut, darf hier nicht vorweggenommen werden:',
      ...liste(spaeter.map(([r, text]) => `${r}: ${text}`)),
      ''
    )
  }

  out.push(
    `SPUR — diese Fassung der Einheit läuft in der Spur ${spurName(v.spur)}:`,
    v.spur === 'mit_medien'
      ? '  LF3 arbeitet an einer geprüften Quelle (Raster als Antwortfeld), Seite 4 bietet eine freiwillige Vertiefung.'
      : '  LF3 arbeitet an einem Abschnitt des Lehrmittels (Raster mit ausgefüllter Beispielzeile), Seite 4 bietet eine Denkhilfe zu LF4.',
    ...v.einspurig.map((e) =>
      e.spur === v.spur
        ? `  Heft ${e.heft} gibt es nur in der Spur ${spurName(e.spur)}.`
        : `  Heft ${e.heft} gibt es nur in der Spur ${spurName(e.spur)} — es steht darum unten in dieser Spur, auch wenn die Einheit sonst ${spurName(v.spur)} läuft.`
    ),
    '  Situation, LF1, LF2, Produkt und Kriterien eines Hefts sind in beiden Spuren gleich.',
    ''
  )

  const hefte = k.hfs.filter((h) => h.v42)
  if (hefte.length) {
    out.push('DIE HEFTE DER EINHEIT — was sie festlegen, gilt für jedes weitere Material:', '')
    for (const h of hefte) out.push(...heftImVertrag(h), '')
  }

  if (v.auftrag) {
    const g = v.auftrag
    out.push(
      'GEMEINSAMER AUFTRAG — führt beide Hefte zusammen; sein Fall und sein Lebensbereich sind verbraucht:',
      `  Titel: ${g.titel}`,
      ...(g.lebensbereich ? [`  Lebensbereich: ${g.lebensbereich}`] : []),
      ...(g.situation ? ['  Situation:', `    ${g.situation}`] : []),
      ...(g.leitfrage ? [`  Leitfrage: ${g.leitfrage}`] : []),
      ...(g.tradeOff ? [`  Spannungsfeld: ${g.tradeOff}`] : []),
      ...(g.sprachmodi.length ? [`  Sprachmodi: ${g.sprachmodi.join(' · ')}`] : []),
      ...(g.produkte.length ? ['  Produkte:', ...g.produkte.map((x) => `    - ${x}`)] : []),
      ...(g.kontextAusschluss.length
        ? ['  Was der Auftrag selbst ausschliesst:', ...g.kontextAusschluss.map((x) => `    - ${x}`)]
        : []),
      ''
    )
  }

  if (v.verbraucht.length) {
    out.push(
      'VERBRAUCHT — Fälle und Lebensbereiche, die kein weiteres Material wiederverwenden darf:',
      ...v.verbraucht.map((x) => {
        const teile = [
          x.lebensbereich ? `Lebensbereich ${x.lebensbereich}` : 'Lebensbereich: der seiner Situation (siehe oben)',
          x.begriffe ? `Fall-Begriffe: ${x.begriffe}` : '',
        ].filter(Boolean)
        return `  - ${x.wo}${x.titel ? ` «${x.titel}»` : ''} — ${teile.join(' · ')}`
      }),
      '  - Kompetenznachweis — sein Lebensbereich ist ebenfalls verbraucht (siehe «DEM KN VORBEHALTEN»).',
      ''
    )
  }
  if (v.personaNeutral) {
    out.push(
      'PERSONA — neutral und in der ganzen Einheit dieselbe:',
      `  ${v.personaNeutral}`,
      '  Neu ist immer der Fall, nie die Person: kein Vorname, kein erfundener Beruf, kein erfundener Betrieb oder Ort.',
      ''
    )
  }
  if (v.kn.fallBegriffe.length || v.kn.titel) {
    out.push(
      'DEM KN VORBEHALTEN — gesperrt, damit der Kompetenznachweis ein neuer Fall bleibt:',
      ...(v.kn.titel ? [`  Szene des Kompetenznachweises: «${v.kn.titel}»`] : []),
      ...(v.kn.fallBegriffe.length ? [`  Fall-Begriffe: ${v.kn.fallBegriffe.join(' · ')}`] : []),
      '  Keiner dieser Begriffe und nichts aus dieser Szene darf in einem Material vorkommen — auch nicht als Beispiel oder Vergleich.',
      ''
    )
  }
  if (k.rubrikKriterien.length) {
    out.push(
      'BEURTEILUNGSMASSSTAB der Einheit (SuK = Sprache und Kommunikation, Ges = Gesellschaft):',
      ...liste(k.rubrikKriterien.map((x) => `${x.name} [${x.dimension}]`)),
      ...(v.kriterienVerteilung.length
        ? [`  Verteilung: ${v.kriterienVerteilung.map((x) => `Heft ${x.heft} übt ${x.kriterien.join(' und ')}`).join('; ')}.`]
        : []),
      '  Je Kriterium gibt es 0 bis 3 Punkte. Was du erzeugst, muss an diesen Kriterien beurteilbar bleiben.',
      ''
    )
  }
  if (k.konzepte.length) {
    out.push('KONZEPTE, die in dieser Einheit vorkommen:', `  ${k.konzepte.join(' · ')}`, '')
  }
  if (k.kapitel.length) {
    out.push('LEHRMITTEL-ANKER der Einheit:', ...liste(k.kapitel), '')
  }
  return out
}

function progressionsHinweis(r: string): string {
  if (r === 'R1') return ' — hier erstmals eingeführt, kein Vorwissen voraussetzen'
  if (r === 'R2') return ' — Grundbegriffe bekannt, auf Anwendungsebene vertiefen'
  if (r === 'R3') return ' — vertraut, auf Analyse- und Transferebene arbeiten'
  return ''
}

export function werkstattPrompt(k: WerkstattKontext, w: WerkstattWahl): string {
  const def = auftragDef(w.auftrag)
  if (!def) return ''

  // v4.2: Die Richtungen heissen dort teils anders («Repetition über A + B»). Für jede
  // Bestandseinheit liefert `auftragAnzeige` genau `def.richtungen`.
  const richtung = auftragAnzeige(def, k).richtungen.find((r) => r.key === w.richtung)
  const zeilen: string[] = [
    ...block('ROLLE', [
      'Du bist Lehrperson im Allgemeinbildenden Unterricht (ABU) an einer Berufsfachschule in der Schweiz.',
      `Du arbeitest an einer bestehenden Unterrichtseinheit weiter und erzeugst Material, das in diese Einheit passt — nicht daneben.`,
    ]),

    ...block('EINHEIT', [
      `Titel: ${k.einheitTitel}`,
      k.modul ? `Lebensbezug ${k.modul}${k.modulTitel ? `: ${k.modulTitel}` : ''}` : '',
      `Lehrgang: ${k.lehrgangLabel}${
        k.weitereLehrgaenge.length ? ` (gilt auch für ${k.weitereLehrgaenge.join(' und ')})` : ''
      }`,
      k.themaNr ? `Thema: T${k.themaNr}` : '',
      k.kompetenzen.length
        ? `Abgedeckte Kompetenzen:\n${k.kompetenzen.map((x) => `  - ${x.nr}${x.text ? `: ${x.text}` : ''}`).join('\n')}`
        : '',
      k.istEba ? 'Bildungstyp: EBA (2-jährige Grundbildung). Es gibt kein Lehrmittel — das Wissen kommt aus dem Dossier der Einheit.' : '',
      ...(k.v42
        ? [
            `Format: zwei Hefte (${k.hfs.map((h) => h.buchstabe).join(' und ')}) mit je acht Seiten, ein gemeinsamer Auftrag, ein Kompetenznachweis.`,
            `Spur: ${spurName(k.v42.spur)}`,
          ]
        : []),
    ]),

    ...block(
      'KONSISTENZ-VERTRAG — diese Auflagen sind nicht verhandelbar',
      k.v42 ? konsistenzVertragV42(k) : konsistenzVertrag(k)
    ),

    ...block('MATERIAL AUS DER EINHEIT', def.material(k, w)),

    ...block(
      `DEINE AUFGABE${richtung ? ` — ${richtung.label}` : ''}`,
      def.aufgabe(k, w)
    ),

    ...block('AUSGABEFORMAT', [
      'Antworte ausschliesslich in Markdown, mit genau diesen Überschriften, in dieser Reihenfolge:',
      '',
      ...def.skelett(k, w),
      '',
      'Füge keine weiteren Überschriften hinzu und lasse keine weg. Kein Vorwort, keine Nachbemerkung, keine Rückfragen.',
    ]),

    ...block('SPRACHE UND STIL', [
      `Sprachniveau der Materialien für die Lernenden: ${NIVEAU_LABEL[w.niveau]}.`,
      'Schweizer Hochdeutsch, kein Eszett. Schweizer Kontext (CHF, AHV, Lehrbetrieb, Berufsbildner/in).',
      'Gendergerechte Sprache, wie sie die Einheit verwendet: Lernende, Berufsbildner/in.',
      'Situationstexte stehen in der ICH-Perspektive der lernenden Person, Arbeitsaufträge in der Sie-Form.',
      'Keine Floskeln, keine Motivationssätze, keine Emojis. Schreibe so nüchtern wie die Einheit selbst.',
      ...(k.v42
        ? [
            'Wortwahl der Einheit: «Heft A», «Heft B» (nicht «Herausforderung A»), «Quelle» (ohne Zusatz), «Punkte» für die Bewertung (0 bis 3 Punkte je Kriterium), «Kompetenznachweis».',
          ]
        : []),
    ]),
  ]

  return zeilen.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/** Dateiname für den .txt-Download. */
export function promptDateiname(k: WerkstattKontext, w: WerkstattWahl): string {
  // v4.2: Der Prompt hängt an der Spur — sie gehört in den Namen, sonst überschreibt die
  // zweite Fassung die erste im Download-Ordner.
  const teile = [
    k.slug,
    ...(k.v42 ? [k.v42.spur] : []),
    w.auftrag,
    w.hf && auftragDef(w.auftrag)?.brauchtHf ? `hf-${w.hf}` : '',
    w.richtung ?? '',
  ]
  return `${teile.filter(Boolean).join('_')}_prompt.txt`.replace(/[^a-zA-Z0-9._-]/g, '-')
}
