import React, { useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LoadingButton from "./loadingButton";

const OrderPlacedSuccessModal = ({ visible, onTrackOrder, onClose }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 700, easing: Easing.ease, useNativeDriver: true }),

                Animated.sequence([
                    Animated.timing(bounceAnim, { toValue: -15, duration: 300, useNativeDriver: true }),
                    Animated.spring(bounceAnim, { toValue: 0, friction: 3, tension: 120, useNativeDriver: true }),
                ]),
            ]).start();
        }
    }, [visible]);


    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose} >
            <View style={styles.overlay}>

                <Animated.View style={[styles.modalContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} >
                    <Animated.View style={{ transform: [{ translateY: bounceAnim }] }} >
                        <View style={styles.iconWrapper}>
                            <Ionicons name="bag-check" size={85} color="#1F8A70" />
                        </View>
                    </Animated.View>

                    <Text style={styles.title}> Order Placed!  </Text>
                    <Text style={styles.subtitle}> Your order has been placed successfully and is now being processed. </Text>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>  Order Status </Text>
                            <Text style={styles.value}>  Pending </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}> Payment Status </Text>
                            <Text style={styles.success}>  Verifying </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}> Estimated Confermation Time</Text>
                            <Text style={styles.value}>2 - 3 Minitus  </Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.trackButton} onPress={() => router.replace("/pages/booking")}>
                        <Text style={styles.trackButtonText}>  Track Order </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose} >
                        <Text style={styles.closeButtonText}> Continue Shopping </Text>
                    </TouchableOpacity>

                </Animated.View>
            </View>
        </Modal>
    );
};

export default OrderPlacedSuccessModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    modalContainer: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        padding: 25,
        alignItems: "center",
    },

    iconWrapper: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#E8F8F3",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#111827",
        textAlign: "center",
    },

    subtitle: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 24,
        color: "#6B7280",
        textAlign: "center",
        paddingHorizontal: 10,
    },

    card: {
        width: "100%",
        backgroundColor: "#F9FAFB",
        borderRadius: 18,
        padding: 20,
        marginTop: 28,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    label: {
        fontSize: 15,
        color: "#6B7280",
    },

    value: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    success: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#10B981",
    },

    trackButton: {
        width: "100%",
        backgroundColor: "#1F8A70",
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 28,
    },

    trackButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    closeButton: {
        width: "100%",
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 14,
    },

    closeButtonText: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "600",
    },
});