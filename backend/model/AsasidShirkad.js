import mongoose from "mongoose";

const asasidShirkadSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
    
      trim: true,
      uppercase: true,
    },

    ownerName: {
      type: String,
      
      trim: true,
    },

    address: {
      type: String,
     
      trim: true,
    },

    foundedYear: {
      type: Number,
      
    },

    capital: {
      type: Number,
     
      min: [0, "Capital ma noqon karo negative"],
    },

    objectives: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AsasidShirkad =
  mongoose.models.AsasidShirkad ||
  mongoose.model("asasidshirkad", asasidShirkadSchema);

export default AsasidShirkad;