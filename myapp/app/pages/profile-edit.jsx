import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileData, ProfileUpdate } from '../../hooks/useProfile';
import { setProfile } from '../../features/profileSlice';
import LoadingButton from '../../components/loadingButton';

const EditProfile = () => {
    const user = useSelector(state => state.user.user || {});
    const profile = useSelector(state => state.profile.profile || {});
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        drivingLicense: profile?.drivingLicense || '',
        expiry: profile?.expiry || '',
        contact: profile?.contact || '',
    });

    useEffect(() => {
        setForm({
            name: user?.name || '',
            email: user?.email || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
            drivingLicense: profile?.drivingLicense || '',
            expiry: profile?.expiry || '',
            contact: profile?.contact || '',
        });
    }, [profile, user]);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await ProfileUpdate(form);
            if (response?.success) {
                dispatch(setProfile(response.profile));
                console.log("Updated Profile:", form);

            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const fetchProfile = async () => {
        if (!user?.email || !user?.name) return;
        const data = await ProfileData(user.email, user.name);
        if (data?.success) {
            dispatch(setProfile(data.profile));
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <ScrollView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}> My Profile</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <View style={styles.imageContainer}>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.profileImage} />
                        <TouchableOpacity style={styles.editIcon}>
                            <Ionicons name="camera" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>Personal Info</Text>
                        <TextInput placeholder="Full Name" style={[styles.input, styles.disabledInput]} value={form.name} onChangeText={(text) => handleChange('name', text)} editable={false} />
                        <TextInput placeholder="Email" style={[styles.input, styles.disabledInput]} keyboardType="email-address" value={form.email} onChangeText={(text) => handleChange('email', text)} editable={false} />
                        <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" value={form.phone} onChangeText={(text) => handleChange('phone', text)} />
                        <TextInput placeholder="Address" style={styles.input} value={form.address} onChangeText={(text) => handleChange('address', text)} />
                        <Text style={styles.sectionTitle}>Driving Details</Text>
                        <TextInput placeholder="Driving License Number" style={styles.input} value={form.drivingLicense} onChangeText={(text) => handleChange('drivingLicense', text)} />
                        <TextInput placeholder="License Expiry Date (DD/MM/YYYY)" style={styles.input} value={form.expiry} onChangeText={(text) => handleChange('expiry', text)} />
                        <Text style={styles.sectionTitle}>Emergency Contact</Text>
                        <TextInput placeholder="Emergency Contact Number" style={styles.input} keyboardType="phone-pad" value={form.contact} onChangeText={(text) => handleChange('contact', text)} />

                        <LoadingButton title={'Update Profile'} loading={loading} style={styles.saveBtn} onPress={handleSave} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView >

        </ScrollView>
    );
};

export default EditProfile;

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

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 85,
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

    imageContainer: {
        alignItems: 'center',
        marginTop: 30,
    },

    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 60,
    },

    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 130,
        backgroundColor: '#4ec28d',
        padding: 6,
        borderRadius: 20,
    },

    form: {
        padding: 20,

    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },

    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        color: 'black',
    },

    saveBtn: {
        backgroundColor: '#4ec28d',
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },

    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#eaeaea',
        color: '#777',
    },

});