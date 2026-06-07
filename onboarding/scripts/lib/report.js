// Turn captured steps into deliverables: a self-contained tabbed HTML guide
// (document view with section tabs + slides view + A4 print), a Markdown guide, and a PDF.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve logos relative to this file: lib/ → scripts/ → onboarding/ → project root
const _HERE = dirname(fileURLToPath(import.meta.url));
const _PUB  = resolve(_HERE, "..", "..", "..", "public");

let _logoDark = null, _logoLight = null, _badge = null;
function badgeDataUri() {
  if (_badge) return _badge;
  const p = resolve(_PUB, "abu-2030-badge.png");
  if (!existsSync(p)) return "";
  _badge = `data:image/png;base64,${readFileSync(p).toString("base64")}`;
  return _badge;
}
function logoDarkUri() {   // logo-bbw-mark.png — the stacked BBW mark used in all app headers
  if (_logoDark) return _logoDark;
  const p = resolve(_PUB, "logo-bbw-mark.png");
  if (!existsSync(p)) return "";
  _logoDark = `data:image/png;base64,${readFileSync(p).toString("base64")}`;
  return _logoDark;
}
function logoLightUri() {  // logo-bbw-white.svg — white, for dark-green backgrounds
  if (_logoLight) return _logoLight;
  const p = resolve(_PUB, "logo-bbw-white.svg");
  if (!existsSync(p)) return "";
  _logoLight = `data:image/svg+xml;base64,${readFileSync(p).toString("base64")}`;
  return _logoLight;
}

const LABELS = {
  en: { doc: "Document", slides: "Slides", download: "Download PDF", step: "Step", of: "of" },
  de: { doc: "Dokument", slides: "Folien", download: "PDF herunterladen", step: "Schritt", of: "von" },
  fr: { doc: "Document", slides: "Diapositives", download: "Télécharger PDF", step: "Étape", of: "sur" },
  it: { doc: "Documento", slides: "Diapositive", download: "Scarica PDF", step: "Passo", of: "di" },
};
function labels(lang) {
  return LABELS[(lang || "en").slice(0, 2).toLowerCase()] || LABELS.en;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// Escape HTML then render inline markdown: **bold**, *italic*, `code`.
function captionToHtml(s) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
function dataUri(absPath) {
  return `data:image/png;base64,${readFileSync(absPath).toString("base64")}`;
}

// Group captured steps into sections. Steps without a section go into a
// default section named after the first L label ("Schritte" / "Steps" etc.).
function groupBySection(steps, defaultName) {
  const sections = [];
  const map = new Map();
  for (const step of steps) {
    const name = step.section || defaultName;
    if (!map.has(name)) {
      const sec = { name, steps: [] };
      map.set(name, sec);
      sections.push(sec);
    }
    map.get(name).steps.push(step);
  }
  return sections;
}

// One step rendered as a card (header with badge + caption, then screenshot).
function stepCard(s, globalIndex, outDir, baseUrl, productionBaseUrl) {
  const img = s.screenshot
    ? `<figure class="shot"><img src="${dataUri(join(outDir, s.screenshot))}" alt="${escapeHtml(s.caption)}"></figure>`
    : "";
  let displayUrl = s.url || "";
  if (displayUrl && baseUrl && productionBaseUrl) {
    displayUrl = displayUrl.replace(baseUrl, productionBaseUrl);
  }
  const meta = displayUrl ? `<p class="meta"><a href="${escapeHtml(displayUrl)}" target="_blank" rel="noopener">${escapeHtml(displayUrl)}</a></p>` : "";
  return `<div class="step" id="step-${globalIndex}">
  <div class="step-head"><span class="num">${globalIndex}</span><h2>${captionToHtml(s.caption)}</h2></div>
  ${img}${meta}
</div>`;
}

// Tab nav buttons.
function tabsHtml(sections) {
  return sections
    .map((sec, i) =>
      `<button type="button" data-sec="${i}"${i === 0 ? ' class="active"' : ""}><span class="n">${i + 1}</span>${escapeHtml(sec.name)}</button>`
    )
    .join("\n    ");
}

// Section panels — each contains the step cards for that section.
function sectionsHtml(sections, outDir, baseUrl, productionBaseUrl) {
  return sections
    .map((sec, i) => {
      const cards = sec.steps
        .map((s, j) => {
          // Add a dashed divider between steps (not before the first)
          const divider = j > 0 ? '<hr class="step-divider">\n' : "";
          return divider + stepCard(s, s.globalIndex, outDir, baseUrl, productionBaseUrl);
        })
        .join("\n");
      return `<div class="sec-panel${i === 0 ? " active" : ""}" id="sec-${i}">
  <div class="sec-kicker">Abschnitt ${i + 1}</div>
  <h2 class="sec-title">${escapeHtml(sec.name)}</h2>
  ${cards}
</div>`;
    })
    .join("\n\n");
}

// Thumbnail grid used as the PDF cover/index page (hidden in screen mode).
function buildPrintIndex(result, stepsWithIndex) {
  const shots = stepsWithIndex.filter(s => s.screenshot);
  if (!shots.length) return '';
  const secCount = new Set(stepsWithIndex.map(s => s.section).filter(Boolean)).size;
  const items = shots.map(s => {
    const rawCap = s.caption.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '');
    return `<a href="#step-${s.globalIndex}" class="pi-item">
  <div class="pi-row1"><span class="pi-num">${s.globalIndex}</span><span class="pi-sec">${escapeHtml(s.section || '')}</span></div>
  <img src="${dataUri(join(result.outDir, s.screenshot))}" alt="">
  <p class="pi-cap">${escapeHtml(rawCap.slice(0, 90))}</p>
</a>`;
  }).join('\n');
  return `<div class="print-index">
  <div class="pi-cover">
    <div class="pi-cover-brand">
      <img src="{{LOGO_LIGHT_URI}}" alt="BBW" class="pi-logo">
      <span class="pi-cover-sep"></span>
      <span class="pi-cover-tagline"><span>ABU-Materialplattform</span><span>ABU Reform 2030</span></span>
    </div>
    <h2>${escapeHtml(result.flowName)}</h2>
    <p>${stepsWithIndex.length} Schritte &middot; ${secCount} Abschnitte &middot; ${shots.length} Screenshots</p>
  </div>
  <div class="pi-grid">${items}</div>
</div>`;
}

