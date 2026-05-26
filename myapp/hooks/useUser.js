import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = 'https://car-rental-app-backend-wxdr.onrender.com/api/auth'

export const userInfo = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_URL}/user`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(
            error?.response?.data || error.message
        );
    }
};


export const getAlluser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/all-user/${userId}`);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}