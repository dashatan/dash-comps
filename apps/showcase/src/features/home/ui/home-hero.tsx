import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/common/buttons";
import {
  catalogCategories,
  catalogCategoryGroups,
} from "@/features/catalog/registry";
import { useShowcaseShell } from "@/features/catalog/i18n";
import { cn } from "@/lib";

const commonCount =
  catalogCategoryGroups.find((g) => g.group === "common")?.items.length ?? 0;
const compoundCount =
  catalogCategoryGroups.find((g) => g.group === "compound")?.items.length ?? 0;

export function HomeHero() {
  const { appName, home } = useShowcaseShell();

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] [background-size:3rem_3rem] opacity-[0.35]"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -end-16 -top-24 size-72 rounded-full bg-primary/25 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -start-10 -bottom-20 size-56 rounded-full bg-secondary/30 blur-3xl"
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.25, 0.45, 0.25] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10 flex flex-col gap-10 p-8 md:p-12 lg:p-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            {home.badge}
          </div>

          <p className="mb-3 text-sm font-medium tracking-widest text-muted-foreground uppercase">
            {appName}
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block">{home.title}</span>
            <span className="mt-1 block bg-linear-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent">
              {home.titleHighlight}
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {home.description}
          </p>

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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-3 sm:grid-cols-3"
        >
          <HeroStat
            icon={Layers}
            label={home.stats.total(catalogCategories.length)}
            accent="from-primary/15 to-primary/5"
          />
          <HeroStat
            icon={Zap}
            label={home.stats.common(commonCount)}
            accent="from-sky-500/15 to-sky-500/5"
          />
          <HeroStat
            icon={Sparkles}
            label={home.stats.compound(compoundCount)}
            accent="from-violet-500/15 to-violet-500/5"
          />
        </motion.div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"
      />
    </section>
  );
}

function HeroStat({
  icon: Icon,
  label,
  accent,
}: {
  icon: typeof Layers;
  label: string;
  accent: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 px-4 py-3.5 backdrop-blur-sm",
        "bg-linear-to-br",
        accent,
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background/70 text-primary shadow-sm">
        <Icon className="size-4" />
      </div>
      <p className="text-sm font-semibold tracking-tight">{label}</p>
    </div>
  );
}
