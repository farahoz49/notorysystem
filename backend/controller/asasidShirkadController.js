import AsasidShirkad from "../model/AsasidShirkad.js"

/* ================================
CREATE
================================ */
export const createAsasidShirkad = async (req, res) => {
  try {
    const asasid = await AsasidShirkad.create(req.body);

    res.status(201).json({
      success: true,
      data: asasid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================================
GET ALL
================================ */
export const getAllAsasidShirkad = async (req, res) => {
  try {
    const data = await AsasidShirkad.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================================
GET SINGLE
================================ */
export const getSingleAsasidShirkad = async (req, res) => {
  try {
    const data = await AsasidShirkad.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record lama helin",
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


/* ================================
UPDATE
================================ */
export const updateAsasidShirkad = async (req, res) => {
  try {
    const updated = await AsasidShirkad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Record lama helin",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================================
DELETE
================================ */
export const deleteAsasidShirkad = async (req, res) => {
  try {
    const deleted = await AsasidShirkad.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record lama helin",
      });
    }

    res.json({
      success: true,
      message: "Waa la delete gareeyay",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};