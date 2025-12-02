// lab3/src/behavioral/command/CancelOrderCommand.ts

import { ICommand } from "./ICommand.js";
import { OrderManager } from "./OrderManager.js";
import { OrderState } from "../observer/OrderSubject.js";

/**
 * CancelOrderCommand - Concrete Command
 * 
 * BEHAVIORAL PATTERN: Command
 * Purpose: Encapsulates the request to cancel an order
 * 
 * This command cancels an existing order and supports undo by restoring it.
 */
export class CancelOrderCommand implements ICommand {
  private timestamp: Date;
  private previousStatus: OrderState | null = null;
  private wasExecuted: boolean = false;

  constructor(
    private receiver: OrderManager,
    private orderId: string
  ) {
    this.timestamp = new Date();
  }

  /**
   * Execute the command - cancel the order
   */
  execute(): string {
    try {
      // Store previous status for undo
      const order = this.receiver.getOrder(this.orderId);
      if (!order) {
        return `Failed to cancel: Order ${this.orderId} not found`;
      }

      this.previousStatus = order.status;
      
      this.receiver.cancelOrder(this.orderId);
      this.wasExecuted = true;

      return `Order ${this.orderId} cancelled successfully`;
    } catch (error: any) {
      return `Failed to cancel order: ${error.message}`;
    }
  }

  /**
   * Undo the command - restore the cancelled order
   */
  undo(): string {
    if (!this.wasExecuted || !this.previousStatus) {
      return "Cannot undo: Order was not successfully cancelled";
    }

    try {
      this.receiver.restoreOrder(this.orderId, this.previousStatus);
      return `Order ${this.orderId} restored to ${this.previousStatus} status (undo)`;
    } catch (error: any) {
      return `Failed to undo cancellation: ${error.message}`;
    }
  }

  /**
   * Get command description
   */
  getDescription(): string {
    return `Cancel Order: ${this.orderId}`;
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
    return this.wasExecuted && this.previousStatus !== null;
  }

  /**
   * Get the order ID
   */
  getOrderId(): string {
    return this.orderId;
  }
}