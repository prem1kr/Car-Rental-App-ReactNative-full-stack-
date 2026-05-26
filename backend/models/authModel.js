import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    
    role: {
        type: String,
        enum: ["user", "admin"],
        default: 'user'
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    referralCode: {
        type: String,
        unique: true,
        default:''
    },

    totalReferralEarnings: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

export default mongoose.model("User", authSchema);
