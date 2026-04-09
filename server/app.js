import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import homeCollectionRoutes from "./routes/homeCollectionRoutes.js";
import compareSectionRoutes from "./routes/compareSectionRoutes.js";
import popularPicksRoutes from "./routes/popularPicksRoutes.js";
import homeCategoriesRoutes from "./routes/homeCategoriesRoutes.js";
import dealSectionRoutes from "./routes/dealSectionRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import payfastRoutes from "./routes/payfastRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import contactLeadRoutes from "./routes/contactLeadRoutes.js";
import aboutTeamRoutes from "./routes/aboutTeamRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

await connectDB();

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/home-collection", homeCollectionRoutes);
app.use("/api/compare-section", compareSectionRoutes);
app.use("/api/popular-picks", popularPicksRoutes);
app.use("/api/home-categories", homeCategoriesRoutes);
app.use("/api/deal-section", dealSectionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments/payfast", payfastRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/contacts", contactLeadRoutes);
app.use("/api/about-team", aboutTeamRoutes);
app.use("/api/subscribers", subscriberRoutes);

export default app;
