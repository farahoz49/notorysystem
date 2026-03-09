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
  getRefNoSettings,
  removeAgreementImage,
  removePersonFromAgreement,
  searchAgreements,
  setAgentDocument,
  updateAgreement,
  updateRefNoStart,
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

// ✅ GET settings (ADMIN only)
router.get(
  "/refno/settings",
  authenticate,
  authorizeRoles("SUPER_ADMIN" ,"ADMIN"),
  getRefNoSettings
);
// ✅ ADMIN refno setting (MUST be before "/:id")
router.put(
  "/refno/start",
  authenticate,
  authorizeRoles( "SUPER_ADMIN" ,"ADMIN" ),
  updateRefNoStart
);

// ✅ create agreement
router.post("/", authenticate, createAgreement);

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

// ✅ list
router.get("/", authenticate, getAgreements);
router.get("/search", searchAgreements);

// ✅ dynamic ":id" routes last
router.get("/:id", authenticate, getAgreementById);
router.put("/:id", authenticate, updateAgreement);
router.delete("/:id", authenticate, authorizeRoles("SUPER_ADMIN" ,"ADMIN"), deleteAgreement);

export default router;