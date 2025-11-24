/**
 * Strategy Pattern - Strategy Interface
 * Defines the interface for different delivery strategies
 */
export interface DeliveryDetails {
    cost: number;
    estimatedTime: string;
    description: string;
    trackingAvailable: boolean;
  }
  
  export interface IDeliveryStrategy {
    calculateCost(distance: number, orderValue: number): number;
    getEstimatedTime(distance: number): string;
    getDeliveryDetails(distance: number, orderValue: number): DeliveryDetails;
    getName(): string;
  }