import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useDispatch} from 'react-redux';
import { setLocation } from '@/features/locationSlice';

export default function useCurrentLocation() {
    const [locationName, setLocationName] = useState("Loading...");
    const [coords, setCoords] = useState(null);

    const dispatch = useDispatch();

    const fetchLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setLocationName("Permission denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCoords(location.coords);

            const { latitude, longitude } = location.coords;

            const res = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            const data = await res.json();

            const city = data.city || data.locality || "Unknown City";
            const state = data.principalSubdivisionCode;

            setLocationName(`${city}, ${state}`);

            dispatch(setLocation({
                city,
                state,
                coords: { latitude, longitude }
            }));

        } catch (err) {
            console.log(err);
            setLocationName("Error getting location");
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);


    return { locationName, coords };
}