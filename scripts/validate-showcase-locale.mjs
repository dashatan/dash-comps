import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function get(obj, dotPath) {
  return dotPath.split(".").reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), obj);
}

const en = JSON.parse(
  fs.readFileSync(path.join(root, "apps/showcase/src/i18n/locales/en.json"), "utf8"),
);
const dir = path.join(root, "apps/showcase/src/features/catalog/pages");
const missing = [];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".page.tsx"))) {
  const slug = file.replace(".page.tsx", "");
  const src = fs.readFileSync(path.join(dir, file), "utf8");
  const re = /p\(["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(src)) !== null) {
    const key = `pages.${slug}.${match[1]}`;
    if (get(en, key) === undefined) missing.push(key);
  }
}

console.log(`Missing keys: ${missing.length}`);
for (const key of [...new Set(missing)].sort()) console.log(key);
