import express from "express";
import {
  createDamiinMobile,
  getAllDamiinMobiles,
  getDamiinMobile,
  updateDamiinMobile,
  deleteDamiinMobile,
} from "../controller/DamiinMobileController.js";

const router = express.Router();

router.post("/", createDamiinMobile);
router.get("/", getAllDamiinMobiles);
router.get("/:id", getDamiinMobile);
router.put("/:id", updateDamiinMobile);
router.delete("/:id", deleteDamiinMobile);

export default router;