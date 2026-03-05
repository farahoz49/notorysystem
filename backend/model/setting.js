// src/models/Setting.js
import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    // ✅ Hal setting doc oo kaliya (singleton)
    key: { type: String, default: "APP_SETTINGS", unique: true, index: true },

    // =========================
    // ✅ OFFICE / COMPANY INFO
    // =========================
    office: {
      name: { type: String, trim: true, default: "Notory Office" },
    
      DrName: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "Mogadishu" },
      country: { type: String, trim: true, default: "Somalia" },

      phone1: { type: String, trim: true, default: "" },
      website: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, lowercase: true, default: "" },
      watermarkText: { type: String, trim: true, default: "" }, // optional
    },

    // =========================
    // ✅ BRANDING (LOGO)
    // =========================
    branding: {
        headerlogo: { type: String, default: "" },
        footerLogo: { type: String, default: "" },
    },

    // =========================
    // ✅ AGREEMENT REF NO
    // =========================
   
      refNo: { type: String, trim: true, default: "REF" },
 

    // =========================
    // ✅ FEES (SYSTEM DEFAULTS)
    // =========================
    fees: {
      currency: { type: String, trim: true, default: "USD" },

      // “Office Fee” (khidmada xafiiska)
      officeFeeDefault: { type: Number, default: 0, min: 0 },

      // “Service Fee” (khidmada adeegga)
      serviceFeeDefault: { type: Number, default: 0, min: 0 },

      // VAT/Tax (haddii aad rabto)
      taxEnabled: { type: Boolean, default: false },
      taxPercent: { type: Number, default: 0, min: 0, max: 100 },

      // Discount (optional)
      allowDiscount: { type: Boolean, default: true },
      maxDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
    },

    // =========================
    // ✅ DOCUMENT SETTINGS
    // =========================
    documents: {
      language: { type: String, enum: ["SO", "EN", "SO_EN"], default: "SO" },
      fontFamily: { type: String, default: "Times New Roman" },
      fontSize: { type: Number, default: 12, min: 8, max: 24 },
    },

    // =========================
    // ✅ CLOUD / UPLOADS
    // =========================
    uploads: {
      provider: { type: String, enum: ["LOCAL", "CLOUDINARY"], default: "CLOUDINARY" },
      maxFileMB: { type: Number, default: 10, min: 1, max: 100 },

      // allowed: images + pdf
      allowedMimeTypes: {
        type: [String],
        default: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/pdf",
        ],
      },

      cloudinary: {
        folderBase: { type: String, default: "notory" },
      },
    },


    // =========================
    // ✅ STATUS
    // =========================
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", SettingSchema);