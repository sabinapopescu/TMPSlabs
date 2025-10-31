import { Flower } from "./Flower.js";
import { Config } from "../domain/Config.js";

export class Bouquet {
  constructor(
    public name: string,
    public items: { flower: Flower; qty: number }[],
    public wrapping: { kind: "paper" | "satin" | "transparent"; color: string },
    public ribbon: { material: "silk" | "satin"; color: string },
    public cardMessage: string
  ) {}

  estimate(): number {
    const base = this.items.reduce((s, it) => s + it.flower.unitPrice * it.qty, 0);
    const wrap = this.wrapping.kind === "satin" ? 4 : this.wrapping.kind === "transparent" ? 2 : 1.5;
    const ribbon = this.ribbon.material === "silk" ? 3 : 2;
    return base + wrap + ribbon;
    // (delivery fee not included; UI is pickup/courier-agnostic)
  }

  priceLabel(): string {
    const cfg = Config.getInstance();
    const v = this.estimate();
    return cfg.getCurrency() === "EUR" ? `${v.toFixed(2)} €` : `${(v * 1.08).toFixed(2)} $`;
  }

  clone(): Bouquet {
    return new Bouquet(
      this.name,
      this.items.map(i => ({ flower: new Flower(i.flower.kind, i.flower.color, i.flower.unitPrice), qty: i.qty })),
      { ...this.wrapping },
      { ...this.ribbon },
      this.cardMessage
    );
  }
}
