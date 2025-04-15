import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/lib/language-context';
import { TranslationDebugger } from '@/components/translation-debugger';
import './globals.css';
import './fonts.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Daniel Ochi - Frontend Developer Portfolio',
  description:
    'Software engineering and web development portfolio showcasing projects and components',
  alternates: {
    languages: {
      en: '/en',
      fa: '/fa',
      ar: '/ar',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth overflow-x-hidden"
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="fa" href="/fa" />
        <link rel="alternate" hrefLang="ar" href="/ar" />
        <link rel="canonical" href="/" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sahel antialiased bg-background text-foreground w-full h-full`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <TranslationDebugger />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
