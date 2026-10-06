// eigenes-material.ts — serverseitige Prüfung der JSONB-Felder des Bogens
// «Eigenes Material» (einheit_feedbacks, feedback_art = 'eigenes').
//
// Links und «Erweiterte Angaben» kommen als freie JSON-Objekte vom Client. Was
// hier nicht durchkommt, wird still verworfen — gespeichert wird nur die Form,
// die /eigenes-material und die KT1-Ansicht lesen.

export interface MaterialLink {
  url: string
  titel: string
}

const MAX_LINKS = 20

/**
 * Macht aus dem, was Lehrpersonen wirklich einfügen, eine Adresse: «www.bbw.ch/x»
 * ohne Schema bekommt https://, und aus eingefügtem Text mit Umbruch (OneNote
 * kopiert Web- und App-Link zusammen) zählt die erste http(s)-Adresse.
 * Dieselbe Regel steht im Formular (eigenes-material.astro, `linkBereinigen`).
 */
export function normalisiereLink(roh: string): string {
  const text = String(roh ?? '').trim()
  if (!text) return ''
  const treffer = text.match(/https?:\/\/\S+/i)
  if (treffer) return treffer[0]
  const erstes = text.split(/\s+/)[0]
  return /^[\w-]+(\.[\w-]+)+([/?#]\S*)?$/.test(erstes) ? `https://${erstes}` : text
}

/** Nur http(s)-Links; kein javascript:, kein data:. */
export function sanitizeLinks(raw: unknown): MaterialLink[] {
  if (!Array.isArray(raw)) return []
  const out: MaterialLink[] = []
  for (const l of raw.slice(0, MAX_LINKS)) {
    const url = normalisiereLink(String((l as any)?.url ?? ''))
    if (!/^https?:\/\/\S+$/i.test(url) || url.length > 2000) continue
    const titel = String((l as any)?.titel ?? '').trim().slice(0, 200)
    out.push({ url, titel })
  }
  return out
}

const str = (v: unknown, max = 4000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const strList = (v: unknown, max = 30) =>
  Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()).map((x: string) => x.trim().slice(0, 300)).slice(0, max) : []

export function sanitizeErweitert(raw: unknown): Record<string, unknown> {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const kriterien = Array.isArray(r.bewertungskriterien)
    ? r.bewertungskriterien
        .map((k: any) => ({ name: str(k?.name, 300), dimension: k?.dimension === 'SuK' ? 'SuK' : 'Ges' }))
        .filter((k) => k.name)
        .slice(0, 20)
    : []
  return {
    kompetenzversprechen: str(r.kompetenzversprechen, 600),
    schluesselkompetenzen: strList(r.schluesselkompetenzen),
    aspekte: strList(r.aspekte),
    sprachmodi_sekundaer: strList(r.sprachmodi_sekundaer),
    bewertungskriterien: kriterien,
    lehrmittel_anker: str(r.lehrmittel_anker, 600),
    scaffolds: str(r.scaffolds, 2000),
    didaktischer_kniff: str(r.didaktischer_kniff, 2000),
  }
}

/** Wendet die Prüfungen auf ein bereits gefiltertes Update-Objekt an. */
export function sanitizeEigenesPayload(update: Record<string, unknown>): void {
  if ('eigen_links' in update) update.eigen_links = sanitizeLinks(update.eigen_links)
  if ('eigen_erweitert' in update) update.eigen_erweitert = sanitizeErweitert(update.eigen_erweitert)
  if ('eigen_kompetenz_nrs' in update) update.eigen_kompetenz_nrs = strList(update.eigen_kompetenz_nrs, 20)
}
