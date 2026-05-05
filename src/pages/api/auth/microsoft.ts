import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals, request, redirect }) => {
  const origin = new URL(request.url).origin
  const { data, error } = await locals.supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: 'email profile',
    },
  })
  if (error || !data.url) {
    return redirect(`/login?error=${encodeURIComponent('Microsoft-Login fehlgeschlagen.')}`)
  }
  return redirect(data.url)
}
