import Kiro from "../model/Kireeyn.js";

// CREATE
export const createKiro = async (req, res) => {
  try {
    const kiro = await Kiro.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Kireyn waa la abuuray",
      data: kiro,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Khalad ayaa dhacay",
    });
  }
};

// GET ALL
export const getAllKiro = async (req, res) => {
  try {
    const kiros = await Kiro.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: kiros.length,
      data: kiros,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Khalad ayaa dhacay",
    });
  }
};

// GET SINGLE
export const getSingleKiro = async (req, res) => {
  try {
    const { id } = req.params;

    const kiro = await Kiro.findById(id);

    if (!kiro) {
      return res.status(404).json({
        success: false,
        message: "Kireyn lama helin",
      });
    }

    return res.status(200).json({
      success: true,
      data: kiro,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Khalad ayaa dhacay",
    });
  }
};

// UPDATE
export const updateKiro = async (req, res) => {
  try {
    const { id } = req.params;

    const kiro = await Kiro.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!kiro) {
      return res.status(404).json({
        success: false,
        message: "Kireyn lama helin",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Kireyn waa la cusbooneysiiyay",
      data: kiro,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Khalad ayaa dhacay",
    });
  }
};

// DELETE
export const deleteKiro = async (req, res) => {
  try {
    const { id } = req.params;

    const kiro = await Kiro.findById(id);

    if (!kiro) {
      return res.status(404).json({
        success: false,
        message: "Kireyn lama helin",
      });
    }

    await kiro.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Kireyn waa la tirtiray",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Khalad ayaa dhacay",
    });
  }
};