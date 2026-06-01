import React, { useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, Animated, Easing, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const VerifyingPaymentModal = ({ visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.loop(
          Animated.timing(rotateAnim, { toValue: 1, duration: 2200, easing: Easing.linear, useNativeDriver: true })),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const rotateInterpolate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>

        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} >
          <Animated.View style={[styles.iconWrapper, { transform: [{ rotate: rotateInterpolate }] }]} >
            <Ionicons name="shield-checkmark" size={85} color="#1F8A70" />
          </Animated.View>

          <Text style={styles.title}> Verifying Payment </Text>
          <Text style={styles.subtitle}> Please wait while we securely verify your transaction. </Text>

          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1F8A70" />
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}> Transaction Status</Text>
              <Text style={styles.pending}>  Processing... </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}> Estimated Time </Text>
              <Text style={styles.value}>   20 - 60 seconds </Text>
            </View>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

export default VerifyingPaymentModal;

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
    borderRadius: 24,
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
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
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

  loaderContainer: {
    marginTop: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    marginTop: 30,
    padding: 18,
    borderRadius: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
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

  pending: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#F59E0B",
  },
});