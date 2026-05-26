import addressModel from "../models/addressModel.js";

export const addAddress = async (req, res) => {
    try {
        const { userId, label, address, city, state, pincode } = req.body;

        if (!userId || !label || !address || !city || !state || !pincode) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newAddress = await addressModel.create({
            userId,
            label,
            address,
            city,
            state,
            pincode,
            isDefault: false
        });
        res.status(201).json({ success: true, message: "Address added successfully", newAddress });

    } catch (error) {
        console.log("ADD ADDRESS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getUserAddresses = async (req, res) => {
    try {
        const { userId } = req.params;
        const addresses = await addressModel.find({ userId });
        res.status(200).json({ success: true, addresses });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAddress = await addressModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).json({ success: true, message: "Address updated successfully", address: updatedAddress });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        await addressModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Address deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const setDefaultAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body;
        await addressModel.updateMany(
            { userId },
            { isDefault: false }
        );

        await addressModel.findByIdAndUpdate(addressId,
            { isDefault: true }
        );
        res.status(200).json({ success: true, message: "Default address updated" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};