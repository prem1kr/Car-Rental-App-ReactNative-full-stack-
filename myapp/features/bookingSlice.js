const { createSlice } = require("@reduxjs/toolkit");

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        booking: [],
    },

    reducers: {
        setBooking: (state, action) => {
            state.booking = action.payload;
        },
        setBookingRedux: (state, action) => {
            state.booking.unshift(action.payload);
        },
        updateBookingRedux: (state, action) => {
            const { bookingId, status } = action.payload;
            const booking = state.booking.find((item) => item._id === bookingId);
            if (booking) {
                booking.status = status;
            }
        },
        deleteBookingRedux: (state, action) => {
            state.booking = state.booking.filter((item) => item._id !== action.payload);
        }
    }
});

export const { setBooking, setBookingRedux, updateBookingRedux, deleteBookingRedux } = bookingSlice.actions;
export default bookingSlice.reducer;