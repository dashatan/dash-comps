import React from 'react';
import Link from 'next/link';
import { GithubIcon, Mail, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

export function HeroSection(): React.ReactElement {
  const { t, isLoading } = useLanguage();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          {t('home.hero.title', { name: 'Daniel Ochi' })}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          {t('home.hero.subtitle')}
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <GithubIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </Link>
          <Link href="mailto:example@email.com" aria-label="Email">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </Link>
        </div>
        <div className="mt-8 md:mt-12">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold">
            View Resume
          </Button>
        </div>
      </div>
    </section>
  );
}
