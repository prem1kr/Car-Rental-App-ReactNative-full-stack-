import reviewModel from "../models/reviewModel.js";
import carModel from "../models/carModel.js";

export const addReview = async (req, res) => {
    try {
        const { rating, comment, carId, userId, userName } = req.body;
        if (!rating || !comment || !carId || !userId || !userName) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const car = await carModel.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found" });
        }

        const alreadyReviewed = await reviewModel.findOne({ userId, carId });
        if (alreadyReviewed) {
            return res.status(400).json({ success: false, message: "You already reviewed this car" });
        }

        const review = await reviewModel.create({
            userId,
            userName,
            rating,
            comment,
            carId
        });

        const reviews = await reviewModel.find({ carId });
        const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = totalRating / reviews.length;

        await carModel.findByIdAndUpdate(carId, {
            rating: averageRating.toFixed(1),
            totalReviews: reviews.length
        });

        return res.status(201).json({ success: true, message: "Review added successfully", review });

    } catch (error) {
        console.log("Add Review Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getReview = async (req, res) => {
    try {
        const reviews = await reviewModel.find().populate("carId").populate("userId", "name email").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, reviews });

    } catch (error) {
        console.log("Get Review Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await reviewModel.findById(id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        await reviewModel.findByIdAndDelete(id);
        const reviews = await reviewModel.find({ carId: review.carId });

        let averageRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
            averageRating = totalRating / reviews.length;
        }

        await carModel.findByIdAndUpdate(review.carId, {
            rating: averageRating.toFixed(1),
            totalReviews: reviews.length
        });

        return res.status(200).json({ success: true, message: "Review deleted successfully" });

    } catch (error) {
        console.log("Delete Review Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getCarReviews = async (req, res) => {
    try {
        const { carId } = req.params;
        const reviews = await reviewModel.find({ carId }).populate("userId", "name email").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, reviews });

    } catch (error) {
        console.log("Get Car Reviews Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const review = await reviewModel.find({ userId }).populate("carId").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: "review fetched successfully", review });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}