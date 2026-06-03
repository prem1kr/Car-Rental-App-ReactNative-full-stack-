import express from "express";
import { createRazorpayOrder, verifyPaymentController } from "../controllers/razorpayController.js";

const razorpayRouter = express.Router();

razorpayRouter.post("/create-order", createRazorpayOrder);
razorpayRouter.post("/verify-payment", verifyPaymentController);

export default razorpayRouter;