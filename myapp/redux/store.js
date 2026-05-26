import productReducer from "@/features/productSlice";
import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "@/features/locationSlice";
import userReducer from "@/features/userSlice";
import chatuserReducer from "@/features/chatuserSlice";
import profileReducer from "@/features/profileSlice";
import notificationReducer from '@/features/notificationSlice';
import totalUserReducer from "@/features/totalUser";
import offerReducer from "@/features/offerSlice";
import bookingReducer from "@/features/bookingSlice";
import addressReducer from "@/features/addressSlice";
import paymentReducer from "@/features/paymentCardSlice";
import reviewReducer from "@/features/reviewSlice";
import referalReducer from "@/features/referalSlice";
import searchReducer from "@/features/searchSlice";

export const store = configureStore({
    reducer: {
        cars: productReducer,
        location: locationReducer,
        user: userReducer,
        chatuser: chatuserReducer,
        profile: profileReducer,
        notification: notificationReducer,
        totalUser: totalUserReducer,
        offer: offerReducer,
        booking: bookingReducer,
        address: addressReducer,
        payment: paymentReducer,
        review: reviewReducer,
        referal: referalReducer,
        search: searchReducer,
    }
});

