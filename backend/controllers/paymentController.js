import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";

export const createPaymentController = async (req, res) => {
    try {
        const { bookingId, userId, amount, paymentMethod, transactionId } = req.body;
        if (!bookingId || !userId || !amount || !paymentMethod) {
            return res.status(400).send({ success: false, message: "Please provide all fields" });
        }

        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).send({ success: false, message: "Booking not found" });
        }

        const payment = await paymentModel.create({
            bookingId,
            userId,
            amount,
            paymentMethod,
            transactionId,
            paymentStatus: "Paid",
        });

        booking.paymentStatus = "Paid";
        booking.paymentMethod = paymentMethod;
        booking.status = "Confirmed";
        await booking.save();

        res.status(201).send({ success: true, message: "Payment completed successfully", payment });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in payment API", error });
    }
};



export const getAllPaymentsController = async (req, res) => {
    try {
        const payments = await paymentModel.find().populate("userId").populate("bookingId").sort({ createdAt: -1 });
        res.status(200).send({ success: true, total: payments.length, payments });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting payments", error });
    }
};



export const getSinglePaymentController = async (req, res) => {
    try {
        const payment = await paymentModel.findById(req.params.id).populate("userId").populate("bookingId");
        if (!payment) {
            return res.status(404).send({ success: false, message: "Payment not found" });
        }

        res.status(200).send({ success: true, payment });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting payment", error });
    }
};



export const updatePaymentStatusController = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const payment = await paymentModel.findByIdAndUpdate(req.params.id,
            { paymentStatus },
            { new: true }
        );

        if (!payment) {
            return res.status(404).send({ success: false, message: "Payment not found" });
        }

        res.status(200).send({ success: true, message: "Payment status updated", payment });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while updating payment", error });
    }
};



export const deletePaymentController = async (req, res) => {
    try {
        const payment = await paymentModel.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).send({ success: false, message: "Payment not found" });
        }

        res.status(200).send({ success: true, message: "Payment deleted successfully", });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while deleting payment", error });
    }
};