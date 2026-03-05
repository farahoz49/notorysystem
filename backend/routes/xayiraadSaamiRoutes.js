import express from "express";
import {
  createXayiraadSaami,
  getAllXayiraadSaami,
  getOneXayiraadSaami,
  updateXayiraadSaami,
  deleteXayiraadSaami,
} from "../controller/xayiraadSaamiController.js";

const router = express.Router();


// CREATE
router.post("/", createXayiraadSaami);

// GET ALL
router.get("/", getAllXayiraadSaami);

// GET ONE
router.get("/:id", getOneXayiraadSaami);

// UPDATE
router.put("/:id", updateXayiraadSaami);

// DELETE
router.delete("/:id", deleteXayiraadSaami);

export default router;