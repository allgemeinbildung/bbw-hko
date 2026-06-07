/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null
    supabase: import('@supabase/supabase-js').SupabaseClient
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_ANON_KEY: string
  readonly SUPABASE_SERVICE_ROLE_KEY: string
  // Access codes (invitation-only registration + read-only guest view).
  // Optional: src/lib/access-codes.ts falls back to documented defaults.
  readonly REGISTER_CODE?: string
  readonly GUEST_ACCOUNT_EMAIL?: string
  readonly GUEST_ACCOUNT_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
