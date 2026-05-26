import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

const LocationScreen = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const location = useSelector(state => state.location.location || {});
    const LocationData = location?.city && location?.state ? `${location.city}, ${location.state}` : "Detecting...";

    const [nearby, setNearby] = useState([
        { id: '1', name: 'Connaught Place' },
        { id: '2', name: 'India Gate' },
        { id: '3', name: 'Karol Bagh' },
        { id: '4', name: 'Noida Sector 18' },
    ]);


    const openMap = () => {

    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.locationCard}>
            <Ionicons name="location-outline" size={20} color="#007BFF" />
            <Text style={styles.locationText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Location</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <View style={styles.content}>

                        <View style={styles.searchBox}>
                            <Ionicons name="search-outline" size={20} color="#777" />
                            <TextInput placeholder="Search location..." value={search} onChangeText={setSearch} style={styles.input} />
                        </View>

                        <TouchableOpacity style={styles.currentLocation} onPress={openMap}>
                            <Ionicons name="locate" size={20} color="#fff" />
                            <Text style={styles.currentText}>
                                {LocationData}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.subHeader}>Nearby Locations</Text>
                        <FlatList data={nearby} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>


        </SafeAreaView>
    );
};

export default LocationScreen;

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
        paddingRight: 8

    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 60,
    },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 15,
        elevation: 10,
    },

    input: {
        marginLeft: 10,
        flex: 1,
    },

    currentLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 12,
        justifyContent: 'center',
        marginBottom: 20,
    },

    currentText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '600',
    },

    subHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },

    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,

        elevation: 2,
    },

    locationText: {
        marginLeft: 10,
        fontSize: 14,
    },
});