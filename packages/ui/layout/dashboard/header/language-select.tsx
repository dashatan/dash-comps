"use client";

import { useLanguage } from "@/lib";
import { useEffect, useState, useRef } from "react";
import Button from "@/components/common/buttons";
import { Globe } from "lucide-react";

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outlined"
        severity="info"
        size={40}
        className="relative h-8 w-8 overflow-hidden rounded-full p-0 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="text-sidebar-foreground" size={20} />
      </Button>

      <div
        className={`absolute top-full left-1/2 mt-1 w-32 -translate-x-1/2 rounded-md border border-gray-200 bg-white shadow-lg transition-all duration-200 ease-in-out dark:border-gray-700 dark:bg-gray-800 ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {languageOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setLanguage(option.value as "en" | "fa" | "ar");
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
              option.value === language ? "bg-gray-100 dark:bg-gray-700" : ""
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
