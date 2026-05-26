import express from "express";
import { addPaymentCard, deletePaymentCard, getPaymentCards } from "../controllers/paymentController.js";

const paymentRoute = express.Router();

paymentRoute.post("/add-card", addPaymentCard);
paymentRoute.get("/get-cards/:userId", getPaymentCards);
paymentRoute.delete("/delete-card/:cardId", deletePaymentCard);

export default paymentRoute;