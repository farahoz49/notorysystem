import express from "express";

import { createDaaminulmaal, deleteDaaminulmaal, getDaaminulmaalById, getDaaminulmaals, updateDaaminulmaal } from "../controller/Daaminulmaal.js";

const router = express.Router();

// CRUD
router.post("/", createDaaminulmaal);
router.get("/", getDaaminulmaals);
router.get("/:id", getDaaminulmaalById);
router.put("/:id", updateDaaminulmaal);
router.delete("/:id", deleteDaaminulmaal);

export default router;