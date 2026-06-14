/**
 * Jahresplanung - Kalender-Generator (ABU Reform 2030)
 * ----------------------------------------------------
 * Erzeugt einen Wochen-fuer-Woche-Schuljahresplan fuer *jedes* Lehrjahr eines
 * Lehrgangs (EFZ 3-jaehrig / EFZ 4-jaehrig / EBA 2-jaehrig) aus den nRLP-Daten.
 *
 * Einheitliche Logik:
 *   1. Schulwochen mid-Aug -> mid-Jul datieren (ISO-KW + Datumsspanne).
 *   2. Ferienwochen aus einer KW-Tabelle markieren (pro Schuljahr ueberschreibbar).
 *   3. Themen des Lehrjahrs chronologisch ueber die Unterrichtswochen verteilen,
 *      proportional zu den Lektionen (Fallback: gleichmaessig, z.B. EBA ohne
 *      LB-Lektionen), mit Puffer am Ende jedes Themenblocks und KN-Marker.
 *
 * Farbintensitaet (`tier` 1..3) zykliert, damit auch Jahre mit 4 Themen (EBA:
 * 2 Themen pro Semester) sauber eingefaerbt werden.
 *
 * Rein (kein JSON-Import): das nRLP-Dataset wird injiziert -> Node-testbar.
 */

export type Lehrgang = 'EFZ-3J' | 'EFZ-4J' | 'EBA'
export type CellType = 'teaching' | 'buffer' | 'holiday'

export interface WeekCell {
  n: number
  kw: number
  datum: string
  month: string
  trimester: string
  pos: number | null
  tier: number | null
  thema: number | null
  themaTitel?: string
  lessons: number
  type: CellType
  title: string
  lb?: string
  note?: string
  isKn?: boolean
}

export interface ThemaSummary {
  nr: number
  pos: number
  tier: number
  titel: string
  lektionen: number
  puffer: number
  intensity: 'light' | 'medium' | 'dark'
  perioden: string[]
}

export interface YearStats {
  schulwochen: number
  verfuegbar: number
  unterricht: number
  puffer: number
  ferienwochen: number
}

export interface YearPlan {
  lehrgang: Lehrgang
  lehrjahr: number
  schuljahr: string
  calendar: WeekCell[]
  themas: ThemaSummary[]
  stats: YearStats
  themeKeys: string[]
  isSchlussarbeitYear: boolean
}

const MONTHS_FULL = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]
const MONTHS_ABBR = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

/** ISO-8601-Kalenderwoche eines Datums. */
function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/** Erster Montag am/nach dem 15. August (Schuljahresbeginn ZH, ~18. Aug). */
function firstSchoolMonday(year: number): Date {
  const d = new Date(year, 7, 15)
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1)
  return d
}

function fmtSpan(monday: Date): string {
  const fri = new Date(monday)
  fri.setDate(fri.getDate() + 4)
  const mM = MONTHS_ABBR[monday.getMonth()]
  const fM = MONTHS_ABBR[fri.getMonth()]
  if (monday.getMonth() === fri.getMonth()) {
    return `${monday.getDate()}.–${fri.getDate()}. ${mM}`
  }
  return `${monday.getDate()}. ${mM} – ${fri.getDate()}. ${fM}`
}

// Ferien-Modell (ZH-Muster): Herbst (2), Weihnacht (2), Sport (2), Fruehling (2).
const DEFAULT_HOLIDAY_KWS = [41, 42, 52, 1, 6, 7, 16, 17]
const HOLIDAY_OVERRIDES: Record<string, number[]> = {
  '2025/26': [41, 42, 52, 1, 6, 7, 17, 18],
}
function holidayLabel(kw: number): string {
  if (kw === 41 || kw === 42) return 'Herbstferien'
  if (kw === 52 || kw === 1) return 'Weihnachtsferien'
  if (kw === 6 || kw === 7) return 'Sportferien'
  return 'Frühlingsferien'
}

/** Parse "2025/26" -> Startjahr 2025. */
export function schuljahrStartYear(schuljahr: string): number {
  const m = /(\d{4})/.exec(schuljahr)
  return m ? parseInt(m[1], 10) : new Date().getFullYear()
}

