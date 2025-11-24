import { INotification, NotificationMessage, NotificationResult } from "./INotification.js";
import { EmailNotificationAdapter } from "./EmailNotificationAdapter.js";
import { SMSNotificationAdapter } from "./SMSNotificationAdapter.js";
import { PushNotificationAdapter } from "./PushNotificationAdapter.js";

/**
 * NotificationManager
 * 
 * STRUCTURAL PATTERN: Adapter (Client)
 * Purpose: Demonstrates how different notification services can be used
 *          interchangeably through the common INotification interface
 * 
 * This manager can work with any notification service that implements
 * INotification, regardless of the underlying implementation.
 */
export class NotificationManager {
  private services: Map<string, INotification>;

  constructor() {
    this.services = new Map();
    this.initializeServices();
  }

  /**
   * Initialize all available notification services
   */
  private initializeServices(): void {
    this.services.set("email", new EmailNotificationAdapter());
    this.services.set("sms", new SMSNotificationAdapter());
    this.services.set("push", new PushNotificationAdapter());
  }

  /**
   * Send notification through a specific service
   */
  sendNotification(serviceType: string, notification: NotificationMessage): NotificationResult {
    const service = this.services.get(serviceType);

    if (!service) {
      return {
        success: false,
        messageId: "",
        timestamp: new Date(),
        service: "unknown",
        error: `Service '${serviceType}' not found`
      };
    }

    // Validate recipient before sending
    if (!service.validate(notification.recipient)) {
      return {
        success: false,
        messageId: "",
        timestamp: new Date(),
        service: service.getServiceName(),
        error: `Invalid recipient format for ${service.getServiceName()}`
      };
    }

    return service.send(notification);
  }

  /**
   * Send notification through all available services (broadcast)
   */
  broadcast(notification: NotificationMessage): NotificationResult[] {
    const results: NotificationResult[] = [];

    for (const [_serviceType, service] of this.services) {
      // Only send if recipient is valid for this service
      if (service.validate(notification.recipient)) {
        results.push(service.send(notification));
      }
    }

    return results;
  }

  /**
   * Send order confirmation notification
   */
  sendOrderConfirmation(
    recipient: string,
    orderId: string,
    bouquetName: string,
    totalPrice: string,
    serviceType: "email" | "sms" | "push" = "email"
  ): NotificationResult {
    const notification: NotificationMessage = {
      recipient,
      subject: `Order Confirmation - ${orderId}`,
      message: `Your order for "${bouquetName}" has been confirmed!\n\nOrder ID: ${orderId}\nTotal: ${totalPrice}\n\nThank you for choosing Bloomify! 🌸`,
      priority: "normal"
    };

    return this.sendNotification(serviceType, notification);
  }

  /**
   * Send delivery notification
   */
  sendDeliveryNotification(
    recipient: string,
    orderId: string,
    estimatedTime: string,
    serviceType: "email" | "sms" | "push" = "sms"
  ): NotificationResult {
    const notification: NotificationMessage = {
      recipient,
      subject: `Delivery Update - ${orderId}`,
      message: `Your bouquet is on its way! 🚚\n\nOrder ID: ${orderId}\nEstimated delivery: ${estimatedTime}\n\nTrack your order at: bloomify.com/track/${orderId}`,
      priority: "high"
    };

    return this.sendNotification(serviceType, notification);
  }

  /**
   * Get available service types
   */
  getAvailableServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Add a custom notification service
   */
  addService(name: string, service: INotification): void {
    this.services.set(name, service);
  }
}