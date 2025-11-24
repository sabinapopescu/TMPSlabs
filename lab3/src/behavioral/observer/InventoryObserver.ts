import { IObserver } from "./IObserver.js";
import { ISubject } from "./ISubject.js";
import { OrderSubject, OrderData } from "./OrderSubject.js";

/**
 * InventoryObserver - Concrete Observer
 * Updates inventory when order status changes
 */
export class InventoryObserver implements IObserver {
  private inventory: Map<string, number> = new Map();

  constructor() {
    // Initialize with some sample inventory
    this.inventory.set("Rose", 100);
    this.inventory.set("Tulip", 80);
    this.inventory.set("Lily", 60);
    this.inventory.set("Orchid", 40);
  }

  getName(): string {
    return "InventoryObserver";
  }

  update(subject: ISubject): void {
    const orderData = (subject as OrderSubject).getState() as OrderData;
    
    console.log(`📦 ${this.getName()}: Processing inventory for order ${orderData.orderId}`);

    switch (orderData.status) {
      case 'confirmed':
        this.reserveStock(orderData);
        break;
      case 'cancelled':
        this.releaseStock(orderData);
        break;
      case 'delivered':
        this.confirmStockUsed(orderData);
        break;
    }
  }

  private reserveStock(orderData: OrderData): void {
    console.log(`  ↳ Reserving stock for "${orderData.bouquetName}"`);
    // In a real system, you'd parse the bouquet and update individual flower counts
    // For demo purposes:
    console.log(`  ↳ Stock reserved successfully`);
  }

  private releaseStock(orderData: OrderData): void {
    console.log(`  ↳ Releasing reserved stock for "${orderData.bouquetName}"`);
    console.log(`  ↳ Stock released back to inventory`);
  }

  private confirmStockUsed(orderData: OrderData): void {
    console.log(`  ↳ Confirming stock usage for "${orderData.bouquetName}"`);
    console.log(`  ↳ Inventory updated`);
  }

  getInventoryStatus(): Map<string, number> {
    return new Map(this.inventory);
  }
}