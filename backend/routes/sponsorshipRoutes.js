import express from "express";
import {
  createSponsorship,
  getAllSponsorships,
  getSponsorship,
  updateSponsorship,
  deleteSponsorship,
} from "../controller/sponsorshipController.js";

const router = express.Router();

/* CREATE */
router.post("/", createSponsorship);

/* GET ALL */
router.get("/", getAllSponsorships);

/* GET ONE */
router.get("/:id", getSponsorship);

/* UPDATE */
router.put("/:id", updateSponsorship);

/* DELETE */
router.delete("/:id", deleteSponsorship);

export default router;