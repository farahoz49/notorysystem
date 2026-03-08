import Sponsorship from "../model/Sponsorship.js";

/* ===============================
   CREATE Sponsorship
================================ */
export const createSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.create(req.body);

    res.status(201).json({
      success: true,
      message: "Sponsorship created successfully",
      data: sponsorship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   GET ALL Sponsorship
================================ */
export const getAllSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sponsorships.length,
      data: sponsorships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   GET SINGLE Sponsorship
================================ */
export const getSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);

    if (!sponsorship) {
      return res.status(404).json({
        success: false,
        message: "Sponsorship not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sponsorship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   UPDATE Sponsorship
================================ */
export const updateSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!sponsorship) {
      return res.status(404).json({
        success: false,
        message: "Sponsorship not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sponsorship updated successfully",
      data: sponsorship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   DELETE Sponsorship
================================ */
export const deleteSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findByIdAndDelete(req.params.id);

    if (!sponsorship) {
      return res.status(404).json({
        success: false,
        message: "Sponsorship not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sponsorship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};