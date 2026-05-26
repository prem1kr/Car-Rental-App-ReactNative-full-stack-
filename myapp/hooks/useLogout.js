import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";


export const Logout = async () => {
    try {
        await axios.post('https://car-rental-app-backend-wxdr.onrender.com/api/auth/logout');
        await AsyncStorage.removeItem('userId');
         await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        Alert.alert('Succes', 'Logout Successfully');

    } catch (error) {
        console.log(error);
    }
}