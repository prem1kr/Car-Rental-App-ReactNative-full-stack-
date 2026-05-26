import axios from "axios";

const API_URL = "https://car-rental-app-backend-wxdr.onrender.com/api/payment";

export const addPaymentCard = async (data) => {
    try {
        const res = await axios.post(`${API_URL}/add-card`, data);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const getPaymentCards = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/get-cards/${userId}`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const deletePaymentCard = async (cardId) => {
    try {
        const res = await axios.delete(`${API_URL}/delete-card/${cardId}`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};