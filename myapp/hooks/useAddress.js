import axios from "axios";

const API_URL = "https://car-rental-app-backend-wxdr.onrender.com/api/address";

export const addAddress = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/add-address`, data);
        return response.data;

    } catch (error) {
        console.log(error);
    }
};

export const getUserAddresses = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user-addresses/${userId}`);
        return response.data;

    } catch (error) {
        console.log(error);
    }
};

export const updateAddress = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/update-address/${id}`, data);
        return response.data;

    } catch (error) {
        console.log(error);
    }
};

export const deleteAddress = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-address/${id}`);
        return response.data;

    } catch (error) {
        console.log(error);
    }
};

export const setDefaultAddress = async (userId, addressId) => {
    try {
        const response = await axios.put(`${API_URL}/set-default-address`, { userId, addressId });
        return response.data;

    } catch (error) {
        console.log(error);
    }
};