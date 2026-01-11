import translations from './translations.json';

/**
 * Simple i18n helper class for translating static UI strings
 *
 * Usage:
 * ```js
 * import { i18n } from '$lib/i18n/i18n.svelte.js';
 *
 * const t = i18n('en'); // or get from context
 * console.log(t('settings')); // "Settings"
 * ```
 */
export class I18n {
  /**
   * @param {string} lang Language code (default: 'nl')
   */
  constructor(lang = 'nl') {
    this.lang = lang;
  }

  /**
   * Translate a key to the current language
   * @param {string} key Translation key
   * @returns {string} Translated string, or key if not found
   */
  t(key) {
    const translation = translations[this.lang]?.[key];
    if (translation) {
      return translation;
    }

    // Fallback to Dutch if translation not found
    const fallback = translations['nl']?.[key];
    if (fallback) {
      return fallback;
    }

    // Return key if no translation found
    return key;
  }

  /**
   * Change the current language
   * @param {string} lang Language code
   */
  setLang(lang) {
    this.lang = lang;
  }

  /**
   * Get the current language
   * @returns {string} Current language code
   */
  getLang() {
    return this.lang;
  }
}

/**
 * Create an i18n instance
 * @param {string} lang Language code (default: 'nl')
 * @returns {I18n} I18n instance
 */
export function i18n(lang = 'nl') {
  return new I18n(lang);
}

/**
 * Get available languages
 * @returns {string[]} Array of language codes
 */
export function getAvailableLanguages() {
  return Object.keys(translations);
}
