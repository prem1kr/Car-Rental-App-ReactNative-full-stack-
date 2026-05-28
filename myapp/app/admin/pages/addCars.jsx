import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setCarsRedux } from '../../../features/productSlice';
import { addCar } from '../../../hooks/fetchCars';
import { uploadImageToCloudinary } from '../../../components/upload';
import LoadingButton from '../../../components/loadingButton';

const fuelOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];

const AddCars = () => {
    const router = useRouter();
    const [carName, setCarName] = useState('');
    const [brand, setBrand] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [images, setImages] = useState([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const pickImages = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow gallery access');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 1,
        });
        if (!result.canceled) {
            const selectedImages = result.assets.map(
                (item) => item.uri
            );
            setImages([...images, ...selectedImages]);
        }
    };

    const handleAddCar = async () => {
        try {

            if (!carName || !brand || !carNumber || !color || !fuelType || !price) {
                Alert.alert('Error', 'Please fill all details');
                return;
            }

            if (images.length === 0) {
                Alert.alert('Error', 'Please upload images');
                return;
            }

            Alert.alert('Uploading', 'Please wait while images upload');
            setLoading(true);

            // Upload all images to cloudinary
            const uploadedImages = [];

            for (let i = 0; i < images.length; i++) {

                const uploadedUrl = await uploadImageToCloudinary(images[i]);

                if (uploadedUrl) {
                    uploadedImages.push(uploadedUrl);
                }
            }

            console.log(uploadedImages);

            // Save car data in backend
            const response = await addCar({
                carName,
                brand,
                carNumber,
                color,
                fuelType,
                price,
                images: uploadedImages,
            });

            dispatch(setCarsRedux(response.car));

            Alert.alert('Success', 'Car Added Successfully');

            setCarName('');
            setBrand('');
            setCarNumber('');
            setColor('');
            setFuelType('');
            setPrice('');
            setImages([]);

        } catch (error) {
            console.log(error);

            Alert.alert(
                'Error',
                error?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setLoading(false)
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/admin/profile')}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Cars</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                        <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
                            <Ionicons name="camera-outline" size={35} color="#2563EB" />
                            <Text style={styles.imageText}> Upload Car Images</Text>
                        </TouchableOpacity>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} >
                            {images.map((img, index) => (
                                <Image key={index} source={{ uri: img }} style={styles.previewImage} />
                            ))}
                        </ScrollView>

                        <View style={styles.inputContainer}>
                            <Ionicons name="car-sport-outline" size={20} color="#2563EB" />
                            <TextInput placeholder="Car Name" placeholderTextColor="#9CA3AF" style={styles.input} value={carName} onChangeText={setCarName} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="business-outline" size={20} color="#2563EB" />
                            <TextInput placeholder="Brand" placeholderTextColor="#9CA3AF" style={styles.input} value={brand} onChangeText={setBrand} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="document-text-outline" size={20} color="#2563EB" />
                            <TextInput placeholder="Car Number" placeholderTextColor="#9CA3AF" style={styles.input} value={carNumber} onChangeText={setCarNumber} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="color-palette-outline" size={20} color="#2563EB" />
                            <TextInput placeholder="Car Color" placeholderTextColor="#9CA3AF" style={styles.input} value={color} onChangeText={setColor} />
                        </View>

                        <Text style={styles.label}> Fuel Type </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fuelContainer}>
                            {fuelOptions.map((item, index) => (
                                <TouchableOpacity key={index}
                                    style={[styles.fuelButton, fuelType === item && styles.activeFuelButton]}
                                    onPress={() => setFuelType(item)}>
                                    <Text style={[styles.fuelText, fuelType === item && styles.activeFuelText]} >{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.inputContainer}>
                            <Ionicons name="wallet-outline" size={20} color="#2563EB" />
                            <TextInput placeholder="Price Per Day" placeholderTextColor="#9CA3AF" style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />
                        </View>

                        {loading ? <LoadingButton /> : <TouchableOpacity style={styles.addButton} onPress={handleAddCar}>
                            <Ionicons name="add-circle-outline" size={22} color="#fff" />
                            <Text style={styles.buttonText}> Add Car </Text>
                        </TouchableOpacity>}

                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AddCars;

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
    },

    content: {
        padding: 14,
    },

    imagePicker: {
        height: 170,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#D6E4FF',
    },

    imageText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#2563EB',
    },

    previewImage: {
        width: 120,
        height: 90,
        borderRadius: 18,
        marginRight: 12,
    },

    inputContainer: {
        height: 58,
        backgroundColor: '#fff',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: '#111827',
    },

    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },

    fuelContainer: {
        marginBottom: 20,
    },

    fuelButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginRight: 12,
    },

    activeFuelButton: {
        backgroundColor: '#2563EB',
    },

    fuelText: {
        color: '#111827',
        fontWeight: '600',
    },

    activeFuelText: {
        color: '#fff',
    },

    addButton: {
        height: 58,
        backgroundColor: '#2563EB',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});