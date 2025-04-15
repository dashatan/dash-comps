'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeBuilder } from '@/components/theme-builder';
import { LanguageToggle } from '@/components/language-toggle';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">Dash-Comps</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('common.home')}
          </a>
          <a
            href="#projects"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('common.projects')}
          </a>
          <a
            href="#components"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('common.components')}
          </a>
          <a
            href="#contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('common.contact')}
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <ThemeBuilder />
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-foreground"
            onClick={toggleMobileMenu}
            aria-label={t('accessibility.menuOpen')}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-4">
            <a
              href="#"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              {t('common.home')}
            </a>
            <a
              href="#projects"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              {t('common.projects')}
            </a>
            <a
              href="#components"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              {t('common.components')}
            </a>
            <a
              href="#contact"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              {t('common.contact')}
            </a>
            <div className="pt-2">
              <ThemeBuilder />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
