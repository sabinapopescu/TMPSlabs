// PaymentFactory.ts
import { Payment, CardPayment, CryptoPayment, BankTransferPayment } from "./Payment.js";

export type PaymentKind =
  | { type: "card"; masked: string }
  | { type: "crypto"; network: "BTC" | "ETH" | "TRX"; address: string }
  | { type: "bank"; iban: string };

export abstract class PaymentCreator {
  abstract create(kind: PaymentKind): Payment; // Factory Method
  checkout(amount: number, kind: PaymentKind): string { return this.create(kind).pay(amount); }
}

export class SimplePaymentCreator extends PaymentCreator {
  create(kind: PaymentKind): Payment {
    switch (kind.type) {
      case "card":   return new CardPayment(kind.masked);
      case "crypto": return new CryptoPayment(kind.network, kind.address);
      case "bank":   return new BankTransferPayment(kind.iban);
    }
  }
}
