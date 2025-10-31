import { Bouquet } from "../models/Bouquet.js";
import { Flower } from "../models/Flower.js";

export class BouquetTemplate {
  constructor(public readonly base: Bouquet) {}
  clone(nameOverride?: string): Bouquet {
    const cloned = this.base.clone();
    if (nameOverride) cloned.name = nameOverride;
    return cloned;
  }

  static presets(): Record<string, BouquetTemplate> {
    return {
      valentine: new BouquetTemplate(
        new Bouquet(
          "Valentine Special",
          [{ flower: new Flower("Rose", "Red", 3.5), qty: 15 }],
          { kind: "satin", color: "Pink" },
          { material: "silk", color: "Red" },
          "For my love ❤️"
        )
      ),
      spring: new BouquetTemplate(
        new Bouquet(
          "Spring Dream",
          [
            { flower: new Flower("Tulip", "Yellow", 2.0), qty: 7 },
            { flower: new Flower("Lily", "White", 2.8), qty: 5 }
          ],
          { kind: "paper", color: "Mint" },
          { material: "satin", color: "Olive" },
          "Fresh beginnings 🌿"
        )
      ),
      pastel: new BouquetTemplate(
        new Bouquet(
          "Pastel Joy",
          [{ flower: new Flower("Orchid", "Pink", 4.2), qty: 6 }],
          { kind: "transparent", color: "Clear" },
          { material: "satin", color: "Blush" },
          "Soft and serene"
        )
      )
    };
  }
}
