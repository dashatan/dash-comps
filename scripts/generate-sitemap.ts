import { generateSitemap } from '@/lib/sitemap-generator';

async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  // Define your routes
  const routes = ['/', '/projects', '/components', '/contact'];

  try {
    await generateSitemap(baseUrl, routes);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    process.exit(1);
  }
}

main();
