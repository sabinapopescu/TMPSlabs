import { IBouquetComponent } from "./IBouquetComponent.js";
import { Bouquet } from "../models/Bouquet.js";

/**
 * BouquetComponent - Concrete Component
 * 
 * STRUCTURAL PATTERN: Decorator
 * Purpose: This wraps the base Bouquet class to implement IBouquetComponent
 * 
 * This is the base component that can be decorated with additional features.
 */
export class BouquetComponent implements IBouquetComponent {
  constructor(private bouquet: Bouquet) {}

  /**
   * Get the bouquet description
   */
  getDescription(): string {
    return this.bouquet.getDescription();
  }

  /**
   * Get the base cost of the bouquet
   */
  getCost(): number {
    return this.bouquet.estimate();
  }

  /**
   * Get detailed information about the bouquet
   */
  getDetails(): string[] {
    const details: string[] = [];
    details.push(`Name: ${this.bouquet.name}`);
    details.push(`Total Flowers: ${this.bouquet.getTotalFlowers()}`);
    details.push(`Types: ${this.bouquet.getUniqueFlowerTypes().join(", ")}`);
    details.push(`Wrapping: ${this.bouquet.wrapping.kind} (${this.bouquet.wrapping.color})`);
    details.push(`Ribbon: ${this.bouquet.ribbon.material} (${this.bouquet.ribbon.color})`);
    
    if (this.bouquet.cardMessage) {
      details.push(`Card Message: "${this.bouquet.cardMessage}"`);
    }
    
    return details;
  }

  /**
   * Get the underlying bouquet
   */
  getBouquet(): Bouquet {
    return this.bouquet;
  }
}