import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createPayments } from "../../hooks/usePayments";
import LoadingButton from "../../components/loadingButton";
import { useDispatch, useSelector } from "react-redux";
import { setPayments } from "../../features/paymentSlice";
import VerifyingPaymentModal from "../../components/paymentVerifying";
import PaymentSuccessModal from "../../components/paymentSuccessfull";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { referalDetails } from "../../hooks/useReferal";
import { setReferal } from "../../features/referalSlice";
import OrderPlacedSuccessModal from "../../components/orderPlaced";

const PaymentScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { booking } = useLocalSearchParams();
    const bookingData = JSON.parse(booking);
    const offers = useSelector(state => state.offer.offer || []);
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyVisible, setVerifyVisible] = useState(false);
    const [paymentSuccessVisible, setPaymentSuccessVisible] = useState(false);
    const [offerCode, setOfferCode] = useState("");
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [rewardAmount, setRewardAmount] = useState(0);
    const [rewardApplied, setRewardApplied] = useState(false);
    const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);
    const user = useSelector(state => state.user.user || {});
    const referal = useSelector(state => state.referal.referal || []);

    // discount
    const getDiscountPercent = (discountString) => {
        if (!discountString) return 0;
        const match = discountString.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    };

    const applyOffer = () => {
        const code = offerCode.trim().toUpperCase();
        const offer = offers.find((o) => o.code?.toUpperCase() === code);
        if (!offer) {
            setAppliedOffer(null);
            setDiscountAmount(0);
            return Alert.alert("Invalid Code", "Offer not found");
        }
        const percent = getDiscountPercent(offer.discount);
        const total = bookingData?.totalPrice || 0;
        const discount = (total * percent) / 100;
        setAppliedOffer(offer);
        setDiscountAmount(discount);
        Alert.alert("Success", `${percent}% discount applied 🎉`);
    };

    const appliedReward = () => {
        const availableReward = referal?.totalEarning || 0;
        if (availableReward <= 0) {
            return Alert.alert("No Reward", "You don't have any reward balance");
        }

        const maxReward = finalPrice - rewardAmount;
        const usableReward = Math.min(availableReward, maxReward);
        setRewardAmount(usableReward);
        setRewardApplied(true);
        Alert.alert("Success", `₹${usableReward} reward applied successfully 🎉`);
    };


    const originalPrice = bookingData?.totalPrice || 0;
    const finalPrice = Math.max(originalPrice - discountAmount - rewardAmount, 0);

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
                amount: finalPrice,
                paymentMethod,
                transactionId,
            };

            const res = await createPayments(payload);
            if (res.success) {
                dispatch(setPayments(res.payment));
                if (paymentMethod === "Cash") {
                    setOrderSuccessVisible(true);
                } else {
                    startPaymentFlow();
                }
            }

        } catch (error) {
            console.log("ERROR =>", error?.response?.data || error.message);
            Alert.alert("Error", error?.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchReferralData = async () => {
        const userid = await AsyncStorage.getItem("userId");
        const currentUserId = user?.id || userid || user?._id;
        const response = await referalDetails(currentUserId);
        if (response.success) {
            dispatch(setReferal({
                referralCode: response.referralCode,
                totalEarning: response.totalEarning,
                invites: response.invites
            }));
        }
    };

    useEffect(() => {
        fetchReferralData();
    }, []);

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payments</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Booking Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Booking Details</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Pickup Date</Text>
                        <Text style={styles.value}>
                            {new Date(bookingData?.pickupDate).toDateString()}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Return Date</Text>
                        <Text style={styles.value}>
                            {new Date(bookingData?.returnDate).toDateString()}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Pickup Location</Text>
                        <Text style={styles.value}>
                            {bookingData?.pickupLocation}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Drop Location</Text>
                        <Text style={styles.value}>
                            {bookingData?.dropLocation}
                        </Text>
                    </View>
                </View>

                {/* Payment Summary */}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Amount</Text>
                        <View style={{ alignItems: "flex-end" }}>
                            {(discountAmount > 0 || rewardAmount > 0) && (
                                <Text style={{ textDecorationLine: "line-through", color: "#999" }}> ₹ {originalPrice} </Text>
                            )}
                            <Text style={styles.price}>₹ {finalPrice}</Text>
                        </View>
                    </View>

                    {discountAmount > 0 && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Offer Discount</Text>
                            <Text style={{ color: "green", fontWeight: "700" }}> - ₹ {discountAmount}</Text>
                        </View>
                    )}

                    {rewardAmount > 0 && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Reward Discount</Text>
                            <Text style={{ color: "green", fontWeight: "700" }}> - ₹ {rewardAmount}</Text>
                        </View>
                    )}

                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.sectionTitle}>Apply Offer</Text>

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TextInput placeholder="Enter offer code" value={offerCode} onChangeText={setOfferCode} style={[styles.input, { flex: 1 }]} placeholderTextColor="#999" />
                            <TouchableOpacity onPress={applyOffer} style={{ backgroundColor: "#1F8A70", paddingHorizontal: 14, justifyContent: "center", borderRadius: 10 }}>
                                <Text style={{ color: "#fff", fontWeight: "600" }}>Apply </Text>
                            </TouchableOpacity>
                        </View>

                        {appliedOffer && (
                            <Text style={{ marginTop: 8, color: "green", fontWeight: "600" }}> 🎉 {appliedOffer.title} Applied</Text>
                        )}
                    </View>

                    {referal?.invites?.length !== 0 && referal?.totalEarning !== 0 && <View style={{ marginTop: 15 }}>
                        <Text style={styles.sectionTitle}>Apply Referal Reward</Text>

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Text style={[styles.input, { flex: 1 }]} placeholderTextColor="#999" >₹ {referal.totalEarning || 0}</Text>
                            <TouchableOpacity onPress={appliedReward} style={{ backgroundColor: "#1F8A70", paddingHorizontal: 14, justifyContent: "center", borderRadius: 10 }}>
                                <Text style={{ color: "#fff", fontWeight: "600" }}>Apply </Text>
                            </TouchableOpacity>
                        </View>

                        {rewardApplied && (
                            <Text style={{ marginTop: 8, color: "green", fontWeight: "600" }}>  🎉 ₹ {rewardAmount} reward applied </Text>
                        )}
                    </View>
                    }



                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Select Payment Method</Text>

                    <TouchableOpacity style={[styles.paymentOption, paymentMethod === "UPI" && styles.activePayment]} onPress={() => setPaymentMethod("UPI")} >
                        <Ionicons name="phone-portrait-outline" size={22} color="#1F8A70" />
                        <Text style={styles.paymentText}>UPI</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.paymentOption, paymentMethod === "Card" && styles.activePayment]} onPress={() => setPaymentMethod("Card")}>
                        <Ionicons name="card-outline" size={22} color="#1F8A70" />
                        <Text style={styles.paymentText}>Card</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.paymentOption, paymentMethod === "Cash" && styles.activePayment]} onPress={() => setPaymentMethod("Cash")}>
                        <Ionicons name="cash-outline" size={22} color="#1F8A70" />
                        <Text style={styles.paymentText}>Cash</Text>
                    </TouchableOpacity>
                </View>

                {paymentMethod !== "Cash" && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Transaction ID</Text>
                        <TextInput placeholder="Enter transaction ID" value={transactionId} onChangeText={setTransactionId} style={styles.input} placeholderTextColor="#999" />
                    </View>
                )}

                <LoadingButton title={`Pay ₹ ${finalPrice}`} style={styles.payBtn} onPress={handlePayment} loading={loading} />

            </ScrollView>

            {/* Modals */}
            <VerifyingPaymentModal visible={verifyVisible} onClose={() => setVerifyVisible(false)} />
            <PaymentSuccessModal visible={paymentSuccessVisible} onClose={() => setPaymentSuccessVisible(false)} transactionId={transactionId} amount={finalPrice} paymentMethod={paymentMethod} />
            <OrderPlacedSuccessModal visible={orderSuccessVisible} onClose={() => setOrderSuccessVisible(false)}/>
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