import DhulBanaan from "../model/DhulBanaan.js";

// ===============================
// CREATE DhulBanaan
// ===============================
export const createDhulBanaan = async (req, res) => {
  try {
    const dhul = await DhulBanaan.create(req.body);
    res.status(201).json({
      success: true,
      message: "DhulBanaan waa la diiwaangeliyay",
      data: dhul,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL DhulBanaan
// ===============================
export const getAllDhulBanaan = async (req, res) => {
  try {
    const dhul = await DhulBanaan.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dhul.length,
      data: dhul,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE DhulBanaan
// ===============================
export const getSingleDhulBanaan = async (req, res) => {
  try {
    const dhul = await DhulBanaan.findById(req.params.id);

    if (!dhul) {
      return res.status(404).json({
        success: false,
        message: "Dhul lama helin",
      });
    }

    res.status(200).json({
      success: true,
      data: dhul,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE DhulBanaan
// ===============================
export const updateDhulBanaan = async (req, res) => {
  try {
    const dhul = await DhulBanaan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!dhul) {
      return res.status(404).json({
        success: false,
        message: "Dhul lama helin",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dhul waa la cusbooneysiiyay",
      data: dhul,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE DhulBanaan
// ===============================
export const deleteDhulBanaan = async (req, res) => {
  try {
    const dhul = await DhulBanaan.findByIdAndDelete(req.params.id);

    if (!dhul) {
      return res.status(404).json({
        success: false,
        message: "Dhul lama helin",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dhul waa la tirtiray",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};