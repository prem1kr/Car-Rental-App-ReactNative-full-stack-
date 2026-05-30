import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
    name: 'payments',
    initialState: {
        payments: [],
    },

    reducers: {
        setPayments: (state, action) => {
            state.payments = action.payload;
        },
        setPaymentsRedux: (state, action) => {
            state.payments.unshift(action.payload);
        },
        deletePayment: (state, action) => {
            state.payments = state.payments.filter((item) => item._id !== action.payload);
        }
    }
});

export const { setPayments, setPaymentsRedux, deletePayment } = paymentSlice.actions;
export default paymentSlice.reducer;