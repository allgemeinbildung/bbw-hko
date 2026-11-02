import type { Leitfrage, SituationJson } from './types'

/**
 * Heft v4.2 — Profil je Lehrgang (EFZ / EBA).
 *
 * EINE Stelle für alles, was die v4.2-Renderer (Heft HTML + Word, Lösungen, Deck,
 * Begleiter-Lösungen, Werkstatt) je nach Lehrgang anders machen: welche Leitfrage auf
 * welcher Seite steht, welcher Dossier-/Lehrmittel-Abschnitt zum Raster gehört und welche
 * festen Sätze gedruckt werden. Die Renderer fragen hier, statt `if (eba)` zu verstreuen.
 *
 * Ohne React, ohne docx, ohne Daten-Importe — die Datei wird von beiden Seiten gezogen.
 *
 * Invariante: Für EFZ liefert jede Funktion genau das, was vorher als Literal im Renderer
 * stand — die EFZ-Ausgabe bleibt Zeichen für Zeichen gleich.
 *
 * EBA (erstes Heft: `1.1.1_lehrvertrag_orientieren_v42`): drei statt vier Leitfragen
 * (LF1 Kern · LF2 Raster · LF3 Beurteilen), nur die Spur ohne Medien, das Dossier ersetzt
 * das Lehrmittel, Sprache A2.
 */

type Sit = Pick<SituationJson, 'lehrgang' | 'leitfragen' | 'quellen_anker'> | null | undefined
type Anker = NonNullable<SituationJson['quellen_anker']>[number]

export function istEba(sit: { lehrgang?: string | null } | null | undefined): boolean {
  return sit?.lehrgang === 'EBA_2J'
}

const nachNr = (a: Leitfrage, b: Leitfrage) => a.nr - b.nr

/** Die Leitfrage mit Raster (S. 3): `antwortform: 'raster'`, sonst — wie bisher — Nr. 3. */
export function rasterLeitfrage(sit: Sit): Leitfrage | undefined {
  return sit?.leitfragen?.find((l) => l.antwortform === 'raster') ?? sit?.leitfragen?.find((l) => l.nr === 3)
}

/** Die Leitfrage zum Beurteilen (S. 4): trägt `pol_typ`, sonst — wie bisher — Nr. 4. */
export function beurteilenLeitfrage(sit: Sit): Leitfrage | undefined {
  return sit?.leitfragen?.find((l) => !!l.pol_typ) ?? sit?.leitfragen?.find((l) => l.nr === 4)
}

/**
 * Die Leitfragen der Seite 2 (Wissensecke I): alle, die weder das Raster (S. 3) noch das
 * Beurteilen (S. 4) tragen, nach Nummer. EFZ: LF1 und LF2 · EBA: nur LF1.
 */
export function kernLeitfragen(sit: Sit): Leitfrage[] {
  const raster = rasterLeitfrage(sit)
  const beurteilen = beurteilenLeitfrage(sit)
  return (sit?.leitfragen ?? []).filter((l) => l && l !== raster && l !== beurteilen).slice().sort(nachNr)
}

/** «1», «1 und 2», «1, 2 und 3». */
export function nrListe(nrs: number[]): string {
  if (nrs.length <= 1) return nrs.join('')
  return `${nrs.slice(0, -1).join(', ')} und ${nrs[nrs.length - 1]}`
}

/** «Leitfrage 1» bzw. «Leitfragen 1 und 2» — Titel der Seite 2 in Lösungen und Deck. */
export function kernTitel(sit: Sit): string {
  const nrs = kernLeitfragen(sit).map((l) => l.nr)
  // Ohne Kern-Leitfrage (kommt im Bestand nicht vor) bleibt der bisherige Wortlaut.
  if (!nrs.length) return 'Leitfragen 1 und 2'
  return `${nrs.length > 1 ? 'Leitfragen' : 'Leitfrage'} ${nrListe(nrs)}`
}

/**
 * Abschnitt aus `quellen_anker`, der zu einem `knoten_ref` gehört.
 *
 * EFZ: der Anker, dessen `ref` am Anfang von `knoten_ref` steht («Kap. 2.7 | …»).
 * EBA: jeder Anker hat `ref: "Dossier"` — die Regel oben träfe immer den ersten. Dort
 * entscheidet `seiten` («Info-Karte A-02»): der Anker, dessen `seiten` im `knoten_ref`
 * am weitesten vorne steht («Dossier | Info-Karte B-02 und B-03» → B-02).
 */
