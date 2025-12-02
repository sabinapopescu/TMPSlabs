// lab3/src/behavioral/command/ModifyOrderCommand.ts

import { ICommand } from "./ICommand.js";
import { OrderManager } from "./OrderManager.js";
import { OrderState } from "../observer/OrderSubject.js";

/**
 * ModifyOrderCommand - Concrete Command
 * 
 * BEHAVIORAL PATTERN: Command
 * Purpose: Encapsulates the request to modify an order's status
 * 
 * This command changes an order's status and supports undo by reverting it.
 */
export class ModifyOrderCommand implements ICommand {
  private timestamp: Date;
  private previousStatus: OrderState | null = null;
  private wasExecuted: boolean = false;

  constructor(
    private receiver: OrderManager,
    private orderId: string,
    private newStatus: OrderState
  ) {
    this.timestamp = new Date();
  }

  /**
   * Execute the command - modify the order status
   */
  execute(): string {
    try {
      // Store previous status for undo
      const order = this.receiver.getOrder(this.orderId);
      if (!order) {
        return `Failed to modify: Order ${this.orderId} not found`;
      }

      this.previousStatus = order.status;
      
      this.receiver.modifyOrderStatus(this.orderId, this.newStatus);
      this.wasExecuted = true;

      return `Order ${this.orderId} status updated to ${this.newStatus}`;
    } catch (error: any) {
      return `Failed to modify order: ${error.message}`;
    }
  }

  /**
   * Undo the command - revert to previous status
   */
  undo(): string {
    if (!this.wasExecuted || !this.previousStatus) {
      return "Cannot undo: Order was not successfully modified";
    }

    try {
      this.receiver.modifyOrderStatus(this.orderId, this.previousStatus);
      return `Order ${this.orderId} reverted to ${this.previousStatus} status (undo)`;
    } catch (error: any) {
      return `Failed to undo modification: ${error.message}`;
    }
  }

  /**
   * Get command description
   */
  getDescription(): string {
    return `Modify Order: ${this.orderId} → ${this.newStatus}`;
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

  /**
   * Get the new status
   */
  getNewStatus(): OrderState {
    return this.newStatus;
  }
}