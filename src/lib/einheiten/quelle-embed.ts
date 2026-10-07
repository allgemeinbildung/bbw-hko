import type { QuelleKarte } from './types'

/**
 * Audio und Video direkt abspielen (ENTSCHEIDE E28): SRF-Beiträge mit URN laufen im
 * eingebetteten Player von SRF, Start bei `verortung.von`. Alles andere (Artikel, Grafik,
 * fremde Hosts) gibt `null` und bleibt ein Link.
 *
 * Eine Regel für beide Orte, an denen eine Quelle abgespielt wird: die QR-Seite der
 * Lernenden (`/m/<Ordner>`) und das Unterrichtsdeck. Ohne Datenimporte — läuft im Browser
 * (ZIP-Export) wie auf dem Server.
 */
export function quelleEmbedSrc(k: Pick<QuelleKarte, 'typ' | 'url' | 'urn' | 'verortung'>): string | null {
  if (k.typ !== 'audio' && k.typ !== 'video') return null
  const urn = k.urn || /[?&]urn=([^&]+)/.exec(k.url || '')?.[1]
  if (!urn || !/^urn:srf:(audio|video):[\w-]+$/.test(urn)) return null
  const m = /^(?:(\d+):)?(\d{1,2}):(\d{2})$/.exec(k.verortung?.von ?? '')
  const start = m ? (+(m[1] ?? 0)) * 3600 + +m[2] * 60 + +m[3] : 0
  return `https://www.srf.ch/play/embed?urn=${urn}&subdivisions=false${start > 0 ? `&startTime=${start}` : ''}`
}
