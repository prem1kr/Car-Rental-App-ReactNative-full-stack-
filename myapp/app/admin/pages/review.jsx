import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAllReview } from '../../../hooks/useReview';
import { useDispatch, useSelector } from 'react-redux';
import { setReview } from '../../../features/reviewSlice';

const Review = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.review.review || []);

  const fetchAllReview = async () => {
    const response = await getAllReview();
    if (response.success) {
      dispatch(setReview(response.reviews));
    }
  }

  useEffect(() => {
    fetchAllReview();
  }, []);


  const renderStars = (rating) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((item) => (<Ionicons key={item} name={item <= rating ? 'star' : 'star-outline'} size={18} color="#FBBF24" />))}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.reviewCard}>

      <View style={styles.topSection}>
        <View style={styles.userInfo}>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}> {item?.userName?.charAt(0).toUpperCase()} </Text>
          </View>
          <View>
            <Text style={styles.userName}> {item.userName} </Text>
            <Text style={styles.carName}> {item?.carId?.carName}• {item?.carId?.brand}  </Text>
          </View>

        </View>
        <Text style={styles.date}> {new Date(item?.createdAt).toLocaleString()} </Text>
      </View>

      {renderStars(item.rating)}

      <Text style={styles.reviewText}> {item.comment} </Text>

      {/* {/* <View style={styles.actionRow}>
        <TouchableOpacity style={styles.replyButton} >
          <Ionicons name="chatbubble-outline" size={18} color="#2563EB" />
          <Text style={styles.replyText}> Reply</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={styles.deleteText}> Delete </Text>
        </TouchableOpacity> 

      </View> */}

    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> User Reviews </Text>
      </View>

      <FlatList data={reviews} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} />

    </View>
  );
};

export default Review;

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

  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },

  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
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
    fontSize: 13,
  },

  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  starContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },

  reviewText: {
    marginTop: 14,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 24,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },

  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },

  replyText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },

  deleteText: {
    color: '#EF4444',
    fontWeight: '700',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#4ec28d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});