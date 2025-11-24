import { IDeliveryStrategy, DeliveryDetails } from "./IDeliveryStrategy.js";

/**
 * StandardDeliveryStrategy - Concrete Strategy
 * Standard delivery (3-5 business days)
 */
export class StandardDeliveryStrategy implements IDeliveryStrategy {
  private readonly baseCost = 5.00;
  private readonly costPerKm = 0.50;

  getName(): string {
    return "Standard Delivery";
  }

  calculateCost(distance: number, orderValue: number): number {
    let cost = this.baseCost + (distance * this.costPerKm);
    
    // Free delivery for orders over $50
    if (orderValue >= 50) {
      cost = 0;
    }
    
    return Math.round(cost * 100) / 100;
  }

  getEstimatedTime(distance: number): string {
    if (distance < 5) return "2-3 business days";
    if (distance < 20) return "3-4 business days";
    return "4-5 business days";
  }

  getDeliveryDetails(distance: number, orderValue: number): DeliveryDetails {
    return {
      cost: this.calculateCost(distance, orderValue),
      estimatedTime: this.getEstimatedTime(distance),
      description: "Standard delivery with tracking. Free for orders over $50.",
      trackingAvailable: true
    };
  }
}