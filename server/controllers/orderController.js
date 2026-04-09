import Order from "../models/Order.js";

export async function getOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
}

export async function getOrderByCode(req, res) {
  const code = req.params.code;
  try {
    const order = await Order.findOne({ orderCode: code }).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch order" });
  }
}

export async function updateOrderStatus(req, res) {
  const code = req.params.code;
  const { status } = req.body || {};
  const allowed = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    const order = await Order.findOneAndUpdate(
      { orderCode: code },
      { status },
      { new: true }
    ).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update order" });
  }
}
