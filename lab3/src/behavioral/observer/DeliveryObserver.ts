import { IObserver } from "./IObserver.js";
import { ISubject } from "./ISubject.js";
import { OrderSubject, OrderData } from "./OrderSubject.js";

/**
 * DeliveryObserver - Concrete Observer
 * Manages delivery scheduling when order is ready
 */
export class DeliveryObserver implements IObserver {
  private deliveryQueue: string[] = [];

  getName(): string {
    return "DeliveryObserver";
  }

  update(subject: ISubject): void {
    const orderData = (subject as OrderSubject).getState() as OrderData;
    
    console.log(`🚚 ${this.getName()}: Processing delivery for order ${orderData.orderId}`);

    switch (orderData.status) {
      case 'ready':
        this.scheduleDelivery(orderData);
        break;
      case 'out_for_delivery':
        this.trackDelivery(orderData);
        break;
      case 'delivered':
        this.completeDelivery(orderData);
        break;
      case 'cancelled':
        this.cancelDelivery(orderData);
        break;
    }
  }

  private scheduleDelivery(orderData: OrderData): void {
    this.deliveryQueue.push(orderData.orderId);
    console.log(`  ↳ Delivery scheduled for order ${orderData.orderId}`);
    console.log(`  ↳ Position in queue: ${this.deliveryQueue.length}`);
  }

  private trackDelivery(orderData: OrderData): void {
    console.log(`  ↳ Tracking delivery for order ${orderData.orderId}`);
    console.log(`  ↳ Estimated delivery: 30-45 minutes`);
  }

  private completeDelivery(orderData: OrderData): void {
    const index = this.deliveryQueue.indexOf(orderData.orderId);
    if (index > -1) {
      this.deliveryQueue.splice(index, 1);
    }
    console.log(`  ↳ Delivery completed for order ${orderData.orderId}`);
    console.log(`  ↳ Removed from delivery queue`);
  }

  private cancelDelivery(orderData: OrderData): void {
    const index = this.deliveryQueue.indexOf(orderData.orderId);
    if (index > -1) {
      this.deliveryQueue.splice(index, 1);
      console.log(`  ↳ Delivery cancelled for order ${orderData.orderId}`);
    }
  }

  getDeliveryQueue(): string[] {
    return [...this.deliveryQueue];
  }
}