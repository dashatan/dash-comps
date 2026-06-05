import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localePath = path.join(root, "apps/showcase/src/i18n/locales/en.json");
const pagesDir = path.join(root, "apps/showcase/src/features/catalog/pages");

function readGit(file) {
  try {
    return execSync(`git show HEAD:apps/showcase/src/features/catalog/pages/${file}`, {
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

/** Manual git HEAD strings for p() keys not inside ShowcaseSection attrs. */
const gitStrings = {
  accordion: {
    singleCollapsible: {
      title: "Single collapsible",
      whatIsLibrary: {
        trigger: "What is this component library?",
        content:
          "A collection of production-ready React components built with Tailwind CSS v4, Radix UI, and motion-first interactions.",
      },
      darkMode: {
        trigger: "Does it support dark mode?",
        content:
          "Yes. Toggle between light and dark themes using the header control. Theme preference is persisted in local storage.",
      },
      staticSite: {
        trigger: "Can I use it in a static site?",
        content:
          "Absolutely. This showcase is built with Vite and exports to static HTML, CSS, and JS.",
      },
    },
    multipleOpen: {
      title: "Multiple open",
      designTokens: {
        trigger: "Design tokens",
        content: "Semantic colors, spacing, and typography variables.",
      },
      accessibility: {
        trigger: "Accessibility",
        content: "Built on Radix primitives with keyboard navigation.",
      },
    },
  },
  auth: {
    authLayout: {
      title: "Auth layout",
      signIn: "Sign in",
      description: "AuthLayout from @/components/layout/auth",
    },
  },
  badges: {
    combinations: {
      largeOutline: "Large outline",
      smallSquare: "Small square",
      highlight2xl: "2XL highlight",
    },
    modifiers: {
      highlighted: "Highlighted",
      outlineHighlight: "Outline + highlight",
    },
    variants: {
      outline: "Outline",
      ghost: "Ghost",
    },
  },
  banner: {
    withImage: {
      title: "With image",
      description: "Banner from @/components/common/banner.",
      heading: "Welcome banner",
      subheading: "Promotional surface with background image.",
    },
    contentOnly: {
      title: "Content only",
      content: "No image — gradient / solid background via className.",
    },
  },
  cards: {
    defaultCard: {
      title: "Default card",
      cardTitle: "Project overview",
      cardDescription: "Track progress across your active dashboards.",
      cardContent:
        "Cards adapt to light and dark themes using semantic tokens from your design system.",
      viewDetails: "View details",
      dismiss: "Dismiss",
    },
    variants: {
      title: "Variants",
      default: "Default",
      outline: "Outline",
      ghost: "Ghost",
    },
  },
  charts: {
    doughnut: {
      title: "Doughnut",
      done: "Done",
      pending: "Pending",
    },
  },
  chips: {
    customContent: {
      title: "Custom content",
      custom: "Custom",
      slotContent: " · slot content",
    },
  },
  collapsible: {
    expandableBlock: {
      title: "Expandable block",
      trigger: "Details",
      content: "Hidden content revealed when the trigger is activated.",
    },
  },
  "context-menu": {
    rightClickMenu: {
      title: "Right-click menu",
      trigger: "Right-click here",
      copy: "Copy",
      paste: "Paste",
      delete: "Delete",
    },
  },
  dashboard: {
    dashboardLayout: {
      title: "Dashboard layout",
      descriptionPrefix: "You are viewing this page inside the live dashboard shell from ",
      descriptionMiddle:
        " (collapsible sidebar, header, breadcrumbs). Toggle the sidebar icon or resize below md to open the mobile sheet menu.",
      descriptionSuffix: "@/components/layout/dashboard",
    },
  },
  divider: {
    horizontal: {
      title: "Horizontal",
      sectionAbove: "Section above",
      sectionBelow: "Section below",
    },
    vertical: {
      title: "Vertical",
      left: "Left",
      right: "Right",
    },
  },
  errors: {
    error: {
      title: "Error",
      networkFailed: "Network request failed",
    },
    successState: {
      title: "Success state",
      dataLoaded: "Data loaded successfully.",
    },
  },
  fadeable: {
    visibilityToggle: {
      title: "Visibility toggle",
      hide: "Hide",
      show: "Show",
      content: "Content fades in and out",
    },
  },
  flex: {
    row: {
      title: "Row",
      one: "One",
      two: "Two",
      three: "Three",
    },
    spaceBetween: {
      title: "Space between",
      start: "Start",
      end: "End",
    },
  },
  form: {
    reactHookForm: {
      title: "react-hook-form + inputs",
      description: "Same primitives used by @/components/compound/form FormField.",
      submit: "Submit",
      submittedToast: "Submitted: {{title}}",
      titleRequired: "Title is required",
    },
  },
};

const en = JSON.parse(fs.readFileSync(localePath, "utf8"));
if (!en.pages) en.pages = {};

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

function applyManual(slug, data) {
  if (!en.pages[slug]) en.pages[slug] = {};
  deepMerge(en.pages[slug], data);
}

for (const [slug, data] of Object.entries(gitStrings)) {
  applyManual(slug, data);
}

// Extract remaining string literals from git HEAD files for any still-missing p() keys
for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith(".page.tsx"))) {
  const slug = file.replace(".page.tsx", "");
  const current = fs.readFileSync(path.join(pagesDir, file), "utf8");
  const git = readGit(file);
  if (!git) continue;

  const gitStringsOrdered = [
    ...git.matchAll(/>([^<{][^<]*?)</g),
  ]
    .map((m) => m[1].trim())
    .filter((s) => s.length > 1 && !/^\{/.test(s));

  const pRe = /p\(["']([^"']+)["']/g;
  let match;
  const missingKeys = [];
  while ((match = pRe.exec(current)) !== null) {
    const fullKey = `pages.${slug}.${match[1]}`;
    if (get(en, fullKey) === undefined) missingKeys.push(match[1]);
  }

  // Try matching git quoted strings for simple keys ending in common suffixes
  const gitQuoted = [
    ...git.matchAll(/(?:title|description|label|message|tooltip|signIn|heading|subheading|content|trigger|copy|paste|delete|hide|show|submit|toast|done|pending|slide|one|two|three|a|b|start|end|left|right|sectionAbove|sectionBelow|viewDetails|dismiss|cardTitle|cardDescription|cardContent|custom|slotContent|networkFailed|dataLoaded)=["']([^"']+)["']/g),
  ].map((m) => m[1]);

  for (const key of missingKeys) {
    if (get(en, `pages.${slug}.${key}`) !== undefined) continue;
    const leaf = key.split(".").pop() ?? key;
    const candidate = gitQuoted.find(
      (s) =>
        s.toLowerCase().includes(leaf.toLowerCase()) ||
        leaf.toLowerCase().includes(s.toLowerCase().slice(0, 4)),
    );
    if (candidate) set(en, `pages.${slug}.${key}`, candidate);
  }
}

fs.writeFileSync(localePath, `${JSON.stringify(en, null, 2)}\n`, "utf8");
console.log("Filled remaining showcase keys");
