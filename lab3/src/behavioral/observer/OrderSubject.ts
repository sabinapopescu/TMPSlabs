import { ISubject } from "./ISubject.js";
import { IObserver } from "./IObserver.js";

export type OrderState = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "ready" 
  | "out_for_delivery" 
  | "delivered"
  | "cancelled";

export interface OrderData {
  orderId: string;
  bouquetName: string;
  customerName: string;
  totalPrice: number;
  status: OrderState;
  timestamp: Date;
}

/**
 * OrderSubject - Concrete Subject
 * Manages order state and notifies observers when state changes
 */
export class OrderSubject implements ISubject {
  private observers: IObserver[] = [];
  private orderData: OrderData;

  constructor(orderData: OrderData) {
    this.orderData = orderData;
  }

  /**
   * Attach an observer to this subject
   */
  attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      console.log(`Observer ${observer.getName()} is already attached.`);
      return;
    }

    console.log(`✓ Attached observer: ${observer.getName()}`);
    this.observers.push(observer);
  }

  /**
   * Detach an observer from this subject
   */
  detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log(`Observer ${observer.getName()} not found.`);
      return;
    }

    this.observers.splice(observerIndex, 1);
    console.log(`✓ Detached observer: ${observer.getName()}`);
  }

  /**
   * Notify all observers about state change
   */
  notify(): void {
    console.log(`\n📢 Notifying ${this.observers.length} observers...`);
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Get current order state
   */
  getState(): OrderData {
    return this.orderData;
  }

  /**
   * Update order status and notify observers
   */
  updateStatus(newStatus: OrderState): void {
    console.log(`\n🔄 Order ${this.orderData.orderId}: ${this.orderData.status} → ${newStatus}`);
    this.orderData.status = newStatus;
    this.orderData.timestamp = new Date();
    this.notify();
  }

  /**
   * Update entire order data
   */
  updateOrderData(data: Partial<OrderData>): void {
    this.orderData = { ...this.orderData, ...data, timestamp: new Date() };
    this.notify();
  }
}