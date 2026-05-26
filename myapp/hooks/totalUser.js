import axios from "axios";

export const totalUser = async () => {
    try {
        const response = await axios.get('https://car-rental-app-backend-wxdr.onrender.com/api/auth/total-user');
        return response.data;

    } catch (error) {
        console.log(error);
    }
}