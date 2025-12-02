# Laboratory Work Report – Behavioral Design Patterns

## Topic: Behavioral Design Patterns
## Author: Popescu Sabina
## Supervisor: Guzun Grigore
## Course: TMPS – Software Design Techniques
## Lab Nr.: 3 – Behavioral Design Patterns (Bloomify )


## 1. Introduction / Motivation

This laboratory work continues the Bloomify project, building upon the foundations established in the Creational and Structural Design Patterns labs. While previous labs focused on object creation and composition, this lab emphasizes **communication patterns between objects** and **encapsulation of behavior**.

The project implements:
- **Observer Pattern** – for order status notifications
- **Strategy Pattern** – for delivery method selection
- **Command Pattern** – for operation management with undo/redo

These patterns improve flexibility in object communication, enable runtime algorithm selection, and provide sophisticated operation tracking with reversibility.

---

## 2. Theory – Behavioral Design Patterns

Behavioral patterns are concerned with algorithms and the assignment of responsibilities between objects. They describe not just patterns of objects or classes but also the patterns of communication between them.

### Patterns Implemented:

#### 2.1 Observer Pattern
**Definition:** Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.

**Key Participants:**
- **Subject** – maintains list of observers and notifies them of state changes
- **Observer** – defines updating interface for objects that should be notified
- **ConcreteSubject** – stores state and sends notifications
- **ConcreteObserver** – implements update interface to keep state consistent

**Use Cases:**
- Event handling systems
- Model-View architecture
- Notification systems
- Real-time data updates

#### 2.2 Strategy Pattern
**Definition:** Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

**Key Participants:**
- **Strategy** – declares interface common to all algorithms
- **ConcreteStrategy** – implements specific algorithm
- **Context** – maintains reference to Strategy object and delegates algorithm execution

**Use Cases:**
- Multiple algorithms for same task
- Runtime algorithm selection
- Avoiding conditional statements
- Encapsulating algorithmic variations

#### 2.3 Command Pattern
**Definition:** Encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

**Key Participants:**
- **Command** – declares interface for executing operations
- **ConcreteCommand** – implements execute() and undo()
- **Invoker** – asks command to carry out request
- **Receiver** – knows how to perform operations

**Use Cases:**
- Undo/redo functionality
- Transaction systems
- Command queuing
- Operation logging
- Macro commands

---

## 3. System Description (Bloomify – Enhanced with Behavioral Patterns)

Bloomify now supports advanced behavioral features:
- **Real-time order tracking** with multiple observers
- **Flexible delivery strategies** with runtime selection
- **Operation management** with full undo/redo support
- **Event-driven notifications** for order lifecycle
- **Command history** and audit trails

