import type { APIRoute } from 'astro'
import { handleUpload, handleRegister, handleDelete, handleGet } from '../../../../lib/feedback-uploads'

export const POST: APIRoute = async ({ locals, request, params }) => {
  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'ID fehlt.' }), { status: 400 })
  if (!locals.user) return new Response(JSON.stringify({ error: 'Nicht angemeldet.' }), { status: 401 })
  return handleUpload(locals, request, id, 'feedbacks', locals.user.id)
}

// Direkt-Upload, Schritt 3: zu Storage hochgeladene Dateien eintragen (lib/feedback-uploads.ts).
export const PUT: APIRoute = async ({ locals, request, params }) => {
  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'ID fehlt.' }), { status: 400 })
  if (!locals.user) return new Response(JSON.stringify({ error: 'Nicht angemeldet.' }), { status: 401 })
  return handleRegister(locals, request, id, 'feedbacks', locals.user.id)
}

export const DELETE: APIRoute = async ({ locals, request, params, url }) => {
  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'ID fehlt.' }), { status: 400 })
  return handleDelete(locals, request, url, id, 'feedbacks')
}

export const GET: APIRoute = async ({ locals, params, url }) => {
  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'ID fehlt.' }), { status: 400 })
  return handleGet(locals, url, id, 'feedbacks')
}
