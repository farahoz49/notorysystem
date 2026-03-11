import mongoose from "mongoose";

const baabuurSchema = new mongoose.Schema(
  {
   
    // Nooca baabuurka
    type: {
      type: String,
      
      trim: true,
    },

    // Chassis number
    chassisNo: {
      type: String,
      
      trim: true,
    },

    // Model & Midab (Fadlan Qor)
    modelYear: {
      type: Number,
      
    },

    color: {
      type: String,
      
    },

    // Cylinder
    cylinder: {
      type: Number,
     
    },

    // Taargo
    plateNo: {
      type: String,
      
      trim: true,
    },

    plateIssueDate: {
      type: Date,
     
    },

    // Ku Milkiyad (Buug / Kaarka)
    ownershipType: {
      type: String,
      enum: ["Buug", "Kaarka"],
      default: "Buug",
    },

    ownershipBookNo: {
      type: String,
      
    },

    ownershipIssueDate: {
      type: Date,
      
    },

    // 🏛️ WASAARADDA (DEFAULT – mar walba isku mid)
    issuedByPlate: {
      type: String,
      default: "WASAARADDA GAADIIDKA & DUULISTA HAWADA",
      immutable: true, // lama beddeli karo
    },

    issuedByOwnership: {
      type: String,
      default: "WASAARADDA GAADIIDKA JFS",
      immutable: true, // lama beddeli karo
    },
  },
  { timestamps: true }
);

export default mongoose.model("baabuur", baabuurSchema);
