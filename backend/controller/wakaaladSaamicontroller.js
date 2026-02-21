import WakaaladSaami from "../model/Wakaalad_Saami.js";

/* ==============================
   CREATE WAKAALAD SAAMI
================================= */
export const createWakaaladSaami = async (req, res) => {
  try {
    const { accountHormuud, accountSalaam, Date } = req.body;

    const newRecord = await WakaaladSaami.create({
      accountHormuud,
      accountSalaam,
      Date,
    });

    res.status(201).json({
      success: true,
      message: "Wakaalad Saami waa la sameeyay",
      data: newRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message,
    });
  }
};

/* ==============================
   GET ALL
================================= */
export const getAllWakaaladSaami = async (req, res) => {
  try {
    const records = await WakaaladSaami.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message,
    });
  }
};

/* ==============================
   GET SINGLE BY ID
================================= */
export const getWakaaladSaamiById = async (req, res) => {
  try {
    const record = await WakaaladSaami.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Ma jiro record-kan",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message,
    });
  }
};

/* ==============================
   UPDATE
================================= */
export const updateWakaaladSaami = async (req, res) => {
  try {
    const updated = await WakaaladSaami.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Ma jiro record-kan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Waa la cusboonaysiiyay",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message,
    });
  }
};

/* ==============================
   DELETE
================================= */
export const deleteWakaaladSaami = async (req, res) => {
  try {
    const deleted = await WakaaladSaami.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Ma jiro record-kan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Waa la tirtiray",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message,
    });
  }
};