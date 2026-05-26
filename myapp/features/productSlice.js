import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        cars: [],
    },

    reducers: {
        setCars: (state, action) => {
            state.cars = action.payload;
        },

        setCarsRedux: (state, action) => {
            state.cars.unshift(action.payload);
        },

        RemoveCars: (state, action) => {
            state.cars = state.cars.filter(
                car => car._id !== action.payload
            );
        }
    }
});

export const { setCars, setCarsRedux,RemoveCars } = productSlice.actions;
export default productSlice.reducer;