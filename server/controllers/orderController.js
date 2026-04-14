import Order from "../models/Order.js";

export async function getOrders(req, res) {
  try {
    const pageNum  = Math.max(1, parseInt(req.query.page)  || 1);
    const limitNum = Math.max(1, parseInt(req.query.limit) || 20);
    const skip     = (pageNum - 1) * limitNum;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Order.countDocuments(filter),
    ]);

    return res.json({ orders, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
}

export async function getOrderByCode(req, res) {
  try {
    const order = await Order.findOne({ orderCode: req.params.code }).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch order" });
  }
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body || {};
  const allowed = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  try {
    const order = await Order.findOneAndUpdate(
      { orderCode: req.params.code },
      { status },
      { new: true }
    ).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update order" });
  }
}
