import React from 'react';
import Link from 'next/link';
import { GithubIcon, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FooterSection(): React.ReactElement {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-b from-background to-secondary/5 border-t border-border/50 py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Let's Connect
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Get in touch for collaborations or just to say hello
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-16">
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 text-primary">
              About
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Passionate about creating modern web experiences with clean code
              and beautiful design. Let's build something amazing together.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 text-primary">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  All Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left col-span-1 sm:col-span-2 md:col-span-1 mt-6 sm:mt-0">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 text-primary">
              Social
            </h3>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300 h-9 w-9 sm:h-10 sm:w-10"
                asChild
              >
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <GithubIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300 h-9 w-9 sm:h-10 sm:w-10"
                asChild
              >
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300 h-9 w-9 sm:h-10 sm:w-10"
                asChild
              >
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-6 border-t border-border/30">
          <p>
            © {new Date().getFullYear()} Creative Developer. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
