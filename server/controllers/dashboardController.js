import Order from "../models/Order.js";
import Product from "../models/Product.js";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

function formatRelative(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

export async function getDashboard(req, res) {
  try {
    const now = new Date();
    const last30 = daysAgo(30);
    const prev30 = daysAgo(60);

    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      products
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.find({ paymentStatus: "Paid" }).lean(),
      Product.find().lean(),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const last30Orders = paidOrders.filter((o) => new Date(o.createdAt) >= last30);
    const prev30Orders = paidOrders.filter((o) => new Date(o.createdAt) >= prev30 && new Date(o.createdAt) < last30);

    const last30Revenue = last30Orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const prev30Revenue = prev30Orders.reduce((sum, o) => sum + (o.total || 0), 0);

    const orderTrend = prev30Orders.length === 0 ? 0 : ((last30Orders.length - prev30Orders.length) / prev30Orders.length) * 100;
    const revenueTrend = prev30Revenue === 0 ? 0 : ((last30Revenue - prev30Revenue) / prev30Revenue) * 100;

    const lowStockThreshold = 5;
    const lowStockItems = products.filter((p) => Number(p.quantity || 0) <= lowStockThreshold);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const salesData = Array.from({ length: 7 }).map((_, i) => {
      const day = daysAgo(6 - i);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const total = paidOrders
        .filter((o) => new Date(o.createdAt) >= day && new Date(o.createdAt) < next)
        .reduce((sum, o) => sum + (o.total || 0), 0);
      const name = day.toLocaleDateString("en-US", { weekday: "short" });
      return { name, sales: Math.round(total) };
    });

    const activityFeed = [];
    recentOrders.slice(0, 3).forEach((o) => {
      activityFeed.push({
        type: "order",
        text: `New order ${o.orderCode} placed by ${o.customer?.firstName || "Customer"}`,
        time: formatRelative(o.createdAt),
      });
    });
    if (lowStockItems.length > 0) {
      activityFeed.push({
        type: "alert",
        text: `Low stock alert: ${lowStockItems[0].title} (${lowStockItems[0].quantity || 0} left).`,
        time: "Just now",
      });
    }

    return res.json({
      metrics: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        lowStock: lowStockItems.length,
        orderTrend,
        revenueTrend,
      },
      salesData,
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
