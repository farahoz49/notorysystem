// src/routes/setting.routes.js
import express from "express";
import {
  getSettings,
  initSettings,
  updateSettings,

  deleteSettings,
} from "../controller/settingcontroller.js";

// ✅ beddel paths haddii aad ku leedahay magacyo kale


const router = express.Router();

// Public/Protected read (badanaa protect ayaan ka dhigay)
router.get("/", getSettings);

// Admin actions
router.post("/init",  initSettings);
router.put("/",  updateSettings);

router.delete("/",  deleteSettings);

export default router;