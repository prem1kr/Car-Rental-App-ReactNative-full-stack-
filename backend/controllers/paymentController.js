import paymentModel from "../models/paymentModel.js";

export const addPaymentCard = async (req, res) => {
    try {
        const { userId, name, cardNumber, expiry, cvv } = req.body;
        if (!userId || !name || !cardNumber || !expiry || !cvv) {
            return res.status(400).json({success: false,message: "All fields are required"});
        }

        const payment = await paymentModel.create({
            userId,
            name,
            cardNumber,
            expiry,
            cvv,
        });
        res.status(201).json({success: true,message: "Card added successfully",payment});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};


export const getPaymentCards = async (req, res) => {
    try {
        const { userId } = req.params;
        const payments = await paymentModel.find({ userId });
        res.status(200).json({success: true,payments});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false,message: "Server Error"});
    }
};


export const deletePaymentCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        await paymentModel.findByIdAndDelete(cardId);
        res.status(200).json({success: true,message: "Card deleted successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};