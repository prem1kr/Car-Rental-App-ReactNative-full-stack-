import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "@teovilla/react-native-web-maps";

const MapLocationPicker = ({ visible, onClose, mapRegion, onSelectLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        setSelectedLocation(coordinate);
        onSelectLocation?.({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
        });
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}> Select Location </Text>
                    <View style={{ width: 24 }} />
                </View>

                <MapView provider="google" style={styles.map}
                    initialRegion={{
                        latitude: mapRegion?.latitude || 28.6139,
                        longitude: mapRegion?.longitude || 77.209,
                        latitudeDelta:
                            mapRegion?.latitudeDelta || 0.05,
                        longitudeDelta:
                            mapRegion?.longitudeDelta || 0.05,
                    }} onPress={handleMapPress} >
                    {selectedLocation && (<Marker coordinate={selectedLocation} />)}
                </MapView>
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
        backgroundColor: '#4ec28d',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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