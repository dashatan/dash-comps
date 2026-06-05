import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../packages/core/language/locales");

const en = JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf8"));
const fa = JSON.parse(fs.readFileSync(path.join(dir, "fa.json"), "utf8"));
const ar = JSON.parse(fs.readFileSync(path.join(dir, "ar.json"), "utf8"));

/** Legacy key paths in fa/ar that map to the current en schema */
const KEY_ALIASES = {
  "app.subTitle": "app.description",
};

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

function resolveSourceValue(source, dotPath) {
  let v = getByPath(source, dotPath);
  if (v !== undefined) return v;
  for (const [from, to] of Object.entries(KEY_ALIASES)) {
    if (to === dotPath) {
      v = getByPath(source, from);
      if (v !== undefined) return v;
    }
  }
  return undefined;
}

function buildSynced(base, source, fallback) {
  const out = {};
  for (const dotPath of collectPaths(base)) {
    const baseVal = getByPath(base, dotPath);
    const srcVal = source ? resolveSourceValue(source, dotPath) : undefined;
    const val =
      typeof srcVal === "string" ? srcVal : typeof baseVal === "string" ? baseVal : fallback;
    setByPath(out, dotPath, val);
  }
  return out;
}

const faSynced = buildSynced(en, fa, "");
const arSynced = buildSynced(en, ar, "");

const arReused = collectPaths(en).filter((p) => resolveSourceValue(ar, p) !== undefined).length;

fs.writeFileSync(path.join(dir, "fa.json"), `${JSON.stringify(faSynced, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(dir, "ar.json"), `${JSON.stringify(arSynced, null, 2)}\n`, "utf8");

console.log(`Synced ${collectPaths(en).length} keys`);
console.log(`fa: preserved translations where paths matched`);
console.log(`ar: reused ${arReused} strings from old ar.json, rest filled from en`);
