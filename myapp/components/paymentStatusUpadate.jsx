import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { updatePayments } from "../hooks/usePayments";
import { useDispatch } from "react-redux";
import { updateAPayments } from "../features/paymentSlice";
import { Ionicons } from "@expo/vector-icons";

const UpdatePaymentStatusModal = ({ visible, onClose, selectedPayment }) => {
    const dispatch = useDispatch();

    const onUpdateStatus = async (id, status) => {
        const response = await updatePayments(id, { paymentStatus: status, });
        if (response.success) {
            dispatch(updateAPayments(response.payment));
            Alert.alert("Success", response.message);
            onClose();
        }
    };

    return (

        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} >
            <View style={styles.overlay}>

                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose} >
                        <Ionicons name="close" size={22} color="#6B7280" />
                    </TouchableOpacity>

                    <View style={styles.iconWrapper}>
                        <Ionicons name="wallet-outline" size={40} color="#2563EB" />
                    </View>

                    <Text style={styles.title}> Update Payment Status </Text>

                    <View style={styles.transactionCard}>
                        <Text style={styles.transactionLabel}> Transaction ID </Text>
                        <Text style={styles.transactionId}>  #{selectedPayment?.transactionId} </Text>
                    </View>

                    <TouchableOpacity style={[styles.statusBtn, styles.paidBtn]} onPress={() => onUpdateStatus(selectedPayment?._id, "Paid")} >
                        <Ionicons name="checkmark-circle" size={22} color="#fff" />
                        <Text style={styles.btnText}>Mark as Paid</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.statusBtn, styles.pendingBtn]} onPress={() => onUpdateStatus(selectedPayment?._id, "Pending")} >
                        <Ionicons name="time-outline" size={22} color="#fff" />
                        <Text style={styles.btnText}>Mark as Pending</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.statusBtn, styles.cancelBtn]} onPress={() => onUpdateStatus(selectedPayment?._id, "Failed")} >
                        <Ionicons name="close-circle" size={22} color="#fff" />
                        <Text style={styles.btnText}>Cancel Payment</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

export default UpdatePaymentStatusModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(15,23,42,0.65)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    modalContainer: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 24,
        elevation: 15,
    },

    closeIcon: {
        position: "absolute",
        top: 18,
        right: 18,
        zIndex: 10,
    },

    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#EEF4FF",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 16,
    },

    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        textAlign: "center",
        marginBottom: 20,
    },

    transactionCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 18,
        padding: 16,
        marginBottom: 24,
        alignItems: "center",
    },

    transactionLabel: {
        fontSize: 13,
        color: "#64748B",
        marginBottom: 6,
    },

    transactionId: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },

    statusBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 14,
    },

    paidBtn: {
        backgroundColor: "#16A34A",
    },

    pendingBtn: {
        backgroundColor: "#F59E0B",
    },

    cancelBtn: {
        backgroundColor: "#EF4444",
    },

    btnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});