### 📁 Bloomify Enhanced - Project Structure (Lab 3)
```
bloomify-enhanced/
│
├── 📄 README.md                    # Comprehensive documentation
├── 📄 package.json                 # NPM dependencies and scripts
├── 📄 tsconfig.json                # TypeScript configuration
│
├── 📁 public/                      # Static web files
│   ├── 📄 index.html              # Main HTML (with behavioral demos)
│   ├── 📄 styles.css              # Modern, responsive CSS
│   └── 📁 js/                     # Compiled JavaScript
│       ├── 📁 behavioral/         # Behavioral patterns (compiled)
│       │   ├── 📁 observer/
│       │   ├── 📁 strategy/
│       │   └── 📁 command/
│       └── ...
│
└── 📁 src/                         # TypeScript source files
    │
    ├── 📁 behavioral/              # 🆕 BEHAVIORAL PATTERNS
    │   │
    │   ├── 📁 observer/            # 🔷 Observer Pattern
    │   │   ├── 📄 IObserver.ts           # Observer interface
    │   │   ├── 📄 ISubject.ts            # Subject interface
    │   │   ├── 📄 OrderSubject.ts        # Concrete Subject
    │   │   ├── 📄 CustomerObserver.ts    # Customer notifications
    │   │   ├── 📄 InventoryObserver.ts   # Inventory management
    │   │   ├── 📄 DeliveryObserver.ts    # Delivery tracking
    │   │   └── 📄 index.ts               # Exports
    │   │
    │   ├── 📁 strategy/            # 🔷 Strategy Pattern
    │   │   ├── 📄 IDeliveryStrategy.ts         # Strategy interface
    │   │   ├── 📄 StandardDeliveryStrategy.ts  # Standard delivery
    │   │   ├── 📄 ExpressDeliveryStrategy.ts   # Express delivery
    │   │   ├── 📄 SameDayDeliveryStrategy.ts   # Same-day delivery
    │   │   ├── 📄 PickupStrategy.ts            # Store pickup
    │   │   ├── 📄 DeliveryContext.ts           # Context manager
    │   │   └── 📄 index.ts                     # Exports
    │   │
    │   └── 📁 command/             # 🔷 Command Pattern
    │       ├── 📄 ICommand.ts                  # Command interface
    │       ├── 📄 OrderManager.ts              # Receiver
    │       ├── 📄 PlaceOrderCommand.ts         # Place order
    │       ├── 📄 CancelOrderCommand.ts        # Cancel order
    │       ├── 📄 ModifyOrderCommand.ts        # Modify status
    │       ├── 📄 OrderInvoker.ts              # Command invoker
    │       └── 📄 index.ts                     # Exports
    │
    ├── 📁 client/                  # UI Integration Layer
    │   └── 📄 main.ts             # Main application logic
    │                                • Behavioral pattern demos
    │                                • Event handlers
    │                                • Pattern integration
    │
    ├── 📁 domain/                  # Creational Patterns
    │   ├── 📄 Config.ts           # Singleton
    │   ├── 📄 BouquetBuilder.ts   # Builder
    │   └── 📄 BouquetPrototype.ts # Prototype
    │
    ├── 📁 decorators/              # Structural Patterns
    │   └── ...                     # Decorator implementation
    │
    ├── 📁 facade/                  # Structural Patterns
    │   └── ...                     # Facade implementation
    │
    ├── 📁 adapters/                # Structural Patterns
    │   └── ...                     # Adapter implementation
    │
    └── 📁 models/                  # Data Models
        ├── 📄 Bouquet.ts
        ├── 📄 Flower.ts
        └── 📄 Customer.ts
```

---

## 4. Data Flow with Behavioral Patterns
```
1. User Action (Place Order)
   ↓
2. Command Pattern
   • Command encapsulation
   • Command execution
   • History tracking
   ↓
3. Observer Pattern
   • Order state change
   • Notify all observers
   • Customer notification
   • Inventory update
   • Delivery scheduling
   ↓
4. Strategy Pattern
   • Select delivery strategy
   • Calculate delivery cost
   • Determine delivery time
   ↓
5. Result & Feedback
   • Display notifications
   • Update UI
   • Log command history
```

---

## 5. Implementation & Explanation

### 5.1 Observer Pattern – Order Status Notifications

The Observer pattern implements a subscription mechanism for order lifecycle events. When an order's status changes, all registered observers are automatically notified.

**Components:**
- **OrderSubject (Subject)** – Manages order state and observer list
- **CustomerObserver** – Sends notifications to customers
- **InventoryObserver** – Updates inventory levels
- **DeliveryObserver** – Manages delivery scheduling

**Key Features:**
- One-to-many communication
- Loose coupling between subject and observers
- Dynamic subscription/unsubscription
- Automatic notification on state changes

**Implementation Example:**
```typescript
// Create order subject
const order = new OrderSubject(orderData);

// Attach observers
order.attach(new CustomerObserver());
order.attach(new InventoryObserver());
order.attach(new DeliveryObserver());

// Status change automatically notifies all observers
order.updateStatus("confirmed"); // All observers notified
order.updateStatus("preparing"); // All observers notified again
```

### 5.2 Strategy Pattern – Delivery Method Selection

The Strategy pattern encapsulates delivery algorithms into separate strategy objects, allowing runtime selection of the most appropriate delivery method.

