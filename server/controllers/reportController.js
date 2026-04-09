import Order from "../models/Order.js";

function dayLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function getReports(req, res) {
  try {
    const allowedDays = new Set([7, 30, 90, 180, 365]);
    const requested = Number(req.query.days || 180);
    const days = allowedDays.has(requested) ? requested : 180;

    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    const paidOrders = await Order.find({
      paymentStatus: "Paid",
      createdAt: { $gte: start, $lte: now },
    }).lean();

    const map = new Map();
    for (let i = 0; i < days; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { date: key, name: dayLabel(d), sales: 0, orders: 0 });
    }

    paidOrders.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      const row = map.get(key);
      if (!row) return;
      row.sales += Number(o.total || 0);
      row.orders += 1;
    });

    const data = Array.from(map.values()).map((x) => ({
      ...x,
      sales: Math.round(x.sales),
    }));

    return res.json({ days, data });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load reports" });
  }
}