export function ankerZu(sit: Sit, knotenRef?: string): Anker | undefined {
  if (!knotenRef) return undefined
  const anker = sit?.quellen_anker ?? []
  if (!istEba(sit)) return anker.find((a) => a.ref && knotenRef.startsWith(a.ref))
  let bester: Anker | undefined
  let stelle = Infinity
  for (const a of anker) {
    const i = a.seiten ? knotenRef.indexOf(a.seiten) : -1
    if (i > -1 && i < stelle) {
      bester = a
      stelle = i
    }
  }
  return bester
}

/** `HEFT A · OHNE MEDIEN` — EBA kennt nur eine Spur und druckt `HEFT A`. */
export function heftDocCode(sit: Pick<SituationJson, 'lehrgang' | 'buchstabe' | 'spur'>): string {
  if (istEba(sit)) return `HEFT ${sit.buchstabe}`
  return `HEFT ${sit.buchstabe} · ${sit.spur === 'mit_medien' ? 'MIT MEDIEN' : 'OHNE MEDIEN'}`
}

/** Die festen Sätze des Hefts. EFZ = der bisherige Wortlaut, EBA = A2. */
export interface V42Worte {
  /** S. 1 — Beschriftung der Liste `quellen_anker`. */
  imLehrmittel: string
  /** S. 1 — Satz nach «So starten Sie:». */
  soStarten: string
  /** S. 3 — Titel der Seite. */
  seite3Titel: string
  /** S. 3, Lösungen, Deck — Beschriftung des Abschnitts zum Raster. */
  abschnitt: string
  /** Deck — Überschrift der Folie zum Abschnitt. */
  deckAbschnittTitel: string
  /** Deck, Notiz zur Rasterlösung — wo eine andere Zeile belegt sein muss. */
  deckBelegtIn: string
  /** S. 5 — mittlere Spalte der Feedback-Kriterien. */
  kriterienBeschreibung: string
  /** S. 6 — Einleitung über den Methodenkarten. */
  methodenIntro: string
  /** S. 6 — Herkunftszeile einer eigenen Methodenkarte (`quelle: 'hko'`). */
  methodenkarteHko: string
  /** S. 7 — Hinweis über der Arbeitsfläche. */
  arbeitsflaeche: string
  /** S. 8 — Anweisung zum Begriffsnetz. */
  netzAnweisung: (transferTitel: string) => string
  /** S. 8 — Anweisung über «Das nehme ich mit» (nur ohne Begriffsnetz gedruckt). */
  mitnahme: string
  /*
   * Beschriftungen der Kästen. EBA: die Funktion für Lernende klar benannt (Besprechung
   * EBA-gold 23.10.2026, Entscheid Pietro 02.11.2026). EFZ = bisheriger Wortlaut.
   */
  /** S. 1 — Etikett des Spannungsfelds. */
  spannungsfeld: string
  /** S. 1 — Etikett der Übersicht (`wochen_plan`). */
  uebersicht: string
  /** S. 2–4 — dritter Abschnitt der Hilfe-Spalte. */
  insProdukt: string
  /** S. 2–4 — Vorsatz vor `liefert`. */
  liefert: string
  /** S. 2–4 — Bloom-Stufe als Abzeichen zeigen. */
  bloomZeigen: boolean
  /** S. 2–4 — Fundstelle der Leitfrage (`knoten_ref`), wie sie gedruckt wird. */
  fundstelle: (ref: string) => string
  /** S. 2–4 — Etikett über dem Schreibfeld der Leitfrage (leer = keines). */
  schreibfeld: (nr: number) => string
  /** S. 5 — Spalte zum Ankreuzen und der Satz darüber. */
  selbst: string
  selbstAnweisung: string
  /** S. 5 — Abzeichen der Dimension eines Kriteriums («SuK», «Ges»). */
  dimension: (d: string) => string
  /** S. 5 — Etikett des Plus-Kastens. */
  plus: string
  /** S. 8 — Etikett des Quer-Checks. */
  quercheck: string
  /** S. 8 — Begriffsnetz drucken (EBA: nein, Entscheid Pietro 02.11.2026). */
  begriffsnetz: boolean
}

