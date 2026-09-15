import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../../lib/supabase'
import { MELDUNG_BUCKET, authoriseMeldung, json } from '../../../../lib/meldungen'

export const prerender = false

/** Meldende Person oder KT1 → 302 auf eine 60-Sekunden-Signed-URL. */
export const GET: APIRoute = async ({ locals, params }) => {
  const auth = await authoriseMeldung(locals, params.id ?? '')
  if (!auth.ok) return auth.res

  const path = auth.meldung.screenshot_path
  if (!path) return json({ error: 'Kein Screenshot vorhanden.' }, 404)

  const { data, error } = await createAdminClient()
    .storage.from(MELDUNG_BUCKET).createSignedUrl(path, 60)
  if (error || !data?.signedUrl) return json({ error: error?.message ?? 'Laden fehlgeschlagen.' }, 400)

  return new Response(null, {
    status: 302,
    headers: { Location: data.signedUrl, 'Cache-Control': 'private, no-store' },
  })
}
