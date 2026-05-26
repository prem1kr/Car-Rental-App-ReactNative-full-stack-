import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Navbar from '../pages/navbar';
import { useDispatch, useSelector } from 'react-redux';
import CarImageSlider from '../../../components/carImageSlider';
import { deleteCar, editcar } from '../../../hooks/fetchCars';
import { Ionicons } from '@expo/vector-icons';
import EditCarModal from '../pages/editCar';
import { RemoveCars, setCars } from '../../../features/productSlice';

const Cars = () => {
  const carsData = useSelector(state => state.cars.cars || []);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const searchQuery = useSelector(state => state.search.query || '');

  const handleEdit = async (updatedData) => {
    if (!selectedCar?._id) return;
    const response = await editcar(selectedCar._id, updatedData);
    if (response?.success) {
      const updatedCars = carsData.map((car) => car._id === selectedCar._id ? response.car : car);
      dispatch(setCars(updatedCars));
      setModalVisible(false);
      setSelectedCar(null);
      Alert.alert("car data updated successfully");
    }
  };

  const handleDelete = async (id) => {
    dispatch(RemoveCars(id));
    const response = await deleteCar(id);
    if (response?.success) {
      Alert.alert('Car delete succesfully');
    }
  };

  const filteredCars = carsData.filter((item) =>
    item.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.secondcontainer} contentContainerStyle={{ paddingBottom: 60 }}>

        <FlatList style={styles.listContainer} data={filteredCars} keyExtractor={(item) => item._id} renderItem={({ item }) => (

          <View style={styles.card}>
            <CarImageSlider photos={item?.images || []} />
            <View style={styles.info}>
              <Text style={styles.name}>{item?.carName?.length > 20 ? item.carName.slice(0, 25) + '...' : item.carName}</Text>
              <Text style={styles.brand}>{item?.brand?.length > 30 ? item.brand.slice(0, 30) + '...' : item.brand}</Text>
              <Text style={styles.price}>₹{item.price}/day</Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => { setSelectedCar(item); setModalVisible(true); }}>
                <Ionicons name="create-outline" size={22} color="#5c95d6" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
                <Ionicons name="trash-outline" size={22} color="#c51111" />
              </TouchableOpacity>

            </View>

          </View>
        )}
        />

      </View>

      <EditCarModal visible={modalVisible} onClose={() => setModalVisible(false)} car={selectedCar} onSave={handleEdit} />
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
    paddingBottom: 70,

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
    maxHeight: 180,
  },

  info: {
    padding: 5,
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

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    position: 'absolute',
    right: 10,
    bottom: 50
  },

  editButton: {
    width: 26,
    height: 26,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    width: 26,
    height: 26,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
  },

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