import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        cards: [],
    },
    reducers: {
        setCardsRedux: (state, action) => {
            state.cards = action.payload;
        },

        addCardRedux: (state, action) => {
            state.cards.push(action.payload);
        },

        deleteCardRedux: (state, action) => {
            state.cards = state.cards.filter(
                (item) => item._id !== action.payload
            );
        },
    },
});

export const { setCardsRedux, addCardRedux, deleteCardRedux } = paymentSlice.actions;

export default paymentSlice.reducer;