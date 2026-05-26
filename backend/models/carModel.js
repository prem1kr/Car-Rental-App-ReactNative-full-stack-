import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    carName: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    carNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uppercase: true,
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    fuelType: {
        type: String,
        required: true,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']
    },
    price: {
        type: String,
        required: true
    },
images: [
   {
      url: String,
      public_id: String,
   }
],
    available: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    createAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

export default mongoose.model("Car", carSchema);
