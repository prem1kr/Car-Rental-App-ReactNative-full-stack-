import express from "express";
import { createPaymentController, deletePaymentController, getAllPaymentsController, getSinglePaymentController, updatePaymentStatusController } from "../controllers/paymentController.js";

const paymentsRouter = express.Router();

paymentsRouter.post("/create-payments", createPaymentController);
paymentsRouter.get("/all-payments", getAllPaymentsController);
paymentsRouter.get("/payments/:id", getSinglePaymentController);
paymentsRouter.put("/update-payments-status/:id", updatePaymentStatusController);
paymentsRouter.delete("/delete-payments/:id", deletePaymentController);

export default paymentsRouter;