import { Bouquet } from "../models/Bouquet.js";
import { BouquetBuilder } from "../domain/BouquetBuilder.js";
import { SimplePaymentCreator } from "../factory/PaymentFactory.js";
import { Config } from "../domain/Config.js";
import { BouquetComponent } from "../decorators/BouquetComponent.js";
import { GiftBoxDecorator } from "../decorators/GiftBoxDecorator.js";
import { PremiumVaseDecorator } from "../decorators/PremiumVaseDecorator.js";
import { CareInstructionsDecorator } from "../decorators/CareInstructionsDecorator.js";
import { ExpressDeliveryDecorator } from "../decorators/ExpressDeliveryDecorator.js";
import { IBouquetComponent } from "../decorators/IBouquetComponent.js";

/**
 * Order Options for simplified ordering
 */
export interface OrderOptions {
  // Basic bouquet details
  bouquetName: string;
  flowers: { kind: string; color: string; price: number; qty: number }[];
  wrapping?: { kind: "paper" | "satin" | "transparent"; color: string };
  ribbon?: { material: "silk" | "satin"; color: string };
  cardMessage?: string;

  // Enhancements (decorators)
  giftBox?: "standard" | "premium" | "luxury" | null;
  vase?: "ceramic" | "crystal" | "glass" | null;
  careInstructions?: "basic" | "detailed" | null;
  expressDelivery?: "same-day" | "2-hour" | "next-day" | null;

  // Payment
  paymentType: "card" | "crypto" | "bank";
  paymentDetails?: any;
}

/**
 * Order Result
 */
export interface OrderResult {
  success: boolean;
  orderId: string;
  bouquet: Bouquet;
  enhancedComponent?: IBouquetComponent;
  totalCost: number;
  formattedPrice: string;
  paymentReceipt: string;
  details: string[];
  message: string;
}

/**
 * BloomifyOrderFacade - Facade Pattern
 * 
 * STRUCTURAL PATTERN: Facade
 * Purpose: Provides a simplified, unified interface to the complex subsystems
 *          involved in creating and processing a bouquet order
 * 
 * This facade hides the complexity of:
 * - Builder pattern for bouquet construction
 * - Decorator pattern for enhancements
 * - Factory pattern for payment processing
 * - Singleton pattern for configuration
 * 
 * Instead, it provides a single simple method: placeOrder()
 */
export class BloomifyOrderFacade {
  private builder: BouquetBuilder;
  private paymentFactory: SimplePaymentCreator;
  private config: Config;
  private orderCounter: number = 1000;

  constructor() {
    this.builder = new BouquetBuilder();
    this.paymentFactory = new SimplePaymentCreator();
    this.config = Config.getInstance();
  }

  /**
   * Place a complete order with a single method call
   * 
   * This method orchestrates all the complex operations:
   * 1. Builds the bouquet using Builder pattern
   * 2. Applies decorators for enhancements
   * 3. Processes payment using Factory pattern
   * 4. Returns a complete order result
   */
  placeOrder(options: OrderOptions): OrderResult {
    try {
      // Step 1: Build the base bouquet
      const bouquet = this.buildBouquet(options);

      // Step 2: Apply enhancements using decorators
      const enhancedComponent = this.applyEnhancements(bouquet, options);

      // Step 3: Calculate final cost
      const totalCost = enhancedComponent.getCost();
      const formattedPrice = this.config.formatPrice(totalCost);

      // Step 4: Process payment
      const paymentReceipt = this.processPayment(totalCost, options);

      // Step 5: Generate order details
      const details = enhancedComponent.getDetails();

      // Step 6: Generate order ID
      const orderId = this.generateOrderId();

      return {
        success: true,
        orderId,
        bouquet,
        enhancedComponent,
        totalCost,
        formattedPrice,
        paymentReceipt,
        details,
        message: `Order ${orderId} placed successfully! ${enhancedComponent.getDescription()}`
      };

    } catch (error: any) {
      return {
        success: false,
        orderId: "",
        bouquet: null as any,
        totalCost: 0,
        formattedPrice: "€0.00",
        paymentReceipt: "",
        details: [],
        message: `Order failed: ${error.message}`
      };
    }
  }

  /**
   * Build bouquet using Builder pattern (internal complexity hidden)
   */
  private buildBouquet(options: OrderOptions): Bouquet {
    this.builder.reset();
    this.builder.setName(options.bouquetName);

    // Add flowers
    for (const flower of options.flowers) {
      this.builder.addFlower(flower.kind, flower.color, flower.price, flower.qty);
    }

    // Add wrapping
    const wrapping = options.wrapping || { kind: "paper" as const, color: "White" };
    this.builder.addWrapping(wrapping.kind, wrapping.color);

    // Add ribbon
    const ribbon = options.ribbon || { material: "satin" as const, color: "Red" };
    this.builder.addRibbon(ribbon.material, ribbon.color);

    // Add card
    this.builder.addCard(options.cardMessage || "");

    return this.builder.build();
  }

  /**
   * Apply enhancements using Decorator pattern (internal complexity hidden)
   */
  private applyEnhancements(bouquet: Bouquet, options: OrderOptions): IBouquetComponent {
    // Start with base component
    let component: IBouquetComponent = new BouquetComponent(bouquet);

    // Apply decorators based on options
    if (options.giftBox) {
      component = new GiftBoxDecorator(component, options.giftBox);
    }

    if (options.vase) {
      component = new PremiumVaseDecorator(component, options.vase);
    }

    if (options.careInstructions) {
      component = new CareInstructionsDecorator(component, options.careInstructions);
    }

    if (options.expressDelivery) {
      component = new ExpressDeliveryDecorator(component, options.expressDelivery);
    }

    return component;
  }

  /**
   * Process payment using Factory pattern (internal complexity hidden)
   */
  private processPayment(amount: number, options: OrderOptions): string {
    return this.paymentFactory.checkout(amount, {
      type: options.paymentType,
      ...options.paymentDetails
    });
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const id = `BLM-${this.orderCounter.toString().padStart(6, "0")}`;
    this.orderCounter++;
    return id;
  }

  /**
   * Quick order method for common scenarios
   */
  quickOrder(
    name: string,
    flowers: { kind: string; color: string; price: number; qty: number }[],
    paymentType: "card" | "crypto" | "bank" = "card"
  ): OrderResult {
    return this.placeOrder({
      bouquetName: name,
      flowers,
      paymentType,
      cardMessage: "Thank you!"
    });
  }

  /**
   * Premium order with all enhancements
   */
  premiumOrder(
    name: string,
    flowers: { kind: string; color: string; price: number; qty: number }[],
    paymentType: "card" | "crypto" | "bank" = "card"
  ): OrderResult {
    return this.placeOrder({
      bouquetName: name,
      flowers,
      giftBox: "luxury",
      vase: "crystal",
      careInstructions: "detailed",
      expressDelivery: "2-hour",
      paymentType,
      cardMessage: "Premium arrangement with our finest care"
    });
  }
}