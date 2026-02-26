import express from "express";
import {
  addImageMetaToAgreement,
  addImagesToAgreementCloudinary,
  addPersonToAgreement,
  createAgreement,
  deleteAgreement,
  deleteAgreementImage,
  getAgreementById,
  getAgreements,
  getAgreementsCurrentMonth,
  getAgreementsReport,
  getDashboardCurrentMonth,
  getMissingRefNos,
  getNextRefNo,
  removeAgreementImage,
  removePersonFromAgreement,
  setAgentDocument,
  updateAgreement,
} from "../controller/agreementcontroller.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";
import { uploadImages } from "../middleware/upload.js";

const router = express.Router();
// ✅ specific routes first
router.get("/current-month", authenticate, getAgreementsCurrentMonth);
router.get("/dashboard/current-month", authenticate, getDashboardCurrentMonth);
router.get("/reports/agreements", authenticate, getAgreementsReport);
router.get("/next/refno", authenticate, getNextRefNo);
router.get("/missing-refnos", authenticate, getMissingRefNos);
router.post("/", authenticate ,createAgreement);
// ✅ upload cloudinary
router.post(
  "/:agreementId/images/upload",
  authenticate,
  uploadImages.array("images", 10),
  addImagesToAgreementCloudinary
);

// ✅ save meta (url + description)
router.post("/:agreementId/images/meta", authenticate, addImageMetaToAgreement);

// ✅ delete image by id (DELETE toos ah)
router.delete("/:agreementId/images/:imageId", authenticate, deleteAgreementImage);

// ✅ list + dynamic last
router.get("/", authenticate, getAgreements);
router.get("/:id", authenticate, getAgreementById);
router.put("/:id", authenticate, updateAgreement);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteAgreement);

export default router;