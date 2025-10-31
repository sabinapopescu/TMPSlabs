# 🌷 Bloomify — Creational Design Patterns (TypeScript)

**Technical University of Moldova**  
**Faculty of Computers, Informatics and Microelectronics**  
**Department of Software Engineering and Automation**  

**Course:** Software Engineering Laboratory  
**Topic:** *Creational Design Patterns*  
**Student:** *[Your Name]*  
**Professor:** *Drumea Vasile*  
**Date:** *2025-10-31*  

---

## 🎯 Objectives
1. Study and understand the **Creational Design Patterns** and their role in object-oriented software design.  
2. Choose a **domain**, define its main **classes / models / entities**, and determine the appropriate **instantiation mechanisms**.  
3. Implement **at least three** creational design patterns inside a working sample project.

---

## 🧠 Theoretical Background
In software engineering, **creational design patterns** provide general, reusable solutions for **object creation** problems.  
They hide, optimize, or control instantiation to improve flexibility and reuse.

**Typical creational patterns**
| Pattern | Purpose |
|----------|----------|
| Singleton | ensure only one global instance |
| Builder | construct complex objects step-by-step |
| Prototype | clone existing instances efficiently |
| Factory Method | delegate instantiation to subclasses |
| Abstract Factory | produce families of related objects |
| Object Pool | manage reusable object resources |

---

## 🌺 Domain Description — *Bloomify Flower Boutique*
Bloomify is an elegant flower-shop simulator inspired by **[sentiment.md](https://sentiment.md/ro)**.  
Users can build personalized bouquets, clone ready-made templates, and choose different payment methods.

---

## 🧩 Implemented Creational Patterns
| Pattern | File | Purpose |
|----------|------|----------|
| **Singleton** | `domain/Config.ts` | global configuration (currency / locale / delivery) |
| **Builder** | `domain/BouquetBuilder.ts` | constructs bouquets from individual flowers, wrapping, ribbon, and message |
| **Prototype** | `domain/BouquetPrototype.ts` | clones pre-defined bouquet templates (“Valentine Special”, “Spring Dream”) |
| **Factory Method** | `factory/PaymentFactory.ts` | creates payment objects (`Card`, `Crypto`, `Bank`) without exposing concrete classes |

---

## 🏗️ Project Structure
```
creational-lab-bloomify/
├─ README.md
├─ package.json
├─ tsconfig.json
├─ public/
│  ├─ index.html          # UI & DOM bindings
│  ├─ styles.css          # sentiment.md–style design
│  └─ js/                 # compiled JS output
└─ src/
   ├─ client/main.ts      # UI logic & integration
   ├─ domain/
   │  ├─ Config.ts
   │  ├─ BouquetBuilder.ts
   │  └─ BouquetPrototype.ts
   ├─ factory/
   │  ├─ Payment.ts
   │  └─ PaymentFactory.ts
   ├─ models/
   │  ├─ Flower.ts
   │  ├─ Bouquet.ts
   │  └─ Customer.ts
   └─ pool/
      └─ ConnectionPool.ts (optional bonus Object Pool)
```

---

## ⚙️ Installation & Usage

### 1) Install dependencies
```bash
npm install
```

### 2) Build TypeScript → JavaScript
```bash
npm run build
```

### 3) Preview locally (serves http://localhost:8080)
```bash
npm run preview
```
*(on macOS you can use `npm run preview:open` to auto-launch the browser)*

### 4) Manual view
Open `public/index.html` after building.

**package.json scripts (reference):**
```json
{
  "scripts": {
    "build": "tsc -p .",
    "dev": "tsc -w",
    "preview": "http-server public -p 8080 -c-1 --cors",
    "preview:open": "http-server public -p 8080 -c-1 --cors & sleep 1 && open http://localhost:8080"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "ts-node": "^10.9.2",
    "http-server": "^14.1.1"
  }
}
```

**tsconfig.json (reference):**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "strict": true,
    "rootDir": "src",
    "outDir": "public/js"
  },
  "include": ["src"]
}
```

---

## 🧩 Pattern Demonstration Flow
1. **Builder** → fill the form, click **“Build Bouquet”** → a new bouquet object is built via the Builder chain.  
2. **Prototype** → click a template (Valentine / Spring / Pastel) → cloned bouquet appears.  
3. **Singleton** → switch currency (EUR ↔ USD) → price labels update instantly via shared config.  
4. **Factory Method** → choose a payment type and click **“Pay”** → respective strategy object executes.  

Console output & UI both confirm each pattern’s instantiation mechanism.

---

## 🧪 Example Console/UI Output
```
Config loaded: { currency: 'EUR', locale: 'ro', delivery: 'courier' }
🌷 Bouquet built: 15× Red Roses, Satin Pink wrapping, Silk Red ribbon
💳 Payment: CARD **** **** **** 4242 charged 120.00 €
✅ Singleton verified: same Config instance reused
```

---

## 🧱 Technologies
- **Language:** TypeScript (ES2022)  
- **No frameworks / no external runtime libs**  
- **Dev tools:** tsc, ts-node, http-server  

---

## 📘 Conclusions
- The **Singleton** ensured consistent configuration across modules.  
- The **Builder** simplified complex bouquet construction through fluent chaining.  
- The **Prototype** enabled quick creation of preset bouquets with minimal overhead.  
- The **Factory Method** decoupled payment instantiation from client logic, improving extensibility.  

These patterns demonstrate how disciplined object creation yields **modular, reusable, and maintainable** software.

---

## 📚 References
- *Design Patterns: Elements of Reusable Object-Oriented Software* — Gamma et al.  
- TypeScript Docs — https://www.typescriptlang.org  
- sentiment.md — UI inspiration  

---

✅ **Pure TypeScript implementation • No frameworks • Object-Oriented Design • Ready for ELSE submission**
