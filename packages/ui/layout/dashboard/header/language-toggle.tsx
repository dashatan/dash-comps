"use client";

import { useLanguage } from "@/lib";
import Button from "@/components/common/buttons";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outlined"
      severity="info"
      className="h-8 w-8 p-0"
      onClick={() => setLanguage(language === "en" ? "fa" : "en")}
    >
      <Languages className="text-sidebar-foreground h-4 w-4 fill-current" />
    </Button>
  );
}
