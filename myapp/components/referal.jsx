import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyReferal } from '../hooks/useReferal';
import LoadingButton from './loadingButton';

const ApplyReferralPopup = ({ visible, onClose, onSuccess }) => {
    const [referralCode, setReferralCode] = useState("");
    const [loading, setLoading] = useState(false);
    const handleApplyReferral = async () => {
        try {
            if (!referralCode) {
                return alert("Please enter referral code");
            }
            setLoading(true);
            const userId = await AsyncStorage.getItem("userId");
            const response = await applyReferal(userId, referralCode);

            if (response.success) {
                alert(response.message);
                setReferralCode("");
                onClose();
                if (onSuccess) {
                    onSuccess();
                }

            } else {
                alert(response.message);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.overlay}>

                <View style={styles.popup}>
                    <Text style={styles.title}>  Apply Referral Code  </Text>
                    <TextInput placeholder="Enter referral code" value={referralCode} onChangeText={setReferralCode} style={styles.input} autoCapitalize="characters" />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} >
                            <Text style={styles.cancelText}> Cancel</Text>
                        </TouchableOpacity>
                        
                        <LoadingButton  title={'Apply'} loading={loading} style={[styles.button, styles.applyButton]} onPress={handleApplyReferral}/>

                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ApplyReferralPopup;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    popup: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 20,
        fontSize: 16,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    button: {
        width: '48%',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cancelButton: {
        backgroundColor: '#f1f1f1',
    },

    applyButton: {
        backgroundColor: '#1e88e5',
    },

    cancelText: {
        fontWeight: '600',
        color: '#333',
    },

    applyText: {
        fontWeight: '600',
        color: '#fff',
    },
});