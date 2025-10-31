import { Bouquet } from "../models/Bouquet.js";
import { Flower } from "../models/Flower.js";

export class BouquetBuilder {
  private name = "Custom Bouquet";
  private items: { flower: Flower; qty: number }[] = [];
  private wrapping: { kind: "paper" | "satin" | "transparent"; color: string } = { kind: "paper", color: "white" };
  private ribbon: { material: "silk" | "satin"; color: string } = { material: "silk", color: "red" };
  private cardMessage = "";

  setName(n: string): this { this.name = n; return this; }

  addFlower(kind: string, color: string, unitPrice: number, qty: number): this {
    this.items.push({ flower: new Flower(kind, color, unitPrice), qty });
    return this;
  }

  addWrapping(kind: "paper" | "satin" | "transparent", color: string): this {
    this.wrapping = { kind, color };
    return this;
  }

  addRibbon(material: "silk" | "satin", color: string): this {
    this.ribbon = { material, color };
    return this;
  }

  addCard(message: string): this { this.cardMessage = message; return this; }

  build(): Bouquet {
    if (this.items.length === 0) throw new Error("Bouquet must contain at least one flower.");
    return new Bouquet(this.name, this.items, this.wrapping, this.ribbon, this.cardMessage);
  }

  reset(): this {
    this.name = "Custom Bouquet";
    this.items = [];
    this.wrapping = { kind: "paper", color: "white" };
    this.ribbon = { material: "silk", color: "red" };
    this.cardMessage = "";
    return this;
  }
}
