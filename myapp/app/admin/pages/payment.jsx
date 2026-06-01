import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { deletePayments, getAllPayments } from '../../../hooks/usePayments';
import { useDispatch, useSelector } from 'react-redux';
import { deletePayment, setPayments } from '../../../features/paymentSlice';
import UpdatePaymentStatusModal from '../../../components/paymentStatusUpadate';

const Payment = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const payments = useSelector(state => state.payments.payments || []);
  const user = useSelector(state => state.user.user || {});
  const userId = user?.id;
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    const response = await getAllPayments();
    if (response.success) {
      dispatch(setPayments(response.payments));
      console.log(response.payments)
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);


  const handleDelete = async (item) => {
    dispatch(deletePayment(item._id));
    const response = await deletePayments(item._id);
    if (response.success) {
      Alert.alert(response.message);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="wallet-outline" size={22} color="#2563EB" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>Transaction #{item.transactionId || []}</Text>
          <Text style={styles.carName}> {item.paymentMethod}</Text>
        </View>

        <Text style={[styles.status, item.paymentStatus === "Paid" ? styles.success : styles.pending,]} >{item.paymentStatus} </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Booking ID</Text>
        <Text style={styles.value}>{item.bookingId?._id}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>User Name</Text>
        <Text style={styles.value}>{item?.userId?.name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>User Email</Text>
        <Text style={styles.value}>{item?.userId?.email}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.amount}>₹{item.amount}</Text>
          <Text style={styles.date}> {new Date(item.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => { setStatusModalVisible(true); setSelectedPayment(item); }} >
            <Ionicons name="create-outline" size={20} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

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

      <FlatList data={payments} keyExtractor={(item) => item?._id} renderItem={renderItem} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} />
      <UpdatePaymentStatusModal visible={statusModalVisible} onClose={() => setStatusModalVisible(false)} selectedPayment={selectedPayment} />
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  value: {
    flex: 1,
    textAlign: "right",
    color: "#111827",
    fontSize: 13,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  }
});