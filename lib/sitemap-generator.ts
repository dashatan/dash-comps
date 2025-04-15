import { Language } from './language-context';
import fs from 'fs';
import path from 'path';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
  alternateRefs?: {
    href: string;
    hreflang: string;
  }[];
}

/**
 * Generates a sitemap.xml file with support for multiple languages
 */
export async function generateSitemap(
  baseUrl: string,
  routes: string[],
  languages: Language[] = ['en', 'fa', 'ar']
): Promise<void> {
  const sitemapUrls: SitemapURL[] = [];

  // Generate URLs for each route and language
  for (const route of routes) {
    // Default language (English) URL
    const defaultUrl: SitemapURL = {
      loc: `${baseUrl}${route}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: route === '/' ? 1.0 : 0.8,
      alternateRefs: [],
    };

    // Add alternate language URLs
    for (const lang of languages) {
      if (lang === 'en') continue; // Skip English as it's the default

      defaultUrl.alternateRefs?.push({
        href: `${baseUrl}/${lang}${route}`,
        hreflang: lang,
      });
    }

    sitemapUrls.push(defaultUrl);

    // Add language-specific URLs
    for (const lang of languages) {
      if (lang === 'en') continue; // Skip English as it's already added

      const langUrl: SitemapURL = {
        loc: `${baseUrl}/${lang}${route}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: route === '/' ? 0.9 : 0.7,
        alternateRefs: [
          {
            href: `${baseUrl}${route}`,
            hreflang: 'en',
          },
        ],
      };

      // Add other language alternates
      for (const otherLang of languages) {
        if (otherLang === lang || otherLang === 'en') continue;

        langUrl.alternateRefs?.push({
          href: `${baseUrl}/${otherLang}${route}`,
          hreflang: otherLang,
        });
      }

      sitemapUrls.push(langUrl);
    }
  }

  // Generate sitemap XML
  const sitemapXml = generateSitemapXml(sitemapUrls);

  // Write to public directory
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
}

/**
 * Generates XML from sitemap URLs
 */
function generateSitemapXml(urls: SitemapURL[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetHeader =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  const urlsetFooter = '</urlset>';

  const urlElements = urls
    .map((url) => {
      let urlXml = `  <url>\n`;
      urlXml += `    <loc>${url.loc}</loc>\n`;

      if (url.lastmod) {
        urlXml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }

      if (url.changefreq) {
        urlXml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }

      if (url.priority !== undefined) {
        urlXml += `    <priority>${url.priority}</priority>\n`;
      }

      if (url.alternateRefs && url.alternateRefs.length > 0) {
        url.alternateRefs.forEach((alt) => {
          urlXml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />\n`;
        });
      }

      urlXml += `  </url>`;
      return urlXml;
    })
    .join('\n');

  return `${xmlHeader}${urlsetHeader}${urlElements}\n${urlsetFooter}`;
}
