import type { APIRoute } from 'astro'
import { createAdminClient } from '../../lib/supabase'
import {
  TRACK_EVENTS,
  classifyPath,
  looksLikeBot,
  normalizePath,
  normalizeReferrer,
  type TrackEvent,
} from '../../lib/tracking'

export const prerender = false

/**
 * Beacon-Empfänger für das eigene Nutzungs-Tracking.
 *
 * Bewusst offen für nicht angemeldete Aufrufe: die Frage «wie viele Leute
 * besuchen bbw-hko.ch» schliesst alle ein, die auf /welcome landen und sich nie
 * anmelden. Die Rolle wird serverseitig aus dem Profil gelesen, nie vom Client
 * übernommen.
 *
 * Geschrieben wird mit dem Service-Role-Client, weil `page_events` absichtlich
 * keine insert-Policy hat (siehe Migration 018) — dieselbe Bauweise wie beim
 * Zusatzmaterialien-Upload: Prüfung im Code, Tabelle nach aussen dicht.
 *
 * Antwortet immer 204 und schluckt Fehler: ein Statistik-Ausfall darf niemals
 * eine Seite kaputtmachen.
 */
export const POST: APIRoute = async ({ request, locals, url }) => {
  const done = () => new Response(null, { status: 204 })

  try {
    if (looksLikeBot(request.headers.get('user-agent'))) return done()
    // Lokale Entwicklung nicht mitzählen — sonst verfälscht jede HMR-Runde die
    // Zahlen von bbw-hko.ch.
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return done()

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') return done()

    const sid = typeof body.sid === 'string' ? body.sid.slice(0, 64) : ''
    if (!sid) return done()
    const vid = typeof body.vid === 'string' ? body.vid.slice(0, 64) || null : null

    const event: TrackEvent = TRACK_EVENTS.includes(body.event) ? body.event : 'pageview'
    const path = normalizePath(typeof body.path === 'string' ? body.path : '/')
    const { area, ref } = classifyPath(path)

    // Meta ist frei, aber gedeckelt — sonst wird das Feld zur Mülltonne.
    let meta: Record<string, unknown> = {}
    if (body.meta && typeof body.meta === 'object' && !Array.isArray(body.meta)) {
      const json = JSON.stringify(body.meta)
      if (json.length <= 1000) meta = body.meta
    }

    const admin = createAdminClient()

    // Rolle aus dem Profil, nicht aus dem Request. `locals.user` steht dank
    // Middleware auch hier zur Verfügung.
    let userId: string | null = null
    let role = 'anon'
    if (locals.user) {
      const { data } = await admin
        .from('profiles')
        .select('role')
        .eq('id', locals.user.id)
        .single()
      if (data) {
        // Nur mit vorhandener Profilzeile setzen — `user_id` hat einen FK auf
        // `profiles`, ein fehlendes Profil würde sonst das Event verwerfen.
        userId = locals.user.id
        const r = data.role
        role = r === 'kt1' || r === 'gast' || r === 'reviewer' ? r : 'lp'
      }
    }

    await admin.from('page_events').insert({
      session_id: sid,
      visitor_id: vid,
      user_id: userId,
      role,
      event,
      area,
      path,
      ref,
      referrer: normalizeReferrer(body.referrer, url.hostname),
      meta,
    })
  } catch (e) {
    console.warn('[track] verworfen:', (e as Error)?.message)
  }

  return done()
}
