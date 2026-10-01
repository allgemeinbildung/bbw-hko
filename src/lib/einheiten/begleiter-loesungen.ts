// Spiegelt die Leitfragen-Lösungen (`leitfragen[].loesung`, C10) in das
// Begleitdokument — abgeleitet beim Laden, nicht in die Markdown-Datei geschrieben.
//
// Warum abgeleitet: Die Lösung steht bereits in `herausforderung_*.json` und speist
// von dort die Deck-Folie «Lösung der Leitfragen». Schriebe man sie zusätzlich in
// `begleiter.md`, gäbe es zwei Quellen für denselben Satz — und die eine würde
// irgendwann von der anderen abweichen. `loadEinheit` injiziert sie deshalb einmal,
// bevor irgendein Renderer den Begleiter sieht; HTML-Ansicht, Word-Export und ZIP
// bekommen dieselbe fertige Form (dasselbe Muster wie `withMethoden`).
//
// Nicht gespiegelt wird in die Referentennotizen des Decks: dort steht die Lösung
// schon auf der Folie selbst, ein zweites Mal in den Notizen wäre Lärm. Der Callout-Typ
// `loesung` ist deshalb bewusst NICHT in den `pick()`-Listen von `deck-builder.ts`.
//
// Heft v4.2 (ENTSCHEIDE E3): Der Begleiter zeigt die Lösungen BEIDER Spuren, nicht nur
// die der wirksamen. `loadEinheit` übergibt dafür die Rohhefte (mit `spuren`); hier
// entsteht je Heft ein Block «Kern» (LF1, LF2) und je Spur einer mit LF3 und LF4,
// LF4 mit Erwartungshorizont. Bestandshefte haben kein `spuren` — ihr Weg ist unverändert.

import { TEMPLATE_V42 } from './types'
import type { Erwartungshorizont, SpurKey } from './types'
import { SPUR_KEYS } from './spuren'

const MASSSTAB_SATZ =
  'Der Massstab für die Beurteilung, nicht ein Skript zum Vorlesen: Formulierungen der Lernenden dürfen abweichen, solange Quelle und eigene Verdichtung erkennbar sind. Dieselben Lösungen liegen als aufklappbare Folie im Unterrichtsdeck.'

// v4.2: Das Deck zeigt nur die Spur, die gerade eingesetzt ist — der Begleiter zeigt
// beide. Darum ein eigener Satz statt des Verweises aufs Deck.
const MASSSTAB_SATZ_V42 =
  'Der Massstab für die Beurteilung, nicht ein Skript zum Vorlesen: Formulierungen der Lernenden dürfen abweichen, solange Quelle und eigene Verdichtung erkennbar sind. LF1 und LF2 gelten in beiden Spuren; LF3 und LF4 stehen je Spur, weil dort Quelle und Pol-Typ wechseln. Zu LF4 gibt es keine Musterantwort, sondern einen Erwartungshorizont mit zwei vertretbaren Entscheiden.'

const SPUR_TITEL: Record<SpurKey, string> = {
  ohne_medien: 'Spur ohne Medien',
  mit_medien: 'Spur mit Medien',
}

type Lf = {
  nr: number
  bloom?: string
  // v4.2: bei LF4 darf `zeilen` fehlen (dort trägt `erwartungshorizont`). Im Bestandszweig
  // filtert `withLeitfragenLoesungen` solche Leitfragen weg, bevor `calloutFor` sie sieht.
  loesung?: {
    kern?: string
    zeilen?: { label?: string; text: string; quelle?: string }[]
    quelle_ref?: string
    quelle_stand?: string
    erwartungshorizont?: Erwartungshorizont
  }
}

/**
 * Eine Herausforderung, soweit hier gebraucht. Bei v4.2 kommt das Rohheft (vor
 * `resolveSpur`): Kern-Leitfragen in `leitfragen`, LF3 und LF4 je Spur in `spuren`.
 */
type Hf = {
  buchstabe?: string
  template?: string
  leitfragen?: Lf[]
  spuren?: Partial<Record<SpurKey, { leitfragen?: Lf[] } | null>>
} | null

/** Callout-Block für eine Leitfrage — Blockquote-Syntax des Begleiters. */
function calloutFor(lf: NonNullable<NonNullable<Hf>['leitfragen']>[number]): string {
  const sol = lf.loesung!
  const kopf = [`LF ${lf.nr}`, lf.bloom, sol.kern].filter(Boolean)
  const titel = `${kopf.slice(0, 2).join(' · ')}${sol.kern ? ` — ${sol.kern}` : ''}`
  const zeilen = (sol.zeilen ?? []).map((z) => {
    const label = z.label ? `**${z.label}:** ` : ''
    const quelle = z.quelle ? ` *(${z.quelle})*` : ''
    return `> - ${label}${z.text}${quelle}`
  })
  return [`> [!loesung] ${titel}`, ...zeilen].join('\n')
}

