/**
 * Fork-Pilot «Meine Fassung» — Auswertung der Nutzung für /admin/fassungen/nutzung.
 *
 * Reine Funktion über bereits gelesene Zeilen (die Seite liest sie mit dem Service-Role-Client
 * nach der Rollenprüfung). Läuft unter `node --test` (scripts/fork/kosten.test.mjs).
 * Fehlen die Token-Spalten (Migration 030 nicht angewendet), bleiben die Zahlen `null` —
 * die Seite zeigt dann «noch nicht erfasst».
 */
import { kostenUsd } from './kosten.ts'

export interface AufrufZeile { user_id: string; art: string; created_at: string }
export interface BuendelZeile {
  id: string; fassung_id: string; user_id: string; status: string; created_at: string
  kommentare?: { auftrag?: string }[] | null
  vorschlag?: { ersetzungen?: unknown[] } | null
  entscheide?: Record<string, string> | null
  modell?: string | null
  tokens_eingabe?: number | null; tokens_gecacht?: number | null; tokens_ausgabe?: number | null
  tokens_denken?: number | null; modell_aufrufe?: number | null; fehler_art?: string | null
}
export interface FassungZeile { id: string; user_id: string; einheit_id: string; created_at: string }

export interface Zahlen {
  modellaufrufe: number
  korrekturen: number
  buendel: number
  manuell: number
  fassungen: number
  vorschlaege: number
  angenommen: number
  verworfen: number
  offen: number
  fehler: number
  unvollstaendig: number
  /** Bündel mit Modellaufruf, aber ohne gespeicherte Tokens. */
  ohneTokens: number
  tokensEingabe: number
  tokensGecacht: number
  tokensAusgabe: number
  tokensDenken: number
  /** USD aus gespeicherten Tokens; `null`, solange keine Zahl erfasst ist. */
  kostenUsd: number | null
  /** Bündel mit Tokens, deren Modell keinen bekannten Preis hat. */
  ohnePreis: number
}

export interface Auswertung {
  personen: { user_id: string; zahlen: Zahlen }[]
  summe: Zahlen
  proTag: { tag: string; buendel: number; korrektur: number }[]
  auftraege: { auftrag: string; n: number }[]
  einheiten: { einheit_id: string; n: number }[]
  fehler: { art: string; n: number }[]
  /** Hat irgendein Bündel die Token-Spalten (Migration 030)? */
  tokenSpalten: boolean
}

const leer = (): Zahlen => ({
  modellaufrufe: 0, korrekturen: 0, buendel: 0, manuell: 0, fassungen: 0, vorschlaege: 0, angenommen: 0, verworfen: 0, offen: 0,
  fehler: 0, unvollstaendig: 0, ohneTokens: 0, tokensEingabe: 0, tokensGecacht: 0, tokensAusgabe: 0, tokensDenken: 0, kostenUsd: null, ohnePreis: 0,
})

export const istManuell = (b: BuendelZeile): boolean =>
  Array.isArray(b.kommentare) && b.kommentare.length > 0 && b.kommentare.every((k) => k?.auftrag === 'manuell')

/** Kalendertag in Europe/Zurich (JJJJ-MM-TT). */
export function zurichTag(iso: string): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Zurich', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso))
}

const sortiert = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

/**
 * Wertet Aufrufe, Bündel und Fassungen aus, die bereits auf den Zeitraum gefiltert sind.
 * `aufrufe` ist `null`, wenn `fork_aufrufe` nicht lesbar war (Migration 029 fehlt) — dann
 * zählen die Bündel mit Modell als Modellaufrufe.
 */
