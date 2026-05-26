import axios from "axios";

export const AddOffers = async (data) => {
    try {
        const response = await axios.post(`https://car-rental-app-backend-wxdr.onrender.com/api/offer/offer-add`, data);
        return response.data;

    } catch (error) {
        console.log(error);
    }
}

export const getOffers = async () => {
    try {
        const response = await axios.get('https://car-rental-app-backend-wxdr.onrender.com/api/offer/offer-get');
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteOffers = async (id) => {
    try {
        const response = axios.delete(`https://car-rental-app-backend-wxdr.onrender.com/api/offer/offer-delete/${id}`);
        return response.data;

    } catch (error) {
        console.log(error)
    }
}