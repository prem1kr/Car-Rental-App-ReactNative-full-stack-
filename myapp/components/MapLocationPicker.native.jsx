import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

const MapLocationPicker = ({ visible, onClose, onSelectLocation }) => {
    const [address, setAddress] = useState("");

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            setAddress(data.address || "");
            onSelectLocation?.({
                latitude: data.latitude,
                longitude: data.longitude,
                address: data.address,
            });
            onClose?.();
        } catch (error) {
            console.log("WebView message error:", error);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose} >
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>  Select Location </Text>
                    <View style={{ width: 24 }} />
                </View>

                {Platform.OS === "web" ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }} >
                        <Ionicons name="map-outline" size={60} color="#4ec28d" />
                        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 15 }} > Map Picker </Text>
                        <Text style={{ textAlign: "center", marginTop: 10, color: "#666" }} >
                            Map selection is available on Android and iOS.
                            React Native WebView is not supported on Expo Web.
                        </Text>
                    </View>
                ) : (
                    <WebView style={styles.webview} originWhitelist={["*"]} javaScriptEnabled domStorageEnabled allowFileAccess allowUniversalAccessFromFileURLs onMessage={handleMessage}
                        source={require("../assets/map/mapTemplate.html")} />)}

                {address ? (
                    <View style={styles.addressContainer}>
                        <Text style={styles.addressText}>  {address} </Text>
                    </View>
                ) : null}
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

    webview: {
        flex: 1,
    },

    addressContainer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
    },

    addressText: {
        fontSize: 14,
        color: "#333",
    },
});