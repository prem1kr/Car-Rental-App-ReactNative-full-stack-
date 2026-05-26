import express from "express";
import { addAddress, deleteAddress, getUserAddresses, setDefaultAddress, updateAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add-address", addAddress);
addressRouter.get("/user-addresses/:userId", getUserAddresses);
addressRouter.put("/update-address/:id", updateAddress);
addressRouter.delete("/delete-address/:id", deleteAddress);
addressRouter.put("/set-default-address", setDefaultAddress);

export default addressRouter;