import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ContactLead from "../models/ContactLead.js";
import Subscriber from "../models/Subscriber.js";

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatRelative(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export async function getDashboard(req, res) {
  try {
    const last30 = daysAgo(30);
    const prev30 = daysAgo(60);
    const last7days = daysAgo(6);

    const [
      totalOrders,
      pendingOrders,
      revenueAgg,
      last30Agg,
      prev30Agg,
      lowStockCount,
      lowStockItems,
      salesData,
      recentOrders,
      recentContacts,
      recentSubscribers,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),

      // total revenue
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),

      // last 30 days
      Order.aggregate([
        { $match: { paymentStatus: "Paid", createdAt: { $gte: last30 } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),

      // prev 30 days
      Order.aggregate([
        { $match: { paymentStatus: "Paid", createdAt: { $gte: prev30, $lt: last30 } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),

      Product.countDocuments({ quantity: { $lte: 5 } }),
      Product.find({ quantity: { $lte: 5 } }, { title: 1, quantity: 1 }).limit(10).lean(),

      // sales per day for last 7 days using aggregation
      Order.aggregate([
        { $match: { paymentStatus: "Paid", createdAt: { $gte: last7days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: "$total" },
          },
        },
      ]),

      Order.find({}, { orderCode: 1, customer: 1, status: 1, total: 1, createdAt: 1 })
        .sort({ createdAt: -1 }).limit(6).lean(),
      ContactLead.find({}, { firstName: 1, lastName: 1, createdAt: 1 })
        .sort({ createdAt: -1 }).limit(3).lean(),
      Subscriber.find({}, { name: 1, email: 1, createdAt: 1 })
        .sort({ createdAt: -1 }).limit(3).lean(),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const last30Revenue = last30Agg[0]?.total || 0;
    const last30Count = last30Agg[0]?.count || 0;
    const prev30Revenue = prev30Agg[0]?.total || 0;
    const prev30Count = prev30Agg[0]?.count || 0;

    const orderTrend = prev30Count === 0 ? 0 : ((last30Count - prev30Count) / prev30Count) * 100;
    const revenueTrend = prev30Revenue === 0 ? 0 : ((last30Revenue - prev30Revenue) / prev30Revenue) * 100;

    // Build 7-day sales chart
    const salesMap = Object.fromEntries(salesData.map((d) => [d._id, d.sales]));
    const salesChart = Array.from({ length: 7 }).map((_, i) => {
      const day = daysAgo(6 - i);
      const key = day.toISOString().slice(0, 10);
      const name = day.toLocaleDateString("en-US", { weekday: "short" });
      return { name, sales: Math.round(salesMap[key] || 0) };
    });

    const activityEvents = [];
    recentOrders.slice(0, 3).forEach((o) => {
      activityEvents.push({
        type: "order",
        text: `New order ${o.orderCode} placed by ${o.customer?.firstName || "Customer"}`,
        time: formatRelative(o.createdAt),
        _ts: new Date(o.createdAt).getTime(),
      });
    });
    recentContacts.forEach((c) => {
      activityEvents.push({
        type: "contact",
        text: `New contact message from ${c.firstName || "Customer"} ${c.lastName || ""}`.trim(),
        time: formatRelative(c.createdAt),
        _ts: new Date(c.createdAt).getTime(),
      });
    });
    recentSubscribers.forEach((s) => {
      activityEvents.push({
        type: "subscriber",
        text: `New newsletter subscriber: ${s.name || "Customer"} (${s.email || ""})`.trim(),
        time: formatRelative(s.createdAt),
        _ts: new Date(s.createdAt).getTime(),
      });
    });
    if (lowStockItems.length > 0) {
      activityEvents.push({
        type: "alert",
        text: `Low stock alert: ${lowStockItems[0].title} (${lowStockItems[0].quantity || 0} left).`,
        time: "Just now",
        _ts: Date.now(),
      });
    }

    const activityFeed = activityEvents
      .sort((a, b) => b._ts - a._ts)
      .slice(0, 6)
      .map(({ _ts, ...rest }) => rest);

    return res.json({
      metrics: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        lowStock: lowStockCount,
        orderTrend,
        revenueTrend,
      },
      salesData: salesChart,
      recentOrders: recentOrders.map((o) => ({
        id: o.orderCode,
        customer: `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.trim(),
        status: o.status || "Pending",
        total: o.total || 0,
      })),
      activityFeed,
      lowStockItems: lowStockItems.map((p) => ({ id: p._id, title: p.title, quantity: p.quantity || 0 })),
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
}
