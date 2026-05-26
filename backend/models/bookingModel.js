import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        carId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true,
        },

        pickupDate: {
            type: Date,
            required: true,
        },

        returnDate: {
            type: Date,
            required: true,
        },

        pickupLocation: {
            type: String,
            required: true,
            trim: true,
        },

        dropLocation: {
            type: String,
            required: true,
            trim: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Cancelled",
                "Completed",
            ],
            default: "Pending",
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
            ],
            default: "Pending",
        },

        paymentMethod: {
            type: String,
            enum: [
                "Cash",
                "UPI",
                "Card",
            ],
            default: "Cash",
        },

    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Booking", bookingSchema);
