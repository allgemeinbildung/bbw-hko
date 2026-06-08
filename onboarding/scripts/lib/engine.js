// Replay a flow in a real browser and capture annotated screenshots.
import { chromium } from "playwright";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { highlight, clearHighlight } from "./annotate.js";

const SCREENSHOT_BY_DEFAULT = new Set([
  "goto", "click", "fill", "type", "select", "hover", "scrollTo", "screenshot",
]);
const HIGHLIGHTABLE = new Set(["click", "fill", "type", "select", "hover", "scrollTo"]);

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "step";
}
function resolveUrl(value, baseUrl) {
  if (!value) throw new Error("goto requires a `value` (the URL)");
  if (/^https?:\/\//i.test(value)) return value;
  if (!baseUrl) return value;
  return new URL(value, baseUrl).toString();
}
function defaultCaption(step) {
  if (step.caption) return step.caption;
  switch (step.action) {
    case "goto": return `Open ${step.value}`;
    case "click": return `Click ${step.selector}`;
    case "fill":
    case "type": return `Enter "${step.value}"`;
    case "select": return `Select "${step.value}"`;
    case "hover": return `Hover over ${step.selector}`;
    case "scrollTo": return `Scroll to ${step.selector}`;
    default: return step.action;
  }
}
function req(selector, action) {
  if (!selector) throw new Error(`Action "${action}" requires a \`selector\``);
  return selector;
}

export async function runFlow(flow, opts) {
  const outDir = opts.outDir;
  const shotsDir = join(outDir, "screenshots");
  if (existsSync(shotsDir)) rmSync(shotsDir, { recursive: true, force: true });
  mkdirSync(shotsDir, { recursive: true });

  const viewport = flow.viewport ?? { width: 1280, height: 800 };
  const browser = await chromium.launch({ headless: !opts.headed, slowMo: opts.slowMo });
  const context = await browser.newContext({
    viewport,
    storageState: flow.auth && existsSync(flow.auth) ? flow.auth : undefined,
    recordVideo: opts.video ? { dir: join(outDir, "video"), size: viewport } : undefined,
  });
  const page = await context.newPage();
  const captured = [];
  let shotN = 0;

  try {
    for (let s = 0; s < flow.steps.length; s++) {
      const step = flow.steps[s];
      const wantsShot = step.screenshot ?? SCREENSHOT_BY_DEFAULT.has(step.action);
      const wantsHighlight =
        (step.highlight ?? HIGHLIGHTABLE.has(step.action)) && !!step.selector && step.action !== "goto";

      // For goto: navigate first so the screenshot shows the destination, not about:blank.
      if (step.action === "goto") {
        await performAction(page, step, flow.baseUrl);
      }
      // For scrollTo: scroll the element into view first so the highlight and
      // screenshot both land at the right scroll position.
      if (step.action === "scrollTo" && step.selector) {
        try { await page.locator(step.selector).scrollIntoViewIfNeeded({ timeout: step.timeout ?? 12000 }); } catch {}
      }
      if (wantsShot && wantsHighlight && step.selector) {
        try {
          await page.waitForSelector(step.selector, { timeout: 8000, state: "visible" });
          await highlight(page, step.selector, captured.length + 1);
        } catch { /* capture without highlight if not found */ }
      }
      if (wantsShot) {
        const name = `${String(shotN).padStart(2, "0")}-${slug(step.caption ?? step.action)}.png`;
        await page.screenshot({ path: join(shotsDir, name), fullPage: step.fullPage ?? false });
        captured.push({
          index: shotN,
          action: step.action,
          caption: defaultCaption(step),
          screenshot: join("screenshots", name),
          url: page.url(),
          section: step.section || null,
        });
        shotN++;
      }
      if (wantsHighlight) await clearHighlight(page).catch(() => {});
      // goto was already performed above; all other actions run here.
      if (step.action !== "goto") await performAction(page, step, flow.baseUrl);
    }
  } finally {
    await context.close();
    await browser.close();
  }
  return { steps: captured, videoPath: opts.video ? join(outDir, "video") : undefined };
}

async function performAction(page, step, baseUrl) {
  switch (step.action) {
    case "goto":
      await page.goto(resolveUrl(step.value, baseUrl), { waitUntil: "networkidle", timeout: 30000 });
      break;
    case "click": await page.click(req(step.selector, "click")); break;
    case "fill": await page.fill(req(step.selector, "fill"), step.value ?? ""); break;
    case "type": await page.type(req(step.selector, "type"), step.value ?? ""); break;
    case "press": await page.press(req(step.selector, "press"), step.value ?? "Enter"); break;
    case "hover": await page.hover(req(step.selector, "hover")); break;
    case "select": await page.selectOption(req(step.selector, "select"), step.value ?? ""); break;
    case "waitForSelector": await page.waitForSelector(req(step.selector, "waitForSelector"), { timeout: step.timeout ?? 30000, state: step.state ?? "attached" }); break;
    case "waitForTimeout": await page.waitForTimeout(Number(step.value ?? 1000)); break;
    case "scrollTo": await page.locator(req(step.selector, "scrollTo")).scrollIntoViewIfNeeded({ timeout: step.timeout ?? 30000 }); break;
    case "screenshot": break;
    default: throw new Error(`Unknown action "${step.action}"`);
  }
}
