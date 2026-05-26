import authModel from "../models/authModel.js";
import referralModel from "../models/referralModel.js";

export const generateReferal = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" });
        }

        if (user.referralCode) {
            return res.status(200).json({ success: true, referralCode: user.referralCode });
        }

        const code = (user.name.substring(0, 4).toUpperCase() || "USER") + Math.floor(1000 + Math.random() * 9000);
        user.referralCode = code;
        await user.save();
        return res.status(200).json({ success: true, referralCode: code });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}


export const applyReferal = async (req, res) => {
    try {
        const { referralCode } = req.body;
        const { newUserId } = req.params;
        const referrer = await authModel.findOne({ referralCode });

        if (!referrer) {
            return res.status(404).json({ success: false, message: "Invalid referal code" });
        }

        if (referrer._id.toString() === newUserId.toString()) {
            return res.status(400).json({ success: false, message: "you cannot use your own referal code " });
        }

        const alreadyUsed = await referralModel.findOne({ referredUser: newUserId });
        if (alreadyUsed) {
            return res.status(400).json({ success: false, message: "Referal already used" });
        }

        const referal = await referralModel.create({
            referrer: referrer._id,
            referredUser: newUserId,
            referralCode,
            status: "Joined",
            rewardAmount: 100,
        });

        referrer.totalReferralEarnings += 100;
        await referrer.save();
        return res.status(201).json({ success: true, message: "Referal applied successfully", referal });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}


export const getReferal = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const referals = await referralModel.find({ referrer: userId }).populate("referredUser", "name email").sort({ createdAt: -1 });

        return res.status(200).json({ success: true, message: "referal fetched successfully", referralCode: user.referralCode, totalEarning: user.totalReferralEarnings, invites: referals });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}


export const getAllreferal = async (req, res) => {
    try {
        const referals = await referralModel.find().populate("referrer", "name email referralCode").populate("referredUser", "name email").sort({ createdAt: -1 });;
        if (!referals) {
            return res.status(404).json({ success: false, message: "referal not found" });
        }

        return res.status(200).json({ success: true, message: "referal fetched successfully", referals });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: true, message: "Server Error", error: error.message });
    }
}
