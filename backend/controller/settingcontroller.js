// src/controllers/setting.controller.js
import Setting from "../model/setting.js";

// helper: ensure singleton
const SETTINGS_KEY = "APP_SETTINGS";

/**
 * GET /api/settings
 * - Soo qaado settings (haddii uusan jirin, samee default)
 */
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: SETTINGS_KEY });

    if (!settings) {
      settings = await Setting.create({ key: SETTINGS_KEY });
    }

 
    return res.json(settings);
  } catch (err) {
    console.error("getSettings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/settings/init
 * - Abuur settings haddii uusan jirin (Admin)
 */
export const initSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: SETTINGS_KEY });
    if (settings) return res.json(settings);

    settings = await Setting.create({ key: SETTINGS_KEY });
    return res.status(201).json(settings);
  } catch (err) {
    console.error("initSettings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/settings
 * - Update settings (Admin)
 * - Supports partial update (deep merge style simple)
 */
export const updateSettings = async (req, res) => {
  try {
    const payload = req.body || {};

    const settings = await Setting.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(settings);
  } catch (err) {
    console.error("updateSettings error:", err);

    // Mongoose validation errors
    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * DELETE /api/settings
 * - Delete settings doc (Admin) (optional)
 */
export const deleteSettings = async (req, res) => {
  try {
    await Setting.deleteOne({ key: SETTINGS_KEY });
    return res.json({ message: "Settings deleted" });
  } catch (err) {
    console.error("deleteSettings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};