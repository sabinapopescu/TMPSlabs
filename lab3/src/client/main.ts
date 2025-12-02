import { Config } from "../domain/Config.js";
import { Bouquet } from "../models/Bouquet.js";
import { BouquetBuilder } from "../domain/BouquetBuilder.js";
import { BouquetTemplate } from "../domain/BouquetPrototype.js";
import { SimplePaymentCreator } from "../factory/PaymentFactory.js";

// Structural Patterns
import { 
  BouquetComponent, 
  GiftBoxDecorator, 
  PremiumVaseDecorator, 
  CareInstructionsDecorator,
  ExpressDeliveryDecorator,
  IBouquetComponent
} from "../decorators/index.js";
import { BloomifyOrderFacade } from "../facade/index.js";
import { NotificationManager } from "../adapters/index.js";
// Add after existing imports (around line 17)

// Behavioral Patterns - Lab 3
import {
  OrderSubject,
  CustomerObserver,
  InventoryObserver,
  DeliveryObserver,
  OrderData,
  OrderState
} from "../behavioral/observer/index.js";

import {
  DeliveryContext,
  StandardDeliveryStrategy,
  ExpressDeliveryStrategy,
  SameDayDeliveryStrategy,
  PickupStrategy
} from "../behavioral/strategy/index.js";

import {
  OrderManager,
  OrderInvoker,
  PlaceOrderCommand,
  CancelOrderCommand,
  ModifyOrderCommand,
  StoredOrder  // Add this
} from "../behavioral/command/index.js";

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

const $ = <T extends HTMLElement>(sel: string): T | null => document.querySelector(sel);
const $$ = (sel: string): HTMLElement[] => Array.from(document.querySelectorAll(sel));

/**
 * Display a toast notification
 */
function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
  const toast = $('#toast')!;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Validate a form field
 */
function validateField(input: HTMLInputElement | HTMLSelectElement, errorElement: HTMLElement | null): boolean {
  if (!input.value.trim()) {
    if (errorElement) errorElement.textContent = 'This field is required';
    return false;
  }

  // Specific validations
  if (input.type === 'number') {
    const value = parseFloat(input.value);
    const min = parseFloat(input.getAttribute('min') || '0');
    const max = parseFloat(input.getAttribute('max') || 'Infinity');
    
    if (isNaN(value)) {
      if (errorElement) errorElement.textContent = 'Please enter a valid number';
      return false;
    }
    
    if (value < min) {
      if (errorElement) errorElement.textContent = `Value must be at least ${min}`;
      return false;
    }
    
    if (value > max) {
      if (errorElement) errorElement.textContent = `Value must not exceed ${max}`;
      return false;
    }
  }

  if (input.type === 'text') {
    const minLength = parseInt(input.getAttribute('minlength') || '0');
    const maxLength = parseInt(input.getAttribute('maxlength') || 'Infinity');
    
    if (input.value.length < minLength) {
      if (errorElement) errorElement.textContent = `Minimum ${minLength} characters required`;
      return false;
    }
    
    if (input.value.length > maxLength) {
      if (errorElement) errorElement.textContent = `Maximum ${maxLength} characters allowed`;
      return false;
    }
  }

  if (errorElement) errorElement.textContent = '';
  return true;
}

// =====================================================
// SINGLETON: CONFIG BADGE
// =====================================================

const cfg = Config.getInstance();
const configBadge = $('#configBadge')!;

function renderBadge(): void {
  const currencySymbol = cfg.getCurrency() === 'EUR' ? '€' : '$';
  const localeText = cfg.getLocale() === 'en' ? 'English' : 'Română';
  const deliveryText = cfg.getDelivery() === 'courier' ? 'Courier Delivery' : 'Store Pickup';
  
  configBadge.textContent = `${currencySymbol} ${cfg.getCurrency()} • ${localeText} • ${deliveryText}`;
}

// =====================================================
// BUILDER PATTERN: BOUQUET BUILDER
// =====================================================

const builder = new BouquetBuilder();
let current: Bouquet | null = null;
const itemsList = $('#itemsList')!;
const preview = $('#preview')!;

// =====================================================
// STRUCTURAL PATTERNS: INSTANCES
// =====================================================

// Facade Pattern - Simplifies complex ordering
const orderFacade = new BloomifyOrderFacade();

// Adapter Pattern - Unified notification system
const notificationManager = new NotificationManager();

// Decorator Pattern - Enhanced bouquet component (reserved for future use)
let _enhancedBouquet: IBouquetComponent | null = null;
void _enhancedBouquet; // Reserved for future feature enhancement

interface FlowerLine {
  kind: string;
  color: string;
  price: number;
  qty: number;
}

const builderItems: FlowerLine[] = [];

/**
 * Render the list of added flower lines
 */
function renderItems(): void {
  if (builderItems.length === 0) {
    itemsList.innerHTML = '';
    return;
  }

  itemsList.innerHTML = builderItems
    .map((line, index) => `
      <div class="flower-item">
        <span>
          <strong>${line.qty}×</strong> ${line.color} ${line.kind} 
          <span style="opacity: 0.7">@ ${line.price.toFixed(2)}€</span>
        </span>
        <button class="flower-item-delete" data-index="${index}">🗑️ Remove</button>
      </div>
    `)
    .join('');

  // Add delete handlers
  $$('.flower-item-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt((e.target as HTMLElement).closest('button')!.dataset.index!);
      builderItems.splice(index, 1);
      renderItems();
      showToast('Flower line removed', 'info');
    });
  });
}

/**
 * Build bouquet from form data
 */
