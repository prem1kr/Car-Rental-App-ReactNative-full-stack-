import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    discount: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    validity: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
