import axios from 'axios';

const API_URL = 'https://car-rental-app-backend-wxdr.onrender.com/api/payments'

export const createPayments = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/create-payments`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getAllPayments = async () => {
    try {
        const response = await axios.get(`${API_URL}/all-payments`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const getSinglePayments = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/payments/${id}`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}

export const getSingleUSerPayments = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user-payment/${userId}`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const updatePayments = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/update-payments-status/${id}`, data);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const deletePayments = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-payments/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}