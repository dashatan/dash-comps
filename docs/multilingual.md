# Multilingual Support

This project implements a comprehensive multilingual system supporting English, Persian (Farsi), and Arabic languages, with proper RTL support for Persian and Arabic.

## Features

- **Language Switching**: Users can switch between languages using the language toggle in the header
- **RTL Support**: Automatic direction switching for RTL languages (Persian and Arabic)
- **Translation Management**: Structured JSON files for each language
- **Performance Optimizations**: Translation caching and preloading
- **SEO Optimization**: Language-specific meta tags and hreflang support
- **Development Tools**: Translation validator and debugger

## How to Use

### In Components

```tsx
import { useLanguage } from '@/lib/language-context';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('home.hero.title', { name: 'John Doe' })}</h1>
      <p>{t('home.hero.subtitle')}</p>
    </div>
  );
}
```

### Adding New Translations

1. Add new translation keys to the `Translations` interface in `lib/language-context.tsx`
2. Add the corresponding translations to each language file in the `locales` directory
3. Run the translation validator to ensure all languages have the required keys

### Translation Files Structure

Translation files are organized in a hierarchical structure:

```json
{
  "common": {
    "home": "Home",
    "projects": "Projects"
  },
  "home": {
    "hero": {
      "title": "Hi, I am {{name}}",
      "subtitle": "Welcome to my portfolio"
    }
  }
}
```

### Parameter Interpolation

You can use parameters in your translations:

```tsx
// In your translation file
"welcome": "Hello, {{name}}! Welcome to {{site}}"

// In your component
t('welcome', { name: 'John', site: 'My Portfolio' })
// Result: "Hello, John! Welcome to My Portfolio"
```

## Development Tools

### Translation Debugger

The Translation Debugger is available in development mode. It provides:

- Current language display
- Translation validation
- Example translations
- Missing key detection

### Translation Validator

Run the translation validator to check for missing or extra keys:

```bash
# This will be integrated into the build process
npm run validate-translations
```

## SEO Considerations

The multilingual setup includes:

- Language-specific meta tags
- Proper hreflang tags for search engines
- Language-specific sitemaps
- Canonical URLs

## Generating Sitemaps

To generate the sitemap with language support:

```bash
npm run generate-sitemap
```

This will create a `sitemap.xml` file in the `public` directory with proper language alternates.

## Best Practices

1. **Always use the translation function**: Never hardcode text that should be translated
2. **Use semantic keys**: Organize translation keys by feature/page
3. **Validate translations**: Run the validator before deploying
4. **Consider text length**: Some languages may have longer text than others
5. **Test RTL layouts**: Ensure your UI works well in both LTR and RTL modes
6. **Use parameters**: For dynamic content, use parameters instead of string concatenation
