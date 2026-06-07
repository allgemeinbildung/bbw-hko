import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../lib/supabase'
import {
  GUEST_ACCOUNT_EMAIL,
  GUEST_ACCOUNT_PASSWORD,
} from '../../../lib/access-codes'

// Read-only guest access (no code required).
//
// A single shared Supabase account (GUEST_ACCOUNT_EMAIL, role 'gast') backs the
// guest view. This endpoint auto-provisions that account on first use (so no
// manual dashboard step is needed), ensures its profile role is 'gast', then
// signs the visitor in and lands them on the Hauptplattform-Hub. Write access
// is blocked in the UI and by RLS.

const GUEST_FAIL = (msg: string) =>
  `/welcome?guest_error=${encodeURIComponent(msg)}`

export const POST: APIRoute = async ({ locals, redirect }) => {
  const email = GUEST_ACCOUNT_EMAIL
  const password = GUEST_ACCOUNT_PASSWORD

  // 1) Try a normal sign-in first (account already exists, password matches).
  let signIn = await locals.supabase.auth.signInWithPassword({ email, password })

  // 2) If that fails, (re)provision the shared account via the admin client.
  if (signIn.error) {
    const admin = createAdminClient()

    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Gast (BBW)' },
    })

    let guestId: string | undefined = created.data?.user?.id

    // Already existed (e.g. password drifted) → reset password + confirm.
    if (created.error) {
      const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
      const existing = list?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      )
      if (existing) {
        guestId = existing.id
        await admin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
        })
      }
    }

    // Ensure the profile row carries role 'gast' (the trigger also does this,
    // but upsert here makes it robust regardless of migration ordering).
    if (guestId) {
      await admin
        .from('profiles')
        .upsert({ id: guestId, full_name: 'Gast (BBW)', role: 'gast' })
    }

    // Retry the cookie-setting sign-in on the per-request client.
    signIn = await locals.supabase.auth.signInWithPassword({ email, password })
  }

  if (signIn.error) {
    return redirect(GUEST_FAIL('Gast-Zugang derzeit nicht verfügbar. Bitte später erneut versuchen.'))
  }

  return redirect('/')
}
