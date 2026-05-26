import axios from "axios";

const API_URL = 'https://car-rental-app-backend-wxdr.onrender.com/api/notification';

export const AddNotification = async (notificationData) => {
    try {
        const response = await axios.post(`${API_URL}/notification-add`, notificationData);
        return response.data;

    } catch (error) {
        console.log(error);
    }
}

export const GetNotification = async () => {
    try {
        const response = await axios.get(`${API_URL}/notification-get`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}



export const MarkReadNotification = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/notification-read/${id}`);
        return response.data;

    } catch (error) {
        console.log(error);
        return { success: false };
    }
};