// Turn captured steps into deliverables: a self-contained tabbed HTML guide
// (document view with section tabs + slides view + A4 print), a Markdown guide, and a PDF.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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
function stepCard(s, globalIndex, outDir) {
  const img = s.screenshot
    ? `<figure class="shot"><img src="${dataUri(join(outDir, s.screenshot))}" alt="${escapeHtml(s.caption)}"></figure>`
    : "";
  const meta = s.url ? `<p class="meta">${escapeHtml(s.url)}</p>` : "";
  return `<div class="step">
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
function sectionsHtml(sections, outDir) {
  return sections
    .map((sec, i) => {
      const cards = sec.steps
        .map((s, j) => {
          // Add a dashed divider between steps (not before the first)
          const divider = j > 0 ? '<hr class="step-divider">\n' : "";
          return divider + stepCard(s, s.globalIndex, outDir);
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
    .replaceAll("{{L_PRINT}}",  escapeHtml(L.print))
    .replaceAll("{{L_STEP}}",   escapeHtml(L.step))
    .replaceAll("{{L_OF}}",     escapeHtml(L.of))
    .replaceAll("{{TABS}}",     tabsHtml(sections))
    .replaceAll("{{SECTIONS}}", sectionsHtml(sections, result.outDir));
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
