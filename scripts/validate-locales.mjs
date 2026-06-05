import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../packages/core/language/locales");

const en = JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf8"));
const fa = JSON.parse(fs.readFileSync(path.join(dir, "fa.json"), "utf8"));
const ar = JSON.parse(fs.readFileSync(path.join(dir, "ar.json"), "utf8"));

function collectPaths(base, prefix = "") {
  const paths = [];
  for (const [k, v] of Object.entries(base)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      paths.push(...collectPaths(v, p));
    } else {
      paths.push(p);
    }
  }
  return paths;
}

function isSortedDeep(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return true;
  const keys = Object.keys(value);
  const sorted = [...keys].sort((a, b) => a.localeCompare(b));
  if (keys.some((key, index) => key !== sorted[index])) return false;
  return keys.every((key) => isSortedDeep(value[key]));
}

function validateAgainstBase(base, locale, lang) {
  const basePaths = new Set(collectPaths(base));
  const localePaths = collectPaths(locale);
  const missing = [...basePaths].filter((p) => !localePaths.includes(p));
  const extra = localePaths.filter((p) => !basePaths.has(p));
  let ok = true;

  if (missing.length || extra.length) {
    ok = false;
    console.error(`\n[${lang}] locale mismatch vs en:`);
    if (missing.length) console.error("  missing:", missing);
    if (extra.length) console.error("  extra:", extra);
  }

  if (!isSortedDeep(locale)) {
    ok = false;
    console.error(`\n[${lang}] locale keys are not alphabetically sorted — run pnpm sync:locales`);
  }

  return ok;
}

let valid = validateAgainstBase(en, fa, "fa");
valid = validateAgainstBase(en, ar, "ar") && valid;
valid = isSortedDeep(en) && valid;

if (!valid) process.exit(1);
console.log(`Locales OK (${collectPaths(en).length} keys, sorted)`);
