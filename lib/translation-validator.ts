import { Translations } from './language-context';

type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Validates that all translation files have the same structure
 * and that all required keys are present in all languages
 */
export async function validateTranslations(): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Load all translation files
    const [enTranslations, faTranslations, arTranslations] = await Promise.all([
      import('@/locales/en.json'),
      import('@/locales/fa.json'),
      import('@/locales/ar.json'),
    ]);

    // Use English as the reference for structure
    const referenceKeys = getAllKeys(enTranslations.default);

    // Check each language against the reference
    const languages = [
      { code: 'fa', translations: faTranslations.default },
      { code: 'ar', translations: arTranslations.default },
    ];

    for (const { code, translations } of languages) {
      const languageKeys = getAllKeys(translations);

      // Find missing keys
      const missingKeys = referenceKeys.filter(
        (key) => !languageKeys.includes(key)
      );
      if (missingKeys.length > 0) {
        result.isValid = false;
        result.errors.push(
          `Missing keys in ${code}: ${missingKeys.join(', ')}`
        );
      }

      // Find extra keys (warnings)
      const extraKeys = languageKeys.filter(
        (key) => !referenceKeys.includes(key)
      );
      if (extraKeys.length > 0) {
        result.warnings.push(`Extra keys in ${code}: ${extraKeys.join(', ')}`);
      }
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to validate translations: ${error}`);
  }

  return result;
}

/**
 * Recursively gets all translation keys in dot notation
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  return Object.entries(obj).reduce((keys: string[], [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return [...keys, ...getAllKeys(value, newKey)];
    }

    return [...keys, newKey];
  }, []);
}

/**
 * Checks if a translation key exists in all languages
 */
export function checkTranslationKey(key: string): boolean {
  try {
    // This is a simplified check that just verifies the key exists in the English translations
    // In a real implementation, you would check all languages
    const enTranslations = require('@/locales/en.json');

    const keys = key.split('.');
    let value: any = enTranslations;

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === 'string';
  } catch (error) {
    return false;
  }
}

/**
 * Logs missing translation keys during development
 */
export function logMissingTranslations(key: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Missing translation key: ${key}`);
  }
}
