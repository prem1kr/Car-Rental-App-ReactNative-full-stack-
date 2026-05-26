import axios from "axios";

const API_URL = 'https://car-rental-app-backend-wxdr.onrender.com/api/profile';


export const ProfileData = async (email, name) => {
    try {
        const response = await axios.get(`${API_URL}/profile-get`,
            {
                params: { email, name }
            }
        );
        return response.data;

    } catch (error) {
        console.log(error);
        return { success: false, message: 'Error fetching profile' };
    }
};


export const ProfileUpdate = async (updatedProfile) => {
    try {
        const response = await axios.post(`${API_URL}/profile-edit`, updatedProfile);
        return response.data;

    } catch (error) {
        console.log(error);
        return { success: false, message: 'Error updating profile' };
    }
};