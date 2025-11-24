import { BouquetDecorator } from "./BouquetDecorator.js";
import { IBouquetComponent } from "./IBouquetComponent.js";

/**
 * ExpressDeliveryDecorator - Concrete Decorator
 * 
 * STRUCTURAL PATTERN: Decorator
 * Purpose: Adds express delivery service to the bouquet order
 * 
 * Provides faster delivery options with guaranteed time windows.
 */
export class ExpressDeliveryDecorator extends BouquetDecorator {
  private deliverySpeed: "same-day" | "2-hour" | "next-day";
  private deliveryCost: number;

  constructor(component: IBouquetComponent, deliverySpeed: "same-day" | "2-hour" | "next-day" = "same-day") {
    super(component);
    this.deliverySpeed = deliverySpeed;
    
    // Set cost based on delivery speed
    switch (deliverySpeed) {
      case "2-hour":
        this.deliveryCost = 20.0;
        break;
      case "same-day":
        this.deliveryCost = 12.0;
        break;
      case "next-day":
      default:
        this.deliveryCost = 7.0;
        break;
    }
  }

  /**
   * Override to add express delivery to description
   */
  getDescription(): string {
    return `${super.getDescription()} with ${this.deliverySpeed} delivery`;
  }

  /**
   * Override to add delivery cost to total
   */
  getCost(): number {
    return super.getCost() + this.deliveryCost;
  }

  /**
   * Override to add delivery details
   */
  getDetails(): string[] {
    const details = super.getDetails();
    details.push(`🚚 Express Delivery: ${this.deliverySpeed} (+€${this.deliveryCost.toFixed(2)})`);
    return details;
  }

  /**
   * Get delivery speed
   */
  getDeliverySpeed(): string {
    return this.deliverySpeed;
  }
}