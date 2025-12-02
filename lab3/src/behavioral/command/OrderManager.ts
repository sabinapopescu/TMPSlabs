// lab3/src/behavioral/command/OrderManager.ts

import { Bouquet } from "../../models/Bouquet.js";
import { OrderSubject, OrderData, OrderState } from "../observer/OrderSubject.js";

/**
 * OrderManager - Receiver in Command Pattern
 * 
 * BEHAVIORAL PATTERN: Command
 * Purpose: Performs the actual operations requested by commands
 * 
 * This is the receiver that knows how to carry out the operations.
 */

export interface StoredOrder {
  orderId: string;
  bouquet: Bouquet;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: OrderState;
  orderSubject?: OrderSubject;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderManager {
  private orders: Map<string, StoredOrder> = new Map();
  private orderCounter: number = 1;

  /**
   * Place a new order
   */
  placeOrder(
    bouquet: Bouquet,
    customerName: string,
    customerEmail: string
  ): StoredOrder {
    const orderId = `ORD-${this.orderCounter.toString().padStart(6, "0")}`;
    this.orderCounter++;

    const orderData: OrderData = {
      orderId,
      bouquetName: bouquet.name,
      customerName,
      totalPrice: bouquet.estimate(),
      status: "confirmed",
      timestamp: new Date()
    };

    const orderSubject = new OrderSubject(orderData);

    const order: StoredOrder = {
      orderId,
      bouquet: bouquet.clone(),
      customerName,
      customerEmail,
      totalPrice: bouquet.estimate(),
      status: "confirmed",
      orderSubject,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.set(orderId, order);
    console.log(`✓ Order ${orderId} placed successfully`);
    
    return order;
  }

  /**
   * Cancel an existing order
   */
  cancelOrder(orderId: string): StoredOrder {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === "delivered") {
      throw new Error(`Cannot cancel delivered order ${orderId}`);
    }

    if (order.status === "cancelled") {
      throw new Error(`Order ${orderId} is already cancelled`);
    }

    order.status = "cancelled";
    order.updatedAt = new Date();
    
    if (order.orderSubject) {
      order.orderSubject.updateStatus("cancelled");
    }

    console.log(`✓ Order ${orderId} cancelled successfully`);
    
    return order;
  }

  /**
   * Restore a cancelled order
   */
  restoreOrder(orderId: string, previousStatus: OrderState): StoredOrder {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status !== "cancelled") {
      throw new Error(`Order ${orderId} is not cancelled`);
    }

    order.status = previousStatus;
    order.updatedAt = new Date();
    
    if (order.orderSubject) {
      order.orderSubject.updateStatus(previousStatus);
    }

    console.log(`✓ Order ${orderId} restored to ${previousStatus}`);
    
    return order;
  }

  /**
   * Modify order status
   */
  modifyOrderStatus(orderId: string, newStatus: OrderState): StoredOrder {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === "cancelled") {
      throw new Error(`Cannot modify cancelled order ${orderId}`);
    }

    if (order.status === "delivered") {
      throw new Error(`Cannot modify delivered order ${orderId}`);
    }

    const oldStatus = order.status;
    order.status = newStatus;
    order.updatedAt = new Date();
    
    if (order.orderSubject) {
      order.orderSubject.updateStatus(newStatus);
    }

    console.log(`✓ Order ${orderId} status changed: ${oldStatus} → ${newStatus}`);
    
    return order;
  }

  /**
   * Remove an order from the system
   */
  removeOrder(orderId: string): StoredOrder {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    this.orders.delete(orderId);
    console.log(`✓ Order ${orderId} removed from system`);
    
    return order;
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): StoredOrder | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Get all orders
   */
  getAllOrders(): StoredOrder[] {
    return Array.from(this.orders.values());
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: OrderState): StoredOrder[] {
    return this.getAllOrders().filter(order => order.status === status);
  }

  /**
   * Get orders by customer
   */
  getOrdersByCustomer(customerEmail: string): StoredOrder[] {
    return this.getAllOrders().filter(
      order => order.customerEmail.toLowerCase() === customerEmail.toLowerCase()
    );
  }

  /**
   * Get total revenue
   */
  getTotalRevenue(): number {
    return this.getAllOrders()
      .filter(order => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.totalPrice, 0);
  }

  /**
   * Get order count
   */
  getOrderCount(): number {
    return this.orders.size;
  }

  /**
   * Clear all orders (for testing)
   */
  clearAllOrders(): void {
    this.orders.clear();
    this.orderCounter = 1;
    console.log("✓ All orders cleared");
  }
}