import { useEffect } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/shared/motion/primitives";
import {
  catalogCategoryGroups,
  type CatalogGroup,
} from "@/features/catalog/registry";
import { useCatalogNavGroups } from "@/features/catalog/hooks/use-catalog-nav-groups";
import { CatalogIndexGroup } from "@/features/catalog/ui/catalog-index-group";
import { useShowcaseShell } from "@/features/catalog/i18n";

function resolveHashGroup(hash: string): CatalogGroup | undefined {
  if (hash === "compound" || hash === "common") return hash;
  return undefined;
}

export function CatalogIndexPage() {
  const { nav, catalog, categoryTitle, categoryDescription } =
    useShowcaseShell();
  const { isGroupOpen, setGroupOpen } = useCatalogNavGroups();

  useEffect(() => {
    const group = resolveHashGroup(window.location.hash.replace("#", ""));
    if (!group) return;

    setGroupOpen(group, true);
    requestAnimationFrame(() => {
      document
        .getElementById(group)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [setGroupOpen]);

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold tracking-tight">
          {catalog.indexTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {catalog.indexDescription}
        </p>
      </motion.div>

      <div className="space-y-4">
        {catalogCategoryGroups.map(({ group, items }) => (
          <CatalogIndexGroup
            key={group}
            group={group}
            label={nav[group]}
            items={items}
            isOpen={isGroupOpen(group)}
            onOpenChange={(open) => setGroupOpen(group, open)}
            getTitle={(category) => categoryTitle(category.slug)}
            getDescription={(category) => categoryDescription(category.slug)}
            groupComponentsLabel={catalog.groupComponents}
          />
        ))}
      </div>
    </PageTransition>
  );
}
