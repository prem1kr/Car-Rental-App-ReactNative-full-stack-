import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({

    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    referredUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    referralCode: {
        type: String,
        required: true,
    },

    rewardAmount: {
        type: Number,
        default: 100,
    },

    status: {
        type: String,
        enum: ["Pending", "Joined"],
        default: "Pending",
    }

}, { timestamps: true });

export default mongoose.model('Referral', referralSchema);