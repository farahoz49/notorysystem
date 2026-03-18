import mongoose from "mongoose";

const damiinmobileSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            default: "SANABIL",
        },

        deviceType: {
            type: String,
            enum: ["Mobile", "Tablet"],
        },

        mobileBrand: {
            type: String,
            enum: ["Samsung", "Tecno", "Infinix"],
        },

        mobileModel: {
            type: String,
           
        },

        mobileMemory: {
            type: String,
        },

        totalAmount: {
            type: Number,
           
            min: 0,
        },

        downPayment: {
            type: Number,
            default: 0,
            min: 0,
        },

        TypePayment: {
            type: String,
            enum: ["Maalin", "Isbuuc", "Bil"],
            default: "Maalin",
        },

        Payment: {
            type: Number,
            default: 0,
            min: 0,
        },

        startDate: {
            type: Date,
          
        },

        months: {
            type: Number,
            default: 6,
            min: 1,
        },
    },
    { timestamps: true }
);

damiinmobileSchema.pre("save", function (next) {
    const deviceOptions = [
        { brand: "Samsung", model: "A17", memory: "128/6", type: "Mobile" },
        { brand: "Samsung", model: "A07", memory: "128/4", type: "Mobile" },
        { brand: "Tecno", model: "Spark 40", memory: "128/8", type: "Mobile" },
        { brand: "Infinix", model: "Hot 60i 256/16", memory: "256/16", type: "Mobile" },
        { brand: "Infinix", model: "Hot 60i 128/12", memory: "128/12", type: "Mobile" },
        { brand: "Infinix", model: "Smart 20", memory: "128/8", type: "Mobile" },
        { brand: "Tecno", model: "Tap XPad 20", memory: "128/4", type: "Tablet" },
    ];

    const selected = deviceOptions.find((d) => d.model === this.mobileModel);

    if (!selected) {
        return next(new Error("Mobile model-ka lama aqoonsan."));
    }

    this.mobileBrand = selected.brand;
    this.mobileMemory = selected.memory;
    this.deviceType = selected.type;

    next();
});

export default mongoose.model("damiinmobile", damiinmobileSchema);