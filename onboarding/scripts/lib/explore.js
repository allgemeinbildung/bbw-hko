// Visit a URL once and emit a DRAFT flow that tours the site's main sections and
// primary call-to-action buttons. Deterministic bootstrap for the "explore"
// step; never submits forms or types data. Claude refines the result.
import { chromium } from "playwright";
import { existsSync } from "node:fs";

export async function exploreSite(url, opts = {}) {
  const max = opts.max ?? 6;
  const viewport = opts.viewport ?? { width: 1280, height: 800 };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    storageState: opts.auth && existsSync(opts.auth) ? opts.auth : undefined,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  const origin = new URL(url).origin;
  const lang = (await page.getAttribute("html", "lang").catch(() => null)) || "";

  const candidates = await page.evaluate((origin) => {
    const seen = new Set();
    const out = [];
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const clean = (t) => (t ?? "").replace(/\s+/g, " ").trim();

    const navScopes = Array.from(document.querySelectorAll("header, nav, [role=navigation]"));
    const linkPool = navScopes.length
      ? navScopes.flatMap((n) => Array.from(n.querySelectorAll("a[href]")))
      : Array.from(document.querySelectorAll("a[href]"));
    for (const a of linkPool) {
      if (!visible(a)) continue;
      const text = clean(a.textContent);
      const href = a.href;
      if (!text || text.length > 40) continue;
      if (!href.startsWith(origin)) continue;
      if (href.includes("#")) continue;
      if (seen.has("L:" + href) || seen.has("T:" + text)) continue;
      seen.add("L:" + href); seen.add("T:" + text);
      out.push({ kind: "link", text, href });
    }

    const ctaWords = /(sign ?up|sign ?in|log ?in|get started|register|try|create account|subscribe|continue|next|anmelden|registrieren|starten|weiter)/i;
    const btnPool = Array.from(document.querySelectorAll("button, [role=button], a.btn, .button, input[type=submit]"));
    for (const b of btnPool) {
      if (!visible(b)) continue;
      const text = clean(b.textContent || b.value);
      if (!text || text.length > 30) continue;
      if (!ctaWords.test(text)) continue;
      if (seen.has("B:" + text.toLowerCase())) continue;
      seen.add("B:" + text.toLowerCase());
      out.push({ kind: "button", text });
    }
    return out;
  }, origin);

  await browser.close();

  const steps = [{ action: "goto", value: url, caption: "Open the homepage" }];
  const buttons = candidates.filter((c) => c.kind === "button").slice(0, 3);
  const links = candidates.filter((c) => c.kind === "link").slice(0, max);

  for (const c of buttons) {
    steps.push({ action: "click", selector: `text=${JSON.stringify(c.text)}`, caption: `Click "${c.text}"`, highlight: true });
    steps.push({ action: "goto", value: url, screenshot: false });
  }
  for (const c of links) {
    steps.push({ action: "goto", value: c.href, caption: `Visit the "${c.text}" section` });
  }

  return {
    name: `Onboarding tour of ${new URL(url).hostname}`,
    description:
      "AUTO-GENERATED DRAFT. Review and edit: reorder steps, fix selectors, add fill/type " +
      "steps for forms, and rewrite captions in the site's language before capturing.",
    baseUrl: origin,
    lang: (lang.split("-")[0] || "en").toLowerCase(),
    auth: opts.auth ?? null,
    viewport,
    steps,
  };
}
