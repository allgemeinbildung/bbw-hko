import type { APIRoute } from 'astro'

const J = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

const ALLOWED = ['label', 'schuljahr', 'calendar_overrides', 'kn_plans', 'coverage'] as const

// PATCH /api/jahresplan/[id] — update own plan (RLS enforces ownership)
export const PATCH: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user) return J({ error: 'Nicht angemeldet.' }, 401)
  const id = params.id
  if (!id) return J({ error: 'id fehlt.' }, 400)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return J({ error: 'Ungültiges JSON.' }, 400)
  }

  const patch: Record<string, unknown> = {}
  for (const k of ALLOWED) if (k in body) patch[k] = body[k]
  if (Object.keys(patch).length === 0) return J({ error: 'Keine gültigen Felder.' }, 400)

  const { data, error } = await locals.supabase
    .from('jahresplanung_plans')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error) return J({ error: error.message }, 400)
  if (!data) return J({ error: 'Nicht gefunden oder kein Zugriff.' }, 404)
  return J({ data })
}

// DELETE /api/jahresplan/[id] — delete own plan
export const DELETE: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return J({ error: 'Nicht angemeldet.' }, 401)
  const id = params.id
  if (!id) return J({ error: 'id fehlt.' }, 400)

  const { error } = await locals.supabase
    .from('jahresplanung_plans')
    .delete()
    .eq('id', id)

  if (error) return J({ error: error.message }, 400)
  return J({ ok: true })
}
