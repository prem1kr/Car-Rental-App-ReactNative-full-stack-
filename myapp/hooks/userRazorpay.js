import axios from "axios";
const API_URL = "https://car-rental-app-backend-wxdr.onrender.com/api/razorpay";

export const createOrder = async (bookingId, amount) => {
    try {
        const response = await axios.post(`${API_URL}/create-order`, { bookingId, amount });
        return response.data;

    } catch (error) {
        return error.response?.data;
    }
};

export const verifyPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/verify-payment`, paymentData);
        return response.data;

    } catch (error) {
        return error.response?.data;
    }
};