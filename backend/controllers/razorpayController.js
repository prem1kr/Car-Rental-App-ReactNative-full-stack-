import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            return res.json({ success: true, message: "Payment verified" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};