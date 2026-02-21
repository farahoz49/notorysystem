import express from "express";
import {
  createWakaaladSaami,
  getAllWakaaladSaami,
  getWakaaladSaamiById,
  updateWakaaladSaami,
  deleteWakaaladSaami,
} from "../controller/wakaaladSaamicontroller.js";

const router = express.Router();

/* ==============================
   ROUTES
================================= */

router.post("/", createWakaaladSaami);
router.get("/", getAllWakaaladSaami);
router.get("/:id", getWakaaladSaamiById);
router.put("/:id", updateWakaaladSaami);
router.delete("/:id", deleteWakaaladSaami);

export default router;