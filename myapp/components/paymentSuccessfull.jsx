import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OrderPlacedSuccessModal from "./orderPlaced";

const PaymentSuccessModal = ({ visible, onClose,transactionId,amount,paymentMethod }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [orderVisible, setOrderVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 700, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleDone = () => {
    onClose();
    setOrderVisible(true);
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>

          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} >
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]} >
              <Ionicons name="checkmark-circle" size={110} color="#1F8A70" />
            </Animated.View>

            <Text style={styles.title}> Payment Successful! </Text>
            <Text style={styles.subtitle}> Your payment has been completed successfully. </Text>

            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}> Transaction ID </Text>
                <Text style={styles.value}>  {transactionId} </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}> Amount </Text>
                <Text style={styles.value}>  ₹ {amount} </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}> Payment Method </Text>
                <Text style={styles.value}> {paymentMethod}  </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleDone}>
              <Text style={styles.buttonText}>  Done  </Text>
            </TouchableOpacity>

          </Animated.View>
        </View >
      </Modal >
      <OrderPlacedSuccessModal visible={orderVisible} onClose={() => { setOrderVisible(false) }} />

    </>
  );
};

export default PaymentSuccessModal;

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

  iconContainer: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 20,
    marginTop: 30,
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

  button: {
    width: "100%",
    marginTop: 30,
    backgroundColor: "#1F8A70",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});