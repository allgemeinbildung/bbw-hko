// Turn captured steps into deliverables: a self-contained dual-mode HTML
// (document + slides, prints one step per A4 page), a Markdown guide, and a PDF.
// buildMarkdown/buildHtml are browser-free; renderPdf reuses Playwright.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Localized UI labels. Falls back to English for unknown languages.
const LABELS = {
  en: { doc: "Document", slides: "Slides", print: "Print", step: "Step", of: "of" },
  de: { doc: "Dokument", slides: "Folien", print: "Drucken", step: "Schritt", of: "von" },
  fr: { doc: "Document", slides: "Diapositives", print: "Imprimer", step: "Étape", of: "sur" },
  it: { doc: "Documento", slides: "Diapositive", print: "Stampa", step: "Passo", of: "di" },
};
function labels(lang) {
  return LABELS[(lang || "en").slice(0, 2).toLowerCase()] || LABELS.en;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function dataUri(absPath) {
  return `data:image/png;base64,${readFileSync(absPath).toString("base64")}`;
}

export function buildMarkdown(result) {
  const lines = [`# ${result.flowName}`, ""];
  if (result.description) lines.push(result.description, "");
  result.steps.forEach((s, i) => {
    lines.push(`## ${i + 1}. ${s.caption}`, "");
    if (s.screenshot) lines.push(`![${i + 1}](${s.screenshot.split("\\").join("/")})`, "");
    if (s.url) lines.push(`<sub>${s.url}</sub>`, "");
  });
  return lines.join("\n");
}

function stepsHtml(result) {
  return result.steps
    .map((s, i) => {
      const img = s.screenshot
        ? `<figure class="shot"><img src="${dataUri(join(result.outDir, s.screenshot))}" alt="${escapeHtml(s.caption)}"></figure>`
        : "";
      const meta = s.url ? `<p class="meta">${escapeHtml(s.url)}</p>` : "";
      return `<section class="step">
  <header class="step-head"><span class="num">${i + 1}</span><h2>${escapeHtml(s.caption)}</h2></header>
  ${img}
  ${meta}
</section>`;
    })
    .join("\n");
}

// Render the bundled template with the captured steps inlined.
export function buildHtml(result, templatePath, lang) {
  const L = labels(lang);
  const desc = result.description
    ? `<p class="lead">${escapeHtml(result.description)}</p>`
    : "";
  const tpl = readFileSync(templatePath, "utf8");
  return tpl
    .replaceAll("{{LANG}}", escapeHtml((lang || "en").slice(0, 2)))
    .replaceAll("{{TITLE}}", escapeHtml(result.flowName))
    .replaceAll("{{DESC_BLOCK}}", desc)
    .replaceAll("{{L_DOC}}", escapeHtml(L.doc))
    .replaceAll("{{L_SLIDES}}", escapeHtml(L.slides))
    .replaceAll("{{L_PRINT}}", escapeHtml(L.print))
    .replaceAll("{{L_STEP}}", escapeHtml(L.step))
    .replaceAll("{{L_OF}}", escapeHtml(L.of))
    .replaceAll("{{STEPS}}", stepsHtml(result));
}

export async function renderPdf(html, outPath) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({ path: outPath, format: "A4", printBackground: true });
  await browser.close();
}

export async function writeReports(result, { templatePath, lang, pdf = true }) {
  const htmlStr = buildHtml(result, templatePath, lang);
  const mdPath = join(result.outDir, "guide.md");
  const htmlPath = join(result.outDir, "guide.html");
  const pdfPath = join(result.outDir, "guide.pdf");
  writeFileSync(mdPath, buildMarkdown(result), "utf8");
  writeFileSync(htmlPath, htmlStr, "utf8");
  if (pdf) await renderPdf(htmlStr, pdfPath);
  return { md: mdPath, html: htmlPath, pdf: pdf ? pdfPath : null };
}
