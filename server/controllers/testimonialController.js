import Testimonial from "../models/Testimonial.js";

function isValidObjectId(id) {
    return id && id.match(/^[0-9a-fA-F]{24}$/);
}

export async function getTestimonials(req, res) {
    try {
        const { active } = req.query;
        const filter = typeof active === "string" ? { active: active === "true" } : {};
        const items = await Testimonial.find(filter).sort({ createdAt: -1 }).lean();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch testimonials" });
    }
}

export async function getTestimonialById(req, res) {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    try {
        const item = await Testimonial.findById(id).lean();
        if (!item) return res.status(404).json({ message: "Testimonial not found" });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch testimonial" });
    }
}

export async function createTestimonial(req, res) {
    try {
        const item = await Testimonial.create(req.body);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

export async function updateTestimonial(req, res) {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    try {
        const item = await Testimonial.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).lean();
        if (!item) return res.status(404).json({ message: "Testimonial not found" });
        return res.json(item);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

export async function deleteTestimonial(req, res) {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    try {
        const deleted = await Testimonial.findByIdAndDelete(id).lean();
        if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
        return res.json({ message: "Testimonial deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete testimonial" });
    }
}