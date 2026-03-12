// models/Murabaha.js
import mongoose from "mongoose";

const damiinmobileSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            default: "SANABIL",
        },

        Type: {
            type: String,
            enum: ["Banki", "Shirkad"],
            default: "Shirkad",


        },
        // Mobile
        mobileBrand: {
            type: String,
            enum: ["Samsung", "Tecno", "Infinix"],
            required: true,
        },

        mobileModel: {
            type: String,
            required: true,
        },

        mobileMemory: {
            type: String,
            required: true,
        },

        // Lacagta
        totalAmount: {
            type: Number,
            required: true,
        },

        downPayment: {
            type: Number,
            default: 0,
        },
        TypePayment: {
            type: String,
            enum: ["Maalin", "Isbuuc", "Bil"],
            default: "Maalin",
        },

        Payment: {
            type: Number,
            default: 0,
        },

        // Muddada
        startDate: {
            type: Date,
            required: true,
        },

        // endDate: {
        //     type: Date,
        //     required: true,
        // },

        months: {
            type: Number,
            default: 6,

        },
    },
    { timestamps: true }
);

export default mongoose.model("damiinmobile", damiinmobileSchema);