/** Default-Schuljahr-Label fuer ein Lehrjahr, ab Kohort-Startjahr. */
export function defaultSchuljahr(startYear: number, lehrjahr: number): string {
  const y = startYear + (lehrjahr - 1)
  return `${y}/${String((y + 1) % 100).padStart(2, '0')}`
}

/** Verteilt `total` ganzzahlig auf Gewichte, Summe bleibt exakt `total`. */
function apportion(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1
  const raw = weights.map((w) => (w / sum) * total)
  const floored = raw.map((x) => Math.floor(x))
  let rest = total - floored.reduce((a, b) => a + b, 0)
  const order = raw
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac)
  for (let k = 0; k < order.length && rest > 0; k++, rest--) floored[order[k].i]++
  return floored
}

function truncate(s: string, n: number): string {
  const clean = (s ?? '').trim()
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + '…' : clean
}

export function themesForYear(nrlp: any, lehrjahr: number): any[] {
  return ((nrlp?.themen ?? []) as any[])
    .filter((t) => Number(t.lehrjahr) === Number(lehrjahr))
    .sort((a, b) => a.nr - b.nr)
}

function themaLektionen(t: any): number {
  const lbs = (t.lebensbezuege ?? []) as any[]
  const fromLb = lbs.reduce((s, lb) => s + (Number(lb.lektionen) || 0), 0)
  return fromLb || Number(t.lektionen) || 0
}

const SA_TITLES = [
  'Schlussarbeit – Themenwahl & Disposition',
  'Schlussarbeit – Recherche & Prozess',
  'Schlussarbeit – Produkt erarbeiten',
  'Schlussarbeit – Produkt finalisieren',
  'Schlussarbeit – Präsentation',
]

/** Farb-Tier 1..3 (zykliert) fuer die Position im Jahr. */
function tierOf(pos: number): number {
  return ((pos - 1) % 3) + 1
}

