import express from "express";
import {
  createWakaalad_Gaar_ah,
  getAllWakaalad_Gaar_ah,
  getSingleWakaalad_Gaar_ah,
  updateWakaalad_Gaar_ah,
  deleteWakaalad_Gaar_ah,
} from "../controller/Wakaalad_Gaar_ahController.js";

const router = express.Router();

// CREATE
router.post("/", createWakaalad_Gaar_ah);

// GET ALL
router.get("/", getAllWakaalad_Gaar_ah);

// GET SINGLE
router.get("/:id", getSingleWakaalad_Gaar_ah);

// UPDATE
router.put("/:id", updateWakaalad_Gaar_ah);

// DELETE
router.delete("/:id", deleteWakaalad_Gaar_ah);

export default router;