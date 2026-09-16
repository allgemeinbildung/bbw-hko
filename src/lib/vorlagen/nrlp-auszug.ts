// nrlp-auszug.ts — der Lehrplan-Auszug für die Vorlagen-Seite (nur Server).
//
// Die Vorlagen entstehen im Browser (docx + JSZip), also braucht der Browser den
// Lehrplan. Die drei vollen nRLP-Datensätze sind zusammen ~355 KB — zu viel für
// ein Bundle, das nur Titel, Texte, Aspekte und Sprachmodi braucht. Diese Datei
// schneidet sie auf das Nötige herunter (~95 KB für alle drei) und behält dabei
// die **Original-Feldnamen**, damit `buildKontext()` auf Auszug und Vollversion
// gleich arbeitet.
//
// Importiert die JSONs — deshalb ausschliesslich im Astro-Frontmatter benutzen,
// nie in einem <script>-Block.

import { getNrlp, supportedLehrdauer, type Lehrdauer } from '../nrlp'
import type { NrlpAuszug } from './kontext'

export type VorlagenBaum = Partial<Record<Lehrdauer, NrlpAuszug>>

function auszug(lehrdauer: Lehrdauer): NrlpAuszug | null {
  const ds = getNrlp(lehrdauer)
  if (!ds) return null
  return {
    themen: (ds.themen as any[]).map((t) => ({
      nr: t.nr,
      titel: t.titel,
      schluesselkompetenzen: t.schluesselkompetenzen || [],
      // T7 «Schlussarbeit» hat keine Lebensbezüge — das Feld fehlt dort, und die
      // Kaskade zeigt das Thema dann ohne Unterebene an.
      lebensbezuege: (t.lebensbezuege || []).map((l: any) => ({
        nr: l.nr,
        text: l.text,
        kompetenzen: (l.kompetenzen || []).map((k: any) => ({
          nr: k.nr,
          text: k.text,
          gesellschaftliche_inhalte: k.gesellschaftliche_inhalte || [],
          sprachmodi: k.sprachmodi || [],
        })),
      })),
    })),
  }
}

/** Alle verfügbaren Lehrgänge, auf das Nötige reduziert. */
export function vorlagenBaum(): VorlagenBaum {
  const out: VorlagenBaum = {}
  for (const lg of supportedLehrdauer) {
    const a = auszug(lg)
    if (a) out[lg] = a
  }
  return out
}
