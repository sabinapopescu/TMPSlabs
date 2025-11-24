import { Config } from "../domain/Config.js";
import { BouquetBuilder } from "../domain/BouquetBuilder.js";
import { BouquetTemplate } from "../domain/BouquetPrototype.js";
import { SimplePaymentCreator } from "../factory/PaymentFactory.js";
// =====================================================
// UTILITY FUNCTIONS
// =====================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
/**
 * Display a toast notification
 */
function showToast(message, type = 'info') {
    const toast = $('#toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
/**
 * Validate a form field
 */
function validateField(input, errorElement) {
    if (!input.value.trim()) {
        if (errorElement)
            errorElement.textContent = 'This field is required';
        return false;
    }
    // Specific validations
    if (input.type === 'number') {
        const value = parseFloat(input.value);
        const min = parseFloat(input.getAttribute('min') || '0');
        const max = parseFloat(input.getAttribute('max') || 'Infinity');
        if (isNaN(value)) {
            if (errorElement)
                errorElement.textContent = 'Please enter a valid number';
            return false;
        }
        if (value < min) {
            if (errorElement)
                errorElement.textContent = `Value must be at least ${min}`;
            return false;
        }
        if (value > max) {
            if (errorElement)
                errorElement.textContent = `Value must not exceed ${max}`;
            return false;
        }
    }
    if (input.type === 'text') {
        const minLength = parseInt(input.getAttribute('minlength') || '0');
        const maxLength = parseInt(input.getAttribute('maxlength') || 'Infinity');
        if (input.value.length < minLength) {
            if (errorElement)
                errorElement.textContent = `Minimum ${minLength} characters required`;
            return false;
        }
        if (input.value.length > maxLength) {
            if (errorElement)
                errorElement.textContent = `Maximum ${maxLength} characters allowed`;
            return false;
        }
    }
    if (errorElement)
        errorElement.textContent = '';
    return true;
}
// =====================================================
// SINGLETON: CONFIG BADGE
// =====================================================
const cfg = Config.getInstance();
const configBadge = $('#configBadge');
function renderBadge() {
    const currencySymbol = cfg.getCurrency() === 'EUR' ? '€' : '$';
    const localeText = cfg.getLocale() === 'en' ? 'English' : 'Română';
    const deliveryText = cfg.getDelivery() === 'courier' ? 'Courier Delivery' : 'Store Pickup';
    configBadge.textContent = `${currencySymbol} ${cfg.getCurrency()} • ${localeText} • ${deliveryText}`;
}
// =====================================================
// BUILDER PATTERN: BOUQUET BUILDER
// =====================================================
const builder = new BouquetBuilder();
let current = null;
const itemsList = $('#itemsList');
const preview = $('#preview');
const builderItems = [];
/**
 * Render the list of added flower lines
 */
function renderItems() {
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
            const index = parseInt(e.target.closest('button').dataset.index);
            builderItems.splice(index, 1);
            renderItems();
            showToast('Flower line removed', 'info');
        });
    });
}
/**
 * Build bouquet from form data
 */
function buildFromForm() {
    // Validate name
    const nameInput = $('#name');
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
        const wrapKind = $('#wrapKind').value;
        const wrapColor = $('#wrapColor').value.trim();
        builder.addWrapping(wrapKind, wrapColor || 'White');
        // Add ribbon
        const ribbonMat = $('#ribbonMat').value;
        const ribbonColor = $('#ribbonColor').value.trim();
        builder.addRibbon(ribbonMat, ribbonColor || 'Red');
        // Add card message
        const cardMessage = $('#cardMessage').value.trim();
        builder.addCard(cardMessage);
        // Build the bouquet
        current = builder.build();
        renderPreview();
        showToast('✨ Bouquet built successfully!', 'success');
    }
    catch (e) {
        preview.innerHTML = `<span style="color: var(--error);">❌ Build error: ${e.message}</span>`;
        showToast(e.message, 'error');
    }
}
/**
 * Render the bouquet preview
 */
