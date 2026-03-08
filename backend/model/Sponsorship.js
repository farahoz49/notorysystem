import mongoose from "mongoose";

const SponsorshipSchema = new mongoose.Schema(
    {
        AcademicYear: {
            type: Number,
            trim: true,
            uppercase: true,
        },

        universityName: {
            type: String,
            trim: true,
        },

        place: {
            type: String,
            trim: true,
        },

        bank: {
            type: String,
            required: true,
            enum: [" Salaam Somali Bank", "Agro Bank(Bankiga Beeraha)", "Salaam African Bank"], // waad kordhin kartaa

        },

        accountNumber: {
            type: Number,

        },


    },
    {
        timestamps: true,
    }
);

const Sponsorship =
    mongoose.models.Sponsorship ||
    mongoose.model("Sponsorship", SponsorshipSchema);

export default Sponsorship;