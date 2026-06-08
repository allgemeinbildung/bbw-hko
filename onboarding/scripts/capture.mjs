#!/usr/bin/env node
// CLI for the web-onboarding-builder capture scripts.
//   node capture.mjs auth    <url> [--out auth.json]
//   node capture.mjs explore <url> [--out flows/site.json] [--max 6] [--auth auth.json]
//   node capture.mjs run     <flow.json> [--auth auth.json] [--video] [--headed] [--no-pdf] [--out output/<name>]
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { saveAuth } from "./lib/auth.js";
import { exploreSite } from "./lib/explore.js";
import { runFlow } from "./lib/engine.js";
import { writeReports } from "./lib/report.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = resolve(HERE, "..", "assets", "template.html");

function parseArgs(argv) {
  const _ = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) { flags[key] = next; i++; }
      else flags[key] = true;
    } else _.push(a);
  }
  return { _, flags };
}
// Umlaut-aware slug: ä→ae, ö→oe, ü→ue, ß→ss, then strip remaining non-ASCII.
function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/ß/g, "ss").replace(/à|á|â/g, "a").replace(/è|é|ê/g, "e")
    .replace(/ì|í|î/g, "i").replace(/ò|ó|ô/g, "o").replace(/ù|ú|û/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "guide";
}

const HELP = `
web-onboarding-builder — capture a website into a step-by-step guide.

  node capture.mjs auth    <url> [--out auth.json]
  node capture.mjs explore <url> [--out flows/site.json] [--max 6] [--auth auth.json]
  node capture.mjs run     <flow.json> [--auth auth.json] [--video] [--headed] [--no-pdf]
`;

async function main() {
  const { _, flags } = parseArgs(process.argv.slice(2));
  const cmd = _[0];
  if (!cmd || cmd === "help" || flags.help) return void console.log(HELP);

  if (cmd === "auth") {
    if (!_[1]) throw new Error("auth needs a <url>");
    await saveAuth(_[1], String(flags.out ?? "auth.json"));
    return;
  }

  if (cmd === "explore") {
    if (!_[1]) throw new Error("explore needs a <url>");
    const flow = await exploreSite(_[1], {
      max: flags.max ? Number(flags.max) : undefined,
      auth: typeof flags.auth === "string" ? flags.auth : null,
    });
    const out = String(flags.out ?? `flows/${slug(new URL(_[1]).hostname)}.json`);
    mkdirSync(dirname(resolve(out)), { recursive: true });
    writeFileSync(out, JSON.stringify(flow, null, 2), "utf8");
    console.log(`\n  Draft flow written to ${out} (${flow.steps.length} steps).`);
    console.log(`  Edit it (captions in the site's language), then:  node capture.mjs run ${out}\n`);
    return;
  }

  if (cmd === "run") {
    if (!_[1]) throw new Error("run needs a <flow.json>");
    const flow = JSON.parse(readFileSync(_[1], "utf8"));
    if (typeof flags.auth === "string") flow.auth = flags.auth;
    const outDir = resolve(String(flags.out ?? join("output", slug(flow.name))));
    mkdirSync(outDir, { recursive: true });

    console.log(`\n  Running "${flow.name}" — ${flow.steps.length} steps...`);
    const { steps, videoPath } = await runFlow(flow, {
      outDir,
      video: !!flags.video,
      headed: !!flags.headed,
      slowMo: flags.slowmo ? Number(flags.slowmo) : undefined,
    });
    const result = { flowName: flow.name, description: flow.description, outDir, steps, videoPath, baseUrl: flow.baseUrl, productionBaseUrl: flow.productionBaseUrl };
    const { md, html, pdf } = await writeReports(result, {
      templatePath: TEMPLATE,
      lang: flow.lang || "en",
      pdf: !flags["no-pdf"],
    });
    console.log(`  Captured ${steps.length} screenshots.`);
    console.log(`  Guide written:\n    ${html}\n    ${md}${pdf ? "\n    " + pdf : ""}`);
    if (videoPath) console.log(`  Video: ${videoPath}`);

    // Auto-deploy: if the flow has a `deploy` map ({ html: "path/to/out.html", pdf: "..." })
    // copy the files to those destinations relative to the flow file's directory.
    const flowDir = dirname(resolve(_[1]));
    if (flow.deploy && typeof flow.deploy === "object") {
      const pairs = [
        [html, flow.deploy.html],
        [md,   flow.deploy.md],
        [pdf,  flow.deploy.pdf],
      ].filter(([src, dst]) => src && dst);
      for (const [src, dst] of pairs) {
        const dest = resolve(flowDir, dst);
        mkdirSync(dirname(dest), { recursive: true });
        copyFileSync(src, dest);
        console.log(`  Deployed: ${dest}`);
      }
    }
    console.log("");
    return;
  }

  console.log(`Unknown command "${cmd}".`);
  console.log(HELP);
}

main().catch((err) => {
  console.error("\n  Error:", err instanceof Error ? err.message : err, "\n");
  process.exit(1);
});
