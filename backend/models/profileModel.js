import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    drivingLicense: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }

}, { timestamps: true });

export default mongoose.model('profile', ProfileSchema);