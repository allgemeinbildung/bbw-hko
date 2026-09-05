// Löst Feld-Marker im Begleitdokument gegen die Einheits-JSONs auf — beim Laden,
// nicht in der Markdown-Datei.
//
// Warum: `begleiter.md` zitiert Inhalte, die anderswo bereits kanonisch stehen —
// die Persona, den Situationstext, die KN-Szene, die KN-Fragen. Jede solche Kopie
// ist eine zweite Quelle, und die eine weicht irgendwann von der anderen ab. Am
// 2026-09-04 mussten nach einer Persona-Änderung in sieben Einheiten von Hand
// Persona-Zeilen, Situationszitate, KN-Texte und sogar eine KN-Frage nachgezogen
// werden; in 5.4.2 war die Mini-Case-Aufgabe noch drei Fassungen alt.
// Dasselbe Prinzip wie `withLeitfragenLoesungen` und `withMethoden`, nur an einer
// vom Autor gewählten Stelle statt an einer Überschrift.
//
// Syntax im Markdown — der Text zwischen den Markern ist RUECKFALL:
//
//   | Persona | <!--hko:hf_A.persona|persona-->Lernende/r EFZ, 1. Lehrjahr …<!--/hko--> |
//
//   <!--hko:hf_A.situation_text|quote-->
//   > Ich bin im 1. Lehrjahr und …
//   <!--/hko-->
//
// Der Rueckfall ist Absicht: Wer die Datei roh oeffnet — im Editor, auf GitHub —
// liest weiterhin den Inhalt statt eines leeren Kommentars. Der Loader ersetzt ihn
// still durch den aktuellen Wert; `scripts/check-einheiten.mjs` meldet, wenn
// Rueckfall und Quelle auseinanderlaufen (WARN_BEGLEITER_DRIFT).
//
// Robustheit geht hier vor Strenge: Ein unbekannter Pfad, ein fehlendes Feld oder
// ein kaputter Marker laesst den Rueckfalltext einfach stehen. Ein Begleiter, der
// wegen eines Tippfehlers im Marker gar nicht mehr rendert, waere schlimmer als
// einer, der an einer Stelle veraltet ist.

/** Was ein Marker adressieren darf. Bewusst eng: nur Felder, die wirklich Kopien sind. */
export type FeldQuellen = {
  hf_A?: unknown
  hf_B?: unknown
  hf_C?: unknown
  kn?: unknown
  set?: unknown
  prinzip?: unknown
}

const MARKER = /<!--\s*hko:([^|\s>]+?)(?:\s*\|\s*([a-z]+))?\s*-->([\s\S]*?)<!--\s*\/hko\s*-->/g

/** `a.b[0].c` → Wert, oder undefined. Wirft nie. */
function pfad(wurzel: unknown, pfadStr: string): unknown {
  let cur: any = wurzel
  for (const teil of pfadStr.split('.')) {
    const m = /^([^[\]]+)((?:\[\d+\])*)$/.exec(teil)
    if (!m) return undefined
    if (cur == null || typeof cur !== 'object') return undefined
    cur = cur[m[1]]
    for (const idx of m[2].match(/\d+/g) ?? []) {
      if (!Array.isArray(cur)) return undefined
      cur = cur[Number(idx)]
    }
  }
  return cur
}

/** Persona-Objekt → «Lernende/r EFZ, 1. Lehrjahr — eigener Lehrbetrieb, eigener Wohnort» */
function alsPersona(v: unknown): string | null {
  if (!v || typeof v !== 'object') return null
  const p = v as { beruf?: string; betrieb?: string; ort?: string }
  if (!p.beruf) return null
  const rechts = [p.betrieb, p.ort].filter(Boolean).join(', ')
  return rechts ? `${p.beruf} — ${rechts}` : p.beruf
}

/** Fliesstext → Blockquote, so wie er im Begleiter steht. */
function alsQuote(s: string): string {
  return s.split('\n').map((z) => `> ${z}`.trimEnd()).join('\n')
}

/** Der Wert eines Markers, fertig formatiert — oder null, wenn er nicht auflösbar ist. */
export function feldWert(quellen: FeldQuellen, pfadStr: string, fmt?: string): string | null {
  const roh = pfad(quellen, pfadStr)
  if (roh == null) return null
  switch (fmt) {
    case 'persona':
      return alsPersona(roh)
    case 'quote':
      return typeof roh === 'string' ? alsQuote(roh) : null
    case 'liste':
      return Array.isArray(roh) ? roh.map((x) => `- ${String(x)}`).join('\n') : null
    // Vollständigkeits-Checkliste: eine Rasterzeile = ein Marker statt einer pro Haken.
    // Nebeneffekt, der den Ausschlag gab: Punkte, die im Markdown fehlten oder leicht
    // abwichen, erscheinen wieder vollständig — die Liste kann nicht mehr lückenhaft sein.
    case 'checkliste':
      return Array.isArray(roh) ? roh.map((x) => `☐ ${String(x)}`).join('\n') : null
    default:
      return typeof roh === 'string' || typeof roh === 'number' ? String(roh) : null
  }
}

/**
 * Ersetzt jeden `<!--hko:…-->…<!--/hko-->`-Block durch den aktuellen Wert.
 * Marker und Endmarker bleiben stehen, damit der naechste Lauf wieder greift.
 */
export function withFeldern(raw: string, quellen: FeldQuellen): string {
  if (!raw || !raw.includes('<!--hko:')) return raw
  // Der Korpus mischt LF und CRLF. Aus den JSONs kommen immer LF-Zeilen; ohne diese
  // Angleichung entstünde in einer CRLF-Datei ein Block mit fremden Zeilenenden —
  // im Editor unsichtbar, aber der Drift-Check verglich danach nie wieder gleich.
  const crlf = raw.includes('\r\n')
  const nl = (s: string) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n'))
  return raw.replace(MARKER, (ganz, pfadStr: string, fmt: string | undefined, rueckfall: string) => {
    const wert = feldWert(quellen, pfadStr, fmt)
    if (wert == null) return ganz // unaufloesbar: Rueckfall stehen lassen
    // Mehrzeilige Bloecke behalten ihre Leerzeilen um den Inhalt herum.
    const mehrzeilig = /^\s*\n/.test(rueckfall)
    const kern = nl(mehrzeilig ? `\n${wert}\n` : wert)
    const marker = `<!--hko:${pfadStr}${fmt ? `|${fmt}` : ''}-->`
    return `${marker}${kern}<!--/hko-->`
  })
}

/** Alle Marker einer Datei — fuer den Drift-Check in `scripts/check-einheiten.mjs`. */
export function markerListe(raw: string): { pfad: string; fmt?: string; rueckfall: string }[] {
  const out: { pfad: string; fmt?: string; rueckfall: string }[] = []
  for (const m of raw.matchAll(MARKER)) {
    out.push({ pfad: m[1], fmt: m[2] || undefined, rueckfall: m[3].trim() })
  }
  return out
}
