import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createPayments, getSinglePayments } from "../../hooks/usePayments";
import LoadingButton from "../../components/loadingButton";
import { useDispatch } from 'react-redux';
import { setPayments } from "../../features/paymentSlice";
import VerifyingPaymentModal from "../../components/paymentVerifying";
import PaymentSuccessModal from "../../components/paymentSuccessfull";

const PaymentScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { booking } = useLocalSearchParams();
    const bookingData = JSON.parse(booking);
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyVisible, setVerifyVisible] = useState(false);
    const [paymentSuccessVisible, setPaymentSuccessVisible] = useState(false);
    // const [paymentId , setPaymentId] = useState();


    const startPaymentFlow = () => {
        setVerifyVisible(true);
        setTimeout(() => {
            setVerifyVisible(false);
            setPaymentSuccessVisible(true);
        }, 5000);
    };

    const handlePayment = async () => {
        try {
            if (paymentMethod !== "Cash" && !transactionId) {
                return Alert.alert("Error", "Please enter transaction ID");
            }
            setLoading(true);
            const payload = {
                bookingId: bookingData?._id,
                userId: bookingData?.userId?.toString?.() || bookingData?.userId,
                amount: bookingData?.totalPrice,
                paymentMethod: bookingData?.paymentMethod,
                transactionId,
            };
            const res = await createPayments(payload);
            if (res.success) {
                // setPaymentId(res.payment._id);
                dispatch(setPayments(res.payment));
                startPaymentFlow();
            } else {
                Alert.alert("Error", res.message);
            }
        } catch (error) {

            console.log(
                "FULL ERROR =>",
                error?.response?.data || error.message
            );

            Alert.alert(
                "Error",
                error?.response?.data?.message || "Payment failed"
            );


        } finally {
            setLoading(false);
        }
    };

    // const fetchPayment = async () => {
    //     const response = await getSinglePayments(paymentId);
    //     if (response.success) {
    //         dispatch(setPayments(response.payment));
    //     }
    // }

    // useEffect(() => {
    //     if (paymentId) {
    //         fetchPayment();
    //     }
    // }, [paymentId]);




    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payments</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}> Booking Details </Text>

                    <View style={styles.row}>
                        <Text style={styles.label}> Pickup Date </Text>
                        <Text style={styles.value}> {new Date(bookingData?.pickupDate).toDateString()} </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}> Return Date </Text>
                        <Text style={styles.value}> {new Date(bookingData?.returnDate).toDateString()}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}> Pickup Location </Text>
                        <Text style={styles.value}>{bookingData?.pickupLocation} </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}> Drop Location</Text>
                        <Text style={styles.value}> {bookingData?.dropLocation} </Text>
                    </View>

                </View>


                <View style={styles.card}>
                    <Text style={styles.sectionTitle}> Payment Summary </Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Total Amount </Text>
                        <Text style={styles.price}> ₹ {bookingData?.totalPrice}</Text>
                    </View>

                </View>


                <View style={styles.card}>
                    <Text style={styles.sectionTitle}> Select Payment Method </Text>
                    <TouchableOpacity style={[styles.paymentOption, paymentMethod === "UPI" && styles.activePayment]} onPress={() => setPaymentMethod("UPI")} >
                        <Ionicons name="phone-portrait-outline" size={22} color="#1F8A70" />
                        <Text style={styles.paymentText}> UPI </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.paymentOption, paymentMethod === "Card" && styles.activePayment]} onPress={() => setPaymentMethod("Card")}>
                        <Ionicons name="card-outline" size={22} color="#1F8A70" />
                        <Text style={styles.paymentText}> Card </Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={[styles.paymentOption, paymentMethod === "Cash" && styles.activePayment]} onPress={() => setPaymentMethod("Cash")} >
                        <Ionicons name="cash-outline" size={22} color="#1F8A70" />
                        <Text style={styles.paymentText}> Cash</Text>
                    </TouchableOpacity>

                </View>


                {paymentMethod !== "Cash" && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}> Transaction ID </Text>
                        <TextInput placeholder="Enter transaction ID" value={transactionId} onChangeText={setTransactionId} style={styles.input} placeholderTextColor="#999" />
                    </View>
                )}

                {loading ? <LoadingButton /> : <TouchableOpacity style={styles.payBtn} onPress={handlePayment} disabled={loading} >
                    <Text style={styles.payBtnText}>  Pay ₹ {bookingData?.totalPrice} </Text>
                </TouchableOpacity>}
            </ScrollView>

            <VerifyingPaymentModal visible={verifyVisible} onClose={() => setVerifyVisible(false)} />
            <PaymentSuccessModal visible={paymentSuccessVisible} onClose={() => setPaymentSuccessVisible(false)} />

        </View>
    );
};

export default PaymentScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
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
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 60,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 14,
        color: "#000",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    label: {
        color: "#666",
        fontSize: 15,
    },

    value: {
        color: "#000",
        fontWeight: "600",
        width: "55%",
        textAlign: "right",
    },

    price: {
        color: "#1F8A70",
        fontWeight: "700",
        fontSize: 18,
    },

    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
    },

    activePayment: {
        borderColor: "#1F8A70",
        backgroundColor: "#E8F6F2",
    },

    paymentText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: "#000",
    },

    payBtn: {
        backgroundColor: "#1F8A70",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 40,
    },

    payBtnText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },

});