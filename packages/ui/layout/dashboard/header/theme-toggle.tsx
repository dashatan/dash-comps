"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Button from "@/components/common/buttons";
import { useLanguage } from "@/lib";
import { motion, AnimatePresence } from "framer-motion";

const iconVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
};

const transition = {
  type: "spring" as const,
  stiffness: 600,
  damping: 30,
  duration: 0.2,
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <div className="mt-1 flex items-center gap-2">
      <Button
        variant="outlined"
        severity="info"
        size={40}
        className="relative overflow-hidden rounded-full p-0"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        tooltip={isDark ? t("common.lightMode") : t("common.darkMode")}
        tooltipOptions={{
          openDelay: 100,
          closeDelay: 100,
          side: "bottom",
          align: "center",
          className: "text-base font-bold p-2",
        }}
      >
        <AnimatePresence initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              {...iconVariants}
              initial={{ ...iconVariants.initial, rotate: -90 }}
              animate={{ ...iconVariants.animate, rotate: 0 }}
              exit={{ ...iconVariants.exit, rotate: 90 }}
              transition={transition}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="text-sidebar-foreground" size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              {...iconVariants}
              initial={{ ...iconVariants.initial, rotate: 90 }}
              animate={{ ...iconVariants.animate, rotate: 0 }}
              exit={{ ...iconVariants.exit, rotate: -90 }}
              transition={transition}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="text-sidebar-foreground" size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}

export const themesOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "ocean", label: "Ocean" },
  { value: "forest", label: "Forest" },
  { value: "sunset", label: "Sunset" },
  { value: "nord", label: "Nord" },
  { value: "dracula", label: "Dracula" },
];
