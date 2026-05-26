import express from 'express';
import { AddCar, EditCar, getCar, RemoveCar, TotalCars } from '../controllers/carController.js';

const carRouter = express.Router();

carRouter.post('/add-car', AddCar);
carRouter.put('/edit-car/:id', EditCar);
carRouter.delete('/delete-car/:id', RemoveCar);
carRouter.get('/get-car', getCar);
carRouter.get('/totol-car', TotalCars);

export default carRouter;
