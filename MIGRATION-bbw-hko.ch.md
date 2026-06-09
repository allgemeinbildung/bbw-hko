# Migration Handoff: `bbw-hko.vercel.app` → `bbw-hko.ch`

**Goal:** Serve the existing Vercel app on the custom domain **`bbw-hko.ch`** (apex), bought at Hostpoint, as the new canonical address. `www.bbw-hko.ch` redirects to the apex. The old `bbw-hko.vercel.app` keeps working automatically (Vercel never removes it) and acts as a fallback.

**Who does what:**
- **Part A** = you, by hand, in three dashboards (Hostpoint, Vercel, Supabase). No code.
- **Part B** = Claude Code, in the repo (cosmetic URL references + one optional config line).
- **Part C** = the order to do it in, plus how to verify and roll back.

> The app code itself needs **no functional change**. `src/pages/api/auth/microsoft.ts` builds the OAuth redirect from the live request origin, so login follows whatever domain serves the page. The only blocker is config in the three dashboards — chiefly Supabase's redirect allow-list.

---

## Key facts you'll need

| Thing | Value |
|---|---|
| Canonical domain | `bbw-hko.ch` (apex / root) |
| Redirect | `www.bbw-hko.ch` → `https://bbw-hko.ch` |
| Apex DNS record | **A record** (apex can't be a CNAME) → IP that **Vercel shows you** |
| www DNS record | **CNAME** → hostname that **Vercel shows you** |
| Vercel default values (fallback) | A: `76.76.21.21` · CNAME: `cname.vercel-dns.com` — still valid, but Vercel now shows a project-specific value like `xyz.vercel-dns-016.com`; **always use exactly what the Vercel dashboard displays** |
| SSL | Issued automatically by Vercel (Let's Encrypt) once DNS verifies |
| Supabase project | Authentication → **URL Configuration** (Site URL + Redirect URLs) |
| Azure / Microsoft login | **No change** — Azure points at Supabase's callback, not at your domain |

---

## Part A — Dashboard steps (you)

### A1. Vercel — add the domain first

Do this before DNS so Vercel can show you the exact records to enter.

1. Vercel → your project → **Settings → Domains**.
2. Add `bbw-hko.ch` → **Add**.
3. Add `www.bbw-hko.ch` as well.
4. Set **`bbw-hko.ch` as the primary domain**, and configure **`www.bbw-hko.ch` to redirect to it** (Vercel offers "Redirect to bbw-hko.ch" — choose it).
5. Vercel now displays the DNS records it expects. **Write these two down exactly:**
   - Apex `bbw-hko.ch` → **A** record, value = the IP Vercel shows (e.g. `76.76.21.21`).
   - `www` → **CNAME** record, value = the hostname Vercel shows (e.g. `cname.vercel-dns.com` or `xyz.vercel-dns-016.com`).

Leave this tab open; the domains will sit at "Invalid Configuration" until DNS propagates.

### A2. Hostpoint — point DNS at Vercel

Source: [Hostpoint – DNS-Zone manuell bearbeiten](https://support.hostpoint.ch/de/technisches/dns/dns-aenderungen/dns-zone-manuell-bearbeiten)

1. Log in to the [Hostpoint Control Panel](https://admin.hostpoint.ch) with your Hostpoint ID.
2. **Domains → «DNS-Zone bearbeiten»** for `bbw-hko.ch`.
3. **Apex (root) record:**
   - Find the existing **A** record with an **empty Name** (the Hauptdomain). Hostpoint usually pre-fills this with one of its own web-hosting IPs.
   - **Edit it** so the IP = the A value from step A1 (e.g. `76.76.21.21`). If there's no apex A record, use **«Neuer Record hinzufügen»**: Record-Typ `A`, Name *empty*, TTL `3600`, IP = Vercel's A value.
4. **www record:**
   - Add/edit a **CNAME**: Record-Typ `CNAME`, Name `www`, TTL `3600`, value = the CNAME hostname from step A1 (include the trailing dot if Hostpoint requires it).
   - If a conflicting `www` **A** record already exists, delete it — a name can't be both A and CNAME.
5. **Remove IPv6 traps:** delete any **AAAA** records on the apex (empty Name) **and** on `www` that point at Hostpoint. If an AAAA stays, IPv6-preferring browsers will reach Hostpoint instead of Vercel and you'll see intermittent "wrong site" behaviour.
6. **Don't touch** MX records unless you intend to run email on this domain. The app doesn't need them.
7. Click **«Jetzt ausführen»** to save — new/changed records appear *italic* until you do.

> **Nameservers:** keep Hostpoint's default nameservers. You're only editing the zone, not delegating it elsewhere.

> **TTL & propagation:** changes are usually live within minutes to a couple of hours. If you want a faster cutover, you could lower TTL to `300` a day ahead — optional.

### A3. Supabase — fix the auth URLs (the step people forget)

If you skip this, the site loads on `bbw-hko.ch` but **Microsoft login and any email/reset links bounce to the old domain or fail.**

1. Supabase dashboard → your project → **Authentication → URL Configuration**.
2. **Site URL:** change to `https://bbw-hko.ch`.
3. **Redirect URLs (allow-list):** add — keep the old ones during the transition:
   - `https://bbw-hko.ch/**`
   - `https://www.bbw-hko.ch/**`
   - `https://bbw-hko.vercel.app/**` (leave this until cutover is confirmed)
4. Save.

> **Azure / Microsoft (`/api/auth/microsoft`):** no change needed. The flow is browser → Supabase → Azure → Supabase → your app. Azure's registered redirect URI points at **Supabase's** callback (`https://<project-ref>.supabase.co/auth/v1/callback`), which is independent of your domain. Your app's `redirectTo` (`${origin}/auth/callback`) only needs to be in the Supabase allow-list above — which step A3.3 handles.

---

## Part B — Repo changes (Claude Code)

These are **cosmetic / correctness** only; nothing here blocks the migration. Run them on a branch and redeploy after Part A is verified.

> **Prompt for Claude Code:**
> "Replace every user-facing reference to `bbw-hko.vercel.app` with `bbw-hko.ch` across the onboarding assets, add the canonical `site` to the Astro config, and update the deploy-URL mention in CLAUDE.md. Do not change auth logic. Then run `npm run build` to confirm it compiles."

### B1. Astro canonical (recommended)
`astro.config.mjs` — add the `site` so any future canonical tags / sitemap use the real domain:
```js
export default defineConfig({
  site: 'https://bbw-hko.ch',
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind(), react({ include: ['**/einheiten/**'] })],
})
```

### B2. Onboarding URL references
Replace `bbw-hko.vercel.app` → `bbw-hko.ch` (also `https://bbw-hko.vercel.app` → `https://bbw-hko.ch`) in:

- **Source of truth (edit these):**
  - `onboarding/flows/einreichen.json` — `productionBaseUrl`
  - `onboarding/flows/jahresplanung.json` — `productionBaseUrl`
  - `onboarding/flows/platform-overview.json` — `productionBaseUrl` **and** the step-1 caption text
- **Served copies users actually see (must be updated too):**
  - `public/onboarding/guide-einreichen.html`
  - `public/onboarding/guide-jahresplanung.html`
  - (plus any other `public/onboarding/*.html`)
- **Generated guides (regenerate, or find-replace if you won't rebuild):**
  - `onboarding/output/**/guide.{html,md}`
  - `onboarding/scripts/output/**/guide.{html,md}`

If the onboarding guides are produced by a generator, re-run it after editing the flow JSONs so the generated copies and `public/onboarding/` stay in sync; otherwise do a plain find-and-replace across the files above.

### B3. Docs
- `CLAUDE.md` mentions the deploy target as `bbw-hko.vercel.app` — update to note `bbw-hko.ch` is the canonical domain (Vercel URL still active as fallback). Optional, doc-only.

### B4. Confirmed — no change needed
- `src/pages/api/auth/microsoft.ts` — uses dynamic `origin`. ✅ Leave as is.
- `src/pages/auth/callback.astro` — relative redirects only. ✅
- No `PUBLIC_SITE_URL` / hardcoded origin env var exists. ✅ No Vercel env var to add.

---

## Part C — Cutover order, verification, rollback

### Recommended sequence (minimises broken logins)
1. **A1** add both domains in Vercel, set apex primary + www→apex redirect.
2. **A2** enter the A + CNAME at Hostpoint; remove conflicting AAAA.
3. Wait until Vercel shows both domains **Valid** and SSL is issued.
4. **A3** add the new URLs to the Supabase allow-list **and** switch Site URL to `https://bbw-hko.ch` (keep `vercel.app` in the allow-list).
5. Test every flow on `https://bbw-hko.ch` (checklist below).
6. **B** merge the repo URL updates and redeploy.
7. Once stable for a few days, optionally drop `bbw-hko.vercel.app/**` from the Supabase allow-list. (The `.vercel.app` URL itself stays alive on Vercel regardless.)

### Verification checklist (on `https://bbw-hko.ch`)
- [ ] `https://bbw-hko.ch` loads the app with a valid padlock (SSL).
- [ ] `https://www.bbw-hko.ch` **redirects** to `https://bbw-hko.ch`.
- [ ] `http://bbw-hko.ch` upgrades to `https://`.
- [ ] **Microsoft login** completes and lands back on `bbw-hko.ch` (not the vercel.app URL).
- [ ] Email/password login works; password-reset link (if used) points to `bbw-hko.ch`.
- [ ] Guest ("Als Gast ansehen") flow works.
- [ ] A protected page (e.g. `/admin` as KT1, `/einreichen` as LP) loads after login.
- [ ] File upload + signed-URL download (Zusatzmaterialien) works.
- [ ] Onboarding guide links show `bbw-hko.ch` (after Part B).

### Troubleshooting
- **Vercel stuck on "Invalid Configuration":** DNS hasn't propagated, or the A/CNAME value doesn't match exactly what Vercel shows. Re-check at [dnschecker.org](https://dnschecker.org). Confirm you used Vercel's *project-specific* value.
- **Site loads on Hostpoint's placeholder, not the app:** a leftover **A or AAAA** record still points at Hostpoint. Remove it.
- **SSL won't issue / "certificate" error:** a **CAA** record may be restricting certificate authorities. Either remove the CAA on the apex or add one allowing `letsencrypt.org`. Then re-verify in Vercel.
- **Microsoft login bounces to the old URL or errors:** the new domain isn't in Supabase's Redirect URLs, or Site URL wasn't changed. Re-check **A3**.
- **"redirect_uri_mismatch" from Microsoft:** that's the Azure↔Supabase link, unrelated to this migration — verify Supabase's own callback is registered in Azure (it should already be, since Microsoft login currently works).

### Rollback
There's nothing destructive to undo. `bbw-hko.vercel.app` keeps serving throughout. To revert: in Vercel, unset `bbw-hko.ch` as primary (or remove the domains); in Supabase, set Site URL back to `https://bbw-hko.vercel.app`. DNS records at Hostpoint can stay — they only matter once Vercel claims the domain.

---

## Sources
- [Vercel — Can I use my domain with A records? (apex must be A, www CNAME + redirect)](https://vercel.com/kb/guide/a-record-and-caa-with-vercel)
- [Vercel — Adding & configuring a custom domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Vercel — Troubleshooting domains](https://vercel.com/docs/domains/troubleshooting)
- [Hostpoint — DNS-Zone manuell bearbeiten](https://support.hostpoint.ch/de/technisches/dns/dns-aenderungen/dns-zone-manuell-bearbeiten)
- [Hostpoint — Wo kann ich Änderungen an meiner DNS-Zone vornehmen?](https://support.hostpoint.ch/de/technisches/dns/dns-aenderungen/wo-kann-ich-aenderungen-an-meiner-zone-vornehmen)
