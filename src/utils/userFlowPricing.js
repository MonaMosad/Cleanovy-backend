const ProviderService = require("../models/providerServiceModel");

const VAT_RATE = parseFloat(process.env.VAT_RATE ?? "0");

const DISCOUNT_TIERS = [
  { minQty: 10, rate: 0.20 },
  { minQty: 5,  rate: 0.10 },
];

const round2 = (n) => parseFloat((n || 0).toFixed(2));

function getDiscountRate(totalQty) {
  for (const tier of DISCOUNT_TIERS) {
    if (totalQty >= tier.minQty) return tier.rate;
  }
  return 0;
}

async function resolveLineItem(item) {
  if (!item || !item.quantity || item.quantity <= 0) return null;

  let providerServiceId = null;
  let name      = "خدمة";
  let basePrice = 0;
  let unit      = "per_piece";
  let fastMultiplier = 1;
  let fastAvailable  = false;

  const ps = await ProviderService.findById(item.serviceId)
    .populate("service", "name unit")
    .lean();

  if (ps) {
    providerServiceId = ps._id;
    name           = ps.name || ps.service?.name || "خدمة";
    basePrice      = ps.price || 0;
    unit           = ps.unit || ps.service?.unit || "per_piece";
    fastMultiplier = ps.fast_multiplier || 1;
    fastAvailable  = !!ps.fast_service;
  }

  const isFast    = !!item.fast && fastAvailable;
  const unitPrice = isFast ? round2(basePrice * fastMultiplier) : basePrice;
  const lineTotal = round2(unitPrice * item.quantity);

  return {
    serviceId: item.serviceId,
    providerService: providerServiceId,
    name, unit,
    quantity: item.quantity,
    fast: isFast,
    unitPrice,
    lineTotal,
  };
}

async function priceCart(items, { deliveryFee = 0 } = {}) {
  const lineItems = [];
  let subtotal = 0;
  let totalQty = 0;

  for (const item of items) {
    const line = await resolveLineItem(item);
    if (!line) continue;
    lineItems.push(line);
    subtotal += line.lineTotal;
    totalQty += line.quantity;
  }

  subtotal = round2(subtotal);

  const discountRate = getDiscountRate(totalQty);
  const discount     = round2(subtotal * discountRate);
  const taxable      = round2(subtotal - discount);
  const vat          = round2(taxable * VAT_RATE);
  const total        = round2(taxable + vat + (deliveryFee || 0));

  return {
    lineItems, totalQty, subtotal,
    discountRate, discount, vat,
    vatRate: VAT_RATE,
    deliveryFee: round2(deliveryFee),
    total,
    currency: "EGP",
  };
}

module.exports = { priceCart, getDiscountRate, round2, VAT_RATE, DISCOUNT_TIERS };
