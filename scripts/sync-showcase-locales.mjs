import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../apps/showcase/src/i18n/locales");

function collectPaths(base, prefix = "") {
  const paths = [];
  for (const [key, value] of Object.entries(base)) {
    const dotPath = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      paths.push(...collectPaths(value, dotPath));
    } else {
      paths.push(dotPath);
    }
  }
  return paths;
}

function getByPath(obj, dotPath) {
  return dotPath.split(".").reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), obj);
}

function setByPath(obj, dotPath, value) {
  const keys = dotPath.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in cur) || typeof cur[keys[i]] !== "object" || cur[keys[i]] === null) {
      cur[keys[i]] = {};
    }
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

function buildSynced(base, source, fallback) {
  const out = {};
  for (const dotPath of collectPaths(base)) {
    const src = getByPath(source, dotPath);
    const val =
      typeof src === "string"
        ? src
        : typeof getByPath(base, dotPath) === "string"
          ? getByPath(base, dotPath)
          : fallback;
    setByPath(out, dotPath, val);
  }
  return out;
}

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const existingFa = fs.existsSync(path.join(localesDir, "fa.json"))
  ? JSON.parse(fs.readFileSync(path.join(localesDir, "fa.json"), "utf8"))
  : {};
const existingAr = fs.existsSync(path.join(localesDir, "ar.json"))
  ? JSON.parse(fs.readFileSync(path.join(localesDir, "ar.json"), "utf8"))
  : {};

const faSynced = buildSynced(en, existingFa, "");
const arSynced = buildSynced(en, existingAr, "");

const enPaths = new Set(collectPaths(en));
for (const lang of ["fa", "ar"]) {
  const synced = lang === "fa" ? faSynced : arSynced;
  const localePaths = collectPaths(synced);
  const missing = [...enPaths].filter((p) => !localePaths.includes(p));
  const extra = localePaths.filter((p) => !enPaths.has(p));
  if (missing.length || extra.length) {
    console.error(`[${lang}] schema mismatch — missing: ${missing.length}, extra: ${extra.length}`);
    if (missing.length) console.error("  missing sample:", missing.slice(0, 5));
    process.exit(1);
  }
}

fs.writeFileSync(path.join(localesDir, "fa.json"), `${JSON.stringify(faSynced, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(localesDir, "ar.json"), `${JSON.stringify(arSynced, null, 2)}\n`, "utf8");

console.log(`Synced fa/ar with en (${enPaths.size} keys)`);
