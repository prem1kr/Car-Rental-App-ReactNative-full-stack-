import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY";

const MapLocationPicker = ({ visible, onClose, mapRegion, onSelectLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const searchPlaces = async (text) => {
        setSearchText(text);

        if (text.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}`);
            const data = await res.json();
            setSuggestions(data.predictions || []);

        } catch (err) {
            console.log(err);
        }
    };

    const getPlaceDetails = async (placeId) => {
        try {
            const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`);
            const data = await res.json();
            const location = data.result.geometry.location;
            const coordinate = {
                latitude: location.lat,
                longitude: location.lng,
            };
            setSelectedLocation(coordinate);
            setSuggestions([]);
            setSearchText(data.result.name);
            onSelectLocation(coordinate);

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={{ flex: 1 }}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}> Select Location </Text>
                </View>

                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput placeholder="Search location..." value={searchText} onChangeText={searchPlaces} style={{ flex: 1, marginLeft: 10 }} />
                </View>

                {suggestions.length > 0 && (
                    <FlatList data={suggestions} keyExtractor={(item) => item.place_id} style={styles.suggestions} renderItem={({ item }) => (
                        <TouchableOpacity style={styles.suggestionItem} onPress={() => getPlaceDetails(item.place_id)} >
                            <Text>{item.description}</Text>
                        </TouchableOpacity>
                    )} />
                )}

                <MapView style={{ flex: 1 }} region={selectedLocation ? { ...selectedLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 } : mapRegion}
                    onPress={(e) => {
                        const coordinate = e.nativeEvent.coordinate;
                        setSelectedLocation(coordinate);
                        onSelectLocation(coordinate);
                    }} >
                    {selectedLocation && (<Marker coordinate={selectedLocation} />)}
                </MapView>

            </View>
        </Modal>
    );
};

export default MapLocationPicker;

const styles = StyleSheet.create({

    header: {
        height: 80,
        backgroundColor: '#4ec28d',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 20,
    },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },

    suggestions: {
        backgroundColor: '#fff',
        maxHeight: 200,
        marginHorizontal: 10,
        borderRadius: 10,
    },

    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
});