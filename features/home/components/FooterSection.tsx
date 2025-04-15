import React from 'react';
import Link from 'next/link';
import { GithubIcon, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FooterSection(): React.ReactElement {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-b from-background to-secondary/5 border-t border-border/50 py-24 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Let's Connect
          </h2>
          <p className="text-lg text-muted-foreground">
            Get in touch for collaborations or just to say hello
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 text-primary">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              Passionate about creating modern web experiences with clean code
              and beautiful design. Let's build something amazing together.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  All Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 text-primary">Social</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                asChild
              >
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                asChild
              >
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                asChild
              >
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Creative Developer. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
