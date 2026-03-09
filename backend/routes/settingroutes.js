// src/routes/setting.routes.js
import express from "express";
import {
  getSettings,
  initSettings,
  updateSettings,

  deleteSettings,
} from "../controller/settingcontroller.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

// ✅ beddel paths haddii aad ku leedahay magacyo kale


const router = express.Router();

// Public/Protected read (badanaa protect ayaan ka dhigay)
router.get("/", getSettings);

// Admin actions
router.post("/init", authenticate, authorizeRoles("SUPER_ADMIN"), initSettings);
router.put("/", authenticate, authorizeRoles("SUPER_ADMIN"), updateSettings);

router.delete("/", authenticate, authorizeRoles("SUPER_ADMIN"), deleteSettings);

export default router;