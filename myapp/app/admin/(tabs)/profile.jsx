import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Navbar from '../pages/navbar';
import { Action, Item, Section } from '@/components/profileComponents';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeUser } from '../../../features/userSlice';
import { getAllReview } from '../../../hooks/useReview';
import { setReview } from '../../../features/reviewSlice';

const Profile = () => {
  const router = useRouter();
  const user = useSelector(state => state.user.user || {});
  const userName = user?.name;
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.review.review || []);
  const rating = reviews.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = rating / reviews.length;

  const handleLogout = async () => {
    try {
      await axios.post('https://car-rental-app-backend-wxdr.onrender.com/api/auth/logout');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      dispatch(removeUser());
      Alert.alert('Success', 'Logout successfully');
      router.replace('/pages/login');

    } catch (error) {
      console.log(error);
    }
  }

  const fetchReviews = async () => {
    const response = await getAllReview();
    if (response.success) {
      dispatch(setReview(response.reviews));
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  return (

    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView style={styles.secondcontainer} contentContainerStyle={{ paddingBottom: 50 }}>

        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.header}>
          <View>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.savings}>₹1200 saved on rentals</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ {averageRating}</Text>
          </View>
        </LinearGradient>

        <View style={styles.quickActions}>
          <Action icon="car-outline" label="Bookings" onPress={() => router.push('/admin/pages/booking')} />
          <Action icon="pricetag-outline" label="Add Offers" onPress={() => router.push('/admin/pages/offer')} />
          <Action icon="headset-outline" label="Support" onPress={() => { router.push('/pages/chat'); }} />
        </View>

        <Section title="Rental Services">
          <Item icon="car-sport-outline" title="Daily Rentals" subtitle="Affordable rides anytime" />
          <Item icon="time-outline" title="Hourly Rentals" subtitle="Pay per hour" />
          <Item icon="calendar-outline" title="Long Trips" subtitle="Best for vacations" />
        </Section>

        <Section title="Account Settings">
          <Item icon="person-outline" title="Edit Profile" onPress={() => router.push('/pages/profile-edit')} />
          <Item icon="car-outline" title="Add Cars" onPress={() => router.push('/admin/pages/addCars')} />
          <Item icon="card-outline" title="Payment History" onPress={() => router.push('admin/pages/payment')} />
          <Item icon="notifications-outline" title="Add Notifications" onPress={() => router.push('admin/pages/notification')} />
          <Item icon="shield-checkmark-outline" title="Privacy & Security" />
        </Section>

        <Section title="My Activity">
          <Item icon="star-outline" title="Reviews" onPress={() => router.push('/admin/pages/review')} />
          <Item icon="car-outline" title="Help & FAQs" onPress={() => router.push('/pages/chat')} />
        </Section>

        <Section title="Earn with Us">
          <Item icon="cash-outline" title="Refer & Earn" subtitle="Earn rewards on referrals" onPress={() => router.push('admin/pages/refer')} />
        </Section>

        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  secondcontainer: {
    flex: 1
  },

  header: {
    margin: 12,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },

  subText: {
    color: '#555',
    marginTop: 4,
  },

  savings: {
    marginTop: 6,
    fontSize: 13,
    color: '#ffffff',

  },

  badge: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },

  badgeText: {
    fontWeight: 'bold',
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 12,
    marginBottom: 10,
  },

  actionBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: 80,
    elevation: 2,
  },

  actionText: {
    fontSize: 12,
    marginTop: 5,
  },

  section: {
    marginTop: 15,
    paddingHorizontal: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
  },

  itemSubtitle: {
    fontSize: 12,
    color: '#777',
  },

  logout: {
    margin: 20,
    padding: 12,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    alignItems: 'center',
    bottom: 10,
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});