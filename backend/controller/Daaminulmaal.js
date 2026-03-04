import Daaminulmaal from "../model/Daaminulmaal.js";

/** helper: parse pagination */
const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : def;
};

// ✅ CREATE (POST /api/Daaminulmaal)
export const createDaaminulmaal = async (req, res) => {
  try {
    const payload = req.body;

    // optional: auto-calc example (haddii aad rabto)
    // haddii wadartaGuud ama dulSaarkaLacag aysan iman, isku day xisaabi
    if (
      payload.qiimaha != null &&
      payload.dulSaarkaPercent != null &&
      payload.dulSaarkaLacag == null
    ) {
      payload.dulSaarkaLacag = (Number(payload.qiimaha) * Number(payload.dulSaarkaPercent)) / 100;
    }
    if (payload.qiimaha != null && payload.dulSaarkaLacag != null && payload.wadartaGuud == null) {
      payload.wadartaGuud = Number(payload.qiimaha) + Number(payload.dulSaarkaLacag);
    }

    const doc = await Daaminulmaal.create(payload);
    return res.status(201).json({ message: "Daaminulmaal created", data: doc });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL (GET /api/Daaminulmaal?page=1&limit=10&search=salaam)
export const getDaaminulmaals = async (req, res) => {
  try {
    const page = toInt(req.query.page, 1);
    const limit = toInt(req.query.limit, 10);
    const search = String(req.query.search || "").trim();

    const filter = {};
    if (search) {
      filter.$or = [
        { bankName: { $regex: search, $options: "i" } },
        { sheyga: { $regex: search, $options: "i" } },
        { kaFaaideyste: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Daaminulmaal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Daaminulmaal.countDocuments(filter),
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: items,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ GET ONE (GET /api/Daaminulmaal/:id)
export const getDaaminulmaalById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Daaminulmaal.findById(id);
    if (!doc) return res.status(404).json({ message: "Daaminulmaal not found" });

    return res.json({ data: doc });
  } catch (err) {
    return res.status(400).json({ message: "Invalid id" });
  }
};

// ✅ UPDATE (PUT /api/Daaminulmaal/:id)
export const updateDaaminulmaal = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // optional: auto-calc again
    if (
      payload.qiimaha != null &&
      payload.dulSaarkaPercent != null &&
      payload.dulSaarkaLacag == null
    ) {
      payload.dulSaarkaLacag = (Number(payload.qiimaha) * Number(payload.dulSaarkaPercent)) / 100;
    }
    if (payload.qiimaha != null && payload.dulSaarkaLacag != null && payload.wadartaGuud == null) {
      payload.wadartaGuud = Number(payload.qiimaha) + Number(payload.dulSaarkaLacag);
    }

    const updated = await Daaminulmaal.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Daaminulmaal not found" });

    return res.json({ message: "Daaminulmaal updated", data: updated });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// ✅ DELETE (DELETE /api/Daaminulmaal/:id)
export const deleteDaaminulmaal = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Daaminulmaal.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Daaminulmaal not found" });

    return res.json({ message: "Daaminulmaal deleted", data: deleted });
  } catch (err) {
    return res.status(400).json({ message: "Invalid id" });
  }
};