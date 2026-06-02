import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "@teovilla/react-native-web-maps";
import * as Location from "expo-location";

const MapLocationPicker = ({ visible, onClose, mapRegion, onSelectLocation }) => {
    const mapRef = useRef(null);

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentRegion, setCurrentRegion] = useState(null);

    useEffect(() => {
        if (visible) {
            getCurrentLocation();
        }
    }, [visible]);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Required",
                    "Location permission is required to access your current location."
                );

                setCurrentRegion({
                    latitude: mapRegion?.latitude || 28.6139,
                    longitude: mapRegion?.longitude || 77.2090,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });

                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            };

            setCurrentRegion(region);
            setSelectedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            setTimeout(() => {
                mapRef.current?.animateToRegion?.(region, 1000);
            }, 500);
        } catch (error) {
            console.log("Location Error:", error);
            setCurrentRegion({
                latitude: mapRegion?.latitude || 28.6139,
                longitude: mapRegion?.longitude || 77.2090,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    };

    const handleMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        setSelectedLocation(coordinate);
        onSelectLocation?.({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
        });

        mapRef.current?.animateToRegion?.(
            {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            },
            500
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose} >
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}> Select Location </Text>
                    <View style={{ width: 24 }} />
                </View>

                {currentRegion && (
                    <MapView ref={mapRef} key={`${currentRegion.latitude}-${currentRegion.longitude}`} provider="google" style={styles.map} initialRegion={currentRegion} showsUserLocation={true} followsUserLocation={true} onPress={handleMapPress} >
                        {selectedLocation && (<Marker coordinate={selectedLocation} />)}
                    </MapView>
                )}
            </View>
        </Modal>
    );
};

export default MapLocationPicker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    header: {
        height: 70,
        backgroundColor: "#4ec28d",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
    },

    map: {
        flex: 1,
    },
});