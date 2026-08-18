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

const MASSSTAB_SATZ =
  'Der Massstab für die Beurteilung, nicht ein Skript zum Vorlesen: Formulierungen der Lernenden dürfen abweichen, solange Quelle und eigene Verdichtung erkennbar sind. Dieselben Lösungen liegen als aufklappbare Folie im Unterrichtsdeck.'

/** Eine Herausforderung, soweit hier gebraucht. */
type Hf = {
  buchstabe?: string
  leitfragen?: {
    nr: number
    bloom?: string
    loesung?: { kern?: string; zeilen: { label?: string; text: string; quelle?: string }[] }
  }[]
} | null

/** Callout-Block für eine Leitfrage — Blockquote-Syntax des Begleiters. */
function calloutFor(lf: NonNullable<NonNullable<Hf>['leitfragen']>[number]): string {
  const sol = lf.loesung!
  const kopf = [`LF ${lf.nr}`, lf.bloom, sol.kern].filter(Boolean)
  const titel = `${kopf.slice(0, 2).join(' · ')}${sol.kern ? ` — ${sol.kern}` : ''}`
  const zeilen = sol.zeilen.map((z) => {
    const label = z.label ? `**${z.label}:** ` : ''
    const quelle = z.quelle ? ` *(${z.quelle})*` : ''
    return `> - ${label}${z.text}${quelle}`
  })
  return [`> [!loesung] ${titel}`, ...zeilen].join('\n')
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

  for (const hf of hfs) {
    const letter = String(hf?.buchstabe ?? '').toUpperCase()
    if (!/^[ABC]$/.test(letter)) continue
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

  const out = eingriffe
    .sort((a, b) => b.at - a.at)
    .reduce((acc, e) => acc.slice(0, e.at) + e.text + acc.slice(e.at), raw)

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
