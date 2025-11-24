import { CardPayment, CryptoPayment, BankTransferPayment } from "./Payment.js";
/**
 * Factory Method Pattern Implementation
 * Abstract creator class that defines the factory method
 */
export class PaymentCreator {
    /**
     * Template method that uses the factory method
     */
    checkout(amount, kind) {
        if (amount <= 0) {
            throw new Error("Checkout amount must be greater than 0");
        }
        try {
            const payment = this.create(kind);
            return payment.pay(amount);
        }
        catch (error) {
            throw new Error(`Checkout failed: ${error.message}`);
        }
    }
    /**
     * Validate payment details before processing
     */
    validatePayment(kind) {
        try {
            const payment = this.create(kind);
            return payment.validate();
        }
        catch {
            return false;
        }
    }
    /**
     * Get payment description
     */
    getPaymentDescription(kind) {
        try {
            const payment = this.create(kind);
            return payment.getDescription();
        }
        catch (error) {
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
    create(kind) {
        switch (kind.type) {
            case "card":
                return new CardPayment(kind.masked);
            case "crypto":
                return new CryptoPayment(kind.network, kind.address);
            case "bank":
                return new BankTransferPayment(kind.iban);
            default:
                // TypeScript exhaustiveness check
                const _exhaustive = kind;
                throw new Error(`Unknown payment type: ${_exhaustive.type}`);
        }
    }
    /**
     * Get all supported payment types
     */
    getSupportedPaymentTypes() {
        return ["card", "crypto", "bank"];
    }
    /**
     * Check if a payment type is supported
     */
    isPaymentTypeSupported(type) {
        return this.getSupportedPaymentTypes().includes(type);
    }
}
/**
 * Enhanced Payment Creator with additional features
 */
export class EnhancedPaymentCreator extends PaymentCreator {
    constructor() {
        super(...arguments);
        this.transactionLog = [];
    }
    create(kind) {
        // Reuse SimplePaymentCreator's logic
        const simple = new SimplePaymentCreator();
        return simple.create(kind);
    }
    /**
     * Override checkout to add logging
     */
    checkout(amount, kind) {
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
    getTransactionHistory() {
        return [...this.transactionLog];
    }
    /**
     * Get total transaction amount
     */
    getTotalTransactions() {
        return this.transactionLog.reduce((sum, tx) => sum + tx.amount, 0);
    }
    /**
     * Clear transaction history
     */
    clearHistory() {
        this.transactionLog = [];
    }
}
//# sourceMappingURL=PaymentFactory.js.map