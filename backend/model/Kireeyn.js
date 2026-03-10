import mongoose from "mongoose";

const KireeynSchema = new mongoose.Schema(
    {
        gobtakirada: {
            type: String,

            trim: true,
        },
        address: {
            type: String,

            trim: true,
        },
        cabirka: {
            type: String,

            trim: true,
        },

        mudo: {
            type: Number,
            default: null,
        },
        dateB: {
            type: Date,
            default: null,
        },
        qimahakirada: {
            type: Number,

            default: 0,
        },
        qimahahormariska: {
            type: Number,
            default: 0,
        },
        mudohormaris: {
            type: Number,
            default: null,
        },
        dateB1: {
            type: Date,
            default: null,
        },
        mudoKurdhin: {
            type: String,
            trim: true,
            default: "",
        },


    },
    { timestamps: true }
);

const Kireeyn = mongoose.model("Kireeyn", KireeynSchema);

export default Kireeyn;