**Strategies Implemented:**
- **StandardDeliveryStrategy** – 3-5 business days, free over €50
- **ExpressDeliveryStrategy** – 1-2 business days, 20% discount over €100
- **SameDayDeliveryStrategy** – Same day delivery, within 15km, premium pricing
- **PickupStrategy** – Free store pickup, ready in 2 hours

**Key Features:**
- Runtime algorithm selection
- Easy addition of new strategies
- Elimination of conditional statements
- Encapsulation of algorithm variations

**Implementation Example:**
```typescript
// Create context with initial strategy
const context = new DeliveryContext(
  new StandardDeliveryStrategy()
);

// Calculate with current strategy
let cost = context.calculateDeliveryCost(12, 75.00);

// Switch strategy at runtime
context.setStrategy(new ExpressDeliveryStrategy());
cost = context.calculateDeliveryCost(12, 75.00); // Different cost

// Compare all strategies
DeliveryContext.compareStrategies(
  [standard, express, sameDay, pickup],
  distance,
  orderValue
);
```

### 5.3 Command Pattern – Operation Management with Undo/Redo

The Command pattern encapsulates operations as objects, providing operation history, queuing, and full undo/redo support.

**Commands Implemented:**
- **PlaceOrderCommand** – Creates new orders
- **CancelOrderCommand** – Cancels existing orders
- **ModifyOrderCommand** – Updates order status

**Key Features:**
- Operation encapsulation
- Command history tracking
- Full undo/redo support
- Operation queuing
- Audit trail

**Implementation Example:**
```typescript
// Create receiver and invoker
const orderManager = new OrderManager();
const invoker = new OrderInvoker();

// Execute commands
const placeCmd = new PlaceOrderCommand(
  orderManager, bouquet, "Alice", "alice@example.com"
);
invoker.executeCommand(placeCmd); // Order placed

const cancelCmd = new CancelOrderCommand(
  orderManager, orderId
);
invoker.executeCommand(cancelCmd); // Order cancelled

// Undo operations
invoker.undo(); // Order restored
invoker.redo(); // Order cancelled again

// View command history
console.log(invoker.displayHistory());
```

---

## 6. Files Added / Modified

### New Directories and Files:

**Observer Pattern:**
- `src/behavioral/observer/IObserver.ts`
- `src/behavioral/observer/ISubject.ts`
- `src/behavioral/observer/OrderSubject.ts`
- `src/behavioral/observer/CustomerObserver.ts`
- `src/behavioral/observer/InventoryObserver.ts`
- `src/behavioral/observer/DeliveryObserver.ts`
- `src/behavioral/observer/index.ts`

**Strategy Pattern:**
- `src/behavioral/strategy/IDeliveryStrategy.ts`
- `src/behavioral/strategy/StandardDeliveryStrategy.ts`
- `src/behavioral/strategy/ExpressDeliveryStrategy.ts`
- `src/behavioral/strategy/SameDayDeliveryStrategy.ts`
- `src/behavioral/strategy/PickupStrategy.ts`
- `src/behavioral/strategy/DeliveryContext.ts`
- `src/behavioral/strategy/index.ts`

**Command Pattern:**
- `src/behavioral/command/ICommand.ts`
- `src/behavioral/command/OrderManager.ts`
- `src/behavioral/command/PlaceOrderCommand.ts`
- `src/behavioral/command/CancelOrderCommand.ts`
- `src/behavioral/command/ModifyOrderCommand.ts`
- `src/behavioral/command/OrderInvoker.ts`
- `src/behavioral/command/index.ts`

### Modified Files:
- `src/client/main.ts` – Added behavioral pattern demos and integration
- `public/index.html` – Added behavioral pattern demo buttons and UI
- `public/styles.css` – Added styling for pattern demonstrations

---

## 7. Pattern Diagrams

### 7.1 Observer Pattern

