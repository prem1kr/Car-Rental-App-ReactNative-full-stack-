import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [],
    },
    reducers: {

        setAddressesRedux: (state, action) => {
            state.addresses = action.payload;
        },

        addAddressRedux: (state, action) => {
            state.addresses.unshift(action.payload);
        },

        updateAddressRedux: (state, action) => {
            const index = state.addresses.findIndex(
                (item) => item._id === action.payload._id
            );
            if (index !== -1) {
                state.addresses[index] = action.payload;
            }
        },

        deleteAddressRedux: (state, action) => {
            state.addresses = state.addresses.filter(
                (item) => item._id !== action.payload
            );
        },

        setDefaultAddressRedux: (state, action) => {
            state.addresses = state.addresses.map((item) => ({
                ...item, isDefault: item._id === action.payload
            }));
        },
    },
});

export const { setAddressesRedux, addAddressRedux, updateAddressRedux, deleteAddressRedux, setDefaultAddressRedux } = addressSlice.actions;

export default addressSlice.reducer;