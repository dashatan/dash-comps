import React from 'react';
import Link from 'next/link';
import { GithubIcon, Mail, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection(): React.ReactElement {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden pt-16 px-4"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Hi, I am <span className="text-primary">Daniel Ochi</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          A seasoned <span className="text-primary">Frontend Developer</span>{' '}
          transforming ideas into stunning digital experiences. Let's create
          something amazing!
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <GithubIcon className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="mailto:example@email.com">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:text-primary transition-colors"
            >
              <Mail className="h-6 w-6" />
            </Button>
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </Button>
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:text-primary transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </Button>
          </Link>
        </div>
        <div className="mt-12">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-8 py-6 text-lg font-semibold">
            View Resume
          </Button>
        </div>
      </div>
    </section>
  );
}
