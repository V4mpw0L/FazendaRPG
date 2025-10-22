/**
 * FazendaRPG - Internationalization System
 * Handles multi-language support (pt-BR, en-US)
 * @version 0.0.8
 */

class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem("fazenda_language") || "pt-BR";
    this.translations = {};
    this.fallbackLanguage = "pt-BR";
    this.loadedLanguages = new Set();
  }

  /**
   * Load translation file for a specific language
   * @param {string} lang - Language code (e.g., 'pt-BR', 'en-US')
   * @returns {Promise<boolean>}
   */
  async loadLanguage(lang) {
    if (this.loadedLanguages.has(lang)) {
      return true;
    }

    try {
      const response = await fetch(`./data/translations/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load language: ${lang}`);
      }

      const data = await response.json();
      this.translations[lang] = data;
      this.loadedLanguages.add(lang);
      console.log(`✅ Language loaded: ${lang}`);
      return true;
    } catch (error) {
      console.error(`❌ Error loading language ${lang}:`, error);
      return false;
    }
  }

  /**
   * Set the current language
   * @param {string} lang - Language code
   * @returns {Promise<boolean>}
   */
  async setLanguage(lang) {
    const loaded = await this.loadLanguage(lang);
    if (loaded) {
      this.currentLanguage = lang;
      localStorage.setItem("fazenda_language", lang);
      this.updatePageLanguage();
      console.log(`🌍 Language changed to: ${lang}`);
      return true;
    }
    return false;
  }

  /**
   * Get current language
   * @returns {string}
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key (e.g., 'menu.farm', 'welcome.title')
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string}
   */
  t(key, params = {}) {
    const keys = key.split(".");
    let value = this.translations[this.currentLanguage];

    // Try to get value from current language
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }

    // Fallback to default language
    if (value === null || value === undefined) {
      value = this.translations[this.fallbackLanguage];
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          value = key; // Return key if not found
          break;
        }
      }
    }

    // Interpolate parameters
    if (typeof value === "string" && Object.keys(params).length > 0) {
      return this.interpolate(value, params);
    }

    return value || key;
  }

  /**
   * Interpolate parameters in a string
   * @param {string} str - String with {param} placeholders
   * @param {Object} params - Parameters to interpolate
   * @returns {string}
   */
  interpolate(str, params) {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Update all elements with data-i18n attribute
   */
  updatePageLanguage() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.t(key);

      // Update text content or placeholder
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        if (element.hasAttribute("placeholder")) {
          element.placeholder = translation;
        }
      } else {
        element.textContent = translation;
      }
    });

    // Update document title
    const titleKey = document.querySelector("title")?.getAttribute("data-i18n");
    if (titleKey) {
      document.title = this.t(titleKey);
    }

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;

    // Dispatch language change event
    window.dispatchEvent(
      new CustomEvent("languagechange", {
        detail: { language: this.currentLanguage },
      }),
    );
  }

  /**
   * Get available languages
   * @returns {Array<{code: string, name: string}>}
   */
  getAvailableLanguages() {
    return [
      { code: "pt-BR", name: "Português (BR)", flag: "🇧🇷" },
      { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    ];
  }

  /**
   * Initialize i18n system
   * @returns {Promise<void>}
   */
  async init() {
    // Load default language
    await this.loadLanguage(this.fallbackLanguage);

    // Load current language if different
    if (this.currentLanguage !== this.fallbackLanguage) {
      await this.loadLanguage(this.currentLanguage);
    }

    this.updatePageLanguage();
  }
}

// Create singleton instance
const i18n = new I18n();

export default i18n;
