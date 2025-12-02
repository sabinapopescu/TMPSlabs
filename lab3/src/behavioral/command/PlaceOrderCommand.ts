// lab3/src/behavioral/command/PlaceOrderCommand.ts

import { ICommand } from "./ICommand.js";
import { OrderManager, StoredOrder } from "./OrderManager.js";
import { Bouquet } from "../../models/Bouquet.js";

/**
 * PlaceOrderCommand - Concrete Command
 * 
 * BEHAVIORAL PATTERN: Command
 * Purpose: Encapsulates the request to place an order
 * 
 * This command creates a new order and supports undo by canceling it.
 */
export class PlaceOrderCommand implements ICommand {
  private timestamp: Date;
  private executedOrder: StoredOrder | null = null;

  constructor(
    private receiver: OrderManager,
    private bouquet: Bouquet,
    private customerName: string,
    private customerEmail: string
  ) {
    this.timestamp = new Date();
  }

  /**
   * Execute the command - place the order
   */
  execute(): string {
    try {
      this.executedOrder = this.receiver.placeOrder(
        this.bouquet,
        this.customerName,
        this.customerEmail
      );

      return `Order ${this.executedOrder.orderId} placed successfully! ` +
             `Bouquet: ${this.bouquet.name}, Total: €${this.executedOrder.totalPrice.toFixed(2)}`;
    } catch (error: any) {
      return `Failed to place order: ${error.message}`;
    }
  }

  /**
   * Undo the command - cancel the placed order
   */
  undo(): string {
    if (!this.executedOrder) {
      return "Cannot undo: Order was not successfully placed";
    }

    try {
      this.receiver.cancelOrder(this.executedOrder.orderId);
      return `Order ${this.executedOrder.orderId} cancelled (undo)`;
    } catch (error: any) {
      return `Failed to undo order: ${error.message}`;
    }
  }

  /**
   * Get command description
   */
  getDescription(): string {
    return `Place Order: ${this.bouquet.name} for ${this.customerName}`;
  }

  /**
   * Get command timestamp
   */
  getTimestamp(): Date {
    return this.timestamp;
  }

  /**
   * Check if command can be undone
   */
  canUndo(): boolean {
    return this.executedOrder !== null;
  }

  /**
   * Get the executed order (for reference)
   */
  getExecutedOrder(): StoredOrder | null {
    return this.executedOrder;
  }
}