function buildFromForm(): void {
  // Validate name
  const nameInput = $('#name') as HTMLInputElement;
  const nameError = $('#nameError');
  if (!validateField(nameInput, nameError)) {
    showToast('Please enter a valid bouquet name', 'error');
    nameInput.focus();
    return;
  }

  // Check if at least one flower line exists
  if (builderItems.length === 0) {
    showToast('Please add at least one flower line', 'warning');
    return;
  }

  try {
    builder.reset();
    builder.setName(nameInput.value.trim());

    // Add all flower lines
    for (const line of builderItems) {
      builder.addFlower(line.kind, line.color, line.price, line.qty);
    }

    // Add wrapping
    const wrapKind = ($('#wrapKind') as HTMLSelectElement).value as "paper" | "satin" | "transparent";
    const wrapColor = ($('#wrapColor') as HTMLInputElement).value.trim();
    builder.addWrapping(wrapKind, wrapColor || 'White');

    // Add ribbon
    const ribbonMat = ($('#ribbonMat') as HTMLSelectElement).value as "silk" | "satin";
    const ribbonColor = ($('#ribbonColor') as HTMLInputElement).value.trim();
    builder.addRibbon(ribbonMat, ribbonColor || 'Red');

    // Add card message
    const cardMessage = ($('#cardMessage') as HTMLInputElement).value.trim();
    builder.addCard(cardMessage);

    // Build the bouquet
    current = builder.build();
    renderPreview();
    showToast('✨ Bouquet built successfully!', 'success');
  } catch (e: any) {
    preview.innerHTML = `<span style="color: var(--error);">❌ Build error: ${e.message}</span>`;
    showToast(e.message, 'error');
  }
}

/**
 * Render the bouquet preview
 */
function renderPreview(): void {
  if (!current) {
    preview.innerHTML = '';
    return;
  }

  const flowerLines = current.items
    .map(it => `<strong>${it.qty}×</strong> ${it.flower.color} ${it.flower.kind}`)
    .join(', ');

  const emoji = current.items.length > 10 ? '💐' : '🌸';
  
  preview.innerHTML = `
    <div style="text-align: center; padding: 10px 0;">
      <div style="font-size: 48px; margin-bottom: 10px;">${emoji}</div>
      <strong style="display: block; font-size: 20px; margin-bottom: 12px;">${current.name}</strong>
      <div style="margin: 12px 0; line-height: 1.8;">
        <div><strong>Flowers:</strong> ${flowerLines}</div>
        <div><strong>Wrapping:</strong> ${current.wrapping.kind} (${current.wrapping.color})</div>
        <div><strong>Ribbon:</strong> ${current.ribbon.material} (${current.ribbon.color})</div>
        ${current.cardMessage ? `<div><strong>Card:</strong> "${current.cardMessage}"</div>` : ''}
      </div>
      <div style="margin-top: 16px; padding-top: 16px; border-top: 2px dashed var(--beige);">
        <strong style="font-size: 18px; color: var(--rose);">💰 ${current.priceLabel()}</strong>
      </div>
    </div>
  `;
}

// =====================================================
// DECORATOR PATTERN: ENHANCE BOUQUET
// =====================================================

/**
 * Apply enhancements to the bouquet using Decorator Pattern
 */
function enhanceBouquet(): void {
  if (!current) {
    showToast('Please build a bouquet first', 'warning');
    return;
  }

  // Start with base component
  let component: IBouquetComponent = new BouquetComponent(current);

  // Apply decorators based on user selections
  const giftBox = ($('#enhanceGiftBox') as HTMLSelectElement)?.value;
  if (giftBox && giftBox !== 'none') {
    component = new GiftBoxDecorator(component, giftBox as any);
  }

  const vase = ($('#enhanceVase') as HTMLSelectElement)?.value;
  if (vase && vase !== 'none') {
    component = new PremiumVaseDecorator(component, vase as any);
  }

  const care = ($('#enhanceCare') as HTMLSelectElement)?.value;
  if (care && care !== 'none') {
    component = new CareInstructionsDecorator(component, care as any);
  }

  const delivery = ($('#enhanceDelivery') as HTMLSelectElement)?.value;
  if (delivery && delivery !== 'none') {
    component = new ExpressDeliveryDecorator(component, delivery as any);
  }

  // Store enhanced bouquet
  _enhancedBouquet = component;

  // Display enhanced details
  const enhancementPreview = $('#enhancementPreview')!;
  const details = component.getDetails();
  const cost = component.getCost();
  
  enhancementPreview.innerHTML = `
    <div style="padding: 15px; background: var(--light-bg); border-radius: 8px;">
      <h4 style="margin: 0 0 10px 0;">✨ Enhanced Bouquet</h4>
      <div style="margin-bottom: 10px; line-height: 1.8; font-size: 14px;">
        ${details.map(d => `<div>• ${d}</div>`).join('')}
      </div>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--rose);">
        <strong style="font-size: 18px; color: var(--rose);">Total: ${cfg.formatPrice(cost)}</strong>
      </div>
    </div>
  `;

  showToast('✨ Enhancements applied successfully!', 'success');
}

// Make function globally accessible for HTML onclick
(window as any).enhanceBouquet = enhanceBouquet;

// =====================================================
// FORM EVENT HANDLERS
// =====================================================

// Add Flower Line
$('#addFlower')!.addEventListener('click', () => {
  const kindInput = $('#flowerKind') as HTMLSelectElement;
  const colorInput = $('#flowerColor') as HTMLSelectElement;
  const qtyInput = $('#flowerQty') as HTMLInputElement;
  const priceInput = $('#flowerPrice') as HTMLInputElement;

  // Validate inputs
  const kindError = $('#flowerKindError');
  const colorError = $('#flowerColorError');
  const qtyError = $('#flowerQtyError');
  const priceError = $('#flowerPriceError');

  let isValid = true;

  if (!kindInput.value) {
    if (kindError) kindError.textContent = 'Please select a flower type';
    isValid = false;
  } else if (kindError) {
    kindError.textContent = '';
  }

  if (!colorInput.value) {
    if (colorError) colorError.textContent = 'Please select a color';
    isValid = false;
  } else if (colorError) {
    colorError.textContent = '';
  }

  isValid = validateField(qtyInput, qtyError) && isValid;
  isValid = validateField(priceInput, priceError) && isValid;

  if (!isValid) {
    showToast('Please fill in all required fields correctly', 'warning');
    return;
  }

  const kind = kindInput.value;
  const color = colorInput.value;
  const qty = parseInt(qtyInput.value, 10);
  const price = parseFloat(priceInput.value);

  builderItems.push({ kind, color, qty, price });
  renderItems();
  showToast(`Added ${qty}× ${color} ${kind}`, 'success');
});

