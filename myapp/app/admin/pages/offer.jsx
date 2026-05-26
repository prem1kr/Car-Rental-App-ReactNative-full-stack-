import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {  useRouter } from 'expo-router';
import { AddOffers, deleteOffers, getOffers } from '../../../hooks/offers';
import { useDispatch, useSelector } from 'react-redux';
import { setDeleteOffer, setOffer, setOfferRedux } from '../../../features/offerSlice';

const AddOffer = () => {
    const router = useRouter();
    const [offerTitle, setOfferTitle] = useState('');
    const [discount, setDiscount] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [validity, setValidity] = useState('');
    const dispatch = useDispatch();
    const offer = useSelector(state => state.offer.offer || []);

    const handleAddOffer = async () => {
        if (!offerTitle || !discount || !description || !code || !validity) {
            Alert.alert('Error', 'Please fill all details');
            return;
        }
        try {
            const data = { title: offerTitle, discount, description, code, validity };
            const response = await AddOffers(data);
            dispatch(setOfferRedux(response.offers));
            setOfferTitle('');
            setDiscount('');
            setDescription('');
            setValidity('');
            setCode('');
            Alert.alert('Success', 'Offer Added Successfully');

        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const handleofferdata = async () => {
        try {
            const response = await getOffers();
            dispatch(setOffer(response.offers))
        } catch (error) {
            console.log(error);
        }

    }

    const handleDeleteOffer = async (id) => {
        try {
            dispatch(setDeleteOffer(id));
            const response = await deleteOffers(id);
            if (response?.success) {
                Alert.alert("Offer deleted successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleofferdata();
    }, []);

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}> Add Offers </Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >

                        <View style={styles.formCard}>
                            <Text style={styles.sectionTitle}> Create Offer </Text>

                            <View style={styles.inputContainer}>
                                <Ionicons name="gift-outline" size={20} color="#2563EB" />
                                <TextInput placeholder="Offer Title" placeholderTextColor="#9CA3AF" style={styles.input} value={offerTitle} onChangeText={setOfferTitle} />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="pricetag-outline" size={20} color="#2563EB" />
                                <TextInput placeholder="Discount (Example: 20% OFF)" placeholderTextColor="#9CA3AF" style={styles.input} value={discount} onChangeText={setDiscount} />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="code-outline" size={20} color="#2563EB" />
                                <TextInput placeholder="code (Example: MJVP256)" placeholderTextColor="#9CA3AF" style={styles.input} value={code} onChangeText={setCode} maxLength={10} />
                            </View>

                            <View style={styles.messageBox}>
                                <TextInput placeholder="Offer Description" placeholderTextColor="#9CA3AF" multiline style={styles.messageInput} value={description} onChangeText={setDescription} />
                            </View>


                            <View style={styles.inputContainer}>
                                <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                                <TextInput placeholder="Validity Date" placeholderTextColor="#9CA3AF" style={styles.input} value={validity} onChangeText={setValidity} />
                            </View>

                            <TouchableOpacity style={styles.addButton} onPress={handleAddOffer}>
                                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                                <Text style={styles.buttonText}> Add Offer </Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.offerSection}>
                            <Text style={styles.sectionTitle}> Active Offers </Text>

                            {offer.map((item) => (
                                <View key={item.id} style={styles.offerCard} >
                                    <View style={styles.offerTop}>

                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>{item.discount}</Text>
                                        </View>

                                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteOffer(item._id)}>
                                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                        </TouchableOpacity>

                                    </View>

                                    <Text style={styles.offerTitle}>{item.title}</Text>
                                    <Text style={styles.offerDesc}> {item.description.length > 47 ? item.description.slice(0, 50) + '...' : item.description}</Text>
                                    <View style={styles.codeBox}>
                                        <Text style={styles.code}>{item.code}</Text>
                                    </View>
                                    <Text style={styles.validity}> Valid till {item.validity} </Text>
                                </View>
                            ))}

                        </View>

                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AddOffer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
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
        marginLeft: 80,
        color: '#111827',
    },

    content: {
        padding: 10,
        paddingBottom: 40,
    },

    formCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 21,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 18,
    },

    inputContainer: {
        height: 58,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: '#111827',
    },

    messageBox: {
        minHeight: 120,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },

    messageInput: {
        textAlignVertical: 'top',
        fontSize: 15,
        color: '#111827',
    },

    addButton: {
        height: 56,
        backgroundColor: '#2563EB',
        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'row',
        gap: 10,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },

    offerSection: {
        marginTop: 28,
    },

    offerCard: {
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },

    offerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },

    discountBadge: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 30,
    },

    discountText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },

    deleteButton: {
        width: 38,
        height: 38,
        borderRadius: 20,
        backgroundColor: '#FEE2E2',

        justifyContent: 'center',
        alignItems: 'center',
    },

    offerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },

    offerDesc: {
        color: '#6B7280',
        marginTop: 8,
        lineHeight: 22,
        fontSize: 14,
    },

    validity: {
        marginTop: 14,
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 14,
    },

    codeBox: {
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#09bc63',
        paddingVertical: 6,
        borderRadius: 8,
        maxWidth: 130
    },

    code: {
        fontWeight: '700',
        letterSpacing: 1,
        alignSelf: 'center'
    },
});