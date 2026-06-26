"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@dash/core";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardDirection } from "@dash/ui/layout/dashboard/direction/use-dashboard-direction";
import { getMotionSpinDirection } from "@dash/ui/layout/dashboard/direction/rotation";
import { HeaderIconButton } from "@dash/ui/layout/dashboard/header/header-icon-button";

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
  const { isRtl } = useDashboardDirection();
  const spin = getMotionSpinDirection(isRtl);
  const isDark = theme === "dark";

  return (
    <HeaderIconButton
      onClick={() => setTheme(isDark ? "light" : "dark")}
      tooltip={isDark ? t("common.lightMode") : t("common.darkMode")}
      tooltipOptions={{
        openDelay: 100,
        closeDelay: 100,
        side: "bottom",
        align: "center",
        className: "text-base font-bold p-2",
      }}
      aria-label={isDark ? t("common.lightMode") : t("common.darkMode")}
    >
      <AnimatePresence initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            {...iconVariants}
            initial={{ ...iconVariants.initial, rotate: -90 * spin }}
            animate={{ ...iconVariants.animate, rotate: 0 }}
            exit={{ ...iconVariants.exit, rotate: 90 * spin }}
            transition={transition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="text-sidebar-foreground" size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            {...iconVariants}
            initial={{ ...iconVariants.initial, rotate: 90 * spin }}
            animate={{ ...iconVariants.animate, rotate: 0 }}
            exit={{ ...iconVariants.exit, rotate: -90 * spin }}
            transition={transition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="text-sidebar-foreground" size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </HeaderIconButton>
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
