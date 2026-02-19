import express from "express";
import {
  createDhulBanaan,
  getAllDhulBanaan,
  getSingleDhulBanaan,
  updateDhulBanaan,
  deleteDhulBanaan,
} from "../controller/dhulBanaanController.js";

const router = express.Router();

// CREATE
router.post("/", createDhulBanaan);

// GET ALL
router.get("/", getAllDhulBanaan);

// GET SINGLE
router.get("/:id", getSingleDhulBanaan);

// UPDATE
router.put("/:id", updateDhulBanaan);

// DELETE
router.delete("/:id", deleteDhulBanaan);

export default router;