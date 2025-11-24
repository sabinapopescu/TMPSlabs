import { IObserver } from "./IObserver.js";
import { ISubject } from "./ISubject.js";
import { OrderSubject, OrderData } from "./OrderSubject.js";
import { NotificationManager } from "../../adapters/index.js";

/**
 * CustomerObserver - Concrete Observer
 * Sends notifications to customer when order status changes
 */
export class CustomerObserver implements IObserver {
  private notificationManager: NotificationManager;

  constructor() {
    this.notificationManager = new NotificationManager();
  }

  getName(): string {
    return "CustomerObserver";
  }

  update(subject: ISubject): void {
    const orderData = (subject as OrderSubject).getState() as OrderData;
    
    console.log(`📧 ${this.getName()}: Notifying customer about order ${orderData.orderId}`);
    
    const message = this.generateCustomerMessage(orderData);
    
    // Send notifications through existing adapter system
    this.notificationManager.sendNotification("email", {
        recipient: "customer@example.com",
        subject: `Order ${orderData.orderId} - ${orderData.status}`,
        message: message,
        priority: "normal"
      });
      
      this.notificationManager.sendNotification("sms", {
        recipient: "+1234567890",
        subject: `Order ${orderData.orderId}`,
        message: message,
        priority: "normal"
      });
    // Display in UI
    this.showNotificationInUI(orderData);
  }

  private generateCustomerMessage(orderData: OrderData): string {
    const messages: Record<OrderData['status'], string> = {
      pending: `Your order for "${orderData.bouquetName}" has been received and is pending confirmation.`,
      confirmed: `Great news! Your order for "${orderData.bouquetName}" has been confirmed. Total: $${orderData.totalPrice.toFixed(2)}`,
      preparing: `We're preparing your beautiful "${orderData.bouquetName}" bouquet with care! 💐`,
      ready: `Your "${orderData.bouquetName}" is ready for delivery!`,
      out_for_delivery: `Your bouquet is on its way! Expected delivery soon.`,
      delivered: `Your "${orderData.bouquetName}" has been delivered! Enjoy! 🌸`,
      cancelled: `Your order for "${orderData.bouquetName}" has been cancelled. Refund initiated.`
    };

    return messages[orderData.status] || `Order status updated to: ${orderData.status}`;
  }

  private showNotificationInUI(orderData: OrderData): void {
    // Integration with your existing toast system
    const toast = document.getElementById('toast');
    if (toast) {
      const message = this.generateCustomerMessage(orderData);
      toast.textContent = message;
      toast.className = 'toast success show';
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    }
  }
}