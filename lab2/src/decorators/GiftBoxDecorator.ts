import { BouquetDecorator } from "./BouquetDecorator.js";
import { IBouquetComponent } from "./IBouquetComponent.js";

/**
 * GiftBoxDecorator - Concrete Decorator
 * 
 * STRUCTURAL PATTERN: Decorator
 * Purpose: Adds a premium gift box to the bouquet
 * 
 * This decorator wraps a bouquet component and adds gift box functionality,
 * including additional cost and description details.
 */
export class GiftBoxDecorator extends BouquetDecorator {
  private boxType: "standard" | "premium" | "luxury";
  private boxCost: number;

  constructor(component: IBouquetComponent, boxType: "standard" | "premium" | "luxury" = "standard") {
    super(component);
    this.boxType = boxType;
    
    // Set cost based on box type
    switch (boxType) {
      case "luxury":
        this.boxCost = 15.0;
        break;
      case "premium":
        this.boxCost = 10.0;
        break;
      case "standard":
      default:
        this.boxCost = 5.0;
        break;
    }
  }

  /**
   * Override to add gift box to description
   */
  getDescription(): string {
    return `${super.getDescription()} with ${this.boxType} gift box`;
  }

  /**
   * Override to add box cost to total
   */
  getCost(): number {
    return super.getCost() + this.boxCost;
  }

  /**
   * Override to add gift box details
   */
  getDetails(): string[] {
    const details = super.getDetails();
    details.push(`🎁 Gift Box: ${this.boxType} (+€${this.boxCost.toFixed(2)})`);
    return details;
  }

  /**
   * Get box type
   */
  getBoxType(): string {
    return this.boxType;
  }
}