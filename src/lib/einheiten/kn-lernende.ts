/**
 * Texte des Kompetenznachweises für Lernende (DOC-KN-S), HTML und Word aus einer Quelle.
 *
 * EBA (Rückmeldung EBA-Gold, Entscheid Pietro 03.11.2026): dieselben Regeln wie in den Heften —
 * kein «Hybrid-Herausforderung», keine Bloom-Abzeichen, Kriterien in der Fassung für Lernende
 * (`name_lernende`, `stufen_lernende`) mit «Sprache»/«Gesellschaft» statt «SuK»/«Ges», und die
 * Niveaubänder in einfachen Sätzen (`definition_lernende`). EFZ: bisheriger Wortlaut.
 */
import type { KnJson, KnTyp } from './types'

type Kriterium = NonNullable<NonNullable<KnJson['rubrik_shared']>['kriterien']>[number]
type Niveau = NonNullable<NonNullable<KnJson['rubrik_shared']>['niveaubaender']>[number]

export function knTexte(kn: KnJson | null | undefined) {
  const eba = kn?.lehrgang === 'EBA_2J'
  return {
    eba,
    /** 01 — Kicker und Titel des Falls. */
    fallKicker: eba ? '01 · Ihr Fall' : '01 · Hybrid-Herausforderung',
    fallTitel: eba ? 'Der Fall' : 'Herausforderung',
    definition:
      kn?.hybrid_situation?.definition_kurz ||
      'Eine Hybrid-Herausforderung bündelt die drei Herausforderungen (A, B, C) und ihre Kompetenzen in einer neuen, zusammengesetzten Aufgabe.',
    /** Abzeichen «ERKLAEREN», «ANWENDEN» … (Bloom-Stufe) bei jeder Frage. */
    typAbzeichen: !eba,
    aufgabenTitel: eba ? 'Aufgaben' : 'Prüfungsaufgaben',
    aufgabenIntro: eba
      ? 'Bearbeiten Sie alle Aufgaben schriftlich. Dossier und Hefte sind erlaubt, kein Internet.'
      : 'Bearbeiten Sie alle Aufgaben schriftlich. Lehrmittel nach Anweisung der Lehrperson erlaubt, kein Internet.',
    notizenIntro: eba
      ? 'Sie haben 15 Minuten Zeit. Schreiben Sie zu jeder Frage Stichworte. Im Gespräch sprechen Sie frei.'
      : 'Nutzen Sie die 15 Minuten Vorbereitungszeit für stichwortartige Notizen zu jeder Frage. Im Gespräch sprechen Sie frei.',
    werkwahlTitel: eba ? 'Welches Produkt wähle ich?' : 'Welches Handlungsprodukt wähle ich?',
    rubrikIntro: eba
      ? 'So wird Ihr Kompetenznachweis bewertet. Es gibt vier Kriterien. Für jedes Kriterium bekommen Sie 0 bis 3 Punkte. Sprache und Gesellschaft geben je eine eigene Note.'
      : 'Die folgenden Kriterien werden bewertet. Sie verteilen sich auf zwei Dimensionen: Sprache und Kommunikation (SuK) und gesellschaftliche Werthaltung (Ges). Beide Dimensionen werden separat benotet.',
    niveauTitel: eba ? 'So wird gezählt' : 'Niveaubänder — was sie bedeuten',
    /** EBA: Stufen je Kriterium zeigen (wie Heft S. 7); EFZ: nur Name und Dimension. */
    stufenZeigen: eba,
    dimension: (d: string) => (eba ? (d === 'SuK' ? 'Sprache' : d === 'Ges' ? 'Gesellschaft' : d) : d),
    kriterium: (k: Kriterium) => ({
      name: (eba && k.name_lernende) || k.name,
      stufen: (eba && k.stufen_lernende?.length === (k.stufen?.length ?? 0) ? k.stufen_lernende : k.stufen) || [],
    }),
    niveau: (n: Niveau) => (eba && n.definition_lernende) || n.definition,
  }
}

