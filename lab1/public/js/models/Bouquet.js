import { Flower } from "./Flower.js";
import { Config } from "../domain/Config.js";
/**
 * Bouquet Model
 * Represents a complete flower bouquet with all its components
 */
export class Bouquet {
    constructor(name, items, wrapping, ribbon, cardMessage) {
        this.name = name;
        this.items = items;
        this.wrapping = wrapping;
        this.ribbon = ribbon;
        this.cardMessage = cardMessage;
        this.validate();
    }
    /**
     * Validate bouquet data
     */
    validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error("Bouquet name cannot be empty");
        }
        if (!this.items || this.items.length === 0) {
            throw new Error("Bouquet must contain at least one flower");
        }
        for (const item of this.items) {
            if (!item.flower) {
                throw new Error("Invalid flower in bouquet");
            }
            if (item.qty <= 0) {
                throw new Error("Flower quantity must be greater than 0");
            }
        }
        if (!this.wrapping || !this.wrapping.kind || !this.wrapping.color) {
            throw new Error("Invalid wrapping configuration");
        }
        if (!this.ribbon || !this.ribbon.material || !this.ribbon.color) {
            throw new Error("Invalid ribbon configuration");
        }
    }
    /**
     * Calculate the base price of flowers
     */
    getFlowersCost() {
        return this.items.reduce((sum, item) => {
            return sum + item.flower.unitPrice * item.qty;
        }, 0);
    }
    /**
     * Calculate wrapping cost based on material
     */
    getWrappingCost() {
        switch (this.wrapping.kind) {
            case "satin":
                return 4.0;
            case "transparent":
                return 2.0;
            case "paper":
            default:
                return 1.5;
        }
    }
    /**
     * Calculate ribbon cost based on material
     */
    getRibbonCost() {
        switch (this.ribbon.material) {
            case "silk":
                return 3.0;
            case "satin":
            default:
                return 2.0;
        }
    }
    /**
     * Calculate the total estimated price (in EUR)
     */
    estimate() {
        const flowersCost = this.getFlowersCost();
        const wrappingCost = this.getWrappingCost();
        const ribbonCost = this.getRibbonCost();
        return flowersCost + wrappingCost + ribbonCost;
    }
    /**
     * Get a formatted price label with currency
     */
    priceLabel() {
        const cfg = Config.getInstance();
        const basePrice = this.estimate();
        return cfg.formatPrice(basePrice);
    }
    /**
     * Get a detailed price breakdown
     */
    getPriceBreakdown() {
        const cfg = Config.getInstance();
        const flowers = this.getFlowersCost();
        const wrapping = this.getWrappingCost();
        const ribbon = this.getRibbonCost();
        const total = flowers + wrapping + ribbon;
        return {
            flowers: flowers * cfg.getExchangeRate(),
            wrapping: wrapping * cfg.getExchangeRate(),
            ribbon: ribbon * cfg.getExchangeRate(),
            total: total * cfg.getExchangeRate(),
            currency: cfg.getCurrency()
        };
    }
    /**
     * Clone the bouquet (Prototype pattern support)
     */
    clone() {
        return new Bouquet(this.name, this.items.map(item => ({
            flower: new Flower(item.flower.kind, item.flower.color, item.flower.unitPrice),
            qty: item.qty
        })), { ...this.wrapping }, { ...this.ribbon }, this.cardMessage);
    }
    /**
     * Get total number of flowers in the bouquet
     */
    getTotalFlowers() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }
    /**
     * Get unique flower types
     */
    getUniqueFlowerTypes() {
        return [...new Set(this.items.map(item => item.flower.kind))];
    }
    /**
     * Get a brief description of the bouquet
     */
    getDescription() {
        const totalFlowers = this.getTotalFlowers();
        const types = this.getUniqueFlowerTypes();
        return `${this.name}: ${totalFlowers} flowers (${types.join(", ")})`;
    }
    /**
     * Convert to JSON-serializable object
     */
    toJSON() {
        return {
            name: this.name,
            items: this.items.map(item => ({
                flower: {
                    kind: item.flower.kind,
                    color: item.flower.color,
                    unitPrice: item.flower.unitPrice
                },
                qty: item.qty
            })),
            wrapping: this.wrapping,
            ribbon: this.ribbon,
            cardMessage: this.cardMessage,
            estimate: this.estimate()
        };
    }
    /**
     * Create a Bouquet from a JSON object
     */
    static fromJSON(data) {
        return new Bouquet(data.name, data.items.map((item) => ({
            flower: new Flower(item.flower.kind, item.flower.color, item.flower.unitPrice),
            qty: item.qty
        })), data.wrapping, data.ribbon, data.cardMessage);
    }
}
//# sourceMappingURL=Bouquet.js.map