#### Class Diagram
```
┌────────────────────────────────┐
│    <<interface>>               │
│      ISubject                  │
├────────────────────────────────┤
│ + attach(observer): void       │
│ + detach(observer): void       │
│ + notify(): void               │
│ + getState(): any              │
└────────────────────────────────┘
            △
            │ implements
            │
┌────────────────────────────────┐
│      OrderSubject              │
│   (Concrete Subject)           │
├────────────────────────────────┤
│ - observers: IObserver[]       │
│ - orderData: OrderData         │
├────────────────────────────────┤
│ + attach(observer): void       │
│ + detach(observer): void       │
│ + notify(): void               │
│ + updateStatus(status): void   │
│ + getState(): OrderData        │
└────────────────────────────────┘
            │
            │ notifies
            ↓
┌────────────────────────────────┐
│    <<interface>>               │
│      IObserver                 │
├────────────────────────────────┤
│ + update(subject): void        │
│ + getName(): string            │
└────────────────────────────────┘
            △
            │ implements
     ┌──────┼──────┬──────┐
     │      │      │      │
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Customer    │ │  Inventory   │ │  Delivery    │
│  Observer    │ │  Observer    │ │  Observer    │
├──────────────┤ ├──────────────┤ ├──────────────┤
│+ update()    │ │+ update()    │ │+ update()    │
│+ getName()   │ │+ getName()   │ │+ getName()   │
└──────────────┘ └──────────────┘ └──────────────┘
```

#### Observer Flow
```
Order Status Change
        │
        ↓
OrderSubject.updateStatus("confirmed")
        │
        ↓
OrderSubject.notify()
        │
        ├──→ CustomerObserver.update()
        │      └─→ Send email notification
        │      └─→ Send SMS notification
        │      └─→ Update UI toast
        │
        ├──→ InventoryObserver.update()
        │      └─→ Reserve stock
        │      └─→ Update inventory levels
        │
        └──→ DeliveryObserver.update()
               └─→ Schedule delivery
               └─→ Add to delivery queue
```

### 7.2 Strategy Pattern

#### Class Diagram
```
┌────────────────────────────────┐
│    <<interface>>               │
│   IDeliveryStrategy            │
├────────────────────────────────┤
│ + calculateCost(distance,      │
│       orderValue): number      │
│ + getEstimatedTime(dist): str  │
│ + getDeliveryDetails(): Details│
│ + getName(): string            │
└────────────────────────────────┘
            △
            │ implements
     ┌──────┼──────┬──────┬──────┐
     │      │      │      │      │
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Standard │ │ Express  │ │ Same-Day │ │  Pickup  │
│ Delivery │ │ Delivery │ │ Delivery │ │ Strategy │
├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
│+ calc... │ │+ calc... │ │+ calc... │ │+ calc... │
│+ getEst..│ │+ getEst..│ │+ getEst..│ │+ getEst..│
└──────────┘ └──────────┘ └──────────┘ └──────────┘

┌────────────────────────────────┐
│      DeliveryContext           │
│        (Context)               │
├────────────────────────────────┤
│ - strategy: IDeliveryStrategy  │
├────────────────────────────────┤
│ + setStrategy(strategy): void  │
│ + calculateDeliveryCost(): num │
│ + getDeliveryDetails(): Details│
└────────────────────────────────┘
```

#### Strategy Selection Flow
```
Client Request
     │
     ↓
DeliveryContext
     │
     ├─→ setStrategy(StandardDeliveryStrategy)
     │     │
     │     └─→ calculateCost()
     │           • Base: €5.00
     │           • Per km: €0.50
     │           • Free if > €50
     │
     ├─→ setStrategy(ExpressDeliveryStrategy)
     │     │
     │     └─→ calculateCost()
     │           • Base: €12.00
     │           • Per km: €1.00
     │           • 20% off if > €100
     │
     ├─→ setStrategy(SameDayDeliveryStrategy)
     │     │
     │     └─→ calculateCost()
     │           • Base: €20.00
     │           • Per km: €2.00
     │           • Max 15km only
     │
     └─→ setStrategy(PickupStrategy)
           │
           └─→ calculateCost()
                 • Cost: €0.00 (Free)
                 • Ready in 2 hours
```

