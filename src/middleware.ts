import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { defineMiddleware } from 'astro:middleware'
import ws from 'ws'

export const onRequest = defineMiddleware(async ({ request, cookies, locals }, next) => {
  // Canonical host: force the old Vercel deployment URL onto the custom domain.
  // Vercel cannot redirect the auto-assigned *.vercel.app domain itself, so we do it here.
  const reqUrl = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? reqUrl.host
  if (host === 'bbw-hko.vercel.app') {
    return Response.redirect(`https://bbw-hko.ch${reqUrl.pathname}${reqUrl.search}`, 308)
  }

  locals.supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => parseCookieHeader(request.headers.get('Cookie') ?? ''),
        setAll: (cs) =>
          cs.forEach(({ name, value, options }) =>
            cookies.set(name, value, options as Parameters<typeof cookies.set>[2])
          ),
      },
      realtime: { transport: ws },
    }
  )

  const {
    data: { user },
  } = await locals.supabase.auth.getUser()
  locals.user = user

  return next()
})
