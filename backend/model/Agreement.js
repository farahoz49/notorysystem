import mongoose from "mongoose";

const agreementSchema = new mongoose.Schema(
  {
    agreementDate: {
      type: Date,
      default: Date.now,
    },

    refNo: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

   service: {
  type: String,
  enum: ["Wareejin", "Wakaalad" , "Caddeyn" , "Damaanad" , "Heshiisyo"],
  required: true,
},

serviceType: {
  type: String,
  enum: [
    "DhulBanaan",
    "baabuur",
    "Mooto",
    "Saami",
    "Wakaalad Guud",
    "Wakaalad_Gaar_ah",
    "Wakaalad_Saami",
    "Caddeyn",
    "Damaanad",
    "Heshiisyo",
    "Daaminul maal", 
    "Shaqaaleysiin",
    "Heshiis Dhex Maray Laba Daraf",
    "Aas’aasid Shirkad"
  ],
  required: true,
},


    serviceRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "serviceType",
    },

    agreementType: {
      type: String,
    
      enum: ["Beec", "Hibo", "Waqaf"],
    },

    officeFee: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
    },

    // ================= DHINACA 1AAD =================
    dhinac1: {
      sellers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
      agents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person", // Agent = Person document (wakaalad/tasdiiq)
        },
      ],
      agentDocument: {
        docType: {
          type: String,
          enum: ["Wakaalad", "Tasdiiq"],
        },
        docRef: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "dhinac1.agentDocument.docType",
        },
      },
      // Per-agent documents mapping: agentId -> { wakaalad: ObjectId, tasdiiq: ObjectId }
      agentDocuments: {
        type: Map,
        of: new mongoose.Schema({
          wakaalad: { type: mongoose.Schema.Types.ObjectId, ref: 'Wakaalad' },
          tasdiiq: { type: mongoose.Schema.Types.ObjectId, ref: 'Tasdiiq' }
        }, { _id: false })
      },
    },

    // ================= DHINACA 2AAD =================
    dhinac2: {
      buyers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
      agents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person", // Agent = Person toos ah
        },
      ],
      guarantors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
      agentDocuments: {
        type: Map,
        of: new mongoose.Schema({
          wakaalad: { type: mongoose.Schema.Types.ObjectId, ref: 'Wakaalad' },
          tasdiiq: { type: mongoose.Schema.Types.ObjectId, ref: 'Tasdiiq' }
        }, { _id: false })
      },
    },

    witnesses: [
      {
        type: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

agreementSchema.pre("validate", function (next) {
  if (this.service === "Wareejin") {
    const allowed = ["DhulBanaan", "baabuur", "Mooto", "Saami"];
    if (!allowed.includes(this.serviceType)) {
      return next(new Error("Invalid serviceType for Wareejin"));
    }
  }

  if (this.service === "Wakaalad") {
    const allowed = ["Wakaalad Guud", "Wakaalad_Gaar_ah", "Wakaalad_Saami"];
    if (!allowed.includes(this.serviceType)) {
      return next(new Error("Invalid serviceType for Wakaalad"));
    }
  }
  if (this.service === "Caddeyn") {
    const allowed = ["Caddeyn"];
    if (!allowed.includes(this.serviceType)) {
      return next(new Error("Invalid serviceType for Caddeyn"));
    }
  }
  if (this.service === "Damaanad") {
    const allowed = ["Daaminul maal", "Shaqaaleysiin"];
    if (!allowed.includes(this.serviceType)) {
      return next(new Error("Invalid serviceType for Damaanad"));
    }
  }
  if (this.service === "Heshiisyo") {
    const allowed = ["Heshiis Dhex Maray Laba Daraf", "Aas’aasid Shirkad"];
    if (!allowed.includes(this.serviceType)) {
      return next(new Error("Invalid serviceType for Heshiisyo"));
    }
  }

  next();
});


export default mongoose.model("Agreement", agreementSchema);
