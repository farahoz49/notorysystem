// models/Murabaha.js
import mongoose from "mongoose";

const DaaminulmaalSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
    },

    bankType: {
      type: String,
      enum: ["Banki", "Shirkad"],
      default: "Banki",
    },

    sheyga: {
      type: String,
      required: true,
    },

    heshiisDate: {
      type: Date,
    },

    qiimaha: {
      type: Number,
      required: true,
    },

    wadartaGuud: {
      type: Number,
    },

    dulSaarkaPercent: {
      type: Number,
    },

    dulSaarkaLacag: {
      type: Number,
    },

    faaidoText: {
      type: String,
    },

    wadartaText: {
      type: String,
    },

    kaFaaideyste: {
      type: String,
    },

    hormaris: {
      type: Number,
    },

    hormarisText: {
      type: String,
    },

    haftadaBishi: {
      type: Number,
    },

    lacagSooCelinta: {
      type: Date,
    },

    lacagBixintaBilood: {
      type: Number,
    },

    lacagBixintaUnit: {
      type: String,
      default: "bilood",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Daaminulmaal", DaaminulmaalSchema);