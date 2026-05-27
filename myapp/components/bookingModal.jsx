import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { createBooking } from '../hooks/useBooking';
import { setBookingRedux } from '../features/bookingSlice';
import { useRouter } from 'expo-router';
// import MapLocationPicker from './MapLocationPicker';

const BookingModal = ({ visible, onClose, car, userId }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [pickupDate, setPickupDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [showPickupPicker, setShowPickupPicker] = useState(false);
    const [showReturnPicker, setShowReturnPicker] = useState(false);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [locationModal, setLocationModal] = useState(false);
    const [selectingType, setSelectingType] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 28.6139,
        longitude: 77.2090,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB');
    };

    const handleBooking = async () => {
        if (!pickupDate || !returnDate || !pickupLocation || !dropLocation) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (returnDate < pickupDate) {
            Alert.alert('Error', 'Return date must be after pickup date');
            return;
        }

        const bookingData = {
            userId,
            carId: car?._id,
            pickupDate,
            returnDate,
            pickupLocation,
            dropLocation,
            totalPrice: Number(car?.price),
            paymentMethod,
        };

        const response = await createBooking(bookingData);
        if (response?.success) {
            dispatch(setBookingRedux(response.booking));
            Alert.alert('Success', response?.message);
            setPickupDate(null);
            setReturnDate(null);
            setPickupLocation('');
            setDropLocation('');
            setPaymentMethod('Cash');
            onClose();
            router.push({
                pathname: "/paymentModal",
                params: { booking: JSON.stringify(response.booking) }
            });
        } else {
            Alert.alert('Error', response?.message);
        }
    };

    return (
        <>
            <Modal visible={visible} transparent={true} animationType="slide" statusBarTranslucent={true} >
                <View style={styles.overlay}>

                    <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} >

                            <View style={styles.modalContainer}>
                                <View style={styles.header}>
                                    <Text style={styles.headerTitle}> Car Booking </Text>
                                </View>

                                <View style={styles.carCard}>
                                    <Ionicons name="car-sport-outline" size={30} color="#2563EB" />

                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.carName}> {car?.carName} </Text>
                                        <Text style={styles.brand}> {car?.brand} </Text>
                                    </View>

                                </View>

                                <TouchableOpacity style={styles.inputContainer} onPress={() => setShowPickupPicker(true)} >
                                    <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                                    <Text style={[styles.inputText, { color: pickupDate ? '#111827' : '#9CA3AF' }]}>
                                        {pickupDate ? formatDate(pickupDate) : 'Pickup Date'}
                                    </Text>
                                </TouchableOpacity>

                                {showPickupPicker && (
                                    <DateTimePicker value={pickupDate || new Date()} mode="date" display="default" minimumDate={new Date()}
                                        onChange={(event, selectedDate) => {
                                            setShowPickupPicker(false);
                                            if (selectedDate) {
                                                setPickupDate(selectedDate);
                                            }
                                        }} />
                                )}

                                <TouchableOpacity style={styles.inputContainer} onPress={() => setShowReturnPicker(true)} >
                                    <Ionicons name="calendar-clear-outline" size={20} color="#2563EB" />
                                    <Text style={[styles.inputText, { color: returnDate ? '#111827' : '#9CA3AF' }]} >
                                        {returnDate ? formatDate(returnDate) : 'Return Date'}
                                    </Text>
                                </TouchableOpacity>

                                {showReturnPicker && (
                                    <DateTimePicker value={returnDate || new Date()} mode="date" display="default" minimumDate={pickupDate || new Date()}
                                        onChange={(event, selectedDate) => {
                                            setShowReturnPicker(false);
                                            if (selectedDate) {
                                                setReturnDate(selectedDate);
                                            }
                                        }} />
                                )}

                                <TouchableOpacity style={styles.inputContainer} onPress={() => { setSelectingType('pickup'); setLocationModal(true); }} >
                                    <Ionicons name="location-outline" size={20} color="#2563EB" />
                                    <Text style={[styles.inputText, { color: pickupLocation ? '#111827' : '#9CA3AF' }]}>
                                        {pickupLocation || 'Select Pickup Location'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.inputContainer} onPress={() => { setSelectingType('drop'); setLocationModal(true); }} >
                                    <Ionicons name="navigate-outline" size={20} color="#2563EB" />
                                    <Text style={[styles.inputText, { color: dropLocation ? '#111827' : '#9CA3AF' }]} >
                                        {dropLocation || 'Select Drop Location'}
                                    </Text>

                                </TouchableOpacity>

                                {/* Payment */}
                                <Text style={styles.paymentTitle}> Payment Method </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paymentRow} >

                                    {['Cash', 'UPI', 'Card'].map((item) => (
                                        <TouchableOpacity key={item} style={[styles.paymentBtn, paymentMethod === item && styles.activePayment]} onPress={() => setPaymentMethod(item)} >
                                            <Text style={[styles.paymentText, paymentMethod === item && styles.activePaymentText]} >  {item} </Text>
                                        </TouchableOpacity>
                                    ))}

                                </ScrollView>

                                <View style={styles.priceCard}>
                                    <Text style={styles.priceLabel}> Total Price </Text>
                                    <Text style={styles.price}> ₹{car?.price} </Text>
                                </View>

                                <TouchableOpacity style={styles.bookBtn} onPress={handleBooking} >
                                    <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                                    <Text style={styles.bookBtnText}> Confirm Booking</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} >
                                    <Text style={styles.cancelText}>  Cancel  </Text>
                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>


            {/* <MapLocationPicker visible={locationModal} onClose={() => setLocationModal(false)} mapRegion={mapRegion}
                onSelectLocation={({ latitude, longitude }) => {
                    const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    if (selectingType === 'pickup') {
                        setPickupLocation(address);
                    } else {
                        setDropLocation(address);
                    }
                    setLocationModal(false);
                }}
            /> */}

        </>
    );
};

export default BookingModal;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },

    modalContainer: {
        backgroundColor: '#F5F7FB',
        borderRadius: 28,
        overflow: 'hidden',
    },

    header: {
        height: 85,
        backgroundColor: '#4ec28d',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomRightRadius: 24,
        borderTopLeftRadius: 24,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 12,
        color: '#111827',
    },

    carCard: {
        backgroundColor: '#fff',
        margin: 18,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },

    carName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },

    brand: {
        marginTop: 4,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },

    inputContainer: {
        height: 58,
        backgroundColor: '#fff',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginHorizontal: 18,
        marginBottom: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },

    inputText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
    },

    paymentTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginHorizontal: 18,
        marginBottom: 14,
        marginTop: 4,
    },

    paymentRow: {
        paddingLeft: 18,
        marginBottom: 18,
    },

    paymentBtn: {
        paddingHorizontal: 22,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginRight: 12,
    },

    activePayment: {
        backgroundColor: '#2563EB',
    },

    paymentText: {
        color: '#111827',
        fontWeight: '600',
    },

    activePaymentText: {
        color: '#fff',
    },

    priceCard: {
        backgroundColor: '#fff',
        marginHorizontal: 18,
        borderRadius: 20,
        paddingVertical: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },

    priceLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 6,
    },

    price: {
        fontSize: 28,
        fontWeight: '700',
        color: '#4ec28d',
    },

    bookBtn: {
        height: 58,
        backgroundColor: '#2563EB',
        borderRadius: 18,
        marginHorizontal: 18,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },

    bookBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    cancelBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 24,
    },

    cancelText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 15,
    },
});