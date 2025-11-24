/**
 * INotification Interface - Target Interface
 * 
 * STRUCTURAL PATTERN: Adapter
 * Purpose: Common interface that all notification adapters must implement
 * 
 * This is the interface that the client code expects to work with.
 * Different notification services will be adapted to this interface.
 */

export interface NotificationMessage {
    recipient: string;
    subject: string;
    message: string;
    priority?: "low" | "normal" | "high";
  }
  
  export interface NotificationResult {
    success: boolean;
    messageId: string;
    timestamp: Date;
    service: string;
    error?: string;
  }
  
  export interface INotification {
    /**
     * Send a notification to a recipient
     */
    send(notification: NotificationMessage): NotificationResult;
  
    /**
     * Validate if the recipient address/number is valid for this service
     */
    validate(recipient: string): boolean;
  
    /**
     * Get the service name
     */
    getServiceName(): string;
  }