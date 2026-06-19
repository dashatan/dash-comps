import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/common/buttons";
import { FadeIn } from "@/shared/motion/primitives";

type HomeSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  seeAllLabel: string;
  seeAllTo: "/components";
  seeAllHash?: "compound" | "common";
};

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  seeAllLabel,
  seeAllTo,
  seeAllHash,
}: HomeSectionHeaderProps) {
  return (
    <FadeIn className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 flex-1">
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-primary mb-2 text-xs font-semibold tracking-[0.2em] uppercase"
        >
          {eyebrow}
        </motion.p>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">{title}</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
          {description}
        </p>
      </div>

      <Link to={seeAllTo} hash={seeAllHash}>
        <Button
          variant="outlined"
          size="md"
          rightIcon={<ArrowUpRight className="size-4" />}
          className="shrink-0"
        >
          {seeAllLabel}
        </Button>
      </Link>
    </FadeIn>
  );
}
