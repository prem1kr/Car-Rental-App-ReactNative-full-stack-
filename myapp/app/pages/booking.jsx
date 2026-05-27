import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Button } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings } from '../../hooks/useBooking';
import CarImageSlider from '../../components/carImageSlider';
import { setBooking } from '../../features/bookingSlice';
import { getUserReviews } from '../../hooks/useReview';
import { setReview } from '../../features/reviewSlice';

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
    const user = useSelector((state) => state.user.user || {});
    const userId = user?._id || user?.id;
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.booking.booking || []);
    const review = useSelector(state => Array.isArray(state.review.review) ? state.review.review : []);

    const fetchBookings = async () => {
        try {
            const response = await getUserBookings(userId);
            if (response?.success) {
                dispatch(setBooking(response.bookings));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUserReview = async () => {
        const response = await getUserReviews(userId);
        if (response.success) {
            dispatch(setReview(response.review));
        }
    }

    useEffect(() => {
        fetchBookings();
        fetchUserReview();
    }, []);


    const renderItem = ({ item }) => {
        const Reviewed = review.some((r) => r.carId?._id === item?.carId?._id);
        return (
            <View style={styles.card}>
                <CarImageSlider photos={item?.carId?.images || item?.images || []} />
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>

                <View style={styles.details}>
                    <Text style={styles.car}>{item?.carId?.carName}</Text>
                    <Text style={styles.brand}>{item?.carId?.brand}</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.iconRow}>
                            <Ionicons name="calendar-outline" size={14} color="#666" />
                            <Text style={styles.date}> {new Date(item.pickupDate).toDateString()} - {' '}
                                {new Date(item.returnDate).toDateString()}
                            </Text>
                        </View>

                        <View style={styles.iconRow}>
                            <Ionicons name="cash-outline" size={14} color="#666" />
                            <Text style={styles.price}> ₹{item.totalPrice} </Text>
                        </View>

                    </View>

                    {item.status === "Completed" && !Reviewed && (
                        <TouchableOpacity style={styles.reviewBtn} onPress={() => router.push({ pathname: "/pages/review", params: { carId: item?.carId?._id } })} >
                            <Ionicons name="star" size={18} color="#fff" />
                            <Text style={styles.reviewBtnText}> Write a Review </Text>
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        )
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}> My Bookings</Text>
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
        marginBottom: 10,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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

    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyText: {
        marginTop: 10,
        color: '#999',
    },
    reviewBtn: {
        marginTop: 15,
        backgroundColor: '#4ec28d',
        paddingVertical: 12,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },

    reviewBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },
});