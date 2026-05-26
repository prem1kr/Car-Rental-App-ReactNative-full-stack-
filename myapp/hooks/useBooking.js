import axios from "axios";

const API_URL = "https://car-rental-app-backend-wxdr.onrender.com/api/booking";

export const createBooking = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/create-booking`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const getAllBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}/all-bookings`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const getUserBookings = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user-bookings/${userId}`);
        return response.data;

    } catch (error) {
        console.log(error);
    }
};


export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await axios.put(`${API_URL}/update-booking-status/${bookingId}`, { status });
        return response.data;

    } catch (error) {
        console.log(error);
    }
};


export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.put(`${API_URL}/cancel-booking/${bookingId}`);
        return response.data;

    } catch (error) {
        console.log(error);
    }
};


export const deleteBooking = async (bookingId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-booking/${bookingId}`);
        return response.data;

    } catch (error) {
        console.log(error);
    }
};