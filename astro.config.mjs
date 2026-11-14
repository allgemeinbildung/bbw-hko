import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel/serverless'

export default defineConfig({
  site: 'https://bbw-hko.ch',
  output: 'server',
  // Fork-Pilot: ein Bündel ruft das Modell bis ~110 s auf, bei EBA zwei (ENTSCHEIDE F10).
  // Gilt für die eine SSR-Funktion, also für alle Routen (functionPerRoute ist aus).
  // https://vercel.com/docs/functions/configuring-functions/duration
  adapter: vercel({ maxDuration: 300 }),
  integrations: [tailwind(), react({ include: ['**/einheiten/**'] })],
})
