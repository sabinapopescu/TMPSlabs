/**
 * PushNotificationAPI - External Push Service (Adaptee)
 * 
 * STRUCTURAL PATTERN: Adapter
 * Purpose: This is an existing push notification service with its own interface
 *          that doesn't match our INotification interface
 * 
 * Simulates a mobile push notification API.
 */

export interface PushData {
    deviceToken: string;
    title: string;
    content: string;
    badge?: number;
    sound?: string;
  }
  
  export interface PushAPIResponse {
    status: "success" | "failed";
    notificationId: string;
    timestamp: number;
    error?: string;
  }
  
  export class PushNotificationAPI {
    private _apiKey: string;
  
    constructor(apiKey: string = "DEMO-PUSH-KEY") {
      this._apiKey = apiKey;
      void this._apiKey; // Stored for future authentication use
    }
  
    /**
     * Push notification to device - different method signature
     */
    pushToDevice(data: PushData): PushAPIResponse {
      console.log(`[PushNotificationAPI] Pushing to device: ${data.deviceToken}`);
      console.log(`[PushNotificationAPI] Title: ${data.title}`);
      console.log(`[PushNotificationAPI] Content: ${data.content}`);
  
      // Validate device token
      if (!this.isValidDeviceToken(data.deviceToken)) {
        return {
          status: "failed",
          notificationId: "",
          timestamp: Date.now(),
          error: "Invalid device token"
        };
      }
  
      // Simulate successful push
      return {
        status: "success",
        notificationId: `PUSH-${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
        timestamp: Date.now(),
      };
    }
  
    /**
     * Validate device token format
     */
    private isValidDeviceToken(token: string): boolean {
      // Device tokens are typically 64+ character hex strings
      return token.length >= 32 && /^[a-fA-F0-9]+$/.test(token);
    }
  
    /**
     * Get API health status
     */
    healthCheck(): string {
      return "Push API Online";
    }
  }