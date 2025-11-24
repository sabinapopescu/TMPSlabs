import { IDeliveryStrategy, DeliveryDetails } from "./IDeliveryStrategy.js";

/**
 * SameDayDeliveryStrategy - Concrete Strategy
 * Same-day delivery (order before 2 PM)
 */
export class SameDayDeliveryStrategy implements IDeliveryStrategy {
  private readonly baseCost = 20.00;
  private readonly costPerKm = 2.00;
  private readonly maxDistance = 15; // km

  getName(): string {
    return "Same-Day Delivery";
  }

  calculateCost(distance: number, _orderValue: number): number {
    if (distance > this.maxDistance) {
      throw new Error(`Same-day delivery not available for distances over ${this.maxDistance}km`);
    }

    let cost = this.baseCost + (distance * this.costPerKm);
    
    // Premium service - no discounts
    return Math.round(cost * 100) / 100;
  }

  getEstimatedTime(_distance: number): string {
    const currentHour = new Date().getHours();
    
    if (currentHour < 14) {
      return "Today by 8 PM";
    } else {
      return "Not available (order before 2 PM for same-day delivery)";
    }
  }

  getDeliveryDetails(distance: number, orderValue: number): DeliveryDetails {
    if (distance > this.maxDistance) {
      throw new Error(`Same-day delivery not available for distances over ${this.maxDistance}km`);
    }

    return {
      cost: this.calculateCost(distance, orderValue),
      estimatedTime: this.getEstimatedTime(distance),
      description: "Premium same-day delivery. Order before 2 PM for delivery by 8 PM. Available within 15km only.",
      trackingAvailable: true
    };
  }
}