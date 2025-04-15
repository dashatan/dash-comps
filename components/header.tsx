'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeBuilder } from '@/components/theme-builder';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            Home
          </a>
          <a
            href="#projects"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Projects
          </a>
          <a
            href="#components"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Components
          </a>
          <a
            href="#contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contact
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ThemeBuilder />
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-foreground"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
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
              Home
            </a>
            <a
              href="#projects"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              Projects
            </a>
            <a
              href="#components"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              Components
            </a>
            <a
              href="#contact"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              Contact
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
