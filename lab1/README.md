# Bloomify – Creational Design Patterns (TMPS Lab)

## Author:Popescu Sabina
## Supervisor: Guzun Grigore
## Course: TMPS — Software Design Techniques
## Lab Nr.: 1 – Creational Design Patterns

# 1. Introduction

This laboratory work focuses on understanding and applying Creational Design Patterns in a real, object-oriented system.
The chosen project — Bloomify — simulates a small bouquet-creation platform where users can configure flowers, sizes, wrapping, add-ons, and user preferences.

The goal is to analyze the creation mechanisms required by the system and implement at least three creational design patterns inside a clean, well-structured project.

# 2. Objectives

- Understand the fundamental creational design patterns
- Choose a domain and define the main models/entities
- Implement at least 3 creational patterns
- Organize the code into proper modules (client, domain, factory, models)
- Provide documentation in README.md
- Push the project to a Git repository

# 3. Theory — Creational Design Patterns

Creational patterns deal with how objects are created, separating object construction from business logic.
They improve extensibility, clarity, maintainability, and encapsulation of the instantiation process.

## Patterns studied

| Pattern | Summary |
|--------|---------|
| Singleton | Ensures only one instance exists worldwide. |
| Builder | Builds complex objects step-by-step. |
| Prototype | Creates objects by cloning existing ones. |
| Factory Method | Delegates object creation to subclasses or methods. |
| Abstract Factory | Creates families of related objects. |
| Object Pool | Reuses expensive objects instead of creating new ones. |

# 4. Domain Description

The domain chosen is Bouquet Configuration System (Bloomify).

Users can:

- Build bouquets
- Choose flowers
- Add decorations
- Configure delivery
- Change locale and currency

## Main Entities

| Entity | Responsibility |
|--------|----------------|
| Bouquet | Final product composed of flowers, wrapping, size, add-ons. |
| Flower | Base class for flowers (Rose, Tulip, Lily...). |
| Addon | Additional decorative elements. |
| Config | Global preferences (currency, delivery type, locale). |
| BouquetBuilder | Constructs bouquets step-by-step. |
| FlowerFactory | Creates flower objects. |
| PrototypeRegistry | Stores predefined bouquets and clones them. |

# 5. Implemented Creational Patterns

## 1. Singleton – Global Config

Config stores global user preferences:

- locale
- currency
- delivery type

It ensures only one instance is used.

## 2. Builder – Bouquet Construction

The Builder pattern provides:

- fluent API
- cleaner construction
- validation
- immutability after creation

## 3. Factory Method – Flower Creation

Creates flower objects dynamically based on user choice.

## 4. Optional: Prototype – Predefined Bouquets

Allows cloning template bouquets.

# 6. Project Structure

```
/client
  index.ts

/domain
  /models
     Bouquet.ts
     Flower.ts
     Addon.ts

  /builder
     BouquetBuilder.ts

  /factory
     FlowerFactory.ts

  /singleton
     Config.ts

  /prototype
     BouquetPrototype.ts

/public
  index.html

styles.css
README.md
```

# 7. Implementation Details

- BouquetBuilder handles flowers, wrapping, add-ons, size, and final build().
- Config (Singleton) loads/saves from localStorage and ensures global consistency.
- Factory Method enables addition of new flower types without modifying UI code.
- UI generates bouquets dynamically and validates user input.
## 🔷 1. Builder Pattern

### Class Diagram

```
┌─────────────────────────────┐
│     BouquetBuilder          │
├─────────────────────────────┤
│ - name: string              │
│ - flowers: FlowerLine[]     │
│ - wrapping: Wrapping?       │
│ - ribbon: Ribbon?           │
│ - cardMessage: string       │
├─────────────────────────────┤
│ + setName(name): this       │
│ + addFlower(...): this      │
│ + addWrapping(...): this    │
│ + addRibbon(...): this      │
│ + addCard(msg): this        │
│ + build(): Bouquet          │
│ + reset(): void             │
└─────────────────────────────┘
           │
           │ builds
           ↓
┌─────────────────────────────┐
│        Bouquet              │
├─────────────────────────────┤
│ + name: string              │
│ + flowers: FlowerLine[]     │
│ + wrapping: Wrapping        │
│ + ribbon: Ribbon            │
│ + cardMessage: string       │
│ + price: number             │
├─────────────────────────────┤
│ + calculatePrice(): number  │
│ + clone(): Bouquet          │
└─────────────────────────────┘
```

### Sequence Diagram

```
Client          Builder                 Bouquet
  |                |                       |
  |─setName()─────>|                       |
  |                |                       |
  |─addFlower()───>|                       |
  |                |                       |
  |─addFlower()───>|                       |
  |                |                       |
  |─addWrapping()─>|                       |
  |                |                       |
  |─addRibbon()───>|                       |
  |                |                       |
  |─build()───────>|                       |
  |                |─new Bouquet()────────>|
  |                |                       |
  |                |<──────────────────────|
  |<───────────────|                       |
  |                |                       |
```

---

## 🔷 2. Prototype Pattern

### Class Diagram

