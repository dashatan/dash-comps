import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const appSrc = path.resolve(__dirname, "src");
const corePkg = path.join(root, "packages/core").replace(/\\/g, "/");
const stubsPkg = path.join(root, "packages/stubs").replace(/\\/g, "/");

const coreAlias = (prefix: string) =>
  [
    { find: `${prefix}/`, replacement: `${corePkg}/` },
    { find: prefix, replacement: `${corePkg}/index.ts` },
  ] as const;

export default defineConfig({
  plugins: [tanstackRouter({ target: "react" }), react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      { find: "next/link", replacement: path.join(stubsPkg, "next/link.tsx") },
      {
        find: "next/navigation",
        replacement: path.join(stubsPkg, "next/navigation.ts"),
      },
      {
        find: "next/image",
        replacement: path.join(stubsPkg, "next/image.tsx"),
      },
      {
        find: "next/dynamic",
        replacement: path.join(stubsPkg, "next/dynamic.tsx"),
      },
      {
        find: "@/features/dashboard/utils/menu-items",
        replacement: path.join(stubsPkg, "features/dashboard/menu-items.ts"),
      },
      {
        find: "@/features/users-management/types",
        replacement: path.join(stubsPkg, "features/users-management/types.ts"),
      },
      ...coreAlias("@/lib"),
      ...coreAlias("@dash/core"),
      { find: "@/components", replacement: path.join(root, "packages/ui") },
      { find: "@/store", replacement: path.join(root, "packages/core/store") },
      { find: "@/utils", replacement: path.join(stubsPkg, "utils") },
      { find: "@dash/ui", replacement: path.join(root, "packages/ui") },
      { find: "@dash/styles", replacement: path.join(root, "packages/styles") },
      { find: "@dash/stubs", replacement: stubsPkg },
      {
        find: "@dash/features",
        replacement: path.join(root, "packages/core/features"),
      },
      { find: "@", replacement: appSrc },
    ],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
