import mongoose from "mongoose";

const XayiraadSaamiSchema = new mongoose.Schema(
    {
        bank: {
            type: String,
            required: true,
            enum: [" Salaam Somali Bank", "Agro Bank(Bankiga Beeraha)", "Salaam African Bank"], // waad kordhin kartaa

        },

        amount: {
            type: Number,

        },
        accountNumber: {
            type: Number,

        },
        date: {
            type: Date,
        },
        sababta: {
            type: String,
            required: true,
        },
        saami: {
            type: Number,
            required: true,
        },
        mudada: {
            type: Number,
            required: true,
        },

    }

);

export default mongoose.model("XayiraadSaami", XayiraadSaamiSchema);