function renderPreview() {
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
// FORM EVENT HANDLERS
// =====================================================
// Add Flower Line
$('#addFlower').addEventListener('click', () => {
    const kindInput = $('#flowerKind');
    const colorInput = $('#flowerColor');
    const qtyInput = $('#flowerQty');
    const priceInput = $('#flowerPrice');
    // Validate inputs
    const kindError = $('#flowerKindError');
    const colorError = $('#flowerColorError');
    const qtyError = $('#flowerQtyError');
    const priceError = $('#flowerPriceError');
    let isValid = true;
    if (!kindInput.value) {
        if (kindError)
            kindError.textContent = 'Please select a flower type';
        isValid = false;
    }
    else if (kindError) {
        kindError.textContent = '';
    }
    if (!colorInput.value) {
        if (colorError)
            colorError.textContent = 'Please select a color';
        isValid = false;
    }
    else if (colorError) {
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
$('#clearFlowers').addEventListener('click', () => {
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
$('#buildBtn').addEventListener('click', () => {
    buildFromForm();
});
// Real-time validation for name field
$('#name').addEventListener('input', (e) => {
    const input = e.target;
    const error = $('#nameError');
    validateField(input, error);
});
// =====================================================
// PROTOTYPE PATTERN: TEMPLATES
// =====================================================
const templates = BouquetTemplate.presets();
$$('#templates .template-card').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.template;
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
        $('#name').value = cloned.name;
        $('#wrapKind').value = cloned.wrapping.kind;
        $('#wrapColor').value = cloned.wrapping.color;
        $('#ribbonMat').value = cloned.ribbon.material;
        $('#ribbonColor').value = cloned.ribbon.color;
        $('#cardMessage').value = cloned.cardMessage;
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
        const currency = btn.dataset.currency;
        cfg.setCurrency(currency);
        // Update active state
        $$('#settings button[data-currency]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderBadge();
        if (current)
            renderPreview(); // Recompute price with new currency
        showToast(`Currency changed to ${currency}`, 'success');
    });
});
// Locale buttons
$$('#settings button[data-locale]').forEach(btn => {
    btn.addEventListener('click', () => {
        const locale = btn.dataset.locale;
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
        const delivery = btn.dataset.delivery;
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
const payDetails = $('#payDetails');
const receipt = $('#receipt');
const payments = new SimplePaymentCreator();
/**
 * Render payment details form based on selected method
 */
function renderPayDetails() {
    const method = document.querySelector('input[name="pay"]:checked')?.value;
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
    }
    else if (method === 'crypto') {
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
    }
    else if (method === 'bank') {
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
$('#payBtn').addEventListener('click', () => {
    if (!current) {
        showToast('⚠️ Please build a bouquet first', 'warning');
        receipt.innerHTML = '';
        return;
    }
    const amount = current.estimate();
    const method = document.querySelector('input[name="pay"]:checked')?.value;
    if (!method) {
        showToast('Please select a payment method', 'error');
        return;
    }
    try {
        let result = '';
        if (method === 'card') {
            const masked = $('#cardMask')?.value || '**** **** **** 0000';
            result = payments.checkout(amount, { type: 'card', masked });
        }
        else if (method === 'crypto') {
            const network = ($('#net')?.value || 'ETH');
            const address = $('#addr')?.value || '0x...';
            if (!address || address.length < 10) {
                showToast('Please enter a valid wallet address', 'error');
                return;
            }
            result = payments.checkout(amount, { type: 'crypto', network, address });
        }
        else if (method === 'bank') {
            const iban = $('#iban')?.value || 'MD00...';
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
    }
    catch (e) {
        receipt.innerHTML = `<span style="color: var(--error);">❌ Payment error: ${e.message}</span>`;
        showToast('Payment failed: ' + e.message, 'error');
    }
});
// =====================================================
// INITIALIZATION
// =====================================================
renderBadge();
renderPreview();
renderItems();
// Welcome message
showToast('🌸 Welcome to Bloomify! Start by adding flowers or choose a template.', 'info');
console.log('🌸 Bloomify initialized successfully!');
console.log('Demonstrating Creational Design Patterns:');
console.log('✓ Builder Pattern - Bouquet construction');
console.log('✓ Prototype Pattern - Template cloning');
console.log('✓ Singleton Pattern - Global config');
console.log('✓ Factory Method Pattern - Payment processing');
//# sourceMappingURL=main.js.map