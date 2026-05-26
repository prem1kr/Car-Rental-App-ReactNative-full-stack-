import axios from "axios"

const API_URL = 'https://car-rental-app-backend-wxdr.onrender.com/api/review';

export const addReviews = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/review-add`, data);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const getAllReview = async () => {
    try {
        const response = await axios.get(`${API_URL}/review-get`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}


export const deleteReview = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/review-delete/${id}`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const getCarReviews = async (carId) => {
    try {
        const response = await axios.get(`${API_URL}/review-car/${carId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}


export const getUserReviews = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/review-user/${userId}`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}

