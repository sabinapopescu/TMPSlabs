import { Payment, CardPayment, CryptoPayment, BankTransferPayment } from "./Payment.js";

/**
 * Payment type discriminators
 */
export type PaymentKind =
  | { type: "card"; masked: string }
  | { type: "crypto"; network: "BTC" | "ETH" | "TRX"; address: string }
  | { type: "bank"; iban: string };

/**
 * Factory Method Pattern Implementation
 * Abstract creator class that defines the factory method
 */
export abstract class PaymentCreator {
  /**
   * Factory Method - to be implemented by concrete creators
   */
  abstract create(kind: PaymentKind): Payment;

  /**
   * Template method that uses the factory method
   */
  checkout(amount: number, kind: PaymentKind): string {
    if (amount <= 0) {
      throw new Error("Checkout amount must be greater than 0");
    }

    try {
      const payment = this.create(kind);
      return payment.pay(amount);
    } catch (error: any) {
      throw new Error(`Checkout failed: ${error.message}`);
    }
  }

  /**
   * Validate payment details before processing
   */
  validatePayment(kind: PaymentKind): boolean {
    try {
      const payment = this.create(kind);
      return payment.validate();
    } catch {
      return false;
    }
  }

  /**
   * Get payment description
   */
  getPaymentDescription(kind: PaymentKind): string {
    try {
      const payment = this.create(kind);
      return payment.getDescription();
    } catch (error: any) {
      return `Invalid payment: ${error.message}`;
    }
  }
}

/**
 * Concrete Factory Implementation
 * Creates different types of payment objects
 */
export class SimplePaymentCreator extends PaymentCreator {
  /**
   * Factory Method implementation
   * Creates appropriate Payment object based on the type
   */
  create(kind: PaymentKind): Payment {
    switch (kind.type) {
      case "card":
        return new CardPayment(kind.masked);
      
      case "crypto":
        return new CryptoPayment(kind.network, kind.address);
      
      case "bank":
        return new BankTransferPayment(kind.iban);
      
      default:
        // TypeScript exhaustiveness check
        const _exhaustive: never = kind;
        throw new Error(`Unknown payment type: ${(_exhaustive as any).type}`);
    }
  }

  /**
   * Get all supported payment types
   */
  getSupportedPaymentTypes(): string[] {
    return ["card", "crypto", "bank"];
  }

  /**
   * Check if a payment type is supported
   */
  isPaymentTypeSupported(type: string): boolean {
    return this.getSupportedPaymentTypes().includes(type);
  }
}

/**
 * Enhanced Payment Creator with additional features
 */
export class EnhancedPaymentCreator extends PaymentCreator {
  private transactionLog: Array<{ timestamp: Date; amount: number; method: string }> = [];

  create(kind: PaymentKind): Payment {
    // Reuse SimplePaymentCreator's logic
    const simple = new SimplePaymentCreator();
    return simple.create(kind);
  }

  /**
   * Override checkout to add logging
   */
  checkout(amount: number, kind: PaymentKind): string {
    const result = super.checkout(amount, kind);
    
    // Log the transaction
    this.transactionLog.push({
      timestamp: new Date(),
      amount,
      method: kind.type
    });
    
    return result;
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(): Array<{ timestamp: Date; amount: number; method: string }> {
    return [...this.transactionLog];
  }

  /**
   * Get total transaction amount
   */
  getTotalTransactions(): number {
    return this.transactionLog.reduce((sum, tx) => sum + tx.amount, 0);
  }

  /**
   * Clear transaction history
   */
  clearHistory(): void {
    this.transactionLog = [];
  }
}
