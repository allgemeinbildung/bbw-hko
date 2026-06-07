import type { APIRoute } from 'astro'

const J = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

// GET /api/jahresplan — list the current user's plan instances
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return J({ error: 'Nicht angemeldet.' }, 401)
  const { data, error } = await locals.supabase
    .from('jahresplanung_plans')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) return J({ error: error.message }, 400)
  return J({ data })
}

// POST /api/jahresplan — create a new named plan instance for this user
export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return J({ error: 'Nicht angemeldet.' }, 401)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return J({ error: 'Ungültiges JSON.' }, 400)
  }

  const label = String(body.label ?? '').trim()
  if (!label) return J({ error: 'Bezeichnung (label) fehlt.' }, 400)

  const { data, error } = await locals.supabase
    .from('jahresplanung_plans')
    .insert({
      user_id: locals.user.id,
      label,
      schuljahr: (body.schuljahr as string) || null,
      calendar_overrides: body.calendar_overrides ?? {},
      kn_plans: body.kn_plans ?? [],
      coverage: body.coverage ?? {},
    })
    .select()
    .single()

  if (error) {
    // 23505 = unique_violation (user_id, label)
    const msg = (error as any).code === '23505'
      ? 'Es existiert bereits eine Planung mit dieser Bezeichnung.'
      : error.message
    return J({ error: msg }, 400)
  }
  return J({ data }, 201)
}
