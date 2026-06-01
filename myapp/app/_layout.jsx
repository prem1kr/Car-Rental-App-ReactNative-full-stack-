import useCurrentLocation from '@/hooks/useCurrentLocation';
import { store } from '@/redux/store';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCars } from '@/features/productSlice';
import { setUser } from '@/features/userSlice';
import { carData } from '../hooks/fetchCars';
import { userInfo } from '../hooks/useUser';
import "leaflet/dist/leaflet.css";

function AppInitializer() {
  const dispatch = useDispatch();
  useCurrentLocation();

  const userData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
      } else {
        const response = await userInfo();
        dispatch(setUser(response.user));
      }
      const response = await carData();
      if (response?.success) {
        dispatch(setCars(response.cars));
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  return null;
}

export default function RootLayout() {

  return (
    <Provider store={store}>
      <AppInitializer />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
      </Stack>
    </Provider>
  );
}
