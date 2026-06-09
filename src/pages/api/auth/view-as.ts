import type { APIRoute } from 'astro'
import { VIEW_AS_COOKIE } from '../../../lib/auth'

/**
 * Toggle the KT1 "LP-Ansicht" preview mode.
 *
 *   /api/auth/view-as?mode=lp     → set cookie, land on the LP hub
 *   /api/auth/view-as?mode=admin  → clear cookie, return to /admin
 *
 * Only KT1 admins may toggle; everyone else is sent home. GET is used because
 * the toggle is driven by plain `<a>` links in the chrome.
 */
export const GET: APIRoute = async ({ url, cookies, locals, redirect }) => {
  const user = locals.user
  if (!user) return redirect('/login')

  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'kt1') return redirect('/')

  const mode = url.searchParams.get('mode')
  if (mode === 'lp') {
    cookies.set(VIEW_AS_COOKIE, 'lp', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    })
    return redirect(url.searchParams.get('to') || '/')
  }

  cookies.delete(VIEW_AS_COOKIE, { path: '/' })
  return redirect(url.searchParams.get('to') || '/admin')
}
