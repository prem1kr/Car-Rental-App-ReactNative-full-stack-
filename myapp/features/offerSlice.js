import { createSlice } from "@reduxjs/toolkit";

const offerSlice = createSlice({
    name: 'offer',
    initialState: {
        offer: [],
    },

    reducers: {
        setOffer: (state, action) => {
            state.offer = action.payload;
        },
        setOfferRedux: (state, action) => {
            state.offer.unshift(action.payload);
        },

        setDeleteOffer: (state, action) => {
            state.offer = state.offer.filter(
                offer => offer._id !== action.payload
            )
        }
    }
});

export const { setOffer, setOfferRedux, setDeleteOffer } = offerSlice.actions;
export default offerSlice.reducer;