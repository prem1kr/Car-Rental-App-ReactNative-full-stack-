import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Navbar from '@/components/navbar';
import { Action, Item, Section } from '@/components/profileComponents';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../features/userSlice';
import { Logout } from '../../hooks/useLogout';
import { getUserReviews } from '../../hooks/useReview';
import { setReview } from '../../features/reviewSlice';

const Profile = () => {
  const router = useRouter();
  const user = useSelector(state => state.user.user || {});
  const userName = user?.name;
  const userId = user?.id;
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.review.review || []);
  const rating = reviews.reduce((sum, item) => sum + item.rating, 0);
  const averateRating = rating / reviews.length;

  const handleLogout = async () => {
    await Logout();
    dispatch(removeUser());
    router.replace('/pages/login');
  }

  const fetchUserReview = async () => {
    const response = await getUserReviews(userId);
    if (response.success) {
      dispatch(setReview(response.review));
    }
  }

  useEffect(() => {
    fetchUserReview();
  }, [userId]);

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
            <Text style={styles.badgeText}>⭐ {averateRating}</Text>
          </View>
        </LinearGradient>

        <View style={styles.quickActions}>
          <Action icon="car-outline" label="Bookings" onPress={() => router.push('/pages/booking')} />
          <Action icon="pricetag-outline" label="Offers" onPress={() => router.push('/pages/offer')} />
          <Action icon="headset-outline" label="Support" onPress={() => { router.push('/pages/chat'); }} />
        </View>
        {/* 
        <Section title="Rental Services">
          <Item icon="car-sport-outline" title="Daily Rentals" subtitle="Affordable rides anytime" />
          <Item icon="time-outline" title="Hourly Rentals" subtitle="Pay per hour" />
          <Item icon="calendar-outline" title="Long Trips" subtitle="Best for vacations" />
        </Section> */}

        <Section title="Account Settings">
          <Item icon="person-outline" title="Edit Profile" onPress={() => router.push('/pages/profile-edit')} />
          <Item icon="location-outline" title="Saved Addresses" onPress={() => router.push('/pages/address')} />
          <Item icon="card-outline" title="Payment Methods" onPress={() => router.push('/pages/paymentCards')} />
          <Item icon="notifications-outline" title="Notifications" onPress={() => router.push('/pages/notification')} />
          <Item icon="shield-checkmark-outline" title="Privacy & Security" />
        </Section>

        <Section title="My Activity">
          <Item icon="star-outline" title="Reviews" onPress={() => router.push('/pages/review')} />
          <Item icon="help-circle-outline" title="Help & FAQs" onPress={() => router.push('/pages/chat')} />
        </Section>

        <Section title="Earn with Us">
          <Item icon="cash-outline" title="Refer & Earn" subtitle="Earn rewards on referrals" onPress={() => router.push('/pages/referEarn')} />
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
    flex: 1,
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