import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useRouter } from "expo-router";

const MapLocationPicker = ({ visible, onClose, onSelectLocation }) => {
    const [address, setAddress] = useState("");
    const mapHTML = Platform.OS === "web" ? null : require("../assets/map/mapTemplate.html");
    const router = useRouter();
    return (
        <Modal visible={visible} animationType="slide">
            <View style={{ flex: 1 }}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Select Location</Text>
                </View>

                <WebView originWhitelist={["*"]} source={Platform.OS === "web" ? { uri: "https://unpkg.com/leaflet/dist/examples.html" } : require("../assets/map/mapTemplate.html")}
                    onMessage={(event) => {
                        const data = JSON.parse(event.nativeEvent.data);
                        setAddress(data.address);
                        onSelectLocation({
                            latitude: data.latitude,
                            longitude: data.longitude,
                            address: data.address,
                        });
                    }}
                />

            </View>
        </Modal>
    );
};

export default MapLocationPicker;

const styles = StyleSheet.create({
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
        marginLeft: 15,
    },
});