import type { APIRoute } from 'astro'

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
    const { error: profileError } = await locals.supabase.from('profiles').insert({
      id: data.user.id,
      full_name,
      abteilung,
      role: 'lp',
    })
    if (profileError) {
      return redirect(`/registrieren?error=${encodeURIComponent('Profil konnte nicht erstellt werden: ' + profileError.message)}`)
    }
  }

  return redirect(
    `/registrieren?success=${encodeURIComponent('Registrierung erfolgreich! Bitte E-Mail-Adresse bestätigen, dann anmelden.')}`
  )
}
