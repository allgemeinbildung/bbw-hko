import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { defineMiddleware } from 'astro:middleware'
import ws from 'ws'

export const onRequest = defineMiddleware(async ({ request, cookies, locals }, next) => {
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
