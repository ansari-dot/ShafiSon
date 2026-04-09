import Order from "../models/Order.js";

function monthKey(date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

export async function getReports(req, res) {
  try {
    const now = new Date();
    const months = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        name: monthKey(d),
        start: d,
        end: new Date(d.getFullYear(), d.getMonth() + 1, 1),
      });
    }

    const paidOrders = await Order.find({ paymentStatus: "Paid" }).lean();

    const data = months.map((m) => {
      const inMonth = paidOrders.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= m.start.getTime() && t < m.end.getTime();
      });
      const sales = inMonth.reduce((sum, o) => sum + (o.total || 0), 0);
      return { name: m.name, sales: Math.round(sales), orders: inMonth.length };
    });

    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load reports" });
  }
}
