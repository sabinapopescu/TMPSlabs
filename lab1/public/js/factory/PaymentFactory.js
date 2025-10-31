// PaymentFactory.ts
import { CardPayment, CryptoPayment, BankTransferPayment } from "./Payment.js";
export class PaymentCreator {
    checkout(amount, kind) { return this.create(kind).pay(amount); }
}
export class SimplePaymentCreator extends PaymentCreator {
    create(kind) {
        switch (kind.type) {
            case "card": return new CardPayment(kind.masked);
            case "crypto": return new CryptoPayment(kind.network, kind.address);
            case "bank": return new BankTransferPayment(kind.iban);
        }
    }
}
