import { IDeliveryStrategy, DeliveryDetails } from "./IDeliveryStrategy.js";

/**
 * ExpressDeliveryStrategy - Concrete Strategy
 * Express delivery (1-2 business days)
 */
export class ExpressDeliveryStrategy implements IDeliveryStrategy {
  private readonly baseCost = 12.00;
  private readonly costPerKm = 1.00;

  getName(): string {
    return "Express Delivery";
  }

  calculateCost(distance: number, orderValue: number): number {
    let cost = this.baseCost + (distance * this.costPerKm);
    
    // 20% discount for orders over $100
    if (orderValue >= 100) {
      cost *= 0.8;
    }
    
    return Math.round(cost * 100) / 100;
  }

  getEstimatedTime(distance: number): string {
    if (distance < 10) return "Next business day";
    if (distance < 30) return "1-2 business days";
    return "2 business days";
  }

  getDeliveryDetails(distance: number, orderValue: number): DeliveryDetails {
    return {
      cost: this.calculateCost(distance, orderValue),
      estimatedTime: this.getEstimatedTime(distance),
      description: "Express delivery with priority handling and tracking. 20% off for orders over $100.",
      trackingAvailable: true
    };
  }
}