### 7.3 Command Pattern

#### Class Diagram
```
┌────────────────────────────────┐
│    <<interface>>               │
│      ICommand                  │
├────────────────────────────────┤
│ + execute(): string            │
│ + undo(): string               │
│ + getDescription(): string     │
│ + getTimestamp(): Date         │
│ + canUndo(): boolean           │
└────────────────────────────────┘
            △
            │ implements
     ┌──────┼──────┬──────┐
     │      │      │      │
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ PlaceOrder   │ │ CancelOrder  │ │ ModifyOrder  │
│  Command     │ │  Command     │ │  Command     │
├──────────────┤ ├──────────────┤ ├──────────────┤
│- receiver    │ │- receiver    │ │- receiver    │
│- bouquet     │ │- orderId     │ │- orderId     │
│- customer    │ │- prevStatus  │ │- newStatus   │
├──────────────┤ ├──────────────┤ ├──────────────┤
│+ execute()   │ │+ execute()   │ │+ execute()   │
│+ undo()      │ │+ undo()      │ │+ undo()      │
└──────────────┘ └──────────────┘ └──────────────┘

┌────────────────────────────────┐
│      OrderInvoker              │
│       (Invoker)                │
├────────────────────────────────┤
│ - commandHistory: ICommand[]   │
│ - currentPosition: number      │
├────────────────────────────────┤
│ + executeCommand(cmd): string  │
│ + undo(): string               │
│ + redo(): string               │
│ + getHistory(): HistoryItem[]  │
│ + clearHistory(): void         │
└────────────────────────────────┘

┌────────────────────────────────┐
│      OrderManager              │
│       (Receiver)               │
├────────────────────────────────┤
│ - orders: Map<id, Order>       │
├────────────────────────────────┤
│ + placeOrder(...): Order       │
│ + cancelOrder(id): Order       │
│ + modifyOrderStatus(...): Order│
│ + restoreOrder(...): Order     │
└────────────────────────────────┘
```

#### Command Execution Flow
```
Client
  │
  ↓
OrderInvoker.executeCommand(PlaceOrderCommand)
  │
  ├─→ 1. Command.execute()
  │     └─→ OrderManager.placeOrder()
  │           └─→ Create new order
  │           └─→ Return order details
  │
  ├─→ 2. Add to history
  │     └─→ commandHistory.push(command)
  │     └─→ currentPosition++
  │
  └─→ 3. Return result
        └─→ "Order ORD-000001 placed"

OrderInvoker.undo()
  │
  ├─→ 1. Get current command
  │     └─→ command = history[currentPosition]
  │
  ├─→ 2. Command.undo()
  │     └─→ OrderManager.cancelOrder()
  │           └─→ Cancel the order
  │
  ├─→ 3. Update position
  │     └─→ currentPosition--
  │
  └─→ 4. Return result
        └─→ "Order ORD-000001 cancelled (undo)"

OrderInvoker.redo()
  │
  ├─→ 1. Move forward in history
  │     └─→ currentPosition++
  │
  ├─→ 2. Get command
  │     └─→ command = history[currentPosition]
  │
  ├─→ 3. Command.execute()
  │     └─→ OrderManager.placeOrder()
  │
  └─→ 4. Return result
        └─→ "Order ORD-000001 placed (redo)"
```

#### Command History Example
```
Command History:
═══════════════════════════════════════════════════
  [1] 14:30:15 | Place Order: Valentine Bouquet for Alice | Undo: ✓
  [2] 14:31:22 | Place Order: Spring Dream for Bob | Undo: ✓
→ [3] 14:32:10 | Modify Order: ORD-000001 → preparing | Undo: ✓
  [4] 14:33:05 | Cancel Order: ORD-000002 | Undo: ✓
═══════════════════════════════════════════════════
Current Position: 3/4
Can Undo: Yes | Can Redo: Yes

After undo():
═══════════════════════════════════════════════════
  [1] 14:30:15 | Place Order: Valentine Bouquet for Alice | Undo: ✓
→ [2] 14:31:22 | Place Order: Spring Dream for Bob | Undo: ✓
  [3] 14:32:10 | Modify Order: ORD-000001 → preparing | Undo: ✓
  [4] 14:33:05 | Cancel Order: ORD-000002 | Undo: ✓
═══════════════════════════════════════════════════
Current Position: 2/4
Can Undo: Yes | Can Redo: Yes
```

