import express from "express";
import {
  createGuriDhisan,
  getAllGuriDhisan,
  getSingleGuriDhisan,
  updateGuriDhisan,
  deleteGuriDhisan,
} from "../controller/guriDhisanController.js";

const router = express.Router();

// CREATE
router.post("/", createGuriDhisan);

// GET ALL
router.get("/", getAllGuriDhisan);

// GET SINGLE
router.get("/:id", getSingleGuriDhisan);

// UPDATE
router.put("/:id", updateGuriDhisan);

// DELETE
router.delete("/:id", deleteGuriDhisan);

export default router; 