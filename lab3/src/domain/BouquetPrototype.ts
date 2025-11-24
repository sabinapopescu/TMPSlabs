import { Bouquet } from "../models/Bouquet.js";
import { Flower } from "../models/Flower.js";

/**
 * Prototype Pattern Implementation
 * Allows cloning of pre-configured bouquet templates
 */
export class BouquetTemplate {
  constructor(public readonly base: Bouquet) {
    if (!base) {
      throw new Error("Base bouquet cannot be null or undefined");
    }
  }

  /**
   * Clone the template bouquet (Prototype pattern)
   * @param nameOverride Optional new name for the cloned bouquet
   */
  clone(nameOverride?: string): Bouquet {
    const cloned = this.base.clone();
    
    if (nameOverride) {
      if (nameOverride.trim().length === 0) {
        throw new Error("Name override cannot be empty");
      }
      cloned.name = nameOverride.trim();
    }
    
    return cloned;
  }

  /**
   * Get the estimated price of the template
   */
  getEstimate(): number {
    return this.base.estimate();
  }

  /**
   * Get a preview description of the template
   */
  getDescription(): string {
    const flowerCount = this.base.items.reduce((sum, item) => sum + item.qty, 0);
    const flowerTypes = this.base.items
      .map(item => `${item.qty} ${item.flower.color} ${item.flower.kind}`)
      .join(", ");
    
    return `${this.base.name}: ${flowerCount} flowers (${flowerTypes})`;
  }

  /**
   * Pre-defined bouquet templates
   */
  static presets(): Record<string, BouquetTemplate> {
    return {
      valentine: new BouquetTemplate(
        new Bouquet(
          "Valentine Special",
          [{ flower: new Flower("Rose", "Red", 3.5), qty: 15 }],
          { kind: "satin", color: "Pink" },
          { material: "silk", color: "Red" },
          "For my love ❤️"
        )
      ),
      
      spring: new BouquetTemplate(
        new Bouquet(
          "Spring Dream",
          [
            { flower: new Flower("Tulip", "Yellow", 2.0), qty: 7 },
            { flower: new Flower("Lily", "White", 2.8), qty: 5 }
          ],
          { kind: "paper", color: "Mint" },
          { material: "satin", color: "Olive" },
          "Fresh beginnings 🌿"
        )
      ),
      
      pastel: new BouquetTemplate(
        new Bouquet(
          "Pastel Joy",
          [{ flower: new Flower("Orchid", "Pink", 4.2), qty: 6 }],
          { kind: "transparent", color: "Clear" },
          { material: "satin", color: "Blush" },
          "Soft and serene"
        )
      )
    };
  }

  /**
   * Create a custom template from a bouquet
   */
  static fromBouquet(bouquet: Bouquet): BouquetTemplate {
    return new BouquetTemplate(bouquet);
  }

  /**
   * Get all available template names
   */
  static getTemplateNames(): string[] {
    return Object.keys(BouquetTemplate.presets());
  }

  /**
   * Get a template by name
   */
  static getTemplate(name: string): BouquetTemplate | null {
    const templates = BouquetTemplate.presets();
    return templates[name] || null;
  }
}
