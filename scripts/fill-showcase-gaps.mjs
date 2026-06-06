import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localesDir = path.join(root, "apps/showcase/src/i18n/locales");
const pagesDir = path.join(root, "apps/showcase/src/features/catalog/pages");

const ACRONYMS = new Set(["a11y", "mrr", "saas", "api", "otp", "id", "ui", "ux"]);

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

function humanizeKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_.]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function titleCase(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      if (lower === "and") return "and";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

/** Page-specific complete translations for expanded sections. */
const PAGE_OVERRIDES = {
  accordion: {
    singleCollapsible: {
      description: "Only one section open at a time; opening another closes the rest.",
    },
    multipleOpen: {
      description: "Multiple sections can stay open simultaneously.",
      composition: {
        trigger: "Composition",
        content: "Combine AccordionItem, AccordionTrigger, and AccordionContent for flexible layouts.",
      },
    },
    singleExclusive: {
      title: "Single exclusive",
      description: "One section must always remain open — collapsible is disabled.",
      account: {
        trigger: "Account settings",
        content: "Manage profile details, email preferences, and connected accounts.",
      },
      billing: {
        trigger: "Billing",
        content: "View invoices, update payment methods, and download receipts.",
      },
      notifications: {
        trigger: "Notifications",
        content: "Choose which events send email, push, or in-app alerts.",
      },
    },
    defaultOpen: {
      title: "Default open",
      description: "Use defaultValue to open a section on first render.",
      shipping: {
        trigger: "Shipping policy",
        content: "Orders ship within 2 business days. Tracking is emailed once dispatched.",
      },
      returns: {
        trigger: "Returns & refunds",
        content: "Return unused items within 30 days for a full refund.",
      },
      support: {
        trigger: "Support hours",
        content: "Live chat is available weekdays 9:00–18:00. Weekend requests are answered Monday.",
      },
    },
    defaultOpenMultiple: {
      title: "Default open (multiple)",
      description: "Pass an array to defaultValue when type=\"multiple\".",
      tokens: {
        trigger: "Design tokens",
        content: "Semantic colors, spacing, and typography variables shared across components.",
      },
      a11y: {
        trigger: "Accessibility",
        content: "Keyboard navigation, focus rings, and ARIA attributes from Radix primitives.",
      },
      motion: {
        trigger: "Motion",
        content: "Height animations use CSS variables for smooth expand and collapse.",
      },
    },
    controlled: {
      title: "Controlled",
      description: "Drive the open section with value and onValueChange.",
      openFirst: "Open first",
      openSecond: "Open second",
      collapseAll: "Collapse all",
      current: "Open section: {{value}}",
      none: "none",
      profile: {
        trigger: "Profile",
        content: "Update display name, avatar, and public profile fields.",
      },
      security: {
        trigger: "Security",
        content: "Change password, enable two-factor authentication, and review sessions.",
      },
    },
    disabledItems: {
      title: "Disabled items",
      description: "Disabled AccordionItem values cannot be toggled.",
      available: {
        trigger: "Available section",
        content: "This item is interactive and can be expanded.",
      },
      locked: {
        trigger: "Locked section",
        content: "This item is disabled and cannot be opened.",
      },
      another: {
        trigger: "Another available section",
        content: "Disabled neighbors do not block other items.",
      },
    },
    singleItem: {
      title: "Single item",
      description: "An accordion with one item still exposes full keyboard support.",
      trigger: "Only section",
      content: "Useful for FAQ entries or compact disclosure panels.",
    },
    richContent: {
      title: "Rich content",
      description: "AccordionContent accepts any React nodes — lists, paragraphs, and actions.",
      trigger: "Release notes",
      intro: "Version 2.1 includes the following highlights:",
      listItem1: "New chart layouts and tooltip formatters",
      listItem2: "Improved RTL support across inputs and overlays",
      listItem3: "Performance fixes for virtualized lists",
      outro: "See the changelog for migration notes.",
    },
  },
  form: {
    actions: { submit: "Submit", reset: "Reset", search: "Search" },
    basicUsage: {
      title: "Basic usage",
      description: "Minimal Form + FormField + FormActions wiring with react-hook-form.",
      titleLabel: "Title",
      agreeLabel: "I agree to the terms",
      submittedToast: "Submitted: {{title}}",
    },
    textFields: {
      title: "Text fields",
      description: "Text, password, phone, and textarea inputs inside FormField.",
      username: "Username",
      password: "Password",
      phone: "Phone",
      bio: "Bio",
      submittedToast: "Text fields saved.",
    },
    numericFields: {
      title: "Numeric fields",
      description: "Number, weight, and range inputs with presets.",
      quantity: "Quantity",
      weight: "Weight (kg)",
      priceRange: "Price range",
      submittedToast: "Numeric fields saved.",
      presets: { light: "Light (0–5 kg)", medium: "Medium (5–20 kg)", heavy: "Heavy (20–100 kg)" },
    },
    selectionFields: {
      title: "Selection fields",
      description: "Select, multi-select, tree select, tags, and radio groups.",
      product: "Product",
      categoriesLabel: "Categories",
      department: "Department",
      tags: "Tags",
      shippingLabel: "Shipping",
      submittedToast: "Selection saved.",
      groups: { electronics: "Electronics", lifestyle: "Lifestyle" },
      categories: {
        accessories: "Accessories",
        audio: "Audio",
        furniture: "Furniture",
        decor: "Decor",
      },
      shipping: { standard: "Standard", express: "Express", pickup: "Store pickup" },
    },
    toggleFields: {
      title: "Toggle fields",
      description: "Checkbox and switch fields bound to form state.",
      newsletter: "Subscribe to newsletter",
      notifications: "Enable push notifications",
      submittedToast: "Preferences saved.",
    },
    specializedFields: {
      title: "Specialized fields",
      description: "Date, OTP, and license plate inputs.",
      birthDate: "Birth date",
      verificationCode: "Verification code",
      plate: "License plate",
      submittedToast: "Specialized fields saved.",
    },
    fieldStates: {
      title: "Field states",
      description: "Error, success, warning, and disabled presentations.",
      error: "Email",
      errorMessage: "Enter a valid email address.",
      success: "Username",
      successMessage: "Username is available.",
      warning: "Display name",
      warningMessage: "This name may be visible to other users.",
      disabled: "Referral code",
    },
    validation: {
      title: "Validation",
      description: "Client-side rules with onInvalid feedback.",
      email: "Email",
      password: "Password",
      emailRequired: "Email is required.",
      passwordMin: "Password must be at least 8 characters.",
      successToast: "Validation passed.",
      invalidToast: "Fix the highlighted fields.",
      imageAlt: "Team reviewing form submissions",
      imageCaption: "Validated submissions sync instantly.",
      imageHint: "Use onInvalid for toast or inline summaries.",
    },
    formHistory: {
      title: "Form history",
      description: "FormHistory persists recent submissions in local storage.",
      keyword: "Keyword",
      plate: "Plate",
      dateRange: "Date range",
      submittedToast: "Search saved to history.",
      columns: { keyword: "Keyword", plate: "Plate", dateRange: "Date range" },
    },
    productListing: {
      title: "Product listing",
      description: "Composite form with image preview and product grid.",
      previewLabel: "Preview",
      titleField: "Listing title",
      product: "Product",
      category: "Category",
      price: "Price",
      descriptionField: "Description",
      featured: "Featured listing",
      publish: "Publish immediately",
      submit: "Save listing",
      successToast: "Listing saved: {{title}}",
    },
    defaults: {
      username: "jane.doe",
      bio: "Product designer · Tehran",
      validValue: "Valid value",
      reviewValue: "Needs review",
      lockedValue: "Locked value",
    },
    products: {
      watch: {
        title: "Smart watch",
        subtitle: "Series X · midnight",
        description: "Fitness tracking, notifications, and week-long battery.",
        imageAlt: "Smart watch product photo",
      },
      headphones: {
        title: "Wireless headphones",
        subtitle: "Noise cancelling",
        description: "Over-ear comfort with adaptive transparency mode.",
        imageAlt: "Headphones product photo",
      },
      camera: {
        title: "Mirrorless camera",
        subtitle: "24 MP · 4K video",
        description: "Compact body with interchangeable lens mount.",
        imageAlt: "Camera product photo",
      },
      sneaker: {
        title: "Running sneaker",
        subtitle: "Lightweight mesh",
        description: "Responsive foam midsole for daily training.",
        imageAlt: "Sneaker product photo",
      },
      chair: {
        title: "Desk chair",
        subtitle: "Ergonomic · adjustable",
        description: "Lumbar support with breathable fabric seat.",
        imageAlt: "Desk chair product photo",
      },
      plant: {
        title: "Desk plant",
        subtitle: "Low maintenance",
        description: "Potted succulent suited for indoor light.",
        imageAlt: "Desk plant product photo",
      },
    },
  },
};

function inferTranslation(slug, keyPath) {
  const parts = keyPath.split(".");
  const leaf = parts[parts.length - 1];
  const section = parts[0];

  if (leaf === "submit" || leaf === "submitLabel") return "Submit";
  if (leaf === "reset" || leaf === "resetLabel") return "Reset";
  if (leaf === "search") return "Search";
  if (leaf === "cancel") return "Cancel";
  if (leaf === "close") return "Close";
  if (leaf === "open") return "Open";
  if (leaf === "hide") return "Hide";
  if (leaf === "show") return "Show";
  if (leaf === "copy") return "Copy";
  if (leaf === "paste") return "Paste";
  if (leaf === "delete") return "Delete";
  if (leaf === "export") return "Export";
  if (leaf === "done") return "Done";
  if (leaf === "pending") return "Pending";
  if (leaf === "alt" || leaf === "imageAlt") return `${titleCase(section)} image`;

  if (leaf === "title") return titleCase(section);
  if (leaf === "description") {
    if (section === "description") return "Supporting description text.";
    return `${titleCase(section)} examples and configuration options.`;
  }
  if (leaf === "trigger") return titleCase(parts[parts.length - 2] ?? section);
  if (leaf === "content") {
    const subject = titleCase(parts[parts.length - 2] ?? section).toLowerCase();
    return `Details about ${subject}.`;
  }
  if (leaf === "intro") return `Overview of ${titleCase(section).toLowerCase()}.`;
  if (leaf === "outro") return "Additional notes and references.";
  if (/^listItem\d+$/.test(leaf)) return `Bullet point ${leaf.replace("listItem", "")}.`;
  if (leaf === "message" || leaf.endsWith("Message")) return "Sample message text.";
  if (leaf.includes("Toast") || leaf.includes("toast")) {
    if (leaf.includes("success") || keyPath.includes("submitted")) return "Saved successfully.";
    if (leaf.includes("invalid") || leaf.includes("error")) return "Something went wrong.";
    return "Done.";
  }
  if (leaf === "current" && keyPath.includes("controlled")) return "Current: {{value}}";
  if (leaf === "none") return "none";
  if (leaf === "label" || leaf.endsWith("Label")) return titleCase(leaf.replace(/Label$/, "") || section);
  if (parts.includes("series") || parts.includes("frames") || parts.includes("titles")) {
    return titleCase(leaf);
  }
  if (parts.includes("descriptions")) return `${titleCase(parts[parts.length - 1] ?? section)} dashboard sample.`;
  if (leaf === "info" && keyPath.includes("step")) return "Step {{step}} of {{total}}";

  return titleCase(leaf);
}

function isPlaceholderValue(keyPath, value) {
  const leaf = keyPath.split(".").pop() ?? keyPath;
  return value === humanizeKey(leaf);
}

const fbfb767 = JSON.parse(
  execSync("git show fbfb767:apps/showcase/src/i18n/locales/en.json", {
    cwd: root,
    encoding: "utf8",
  }),
);

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
if (!en.pages) en.pages = {};

for (const [slug, data] of Object.entries(PAGE_OVERRIDES)) {
  if (!en.pages[slug]) en.pages[slug] = {};
  deepMerge(en.pages[slug], data);
}

let filled = 0;
for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith(".page.tsx"))) {
  const slug = file.replace(".page.tsx", "");
  const src = fs.readFileSync(path.join(pagesDir, file), "utf8");
  const re = /p\(["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(src)) !== null) {
    const suffix = match[1];
    const fullKey = `pages.${slug}.${suffix}`;
    const current = get(en, fullKey);
    if (current !== undefined && !isPlaceholderValue(suffix, current)) continue;
    if (get(PAGE_OVERRIDES, `${slug}.${suffix}`) !== undefined) continue;
    const value = inferTranslation(slug, suffix);
    set(en, fullKey, value);
    filled++;
  }
}

fs.writeFileSync(path.join(localesDir, "en.json"), `${JSON.stringify(en, null, 2)}\n`, "utf8");
console.log(`Filled ${filled} placeholder translations in en.json`);