export function buildMarkdown(result) {
  const lines = [`# ${result.flowName}`, ""];
  if (result.description) lines.push(result.description, "");
  let secName = null;
  result.steps.forEach((s, i) => {
    if (s.section && s.section !== secName) {
      secName = s.section;
      lines.push(`\n## ${secName}`, "");
    }
    lines.push(`### ${i + 1}. ${s.caption}`, "");
    if (s.screenshot) lines.push(`![${i + 1}](${s.screenshot.split("\\").join("/")})`, "");
    if (s.url) lines.push(`<sub>${s.url}</sub>`, "");
  });
  return lines.join("\n");
}

export function buildHtml(result, templatePath, lang) {
  const L = labels(lang);
  const defaultSecName = L.step + "s"; // "Schritte" / "Steps"

  // Attach a 1-based global index to each step for the badge number
  const stepsWithIndex = result.steps.map((s, i) => ({ ...s, globalIndex: i + 1 }));

  const sections = groupBySection(stepsWithIndex, defaultSecName);

  const desc = result.description
    ? `<p class="lead">${escapeHtml(result.description)}</p>`
    : "";

  const tpl = readFileSync(templatePath, "utf8");
  return tpl
    .replaceAll("{{LANG}}",     escapeHtml((lang || "en").slice(0, 2)))
    .replaceAll("{{TITLE}}",    escapeHtml(result.flowName))
    .replaceAll("{{DESC_BLOCK}}", desc)
    .replaceAll("{{L_DOC}}",    escapeHtml(L.doc))
    .replaceAll("{{L_SLIDES}}", escapeHtml(L.slides))
    .replaceAll("{{L_DOWNLOAD}}", escapeHtml(L.download))
    .replaceAll("{{L_STEP}}",   escapeHtml(L.step))
    .replaceAll("{{L_OF}}",     escapeHtml(L.of))
    .replaceAll("{{TABS}}",           tabsHtml(sections))
    .replaceAll("{{PRINT_INDEX}}",    buildPrintIndex(result, stepsWithIndex))
    .replaceAll("{{SECTIONS}}",       sectionsHtml(sections, result.outDir, result.baseUrl, result.productionBaseUrl))
    .replaceAll("{{LOGO_DARK_URI}}",  logoDarkUri())
    .replaceAll("{{LOGO_LIGHT_URI}}", logoLightUri())
    .replaceAll("{{BADGE_DATA_URI}}", badgeDataUri());
}

export async function renderPdf(html, outPath) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({ path: outPath, format: "A4", landscape: true, printBackground: true });
  await browser.close();
}

export async function writeReports(result, { templatePath, lang, pdf = true }) {
  const htmlStr = buildHtml(result, templatePath, lang);
  const mdPath   = join(result.outDir, "guide.md");
  const htmlPath = join(result.outDir, "guide.html");
  const pdfPath  = join(result.outDir, "guide.pdf");
  writeFileSync(mdPath,   buildMarkdown(result), "utf8");
  writeFileSync(htmlPath, htmlStr, "utf8");
  if (pdf) await renderPdf(htmlStr, pdfPath);
  return { md: mdPath, html: htmlPath, pdf: pdf ? pdfPath : null };
}
