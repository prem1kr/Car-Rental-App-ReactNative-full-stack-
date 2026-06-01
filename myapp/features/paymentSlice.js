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
        updateAPayments : (state, action) =>{
            state.payments = state.payments.map(payment =>payment._id === action.payload._id? action.payload: payment
            );
        },
        deletePayment: (state, action) => {
            state.payments = state.payments.filter((item) => item._id !== action.payload);
        }
    }
});

export const { setPayments, setPaymentsRedux, deletePayment,updateAPayments } = paymentSlice.actions;
export default paymentSlice.reducer;