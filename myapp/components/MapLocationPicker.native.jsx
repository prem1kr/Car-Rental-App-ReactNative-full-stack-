import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const MapLocationPicker = ({ visible, onClose, onSelectLocation }) => {
    const [region, setRegion] = useState({
        latitude: 28.6139,
        longitude: 77.2090,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const [marker, setMarker] = useState({
        latitude: 28.6139,
        longitude: 77.2090,
    });

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            setRegion(newRegion);
            setMarker({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleMapPress = (event) => {
        const { latitude, longitude } =
            event.nativeEvent.coordinate;
        setMarker({ latitude, longitude });
    };

    const confirmLocation = () => {
        onSelectLocation?.({
            latitude: marker.latitude,
            longitude: marker.longitude,
        });

        onClose?.();
    };

    return (
        <Modal visible={visible}  animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}> Select Location  </Text>
                    <TouchableOpacity onPress={getCurrentLocation}>
                        <Ionicons name="locate"  size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <MapView style={styles.map} region={region} onPress={handleMapPress} showsUserLocation showsMyLocationButton>
                    <Marker coordinate={marker} draggable onDragEnd={(e) => setMarker(e.nativeEvent.coordinate) }/>
                </MapView>

                <View style={styles.bottomContainer}>
                    <Text style={styles.coordinates}> Lat: {marker.latitude.toFixed(5)} {"\n"} Lng: {marker.longitude.toFixed(5)} </Text>
                    <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation} >
                        <Text style={styles.confirmText}>  Confirm Location </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    );
};

export default MapLocationPicker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        height: 70,
        backgroundColor: "#4ec28d",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingTop: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
    },

    map: {
        flex: 1,
    },

    bottomContainer: {
        backgroundColor: "#fff",
        padding: 15,
    },

    coordinates: {
        fontSize: 14,
        marginBottom: 12,
        color: "#555",
    },

    confirmBtn: {
        backgroundColor: "#4ec28d",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});