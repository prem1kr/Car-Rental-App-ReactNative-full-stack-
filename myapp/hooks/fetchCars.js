import axios from "axios";

export const carData = async () => {
   try {

      const response = await axios.get('https://car-rental-app-backend-wxdr.onrender.com/api/car/get-car');
      return response.data;
   } catch (error) {
      console.log(error)
   }
};

export const addCar = async (data) => {
   try {
      const response = await axios.post('https://car-rental-app-backend-wxdr.onrender.com/api/car/add-car', data);
      return response.data;

   } catch (error) {
      console.log(error);
   }
}


export const editcar = async (id, updatedData) => {
   try {
      const response = await axios.put(`https://car-rental-app-backend-wxdr.onrender.com/api/car/edit-car/${id}`, updatedData);
      return response.data;

   } catch (error) {
      console.log("EDIT ERROR:", error?.response?.data || error.message
      );

      return null;
   }
};


export const deleteCar = async (id) => {
   try {
      const response = await axios.delete(`https://car-rental-app-backend-wxdr.onrender.com/api/car/delete-car/${id}`);
      return response.data.cars;

   } catch (error) {
      console.log(error);
      return null;
   }
};


