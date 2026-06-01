import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import LoadingButton from '../../../components/loadingButton';

const EditCarModal = ({ visible, onClose, onSave, car }) => {
    const [carName, setCarName] = useState(car?.carName || '');
    const [brand, setBrand] = useState(car?.brand || '');
    const [price, setPrice] = useState(car?.price || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedData = { carName, brand, price };
            onSave(updatedData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    };

    return (

        <Modal visible={visible} animationType="slide" transparent>

            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}> Edit Car </Text>

                    <ScrollView>
                        <TextInput placeholder="Car Name" value={carName} onChangeText={setCarName} style={styles.input} />
                        <TextInput placeholder="Brand" value={brand} onChangeText={setBrand} style={styles.input} />
                        <TextInput placeholder="Price" value={price?.toString()} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose} >
                                <Text style={styles.buttonText}> Cancel </Text>
                            </TouchableOpacity>
                            
                            <LoadingButton loading={loading} style={styles.saveButton} onPress={handleSave} title={'Save'} />

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default EditCarModal;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modalContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },

    input: {
        height: 55,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    cancelButton: {
        flex: 1,
        height: 50,
        backgroundColor: '#9ca3af',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    saveButton: {
         backgroundColor: '#4ec28d',
        borderRadius: 12,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});