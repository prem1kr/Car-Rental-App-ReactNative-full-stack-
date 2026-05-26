import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, Platform, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPaymentCard, getPaymentCards, deletePaymentCard } from "../../hooks/usePaymentCard";
import { setCardsRedux, addCardRedux, deleteCardRedux } from "../../features/paymentCardSlice";
import { userInfo } from '../../hooks/useUser';
import { setUser } from '../../features/userSlice';

const PaymentMethod = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user || {});
    const cards = useSelector((state) => state.payment.cards || []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        number: "",
        expiry: "",
        cvv: "",
    });

    const fetchCards = async () => {
        try {
            const res = await getPaymentCards(user?.id);
            if (res?.success) {
                dispatch(setCardsRedux(res.payments));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await userInfo();
            if (response.success) {
                dispatch(setUser(response.user));
            }

        } catch (error) {
            console.log(error);
        }
    }


    const handleAddCard = async () => {
        if (!form.name || !form.number || !form.expiry || !form.cvv) {
            Alert.alert("Error", "Fill all fields");
            return;
        }
        try {
            const data = {
                userId: user?.id,
                name: form.name,
                cardNumber: form.number,
                expiry: form.expiry,
                cvv: form.cvv,
            };
            const res = await addPaymentCard(data);
            if (res?.success) {
                dispatch(addCardRedux(res.payment));
                Alert.alert("Success", "Card Added");
            }
            setForm({ name: "", number: "", expiry: "", cvv: "" });
            setShowForm(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            dispatch(deleteCardRedux(id));
            const res = await deletePaymentCard(id);
            if (res?.success) {
                Alert.alert("Deleted", "Card Removed");
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (user?._id || user?.id) {
            fetchCards();
        }
    }, [user]);

    useEffect(() => {
        fetchUserInfo();
    }, []);


    const renderItem = ({ item }) => {
        const last4 = item?.cardNumber
            ? item.cardNumber.slice(-4)
            : "XXXX";

        const masked = `**** **** **** ${last4}`;

        return (
            <View style={styles.cardBox}>
                <Ionicons name="card-outline" size={24} color="#4ec28d" />

                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.cardNumber}>{masked}</Text>
                    <Text style={styles.cardName}>{item?.name}</Text>
                    <Text style={styles.cardExpiry}>
                        Expiry: {item?.expiry}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => handleDelete(item?._id)}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Method</Text>
            </View>

            <FlatList data={cards} keyExtractor={(item) => item.id} contentContainerStyle={{ padding: 16 }} renderItem={renderItem} />

            {!showForm && (
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)} >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addText}>Add New Card</Text>
                </TouchableOpacity>
            )}

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" >
                    {showForm && (
                        <View style={styles.form}>
                            <TextInput placeholder="Card Holder Name" style={styles.input} value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} />
                            <TextInput placeholder="Card Number" style={styles.input} keyboardType="numeric" value={form.number} onChangeText={(text) => setForm({ ...form, number: text })} />

                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <TextInput placeholder="MM/YY" style={[styles.input, { flex: 1 }]} value={form.expiry} onChangeText={(text) => setForm({ ...form, expiry: text })} />
                                <TextInput placeholder="CVV" style={[styles.input, { flex: 1 }]} keyboardType="numeric" value={form.cvv} onChangeText={(text) => setForm({ ...form, cvv: text })} />
                            </View>

                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddCard} >
                                <Text style={styles.saveText}>  Save Card </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PaymentMethod;

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
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',

    },


    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 60,
    },

    cardBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 10,
    },

    cardNumber: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    cardName: {
        fontSize: 12,
        color: '#555',
    },

    cardExpiry: {
        fontSize: 12,
        color: '#777',
    },

    addBtn: {
        flexDirection: 'row',
        backgroundColor: '#4ec28d',
        padding: 14,
        margin: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    addText: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: '600',
    },

    form: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 3,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
    },

    saveBtn: {
        backgroundColor: '#4ec28d',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },

    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});