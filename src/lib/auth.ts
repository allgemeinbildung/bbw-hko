import type { AstroGlobal } from 'astro'

/**
 * Cookie that lets a KT1 admin temporarily browse the LP-facing view
 * ("LP-Ansicht"). Set to `'lp'` by `/api/auth/view-as?mode=lp`, cleared by
 * `?mode=admin`. Only honoured for users whose real role is `kt1`.
 */
export const VIEW_AS_COOKIE = 'view_as'

export type Role = 'lp' | 'kt1' | 'gast' | 'reviewer'

export interface Access {
  user: NonNullable<App.Locals['user']>
  /** The real role from the `profiles` table. */
  role: Role | null
  /** Abteilung from the profile (used by the intake form). */
  abteilung: string | null
  /** True when a KT1 admin is currently in LP-Ansicht preview mode. */
  previewingAsLp: boolean
}

/**
 * Resolve the logged-in user, their profile role, and whether a KT1 admin is
 * currently previewing the LP view (cookie `view_as=lp`).
 *
 * Returns `null` when nobody is authenticated — the caller decides where to
 * redirect (`/login` vs `/welcome`).
 *
 * Replaces the ad-hoc `select('role')` + `redirect('/admin')` blocks that were
 * duplicated across the LP-facing pages, so the view-as logic lives in one spot.
 */
export async function getAccess(Astro: AstroGlobal): Promise<Access | null> {
  const user = Astro.locals.user
  if (!user) return null

  const { data: profile } = await Astro.locals.supabase
    .from('profiles')
    .select('role, abteilung')
    .eq('id', user.id)
    .single()

  const role = (profile?.role ?? null) as Role | null
  const previewingAsLp =
    role === 'kt1' && Astro.cookies.get(VIEW_AS_COOKIE)?.value === 'lp'

  return { user, role, abteilung: profile?.abteilung ?? null, previewingAsLp }
}

/**
 * Guard for LP-only pages: a KT1 admin is bounced to `/admin` UNLESS they have
 * opted into LP-Ansicht. Returns a redirect Response to return from the page
 * frontmatter, or `null` when the KT1 admin may stay (preview mode).
 */
export function bounceKt1(Astro: AstroGlobal, access: Access, to = '/admin') {
  if (access.role === 'kt1' && !access.previewingAsLp) return Astro.redirect(to)
  return null
}
