import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, getUserAddresses, updateAddress, deleteAddress, setDefaultAddress } from '../../hooks/useAddress';
import { setAddressesRedux, addAddressRedux, updateAddressRedux, deleteAddressRedux, setDefaultAddressRedux } from '../../features/addressSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddressPage = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(state => state.user.user || []);
    const addresses = useSelector(state => state.address.addresses || []);
    const [modalVisible, setModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [form, setForm] = useState({
        label: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });


    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };


    const fetchAddresses = async () => {
        try {
            const response = await getUserAddresses(user?.id);
            if (response?.success) {
                dispatch(setAddressesRedux(response.addresses));
            }
        } catch (error) {
            console.log(error);
        }
    };
     
    useEffect(() => {
        if (user?._id || user?.id) {
            fetchAddresses();
        }
    }, [user]);

    const openAddModal = () => {
        setForm({ label: '', address: '', city: '', state: '', pincode: '' });
        setEditIndex(null);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!form.label || !form.address || !form.city || !form.state || !form.pincode) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        try {
            if (editIndex !== null) {
                const response = await updateAddress(editIndex, form);
                if (response?.success) {
                    dispatch(updateAddressRedux(response.address));
                    Alert.alert('Success', 'Address Updated');
                }
            } else {
                const data = {
                    userId: user?.id,
                    label: form.label,
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode,
                };
                const response = await addAddress(data);
                if (response?.success) {
                    dispatch(addAddressRedux(response.newAddress));
                    Alert.alert('Success', 'Address Added');
                }
            }
            setModalVisible(false);
            fetchAddresses();

        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (item) => {
        setForm(item);
        setEditIndex(item._id);
        setModalVisible(true);
        fetchAddresses();
    };

    const handleDelete = async (id) => {
        try {
            dispatch(deleteAddressRedux(id));
            const response = await deleteAddress(id);
            if (response?.success) {
                Alert.alert('Success', 'Address Deleted');
                fetchAddresses();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const setDefault = async (addressId) => {
        try {
            const response = await setDefaultAddress(
                user?.id,
                addressId
            );
            if (response?.success) {
                dispatch(setDefaultAddressRedux(addressId));
                fetchAddresses();
                Alert.alert('Success', 'Default Address Updated');
            }
        } catch (error) {
            console.log(error);
        }
    };




    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Text style={styles.label}> {item.label} {item.isDefault && '⭐'}</Text>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Ionicons name="create-outline" size={18} color="#4ec28d" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item._id)} style={{ marginLeft: 10 }}>
                        <Ionicons name="trash-outline" size={18} color="red" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.text}>{item.address}</Text>
            <Text style={styles.text}>{item.city}, {item.state} - {item.pincode} </Text>
            <TouchableOpacity onPress={() => setDefault(item._id)}>
                <Text style={styles.defaultBtn}>Set as Default</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}> Saved Address</Text>
            </View>

            <View style={styles.content}>
                <FlatList data={addresses} keyExtractor={(item) => item._id} renderItem={renderItem} ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 50 }}> No address added </Text>
                } />
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" >

                        <View style={styles.modalContainer}>
                            <Text style={styles.title}> {editIndex !== null ? 'Edit Address' : 'Add Address'} </Text>
                            <TextInput placeholder="Label (Home / Work)" style={styles.input} value={form.label} onChangeText={(text) => handleChange('label', text)} />
                            <TextInput placeholder="Full Address" style={styles.input} value={form.address} onChangeText={(text) => handleChange('address', text)} />
                            <TextInput placeholder="City" style={styles.input} value={form.city} onChangeText={(text) => handleChange('city', text)} />
                            <TextInput placeholder="State" style={styles.input} value={form.state} onChangeText={(text) => handleChange('state', text)} />
                            <TextInput placeholder="Pincode" style={styles.input} keyboardType="numeric" value={form.pincode} onChangeText={(text) => handleChange('pincode', text)} />

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveText}>Save Address</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancel}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

export default AddressPage;

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

    content: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 60,
    },

    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 10,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
    },

    label: {
        fontWeight: 'bold',
        fontSize: 15,
    },

    text: {
        color: '#555',
        marginTop: 4,
    },

    defaultBtn: {
        marginTop: 8,
        color: '#4ec28d',
        fontWeight: '600',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    addBtn: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#4ec28d',
        padding: 15,
        borderRadius: 50,
        elevation: 5,
    },

    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },

    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },

    saveBtn: {
        backgroundColor: '#4ec28d',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },

    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    cancel: {
        textAlign: 'center',
        marginTop: 10,
        color: 'red',
    },
});