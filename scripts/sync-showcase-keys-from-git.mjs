import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pagesDir = path.join(root, "apps/showcase/src/features/catalog/pages");
const localePath = path.join(root, "apps/showcase/src/i18n/locales/en.json");

function readGit(relativePath) {
  try {
    return execSync(`git show HEAD:${relativePath.replace(/\\/g, "/")}`, {
      cwd: root,
      encoding: "utf8",
    });
  } catch {
    return null;
  }
}

function get(obj, dotPath) {
  return dotPath.split(".").reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), obj);
}

function set(obj, dotPath, value) {
  const keys = dotPath.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in cur) || typeof cur[keys[i]] !== "object") cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

function extractSections(content) {
  const sections = [];
  const re =
    /<ShowcaseSection\s+([^>]*?)>([\s\S]*?)<\/ShowcaseSection>/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const attrs = match[1];
    const body = match[2];
    const title =
      attrs.match(/title=\{p\(["']([^"']+)["']\)\}/)?.[1] ??
      attrs.match(/title=\{p\(`([^`]+)`\)\}/)?.[1] ??
      attrs.match(/title="([^"]+)"/)?.[1] ??
      attrs.match(/title='([^']+)'/)?.[1];
    const description =
      attrs.match(/description=\{p\(["']([^"']+)["']\)\}/)?.[1] ??
      attrs.match(/description="([^"]+)"/)?.[1] ??
      attrs.match(/description='([^']+)'/)?.[1];

    const labels = [];
    const labelRe =
      /label=\{p\(["']([^"']+)["'](?:,\s*\{[^}]*\})?\)\}|label="([^"]+)"|label='([^']+)'|label=\{`([^`]+)`\}/g;
    let lm;
    while ((lm = labelRe.exec(body)) !== null) {
      labels.push({
        key: lm[1],
        value: lm[2] ?? lm[3] ?? lm[4],
      });
    }

    const messages = [];
    const msgRe =
      /message=\{p\(["']([^"']+)["']\)\}|message="([^"]+)"|message='([^']+)'/g;
    let mm;
    while ((mm = msgRe.exec(body)) !== null) {
      messages.push({ key: mm[1], value: mm[2] ?? mm[3] });
    }

    sections.push({ titleKey: title, descriptionKey: description, labels, messages, body });
  }
  return sections;
}

function extractGitSections(content) {
  const sections = [];
  const re =
    /<ShowcaseSection\s+([^>]*?)>([\s\S]*?)<\/ShowcaseSection>/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const attrs = match[1];
    const body = match[2];
    const title = attrs.match(/title="([^"]+)"/)?.[1] ?? attrs.match(/title='([^']+)'/)?.[1];
    const description =
      attrs.match(/description="([^"]+)"/)?.[1] ?? attrs.match(/description='([^']+)'/)?.[1];

    const labels = [];
    const labelRe = /label="([^"]+)"|label='([^']+)'|label=\{`([^`]+)`\}/g;
    let lm;
    while ((lm = labelRe.exec(body)) !== null) {
      labels.push(lm[1] ?? lm[2] ?? lm[3]);
    }

    const messages = [];
    const msgRe = /message="([^"]+)"|message='([^']+)'/g;
    let mm;
    while ((mm = msgRe.exec(body)) !== null) {
      messages.push(mm[1] ?? mm[2]);
    }

    sections.push({ title, description, labels, messages });
  }
  return sections;
}

const en = JSON.parse(fs.readFileSync(localePath, "utf8"));
if (!en.pages) en.pages = {};

for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith(".page.tsx"))) {
  const slug = file.replace(".page.tsx", "");
  const current = fs.readFileSync(path.join(pagesDir, file), "utf8");
  const git = readGit(`apps/showcase/src/features/catalog/pages/${file}`);
  if (!git) continue;

  const currentSections = extractSections(current);
  const gitSections = extractGitSections(git);

  currentSections.forEach((cur, i) => {
    const gitSec = gitSections[i];
    if (!gitSec) return;

    if (cur.titleKey?.includes(".")) {
      if (get(en, `pages.${slug}.${cur.titleKey}`) === undefined && gitSec.title) {
        set(en, `pages.${slug}.${cur.titleKey}`, gitSec.title);
      }
    }
    if (cur.descriptionKey?.includes(".")) {
      if (get(en, `pages.${slug}.${cur.descriptionKey}`) === undefined && gitSec.description) {
        set(en, `pages.${slug}.${cur.descriptionKey}`, gitSec.description);
      }
    }

    cur.labels.forEach((label, li) => {
      if (label.key?.includes(".")) {
        if (get(en, `pages.${slug}.${label.key}`) === undefined) {
          const value = label.value ?? gitSec.labels[li];
          if (value) set(en, `pages.${slug}.${label.key}`, value);
        }
      }
    });

    cur.messages.forEach((msg, mi) => {
      if (msg.key?.includes(".")) {
        if (get(en, `pages.${slug}.${msg.key}`) === undefined) {
          const value = msg.value ?? gitSec.messages[mi];
          if (value) set(en, `pages.${slug}.${msg.key}`, value);
        }
      }
    });
  });

  // p() keys in template literals like p(`animations.${key}`)
  const animRe = /p\(`animations\.(\$\{[^}]+\}|[^`]+)`\)/g;
  // handle ANIMATION_KEYS separately - read from git labels in baseAnimations section
}

// Fill animation labels from git alerts page pattern
const alertsGit = readGit("apps/showcase/src/features/catalog/pages/alerts.page.tsx");
if (alertsGit) {
  const animLabels = [...alertsGit.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
  const animKeys = ["jumpIn", "shake", "bounceIn", "flipUp", "none"];
  animKeys.forEach((key, i) => {
    if (animLabels[i]) set(en, `pages.alerts.animations.${key}`, animLabels[i]);
  });
}

fs.writeFileSync(localePath, `${JSON.stringify(en, null, 2)}\n`, "utf8");
console.log("Synced missing keys from git HEAD into en.json");
