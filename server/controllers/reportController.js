import Order from "../models/Order.js";

function dayLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function getReports(req, res) {
  try {
    const allowedDays = new Set([7, 30, 90, 180, 365]);
    const requested = Number(req.query.days || 180);
    const days = allowedDays.has(requested) ? requested : 180;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    const agg = await Order.aggregate([
      { $match: { paymentStatus: "Paid", createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
    ]);

    const aggMap = Object.fromEntries(agg.map((d) => [d._id, { sales: d.sales, orders: d.orders }]));

    const data = Array.from({ length: days }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const row = aggMap[key] || { sales: 0, orders: 0 };
      return { date: key, name: dayLabel(d), sales: Math.round(row.sales), orders: row.orders };
    });

    return res.json({ days, data });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load reports" });
  }
}
