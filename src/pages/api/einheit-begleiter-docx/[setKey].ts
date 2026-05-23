import type { APIRoute } from 'astro'
import { loadEinheit, einheitById } from '../../../lib/einheiten'
import { buildBegleiterBuffer } from '../../../lib/einheiten/begleiter-builder'

export const GET: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) return new Response('Unauthorized', { status: 401 })

  const setKey = params.setKey!
  const meta = einheitById(setKey)
  const fullSet = loadEinheit(setKey)

  if (!meta || !fullSet || !fullSet.begleiter?.raw) {
    return new Response('Begleitdokument nicht gefunden', { status: 404 })
  }

  // Fetch logo from the static asset origin (works in both dev and Vercel)
  const origin = new URL(request.url).origin
  const logoRes = await fetch(`${origin}/einheiten-assets/logo-bbw.png`)
  const logoPng = logoRes.ok ? await logoRes.arrayBuffer() : new ArrayBuffer(0)

  const buffer = await buildBegleiterBuffer(fullSet.begleiter.raw, logoPng)

  const filename = `${meta.kompetenz_nr}_${meta.slug}_begleiter.docx`

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
