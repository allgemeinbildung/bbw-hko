/**
 * seitentext.mjs — der sichtbare Text eines exportierten v4.2-Dokuments, Seite für Seite.
 *
 *   import { seitenAusHtml } from './lib/seitentext.mjs'
 *   const seiten = seitenAusHtml(html)      // ['Text der Seite 1', 'Text der Seite 2', …]
 *
 * Eine Stelle für zwei Verbraucher: `.claude/skills/bbw-hko-heft-v42/scripts/seitentext.mjs`
 * (Paket für die Gegenleser) und `scripts/check-zeiger.mjs --export` (trägt die genannte
 * Seite das genannte Element?). Eingang ist eine Datei aus `scripts/export-v42.mjs`.
 *
 * Marken im Text: «[Schreibfeld]» = leeres Feld, «[leere Rasterzeile]» = leere
 * Tabellenzeile zum Ausfüllen, «[Bild: …]». Zeilenenden der Eingabe (LF oder CRLF) sind gleich.
 *
 * Reines Node, keine Abhängigkeiten, nur lesend.
 */

const entitaeten = (s) =>
  s
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&shy;|­|​/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))

const nackt = (s) => entitaeten(s.replace(/<[^>]+>/g, '')).trim()

/** Text eines HTML-Stücks (eine Seite), ohne Stile, Skripte und Bedienelemente. */
export function textAusHtml(html) {
  let s = html
    .replace(/\r\n?/g, '\n')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<img[^>]*class="page-head-logo"[^>]*>/gi, '')
    .replace(/<img[^>]*alt="([^"]+)"[^>]*>/gi, (_, a) => `\n[Bild: ${a}]\n`)
    .replace(/<img[^>]*>/gi, '\n[Bild]\n')
  // Eine Tabellenzeile ohne gedruckten Text ist eine Zeile zum Ausfüllen — eine Marke, nicht eine je Zelle.
  s = s.replace(/<tr[\s\S]*?<\/tr>/gi, (tr) => (nackt(tr.replace(/<textarea[\s\S]*?<\/textarea>/gi, '')) === '' ? '\n[leere Rasterzeile]\n' : tr))
  s = s
    .replace(/<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '\n[Schreibfeld]\n')
    .replace(/<[a-z0-9]+[^>]*contenteditable[^>]*>/gi, '\n[Schreibfeld]\n')
    .replace(/<input[^>]*type="checkbox"[^>]*>/gi, ' ☐ ')
    .replace(/<input[^>]*>/gi, ' [Feld] ')
    .replace(/<\/(td|th)>/gi, ' | ').replace(/<\/tr>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<h[1-6][^>]*>/gi, '\n\n## ')
    .replace(/<\/?(p|div|section|header|footer|article|table|thead|tbody|ul|ol|h[1-6]|figure|figcaption|dl|dt|dd|svg|text|g|aside|main|nav|blockquote|button)[^>]*>/gi, '\n')
    // Nebeneinander gesetzte Inline-Elemente («Persona» + Wert) nicht zusammenkleben.
    .replace(/<\/(span|strong|b|em|i|label)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
  const aus = []
  for (const roh of entitaeten(s).split('\n')) {
    const z = roh.replace(/[ \t]+/g, ' ').trim()
    const letzte = aus[aus.length - 1]
    if (z === '' && letzte === '') continue
    if (z === '[Schreibfeld]' && aus.filter(Boolean).slice(-1)[0] === '[Schreibfeld]') continue
    aus.push(z)
  }
  return aus.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/** Die Seiten (`article.a4-page`) einer exportierten Datei als Text. Leere Liste: keine Seite gefunden. */
export function seitenAusHtml(html) {
  const i = html.indexOf('<body')
  const body = (i < 0 ? html : html.slice(i)).replace(/<div class="standalone-bar"[\s\S]*?<main/i, '<main')
  return body.split(/(?=<article class="a4-page[ "])/).filter((p) => p.startsWith('<article class="a4-page')).map(textAusHtml)
}
