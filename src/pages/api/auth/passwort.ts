import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user?.email) return json({ error: 'Nicht angemeldet.' }, 401)

  // The shared guest account must keep its password — otherwise one visitor
  // could lock everyone else out of the guest view.
  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', locals.user.id)
    .single()
  if (profile?.role === 'gast') return json({ error: 'Das Gastkonto hat kein eigenes Passwort.' }, 403)

  let body: { aktuell?: string; neu?: string }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Ungültiges JSON.' }, 400)
  }
  const aktuell = body.aktuell ?? ''
  const neu = body.neu ?? ''

  if (neu.length < 8) return json({ error: 'Das neue Passwort muss mindestens 8 Zeichen lang sein.' }, 400)
  if (neu === aktuell) return json({ error: 'Das neue Passwort ist gleich wie das bisherige.' }, 400)

  // Re-check the current password on a throwaway client, so an unattended
  // open session is not enough to take over the account.
  const probe = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { error: signInError } = await probe.auth.signInWithPassword({ email: locals.user.email, password: aktuell })
  if (signInError) return json({ error: 'Das bisherige Passwort stimmt nicht.' }, 400)
  await probe.auth.signOut({ scope: 'local' })

  const { error } = await locals.supabase.auth.updateUser({ password: neu })
  if (error) return json({ error: error.message }, 400)

  return new Response(null, { status: 204 })
}
