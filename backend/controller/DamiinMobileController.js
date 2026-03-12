import DamiinMobile from "../model/DamiinMobile.js";

// CREATE
export const createDamiinMobile = async (req, res) => {
  try {
    const mobile = await DamiinMobile.create(req.body);

    res.status(201).json({
      success: true,
      message: "Mobile record created successfully",
      data: mobile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL
export const getAllDamiinMobiles = async (req, res) => {
  try {
    const mobiles = await DamiinMobile.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mobiles.length,
      data: mobiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ONE
export const getDamiinMobile = async (req, res) => {
  try {
    const mobile = await DamiinMobile.findById(req.params.id);

    if (!mobile) {
      return res.status(404).json({
        success: false,
        message: "Mobile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mobile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE
export const updateDamiinMobile = async (req, res) => {
  try {
    const mobile = await DamiinMobile.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!mobile) {
      return res.status(404).json({
        success: false,
        message: "Mobile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mobile updated successfully",
      data: mobile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE
export const deleteDamiinMobile = async (req, res) => {
  try {
    const mobile = await DamiinMobile.findByIdAndDelete(req.params.id);

    if (!mobile) {
      return res.status(404).json({
        success: false,
        message: "Mobile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mobile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};