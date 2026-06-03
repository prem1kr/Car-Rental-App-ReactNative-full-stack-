import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "UPI", "Card","Razorpay"],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        transactionId: {
            type: String,
            default: "",
        },
    }, { timestamps: true });

export default mongoose.model("Payments", paymentSchema);