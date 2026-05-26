import bookingModel from "../models/bookingModel.js";
import carModel from "../models/carModel.js";

export const createBooking = async (req, res) => {
    try {
        const { userId, carId, pickupDate, returnDate, pickupLocation, dropLocation, totalPrice, paymentMethod } = req.body;
        if (!userId || !carId || !pickupDate || !returnDate || !pickupLocation || !dropLocation || !totalPrice) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const car = await carModel.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found" });
        }

        if (!car.available) {
            return res.status(400).json({ success: false, message: "Car is already booked" });
        }

        const booking = await bookingModel.create({
            userId,
            carId,
            pickupDate,
            returnDate,
            pickupLocation,
            dropLocation,
            totalPrice,
            paymentMethod,
        });

        await carModel.findByIdAndUpdate(carId, {
            available: false,
        });
        res.status(201).json({ success: true, message: "Booking created successfully", booking });

    } catch (error) {
        console.log("Create Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find().populate("carId").populate("userId").sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });

    } catch (error) {
        console.log("Get Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await bookingModel.find({ userId }).populate("carId").sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });

    } catch (error) {
        console.log("Get User Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const booking = await bookingModel.findByIdAndUpdate(bookingId,
            { status },
            { new: true }
        );
        
        if(status === "Completed") {
            await carModel.findByIdAndUpdate(
                booking.carId,
                {available:true}
            )
        }

        if(status === "Confirmed"){
            await carModel.findByIdAndUpdate(
                booking.carId,
                {available:false}
            )
        }

        res.status(200).json({ success: true, message: "Booking status updated", booking });

    } catch (error) {
        console.log("Update Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        booking.status = "Cancelled";
        await booking.save();
        await carModel.findByIdAndUpdate(booking.carId,
            { available: true }
        );

        res.status(200).json({ success: true, message: "Booking cancelled successfully" });

    } catch (error) {
        console.log("Cancel Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        await bookingModel.findByIdAndDelete(bookingId);
        res.status(200).json({ success: true, message: "Booking deleted successfully" });

    } catch (error) {
        console.log("Delete Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};