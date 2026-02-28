// routes/nationalityRoutes.js
import express from "express";
import Nationality from "../model/Nationality.js";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const data = await Nationality.find().sort({ name: 1 });
  res.json(data);
});

// CREATE new
router.post("/", async (req, res) => {
  try {
    const nationality = await Nationality.create({
      name: req.body.name
    });
    res.status(201).json(nationality);
  } catch (err) {
    res.status(400).json({ message: "Nationality already exists" });
  }
});

export default router;