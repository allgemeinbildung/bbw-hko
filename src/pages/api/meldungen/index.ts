import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../lib/supabase'
import {
  MAX_TEXT,
  MELDUNG_BUCKET,
  SCREENSHOT_MAX_BYTES,
  SCREENSHOT_TYPES,
  getRole,
  json,
  mailAnKt1,
  type MeldungRow,
} from '../../../lib/meldungen'

export const prerender = false

const str = (v: FormDataEntryValue | null, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

/** Der Browser meldet den Typ nur — geprüft wird am Dateikopf. */
function istBild(bytes: Uint8Array, type: string): boolean {
  const b = (i: number) => bytes[i]
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to))
  switch (type) {
    case 'image/png': return b(0) === 0x89 && ascii(1, 4) === 'PNG'
    case 'image/jpeg': return b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff
    case 'image/gif': return ascii(0, 4) === 'GIF8'
    case 'image/webp': return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP'
    default: return false
  }
}

/**
 * «Problem melden»: legt ein Ticket an (Text + optionaler Screenshot) und
 * benachrichtigt KT1. Ein einziger multipart-Request — anders als die
 * Feedback-Bögen gibt es hier genau eine Zeile und höchstens eine Datei.
 */
export const POST: APIRoute = async ({ locals, request, url }) => {
  if (!locals.user) return json({ error: 'Nicht angemeldet.' }, 401)
  const role = await getRole(locals)
  if (!role || role === 'gast') return json({ error: 'Keine Berechtigung.' }, 403)

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'Ungültige Anfrage.' }, 400)
  }

  const text = str(form.get('text'), MAX_TEXT)
  if (!text) return json({ error: 'Bitte beschreibe kurz, was passiert ist.' }, 400)

  let jsFehler: string[] = []
  try {
    const raw = JSON.parse(str(form.get('js_fehler'), 5000) || '[]')
    if (Array.isArray(raw)) {
      jsFehler = raw.filter((e) => typeof e === 'string').slice(-5).map((e) => e.slice(0, 500))
    }
  } catch { /* kaputter Kontext verhindert keine Meldung */ }

  const file = form.get('screenshot')
  const shot = file instanceof File && file.size > 0 ? file : null
  let shotBytes: Uint8Array | null = null
  if (shot) {
    if (shot.size > SCREENSHOT_MAX_BYTES) return json({ error: 'Der Screenshot ist grösser als 5 MB.' }, 400)
    shotBytes = new Uint8Array(await shot.arrayBuffer())
    if (!SCREENSHOT_TYPES[shot.type] || !istBild(shotBytes, shot.type)) {
      return json({ error: 'Als Screenshot sind nur Bilder (PNG, JPG, WebP, GIF) erlaubt.' }, 400)
    }
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('meldungen')
    .insert({
      lp_id: locals.user.id,
      rolle: role,
      text,
      url: str(form.get('url'), 1000) || null,
      viewport: str(form.get('viewport'), 40) || null,
      user_agent: (request.headers.get('user-agent') ?? '').slice(0, 400) || null,
      js_fehler: jsFehler,
    })
    .select()
    .single()
  if (error || !data) return json({ error: `Speichern fehlgeschlagen: ${error?.message ?? ''}` }, 400)
  let meldung = data as MeldungRow

  if (shot && shotBytes) {
    const path = `meldungen/${locals.user.id}/${meldung.id}.${SCREENSHOT_TYPES[shot.type]}`
    const { error: upErr } = await admin.storage
      .from(MELDUNG_BUCKET)
      .upload(path, shotBytes, { contentType: shot.type, upsert: false })
    if (upErr) {
      await admin.from('meldungen').delete().eq('id', meldung.id)
      return json({ error: `Screenshot-Upload fehlgeschlagen: ${upErr.message}` }, 400)
    }
    const { data: upd } = await admin
      .from('meldungen').update({ screenshot_path: path }).eq('id', meldung.id).select().single()
    if (upd) meldung = upd as MeldungRow
  }

  await mailAnKt1(url.origin, meldung, 'neu', text)
  return json({ data: { id: meldung.id, nr: meldung.nr } }, 201)
}