---

## 8. Pattern Interaction Diagram

### Complete Behavioral System Flow
```
                    CLIENT REQUEST
                          │
                          ↓
              ┌───────────────────────┐
              │   COMMAND PATTERN     │
              │  (Operation Mgmt)     │
              └───────────────────────┘
                          │
                    executeCommand()
                          │
                          ↓
              ┌───────────────────────┐
              │   ORDER MANAGER       │
              │   (Receiver)          │
              └───────────────────────┘
                          │
                    placeOrder()
                          │
                          ↓
              ┌───────────────────────┐
              │   OBSERVER PATTERN    │
              │  (Notifications)      │
              └───────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Customer   │  │  Inventory   │  │   Delivery   │
│   Observer   │  │   Observer   │  │   Observer   │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ↓
              ┌───────────────────────┐
              │   STRATEGY PATTERN    │
              │  (Delivery Method)    │
              └───────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Standard   │  │   Express    │  │  Same-Day    │
│   Delivery   │  │   Delivery   │  │  Delivery    │
└──────────────┘  └──────────────┘  └──────────────┘
                          │
                          ↓
                    FINAL RESULT
```

### Pattern Relationships
```
┌─────────────────────────────────────────┐
│          Application Layer              │
│    (main.ts - UI & Integration)         │
└─────────────────────────────────────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
         ↓          ↓          ↓
    ┌────────┐ ┌────────┐ ┌────────┐
    │Observer│ │Strategy│ │Command │
    │Pattern │ │Pattern │ │Pattern │
    └────────┘ └────────┘ └────────┘
         │          │          │
         └──────────┼──────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
         ↓          ↓          ↓
    ┌────────┐ ┌────────┐ ┌────────┐
    │ Facade │ │Adapter │ │Decora- │
    │        │ │        │ │  tor   │
    └────────┘ └────────┘ └────────┘
         │          │          │
         └──────────┼──────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
         ↓          ↓          ↓
    ┌────────┐ ┌────────┐ ┌────────┐
    │Builder │ │Factory │ │Single- │
    │        │ │        │ │  ton   │
    └────────┘ └────────┘ └────────┘
```

---

## 9. Combined Pattern Demo

The system demonstrates all three behavioral patterns working together:
```typescript
function demoCombinedPatterns() {
  // 1. COMMAND: Encapsulate order operation
  const orderManager = new OrderManager();
  const invoker = new OrderInvoker();
  
  const placeCmd = new PlaceOrderCommand(
    orderManager, bouquet, "Jane", "jane@example.com"
  );
  invoker.executeCommand(placeCmd);
  
  // 2. OBSERVER: Attach observers to order
  const order = placeCmd.getExecutedOrder();
  order.orderSubject.attach(new CustomerObserver());
  order.orderSubject.attach(new InventoryObserver());
  order.orderSubject.attach(new DeliveryObserver());
  
  // 3. STRATEGY: Select delivery method
  const deliveryContext = new DeliveryContext(
    new ExpressDeliveryStrategy()
  );
  const deliveryDetails = deliveryContext.getDeliveryDetails(
    10, order.totalPrice
  );
  
  // 4. Update order status (triggers observers)
  order.orderSubject.updateStatus("confirmed");
  order.orderSubject.updateStatus("preparing");
  order.orderSubject.updateStatus("ready");
  
  // 5. Command history and undo
  console.log(invoker.displayHistory());
  invoker.undo(); // Undo order placement
  invoker.redo(); // Redo order placement
}
```

---