// Clear All Flowers
$('#clearFlowers')!.addEventListener('click', () => {
  if (builderItems.length === 0) {
    showToast('No flowers to clear', 'info');
    return;
  }
  
  if (confirm('Are you sure you want to clear all flower lines?')) {
    builderItems.length = 0;
    renderItems();
    showToast('All flower lines cleared', 'info');
  }
});

// Build Bouquet
$('#buildBtn')!.addEventListener('click', () => {
  buildFromForm();
});

// Real-time validation for name field
$('#name')!.addEventListener('input', (e) => {
  const input = e.target as HTMLInputElement;
  const error = $('#nameError');
  validateField(input, error);
});

// =====================================================
// PROTOTYPE PATTERN: TEMPLATES
// =====================================================

const templates = BouquetTemplate.presets();

$$('#templates .template-card').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = (btn as HTMLButtonElement).dataset.template!;
    const template = templates[key];
    
    if (!template) {
      showToast('Template not found', 'error');
      return;
    }

    // Clone the template (Prototype pattern)
    const cloned = template.clone();
    current = cloned;

    // Populate builderItems from cloned bouquet
    builderItems.length = 0;
    for (const it of cloned.items) {
      builderItems.push({
        kind: it.flower.kind,
        color: it.flower.color,
        price: it.flower.unitPrice,
        qty: it.qty
      });
    }

    // Update form fields
    ($('#name') as HTMLInputElement).value = cloned.name;
    ($('#wrapKind') as HTMLSelectElement).value = cloned.wrapping.kind;
    ($('#wrapColor') as HTMLInputElement).value = cloned.wrapping.color;
    ($('#ribbonMat') as HTMLSelectElement).value = cloned.ribbon.material;
    ($('#ribbonColor') as HTMLInputElement).value = cloned.ribbon.color;
    ($('#cardMessage') as HTMLInputElement).value = cloned.cardMessage;

    renderItems();
    renderPreview();
    showToast(`📋 Template "${cloned.name}" loaded!`, 'success');
    
    // Scroll to preview
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

// =====================================================
// SINGLETON PATTERN: SETTINGS
// =====================================================

