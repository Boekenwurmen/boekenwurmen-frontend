import { PUBLIC_API_URL } from "$env/static/public";

/**
 * Simple i18n helper class for translating static UI strings
 * Fetches translations from backend API
 *
 * Usage:
 * ```js
 * import { I18n } from '$lib/i18n/i18n.svelte.js';
 *
 * const translator = new I18n('en');
 * await translator.load(); // Load translations
 * console.log(translator.t('settings')); // "Settings"
 * ```
 */
export class I18n {
  /**
   * @param {string} lang Language code (default: 'en')
   */
  constructor(lang = 'en') {
    this.lang = lang;
    /** @type {Record<string, string>} */
    this.translations = {};
    this.loaded = false;
  }

  /**
   * Load translations from backend API
   * @returns {Promise<void>}
   */
  async load() {
    if (this.loaded && I18n.cache[this.lang]) {
      this.translations = I18n.cache[this.lang];
      return;
    }

    try {
      const response = await fetch(`${PUBLIC_API_URL}/translation/ui/${this.lang}`);
      const data = await response.json();
      this.translations = data.data || {};
      I18n.cache[this.lang] = this.translations;
      this.loaded = true;
    } catch (error) {
      console.error(`Failed to load translations for ${this.lang}:`, error);
      // Fallback to English if loading fails
      if (this.lang !== 'en') {
        try {
          const response = await fetch(`${PUBLIC_API_URL}/translation/ui/en`);
          const data = await response.json();
          this.translations = data.data || {};
          this.loaded = true;
        } catch (fallbackError) {
          console.error('Failed to load fallback English translations:', fallbackError);
          this.loaded = true;
        }
      }
    }
  }

  /**
   * Translate a key to the current language
   * @param {string} key Translation key
   * @returns {string} Translated string, or key if not found
   */
  t(key) {
    return this.translations[key] || key;
  }

  /**
   * Change the current language and reload translations
   * @param {string} lang Language code
   * @returns {Promise<void>}
   */
  async setLang(lang) {
    this.lang = lang;
    this.loaded = false;
    await this.load();
  }

  /**
   * Get the current language
   * @returns {string} Current language code
   */
  getLang() {
    return this.lang;
  }
}

// Static cache shared across all instances
/** @type {Record<string, Record<string, string>>} */
I18n.cache = {};

/**
 * Create an i18n instance and load translations
 * @param {string} lang Language code (default: 'en')
 * @returns {Promise<I18n>} I18n instance
 */
export async function i18n(lang = 'en') {
  const instance = new I18n(lang);
  await instance.load();
  return instance;
}
