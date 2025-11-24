import { Bouquet } from "../models/Bouquet.js";
import { Flower } from "../models/Flower.js";

/**
 * Builder Pattern Implementation
 * Constructs complex Bouquet objects step by step
 */
export class BouquetBuilder {
  private name: string = "Custom Bouquet";
  private items: { flower: Flower; qty: number }[] = [];
  private wrapping: { kind: "paper" | "satin" | "transparent"; color: string } = {
    kind: "paper",
    color: "white"
  };
  private ribbon: { material: "silk" | "satin"; color: string } = {
    material: "silk",
    color: "red"
  };
  private cardMessage: string = "";

  /**
   * Set the bouquet name
   */
  setName(n: string): this {
    if (!n || n.trim().length === 0) {
      throw new Error("Bouquet name cannot be empty");
    }
    if (n.length > 50) {
      throw new Error("Bouquet name is too long (max 50 characters)");
    }
    this.name = n.trim();
    return this;
  }

  /**
   * Add a flower line to the bouquet
   */
  addFlower(kind: string, color: string, unitPrice: number, qty: number): this {
    // Validation
    if (!kind || kind.trim().length === 0) {
      throw new Error("Flower kind cannot be empty");
    }
    if (!color || color.trim().length === 0) {
      throw new Error("Flower color cannot be empty");
    }
    if (unitPrice <= 0) {
      throw new Error("Unit price must be greater than 0");
    }
    if (qty <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    if (!Number.isInteger(qty)) {
      throw new Error("Quantity must be a whole number");
    }

    this.items.push({
      flower: new Flower(kind.trim(), color.trim(), unitPrice),
      qty
    });
    return this;
  }

  /**
   * Set the wrapping style and color
   */
  addWrapping(kind: "paper" | "satin" | "transparent", color: string): this {
    if (!color || color.trim().length === 0) {
      throw new Error("Wrapping color cannot be empty");
    }
    this.wrapping = { kind, color: color.trim() };
    return this;
  }

  /**
   * Set the ribbon material and color
   */
  addRibbon(material: "silk" | "satin", color: string): this {
    if (!color || color.trim().length === 0) {
      throw new Error("Ribbon color cannot be empty");
    }
    this.ribbon = { material, color: color.trim() };
    return this;
  }

  /**
   * Add a card message
   */
  addCard(message: string): this {
    if (message && message.length > 100) {
      throw new Error("Card message is too long (max 100 characters)");
    }
    this.cardMessage = message.trim();
    return this;
  }

  /**
   * Build the final Bouquet object
   */
  build(): Bouquet {
    if (this.items.length === 0) {
      throw new Error("Bouquet must contain at least one flower");
    }

    return new Bouquet(
      this.name,
      this.items,
      this.wrapping,
      this.ribbon,
      this.cardMessage
    );
  }

  /**
   * Reset the builder to initial state
   */
  reset(): this {
    this.name = "Custom Bouquet";
    this.items = [];
    this.wrapping = { kind: "paper", color: "white" };
    this.ribbon = { material: "silk", color: "red" };
    this.cardMessage = "";
    return this;
  }

  /**
   * Get the current number of flower lines
   */
  getItemCount(): number {
    return this.items.length;
  }

  /**
   * Get the total number of flowers (sum of all quantities)
   */
  getTotalFlowers(): number {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }
}
