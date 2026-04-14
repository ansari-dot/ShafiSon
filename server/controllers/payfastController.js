import Coupon from "../models/Coupon.js";
import DealSection from "../models/DealSection.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { buildSignatureString, generateSignature } from "../services/payfast.js";

const PAYFAST_URL = process.env.PAYFAST_URL || "https://sandbox.payfast.co.za/eng/process";

function makeOrderCode() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SHF-${stamp}-${rand}`;
}

function isDealActive(deal) {
  if (!deal) return false;
  if (deal.discountType === "none") return false;
  if (typeof deal.discountValue !== "number" || deal.discountValue <= 0) return false;
  if (!deal.endsAt) return false;
  const end = new Date(deal.endsAt).getTime();
  if (Number.isNaN(end) || end <= Date.now()) return false;
  return true;
}

function getDealPrice(price, deal) {
  const base = Number(price || 0);
  if (!isDealActive(deal)) return base;
  if (deal.discountType === "amount") return Math.max(0, base - deal.discountValue);
  return Math.max(0, Math.round(base * (1 - deal.discountValue / 100)));
}

export async function initPayfast(req, res) {
  try {
    const { cartItems = [], customer = {}, couponCode = "" } = req.body || {};
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const productIds = cartItems.map((c) => c.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((p) => [String(p._id), p]));
    const deal = await DealSection.findOne().lean();

    const items = cartItems.map((c) => {
      const prod = productMap.get(String(c.productId));
      const basePrice = prod?.price || c.unitPrice || 0;
      const isDeal = !!prod?.isDeal && isDealActive(deal);
      const unitPrice = isDeal ? getDealPrice(basePrice, deal) : Number(basePrice || 0);
      return {
        productId: prod?._id || c.productId,
        title: prod?.title || c.title || "Item",
        qty: Number(c.qty || 1),
        unitPrice,
        originalPrice: Number(basePrice || 0),
        priceUnit: prod?.priceUnit || c.priceUnit || 'per yard',
        isDeal,
        size: c.size || '',
        color: c.color || '',
        colorHex: c.colorHex || '',
        sku: prod?.sku || c.sku || '',
        subcategorySerial: c.subcategorySerial || '',
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

    let discount = 0;
    let appliedCode = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: new RegExp(`^${couponCode}$`, "i") }).lean();
      if (coupon && coupon.active) {
        const now = Date.now();
        if ((!coupon.startDate || new Date(coupon.startDate).getTime() <= now) &&
            (!coupon.endDate || new Date(coupon.endDate).getTime() >= now)) {
          const nonDealItems = items.filter((i) => !i.isDeal);
          let eligibleSubtotal = nonDealItems.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
          if (!coupon.appliesToAll) {
            const allowed = new Set((coupon.productIds || []).map(String));
            eligibleSubtotal = nonDealItems.reduce((sum, i) => {
              if (allowed.has(String(i.productId))) return sum + i.qty * i.unitPrice;
              return sum;
            }, 0);
          }
          if (eligibleSubtotal > 0) {
            if (coupon.type === "percentage") {
              discount = Math.round(eligibleSubtotal * (coupon.value / 100));
            } else {
              discount = coupon.value;
            }
            discount = Math.min(discount, eligibleSubtotal);
            appliedCode = coupon.code;
          }
        }
      }
    }

    const total = Math.max(0, subtotal - discount);

    const order = await Order.create({
      orderCode: makeOrderCode(),
      customer,
      items,
      subtotal,
      discount,
      total,
      couponCode: appliedCode,
      status: "Pending",
      paymentStatus: "Pending",
      paymentProvider: "payfast",
    });

    const merchant_id = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";

    if (!merchant_id || !merchant_key) {
      return res.status(500).json({ message: "PayFast credentials are not configured" });
    }

    const payload = {
      merchant_id,
      merchant_key,
      return_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-confirmation?order=${order.orderCode}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/checkout?cancel=1&order=${order.orderCode}`,
      notify_url: `${process.env.SERVER_URL || "http://localhost:5000"}/api/payments/payfast/notify`,
      name_first: customer.firstName || "",
      name_last: customer.lastName || "",
      email_address: customer.email || "",
      m_payment_id: order.orderCode,
      amount: Number(total).toFixed(2),
      item_name: `Order ${order.orderCode}`,
    };

    const signatureOrder = [
      "merchant_id",
      "merchant_key",
      "return_url",
      "cancel_url",
      "notify_url",
      "name_first",
      "name_last",
      "email_address",
      "cell_number",
      "m_payment_id",
      "amount",
      "item_name",
      "item_description",
      "custom_int1",
      "custom_int2",
      "custom_int3",
      "custom_int4",
      "custom_int5",
      "custom_str1",
      "custom_str2",
      "custom_str3",
      "custom_str4",
      "custom_str5",
      "email_confirmation",
      "confirmation_address",
      "payment_method",
    ];

    const signatureString = buildSignatureString(payload, passphrase, signatureOrder);
    const signature = generateSignature(payload, passphrase, signatureOrder);

    return res.json({
      payment_url: PAYFAST_URL,
      fields: { ...payload, signature },
      orderCode: order.orderCode,
      debug: req.query?.debug === "1" || process.env.PAYFAST_DEBUG === "true"
        ? { signatureString, signature }
        : undefined,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to init payment" });
  }
}

export async function payfastNotify(req, res) {
  try {
    let body = req.body || {};
    if (typeof body === "string") {
      const params = new URLSearchParams(body);
      body = Object.fromEntries(params.entries());
    }
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).send("empty body");
    }
    const orderCode = body.m_payment_id;
    if (!orderCode) return res.status(400).send("missing order");

    const order = await Order.findOne({ orderCode });
    if (!order) return res.status(404).send("not found");

    order.payfast = {
      pf_payment_id: body.pf_payment_id,
      payment_status: body.payment_status,
      signature: body.signature,
    };

    const status = String(body.payment_status || "").toUpperCase();
    if (status === "COMPLETE") {
      order.paymentStatus = "Paid";
      order.status = "Confirmed";
    } else if (status === "FAILED") {
      order.paymentStatus = "Failed";
      order.status = "Cancelled";
    } else if (status === "CANCELLED") {
      order.paymentStatus = "Cancelled";
      order.status = "Cancelled";
    }

    await order.save();
    return res.send("OK");
  } catch (err) {
    return res.status(500).send("ERROR");
  }
}
