import axios from 'axios';
const API_URL = "https://car-rental-app-backend-wxdr.onrender.com/api/referal"

export const generateReferal = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/generate-code/${userId}`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const applyReferal = async (newUserId, referralCode) => {
    try {
        const response = await axios.post(`${API_URL}/apply-code/${newUserId}`, { referralCode });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}


export const referalDetails = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/referal-details/${userId}`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const getAllReferal = async () => {
    try {
        const response = await axios.get(`${API_URL}/get-All-referal`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const deleteReferal = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-referal/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}