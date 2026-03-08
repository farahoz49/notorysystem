import express from "express";

import {
  createAsasidShirkad,
  getAllAsasidShirkad,
  getSingleAsasidShirkad,
  updateAsasidShirkad,
  deleteAsasidShirkad,
} from "../controller/asasidShirkadController.js";

const router = express.Router();

router.post("/", createAsasidShirkad);

router.get("/", getAllAsasidShirkad);

router.get("/:id", getSingleAsasidShirkad);

router.put("/:id", updateAsasidShirkad);

router.delete("/:id", deleteAsasidShirkad);

export default router;