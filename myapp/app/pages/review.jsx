import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { addReviews, deleteReview, getUserReviews } from '../../hooks/useReview';
import { useDispatch, useSelector } from 'react-redux';
import { setDelteReview, setReview, setReviewRedux } from '../../features/reviewSlice';
import LoadingButton from '../../components/loadingButton';

const ReviewScreen = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const user = useSelector(state => state.user.user || {});
    const userId = user?.id;
    const userName = user?.name;
    const { carId } = useLocalSearchParams();
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const reviews = useSelector(state => state.review.review || []);


    const addReview = async () => {
        if (!comment || rating === 0) return;
        try {
            setLoading(true);
            const reviewData = { userName, rating, comment, carId, userId };

            const response = await addReviews(reviewData);
            if (response?.success) {
                dispatch(setReviewRedux(response.review));
                setComment('');
                setRating(0);
                Alert.alert("reviewed succssfully");
            }
        } catch (error) {
            Alert.alert(error.response.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const response = await deleteReview(id);
        if (response.success) {
            dispatch(setDelteReview(id));
            Alert.alert("review deleted successfully");
        }
    }

    const fetchUserReview = async () => {
        const response = await getUserReviews(userId);
        if (response.success) {
            dispatch(setReview(response.review));
        }
    }

    useEffect(() => {
        fetchUserReview();
    }, [userId]);


    const renderStars = (count) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name={i <= count ? 'star' : 'star-outline'} size={16} color="#FFD700" />
                ))}
            </View>
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.topSection}>
                <View style={styles.userInfo}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item?.userName?.charAt(0).toUpperCase()}</Text>
                    </View>

                    <View>
                        <Text style={styles.name}>{item.userName}</Text>
                        <Text style={styles.carName}>{item?.carId?.carName} • {item?.carId?.brand}</Text>
                    </View>

                </View>

                <View style={styles.rightSection}>
                    <View style={styles.ratingBox}>{renderStars(item.rating)}</View>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => handleDelete(item._id)}>
                            <Ionicons name="trash-outline" size={20} color="#e53935" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Text style={styles.comment}>{item.comment}</Text>

            <View style={styles.bottomRow}>
                <Ionicons name="time-outline" size={14} color="#888" />
                <Text style={styles.time}>{new Date(item?.createdAt).toLocaleString()}</Text>
            </View>

        </View>
    );

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <View style={styles.content} >
                        <View style={styles.inputContainer}>
                            <Text style={styles.subHeader}>Write a Review</Text>

                            <View style={styles.starInput}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <TouchableOpacity key={i} onPress={() => setRating(i)}>
                                        <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={28} color="#FFD700" />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TextInput placeholder="Write your experience..." value={comment} onChangeText={setComment} style={styles.input} multiline />

                            {loading ? <LoadingButton /> : <TouchableOpacity style={styles.button} onPress={addReview}>
                                <Text style={styles.buttonText}>Submit Review</Text>
                            </TouchableOpacity>
                            }

                        </View>

                        <FlatList data={reviews} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ReviewScreen;

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
        backgroundColor: '#f5f7fb',

    },
    content: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8

    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 100,
    },

    subHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },

    inputContainer: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        marginTop: 15,
    },

    starInput: {
        flexDirection: 'row',
        marginVertical: 5,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        minHeight: 60,
        marginVertical: 8,
    },

    button: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 70,
    },

    actions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
    },

    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        marginBottom: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },

    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#4ec28d',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },

    carName: {
        fontSize: 12,
        color: '#777',
        margin: 5,

    },

    ratingBox: {
        backgroundColor: '#fff8e7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },

    comment: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 22,
        color: '#444',
    },

    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },

    time: {
        fontSize: 12,
        color: '#888',
        marginLeft: 0,
    },
});