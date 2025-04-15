'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useThemePersistence } from '@/lib/hooks/use-theme-persistence';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorCategory } from '@/components/theme-builder/color-category';
import type { ColorVar } from '@/components/theme-builder/types';
import {
  extractThemeColors,
  categorizeColors,
  createColorSettings,
  resetThemeColors,
} from '@/components/theme-builder/theme-helpers';

/**
 * ThemeBuilder component for customizing theme colors
 */
export function ThemeBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [colors, setColors] = useState<ColorVar[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const { theme } = useTheme();
  const { isLoaded, saveTheme } = useThemePersistence();
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the panel to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load theme colors
  useEffect(() => {
    if (!isLoaded) return;
    const themeColors = extractThemeColors();
    setColors(themeColors);
  }, [theme, resetKey, isLoaded]);

  // Handle color change
  function handleColorChange(name: string, newValue: string) {
    // Update the CSS variable in real-time
    document.documentElement.style.setProperty(name, newValue);

    // Update state
    setColors((prev) =>
      prev.map((color) =>
        color.name === name ? { ...color, value: newValue } : color
      )
    );

    // Auto-save theme changes
    const colorSettings = createColorSettings(colors);
    saveTheme(colorSettings);
  }

  // Reset theme
  function handleResetTheme() {
    resetThemeColors(colors);
    setResetKey((prev) => prev + 1);
  }

  // Categorize colors for display
  const categorizedColors = categorizeColors(colors);

  return (
    <>
      {/* Theme Builder Button */}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Theme Builder</span>
      </Button>

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 left-0 h-screen w-96 max-w-full bg-card border-r border-border z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Theme Builder</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-destructive"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <Tabs defaultValue="background" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="background">Background</TabsTrigger>
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="utility">Utility</TabsTrigger>
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
            </Tabs>
          </div>

          <div className="p-6 border-t border-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResetTheme}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