// Currency buttons
$$('#settings button[data-currency]').forEach(btn => {
  btn.addEventListener('click', () => {
    const currency = (btn as HTMLButtonElement).dataset.currency as "EUR" | "USD";
    cfg.setCurrency(currency);
    
    // Update active state
    $$('#settings button[data-currency]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    renderBadge();
    if (current) renderPreview(); // Recompute price with new currency
    
    showToast(`Currency changed to ${currency}`, 'success');
  });
});

// Locale buttons
$$('#settings button[data-locale]').forEach(btn => {
  btn.addEventListener('click', () => {
    const locale = (btn as HTMLButtonElement).dataset.locale as "en" | "ro";
    cfg.setLocale(locale);
    
    // Update active state
    $$('#settings button[data-locale]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    renderBadge();
    showToast(`Language changed to ${locale === 'en' ? 'English' : 'Română'}`, 'success');
  });
});

// Delivery buttons
$$('#settings button[data-delivery]').forEach(btn => {
  btn.addEventListener('click', () => {
    const delivery = (btn as HTMLButtonElement).dataset.delivery as "courier" | "pickup";
    cfg.setDelivery(delivery);
    
    // Update active state
    $$('#settings button[data-delivery]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    renderBadge();
    showToast(`Delivery method: ${delivery === 'courier' ? 'Courier' : 'Store Pickup'}`, 'success');
  });
});

// =====================================================
// FACTORY METHOD PATTERN: CHECKOUT
// =====================================================

const payDetails = $('#payDetails')!;
const receipt = $('#receipt')!;
const payments = new SimplePaymentCreator();

/**
 * Render payment details form based on selected method
 */
function renderPayDetails(): void {
  const method = (document.querySelector('input[name="pay"]:checked') as HTMLInputElement)?.value;
  
  if (!method) {
    payDetails.innerHTML = '';
    return;
  }

  if (method === 'card') {
    payDetails.innerHTML = `
      <div class="form-group">
        <label for="cardMask">Card Number</label>
        <input 
          id="cardMask" 
          type="text" 
          placeholder="**** **** **** 4242"
          value="**** **** **** 4242"
          maxlength="19"
        />
      </div>
    `;
  } else if (method === 'crypto') {
    payDetails.innerHTML = `
      <div class="form-group">
        <label for="net">Cryptocurrency Network</label>
        <select id="net">
          <option value="ETH">Ethereum (ETH)</option>
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="TRX">Tron (TRX)</option>
        </select>
      </div>
      <div class="form-group">
        <label for="addr">Wallet Address</label>
        <input 
          id="addr" 
          type="text" 
          placeholder="0xABC...DEF"
          value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
        />
      </div>
    `;
  } else if (method === 'bank') {
    payDetails.innerHTML = `
      <div class="form-group">
        <label for="iban">IBAN</label>
        <input 
          id="iban" 
          type="text" 
          placeholder="MD00 XXXX 0000 0000 0000"
          value="MD24 AG00 0225 1000 1222 4168"
        />
      </div>
    `;
  }
}

// Initial render
renderPayDetails();

// Update payment details when method changes
$$('input[name="pay"]').forEach(radio => {
  radio.addEventListener('change', renderPayDetails);
});

/**
 * Process payment
 */
$('#payBtn')!.addEventListener('click', () => {
  if (!current) {
    showToast('⚠️ Please build a bouquet first', 'warning');
    receipt.innerHTML = '';
    return;
  }

  const amount = current.estimate();
  const method = (document.querySelector('input[name="pay"]:checked') as HTMLInputElement)?.value;

  if (!method) {
    showToast('Please select a payment method', 'error');
    return;
  }

  try {
    let result = '';

    if (method === 'card') {
      const masked = ($('#cardMask') as HTMLInputElement)?.value || '**** **** **** 0000';
      result = payments.checkout(amount, { type: 'card', masked });
    } else if (method === 'crypto') {
      const network = (($('#net') as HTMLSelectElement)?.value || 'ETH') as "ETH" | "BTC" | "TRX";
      const address = ($('#addr') as HTMLInputElement)?.value || '0x...';
      
      if (!address || address.length < 10) {
        showToast('Please enter a valid wallet address', 'error');
        return;
      }
      
      result = payments.checkout(amount, { type: 'crypto', network, address });
    } else if (method === 'bank') {
      const iban = ($('#iban') as HTMLInputElement)?.value || 'MD00...';
      
      if (!iban || iban.length < 15) {
        showToast('Please enter a valid IBAN', 'error');
        return;
      }
      
      result = payments.checkout(amount, { type: 'bank', iban });
    }

    receipt.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
        <strong>Payment Successful!</strong>
        <div style="margin-top: 12px; opacity: 0.9;">${result}</div>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.1);">
          <strong>Order Summary:</strong><br/>
          ${current.name} - ${current.priceLabel()}
        </div>
      </div>
    `;
    
    showToast('💳 Payment processed successfully!', 'success');
    
    // Scroll to receipt
    receipt.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e: any) {
    receipt.innerHTML = `<span style="color: var(--error);">❌ Payment error: ${e.message}</span>`;
    showToast('Payment failed: ' + e.message, 'error');
  }
});

// =====================================================
// ADAPTER PATTERN: NOTIFICATION UI
// =====================================================

const notificationResult = $('#notificationResult')!;

/**
 * Update recipient placeholder based on selected service
 */
function updateNotificationPlaceholder(): void {
  const service = ($('#notifyService') as HTMLSelectElement).value;
  const recipientInput = $('#notifyRecipient') as HTMLInputElement;
  
  if (service === 'email') {
    recipientInput.placeholder = 'customer@example.com';
    if (!recipientInput.value || recipientInput.value.includes('+') || recipientInput.value.length > 50) {
      recipientInput.value = 'customer@example.com';
    }
  } else if (service === 'sms') {
    recipientInput.placeholder = '+37368123456';
    if (!recipientInput.value || recipientInput.value.includes('@') || recipientInput.value.length > 30) {
      recipientInput.value = '+37368123456';
    }
  } else if (service === 'push') {
    recipientInput.placeholder = 'device-token-abc123...';
    if (!recipientInput.value || recipientInput.value.includes('@') || recipientInput.value.includes('+')) {
      recipientInput.value = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
    }
  }
}

// Update placeholder on service change
$('#notifyService')!.addEventListener('change', updateNotificationPlaceholder);

/**
 * Send a single notification
 */
$('#sendNotificationBtn')!.addEventListener('click', () => {
  const recipient = ($('#notifyRecipient') as HTMLInputElement).value.trim();
  const subject = ($('#notifySubject') as HTMLInputElement).value.trim();
  const message = ($('#notifyMessage') as HTMLTextAreaElement).value.trim();
  const service = ($('#notifyService') as HTMLSelectElement).value as 'email' | 'sms' | 'push';
  const priority = ($('#notifyPriority') as HTMLSelectElement).value as 'low' | 'normal' | 'high';

  if (!recipient || !subject || !message) {
    showToast('⚠️ Please fill in all notification fields', 'warning');
    return;
  }

  try {
    const result = notificationManager.sendNotification(service, {
      recipient,
      subject,
      message,
      priority
    });

    const serviceEmoji = service === 'email' ? '📧' : service === 'sms' ? '📱' : '🔔';
    const serviceName = service === 'email' ? 'Email' : service === 'sms' ? 'SMS' : 'Push';

    if (result.success) {
      notificationResult.innerHTML = `
        <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">${serviceEmoji}</div>
          <strong style="display: block; font-size: 18px; margin-bottom: 8px;">Notification Sent Successfully!</strong>
          <div style="opacity: 0.9; line-height: 1.6;">
            <div><strong>Service:</strong> ${serviceName}</div>
            <div><strong>Message ID:</strong> ${result.messageId}</div>
            <div><strong>Timestamp:</strong> ${result.timestamp.toLocaleString()}</div>
            <div><strong>Priority:</strong> ${priority.toUpperCase()}</div>
          </div>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.3);">
            <div style="font-size: 14px; opacity: 0.8;">
              <strong>To:</strong> ${recipient.length > 40 ? recipient.substring(0, 40) + '...' : recipient}
            </div>
          </div>
        </div>
      `;

      showToast(`${serviceEmoji} ${serviceName} notification sent!`, 'success');
      console.log(`✓ Notification sent via ${serviceName}:`, result);
    } else {
      notificationResult.innerHTML = `
        <div style="padding: 20px; background: var(--error); color: white; border-radius: 12px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
          <strong>Notification Failed</strong>
          <div style="margin-top: 8px; opacity: 0.9;">${result.error || 'Unknown error'}</div>
        </div>
      `;
      showToast('❌ Notification failed', 'error');
    }
  } catch (e: any) {
    notificationResult.innerHTML = `
      <div style="padding: 20px; background: var(--error); color: white; border-radius: 12px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
        <strong>Error</strong>
        <div style="margin-top: 8px; opacity: 0.9;">${e.message}</div>
      </div>
    `;
    showToast('Error: ' + e.message, 'error');
  }
});

/**
 * Broadcast notification to all services
 */
$('#sendAllNotificationsBtn')!.addEventListener('click', () => {
  const subject = ($('#notifySubject') as HTMLInputElement).value.trim();
  const message = ($('#notifyMessage') as HTMLTextAreaElement).value.trim();
  const priority = ($('#notifyPriority') as HTMLSelectElement).value as 'low' | 'normal' | 'high';

  if (!subject || !message) {
    showToast('⚠️ Please fill in subject and message', 'warning');
    return;
  }

  try {
    // Send to all three services with appropriate recipients
    const results = notificationManager.broadcast({
      recipient: 'broadcast@all-services',
      subject,
      message,
      priority
    });

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    let resultHTML = `
      <div style="padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 48px; margin-bottom: 10px;">📢</div>
          <strong style="display: block; font-size: 18px;">Broadcast Sent!</strong>
          <div style="opacity: 0.9; margin-top: 8px;">${successCount} of ${totalCount} services successful</div>
        </div>
        <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px;">
    `;

    results.forEach(result => {
      const emoji = result.service.includes('Email') ? '📧' :
                    result.service.includes('SMS') ? '📱' : '🔔';
      const status = result.success ? '✅' : '❌';
      
      resultHTML += `
        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.2); display: flex; justify-content: space-between; align-items: center;">
          <span>${emoji} ${result.service}</span>
          <span style="font-size: 12px;">${status} ${result.success ? result.messageId : 'Failed'}</span>
        </div>
      `;
    });

    resultHTML += `
        </div>
      </div>
    `;

    notificationResult.innerHTML = resultHTML;
    showToast(`📢 Broadcast sent to ${successCount} service${successCount !== 1 ? 's' : ''}!`, 'success');
    console.log('✓ Broadcast results:', results);
  } catch (e: any) {
    notificationResult.innerHTML = `
      <div style="padding: 20px; background: var(--error); color: white; border-radius: 12px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
        <strong>Broadcast Failed</strong>
        <div style="margin-top: 8px; opacity: 0.9;">${e.message}</div>
      </div>
    `;
    showToast('Error: ' + e.message, 'error');
  }
});

// Initialize notification placeholder
updateNotificationPlaceholder();

// =====================================================
// FACADE PATTERN: QUICK ORDER DEMO
// =====================================================

/**
 * Demonstrate Facade Pattern with a quick order
 */
(window as any).demoQuickOrder = function() {
  console.log('\n=== FACADE PATTERN DEMO: Quick Order ===');
  
  const result = orderFacade.quickOrder(
    "Sunset Surprise",
    [
      { kind: "Rose", color: "Red", price: 3.5, qty: 12 },
      { kind: "Lily", color: "White", price: 4.0, qty: 6 }
    ],
    "card"
  );

  if (result.success) {
    console.log('✓ Order placed successfully!');
    console.log(`  Order ID: ${result.orderId}`);
    console.log(`  Total: ${result.formattedPrice}`);
    console.log(`  Description: ${result.bouquet.getDescription()}`);
    showToast(`Facade Demo: ${result.message}`, 'success');
  }
};

/**
 * Demonstrate Facade Pattern with a premium order
 */
(window as any).demoPremiumOrder = function() {
  console.log('\n=== FACADE PATTERN DEMO: Premium Order ===');
  
  const result = orderFacade.premiumOrder(
    "Luxury Collection",
    [
      { kind: "Orchid", color: "Purple", price: 6.0, qty: 8 },
      { kind: "Peony", color: "Pink", price: 5.5, qty: 10 }
    ],
    "card"
  );

  if (result.success) {
    console.log('✓ Premium order placed successfully!');
    console.log(`  Order ID: ${result.orderId}`);
    console.log(`  Total: ${result.formattedPrice}`);
    console.log('  Enhancements included:');
    result.details.forEach(detail => {
      if (detail.includes('🎁') || detail.includes('🏺') || detail.includes('📋') || detail.includes('🚚')) {
        console.log(`    ${detail}`);
      }
    });
    showToast(`Facade Demo: ${result.message}`, 'success');
  }
};

// =====================================================
// ADAPTER PATTERN: NOTIFICATION DEMO
// =====================================================

/**
 * Demonstrate Adapter Pattern with notifications
 */
(window as any).demoNotifications = function() {
  console.log('\n=== ADAPTER PATTERN DEMO: Notifications ===');
  
  // Email notification
  const emailResult = notificationManager.sendOrderConfirmation(
    "customer@example.com",
    "BLM-001234",
    "Spring Bouquet",
    "€85.00",
    "email"
  );
  console.log(`✓ Email: ${emailResult.success ? 'Sent' : 'Failed'} - ID: ${emailResult.messageId}`);

  // SMS notification
  const smsResult = notificationManager.sendDeliveryNotification(
    "+37368123456",
    "BLM-001234",
    "Today, 2:00 PM",
    "sms"
  );
  console.log(`✓ SMS: ${smsResult.success ? 'Sent' : 'Failed'} - ID: ${smsResult.messageId}`);

  // Push notification
  const pushResult = notificationManager.sendNotification("push", {
    recipient: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    subject: "Order Ready!",
    message: "Your bouquet is ready for pickup at our store.",
    priority: "high"
  });
  console.log(`✓ Push: ${pushResult.success ? 'Sent' : 'Failed'} - ID: ${pushResult.messageId}`);

  showToast('Adapter Demo: Notifications sent via Email, SMS, and Push', 'success');
};

// =====================================================
// INITIALIZATION
// =====================================================

renderBadge();
renderPreview();
renderItems();

// Welcome message
showToast('🌸 Welcome to Bloomify! Start by adding flowers or choose a template.', 'info');

console.log('🌸 Bloomify initialized successfully!');
console.log('');
console.log('=== CREATIONAL DESIGN PATTERNS ===');
console.log('✓ Builder Pattern - Bouquet construction');
console.log('✓ Prototype Pattern - Template cloning');
console.log('✓ Singleton Pattern - Global config');
console.log('✓ Factory Method Pattern - Payment processing');
console.log('');
console.log('=== STRUCTURAL DESIGN PATTERNS ===');
console.log('✓ Decorator Pattern - Bouquet enhancements (gift box, vase, care instructions, express delivery)');
console.log('✓ Facade Pattern - Simplified order processing');
console.log('✓ Adapter Pattern - Unified notification system (Email, SMS, Push)');
console.log('');
console.log('=== DEMO COMMANDS ===');
console.log('Run these in the console to see the patterns in action:');
console.log('  demoQuickOrder()    - Facade: Simple order');
console.log('  demoPremiumOrder()  - Facade: Premium order with all enhancements');
console.log('  demoNotifications() - Adapter: Send notifications via Email, SMS, Push');
// ========================================================================
// BEHAVIORAL PATTERNS DEMO BUTTONS (LAB 3)
// ========================================================================

// Wait for DOM to be fully loaded before attaching button handlers
document.addEventListener('DOMContentLoaded', () => {
  console.log('');
  console.log('=== BEHAVIORAL DESIGN PATTERNS (LAB 3) ===');
  console.log('✓ Observer Pattern - Order status notifications');
  console.log('✓ Strategy Pattern - Delivery method selection');
  console.log('');
  console.log('=== BEHAVIORAL DEMO COMMANDS ===');
  console.log('Click the demo buttons or run these in the console:');
  console.log('  demoObserverPattern() - Observer: Order lifecycle notifications');
  console.log('  demoStrategyPattern() - Strategy: Delivery cost comparison');
  console.log('  demoBothPatterns()    - Combined: Both patterns working together');
  console.log('');

  const demoObserverBtn = document.getElementById('demoObserver');
  const demoStrategyBtn = document.getElementById('demoStrategy');
  const demoBothBtn = document.getElementById('demoBoth');

  if (demoObserverBtn) {
    demoObserverBtn.addEventListener('click', () => {
      console.clear(); // Clear console for clean output
      demoObserverPattern();
    });
  }

  if (demoStrategyBtn) {
    demoStrategyBtn.addEventListener('click', () => {
      console.clear(); // Clear console for clean output
      demoStrategyPattern();
    });
  }

  if (demoBothBtn) {
    demoBothBtn.addEventListener('click', () => {
      console.clear(); // Clear console for clean output
      demoBothPatterns();
    });
  }
});

// Make functions globally accessible for console testing
(window as any).demoObserverPattern = demoObserverPattern;
(window as any).demoStrategyPattern = demoStrategyPattern;
(window as any).demoBothPatterns = demoBothPatterns;

// =============================================================================
// BEHAVIORAL PATTERNS DEMO FUNCTIONS (LAB 3)
// =============================================================================

/**
 * Demo function for Observer Pattern
 * Shows how order status changes notify multiple observers
 */
function demoObserverPattern(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🎯 OBSERVER PATTERN DEMONSTRATION - LAB 3");
  console.log("=".repeat(70));
  console.log("Purpose: Demonstrate how multiple observers react to order status changes");
  console.log("Observers: Customer, Inventory, Delivery Service\n");

  // Create order data
  const orderData: OrderData = {
    orderId: `ORD-${Date.now()}`,
    bouquetName: "Valentine Special",
    customerName: "John Doe",
    totalPrice: 75.50,
    status: "pending" as OrderState,
    timestamp: new Date()
  };

  console.log(`📦 Creating order: ${orderData.orderId}`);
  console.log(`   Bouquet: ${orderData.bouquetName}`);
  console.log(`   Customer: ${orderData.customerName}`);
  console.log(`   Total: $${orderData.totalPrice.toFixed(2)}\n`);

  // Create subject (the order being tracked)
  const order = new OrderSubject(orderData);

  // Create observers (parties interested in order updates)
  const customerObserver = new CustomerObserver();
  const inventoryObserver = new InventoryObserver();
  const deliveryObserver = new DeliveryObserver();

  // Attach observers to subject
  console.log("👥 Attaching observers...");
  order.attach(customerObserver);
  order.attach(inventoryObserver);
  order.attach(deliveryObserver);

  // Simulate order lifecycle with delays
  console.log("\n🔄 Starting order lifecycle simulation...\n");

  setTimeout(() => {
    order.updateStatus("confirmed");
  }, 1000);

  setTimeout(() => {
    order.updateStatus("preparing");
  }, 3000);

  setTimeout(() => {
    order.updateStatus("ready");
  }, 5000);

  setTimeout(() => {
    order.updateStatus("out_for_delivery");
  }, 7000);

  setTimeout(() => {
    order.updateStatus("delivered");
    console.log("\n" + "=".repeat(70));
    console.log("✅ Observer Pattern Demo Complete!");
    console.log("=".repeat(70) + "\n");
  }, 9000);

  // Show toast notification
  showToast("Observer Pattern demo started! Check console for detailed output.", "info");
}

/**
 * Demo function for Strategy Pattern
 * Shows how different delivery strategies calculate costs differently
 */
function demoStrategyPattern(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🎯 STRATEGY PATTERN DEMONSTRATION - LAB 3");
  console.log("=".repeat(70));
  console.log("Purpose: Compare different delivery strategies and their costs");
  console.log("Strategies: Standard, Express, Same-Day, Store Pickup\n");

  // Test parameters
  const distance = 12; // km
  const orderValue = 75.00; // $

  console.log(`📊 Test Parameters:`);
  console.log(`   Distance: ${distance} km`);
  console.log(`   Order Value: $${orderValue.toFixed(2)}\n`);

  // Create all strategy instances
  const standardStrategy = new StandardDeliveryStrategy();
  const expressStrategy = new ExpressDeliveryStrategy();
  const sameDayStrategy = new SameDayDeliveryStrategy();
  const pickupStrategy = new PickupStrategy();

  console.log("=" .repeat(70));
  console.log("STRATEGY COMPARISON");
  console.log("=".repeat(70) + "\n");

  // Compare all strategies
  DeliveryContext.compareStrategies(
    [standardStrategy, expressStrategy, sameDayStrategy, pickupStrategy],
    distance,
    orderValue
  );

  console.log("=" .repeat(70));
  console.log("DYNAMIC STRATEGY SWITCHING");
  console.log("=".repeat(70) + "\n");

  // Demonstrate dynamic strategy switching with context
  const deliveryContext = new DeliveryContext(standardStrategy);
  
  console.log("1️⃣ Using Standard Delivery:");
  deliveryContext.calculateDeliveryCost(distance, orderValue);
  deliveryContext.getDeliveryDetails(distance, orderValue);
  
  console.log("\n2️⃣ Switching to Express Delivery:");
  deliveryContext.setStrategy(expressStrategy);
  deliveryContext.calculateDeliveryCost(distance, orderValue);
  
  console.log("\n3️⃣ Switching to Same-Day Delivery:");
  deliveryContext.setStrategy(sameDayStrategy);
  try {
    deliveryContext.calculateDeliveryCost(distance, orderValue);
  } catch (error) {
    console.error(`   ❌ ${(error as Error).message}`);
  }
  
  console.log("\n4️⃣ Switching to Store Pickup:");
  deliveryContext.setStrategy(pickupStrategy);
  deliveryContext.calculateDeliveryCost(distance, orderValue);

  console.log("\n" + "=".repeat(70));
  console.log("✅ Strategy Pattern Demo Complete!");
  console.log("=".repeat(70));
  console.log("\n💡 Key Takeaway: Strategy pattern allows runtime algorithm selection");
  console.log("   without changing client code. Each strategy encapsulates a");
  console.log("   different delivery calculation algorithm.\n");

  // Show toast notification
  showToast("Strategy Pattern demo complete! Check console for detailed comparison.", "success");
}

/**
 * Demo both patterns together
 * Shows how behavioral patterns can work together in a system
 */
function demoBothPatterns(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🎯 COMBINED PATTERNS DEMONSTRATION - LAB 3");
  console.log("=".repeat(70));
  console.log("Purpose: Show Observer and Strategy patterns working together\n");

  // Create order with delivery strategy
  const orderData: OrderData = {
    orderId: `ORD-${Date.now()}`,
    bouquetName: "Spring Dream",
    customerName: "Jane Smith",
    totalPrice: 120.00,
    status: "pending" as OrderState,
    timestamp: new Date()
  };

  console.log(`📦 Creating order with combined patterns...`);
  console.log(`   Order ID: ${orderData.orderId}`);
  console.log(`   Bouquet: ${orderData.bouquetName}`);
  console.log(`   Total: $${orderData.totalPrice.toFixed(2)}\n`);

  // Strategy Pattern: Select delivery method
  console.log("🚚 Step 1: Select Delivery Strategy");
  const deliveryStrategy = new ExpressDeliveryStrategy();
  const deliveryContext = new DeliveryContext(deliveryStrategy);
  const deliveryDetails = deliveryContext.getDeliveryDetails(10, orderData.totalPrice);
  
  console.log(`   Selected: ${deliveryStrategy.getName()}`);
  console.log(`   Cost: $${deliveryDetails.cost}`);
  console.log(`   Time: ${deliveryDetails.estimatedTime}\n`);

  // Observer Pattern: Track order status
  console.log("👥 Step 2: Attach Observers");
  const order = new OrderSubject(orderData);
  order.attach(new CustomerObserver());
  order.attach(new InventoryObserver());
  order.attach(new DeliveryObserver());

  console.log("\n🔄 Step 3: Process Order Lifecycle");
  setTimeout(() => order.updateStatus("confirmed"), 1000);
  setTimeout(() => order.updateStatus("preparing"), 2500);
  setTimeout(() => order.updateStatus("ready"), 4000);
  setTimeout(() => order.updateStatus("out_for_delivery"), 5500);
  setTimeout(() => {
    order.updateStatus("delivered");
    console.log("\n" + "=".repeat(70));
    console.log("✅ Combined Patterns Demo Complete!");
    console.log("=".repeat(70));
    console.log("\n💡 Patterns worked together:");
    console.log("   • Strategy selected optimal delivery method");
    console.log("   • Observer notified all parties of status changes");
    console.log("   • Both patterns remained decoupled and reusable\n");
  }, 7000);

  showToast("Combined patterns demo started! Watch the console.", "info");
}
/**
 * Demo function for Command Pattern
 * Shows how commands encapsulate operations and support undo/redo
 */
function demoCommandPattern(): void {
  console.log("\n" + "=".repeat(70));
  console.log("🎯 COMMAND PATTERN DEMONSTRATION - LAB 3");
  console.log("=".repeat(70));
  console.log("Purpose: Demonstrate command encapsulation with undo/redo support");
  console.log("Commands: PlaceOrder, CancelOrder, ModifyOrder\n");

  // Create the receiver (OrderManager)
  const orderManager = new OrderManager();

  // Create the invoker (OrderInvoker)
  const invoker = new OrderInvoker();

  console.log("=" .repeat(70));
  console.log("STEP 1: CREATING AND EXECUTING COMMANDS");
  console.log("=".repeat(70) + "\n");

  // Command 1: Place an order
  if (!current) {
    // Create a sample bouquet if none exists
    builder.reset();
    builder.setName("Command Demo Bouquet");
    builder.addFlower("Rose", "Red", 3.5, 10);
    builder.addWrapping("satin", "Pink");
    builder.addRibbon("silk", "Red");
    builder.addCard("Command Pattern Demo");
    current = builder.build();
  }

  console.log("1️⃣ Placing an order...");
  const placeCmd1 = new PlaceOrderCommand(
    orderManager,
    current,
    "Alice Johnson",
    "alice@example.com"
  );
  let result = invoker.executeCommand(placeCmd1);
  console.log(`   ✓ ${result}\n`);

  // Command 2: Place another order
  console.log("2️⃣ Placing a second order...");
  const placeCmd2 = new PlaceOrderCommand(
    orderManager,
    current.clone(),
    "Bob Smith",
    "bob@example.com"
  );
  result = invoker.executeCommand(placeCmd2);
  console.log(`   ✓ ${result}\n`);

  // Command 3: Modify first order status
  const firstOrder = placeCmd1.getExecutedOrder();
  if (firstOrder) {
    console.log("3️⃣ Modifying first order status to 'preparing'...");
    const modifyCmd = new ModifyOrderCommand(
      orderManager,
      firstOrder.orderId,
      "preparing"
    );
    result = invoker.executeCommand(modifyCmd);
    console.log(`   ✓ ${result}\n`);
  }

  // Command 4: Cancel second order
  const secondOrder = placeCmd2.getExecutedOrder();
  if (secondOrder) {
    console.log("4️⃣ Cancelling second order...");
    const cancelCmd = new CancelOrderCommand(
      orderManager,
      secondOrder.orderId
    );
    result = invoker.executeCommand(cancelCmd);
    console.log(`   ✓ ${result}\n`);
  }

  console.log("=" .repeat(70));
  console.log("STEP 2: COMMAND HISTORY");
  console.log("=".repeat(70));
  console.log(invoker.displayHistory());

  console.log("=" .repeat(70));
  console.log("STEP 3: UNDO/REDO DEMONSTRATION");
  console.log("=".repeat(70) + "\n");

  // Undo last command (cancel)
  console.log("⏪ Undoing last command...");
  result = invoker.undo();
  console.log(`   ${result}\n`);

  // Undo again (modify)
  console.log("⏪ Undoing again...");
  result = invoker.undo();
  console.log(`   ${result}\n`);

  // Show updated history
  console.log(invoker.displayHistory());

  // Redo
  console.log("⏩ Redoing last undone command...");
  result = invoker.redo();
  console.log(`   ${result}\n`);

  // Show final history
  console.log(invoker.displayHistory());

  console.log("=" .repeat(70));
  console.log("STEP 4: ORDER MANAGER STATISTICS");
  console.log("=".repeat(70) + "\n");

  const allOrders = orderManager.getAllOrders();
  console.log(`Total Orders: ${orderManager.getOrderCount()}`);
  console.log(`Total Revenue: €${orderManager.getTotalRevenue().toFixed(2)}`);
  console.log("\nOrder Details:");
  allOrders.forEach((order: StoredOrder) => {
    console.log(`  • ${order.orderId} - ${order.bouquet.name} - ${order.status} - €${order.totalPrice.toFixed(2)}`);
  });

  console.log("\n" + "=".repeat(70));
  console.log("✅ Command Pattern Demo Complete!");
  console.log("=".repeat(70));
  console.log("\n💡 Key Takeaways:");
  console.log("   • Commands encapsulate operations as objects");
  console.log("   • Invoker manages command execution and history");
  console.log("   • Undo/Redo support is built into the pattern");
  console.log("   • Commands can be queued, logged, and replayed");
  console.log("   • Decouples the requester from the performer\n");

  showToast("Command Pattern demo complete! Check console for undo/redo operations.", "success");
}
// ========================================================================
// BEHAVIORAL PATTERNS DEMO BUTTONS - EVENT LISTENERS (LAB 3)
// ========================================================================

// Wait for DOM to be ready before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('');
  console.log('=== BEHAVIORAL DESIGN PATTERNS (LAB 3) ===');
  console.log('✓ Observer Pattern - Order status notifications');
  console.log('✓ Strategy Pattern - Delivery method selection');
  console.log('✓ Command Pattern - Order operations with undo/redo');
  console.log('');
  console.log('=== BEHAVIORAL DEMO COMMANDS ===');
  console.log('Click the demo buttons or run these in the console:');
  console.log('  demoObserverPattern() - Observer: Order lifecycle notifications');
  console.log('  demoStrategyPattern() - Strategy: Delivery cost comparison');
  console.log('  demoCommandPattern()  - Command: Order operations with undo/redo');
  console.log('  demoBothPatterns()    - Combined: All patterns working together');
  console.log('');

  const demoObserverBtn = document.getElementById('demoObserver');
  const demoStrategyBtn = document.getElementById('demoStrategy');
  const demoCommandBtn = document.getElementById('demoCommand');
  const demoBothBtn = document.getElementById('demoBoth');

  if (demoObserverBtn) {
    demoObserverBtn.addEventListener('click', () => {
      console.clear();
      demoObserverPattern();
    });
  }

  if (demoStrategyBtn) {
    demoStrategyBtn.addEventListener('click', () => {
      console.clear();
      demoStrategyPattern();
    });
  }

  if (demoCommandBtn) {
    demoCommandBtn.addEventListener('click', () => {
      console.clear();
      demoCommandPattern();
    });
  }

  if (demoBothBtn) {
    demoBothBtn.addEventListener('click', () => {
      console.clear();
      demoBothPatterns();
    });
  }
});

// Make functions globally accessible for console testing
(window as any).demoObserverPattern = demoObserverPattern;
(window as any).demoStrategyPattern = demoStrategyPattern;
(window as any).demoCommandPattern = demoCommandPattern;
(window as any).demoBothPatterns = demoBothPatterns;