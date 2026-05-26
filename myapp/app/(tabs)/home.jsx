import { FlatList, StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { useDispatch, useSelector } from 'react-redux';
import Header from '@/components/header';
import DiscountSlider from '@/components/discountSlider';
import BookingModal from '../../components/booking';
import { carData } from '../../hooks/fetchCars';
import { setCars } from '../../features/productSlice';


const Home = () => {
  const dispatch = useDispatch();
  const carsList = useSelector((state) => state.cars.cars || []);
  const user = useSelector(state => state.user.user || {});
  const userId = user?.id;
  const [visible, setVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const searchQuery = useSelector(state => state.search.query || '');


  const openBookingModel = (car) => {
    setSelectedCar(car);
    setVisible(true);
  };

  const fetchAllCars = async () => {
    const response = await carData();
    if (response.success) {
      dispatch(setCars(response.cars));
    }
  }

  const filteredCars = carsList.filter((item) =>
    item.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAllCars();
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.secondcontainer} contentContainerStyle={{ paddingBottom: 50 }}>

        <FlatList ListHeaderComponent={
          <View style={styles.headerWrapper}>
            <Header />
            <DiscountSlider />
          </View>
        }

          style={styles.listContainer} data={filteredCars} keyExtractor={(item) => item.id} renderItem={({ item }) => (

            <Pressable style={styles.card}  >
              <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="cover" onError={() => console.log("Image failed")} />

              <View style={styles.info}>
                <Text style={styles.name}>{item.carName.length > 11 ? item.carName.slice(0, 10) + '...' : item.carName}</Text>
                <Text style={styles.brand}>{item.brand.length > 15 ? item.brand.slice(0, 14) + '...' : item.brand}</Text>
                <Text style={styles.price}>₹{item.price}/day</Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={() => openBookingModel(item)} >
                <Text style={styles.buttonText}>Click for Rent</Text>
              </TouchableOpacity>
            </Pressable>
          )}
        />
      </View>
      <BookingModal visible={visible} onClose={() => setVisible(false)} car={selectedCar} userId={userId} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingVertical: 0,
    marginTop: 0
  },
  secondcontainer: {
    flex: 1,
    paddingBottom: 70,
  },

  listContainer: {
    padding: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  image: {
    width: 90,
    height: 70,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  button: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
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



  buttonText: {
    color: 'white'
  },

  headerWrapper: {
    marginBottom: 30,
    gap: 30

  }
});