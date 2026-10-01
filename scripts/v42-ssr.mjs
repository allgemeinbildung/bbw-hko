// v42-ssr.mjs — gemeinsamer Unterbau der v4.2-Prüfskripte (bestand-v42, export-v42).
//
// Die Renderer (DocS.tsx, docx-builder.ts) und `loadEinheit` hängen an
// `import.meta.glob` und an TSX — beides kann Node allein nicht. Ein Vite-Server
// im Middleware-Modus (ohne Port, ohne Watcher, ohne HMR) lädt sie über
// `ssrLoadModule` genau so, wie Astro sie im Build sieht. Kein Dev-Server.

import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))

/** Startet Vite im Middleware-Modus. Aufrufer schliessen mit `server.close()`. */
export async function startSsr() {
  const require = createRequire(resolve(ROOT, 'package.json'))
  const vite = await import(pathToFileURL(require.resolve('vite')).href.replace('index.cjs', 'dist/node/index.js'))
  return vite.createServer({
    root: ROOT,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    // tsconfig (astro/strict) sagt `jsx: preserve` — für Node muss TSX zu Aufrufen werden.
    esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  })
}