export function werteAus(args: { aufrufe: AufrufZeile[] | null; buendel: BuendelZeile[]; fassungen: FassungZeile[]; alleFassungen?: FassungZeile[] }): Auswertung {
  const pro = new Map<string, Zahlen>()
  const z = (uid: string) => { let x = pro.get(uid); if (!x) { x = leer(); pro.set(uid, x) } return x }
  const summe = leer()
  const beide = (uid: string, f: (x: Zahlen) => void) => { f(z(uid)); f(summe) }
  const tage = new Map<string, { buendel: number; korrektur: number }>()
  const tag = (iso: string) => { const t = zurichTag(iso); let x = tage.get(t); if (!x) { x = { buendel: 0, korrektur: 0 }; tage.set(t, x) } return x }
  const auftraege = new Map<string, number>()
  const einheiten = new Map<string, number>()
  const fehler = new Map<string, number>()
  const fassungVon = new Map((args.alleFassungen ?? args.fassungen).map((f) => [f.id, f.einheit_id]))
  let tokenSpalten = false

  if (args.aufrufe) {
    for (const a of args.aufrufe) {
      const korr = a.art === 'korrektur'
      beide(a.user_id, (x) => { x.modellaufrufe++; if (korr) x.korrekturen++ })
      tag(a.created_at)[korr ? 'korrektur' : 'buendel']++
    }
  }

  for (const b of args.buendel) {
    if ('tokens_eingabe' in b || 'modell_aufrufe' in b) tokenSpalten = true
    const einheit = fassungVon.get(b.fassung_id)
    if (einheit) einheiten.set(einheit, (einheiten.get(einheit) ?? 0) + 1)
    if (istManuell(b)) { beide(b.user_id, (x) => { x.manuell++ }); continue }
    const ers = Array.isArray(b.vorschlag?.ersetzungen) ? b.vorschlag!.ersetzungen!.length : 0
    const ent = b.entscheide && typeof b.entscheide === 'object' ? Object.values(b.entscheide) : []
    const an = ent.filter((e) => e === 'angenommen').length
    const ver = ent.filter((e) => e === 'verworfen').length
    const hatTokens = typeof b.tokens_eingabe === 'number' && typeof b.tokens_ausgabe === 'number'
    const usd = hatTokens ? kostenUsd({ eingabe: b.tokens_eingabe!, gecacht: b.tokens_gecacht ?? 0, ausgabe: b.tokens_ausgabe! }, b.modell) : null
    beide(b.user_id, (x) => {
      x.buendel++
      x.vorschlaege += ers
      x.angenommen += an
      x.verworfen += ver
      x.offen += Math.max(0, ers - an - ver)
      if (b.status === 'fehler') x.fehler++
      if (b.status === 'unvollstaendig') x.unvollstaendig++
      if (!args.aufrufe && b.modell) x.modellaufrufe += Math.max(1, b.modell_aufrufe ?? 1)
      if (hatTokens) {
        x.tokensEingabe += b.tokens_eingabe!
        x.tokensGecacht += b.tokens_gecacht ?? 0
        x.tokensAusgabe += b.tokens_ausgabe!
        x.tokensDenken += b.tokens_denken ?? 0
        if (usd === null) x.ohnePreis++
        else x.kostenUsd = (x.kostenUsd ?? 0) + usd
      } else if (b.status !== 'offen') {
        x.ohneTokens++
      }
    })
    if (!args.aufrufe && b.modell) tag(b.created_at).buendel++
    if (b.status === 'fehler') fehler.set(b.fehler_art ?? 'unbekannt', (fehler.get(b.fehler_art ?? 'unbekannt') ?? 0) + 1)
    for (const a of new Set((b.kommentare ?? []).map((k) => k?.auftrag).filter((a): a is string => !!a))) auftraege.set(a, (auftraege.get(a) ?? 0) + 1)
  }

  for (const f of args.fassungen) beide(f.user_id, (x) => { x.fassungen++ })

  return {
    personen: [...pro.entries()].map(([user_id, zahlen]) => ({ user_id, zahlen }))
      .sort((a, b) => b.zahlen.modellaufrufe - a.zahlen.modellaufrufe || b.zahlen.manuell - a.zahlen.manuell),
    summe,
    proTag: [...tage.entries()].map(([t, x]) => ({ tag: t, ...x })).sort((a, b) => a.tag.localeCompare(b.tag)),
    auftraege: sortiert(auftraege).map(([auftrag, n]) => ({ auftrag, n })),
    einheiten: sortiert(einheiten).map(([einheit_id, n]) => ({ einheit_id, n })),
    fehler: sortiert(fehler).map(([art, n]) => ({ art, n })),
    tokenSpalten,
  }
}
