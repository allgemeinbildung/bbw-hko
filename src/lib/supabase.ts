import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import ws from 'ws'

export function createAdminClient() {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      realtime: { transport: ws },
    }
  )
}