```
┌──────────────────────────────┐
│   <<interface>>              │
│      IPrototype              │
├──────────────────────────────┤
│ + clone(name?): Bouquet      │
└──────────────────────────────┘
            △
            │ implements
            │
┌──────────────────────────────┐
│     BouquetTemplate          │
├──────────────────────────────┤
│ - bouquet: Bouquet           │
├──────────────────────────────┤
│ + clone(name?): Bouquet      │
│ + static presets(): Object   │
└──────────────────────────────┘
            │
            │ has
            ↓
┌──────────────────────────────┐
│        Bouquet               │
├──────────────────────────────┤
│ + name: string               │
│ + flowers: FlowerLine[]      │
│ + wrapping: Wrapping         │
│ + ribbon: Ribbon             │
└──────────────────────────────┘
```

### Usage Diagram

```
┌──────────────────────────┐
│  BouquetTemplate         │
│  .presets()              │
└──────────────────────────┘
            │
            │ returns
            ↓
┌──────────────────────────┐
│  {                       │
│    valentine: Template   │──┐
│    spring: Template      │  │
│    pastel: Template      │  │
│  }                       │  │
└──────────────────────────┘  │
                              │
            ┌─────────────────┘
            │
            ↓
┌──────────────────────────┐
│  template.clone()        │
└──────────────────────────┘
            │
            │ returns
            ↓
┌──────────────────────────┐
│  New Bouquet Instance    │
│  (deep copy)             │
└──────────────────────────┘
```

---

## 🔷 3. Singleton Pattern

### Class Diagram

```
┌─────────────────────────────────┐
│          Config                 │
├─────────────────────────────────┤
│ - static instance: Config       │
│ - currency: Currency            │
│ - locale: Locale                │
│ - deliveryMethod: Delivery      │
├─────────────────────────────────┤
│ - constructor()  [private]      │
│ + static getInstance(): Config  │
│ + setCurrency(curr): void       │
│ + setLocale(locale): void       │
│ + formatPrice(price): string    │
│ + convertCurrency(amt): number  │
└─────────────────────────────────┘
```

### Singleton Instance Creation

```
First Call:
┌────────────┐
│  Client A  │─────getInstance()────┐
└────────────┘                      │
                                    ↓
                        ┌────────────────────────┐
                        │  No instance exists    │
                        │  Create new Config()   │
                        │  Store in static var   │
                        └────────────────────────┘
                                    │
                                    ↓
                        ┌────────────────────────┐
                        │   Return instance      │
                        └────────────────────────┘

Second Call:
┌────────────┐
│  Client B  │─────getInstance()────┐
└────────────┘                      │
                                    ↓
                        ┌────────────────────────┐
                        │  Instance exists       │
                        │  Return same instance  │
                        └────────────────────────┘
                                    │
                                    ↓
                        Same instance as Client A
```

---

## 🔷 4. Factory Method Pattern

### Class Diagram

```
┌──────────────────────────────────┐
│   <<interface>>                  │
│      IPayment                    │
├──────────────────────────────────┤
│ + pay(amount): PaymentResult     │
│ + getDetails(): string           │
└──────────────────────────────────┘
            △
            │ implements
     ┌──────┼──────┐
     │      │      │
┌────────┐ │ ┌──────────┐
│ Card   │ │ │  Crypto  │
│Payment │ │ │ Payment  │
└────────┘ │ └──────────┘
           │
      ┌────────────┐
      │   Bank     │
      │  Transfer  │
      └────────────┘

┌──────────────────────────────────┐
│  <<abstract>>                    │
│     PaymentCreator               │
├──────────────────────────────────┤
│ + abstract create(): IPayment    │
│ + checkout(amt, opts): string    │
└──────────────────────────────────┘
            △
            │ extends
            │
┌──────────────────────────────────┐
│  SimplePaymentCreator            │
├──────────────────────────────────┤
│ + create(opts): IPayment         │
│ + checkout(amt, opts): string    │
└──────────────────────────────────┘
```

### Factory Flow

```
Client
  │
  │ create({ type: "card", ... })
  ↓
SimplePaymentCreator
  │
  │ switch(type)
  ├──→ "card"   → new CardPayment()
  ├──→ "crypto" → new CryptoPayment()
  └──→ "bank"   → new BankTransferPayment()
  │
  ↓
IPayment object returned
  │
  │ pay(amount)
  ↓
Process payment
```

---


# 8. Difficulties Encountered

- TSConfig errors: isolatedModules, moduleResolution deprecated flag.
- Circular imports during refactoring.
- Missing ID bindings in UI forms.
- Validation inside Builder.
- Persistence logic for Singleton.

# 9. Testing

- Bouquet building tested with multiple combinations.
- Config persistence verified via page refresh.
- Factory tested with valid/invalid flower types.
- Prototype verified for deep clone correctness.

# 10. Conclusions

This laboratory demonstrates the correct use of multiple creational design patterns in an organized OO project.

# 11. References

- Gamma, Helm, Johnson, Vlissides – Design Patterns: Elements of Reusable Object-Oriented Software
- TypeScript documentation
- Course materials provided by Drumea Vasile
