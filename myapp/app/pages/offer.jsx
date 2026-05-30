import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {  useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import * as Clipboard from 'expo-clipboard';
import { getOffers } from '../../hooks/offers';
import { setOffer } from '../../features/offerSlice';


const Offers = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const offers = useSelector(state => state.offer.offer || []);

    const copyCode = (code) => {
        Clipboard.setString(code);
        Alert.alert('Copied');
    };

    const fetchOffers = async () => {
        try {
            const response = await getOffers();
            if (response?.success) {
                dispatch(setOffer(response.offers));
                console.log(response.offers)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchOffers();
    }, []);


    const renderItem = ({ item }) => (
        <View style={[styles.card, { borderLeftColor: item.color }]}>
            <View style={[styles.sideBar, { backgroundColor: item.color }]} />

            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.description}</Text>

                <View style={styles.row}>
                    <Text style={styles.validity}> Valid-Till - {item.validity} </Text>

                    <View style={styles.codeBox}>
                        <Text style={styles.code}>{item.code}</Text>
                    </View>


                    <TouchableOpacity onPress={() => copyCode(item.code)}>
                        <Ionicons name="copy-outline" size={20} color="#007BFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.expiry}>{item.expiry}</Text>
            </View>

        </View>
    );

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Offers</Text>
            </View>
            <View style={styles.content}>
                {offers.length > 0 ? (
                    <FlatList data={offers} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
                ) : (
                    <View style={styles.empty}>
                        <Ionicons name="pricetag-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No offers available</Text>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
};

export default Offers;

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
        padding: 10

    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 90,
    },

    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 15,
        overflow: 'hidden',
        marginTop: 10,
        elevation: 4,
    },

    sideBar: {
        width: 6,
    },



    title: {
        fontSize: 16,
        fontWeight: '700',
    },

    desc: {
        fontSize: 13,
        color: '#666',
        marginVertical: 5,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },

    codeBox: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#007BFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },

    code: {
        fontWeight: '700',
        letterSpacing: 1,
    },

    expiry: {
        fontSize: 11,
        color: '#999',
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
    validity: {
        marginTop: 8,
        alignSelf: 'center',
        backgroundColor: '#E0ECFF',
        color: '#1D4ED8',
        fontWeight: '500',
        fontSize: 12,
        paddingVertical: 6,
        borderRadius: 20,
        overflow: 'hidden',
        letterSpacing: 0.3,
        paddingHorizontal: 10,
        maxWidth: 160
    },
});