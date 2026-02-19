import mongoose from "mongoose";
const Wakaalad_Gaar_ahSchema = new mongoose.Schema({
  Nooca: {
    type: String,
    enum: ["Dhul Banaan", "Guri Dhisan"],
    required: true,
  },
  cabirka: {
    type: String,
    enum: ["Boos", "Nus Boos", "Boosas"],
    required: true,
  },

  tiradaBoosaska: {
    type: Number,
    min: 1,
    required: function () {
      return this.cabirka === "Boosas";
    },
  },

  cabirFaahfaahin: String,
  lottoLambar: String,

  kuMilkiyay: {
    type: String,
    enum: ["Aato", "Sabarloog", "Maxkamad"],
    required: true,
  },

  taariikh: { type: Date, required: true },
 

  // ===== KU MILKIYAY DETAILS =====
aato: {
  cadeynLambar: {
    type: String,
    required: function () { return this.kuMilkiyay === "Aato"; },
  },
  kasooBaxday: String,
  kuSaxiixan: String,
},

  sabarloog: {
    sabarloogNo: {
      type: String,
      required: function () { return this.kuMilkiyay === "Sabarloog"; },
    },
    bollettarioNo1: String,
    bollettarioNo2: String,
    rasiidNambar: String,
    rasiidTaariikh: Date,
    dHooseEe: String,
  },

  maxkamad: {
    warqadLam: {
      type: String,
      required: function () { return this.kuMilkiyay === "Maxkamad"; },
    },
    maxkamada: String,
    garsooraha: String,
    kuSaxiixan: String,
  },

  kuYaallo: {
    gobol: { type: String, required: true },
    degmo: { type: String, required: true },
  },

  soohdinta: {
    koonfur: { type: String, required: true },
    waqooyi: { type: String, required: true },
    galbeed: { type: String, required: true },
    bari: { type: String, required: true },
  },

  ahna: String,
  kaKooban: String,
}, { timestamps: true });

// nadiifi fields marka la beddelo
Wakaalad_Gaar_ahSchema.pre("validate", function (next) {
  if (this.cabirka !== "Boosas") this.tiradaBoosaska = undefined;

  if (this.kuMilkiyay !== "Aato") this.aato = undefined;
  if (this.kuMilkiyay !== "Sabarloog") this.sabarloog = undefined;
  if (this.kuMilkiyay !== "Maxkamad") this.maxkamad = undefined;

  next();
});

export default mongoose.model("Wakaalad_Gaar_ah", Wakaalad_Gaar_ahSchema);
