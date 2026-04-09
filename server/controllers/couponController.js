import Coupon from "../models/Coupon.js";

function isValidObjectId(id) {
  return id && id.match(/^[0-9a-fA-F]{24}$/);
}

export async function getCoupons(req, res) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return res.json(coupons);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch coupons" });
  }
}

export async function getCouponById(req, res) {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const coupon = await Coupon.findById(id).lean();
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    return res.json(coupon);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch coupon" });
  }
}

export async function createCoupon(req, res) {
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json(coupon);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function updateCoupon(req, res) {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    return res.json(coupon);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function deleteCoupon(req, res) {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const deleted = await Coupon.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });
    return res.json({ message: "Coupon deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete coupon" });
  }
}
