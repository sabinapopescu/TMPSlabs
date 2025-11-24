/**
 * Singleton Pattern Implementation
 * Ensures only one instance of configuration exists throughout the application
 */

export type Currency = "EUR" | "USD";
export type Locale = "ro" | "en";
export type Delivery = "pickup" | "courier";

export class Config {
  private static instance: Config | null = null;

  private currency: Currency = "EUR";
  private locale: Locale = "en";
  private delivery: Delivery = "courier";

  /**
   * Private constructor prevents direct instantiation
   */
  private constructor() {
    // Load from localStorage if available
    this.loadFromStorage();
  }

  /**
   * Get the single instance of Config (Singleton pattern)
   */
  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Get current currency
   */
  getCurrency(): Currency {
    return this.currency;
  }

  /**
   * Set currency and persist to storage
   */
  setCurrency(c: Currency): void {
    if (c !== "EUR" && c !== "USD") {
      throw new Error(`Invalid currency: ${c}. Must be EUR or USD`);
    }
    this.currency = c;
    this.saveToStorage();
  }

  /**
   * Get current locale
   */
  getLocale(): Locale {
    return this.locale;
  }

  /**
   * Set locale and persist to storage
   */
  setLocale(l: Locale): void {
    if (l !== "ro" && l !== "en") {
      throw new Error(`Invalid locale: ${l}. Must be ro or en`);
    }
    this.locale = l;
    this.saveToStorage();
  }

  /**
   * Get current delivery method
   */
  getDelivery(): Delivery {
    return this.delivery;
  }

  /**
   * Set delivery method and persist to storage
   */
  setDelivery(d: Delivery): void {
    if (d !== "pickup" && d !== "courier") {
      throw new Error(`Invalid delivery method: ${d}. Must be pickup or courier`);
    }
    this.delivery = d;
    this.saveToStorage();
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(): string {
    return this.currency === "EUR" ? "€" : "$";
  }

  /**
   * Get exchange rate from EUR to configured currency
   */
  getExchangeRate(): number {
    return this.currency === "EUR" ? 1.0 : 1.08;
  }

  /**
   * Format a price according to current settings
   */
  formatPrice(amount: number): string {
    const converted = amount * this.getExchangeRate();
    const symbol = this.getCurrencySymbol();
    
    if (this.currency === "EUR") {
      return `${converted.toFixed(2)} ${symbol}`;
    } else {
      return `${symbol}${converted.toFixed(2)}`;
    }
  }

  /**
   * Get all configuration as an object
   */
  getAll(): { currency: Currency; locale: Locale; delivery: Delivery } {
    return {
      currency: this.currency,
      locale: this.locale,
      delivery: this.delivery
    };
  }

  /**
   * Reset configuration to defaults
   */
  reset(): void {
    this.currency = "EUR";
    this.locale = "en";
    this.delivery = "courier";
    this.saveToStorage();
  }

  /**
   * Save configuration to localStorage
   */
  private saveToStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('bloomify_config', JSON.stringify({
          currency: this.currency,
          locale: this.locale,
          delivery: this.delivery
        }));
      }
    } catch (e) {
      console.warn('Failed to save config to localStorage:', e);
    }
  }

  /**
   * Load configuration from localStorage
   */
  private loadFromStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('bloomify_config');
        if (stored) {
          const config = JSON.parse(stored);
          if (config.currency) this.currency = config.currency;
          if (config.locale) this.locale = config.locale;
          if (config.delivery) this.delivery = config.delivery;
        }
      }
    } catch (e) {
      console.warn('Failed to load config from localStorage:', e);
    }
  }

}