/** `2026-10-01` → `01.10.2026`; alles andere bleibt, wie es ist. */
function datumCh(s: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  return m ? `${m[3]}.${m[2]}.${m[1]}` : s
}

/** v4.2: Erwartungshorizont als Listenzeilen desselben Callouts — nur vorhandene Felder. */
function horizontZeilen(eh: Erwartungshorizont | undefined): string[] {
  if (!eh) return []
  return [
    ...(eh.gut_wenn ?? []).map((g) => `> - **Gut, wenn:** ${g}`),
    ...(eh.beispiel_pol_1 ? [`> - **Beispiel, Pol 1:** ${eh.beispiel_pol_1}`] : []),
    ...(eh.beispiel_pol_2 ? [`> - **Beispiel, Pol 2:** ${eh.beispiel_pol_2}`] : []),
    ...(eh.tragfaehig ? [`> - **Tragfähig:** ${eh.tragfaehig}`] : []),
    ...(eh.nicht_tragfaehig ? [`> - **Nicht tragfähig:** ${eh.nicht_tragfaehig}`] : []),
  ]
}

/**
 * v4.2: Callout wie im Bestand, ergänzt um Erwartungshorizont (LF4) und die Bindung
 * an Quelle bzw. Lehrmittel-Abschnitt mit Prüfdatum (LF3, Leitfaden §5).
 */
function calloutV42(lf: Lf): string {
  const sol = lf.loesung!
  const bindung = sol.quelle_ref
    ? [`> - **Stand:** ${sol.quelle_ref}${sol.quelle_stand ? `, geprüft am ${datumCh(sol.quelle_stand)}` : ''}`]
    : []
  return [calloutFor(lf), ...horizontZeilen(sol.erwartungshorizont), ...bindung].join('\n')
}

const hatLoesungV42 = (lf: Lf) => !!(lf.loesung?.zeilen?.length || lf.loesung?.erwartungshorizont)

/** Trägt das Heft v4.2-Rohdaten mit Spuren? Nur dann greift der Spur-Zweig. */
function istV42Roh(hf: Hf): boolean {
  return hf?.template === TEMPLATE_V42 && !!hf.spuren && typeof hf.spuren === 'object'
}

/**
 * v4.2: Lösungsteile eines Hefts — Kern einmal, dann jede vorhandene Spur. Gelesen wird
 * das Rohheft, darum hängt das Ergebnis nicht davon ab, welche Spur gerade wirksam ist.
 */
function teileV42(hf: NonNullable<Hf>): string[] {
  const teile: string[] = []
  const kern = (hf.leitfragen ?? []).filter(hatLoesungV42).sort((a, b) => a.nr - b.nr)
  if (kern.length) {
    teile.push('#### Kern — gilt in beiden Spuren', '', ...kern.map((lf) => calloutV42(lf) + '\n'))
  }
  for (const key of SPUR_KEYS) {
    const lfs = (hf.spuren?.[key]?.leitfragen ?? []).filter(hatLoesungV42).sort((a, b) => a.nr - b.nr)
    if (!lfs.length) continue
    teile.push(`#### ${SPUR_TITEL[key]}`, '', ...lfs.map((lf) => calloutV42(lf) + '\n'))
  }
  return teile
}

/**
 * Findet die Herausforderungs-Sektion eines Buchstabens und gibt den Offset zurück,
 * an dem der Lösungsblock eingefügt wird.
 *
 * Einfügestelle ist die Tafelbild-Überschrift, wenn es eine gibt — das fachliche
 * Soll-Bild und die Lösungen gehören nebeneinander. Sonst das Sektionsende.
 * Fehlt die Sektion ganz (z. B. `1.1.1_einstieg_interview`, das ohne
 * Herausforderungs-Kapitel gebaut ist), wird nichts eingefügt: eine erfundene
 * Sektion wäre schlimmer als keine.
 */
