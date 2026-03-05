// routes/shaqaleysiin.routes.js
import express from "express";
import {
  createShaqaleysiin,
  getShaqaleysiinList,
  getShaqaleysiinById,
  updateShaqaleysiin,
  deleteShaqaleysiin,
} from "../controller/shaqaleysiincontroller.js";

// haddii aad leedahay auth middleware:

const router = express.Router();

// router.use(protect); // haddii aad rabto dhammaan inay protected noqdaan
router.post("/", createShaqaleysiin);
router.get("/", getShaqaleysiinList);
router.get("/:id", getShaqaleysiinById);
router.put("/:id", updateShaqaleysiin);
router.delete("/:id", deleteShaqaleysiin);

export default router;