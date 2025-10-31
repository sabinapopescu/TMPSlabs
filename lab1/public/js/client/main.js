import { Config } from "../domain/Config.js";
import { BouquetBuilder } from "../domain/BouquetBuilder.js";
import { BouquetTemplate } from "../domain/BouquetPrototype.js";
import { SimplePaymentCreator } from "../factory/PaymentFactory.js";
// ---- Singleton badge ----
const cfg = Config.getInstance();
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const configBadge = $("#configBadge");
function renderBadge() {
    configBadge.textContent = `Currency: ${cfg.getCurrency()} • Locale: ${cfg.getLocale()} • Delivery: ${cfg.getDelivery()}`;
}
// ---- Builder state ----
const builder = new BouquetBuilder();
let current = null;
const itemsList = $("#itemsList");
const preview = $("#preview");
function renderItems() {
    itemsList.innerHTML = builderItems.map(lineToText).join("<br/>");
}
function lineToText(line) {
    return `+ ${line.qty}× ${line.color} ${line.kind} @ ${line.price.toFixed(2)}`;
}
// store added lines so the user sees them before build()
const builderItems = [];
function buildFromForm() {
    builder.reset();
    builder.setName($("#name").value);
    for (const l of builderItems) {
        builder.addFlower(l.kind, l.color, l.price, l.qty);
    }
    builder
        .addWrapping($("#wrapKind").value, $("#wrapColor").value)
        .addRibbon($("#ribbonMat").value, $("#ribbonColor").value)
        .addCard($("#cardMessage").value);
    current = builder.build();
    renderPreview();
}
function renderPreview() {
    if (!current) {
        preview.textContent = "No bouquet yet.";
        return;
    }
    const lines = current.items
        .map(it => `${it.qty}× ${it.flower.color} ${it.flower.kind}`)
        .join(", ");
    preview.innerHTML = `
    <strong>${current.name}</strong><br/>
    ${lines}<br/>
    Wrapping: ${current.wrapping.kind} ${current.wrapping.color} • Ribbon: ${current.ribbon.material} ${current.ribbon.color}<br/>
    Card: "${current.cardMessage}"<br/>
    <b>Estimate:</b> ${current.priceLabel()}
  `;
}
// ---- Form events ----
$("#addFlower").addEventListener("click", () => {
    const kind = $("#flowerKind").value;
    const color = $("#flowerColor").value;
    const qty = parseInt($("#flowerQty").value, 10) || 1;
    const price = parseFloat($("#flowerPrice").value) || 1;
    builderItems.push({ kind, color, qty, price });
    renderItems();
});
$("#buildBtn").addEventListener("click", () => {
    try {
        buildFromForm();
    }
    catch (e) {
        preview.textContent = `Build error: ${e.message}`;
    }
});
// ---- Templates (Prototype) ----
const templates = BouquetTemplate.presets();
$$("#templates .ghost").forEach(btn => {
    btn.addEventListener("click", () => {
        const key = btn.dataset.template;
        const cloned = templates[key].clone(); // Prototype clone
        current = cloned;
        // hydrate “builderItems” from cloned bouquet so user can continue editing via Builder later if desired
        builderItems.length = 0;
        for (const it of cloned.items) {
            builderItems.push({ kind: it.flower.kind, color: it.flower.color, price: it.flower.unitPrice, qty: it.qty });
        }
        renderItems();
        renderPreview();
    });
});
// ---- Settings (Singleton) ----
$$('#settings button[data-currency]').forEach(btn => {
    btn.addEventListener("click", () => {
        cfg.setCurrency(btn.dataset.currency);
        renderBadge();
        if (current)
            renderPreview(); // recompute label with new currency
    });
});
// ---- Checkout (Factory Method) ----
const payDetails = $("#payDetails");
const receipt = $("#receipt");
const payments = new SimplePaymentCreator();
function renderPayDetails() {
    const method = document.querySelector('input[name="pay"]:checked').value;
    if (method === "card") {
        payDetails.innerHTML = `Mask: <input id="cardMask" value="**** **** **** 4242"/>`;
    }
    else if (method === "crypto") {
        payDetails.innerHTML = `Network: <select id="net"><option>ETH</option><option>BTC</option><option>TRX</option></select>
      Address: <input id="addr" value="0xABC...DEF"/>`;
    }
    else {
        payDetails.innerHTML = `IBAN: <input id="iban" value="MD00 XXXX 0000 0000 0000"/>`;
    }
}
renderPayDetails();
$$('input[name="pay"]').forEach(r => r.addEventListener("change", renderPayDetails));
$("#payBtn").addEventListener("click", () => {
    if (!current) {
        receipt.textContent = "Build a bouquet first.";
        return;
    }
    const amount = current.estimate();
    const method = document.querySelector('input[name="pay"]:checked').value;
    let out = "";
    if (method === "card") {
        const masked = document.getElementById("cardMask").value || "**** **** **** 0000";
        out = payments.checkout(amount, { type: "card", masked });
    }
    else if (method === "crypto") {
        const network = (document.getElementById("net").value || "ETH");
        const address = document.getElementById("addr").value || "0x...";
        out = payments.checkout(amount, { type: "crypto", network, address });
    }
    else {
        const iban = document.getElementById("iban").value || "MD00...";
        out = payments.checkout(amount, { type: "bank", iban });
    }
    receipt.textContent = out;
});
// ---- Boot
renderBadge();
renderPreview();
