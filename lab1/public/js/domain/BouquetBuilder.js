import { Bouquet } from "../models/Bouquet.js";
import { Flower } from "../models/Flower.js";
export class BouquetBuilder {
    name = "Custom Bouquet";
    items = [];
    wrapping = { kind: "paper", color: "white" };
    ribbon = { material: "silk", color: "red" };
    cardMessage = "";
    setName(n) { this.name = n; return this; }
    addFlower(kind, color, unitPrice, qty) {
        this.items.push({ flower: new Flower(kind, color, unitPrice), qty });
        return this;
    }
    addWrapping(kind, color) {
        this.wrapping = { kind, color };
        return this;
    }
    addRibbon(material, color) {
        this.ribbon = { material, color };
        return this;
    }
    addCard(message) { this.cardMessage = message; return this; }
    build() {
        if (this.items.length === 0)
            throw new Error("Bouquet must contain at least one flower.");
        return new Bouquet(this.name, this.items, this.wrapping, this.ribbon, this.cardMessage);
    }
    reset() {
        this.name = "Custom Bouquet";
        this.items = [];
        this.wrapping = { kind: "paper", color: "white" };
        this.ribbon = { material: "silk", color: "red" };
        this.cardMessage = "";
        return this;
    }
}
