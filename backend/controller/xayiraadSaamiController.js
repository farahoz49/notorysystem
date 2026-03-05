import XayiraadSaami from "../model/XayiraadSaami.js";


// CREATE
export const createXayiraadSaami = async (req, res) => {
  try {
    const xayiraad = await XayiraadSaami.create(req.body);

    res.status(201).json({
      success: true,
      message: "Xayiraad Saami created successfully",
      data: xayiraad,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL
export const getAllXayiraadSaami = async (req, res) => {
  try {
    const data = await XayiraadSaami.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ONE
export const getOneXayiraadSaami = async (req, res) => {
  try {
    const data = await XayiraadSaami.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE
export const updateXayiraadSaami = async (req, res) => {
  try {
    const updated = await XayiraadSaami.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE
export const deleteXayiraadSaami = async (req, res) => {
  try {
    const deleted = await XayiraadSaami.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};