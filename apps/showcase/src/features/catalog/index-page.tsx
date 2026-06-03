import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition, AnimatedList, AnimatedItem, HoverScale } from "@/shared/motion/primitives";
import { catalogCategories } from "@/features/catalog/registry";
import { ArrowUpRight } from "lucide-react";
import { useShowcaseI18n } from "@/i18n";

export function CatalogIndexPage() {
  const { t } = useShowcaseI18n();

  return (
    <PageTransition>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{t.catalog.indexTitle}</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">{t.catalog.indexDescription}</p>
      </motion.div>

      <AnimatedList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalogCategories.map((category) => (
          <AnimatedItem key={category.slug}>
            <HoverScale scale={1.015}>
              <Link
                to={`/components/${category.slug}`}
                className="group border-border bg-card/50 flex items-start gap-4 rounded-2xl border p-5 backdrop-blur-sm transition-colors hover:border-primary/30"
              >
                <motion.div
                  whileHover={{ rotate: 8 }}
                  className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl"
                >
                  <category.icon className="size-5" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{t.categories[category.slug].title}</h3>
                    <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {t.categories[category.slug].description}
                  </p>
                </div>
              </Link>
            </HoverScale>
          </AnimatedItem>
        ))}
      </AnimatedList>
    </PageTransition>
  );
}
