"use client";

import * as React from "react";
import { Button } from "@/components/common/buttons";
import { useTheme } from "next-themes";
import { useThemePersistence } from "@/lib/hooks/use-theme-persistence";
import {
  extractThemeColors,
  categorizeColors,
  createColorSettings,
  resetThemeColors,
} from "./theme-helpers";
import { ColorVar } from "./types";
import { useLanguage } from "@/lib";
import { Settings, X } from "lucide-react";

/**
 * ThemeBuilder component for customizing theme colors
 */
export function ThemeBuilder() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [colors, setColors] = React.useState<ColorVar[]>([]);
  const [resetKey, setResetKey] = React.useState(0);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { isLoaded, saveTheme } = useThemePersistence();
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Handle clicks outside the panel to close it
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Load theme colors
  React.useEffect(() => {
    if (!isLoaded) return;
    const themeColors = extractThemeColors();
    setColors(themeColors);
  }, [theme, resetKey, isLoaded]);

  // Handle color change
  function handleColorChange(name: string, newValue: string) {
    // Update the CSS variable in real-time
    document.documentElement.style.setProperty(name, newValue);

    // Update state
    setColors((prev: ColorVar[]) =>
      prev.map((color: ColorVar) =>
        color.name === name ? { ...color, value: newValue } : color,
      ),
    );

    // Auto-save theme changes
    const colorSettings = createColorSettings(colors);
    saveTheme(colorSettings);
  }

  // Reset theme
  function handleResetTheme() {
    resetThemeColors(colors);
    setResetKey((prev: number) => prev + 1);
  }

  // Categorize colors for display
  const categorizedColors = categorizeColors(colors);

  return (
    <>
      {/* Theme Builder Button */}
      <Button
        variant="outlined"
        size={32}
        className="rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 left-0 z-7 h-screen w-96 max-w-full transform border-r border-border bg-card transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="text"
                size={32}
                className="rounded-full hover:text-destructive"
                onClick={() => setIsOpen(false)}
                aria-label={t("common.close")}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">{t("common.close")}</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* <Tabs defaultValue="background" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="background">
                  {t('themeBuilder.background')}
                </TabsTrigger>
                <TabsTrigger value="primary">
                  {t('themeBuilder.primary')}
                </TabsTrigger>
                <TabsTrigger value="utility">
                  {t('themeBuilder.utility')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="background">
                <ColorCategory
                  colors={categorizedColors.background}
                  onChange={handleColorChange}
                />
              </TabsContent>

              <TabsContent value="primary">
                <ColorCategory
                  colors={categorizedColors.primary}
                  onChange={handleColorChange}
                />
              </TabsContent>

              <TabsContent value="utility">
                <ColorCategory
                  colors={categorizedColors.utility}
                  onChange={handleColorChange}
                />
              </TabsContent>
            </Tabs> */}
          </div>

          <div className="border-t border-border p-6">
            <Button
              variant="outlined"
              className="w-full"
              onClick={handleResetTheme}
            ></Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
