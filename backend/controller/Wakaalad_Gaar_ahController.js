import Wakaalad_Gaar_ah from  '../model/Wakaalad_Gaar_ah.js'

// ===============================
// CREATE Wakaalad_Gaar_ah
// ===============================
export const createWakaalad_Gaar_ah = async (req, res) => {
  try {
    const info = await Wakaalad_Gaar_ah.create(req.body);
    res.status(201).json({
      success: true,
      message: "Wakaalad_Gaar_ah waa la diiwaangeliyay",
      data: info,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL Wakaalad_Gaar_ah
// ===============================
export const getAllWakaalad_Gaar_ah = async (req, res) => {
  try {
    const info = await Wakaalad_Gaar_ah.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: info.length,
      data: info,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE Wakaalad_Gaar_ah
// ===============================
export const getSingleWakaalad_Gaar_ah = async (req, res) => {
  try {
    const info = await Wakaalad_Gaar_ah.findById(req.params.id);

    if (!info) {
      return res.status(404).json({
        success: false,
        message: "Wakaalad_Gaar_ah lama helin",
      });
    }

    res.status(200).json({
      success: true,
      data: info,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE Wakaalad_Gaar_ah
// ===============================
export const updateWakaalad_Gaar_ah = async (req, res) => {
  try {
    const info = await Wakaalad_Gaar_ah.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!info) {
      return res.status(404).json({
        success: false,
        message: "Wakaalad_Gaar_ah lama helin",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wakaalad_Gaar_ah waa la cusbooneysiiyay",
      data: info,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE Wakaalad_Gaar_ah
// ===============================
export const deleteWakaalad_Gaar_ah = async (req, res) => {
  try {
    const info = await Wakaalad_Gaar_ah.findByIdAndDelete(req.params.id);

    if (!info) {
      return res.status(404).json({
        success: false,
        message: "Wakaalad_Gaar_ah lama helin",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wakaalad_Gaar_ah waa la tirtiray",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};