import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { GetNotification } from '../hooks/useNotification';
import { setNotification } from '@/features/notificationSlice';
import { useEffect } from 'react';
import { setSearchQuery } from '@/features/searchSlice';


export default function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const location = useSelector(state => state.location.location || {});
    const LocationData = location?.city && location?.state ? `${location.city}, ${location.state}` : "Detecting...";
    const notification = useSelector(state => state.notification.notification || []);
    const GetUnReadNotificationCount = notification.filter(item => !item.read).length;

    const fetchNotification = async () => {
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
        fetchNotification();
    }, []);



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#1F8A70" />
                <TextInput placeholder="Search cars ..." placeholderTextColor="#aaa" style={styles.input} onChangeText={(text) => dispatch(setSearchQuery(text))} />
            </View>

            <TouchableOpacity style={styles.notificationContainer} onPress={() => router.push('/pages/notification')} >
                <Ionicons name="notifications-outline" size={22} color="#fff" />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{GetUnReadNotificationCount}</Text>
                </View>
            </TouchableOpacity>


            <TouchableOpacity style={styles.locationContainer} onPress={() => router.push('/pages/address')}>
                <Ionicons name="location-outline" size={16} color="#fff" />
                <Text style={styles.locationText}>{LocationData}</Text>
            </TouchableOpacity>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 75,
        backgroundColor: '#4ec28d',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 0,
        marginTop: 0
    },

    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 10,
        borderRadius: 16,
        paddingHorizontal: 10,
        height: 44,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },

    input: {
        flex: 1,
        color: '#333',
        marginLeft: 8,
        fontSize: 14,
    },

    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 20,
    },

    locationText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '600',
    },
    notificationContainer: {
        position: 'relative',
        paddingRight: 5,
    },

    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },

    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});