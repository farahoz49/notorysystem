import baabuur from "../model/Baabuur.js";
import Agreement from "../model/Agreement.js";

// ➕ Create
export const createbaabuur= async (req, res) => {
  try {
    const baabuurs = await baabuur.create(req.body); // ✅
    res.status(201).json(baabuurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get all
export const getbaabuurs = async (req, res) => {
  try {
    const baabuurs = await baabuur.find()
      .sort({ createdAt: -1 });

    res.json(baabuurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get one by ID
export const getbaabuurById = async (req, res) => {
  try {
    const info = await baabuur.findById(req.params.id);

    if (!info) {
      return res.status(404).json({ message: "baabuurnot found" });
    }

    res.json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update
export const updatebaabuur= async (req, res) => {
  try {
    const info = await baabuur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!info) {
      return res.status(404).json({ message: "baabuurnot found" });
    }

    res.json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete
export const deletebaabuur= async (req, res) => {
  try {
    const info = await baabuur.findByIdAndDelete(req.params.id);

    if (!info) {
      return res.status(404).json({ message: "baabuurnot found" });
    }

    res.json({ message: "baabuurdeleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
