// kurzumfrage.ts — Semester-Schlüssel der anonymen Kurzumfrage (Migration 023).
//
// Herbstsemester = August bis Januar (Januar zählt zum HS des Vorjahres),
// Frühlingssemester = Februar bis Juli. Server und Browser rechnen dasselbe.

export function aktuellesSemester(d: Date = new Date()): string {
  const m = d.getMonth() + 1
  const y = d.getFullYear()
  if (m >= 8) return `${y}-HS`
  if (m === 1) return `${y - 1}-HS`
  return `${y}-FS`
}

export const HILFT_LABEL: Record<string, string> = {
  ja: 'Ja',
  eher_ja: 'Eher ja',
  eher_nein: 'Eher nein',
  nein: 'Nein',
}
