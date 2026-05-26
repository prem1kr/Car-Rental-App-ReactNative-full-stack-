import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { GetNotification, MarkReadNotification } from '../../hooks/useNotification';
import { setNotification } from '@/features/notificationSlice';

const NotificationScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notification.notification || []);

    const markAsRead = async (id) => {
        const updatedNotifications = notifications.map(item =>
            item._id === id ? { ...item, read: true } : item
        );
        dispatch(setNotification(updatedNotifications));
        await MarkReadNotification(id);
    };

    const fetNotification = async () => {
        try {
            const response = await GetNotification();
            if (response.success) {
                dispatch(setNotification(response.notifications));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetNotification();
    }, []);

    const renderItem = ({ item }) => (

        <TouchableOpacity key={item._id} onPress={() => markAsRead(item._id)} style={[styles.notificationCard, !item?.read && styles.unreadCard]}>

            <View style={styles.iconBox}>
                <Ionicons name={item?.read ? 'notifications-outline' : 'notifications'}
                    size={20} color={item?.read ? '#999' : '#2563EB'} />
            </View>

            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}> {item?.title} </Text>
                <Text style={styles.notificationMessage}> {item?.message} </Text>
                <Text style={styles.time}>{new Date(item?.createdAt).toLocaleString()}</Text>
            </View>

            {!item?.read && (<View style={styles.dot} />)}

        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Notification</Text>
            </View>

            <View style={styles.content} >
                {notifications.length > 0 ? (
                    <FlatList data={notifications} keyExtractor={(item) => item._id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                )}

            </View>

        </SafeAreaView>
    );
};

export default NotificationScreen;


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
        marginLeft: 60,
    },

    notificationSection: {
        marginTop: 28,
    },

    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 18,
        marginBottom: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },

    unreadCard: {
        backgroundColor: '#EFFFF4',
        borderWidth: 1,
        borderColor: '#D8F5DF',
    },

    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#EEF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    notificationContent: {
        flex: 1,
    },

    notificationTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },

    notificationMessage: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 21,
    },

    time: {
        fontSize: 11,
        color: '#999',
        marginTop: 6,
    },

    dot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#2563EB',
        marginTop: 6,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyText: {
        marginTop: 10,
        color: '#999',
    },
});