const EFZ: V42Worte = {
  imLehrmittel: 'Im Lehrmittel',
  soStarten:
    'Lesen Sie die Situation genau. Markieren Sie, was Sie noch nicht wissen oder können — am Ende des Hefts prüfen Sie es im Quer-Check (S. 8).',
  seite3Titel: 'Quelle',
  abschnitt: 'Lehrmittel-Abschnitt',
  deckAbschnittTitel: 'Der Lehrmittel-Abschnitt zu diesem Heft.',
  deckBelegtIn: 'in der Quelle bzw. im Lehrmittel-Abschnitt',
  kriterienBeschreibung: 'Beschreibung (Wortlaut Kompetenznachweis)',
  methodenIntro:
    'Vier Werkzeuge, vier Felder. Wo ein Kapitel steht, schlagen Sie im Lehrmittel nach — hier steht, was Sie damit für diese Abgabe machen. Die übrigen Felder stehen für sich.',
  methodenkarteHko: 'Methodenkarte · nicht im Lehrmittel',
  arbeitsflaeche: 'Auftrag und Schritte stehen auf S. 5. Die Methoden auf S. 6 stehen Ihnen für Ihr Produkt frei zur Verfügung.',
  netzAnweisung: (t) =>
    `Verbinden Sie Begriffe mit Linien und schreiben Sie an jede Linie, wie die zwei Begriffe zusammenhängen — mindestens fünf Verbindungen, eine davon zum Feld «${t}»: eine andere Lage, in der dasselbe gilt. Schreiben Sie in die zwei leeren Knoten je einen Begriff aus Ihrem Raster (S. 3).`,
  mitnahme: 'Halten Sie in drei Zeilen fest, was Sie aus diesem Heft weiterverwenden.',
  spannungsfeld: 'Spannungsfeld',
  uebersicht: 'Übersicht',
  insProdukt: 'Ins Produkt',
  liefert: '→ liefert:',
  bloomZeigen: true,
  fundstelle: (ref) => ref,
  schreibfeld: () => '',
  selbst: 'Selbst',
  selbstAnweisung: 'Kreuzen Sie vor der Abgabe in der Spalte «Selbst» Ihre Punkte an.',
  dimension: (d) => d,
  plus: 'Plus',
  quercheck: 'Quer-Check — die offenen Fragen der Situation',
  begriffsnetz: true,
}

const EBA: V42Worte = {
  imLehrmittel: 'Im Dossier',
  soStarten:
    'Lesen Sie die Situation genau. Markieren Sie, was Sie noch nicht wissen. Am Schluss prüfen Sie es im Quer-Check (S. 8).',
  seite3Titel: 'Info-Karte und Raster',
  abschnitt: 'Info-Karte im Dossier',
  deckAbschnittTitel: 'Die Info-Karte zu diesem Heft.',
  deckBelegtIn: 'auf der Info-Karte im Dossier',
  kriterienBeschreibung: 'Beschreibung',
  methodenIntro: 'Vier Werkzeuge für Ihr Produkt. Jede Karte zeigt Schritt für Schritt, wie es geht.',
  methodenkarteHko: 'Methodenkarte',
  arbeitsflaeche: 'Der Auftrag und die Schritte stehen auf S. 5. Die Methoden auf S. 6 helfen Ihnen.',
  netzAnweisung: (t) =>
    `Verbinden Sie die Begriffe mit Linien. Schreiben Sie an jede Linie, wie die zwei Begriffe zusammengehören. Machen Sie mindestens drei Verbindungen. Eine Linie führt zum Feld «${t}». Schreiben Sie in die zwei leeren Knoten je einen Begriff aus Ihrem Raster (S. 3).`,
  mitnahme: 'Schreiben Sie in drei Zeilen auf, was Sie aus diesem Heft mitnehmen.',
  spannungsfeld: 'Zwei Wege – beide können richtig sein',
  uebersicht: 'So ist dieses Heft aufgebaut',
  insProdukt: 'Das kommt in Ihr Produkt',
  liefert: '→ Das brauchen Sie später:',
  bloomZeigen: false,
  // «Dossier | Info-Karte A-01» → «Lesen Sie: Info-Karte A-01»; Zusätze nach ↔ oder · fallen weg.
  fundstelle: (ref) => `Lesen Sie: ${ref.replace(/^Dossier\s*\|\s*/, '').split(/\s+(?:↔|·)\s+/)[0]}`,
  schreibfeld: (nr) => `Ihre Antwort zu Leitfrage ${nr}`,
  selbst: 'Ich kreuze an',
  selbstAnweisung: 'Kreuzen Sie vor der Abgabe in der Spalte «Ich kreuze an» Ihre Punkte an.',
  dimension: (d) => (d === 'SuK' ? 'Sprache' : d === 'Ges' ? 'Gesellschaft' : d),
  plus: 'Plus – freiwillig, wenn Sie fertig sind',
  quercheck: 'Ihre Fragen vom Anfang: Können Sie sie jetzt beantworten?',
  begriffsnetz: false,
}

export function worte(sit: { lehrgang?: string | null } | null | undefined): V42Worte {
  return istEba(sit) ? EBA : EFZ
}
