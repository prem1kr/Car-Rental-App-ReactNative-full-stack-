import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Share, ActivityIndicator, } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateReferal, referalDetails, } from '../../hooks/useReferal';
import { useDispatch, useSelector } from "react-redux"
import { setReferal } from '../../features/referalSlice';

const ReferEarn = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(state => state.user.user || {});
    const referals = useSelector(state => state.referal.referal || []);
    const invites = Array.isArray(referals?.invites) ? referals.invites : [];
    const referralCode = referals?.referralCode || "";
    const totalEarnings = referals?.totalEarning || 0;

    const fetchReferralData = async () => {
        try {
            const userid = await AsyncStorage.getItem("userId");
            const currentUserId = user?.id || userid || user?._id;
            
            await generateReferal(currentUserId);
            const response = await referalDetails(currentUserId);
            if (response.success) {
                dispatch(setReferal({
                    referralCode: response.referralCode,
                    totalEarning: response.totalEarning,
                    invites: response.invites
                }));

            } else {
                console.log(response.message)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const shareCode = async () => {
        try {
            await Share.share({ message: `🚗 Join this car rental app & get ₹100 off!\n` + `Use my code: ${referralCode}` });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchReferralData();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.inviteCard}>
            <View>
                <Text style={styles.name}>{item?.referredUser?.name} </Text>
                <Text style={styles.status}>{item.status}</Text>
            </View>
            <Text style={styles.reward}> ₹{item.rewardAmount} </Text>
        </View>
    );


    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Refer & Earn
                </Text>

            </View>

            <View style={styles.content}>

                <View style={styles.banner}>

                    <Ionicons
                        name="gift-outline"
                        size={40}
                        color="#fff"
                    />

                    <Text style={styles.bannerText}>
                        Invite friends & earn ₹100 for each referral!
                    </Text>

                </View>

                {/* Referral Code */}
                <View style={styles.card}>

                    <Text style={styles.codeLabel}>
                        Your Referral Code
                    </Text>

                    <View style={styles.codeBox}>

                        <Text style={styles.code}>
                            {referralCode}
                        </Text>

                        <TouchableOpacity onPress={shareCode}>
                            <Ionicons
                                name="share-social-outline"
                                size={22}
                                color="#007BFF"
                            />
                        </TouchableOpacity>

                    </View>

                </View>

                {/* Earnings */}
                <View style={[styles.card, styles.earnings]}>

                    <Text style={styles.earnText}>
                        Total Earnings
                    </Text>

                    <Text style={styles.amount}>
                        ₹{totalEarnings}
                    </Text>

                </View>

                {/* Invites */}
                <Text style={styles.subHeader}>
                    Your Invites
                </Text>

                <FlatList
                    data={invites}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ textAlign: "center", marginTop: 20 }}>
                            No referrals yet
                        </Text>
                    }
                />

            </View>

        </SafeAreaView>
    );
};

export default ReferEarn;

const styles = StyleSheet.create({

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

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
        backgroundColor: '#f2f4f8',
    },

    content: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 70,
    },

    banner: {
        backgroundColor: '#1e88e5',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginTop: 14,
    },

    bannerText: {
        color: '#fff',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
    },

    card: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 16,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },

    codeLabel: {
        color: '#888',
        fontSize: 13,
    },

    codeBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },

    code: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 2,
    },

    earnings: {
        alignItems: 'center',
    },

    earnText: {
        color: '#888',
        fontSize: 13,
    },

    amount: {
        fontSize: 26,
        fontWeight: '700',
        marginTop: 5,
    },

    subHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
    },

    inviteCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },

    name: {
        fontWeight: '600',
        fontSize: 14,
    },

    status: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },

    reward: {
        fontWeight: '700',
        color: '#1e88e5',
    },
});