// controllers/shaqaleysiin.controller.js
import Shaqaleysiin from "../model/Shaqaleysiin.js";

/**
 * POST /api/shaqaleysiin
 * create shaqo
 */
export const createShaqaleysiin = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user?._id, // haddii auth middleware aad leedahay
    };

    const doc = await Shaqaleysiin.create(payload);
    return res.status(201).json({ message: "Shaqo waa la keydiyay", data: doc });
  } catch (err) {
    return res.status(400).json({
      message: err?.message || "Create failed",
      error: err,
    });
  }
};

/**
 * GET /api/shaqaleysiin
 * list + search + pagination (optional)
 * ?q=banki or name  &page=1&limit=10
 */
export const getShaqaleysiinList = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (q) {
      filter.$or = [
        { looShaqeeye: { $regex: q, $options: "i" } },
        { magac: { $regex: q, $options: "i" } },
        { shaqada: { $regex: q, $options: "i" } },
      ];
    }

    // optional: haddii aad rabto in personRef/ agreementRef lagu filter gareeyo
    if (req.query.personRef) filter.personRef = req.query.personRef;
    if (req.query.agreementRef) filter.agreementRef = req.query.agreementRef;

    const [items, total] = await Promise.all([
      Shaqaleysiin.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Shaqaleysiin.countDocuments(filter),
    ]);

    return res.json({
      data: items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

/**
 * GET /api/shaqaleysiin/:id
 */
export const getShaqaleysiinById = async (req, res) => {
  try {
    const doc = await Shaqaleysiin.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Shaqo lama helin" });
    return res.json({ data: doc });
  } catch (err) {
    return res.status(400).json({ message: "Invalid id", error: err });
  }
};

/**
 * PUT /api/shaqaleysiin/:id
 */
export const updateShaqaleysiin = async (req, res) => {
  try {
    const updated = await Shaqaleysiin.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Shaqo lama helin" });
    return res.json({ message: "Shaqo waa la update gareeyay", data: updated });
  } catch (err) {
    return res.status(400).json({ message: err?.message || "Update failed", error: err });
  }
};

/**
 * DELETE /api/shaqaleysiin/:id
 */
export const deleteShaqaleysiin = async (req, res) => {
  try {
    const deleted = await Shaqaleysiin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Shaqo lama helin" });
    return res.json({ message: "Shaqo waa la tirtiray" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid id", error: err });
  }
};