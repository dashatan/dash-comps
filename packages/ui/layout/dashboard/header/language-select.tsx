"use client";

import { useLanguage } from "@dash/core";
import { useEffect, useState, useRef } from "react";
import Button from "@dash/ui/common/buttons";
import { Globe } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dash/ui/common/overlay/popover";
import List from "@dash/ui/common/inputs/list";

const languageOptions = [
  { label: "English", value: "en" },
  { label: "فارسی", value: "fa" },
  { label: "العربية", value: "ar" },
];

export default function LanguageSelect() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) return null;

  const currentLanguage = languageOptions.find((opt) => opt.value === language);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outlined"
          severity="info"
          size={40}
          className="relative h-8 w-8 overflow-hidden rounded-full p-0 transition-all duration-300"
        >
          <Globe className="text-sidebar-foreground" size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-input" withPortal>
        <List
          className="flex h-fit w-28 flex-col gap-2 rounded-md border border-input-border p-2"
          itemClassName="text-center p-2"
          onChange={(option) => {
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
