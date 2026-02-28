// models/Nationality.js
import mongoose from "mongoose";

const nationalitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

const Nationality = mongoose.model("Nationality", nationalitySchema);

export default Nationality;