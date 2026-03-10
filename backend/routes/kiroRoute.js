import express from "express";
import {
  createKiro,
  getAllKiro,
  getSingleKiro,
  updateKiro,
  deleteKiro,
} from "../controller/kiroController.js";

const router = express.Router();

router.post("/", createKiro);
router.get("/", getAllKiro);
router.get("/:id", getSingleKiro);
router.put("/:id", updateKiro);
router.delete("/:id", deleteKiro);

export default router;