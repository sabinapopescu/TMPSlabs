export class Config {
    currency;
    locale;
    delivery;
    static instance = null;
    constructor(currency = "EUR", locale = "ro", delivery = "courier") {
        this.currency = currency;
        this.locale = locale;
        this.delivery = delivery;
    }
    static getInstance() {
        if (!Config.instance)
            Config.instance = new Config();
        return Config.instance;
    }
    getCurrency() { return this.currency; }
    setCurrency(c) { this.currency = c; }
    getLocale() { return this.locale; }
    setLocale(l) { this.locale = l; }
    getDelivery() { return this.delivery; }
    setDelivery(d) { this.delivery = d; }
}
