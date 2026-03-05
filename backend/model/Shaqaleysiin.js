// models/Shaqaleysiin.js
import mongoose from "mongoose";

const ShaqaleysiinSchema = new mongoose.Schema(
  {
    // Loo Shaqeeye (dropdown)
    looShaqeeye: {
      type: String,
      required: [true, "Loo Shaqeeye waa required"],
      trim: true,
      enum: ["Banki", "Shirkad", "Dowlad", "Qof", "Kale"], // waad kordhin kartaa
    },

    // Magaca (input)
    magac: {
      type: String,
      required: [true, "Magaca waa required"],
      trim: true,
     
    },

    // Shaqada (input) tusaale: Nadaafad
    shaqada: {
      type: String,
      required: [true, "Shaqada waa required"],
      trim: true,
   
    },

    // optional: yaa abuuray (admin/user)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // optional: haddii uu ku xiran yahay person/agreements (haddii aad rabto)
    personRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: false,
      index: true,
    },
    agreementRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agreement",
      required: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shaqaaleysiin", ShaqaleysiinSchema);