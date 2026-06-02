import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "@teovilla/react-native-web-maps";
import { Ionicons } from "@expo/vector-icons";

const GOOGLE_MAPS_API_KEY = "AIzaSyCfReUxeYM09BiDk-GjlOnPaa4u8HDXAfw";

const MapLocationPicker = ({ visible, onClose, mapRegion, onSelectLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        if (mapRegion) {
            setSelectedLocation(mapRegion);
        }
    }, [mapRegion]);

    const handleSelect = () => {
        if (selectedLocation) {
            onSelectLocation(selectedLocation);
        }
        onClose();
    };

    const handleMapPress = (e) => {
        const coord = e?.nativeEvent?.coordinate;
        if (coord) {
            setSelectedLocation(coord);
        }
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.title}>Select Location</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.mapContainer}>
                    <MapView provider="google" googleMapsApiKey={GOOGLE_MAPS_API_KEY} style={styles.map} initialRegion={mapRegion} onPress={handleMapPress}> {selectedLocation && (<Marker coordinate={selectedLocation} />)}
                    </MapView>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSelect}>
                    <Text style={styles.buttonText}>Confirm Location</Text>
                </TouchableOpacity>
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
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
    },

    mapContainer: {
        flex: 1,
    },

    map: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    button: {
        backgroundColor: "#000",
        margin: 15,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});