/** Baut den Jahresplan fuer (lehrgang, lehrjahr, schuljahr). */
export function buildCalendar(
  nrlp: any,
  lehrgang: Lehrgang,
  lehrjahr: number,
  schuljahr: string,
): YearPlan {
  const startYear = schuljahrStartYear(schuljahr)
  const holidayKws = new Set(HOLIDAY_OVERRIDES[schuljahr] ?? DEFAULT_HOLIDAY_KWS)

  const skeleton: WeekCell[] = []
  const monday = firstSchoolMonday(startYear)
  const cutoff = new Date(startYear + 1, 6, 13)
  let n = 0
  while (monday < cutoff && n < 47) {
    n++
    const kw = isoWeek(monday)
    const isHol = holidayKws.has(kw)
    skeleton.push({
      n,
      kw,
      datum: fmtSpan(monday),
      month: MONTHS_FULL[monday.getMonth()],
      trimester: '',
      pos: null,
      tier: null,
      thema: null,
      lessons: isHol ? 0 : 3,
      type: isHol ? 'holiday' : 'teaching',
      title: isHol ? holidayLabel(kw) : '',
    })
    monday.setDate(monday.getDate() + 7)
  }

  const themes = themesForYear(nrlp, lehrjahr)
  const teachWeeks = skeleton.filter((w) => w.type !== 'holiday')
  const lekWeights = themes.map((t) => themaLektionen(t) || 1)
  const weeksPerThema = apportion(lekWeights, teachWeeks.length)

  const themas: ThemaSummary[] = []
  let cursor = 0
  themes.forEach((t, ti) => {
    const pos = ti + 1
    const tier = tierOf(pos)
    const W = weeksPerThema[ti]
    const block = teachWeeks.slice(cursor, cursor + W)
    cursor += W
    const isSA = (t.lebensbezuege ?? []).length === 0

    let puffer = isSA ? 0 : W >= 3 ? Math.max(1, Math.round(W * 0.22)) : 0
    if (puffer >= W) puffer = W - 1
    const teaching = W - puffer
    const teachCells = block.slice(0, teaching)
    const bufferCells = block.slice(teaching)

    const intensity: ThemaSummary['intensity'] = tier === 1 ? 'light' : tier === 2 ? 'medium' : 'dark'

    if (isSA) {
      teachCells.forEach((c, i) => {
        c.pos = pos
        c.tier = tier
        c.thema = t.nr
        c.themaTitel = t.titel
        c.trimester = 'T' + pos
        c.title = SA_TITLES[Math.min(i, SA_TITLES.length - 1)]
      })
      themas.push({
        nr: t.nr, pos, tier, titel: t.titel,
        lektionen: teaching * 3, puffer: 0, intensity,
        perioden: ['Prozess – Produkt – Präsentation über das Semester'],
      })
      return
    }

    const lbs = (t.lebensbezuege ?? []) as any[]
    const lbWeeks = apportion(lbs.map((lb) => Number(lb.lektionen) || 1), teachCells.length)
    let ci = 0
    const perioden: string[] = []
    lbs.forEach((lb, li) => {
      const cnt = lbWeeks[li]
      for (let k = 0; k < cnt; k++) {
        const c = teachCells[ci++]
        if (!c) break
        c.pos = pos
        c.tier = tier
        c.thema = t.nr
        c.themaTitel = t.titel
        c.trimester = 'T' + pos
        c.lb = lb.nr
        c.title = `${lb.nr} ${truncate(lb.text ?? '', 26)}`
      }
      if (cnt > 0) perioden.push(`${lb.nr} ${truncate(lb.text ?? '', 30)}`)
    })
    const last = teachCells[teachCells.length - 1]
    if (last) {
      last.isKn = true
      last.note = `Kompetenznachweis ${t.nr}`
    }
    bufferCells.forEach((c) => {
      c.pos = pos
      c.tier = tier
      c.thema = t.nr
      c.themaTitel = t.titel
      c.trimester = 'T' + pos
      c.type = 'buffer'
      c.title = `T${t.nr} Puffer / Repetition`
    })

    themas.push({
      nr: t.nr, pos, tier, titel: t.titel,
      lektionen: teaching * 3, puffer: puffer * 3, intensity, perioden,
    })
  })

  const stats: YearStats = {
    schulwochen: teachWeeks.length,
    verfuegbar: teachWeeks.length * 3,
    unterricht: skeleton.filter((w) => w.type === 'teaching').reduce((s, w) => s + w.lessons, 0),
    puffer: skeleton.filter((w) => w.type === 'buffer').reduce((s, w) => s + w.lessons, 0),
    ferienwochen: skeleton.filter((w) => w.type === 'holiday').length,
  }

  return {
    lehrgang,
    lehrjahr,
    schuljahr,
    calendar: skeleton,
    themas,
    stats,
    themeKeys: themes.map((t) => 'T' + t.nr),
    isSchlussarbeitYear: themes.some((t) => (t.lebensbezuege ?? []).length === 0),
  }
}

/** Wie viele Lehrjahre hat ein Lehrgang. */
export function lehrjahreOf(lehrgang: Lehrgang): number {
  return lehrgang === 'EBA' ? 2 : lehrgang === 'EFZ-4J' ? 4 : 3
}

/** Anzeige-Label eines Lehrgangs. */
export function lehrgangLabel(lehrgang: Lehrgang): string {
  return lehrgang === 'EBA' ? 'EBA 2-Jährige' : lehrgang === 'EFZ-4J' ? 'EFZ 4-Jährige' : 'EFZ 3-Jährige'
}

/** Liste aller unterstützten Lehrgänge (für Switcher). */
export const ALL_LEHRGAENGE: { value: Lehrgang; label: string }[] = [
  { value: 'EFZ-3J', label: 'EFZ 3-Jährige' },
  { value: 'EFZ-4J', label: 'EFZ 4-Jährige' },
  { value: 'EBA', label: 'EBA 2-Jährige' },
]

/** Normalisiert einen rohen Query-Param zu einem gültigen Lehrgang. */
export function parseLehrgang(raw: string | null | undefined): Lehrgang {
  return raw === 'EFZ-4J' ? 'EFZ-4J' : raw === 'EBA' ? 'EBA' : 'EFZ-3J'
}
