import { Link } from "@tanstack/react-router";
import { catalogLinkParams } from "@/shared/router/nav-link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  PageTransition,
  AnimatedList,
  AnimatedItem,
  HoverShadow,
} from "@/shared/motion/primitives";
import { catalogCategories } from "@/features/catalog/registry";
import { Button } from "@/components/common/buttons";
import { useShowcaseShell } from "@/features/catalog/i18n";

export function HomePage() {
  const { home, categoryTitle, categoryDescription } = useShowcaseShell();

  return (
    <PageTransition>
      <section className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary/10 via-card to-card p-8 md:p-12">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            {home.badge}
          </div>

          <h1 className="flex gap-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {home.title}
            <span className="block text-primary">{home.titleHighlight}</span>
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">{home.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/components">
              <Button
                severity="primary"
                size="lg"
                rightIcon={<ArrowRight className="size-4" />}
              >
                {home.browse}
              </Button>
            </Link>
            <Link to="/components/$slug" params={{ slug: "buttons" }}>
              <Button variant="outlined" size="lg">
                {home.startButtons}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <AnimatedList className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {catalogCategories.map((category) => (
          <AnimatedItem key={category.slug}>
            <HoverShadow className="block rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-primary/40">
              <Link to="/components/$slug" params={catalogLinkParams(category.slug)}>
                <category.icon className="mb-3 size-5 text-primary" />
                <h3 className="font-semibold">{categoryTitle(category.slug)}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {categoryDescription(category.slug)}
                </p>
              </Link>
            </HoverShadow>
          </AnimatedItem>
        ))}
      </AnimatedList>
    </PageTransition>
  );
}