function insertionPoint(raw: string, letter: string): number | null {
  // Zwei Überschriften-Dialekte im Korpus, wie in `parseBegleiterSections`:
  // "## 3. Herausforderung A — …" (EFZ) und "## Sektion 3 — Herausforderung A: …" (EBA).
  // Ohne den zweiten Zweig landeten beide EBA-Herausforderungen im `heimatlos`-Zweig und
  // damit in einem angehängten Sammelkapitel, statt je in ihrer eigenen Sektion.
  const head = new RegExp(
    `^##\\s+(?:Sektion\\s+)?\\d+\\s*[.—:–-]?\\s*Herausforderung\\s+${letter}\\b.*$`,
    'm'
  )
  const m = head.exec(raw)
  if (!m) return null

  const from = m.index + m[0].length
  const nextH2 = /^##\s/m.exec(raw.slice(from))
  const end = nextH2 ? from + nextH2.index : raw.length

  const tafel = /^###\s+Tafelbild\b.*$/m.exec(raw.slice(from, end))
  return tafel ? from + tafel.index : end
}

/**
 * Hängt je Herausforderung eine Unterüberschrift «Lösungen der Leitfragen» mit einem
 * Callout pro Leitfrage in den Begleiter-Rohtext. Rein additiv: Einheiten ohne
 * gepflegte `loesung` bleiben unverändert.
 */
export function withLeitfragenLoesungen(raw: string, hfs: Hf[]): string {
  if (!raw) return raw
  if (/\[!loesung\]/.test(raw)) return raw // schon eingefügt — nie doppeln

  // Von hinten nach vorne einfügen, damit frühere Offsets gültig bleiben.
  const eingriffe: { at: number; text: string }[] = []
  // Herausforderungen, deren Sektion im Begleiter fehlt — sie bekommen am Ende ein
  // eigenes Kapitel, statt ihre Lösungen stillschweigend zu verlieren.
  const heimatlos: { letter: string; lfs: NonNullable<NonNullable<Hf>['leitfragen']> }[] = []
  // v4.2-Hefte ohne eigene Sektion — eigener Sammelblock, gleiche Regel wie oben.
  const heimatlosV42: { letter: string; teile: string[] }[] = []

  for (const hf of hfs) {
    const letter = String(hf?.buchstabe ?? '').toUpperCase()
    if (!/^[ABC]$/.test(letter)) continue

    // v4.2: Lösungen beider Spuren aus dem Rohheft. Bestandshefte haben kein `spuren`
    // und laufen unverändert durch den Zweig darunter.
    if (istV42Roh(hf)) {
      const teile = teileV42(hf!)
      if (!teile.length) continue
      const at = insertionPoint(raw, letter)
      if (at === null) {
        heimatlosV42.push({ letter, teile })
        continue
      }
      eingriffe.push({
        at,
        text: ['', '### Lösungen der Leitfragen', '', MASSSTAB_SATZ_V42, '', ...teile].join('\n'),
      })
      continue
    }

    const mitLoesung = (hf?.leitfragen ?? []).filter((lf) => lf.loesung?.zeilen?.length)
    if (!mitLoesung.length) continue
    const at = insertionPoint(raw, letter)
    if (at === null) {
      heimatlos.push({ letter, lfs: mitLoesung })
      continue
    }

    const block = [
      '',
      '### Lösungen der Leitfragen',
      '',
      MASSSTAB_SATZ,
      '',
      ...mitLoesung.map((lf) => calloutFor(lf) + '\n'),
    ].join('\n')

    eingriffe.push({ at, text: block })
  }

  const eingefuegt = eingriffe
    .sort((a, b) => b.at - a.at)
    .reduce((acc, e) => acc.slice(0, e.at) + e.text + acc.slice(e.at), raw)

  // v4.2-Gegenstück zum Schluss-Kapitel unten; ohne heimatlose v4.2-Hefte bleibt `out`
  // exakt das Ergebnis der Einfügungen.
  const out = heimatlosV42.length
    ? eingefuegt +
      ['', '', '---', '', '## Lösungen der Leitfragen', '', MASSSTAB_SATZ_V42]
        .concat(heimatlosV42.flatMap(({ letter, teile }) => ['', `### Herausforderung ${letter}`, '', ...teile]))
        .join('\n') +
      '\n'
    : eingefuegt

  if (!heimatlos.length) return out

  // Begleiter ohne Herausforderungs-Kapitel (z. B. `1.1.1_einstieg_interview`, das
  // bewusst anders gebaut ist) bekommen die Lösungen als eigenes Schluss-Kapitel.
  const anhang = ['', '', '---', '', '## Lösungen der Leitfragen', '', MASSSTAB_SATZ]
    .concat(
      heimatlos.flatMap(({ letter, lfs }) => [
        '',
        `### Herausforderung ${letter}`,
        '',
        ...lfs.map((lf) => calloutFor(lf) + '\n'),
      ])
    )
    .join('\n')

  return out + anhang + '\n'
}
