/**
 * Nutzungs-Tracking — gemeinsame Regeln für /api/track und die Auswertung.
 *
 * Die Zuordnung Pfad → (Bereich, Ressource) passiert bewusst **serverseitig**:
 * der Client schickt nur `location.pathname`, alles Weitere wird hier abgeleitet.
 * So kann kein Client den Bereich fälschen, und eine spätere Änderung der
 * Routen muss nur an dieser einen Stelle nachgezogen werden.
 *
 * Tabelle + Auswertungs-Funktionen: `supabase/migrations/018_page_events.sql`.
 */

export const TRACK_EVENTS = ['pageview', 'download', 'begleiter', 'feedback'] as const
export type TrackEvent = (typeof TRACK_EVENTS)[number]

export const TRACK_AREAS = [
  'start',
  'einheiten',
  'situationen',
  'jahresplanung',
  'lehrplan',
  'material',
  'admin',
  'auth',
  'sonstiges',
] as const
export type TrackArea = (typeof TRACK_AREAS)[number]

export const AREA_LABEL: Record<TrackArea, string> = {
  start: 'Hauptplattform',
  einheiten: 'Einheiten',
  situationen: 'Situationen',
  jahresplanung: 'Jahresplanung',
  lehrplan: 'Lehrplan / nRLP',
  material: 'Eigenes Material',
  admin: 'Admin (KT1)',
  auth: 'Login / Registrierung',
  sonstiges: 'Sonstiges',
}

export const ROLE_LABEL: Record<string, string> = {
  anon: 'Nicht angemeldet',
  lp: 'Lehrpersonen',
  kt1: 'KT1 / Admin',
  reviewer: 'Reviewer',
  gast: 'Gast (geteiltes Konto)',
}

/** Query-String und Trailing-Slash weg, Länge deckeln. */
export function normalizePath(raw: string): string {
  const path = (raw || '/').split('?')[0].split('#')[0]
  const trimmed = path.length > 1 ? path.replace(/\/+$/, '') : path
  return (trimmed || '/').slice(0, 300)
}

/**
 * Pfad → Bereich + normalisierte Ressource.
 *
 * `ref` ist absichtlich nur für **redaktionelle** Inhalte gesetzt (Einheiten-
 * Slug, Situations-ID, Thema-Nr). IDs von Nutzerdaten — eingereichte
 * Materialien, Feedback-Zeilen, Jahresplan-Instanzen — werden nie gespeichert:
 * für die Frage «welche Einheit wird genutzt» sind sie irrelevant und sie
 * würden aus der Statistik eine Personenauswertung machen.
 */
export function classifyPath(path: string): { area: TrackArea; ref: string | null } {
  const p = normalizePath(path)
  const seg = p.split('/').filter(Boolean)

  if (seg.length === 0) return { area: 'start', ref: null }

  switch (seg[0]) {
    case 'einheiten':
      // /einheiten · /einheiten/<slug> · /einheiten/<slug>/feedback
      return { area: 'einheiten', ref: seg[1] ?? null }

    case 'situationen':
      // /situationen/admin/** ist KT1-Verwaltung, kein Katalogaufruf
      if (seg[1] === 'admin') return { area: 'admin', ref: null }
      return { area: 'situationen', ref: seg[1] ?? null }

    case 'jahresplanung':
      // /jahresplanung/thema/<nr> · /jahresplanung/uebersicht
      return { area: 'jahresplanung', ref: seg[1] === 'thema' ? (seg[2] ?? null) : null }

    case 'lehrplan':
    case 'nrlp':
    case 'umsetzungsbeispiele':
      return { area: 'lehrplan', ref: null }

    case 'einreichen':
    case 'meine-materialien':
    case 'bearbeiten':
      return { area: 'material', ref: null }

    case 'admin':
      return { area: 'admin', ref: null }

    case 'login':
    case 'registrieren':
    case 'welcome':
    case 'profil-einrichten':
    case 'auth':
      return { area: 'auth', ref: null }

    default:
      return { area: 'sonstiges', ref: null }
  }
}

/**
 * Externer Referrer auf den blossen Host reduziert; interne Navigation und
 * unbrauchbare Werte fallen raus. Ganze URLs werden nie gespeichert — sie
 * können Suchbegriffe oder Tokens enthalten.
 */
export function normalizeReferrer(raw: string | null | undefined, ownHost: string): string | null {
  if (!raw) return null
  let host: string
  try {
    host = new URL(raw).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
  if (!host) return null
  if (host === ownHost.replace(/^www\./, '') || host === 'localhost') return null
  return host.slice(0, 120)
}

/**
 * Grobe Bot-Erkennung. Der Beacon braucht bereits JavaScript, was die meisten
 * Crawler ausschliesst — das hier fängt die headless-Prüfer ab, die trotzdem
 * rendern (Uptime-Checks, Link-Vorschauen).
 */
const BOT_RE =
  /bot|crawl|spider|slurp|headless|puppeteer|playwright|lighthouse|monitor|preview|scrape|curl|wget|python-requests|axios|node-fetch/i

export function looksLikeBot(userAgent: string | null | undefined): boolean {
  return !userAgent || BOT_RE.test(userAgent)
}
