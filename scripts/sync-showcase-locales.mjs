import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../apps/showcase/src/i18n/locales");
const overlaysDir = path.join(__dirname, "overlays");

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
      typeof src === "string" ? src : typeof getByPath(base, dotPath) === "string" ? getByPath(base, dotPath) : fallback;
    setByPath(out, dotPath, val);
  }
  return out;
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

function loadPageOverlays(lang) {
  if (!fs.existsSync(overlaysDir)) return {};
  const merged = {};
  for (const file of fs.readdirSync(overlaysDir).sort()) {
    if (!file.startsWith(`${lang}-pages`) || !file.endsWith(".json")) continue;
    deepMerge(merged, JSON.parse(fs.readFileSync(path.join(overlaysDir, file), "utf8")));
  }
  return merged;
}

/** Strings that may legitimately match English (code paths, prop API blocks, templates). */
function isAllowedEnglish(dotPath, value) {
  if (typeof value !== "string") return true;
  if (dotPath.endsWith("propsReference.content")) return true;
  if (dotPath.endsWith("propsCheckbox.content")) return true;
  if (dotPath.endsWith("propsDateInput.content")) return true;
  if (dotPath.endsWith("propsSelect.content")) return true;
  if (dotPath.endsWith("propsTextInput.content")) return true;
  if (value.startsWith("@/")) return true;
  if (/^\w+\?\:/.test(value) || value.includes("ReactNode")) return true;
  if (value.includes('rounded="{{') || value.includes('rounded="${')) return true;
  if (value.includes("variant?:") || value.includes("severity?:")) return true;
  if (/^(Checkbox|Select|Switch|TextInput|PasswordInput|PhoneInput|TextareaInput|NumberInput|NumberRangeInput|RadioInput|OTPInput|DateInput|WeightInput|SwitchField|List)\./.test(value)) return false;
  if (/^(Checkbox|Select|Switch|TextInput|PasswordInput|PhoneInput|TextareaInput|NumberInput|NumberRangeInput|RadioInput|OTPInput|DateInput|WeightInput|SwitchField|List)$/.test(value)) return false;
  return false;
}

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const existingFa = fs.existsSync(path.join(localesDir, "fa.json"))
  ? JSON.parse(fs.readFileSync(path.join(localesDir, "fa.json"), "utf8"))
  : {};
const existingAr = fs.existsSync(path.join(localesDir, "ar.json"))
  ? JSON.parse(fs.readFileSync(path.join(localesDir, "ar.json"), "utf8"))
  : {};

const faPages = loadPageOverlays("fa");
const arPages = loadPageOverlays("ar");

const faSource = structuredClone(existingFa);
if (Object.keys(faPages).length) {
  if (!faSource.pages) faSource.pages = {};
  deepMerge(faSource.pages, faPages);
}

const arSource = structuredClone(existingAr);
if (Object.keys(arPages).length) {
  if (!arSource.pages) arSource.pages = {};
  deepMerge(arSource.pages, arPages);
}

const faSynced = buildSynced(en, faSource, "");
const arSynced = buildSynced(en, arSource, "");

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

function countUntranslated(synced) {
  let count = 0;
  for (const dotPath of collectPaths(en)) {
    const enVal = getByPath(en, dotPath);
    const locVal = getByPath(synced, dotPath);
    if (typeof enVal === "string" && enVal === locVal && /[a-zA-Z]{3,}/.test(enVal) && !isAllowedEnglish(dotPath, enVal)) {
      count++;
    }
  }
  return count;
}

fs.writeFileSync(path.join(localesDir, "fa.json"), `${JSON.stringify(faSynced, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(localesDir, "ar.json"), `${JSON.stringify(arSynced, null, 2)}\n`, "utf8");

const faUntranslated = countUntranslated(faSynced);
const arUntranslated = countUntranslated(arSynced);

console.log(`Synced fa/ar with en (${enPaths.size} keys)`);
console.log(`fa untranslated (identical to en): ${faUntranslated}`);
console.log(`ar untranslated (identical to en): ${arUntranslated}`);

if (faUntranslated > 0 || arUntranslated > 0) process.exit(1);
