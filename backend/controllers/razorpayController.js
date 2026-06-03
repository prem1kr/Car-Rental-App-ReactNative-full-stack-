import razorpay from "../config/razorpay.js";
import bookingModel from "../models/bookingModel.js";
import crypto from "crypto";
import paymentModel from "../models/paymentModel.js";
import authModel from "../models/authModel.js";

export const createRazorpayOrder = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `booking_${booking._id}`,
        };
        booking.totalPrice = amount;
        booking.save();
        const order = await razorpay.orders.create(options);

        res.status(200).json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating Razorpay order" });
    }
};



export const verifyPaymentController = async (req, res) => {
    try {
        const { bookingId, userId, razorpay_order_id, razorpay_payment_id, razorpay_signature,rewardUsed } = req.body;
        const generatedSignature = crypto.createHmac("prem016", process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const payment = await paymentModel.create({
            bookingId,
            userId,
            rewardUsed,
            amount: booking.totalPrice,
            paymentMethod: "Razorpay",
            paymentStatus: "Paid",
        });

        booking.paymentStatus = "Paid";
        booking.paymentMethod = "Razorpay";
        booking.status = "Confirmed";
        await booking.save();

        if (rewardUsed > 0) {
            await authModel.findByIdAndUpdate(userId,
                { $inc: { totalReferralEarnings: -rewardUsed } },
                { new: true }
            );
        }
        res.status(200).json({ success: true, message: "Payment successful", payment });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Payment verification error" });
    }
};