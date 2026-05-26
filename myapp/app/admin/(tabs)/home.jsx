import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Navbar from '../pages/navbar';
import { useDispatch, useSelector } from 'react-redux';
import { totalUser } from '../../../hooks/totalUser';
import { setTotalUser } from '../../../features/totalUser';
import { getAllBookings } from '../../../hooks/useBooking';
import { setBooking } from '../../../features/bookingSlice';

const screenWidth = Dimensions.get('window').width;

const Home = () => {
  const user = useSelector(state => state.user.user || {});
  const car = useSelector(state => state.cars.cars) || [];
  const userN = user?.name?.charAt(0)?.toUpperCase() || '';
  const userName = user?.name;
  const totalCars = car.length;
  const dispatch = useDispatch();
  const totaluser = useSelector(state => state.totalUser.totalUser);
  const booking = useSelector(state => state.booking.booking || []);
  const totalRevenue = booking.filter(item => item.status === "Completed").reduce((total, item) => total + item.totalPrice, 0);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const stats = [
    {
      id: 1,
      title: 'Users',
      value: totaluser,
      icon: 'people-outline',
    },
    {
      id: 2,
      title: 'Revenue',
      value: `₹${totalRevenue}`,
      icon: 'wallet-outline',
    },
    {
      id: 3,
      title: 'Bookings',
      value: booking?.length,
      icon: 'calendar-outline',
    },
    {
      id: 4,
      title: 'Active Cars',
      value: totalCars,
      icon: 'car-sport-outline',
    },
  ];

  const fetchTotalUsers = async () => {
    try {
      const response = await totalUser();
      dispatch(setTotalUser(response.total));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getAllBookings();
      if (response?.success) {
        dispatch(setBooking(response.bookings));
      }

    } catch (error) {
      console.log(error);
    }
  };

  // Revenue OverViews
  const revenueMap = {};
  booking.filter((item) => item.status === "Completed").forEach(item => {
    const date = new Date(item.createdAt);
    const month = months[date.getMonth()];
    if (!revenueMap[month]) {
      revenueMap[month] = 0;
    }
    revenueMap[month] += item.totalPrice;
  });

  const currecntMonth = new Date().getMonth();
  const last5Months = [];

  for (let i = 4; i >= 0; i--) {
    const monthIndex = (currecntMonth - i + 12) % 12;
    last5Months.push(months[monthIndex]);
  }
  const revenueData = last5Months.map(month => revenueMap[month] || 0);

  // Booking OverView
  const bookingMap = {};
  const last5DaysLabels = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = weekDays[date.getDay()];
    last5DaysLabels.push(dayName);
    bookingMap[dayName] = 0;
  }

  booking.forEach(item => {
    const bookingDate = new Date(item.createdAt);
    const dayName = weekDays[bookingDate.getDay()];
    if (bookingMap[dayName] !== undefined) {
      bookingMap[dayName] += 1;
    }
  });
  const bookingData = last5DaysLabels.map(day => bookingMap[day]);

  //Recent Activity
  const bookingActivities = booking.map(item => ({ type: item.status === "Completed" ? "payment" : "booking", title: item.status === "Completed" ? `Payment received` : `New booking ${item.status}`, amount: item.totalPrice, createdAt: item.createdAt }));
  const userActivity = { type: "user", title: `${totaluser} total users registered`, createdAt: new Date() };
  const allActivities = [...bookingActivities, userActivity].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  useEffect(() => {
    fetchTotalUsers();
    fetchBookings();

  }, []);


  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topCard}>
          <View>
            <Text style={styles.welcome}> Welcome Back , </Text>
            <Text style={styles.subText}> {userName} </Text>
          </View>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}> {userN} </Text>
          </View>
        </LinearGradient>

        <View style={styles.cardContainer}>
          {stats.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={22} color="#007AFF" />
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardValue}> {item.value} </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}> Revenue Trend </Text>
          <Text style={styles.sectionSubTitle}> Last 5 Months </Text>
        </View>

        <View style={styles.chartCard}>
          <LineChart data={{ labels: last5Months, datasets: [{ data: revenueData }] }}
            width={screenWidth - 55} height={220} withVerticalLines={false} withHorizontalLines={false} withInnerLines={false} withOuterLines={false} withShadow={false} withDots={true} withVerticalLabels={true} withHorizontalLabels={true} bezier
            chartConfig={{
              backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', backgroundColor: '#fff', decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,122,255,${opacity})`, labelColor: () => '#9CA3AF',
              propsForDots: { r: '5', strokeWidth: '2', stroke: '#007AFF' },
              propsForBackgroundLines: { strokeWidth: 0 },
            }} style={styles.chart} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}> Bookings Overview</Text>
          <Text style={styles.sectionSubTitle}> Weekly Stats </Text>
        </View>

        <View style={styles.chartCard}>
          <BarChart data={{ labels: last5DaysLabels, datasets: [{ data: bookingData }] }}
            width={screenWidth - 55} height={240} fromZero showValuesOnTopOfBars={false} withHorizontalLabels={true} withInnerLines={false} withVerticalLabels={true} flatColor={true} yAxisLabel="" yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', backgroundColor: '#fff', decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,122,255,${opacity})`, labelColor: () => '#9CA3AF',
              propsForBackgroundLines: { strokeWidth: 0 }, fillShadowGradient: '#007AFF', fillShadowGradientOpacity: 1
            }} style={styles.chart} />
        </View>

        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}> Recent Activity </Text>

          {allActivities.map((item, index) => {
            const activityDate = new Date(item.createdAt);
            const now = new Date();
            const diffMs = now - activityDate;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            let timeText = '';
            if (diffMins < 60) {
              timeText = `${diffMins} mins ago`;
            } else if (diffHours < 24) {
              timeText = `${diffHours} hrs ago`;
            } else {
              timeText = `${diffDays} days ago`;
            }

            return (
              <View key={index} style={styles.activityItem}>
                <Ionicons name={item.type === "payment" ? "wallet-outline" : item.type === "user" ? "people-outline" : "car-outline"} size={20} color="#007AFF" />
                <View>
                  <Text style={styles.activityText}> {item.title} </Text>
                  <Text style={styles.activityTime}> {item.amount ? `₹${item.amount} • ` : ''}  {timeText}</Text>
                </View>
              </View>
            )
          })}

        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  scrollContainer: {
    paddingBottom: 70,
    paddingLeft: 0,
    paddingRight: 0
  },


  topCard: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#203a43',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  welcome: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },

  subText: {
    color: '#EAF2FF',
    marginTop: 6,
    fontSize: 15,
  },

  profileCircle: {
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: '#4ec28d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },

  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 18,
  },

  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#EDF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  cardTitle: {
    color: '#8E8E93',
    fontSize: 15,
    marginBottom: 6,
  },

  cardValue: {
    fontSize: 25,
    fontWeight: '700',
    color: '#111827',
  },

  sectionHeader: {
    marginTop: 18,
    marginBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  sectionSubTitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  chart: {
    borderRadius: 20,
  },

  activityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  activityTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },

  activityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  activityTime: {
    color: '#9CA3AF',
    marginTop: 4,
    fontSize: 13,
  },
});