import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from "react-redux";
import { deleteReferal, getAllReferal } from '../../../hooks/useReferal';
import { removeReferal, setReferal } from '../../../features/referalSlice';

const ReferEarn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const referralsData = useSelector(state => state.referal.referal || []);
  const referrals = Array.isArray(referralsData) ? referralsData : [];
  const totalEarning = referrals.reduce((total, item) => total + (item.rewardAmount || 0), 0);
  const totalReferal = referrals.length;
  const totalJoined = referrals.filter((item) => item.status === "Joined").length;

  const fetchReferralData = async () => {
    const response = await getAllReferal();
    if (response.success) {
      dispatch(setReferal(response.referals))
    } else {
      console.log('error');
    }
  }

  const handleDeleteReferal = async (item) => {
   await dispatch(removeReferal(item?._id));
    const response = await deleteReferal(item?._id);
    if (response.success) {
      Alert.alert(response.message);
    }
  }

  useEffect(() => {
    fetchReferralData();
  }, []);


  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="people-outline" size={22} color="#2563EB" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item?.referrer?.name}</Text>
          <Text style={styles.code}> R-Code: {item?.referrer?.referralCode} </Text>
          <Text style={styles.label}>{item?.referredUser?.name}</Text>

        </View>

        <Text style={[styles.status, item?.status === "Joined" ? styles.success : styles.pending]} >{item?.status} </Text>



        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReferal(item)}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Refer & Earn</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <View style={styles.overviewCard}>
          <View style={styles.overviewTop}>
            <View>
              <Text style={styles.overviewTitle}>Total Referral Earnings</Text>
              <Text style={styles.overviewAmount}>₹{totalEarning}</Text>
            </View>

            <View style={styles.overviewIcon}>
              <Ionicons name="gift-outline" size={30} color="#fff" />
            </View>

          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}> {totalReferal}</Text>
              <Text style={styles.statLabel}> Referrals</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}> {totalJoined} </Text>
              <Text style={styles.statLabel}> Successful </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}> ₹{totalEarning} </Text>
              <Text style={styles.statLabel}> Reward </Text>
            </View>

          </View>

        </View>

        {/* <View style={styles.rewardCard}>
          <Text style={styles.sectionTitle}> Update Reward Amount </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#2563EB" />
            <TextInput placeholder="Reward Amount" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={rewardAmount} onChangeText={setRewardAmount} style={styles.input}/>
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateReward}>
            <Ionicons name="create-outline" size={20} color="#fff"/>
            <Text style={styles.buttonText}> Update Reward </Text>
          </TouchableOpacity>

        </View> */}

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}> Referral History </Text>
          <FlatList data={referrals} keyExtractor={(item) => item?.id || item?._id} renderItem={renderItem} scrollEnabled={false} />
        </View>

      </ScrollView>
    </View>
  );
};

export default ReferEarn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
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

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 80,
  },

  content: {
    padding: 10,
  },

  overviewCard: {
    backgroundColor: '#2563EB',
    borderRadius: 28,
    padding: 22,
    marginBottom: 22,
  },

  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  overviewTitle: {
    color: '#DCE7FF',
    fontSize: 15,
  },

  overviewAmount: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    marginTop: 8,
  },

  overviewIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },

  statBox: {
    alignItems: 'center',
  },

  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  statLabel: {
    color: '#DCE7FF',
    marginTop: 4,
    fontSize: 13,
  },

  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  inputContainer: {
    height: 58,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },

  updateButton: {
    height: 55,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  listSection: {
    marginBottom: 40,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  code: {
    color: '#6B7280',
    marginTop: 5,
  },

  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: '700',
  },

  success: {
    backgroundColor: '#DCFCE7',
    color: '#16A34A',
  },

  pending: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },

  bottomRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    color: '#9CA3AF',
    fontSize: 13,
  },

  amount: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '700',
    color: '#2563EB',
  },

  date: {
    marginTop: 6,
    color: '#6B7280',
  },
  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
});