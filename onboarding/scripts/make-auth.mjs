// Programmatic Supabase login → Playwright storageState (auth.json)
// Uses @supabase/supabase-js from the project's node_modules
// Usage: node make-auth.mjs <email> <password> --out <path>
import { writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
// Load supabase-js from the project root, not the scripts folder
const require = createRequire(join(__dirname, '../../package.json'))
const { createClient } = require('@supabase/supabase-js')

const [,, email, password, ...rest] = process.argv
const outIdx = rest.indexOf('--out')
const outPath = outIdx >= 0 ? rest[outIdx + 1] : '../auth.json'

if (!email || !password) {
  console.error('Usage: node make-auth.mjs <email> <password> --out <path>')
  process.exit(1)
}

const SUPABASE_URL = 'https://mbslkjxkleiudzsbjqau.supabase.co'
const ANON_KEY = 'sb_publishable_fVnkpDtKO7k6CgsmobOHUA_lC15YKbd'

const supabase = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false },
})

const { data, error } = await supabase.auth.signInWithPassword({ email, password })

if (error || !data?.session) {
  console.error('Login failed:', error?.message ?? 'no session returned')
  process.exit(1)
}

const { access_token, refresh_token } = data.session

// @supabase/ssr stores auth as chunked cookies named:
//   sb-<project-ref>-auth-token.0  sb-<project-ref>-auth-token.1 …
// But a single non-chunked cookie also works for the SSR client.
const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0]
const cookieName = `sb-${projectRef}-auth-token`

// The SSR cookie value is a JSON array [access_token, refresh_token]
const tokenValue = JSON.stringify([access_token, refresh_token])

const storageState = {
  cookies: [
    {
      name: cookieName,
      value: tokenValue,
      domain: 'localhost',
      path: '/',
      expires: -1,
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ],
  origins: [],
}

const absOut = resolve(outPath)
writeFileSync(absOut, JSON.stringify(storageState, null, 2))
console.log(`✓ auth.json written to ${absOut}`)
console.log(`  User: ${email}  (${data.user?.id})`)
