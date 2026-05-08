import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../lib/supabase'

export const POST: APIRoute = async ({ locals, request, redirect }) => {
  const form = await request.formData()
  const email = form.get('email') as string
  const password = form.get('password') as string
  const full_name = (form.get('full_name') as string).trim()
  const abteilung = (form.get('abteilung') as string).trim() || null

  const { data, error } = await locals.supabase.auth.signUp({ email, password })

  if (error) {
    return redirect(`/registrieren?error=${encodeURIComponent(error.message)}`)
  }

  if (data.user) {
    // The handle_new_user trigger may have already created a minimal profile row.
    // Use upsert via the admin client to write the full data regardless.
    const admin = createAdminClient()
    const { error: profileError } = await admin.from('profiles').upsert({
      id: data.user.id,
      full_name,
      abteilung,
    })
    if (profileError) {
      return redirect(`/registrieren?error=${encodeURIComponent('Profil konnte nicht erstellt werden: ' + profileError.message)}`)
    }
  }

  return redirect(
    `/registrieren?success=${encodeURIComponent('Registrierung erfolgreich! Jetzt anmelden.')}`
  )
}
