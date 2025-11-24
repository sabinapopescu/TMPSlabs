import { IDeliveryStrategy, DeliveryDetails } from "./IDeliveryStrategy.js";

/**
 * DeliveryContext - Context class that uses a strategy
 * Allows switching between different delivery strategies at runtime
 */
export class DeliveryContext {
  private strategy: IDeliveryStrategy;

  constructor(strategy: IDeliveryStrategy) {
    this.strategy = strategy;
  }

  /**
   * Change the delivery strategy at runtime
   */
  setStrategy(strategy: IDeliveryStrategy): void {
    console.log(`\n🔄 Switching delivery strategy to: ${strategy.getName()}`);
    this.strategy = strategy;
  }

  /**
   * Get current strategy
   */
  getStrategy(): IDeliveryStrategy {
    return this.strategy;
  }

  /**
   * Execute the strategy to calculate delivery cost
   */
  calculateDeliveryCost(distance: number, orderValue: number): number {
    console.log(`\n💰 Calculating cost using ${this.strategy.getName()}`);
    console.log(`   Distance: ${distance}km, Order Value: $${orderValue}`);
    
    try {
      const cost = this.strategy.calculateCost(distance, orderValue);
      console.log(`   Delivery Cost: $${cost}`);
      return cost;
    } catch (error) {
      console.error(`   Error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get full delivery details
   */
  getDeliveryDetails(distance: number, orderValue: number): DeliveryDetails {
    console.log(`\n📋 Getting delivery details using ${this.strategy.getName()}`);
    
    try {
      const details = this.strategy.getDeliveryDetails(distance, orderValue);
      console.log(`   Cost: $${details.cost}`);
      console.log(`   Time: ${details.estimatedTime}`);
      console.log(`   Tracking: ${details.trackingAvailable ? 'Yes' : 'No'}`);
      return details;
    } catch (error) {
      console.error(`   Error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Compare multiple strategies
   */
  static compareStrategies(
    strategies: IDeliveryStrategy[], 
    distance: number, 
    orderValue: number
  ): void {
    console.log(`\n📊 Comparing Delivery Strategies:`);
    console.log(`   Distance: ${distance}km, Order Value: $${orderValue}\n`);

    strategies.forEach(strategy => {
      try {
        const details = strategy.getDeliveryDetails(distance, orderValue);
        console.log(`${strategy.getName()}:`);
        console.log(`   Cost: $${details.cost}`);
        console.log(`   Time: ${details.estimatedTime}`);
        console.log(`   ${details.description}\n`);
      } catch (error) {
        console.log(`${strategy.getName()}:`);
        console.log(`   ❌ ${(error as Error).message}\n`);
      }
    });
  }
}