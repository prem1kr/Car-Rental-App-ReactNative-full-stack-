import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CarImageSlider from '../../../components/carImageSlider';
import { getAllBookings, updateBookingStatus } from '../../../hooks/useBooking';
import { useDispatch, useSelector } from 'react-redux';
import { setBooking, updateBookingRedux } from '../../../features/bookingSlice';

const BookingHistory = () => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return '#4CAF50';
            case 'Confirmed':
                return '#FFA000';
            case 'Cancelled':
                return '#E53935';
            default:
                return '#999';
        }
    };

    const router = useRouter();
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.booking.booking || []);

    const handleUpdateStatus = async (bookingId, status) => {
        try {
            dispatch(updateBookingRedux({ bookingId, status }));
            const response = await updateBookingStatus(
                bookingId,
                status
            );
            if (response?.success) {
                Alert.alert('Success', response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await getAllBookings();
            if (response?.success) {
                dispatch(setBooking(response.bookings));
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);


    const renderItem = ({ item }) => (

        <View style={styles.card}>
            <CarImageSlider photos={item?.carId?.images || []} />

            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>  {item.status} </Text>
            </View>

            <View style={styles.details}>
                <Text style={styles.car}> {item?.carId?.carName} </Text>
                <Text style={styles.brand}> {item?.carId?.brand} </Text>
                <Text style={styles.user}> User: {' '} {item?.userId?.name} </Text>
                <Text style={styles.location}> Pickup: {' '}{item.pickupLocation}</Text>
                <Text style={styles.location}> Drop: {' '}{item.dropLocation}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.iconRow}>
                        <Ionicons name="calendar-outline" size={14} color="#666" />
                        <Text style={styles.date}> {new Date(item.pickupDate).toDateString()} {' '} - {' '} {new Date(item.returnDate).toDateString()} </Text>
                    </View>

                    <View style={styles.iconRow}>
                        <Ionicons name="cash-outline" size={14} color="#666" />
                        <Text style={styles.price}> ₹{item.totalPrice} </Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFA000' }]}
                        onPress={() => handleUpdateStatus(item._id, 'Confirmed')}>
                        <Text style={styles.actionText}> Confirm </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
                        onPress={() => handleUpdateStatus(item._id, 'Completed')}>
                        <Text style={styles.actionText}> Complete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#E53935' }]}
                        onPress={() => handleUpdateStatus(item._id, 'Cancelled')}  >
                        <Text style={styles.actionText}> Cancel </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}> All Bookings </Text>
            </View>

            <View style={styles.content}>
                {bookings.length > 0 ? (
                    <FlatList data={bookings} keyExtractor={(item) => item._id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
                ) : (
                    <View style={styles.empty}>
                        <Ionicons name="car-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}> No bookings yet </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default BookingHistory;

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
        backgroundColor: '#eef2f7',
    },

    content: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 60,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 18,
        marginTop: 10,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },

    details: {
        padding: 15,
    },

    car: {
        fontSize: 17,
        fontWeight: '700',
    },

    brand: {
        fontSize: 13,
        color: '#888',
        marginBottom: 5,
    },

    user: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },

    location: {
        fontSize: 13,
        color: '#555',
        marginBottom: 3,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    date: {
        marginLeft: 5,
        fontSize: 12,
        color: '#555',
        width: 180,
    },

    price: {
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
    },

    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },

    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },

    actionBtn: {
        flex: 1,
        marginHorizontal: 4,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    actionText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },

    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyText: {
        marginTop: 10,
        color: '#999',
    },
});