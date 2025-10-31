export type Currency = "EUR" | "USD";
export type Locale = "ro" | "en";
export type Delivery = "pickup" | "courier";

export class Config {
  private static instance: Config | null = null;

  private constructor(
    private currency: Currency = "EUR",
    private locale: Locale = "ro",
    private delivery: Delivery = "courier"
  ) {}

  static getInstance(): Config {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }

  getCurrency(): Currency { return this.currency; }
  setCurrency(c: Currency): void { this.currency = c; }

  getLocale(): Locale { return this.locale; }
  setLocale(l: Locale): void { this.locale = l; }

  getDelivery(): Delivery { return this.delivery; }
  setDelivery(d: Delivery): void { this.delivery = d; }
}
