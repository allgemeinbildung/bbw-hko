import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel/serverless'
export default defineConfig({ site:'https://bbw-hko.ch', output:'server', adapter:vercel(),
  integrations:[tailwind(), react({ include:['**/einheiten/**'] })], vite:{ cacheDir:'/tmp/vite-verify2' } })
