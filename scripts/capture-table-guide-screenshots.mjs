import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "apps/showcase/public/table/guide");
const baseUrl = process.env.SHOWCASE_URL ?? "http://localhost:5173";
const tableUrl = `${baseUrl}/components/table`;

async function waitForTable(page) {
  await page.waitForSelector("#table-container tbody tr", { timeout: 60_000 });
  await page.waitForTimeout(400);
}

async function snapTable(page, filename, options = {}) {
  const target = page.locator("#table-container");
  await target.waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForTimeout(300);
  await target.screenshot({
    path: path.join(outDir, filename),
    type: "jpeg",
    quality: 88,
    animations: "disabled",
    ...options,
  });
}

async function snapToolbar(page, filename) {
  const box = await page.locator("#table-container").boundingBox();
  if (!box) throw new Error("Table container not found");
  await snapTable(page, filename, {
    clip: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: Math.min(box.height, 132),
    },
  });
}

async function resetTablePage(page) {
  await page.goto(tableUrl, { waitUntil: "networkidle" });
  await waitForTable(page);
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true, channel: "chrome" });
  } catch {
    return chromium.launch({ headless: true, channel: "msedge" });
  }
}

async function clickFilterToggle(page) {
  await page.locator("#table-container .size-14.min-w-14").nth(2).click();
}

async function clickFirstExpand(page) {
  await page.locator("#table-container tbody button").first().click();
}

async function toggleRowSelection(page, index) {
  await page
    .locator("#table-container tbody tr")
    .nth(index)
    .locator('[role="checkbox"]')
    .click();
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await launchBrowser();
  const page = await browser.newPage({
    viewport: { width: 1360, height: 900 },
    deviceScaleFactor: 2,
  });

  try {
    await resetTablePage(page);
    await snapTable(page, "overview.jpg");

    await resetTablePage(page);
    await snapToolbar(page, "toolbar.jpg");

    await resetTablePage(page);
    await page
      .locator("#table-container thead th")
      .filter({ hasText: "Name" })
      .click();
    await page.waitForTimeout(500);
    await snapTable(page, "sorting.jpg");

    await resetTablePage(page);
    await clickFilterToggle(page);
    await page.waitForTimeout(500);
    await snapTable(page, "filtering.jpg");

    await resetTablePage(page);
    await page.locator("#table-container thead th").nth(4).hover();
    await page.waitForTimeout(300);
    await snapTable(page, "columns.jpg");

    await resetTablePage(page);
    await toggleRowSelection(page, 0);
    await toggleRowSelection(page, 1);
    await page.waitForTimeout(300);
    await snapTable(page, "selection.jpg");

    await resetTablePage(page);
    await clickFirstExpand(page);
    await page.waitForTimeout(500);
    await snapTable(page, "expansion.jpg");

    await page.setViewportSize({ width: 1560, height: 900 });
    await resetTablePage(page);
    await page
      .locator("#table-container tbody tr")
      .first()
      .click({ button: "right" });
    await page.getByRole("menuitem", { name: /side panel/i }).click();
    await page.waitForTimeout(500);
    await snapTable(page, "side-panel.jpg");

    await page.setViewportSize({ width: 1360, height: 900 });
    await resetTablePage(page);
    await page.evaluate(() => {
      const scroller = document.querySelector("#table-inner");
      scroller?.scrollTo({ left: 520, top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(300);
    await snapTable(page, "scroll.jpg");

    console.log(`Saved table guide screenshots to ${outDir}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
