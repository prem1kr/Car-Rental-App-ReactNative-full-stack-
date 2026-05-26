import express from "express";
import { addReview, deleteReview, getCarReviews, getReview, getUserReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/review-add", addReview);
reviewRouter.get("/review-get", getReview);
reviewRouter.delete("/review-delete/:id", deleteReview);
reviewRouter.get("/review-car/:carId", getCarReviews);
reviewRouter.get("/review-user/:userId", getUserReviews);

export default reviewRouter;