import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const payments = [
  {
    id: '1',
    user: 'Prem Kumar',
    amount: '₹4,500',
    car: 'BMW X5',
    date: '12 May 2026',
    status: 'Success',
  },
  {
    id: '2',
    user: 'Rahul Sharma',
    amount: '₹2,000',
    car: 'Swift',
    date: '10 May 2026',
    status: 'Pending',
  },
  {
    id: '3',
    user: 'Ankit Verma',
    amount: '₹6,800',
    car: 'Audi A6',
    date: '8 May 2026',
    status: 'Success',
  },
];

const Payment = () => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="wallet-outline" size={22} color="#2563EB" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.carName}>{item.car}</Text>
        </View>

        <Text style={[styles.status, item.status === 'Success' ? styles.success : styles.pending]}>{item.status}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.amount}>{item.amount}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>

    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
      </View>

      <FlatList data={payments} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} />

    </View>
  );
};

export default Payment;

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
    marginLeft: 60,
  },

  content: {
    padding: 10,
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
    width: 50,
    height: 50,
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

  carName: {
    color: '#6B7280',
    marginTop: 4,
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
    marginTop: 18,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  amount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563EB',
  },

  date: {
    color: '#9CA3AF',
  },
});