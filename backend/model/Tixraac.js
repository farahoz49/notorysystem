import mongoose from "mongoose";

const refNoSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "BQL_REFNO",
    },

    startNumber: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

// ✅ muhiim: default export
export default mongoose.model("RefNoSettings", refNoSettingsSchema);