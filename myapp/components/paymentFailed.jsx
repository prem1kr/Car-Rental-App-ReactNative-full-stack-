import React, { useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PaymentFailedModal = ({ visible, onRetry, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, easing: Easing.ease, useNativeDriver: true }),
      ]).start(() => { startShakeAnimation(); });
    }
  }, [visible]);

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>

        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] }]}>
          <Ionicons name="close-circle" size={90} color="#EF4444" />

          <Text style={styles.title}>Payment Failed</Text>
          <Text style={styles.subtitle}> Your payment could not be processed. Please try again. </Text>

          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>₹2,500</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.failed}>Declined</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.retryButton} onPress={onRetry} >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose} >
            <Text style={styles.cancelText}> Cancel </Text>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </Modal>
  );
};

export default PaymentFailedModal;

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

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 15,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  infoBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    marginTop: 25,
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

  failed: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#EF4444",
  },

  retryButton: {
    width: "100%",
    backgroundColor: "#EF4444",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  cancelButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
  },

  cancelText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
});