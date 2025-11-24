import { IDeliveryStrategy, DeliveryDetails } from "./IDeliveryStrategy.js";

/**
 * PickupStrategy - Concrete Strategy
 * Store pickup (no delivery)
 */
export class PickupStrategy implements IDeliveryStrategy {
  getName(): string {
    return "Store Pickup";
  }

  calculateCost(_distance: number, _orderValue: number): number {
    return 0; // Free pickup
  }
  
  getEstimatedTime(_distance: number): string {
    return "Ready in 2 hours";
  }
  
  getDeliveryDetails(distance: number, _orderValue: number): DeliveryDetails {
    return {
      cost: 0,
      estimatedTime: this.getEstimatedTime(distance),
      description: "Pick up your order at our store. Free and ready in 2 hours.",
      trackingAvailable: false
    };
  }
}