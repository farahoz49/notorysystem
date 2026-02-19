import express from "express";
import {
  createbaabuur,
  getbaabuurs,
  getbaabuurById,
  deletebaabuur,
  updatebaabuur,
} from "../controller/BaabuurController.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authenticate, getbaabuurs);
router.get("/:id", authenticate, getbaabuurById);
router.post("/", authenticate, createbaabuur);
router.delete("/:id", authenticate, deletebaabuur);
router.put("/:id", authenticate, updatebaabuur);

export default router;
