// One-time interactive login. Opens a headed browser, you sign in by hand, then
// the session is saved as a Playwright storageState file. Point a flow's `auth`
// field at that file to replay against the authenticated site headlessly.
import { chromium } from "playwright";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

export async function saveAuth(url, out) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  console.log("\n  A browser window opened.");
  console.log("  -> Log in completely (including any 2FA), land on the post-login page,");
  console.log("     then return here and press Enter to save the session.\n");

  const rl = createInterface({ input: stdin, output: stdout });
  await rl.question("  Press Enter once you are logged in... ");
  rl.close();

  await context.storageState({ path: out });
  await browser.close();
  console.log(`\n  Saved session to ${out}. Reference it via "auth": "${out}" in your flow.\n`);
}
