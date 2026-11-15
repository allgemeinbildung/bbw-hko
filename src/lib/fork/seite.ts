/**
 * Fork-Pilot «Meine Fassung» — was die Seite `/einheiten/[setKey]` aus Fassung, Bündeln
 * und Bericht rechnet (ORCHESTRATION-fork Schritte 6–7, VERTRAG §2, §5).
 *
 * Reine Funktionen: Die Seite liest die Zeilen (eigene, über RLS), diese Datei macht daraus
 * Modus, Ersetzungen für `loadEinheit` und die `ForkProp` der Workbench-Insel.
 * Ohne Fassung oder ausserhalb von kt1 + v4.2 wird hier nichts aufgerufen (Invariante 3).
 */
import { feldFuer, warnungen as warnungenFuer, zielFelder, AUFTRAEGE } from './positivliste.ts'
import type { SpurKey } from '../einheiten/types'
import type { AuftragKey, BuendelSicht, Ersetzung, FassungBericht, FassungSicht, ForkProp } from './typen.ts'

/** Zeile aus `einheit_fassungen` (Migration 028), nur die gelesenen Spalten. */
export interface FassungZeile { nur_spur: string | null; ersetzungen: unknown }
/** Zeile aus `einheit_fassung_buendel`, nur die gelesenen Spalten. */
export interface BuendelZeile {
  id: string; heft: string; status: string; kommentare: unknown; vorschlag: unknown
  entscheide: unknown; text_pfad: string | null; created_at: string
}

const istSpur = (s: unknown): s is SpurKey => s === 'ohne_medien' || s === 'mit_medien'
const liste = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
const objekt = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {})
export const schluessel = (e: Pick<Ersetzung, 'datei' | 'pfad'>) => `${e.datei}:${e.pfad}`

/** Zeilen → Sicht, wie sie die API auch liefert (typen.ts › FassungSicht). Kein Klartext. */
export function zuFassungSicht(einheitId: string, f: FassungZeile | null, b: BuendelZeile[]): FassungSicht | null {
  if (!f) return null
  return {
    einheit_id: einheitId,
    nur_spur: istSpur(f.nur_spur) ? f.nur_spur : null,
    ersetzungen: liste<Ersetzung>(f.ersetzungen),
    buendel: b.map((z): BuendelSicht => {
      const v = z.vorschlag && typeof z.vorschlag === 'object' ? (z.vorschlag as BuendelSicht['vorschlag']) : null
      return {
        id: z.id,
        heft: z.heft as BuendelSicht['heft'],
        status: z.status as BuendelSicht['status'],
        kommentare: liste(z.kommentare),
        vorschlag: v ? { ...v, ersetzungen: liste(v.ersetzungen) } : null,
        entscheide: objekt(z.entscheide) as BuendelSicht['entscheide'],
        hat_text: !!z.text_pfad,
        created_at: z.created_at,
      }
    }),
  }
}

/** Modus aus der Query: `?vorschau=<id>` (eigenes Bündel mit Vorschlag) vor `?ansicht=fassung`. */
export function waehleModus(sicht: FassungSicht | null, ansicht: string | null, vorschauId: string | null): { modus: ForkProp['modus']; buendel?: BuendelSicht } {
  const buendel = vorschauId ? sicht?.buendel.find((b) => b.id === vorschauId && (b.vorschlag?.ersetzungen.length ?? 0) > 0) : undefined
  if (buendel) return { modus: 'vorschau', buendel }
  if (ansicht === 'fassung' && (sicht?.ersetzungen.length ?? 0) > 0) return { modus: 'fassung' }
  return { modus: 'original' }
}

/**
 * Ersetzungen für `loadEinheit`. `fassung`: die übernommenen. `vorschau`: dazu alle des
 * Vorschlags ausser den schon verworfenen; ein Pfad des Vorschlags verdrängt denselben Pfad
 * der Fassung (wie beim Übernehmen, VERTRAG §9), sonst passte sein Hash nicht mehr.
 */
export function ersetzungenFuer(sicht: FassungSicht, modus: ForkProp['modus'], buendel?: BuendelSicht): { fassung: Ersetzung[]; vorschlag: Ersetzung[] } {
  if (modus === 'original') return { fassung: [], vorschlag: [] }
  const vorschlag: Ersetzung[] = modus === 'vorschau' && buendel?.vorschlag
    ? buendel.vorschlag.ersetzungen
        .filter((e) => buendel.entscheide[schluessel(e)] !== 'verworfen')
        .map(({ begruendung: _b, ...e }) => e)
    : []
  const neu = new Set(vorschlag.map(schluessel))
  return { fassung: sicht.ersetzungen.filter((e) => !neu.has(schluessel(e))), vorschlag }
}

/** Haken für `loadEinheit`: alles ausserhalb der Positivliste wird verworfen (Invariante 4). */
export const fassungPruefer = (e: Ersetzung): string | null =>
  feldFuer(e.datei, e.pfad) ? null : 'Feld steht nicht auf der Positivliste'

/** `nur_spur` der Fassung; eine Vorschau mit eigenem Text gilt wie die Fassung nur ohne Medien (F6). */
export function nurSpurFuer(sicht: FassungSicht, vorschlag: Ersetzung[]): SpurKey | undefined {
  if (sicht.nur_spur) return sicht.nur_spur
  return vorschlag.some((e) => e.auftrag === 'eigener_text') ? 'ohne_medien' : undefined
}

/** Warnungen, bei denen Begleiter und KI-Toolbox nicht mehr passen (VERTRAG §5). */
const UNPASSEND = new Set(['situation', 'eigener_text'])
export const bausteineUnpassend = (w: { code: string }[]) => w.some((x) => UNPASSEND.has(x.code))

export function baueForkProp(a: {
  einheitId: string
  eba: boolean
  sicht: FassungSicht | null
  modus: ForkProp['modus']
  buendel?: BuendelSicht
  ersetzungen: { fassung: Ersetzung[]; vorschlag: Ersetzung[] }
  bericht: FassungBericht | null
}): ForkProp {
  // Angewendet = übergeben minus veraltet minus verworfen (Schlüssel sind nach `ersetzungenFuer` eindeutig).
  const nicht = new Set([...(a.bericht?.veraltet ?? []), ...(a.bericht?.verworfen ?? []).map((v) => v.e)].filter(Boolean).map(schluessel))
  const fassung = a.ersetzungen.fassung.filter((e) => !nicht.has(schluessel(e)))
  const vorschlag = a.ersetzungen.vorschlag.filter((e) => !nicht.has(schluessel(e)))
  const zielMuster = Object.fromEntries(
    (Object.keys(AUFTRAEGE) as AuftragKey[]).map((k) => [k, zielFelder(k).map((f) => f.muster)]),
  ) as Record<AuftragKey, string[]>
  return {
    einheitId: a.einheitId,
    modus: a.modus,
    eba: a.eba,
    fassung: a.sicht,
    ...(a.modus === 'vorschau' && a.buendel ? { vorschauBuendelId: a.buendel.id } : {}),
    geaendert: fassung.map(schluessel),
    vorgeschlagen: vorschlag.map(schluessel),
    // Selbst bearbeitete Wörter lösen keine Warnungen aus (Begleiter/KI-Toolbox bleiben im ZIP):
    // wer von Hand ändert, sieht genau, was er ändert (15.11.2026).
    warnungen: warnungenFuer([...fassung, ...vorschlag].filter((e): e is Ersetzung & { auftrag: AuftragKey } => e.auftrag !== 'manuell'))
      .filter((w) => w.code !== 'fusszeile'),
    bericht: a.bericht,
    zielMuster,
  }
}
