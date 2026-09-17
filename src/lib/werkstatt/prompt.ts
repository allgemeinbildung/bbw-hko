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

import type { WerkstattKontext } from './kontext'
import type { WerkstattWahl } from './auftraege'
import { auftragDef, NIVEAU_LABEL } from './auftraege'

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

function progressionsHinweis(r: string): string {
  if (r === 'R1') return ' — hier erstmals eingeführt, kein Vorwissen voraussetzen'
  if (r === 'R2') return ' — Grundbegriffe bekannt, auf Anwendungsebene vertiefen'
  if (r === 'R3') return ' — vertraut, auf Analyse- und Transferebene arbeiten'
  return ''
}

export function werkstattPrompt(k: WerkstattKontext, w: WerkstattWahl): string {
  const def = auftragDef(w.auftrag)
  if (!def) return ''

  const richtung = def.richtungen.find((r) => r.key === w.richtung)
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
    ]),

    ...block('KONSISTENZ-VERTRAG — diese Auflagen sind nicht verhandelbar', konsistenzVertrag(k)),

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
    ]),
  ]

  return zeilen.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/** Dateiname für den .txt-Download. */
export function promptDateiname(k: WerkstattKontext, w: WerkstattWahl): string {
  const teile = [k.slug, w.auftrag, w.hf && auftragDef(w.auftrag)?.brauchtHf ? `hf-${w.hf}` : '', w.richtung ?? '']
  return `${teile.filter(Boolean).join('_')}_prompt.txt`.replace(/[^a-zA-Z0-9._-]/g, '-')
}
