"use client";

import { useLanguage } from "@dash/core";
import Button from "@dash/ui/common/buttons";
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
      <Languages className="h-4 w-4 fill-current text-sidebar-foreground" />
    </Button>
  );
}
