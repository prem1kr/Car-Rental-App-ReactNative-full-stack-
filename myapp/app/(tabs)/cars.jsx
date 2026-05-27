import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { useDispatch, useSelector } from 'react-redux';
import CarImageSlider from '../../components/carImageSlider';
import BookingModal from '../../components/bookingModal';
import { carData } from '../../hooks/fetchCars';
import { setCars } from '../../features/productSlice';

const Cars = () => {
  const dispatch = useDispatch();
  const carsData = useSelector(state => state.cars.cars);
  const [visible, setVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const user = useSelector(state => state.user.user || {});
  const userId = user?.id;
  const searchQuery = useSelector(state=> state.search.query || '');


  const openBookingModel = (car) => {
    setSelectedCar(car);
    setVisible(true);
  }

  const fetchAllCars = async () => {
    const response = await carData();
    if (response.success) {
      dispatch(setCars(response.cars));
    }
  }

  const filteredCars = carsData.filter((item) => 
    item.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAllCars();
  },[]);

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.secondcontainer}contentContainerStyle={{ paddingBottom: 50 }}>
        <FlatList style={styles.listContainer} data={filteredCars} keyExtractor={(item) => item.id}
          renderItem={({ item }) => (

            <View style={styles.card}>
              <CarImageSlider photos={item.images || [item.image]} />

              <View style={styles.info}>
                <Text style={styles.name}>{item.carName.length > 20 ? item.carName.slice(0, 20) + '...' : item.carName}</Text>
                <Text style={styles.brand}>{item.brand.length > 30 ? item.brand.slice(0, 30) + '...' : item.brand}</Text>
                <Text style={styles.price}>₹{item.price}/day</Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={() => openBookingModel(item)}>
                <Text style={styles.buttonText}>Click for Rent</Text>
              </TouchableOpacity>

            </View>
          )}
        />
      </View>

      <BookingModal visible={visible} onClose={() => setVisible(false)} car={selectedCar} userId={userId} />

    </View>
  );
};


export default Cars;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingVertical: 0,
    marginTop: 0
  },
  secondcontainer: {
    flex: 1,
    paddingBottom:75,
  },

  listContainer: {
    padding: 12,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
  },

  image: {
    width: 320,
    height: 180,
  },

  info: {
    padding: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },

  brand: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginTop: 8,
  },

  button: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    backgroundColor: '#007bff',
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  buttonText: {
    color: 'white',
  },

  // 🔥 DOTS
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: '#007bff',
    width: 10,
  },
});