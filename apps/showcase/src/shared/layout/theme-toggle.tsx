import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/common/buttons";
import { useLanguage } from "@/lib/language/client";

export function ThemeToggle() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Button variant="text" size={32} className="rounded-full" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="text"
      size={32}
      className="relative overflow-hidden rounded-full hover:text-primary"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("common.toggleTheme")}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-center"
      >
        {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
      </motion.span>
    </Button>
  );
}
