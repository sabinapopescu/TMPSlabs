import { BouquetDecorator } from "./BouquetDecorator.js";
import { IBouquetComponent } from "./IBouquetComponent.js";

/**
 * PremiumVaseDecorator - Concrete Decorator
 * 
 * STRUCTURAL PATTERN: Decorator
 * Purpose: Adds a premium vase to the bouquet
 * 
 * Enhances the bouquet with a decorative vase, adding value and functionality.
 */
export class PremiumVaseDecorator extends BouquetDecorator {
  private vaseType: "ceramic" | "crystal" | "glass";
  private vaseCost: number;

  constructor(component: IBouquetComponent, vaseType: "ceramic" | "crystal" | "glass" = "glass") {
    super(component);
    this.vaseType = vaseType;
    
    // Set cost based on vase type
    switch (vaseType) {
      case "crystal":
        this.vaseCost = 25.0;
        break;
      case "ceramic":
        this.vaseCost = 18.0;
        break;
      case "glass":
      default:
        this.vaseCost = 12.0;
        break;
    }
  }

  /**
   * Override to add vase to description
   */
  getDescription(): string {
    return `${super.getDescription()} in ${this.vaseType} vase`;
  }

  /**
   * Override to add vase cost to total
   */
  getCost(): number {
    return super.getCost() + this.vaseCost;
  }

  /**
   * Override to add vase details
   */
  getDetails(): string[] {
    const details = super.getDetails();
    details.push(`🏺 Vase: ${this.vaseType} (+€${this.vaseCost.toFixed(2)})`);
    return details;
  }

  /**
   * Get vase type
   */
  getVaseType(): string {
    return this.vaseType;
  }
}