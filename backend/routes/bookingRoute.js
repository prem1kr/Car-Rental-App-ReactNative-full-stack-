import express from "express";
import { createBooking, getAllBookings, getUserBookings, updateBookingStatus, cancelBooking, deleteBooking } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/create-booking", createBooking);
bookingRouter.get("/all-bookings", getAllBookings);
bookingRouter.get("/user-bookings/:userId", getUserBookings);
bookingRouter.put("/update-booking-status/:bookingId", updateBookingStatus);
bookingRouter.put("/cancel-booking/:bookingId", cancelBooking);
bookingRouter.delete("/delete-booking/:bookingId", deleteBooking);

export default bookingRouter;