// Central access-code + guest-account config.
//
// Registration is invitation-only: a new email/password account can only be
// created with the correct REGISTER_CODE. The public catalog can additionally
// be browsed read-only via a shared guest account (no code required).
//
// All values are read from environment variables so they can be rotated in
// Vercel without a code change; the defaults below are the documented values.

const env = import.meta.env

/** Invitation code required to self-register an email/password account. */
export const REGISTER_CODE = (env.REGISTER_CODE ?? 'HKO-2030').trim()

/** Email of the shared, read-only guest account (auto-provisioned on demand). */
export const GUEST_ACCOUNT_EMAIL = (env.GUEST_ACCOUNT_EMAIL ?? 'gast@bbw.ch').trim()

/** Password of the shared guest account. Override in production via env. */
export const GUEST_ACCOUNT_PASSWORD = env.GUEST_ACCOUNT_PASSWORD ?? 'gast-bbw-2030'

/** Normalises user input before comparing against a code (trim, case-insensitive). */
export function codeMatches(input: unknown, expected: string): boolean {
  if (typeof input !== 'string') return false
  return input.trim().toLowerCase() === expected.toLowerCase()
}
