import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { AddNotification, GetNotification } from '../../../hooks/useNotification';
import { useDispatch, useSelector } from 'react-redux';
import { addNotificationRedux, setNotification } from '../../../features/notificationSlice';
import LoadingButton from '../../../components/loadingButton';

const AdminNotification = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const notification = useSelector(state => state.notification.notification || []);
    const [loading, setLoading] = useState(false);

    const handleAddNotification = async () => {
        try {
            if (!title || !message) {
                Alert.alert('Error', 'Please fill all fields');
                return;
            }
            setLoading(true);
            const notificationData = { title, message, };
            const response = await AddNotification(notificationData);
            if (response?.success && response?.newNotification) {
                dispatch(addNotificationRedux(response.newNotification));
                setTitle('');
                setMessage('');
                Alert.alert('Success', 'Notification Added');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handlegetNotification = async () => {
        const response = await GetNotification();
        if (response?.success && response?.notifications) {
            dispatch(setNotification(response.notifications));
        }
    }

    useEffect(() => {
        handlegetNotification();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const fetchNotification = async () => {
                if (notification.length === 0) {
                    await GetNotification();
                }
            };
            fetchNotification();
        }, [notification])
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/admin/profile')}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                        <View style={styles.formCard}>
                            <Text style={styles.sectionTitle}> Add Notification </Text>

                            <View style={styles.inputContainer}>
                                <Ionicons name="notifications-outline" size={20} color="#2563EB" />
                                <TextInput placeholder="Notification Title" placeholderTextColor="#9CA3AF" style={styles.input} value={title} onChangeText={setTitle} />
                            </View>

                            <View style={styles.messageBox}>
                                <TextInput placeholder="Write notification message..." placeholderTextColor="#9CA3AF" multiline value={message} onChangeText={setMessage} style={styles.messageInput} />
                            </View>

                            {loading ? <LoadingButton /> : <TouchableOpacity style={styles.addButton} onPress={handleAddNotification}>
                                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                                <Text style={styles.buttonText}> Add Notification </Text>
                            </TouchableOpacity>}

                        </View>

                        <View style={styles.notificationSection}>
                            <Text style={styles.sectionTitle}> Recent Notifications </Text>

                            {notification.length > 0 ? (
                                notification?.map((item) => (
                                    <TouchableOpacity key={item._id} style={[styles.notificationCard, !item?.read && styles.unreadCard]}>

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
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                                    <Text style={styles.emptyText}> No notifications yet </Text>
                                </View>
                            )}

                        </View>

                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>


        </View >
    );
};

export default AdminNotification;

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
        padding: 10,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 60,
    },

    formCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 18,
    },

    inputContainer: {
        height: 56,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: '#111827',
    },

    messageBox: {
        minHeight: 130,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    messageInput: {
        fontSize: 15,
        color: '#111827',
        textAlignVertical: 'top',
    },

    addButton: {
        height: 55,
        backgroundColor: '#2563EB',
        borderRadius: 16,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },

    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 15,
    },
});