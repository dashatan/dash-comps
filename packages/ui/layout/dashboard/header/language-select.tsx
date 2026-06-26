"use client";

import { useLanguage } from "@dash/core";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dash/ui/common/overlay/popover";
import List from "@dash/ui/common/inputs/list";
import { HeaderIconButton } from "@dash/ui/layout/dashboard/header/header-icon-button";

const languageOptions = [
  { label: "English", value: "en" },
  { label: "فارسی", value: "fa" },
  { label: "العربية", value: "ar" },
];

export default function LanguageSelect() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentLanguage = languageOptions.find((opt) => opt.value === language);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <HeaderIconButton
          type="button"
          aria-label={currentLanguage?.label ?? "Language"}
        >
          <Globe className="text-sidebar-foreground" size={20} />
        </HeaderIconButton>
      </PopoverTrigger>
      <PopoverContent className="bg-input" withPortal>
        <List
          className="flex h-fit w-28 flex-col gap-2 rounded-md border border-input-border p-2"
          itemClassName="text-center p-2"
          onChange={(option) => {
            if (typeof option.value !== "string") return;
            setLanguage(option.value as "en" | "fa" | "ar");
            setIsOpen(false);
          }}
          value={currentLanguage?.value}
          virtualized={false}
          data={languageOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
        />
      </PopoverContent>
    </Popover>
  );
}
