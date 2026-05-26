import offerModel from "../models/offerModel.js";

export const addOffer = async (req, res) => {
    try {
        const { title, discount, description, code, validity } = req.body;
        if (!title || !discount || !description || !code || !validity) {
            return res.status(400).json({ success:false, message: "Please fill all details", });
        }

        const offers = await offerModel.create({
            title,
            discount,
            description,
            code,
            validity
        });
        return res.status(201).json({ success:true,message: "Offer added successfully", offers });

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Server Error" });
    }
};



export const getOffers = async (req, res) => {
    try {
        const offers = await offerModel.find().sort({ createdAt: -1 });
        return res.status(200).json({success: true, message: "Offers fetched successfully", offers });

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,  message: "Server Error" });
    }
};



export const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await offerModel.findById(id);
        if (!offer) {
            return res.status(404).json({success:false, message: "Offer not found" });
        }

        await offerModel.findByIdAndDelete(id);
        return res.status(200).json({success:true, message: "Offer deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Server Error" });
    }
};
