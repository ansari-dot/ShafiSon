import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: { type: String, required: true },
    qty: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    isDeal: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      notes: String,
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: null },
    status: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Pending" },
    paymentProvider: { type: String, default: "payfast" },
    payfast: {
      pf_payment_id: String,
      payment_status: String,
      signature: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
