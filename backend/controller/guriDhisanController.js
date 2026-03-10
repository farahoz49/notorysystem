import GuriDhisan from "../model/GuriDhisan.js";

// ===============================
// CREATE GuriDhisan
// ===============================
export const createGuriDhisan = async (req, res) => {
  try {
    const dhul = await GuriDhisan.create(req.body);
    res.status(201).json({
      success: true,
      message: "GuriDhisan waa la diiwaangeliyay",
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
// GET ALL GuriDhisan
// ===============================
export const getAllGuriDhisan = async (req, res) => {
  try {
    const dhul = await GuriDhisan.find().sort({ createdAt: -1 });

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
// GET SINGLE GuriDhisan
// ===============================
export const getSingleGuriDhisan = async (req, res) => {
  try {
    const dhul = await GuriDhisan.findById(req.params.id);

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
// UPDATE GuriDhisan
// ===============================
export const updateGuriDhisan = async (req, res) => {
  try {
    const dhul = await GuriDhisan.findByIdAndUpdate(
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
// DELETE GuriDhisan
// ===============================
export const deleteGuriDhisan = async (req, res) => {
  try {
    const dhul = await GuriDhisan.findByIdAndDelete(req.params.id);

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