/** Persona-Felder mit Inhalt — leere werden nicht gedruckt (vorher: Beschriftung «Emotion» ohne Wert). */
export function knPersonaFelder(kn: KnJson | null | undefined): { label: string; wert: string }[] {
  // EBA: die Persona ist neutral («eigener Lehrbetrieb») und trägt nichts — wie im Auftragsbogen weg.
  if (kn?.lehrgang === 'EBA_2J') return []
  const hs = kn?.hybrid_situation
  return [
    { label: 'Beruf', wert: hs?.persona?.beruf },
    { label: 'Betrieb', wert: hs?.persona?.betrieb },
    { label: 'Ort', wert: hs?.persona?.ort },
    { label: 'Emotion', wert: hs?.emotion_tag },
  ].filter((f): f is { label: string; wert: string } => !!f.wert && !!String(f.wert).trim())
}

export type KnAufgabe = NonNullable<KnTyp['aufgaben']>[number]

/**
 * Werkschau (DOC-KN-S S. 2): Werkwahl und Wortzahl aus dem Ablauf der Einheit. Vorher stand bei
 * allen EFZ-Einheiten fest «Positionspapier, Konflikt-Schreiben oder Gesprächs-Drehbuch» und
 * «200–250 Wörter» (03.11.2026, Freigabe Pietro). Gelesen wird `ablauf`:
 *   «Lernende wählen eines ihrer beiden Handlungsprodukte aus den Lernaufgaben (A; B).»
 *   «Werkwahl-Begründung (2-3 Sätze) …» · «Transfer-Reflexion (200-250 Wörter) …»
 * Fehlt eine Angabe, entfällt sie, statt erfunden zu werden. Eine Regel für EFZ und EBA; EBA nur
 * in einfacheren Sätzen («Produkte aus den Heften», «Zusammen schreiben Sie …»).
 */
export function werkschauTexte(kn: KnJson | null | undefined, t: KnTyp | null | undefined): { werkwahl: string; reflexionIntro: string } {
  const eba = knTexte(kn).eba
  const ablauf = (t?.ablauf || []).join(' ')
  const bis = (s: string, wort = '–') => s.replace(/\s*-\s*/, wort)
  // «eines ihrer beiden Handlungsprodukte aus den Lernaufgaben (A; B)» · EBA: «eines ihrer zwei Produkte aus den Heften (A oder B)»
  const m = /eines ihrer (\S+) ((?:Handlungs)?[Pp]rodukte)([^(.]*)\(([^)]+)\)/.exec(ablauf)
  const anzahl = m?.[1]
  const liste = m?.[4]?.trim()
  const saetze = /Werkwahl[^(]*\((\d+\s*-\s*\d+|\d+) Sätze?\)/i.exec(ablauf)?.[1]
  const woerter = /\((\d+\s*-\s*\d+) Wörter\)/i.exec(ablauf)?.[1]
  const n = t?.reflexionsfragen?.length ?? 0
  const fragen = n === 3 ? 'drei' : n === 2 ? 'zwei' : String(n)
  if (eba) {
    const woher = m?.[3]?.trim() || '' // nur was die Daten nennen («aus den Heften»)
    return {
      werkwahl: `Wählen Sie eines Ihrer ${anzahl ?? ''} Produkte ${woher}${liste ? ` (${liste})` : ''}.`.replace(/\s+/g, ' ') +
        ` Begründen Sie Ihre Wahl${saetze ? ` in ${bis(saetze, ' bis ')} Sätzen` : ''}.`,
      reflexionIntro: `Beantworten Sie die ${n ? `${fragen} ` : ''}Fragen schriftlich.${woerter ? ` Zusammen schreiben Sie ${bis(woerter, ' bis ')} Wörter.` : ''}`,
    }
  }
  const werkwahl =
    `Wählen Sie eines ${anzahl ? `Ihrer ${anzahl} ` : 'Ihrer '}Handlungsprodukte aus den Lernaufgaben` +
    `${liste ? ` (${liste})` : ''} und begründen Sie Ihre Wahl${saetze ? ` in ${bis(saetze)} Sätzen` : ''}.`
  const reflexionIntro = woerter
    ? `Beantworten Sie schriftlich, insgesamt ${bis(woerter)} Wörter über alle ${fragen} Fragen.`
    : 'Beantworten Sie alle Fragen schriftlich.'
  return { werkwahl, reflexionIntro }
}
