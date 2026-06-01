import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        review: [],
    },

    reducers: {
        setReview: (state, action) => {
            state.review = action.payload;
        },
        setReviewRedux: (state, action) => {
            state.review.unshift(action.payload);
        },
        DelteReview: (state, action) => {
            state.review = state.review.filter(
                review => review._id !== action.payload
            );
        }

    }
});

export const { setReview, setReviewRedux, DelteReview } = reviewSlice.actions;
export default reviewSlice.reducer;