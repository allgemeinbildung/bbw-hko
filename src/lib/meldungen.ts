/**
 * «Problem melden» — gemeinsame Regeln für das kleine Ticketsystem.
 *
 * Tabellen + RLS: `supabase/migrations/019_meldungen.sql`.
 * Schreiben läuft nur über /api/meldungen/** mit dem Service-Role-Client,
 * nachdem `authoriseMeldung` Besitz bzw. KT1-Rolle geprüft hat — dieselbe
 * Bauweise wie bei den Feedback-Uploads.
 *
 * Mails: an KT1 bei neuer Meldung und bei Antwort der meldenden Person
 * (Empfänger aus MELDUNGEN_EMAIL_TO, kommagetrennt); an die meldende Person bei
 * KT1-Antwort und wenn KT1 das Ticket erledigt.
 */
import { createAdminClient } from './supabase'
import { FEEDBACK_BUCKET } from './feedback-uploads'
import { sendMail } from './mail'

export const MELDUNG_BUCKET = FEEDBACK_BUCKET
export const MAX_TEXT = 5000
export const SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024
export const SCREENSHOT_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export type MeldungStatus = 'neu' | 'in_arbeit' | 'erledigt'
export const MELDUNG_STATUS: readonly MeldungStatus[] = ['neu', 'in_arbeit', 'erledigt']
export const STATUS_LABEL: Record<MeldungStatus, string> = {
  neu: 'Neu',
  in_arbeit: 'In Arbeit',
  erledigt: 'Erledigt',
}
export const STATUS_CLASS: Record<MeldungStatus, string> = {
  neu: 'bg-amber-100 text-amber-800',
  in_arbeit: 'bg-sky-100 text-sky-800',
  erledigt: 'bg-emerald-100 text-emerald-800',
}

export interface MeldungRow {
  id: string
  nr: number
  created_at: string
  updated_at: string
  lp_id: string
  rolle: string
  text: string
  url: string | null
  viewport: string | null
  user_agent: string | null
  js_fehler: string[]
  screenshot_path: string | null
  status: MeldungStatus
  wartet_auf: 'kt1' | 'meldend'
  lp_ungelesen: boolean
}

export interface AntwortRow {
  id: string
  meldung_id: string
  created_at: string
  autor_id: string | null
  von: 'meldend' | 'kt1'
  text: string
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Erste Zeile, gekürzt — für Listen und Mail-Betreffs. */
export function kurztitel(text: string, max = 70): string {
  const line = (text || '').split('\n').find((l) => l.trim())?.trim() ?? ''
  return line.length > max ? `${line.slice(0, max - 1)}…` : line
}

export function formatDatum(iso: string): string {
  return new Date(iso).toLocaleString('de-CH', {
    timeZone: 'Europe/Zurich',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export async function getRole(locals: App.Locals): Promise<string | null> {
  if (!locals.user) return null
  const { data } = await locals.supabase
    .from('profiles').select('role').eq('id', locals.user.id).single()
  return data?.role ?? null
}

type AccessResult =
  | { ok: true; meldung: MeldungRow; isKt1: boolean; isOwner: boolean }
  | { ok: false; res: Response }

/** Meldende Person oder KT1; alle anderen sehen «nicht gefunden». */
export async function authoriseMeldung(locals: App.Locals, id: string): Promise<AccessResult> {
  if (!locals.user) return { ok: false, res: json({ error: 'Nicht angemeldet.' }, 401) }
  const role = await getRole(locals)
  if (!role || role === 'gast') return { ok: false, res: json({ error: 'Keine Berechtigung.' }, 403) }

  const admin = createAdminClient()
  const { data } = await admin.from('meldungen').select('*').eq('id', id).maybeSingle()
  const isOwner = data?.lp_id === locals.user.id
  const isKt1 = role === 'kt1'
  if (!data || (!isOwner && !isKt1)) {
    return { ok: false, res: json({ error: 'Meldung nicht gefunden.' }, 404) }
  }
  return { ok: true, meldung: data as MeldungRow, isKt1, isOwner }
}

// ── Mails ───────────────────────────────────────────────────────────────────

function kt1Empfaenger(): string[] {
  return (import.meta.env.MELDUNGEN_EMAIL_TO ?? '')
    .split(/[,;\s]+/)
    .filter((a: string) => a.includes('@'))
}

async function personVon(userId: string): Promise<{ email: string | null; name: string }> {
  const admin = createAdminClient()
  const [{ data: u }, { data: p }] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin.from('profiles').select('full_name').eq('id', userId).maybeSingle(),
  ])
  const email = u?.user?.email ?? null
  return { email, name: p?.full_name || email || 'Unbekannt' }
}

export async function mailAnKt1(
  origin: string,
  m: MeldungRow,
  anlass: 'neu' | 'antwort',
  text: string,
): Promise<void> {
  const to = kt1Empfaenger()
  if (to.length === 0) {
    console.warn('[meldungen] MELDUNGEN_EMAIL_TO fehlt — keine KT1-Mail.')
    return
  }
  const person = await personVon(m.lp_id)
  const subject = anlass === 'neu'
    ? `[bbw-hko] Neue Meldung #${m.nr}: ${kurztitel(m.text, 60)}`
    : `[bbw-hko] Antwort zu Meldung #${m.nr}: ${kurztitel(m.text, 60)}`
  const zeilen = [
    anlass === 'neu' ? `${person.name} hat ein Problem gemeldet:` : `${person.name} hat geantwortet:`,
    '',
    text,
    '',
    '—',
    ...(anlass === 'neu'
      ? [
          `Seite: ${m.url ?? '–'}`,
          `Screenshot: ${m.screenshot_path ? 'ja' : 'nein'}`,
          `Browser: ${m.user_agent ?? '–'} · ${m.viewport ?? ''}`,
          ...(m.js_fehler?.length ? [`JS-Fehler: ${m.js_fehler.length}`] : []),
        ]
      : []),
    `Ticket öffnen: ${origin}/admin/meldungen/${m.id}`,
  ]
  await sendMail({ to, subject, text: zeilen.join('\n'), replyTo: person.email ?? undefined })
}

export async function mailAnMeldende(
  origin: string,
  m: MeldungRow,
  anlass: 'antwort' | 'erledigt',
  text?: string,
): Promise<void> {
  const person = await personVon(m.lp_id)
  if (!person.email) return
  const subject = anlass === 'antwort'
    ? `[bbw-hko] Antwort auf deine Meldung #${m.nr}`
    : `[bbw-hko] Deine Meldung #${m.nr} ist erledigt`
  const zeilen = [
    `Hallo ${person.name}`,
    '',
    anlass === 'antwort'
      ? 'Das Team der Materialplattform hat auf deine Meldung geantwortet:'
      : 'Deine Meldung wurde als erledigt markiert. Danke fürs Melden!',
    ...(text ? ['', text] : []),
    '',
    `Deine Meldung: «${kurztitel(m.text, 100)}»`,
    '',
    `Verlauf ansehen und antworten: ${origin}/meine-meldungen/${m.id}`,
  ]
  await sendMail({ to: person.email, subject, text: zeilen.join('\n') })
}
