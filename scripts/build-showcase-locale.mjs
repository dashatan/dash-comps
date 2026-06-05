import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pagesDir = "apps/showcase/src/features/catalog/pages";
const outDir = path.join(root, "apps/showcase/src/i18n/locales");

const shell = {
  appName: "Dash Components",
  title: "Showcase",
  nav: {
    home: "Home",
    allComponents: "All components",
    categories: "Categories",
    common: "Common",
    compound: "Compound",
  },
  home: {
    badge: "Animated component library",
    title: "Build interfaces with",
    titleHighlight: "motion & precision",
    description:
      "Explore production-ready UI components. Every interaction is animated; themes support light and dark mode.",
    browse: "Browse components",
    startButtons: "Start with buttons",
  },
  catalog: {
    indexTitle: "Component catalog",
    indexDescription: "Browse every component category in the design system.",
    componentLabel: "Component",
    groupComponents: "components",
  },
  sidebar: {
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
  },
  categories: {
    accordion: { title: "Accordion", description: "Expandable sections with smooth motion." },
    alerts: { title: "Alerts", description: "Empty, loading, error, and permission states." },
    auth: { title: "Auth layout", description: "Authentication page layout." },
    avatar: { title: "Avatar", description: "User avatars with fallback initials." },
    badges: { title: "Badges", description: "Status indicators with colors and sizes." },
    banner: { title: "Banner", description: "Promotional and informational banners." },
    buttons: { title: "Buttons", description: "Actions, icons, loading, and severity variants." },
    cards: { title: "Cards", description: "Surfaces with headers and content areas." },
    carousel: { title: "Carousel", description: "Sliding content galleries." },
    charts: { title: "Charts", description: "Bar, line, pie, and area charts." },
    chips: { title: "Chips", description: "Tags, filters, and removable labels." },
    collapsible: { title: "Collapsible", description: "Show and hide content regions." },
    "context-menu": { title: "Context menu", description: "Right-click action menus." },
    dashboard: { title: "Dashboard layout", description: "Application shell with sidebar." },
    divider: { title: "Divider", description: "Visual separators between content." },
    errors: { title: "Errors", description: "Error state presentations." },
    fadeable: { title: "Fadeable", description: "Fade in and out wrappers." },
    flex: { title: "Flex", description: "Flexible layout primitives." },
    "file-uploader": { title: "File uploader", description: "Drag-and-drop file uploads." },
    form: { title: "Form", description: "Form layout and field groups." },
    grid: { title: "Grid", description: "Grid layout helpers." },
    "hover-card": { title: "Hover card", description: "Rich content on hover." },
    inputs: { title: "Inputs", description: "Text, checkbox, switch, select, and more." },
    list: { title: "List", description: "List, grid, and card list layouts." },
    loading: { title: "Loading", description: "Spinners and loading indicators." },
    "license-plate": { title: "License plate", description: "Iranian plate input formats." },
    "location-picker": { title: "Location picker", description: "Map-based location selection." },
    map: { title: "Map", description: "Interactive Leaflet maps." },
    overlay: { title: "Overlay", description: "Dialogs, sheets, and popovers." },
    pagination: { title: "Pagination", description: "Page navigation controls." },
    paginator: { title: "Paginator", description: "Compact paginator UI." },
    "persian-date-picker": { title: "Persian date picker", description: "Jalali calendar picker." },
    shapes: { title: "Shapes", description: "Indicators and decorative shapes." },
    skeleton: { title: "Skeleton", description: "Loading placeholder skeletons." },
    slider: { title: "Slider", description: "Single and range sliders." },
    sonner: { title: "Sonner", description: "Toast notifications." },
    steps: { title: "Steps", description: "Step progress indicators." },
    table: { title: "Table", description: "Data tables with filters and sorting." },
    tabs: { title: "Tabs", description: "Tabbed content with animated indicators." },
    timeline: { title: "Timeline", description: "Event timelines." },
    tracker: { title: "Tracker", description: "Vehicle tracking map and events." },
    typography: { title: "Typography", description: "Text styles and marquee." },
  },
};

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

function readGitFile(relativePath) {
  try {
    return execSync(`git show HEAD:${relativePath}`, { cwd: root, encoding: "utf8" });
  } catch {
    return null;
  }
}

function toCamelCase(title) {
  return title
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join("");
}

function extractPageFromGit(slug) {
  const file = `${pagesDir}/${slug}.page.tsx`;
  const content = readGitFile(file);
  if (!content) return null;

  const sections = [];
  const sectionRegex =
    /<ShowcaseSection\s+title="([^"]+)"(?:\s+description="([^"]*)")?[^>]*>([\s\S]*?)<\/ShowcaseSection>/g;
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const [, title, description = "", body] = match;
    const sectionKey = toCamelCase(title) || `section${sections.length}`;
    const section = { title, ...(description ? { description } : {}) };

    const labelRegex = /label="([^"]+)"/g;
    let labelMatch;
    let labelIndex = 0;
    while ((labelMatch = labelRegex.exec(body)) !== null) {
      const label = labelMatch[1];
      const labelKey = toCamelCase(label) || `label${labelIndex++}`;
      if (!section.labels) section.labels = {};
      section.labels[labelKey] = label;
    }

    const labelTplRegex = /label=\{`([^`]+)`\}/g;
    while ((labelMatch = labelTplRegex.exec(body)) !== null) {
      section.rowLabelTemplate = labelMatch[1];
    }

    const messageRegex = /message="([^"]+)"/g;
    let msgIndex = 0;
    while ((labelMatch = messageRegex.exec(body)) !== null) {
      const key = msgIndex === 0 ? "message" : `message${msgIndex}`;
      section[key] = labelMatch[1];
      msgIndex++;
    }

    sections.push([sectionKey, section]);
  }

  if (!sections.length) return null;
  return Object.fromEntries(sections);
}

function loadExistingPages() {
  const corePath = path.join(root, "packages/core/language/locales/en.json");
  const dataPath = path.join(root, "scripts/data/showcase-pages.en.json");
  let pages = {};

  if (fs.existsSync(corePath)) {
    const core = JSON.parse(fs.readFileSync(corePath, "utf8"));
    if (core.showcase?.pages) deepMerge(pages, core.showcase.pages);
  }
  if (fs.existsSync(dataPath)) {
    deepMerge(pages, JSON.parse(fs.readFileSync(dataPath, "utf8")));
  }
  const overridesPath = path.join(__dirname, "showcase-page-overrides.json");
  if (fs.existsSync(overridesPath)) {
    deepMerge(pages, JSON.parse(fs.readFileSync(overridesPath, "utf8")));
  }
  return pages;
}

const slugs = fs
  .readdirSync(path.join(root, pagesDir))
  .filter((f) => f.endsWith(".page.tsx"))
  .map((f) => f.replace(".page.tsx", ""));

const pages = loadExistingPages();

for (const slug of slugs) {
  const fromGit = extractPageFromGit(slug);
  if (fromGit) {
    if (!pages[slug]) pages[slug] = {};
    deepMerge(pages[slug], fromGit);
  }
}

const en = { ...shell, pages };

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "en.json"), `${JSON.stringify(en, null, 2)}\n`, "utf8");

console.log(`Built apps/showcase/src/i18n/locales/en.json (${Object.keys(pages).length} page slugs)`);
