import { createSlice } from "@reduxjs/toolkit";

const totalUserSlice = createSlice({
    name: 'totalUser',
    initialState: {
        totalUser: 0,
    },

    reducers: {
        setTotalUser: (state, action) => {
            state.totalUser = action.payload;
        }
    }
});

export const { setTotalUser } = totalUserSlice.actions;
export default totalUserSlice.reducer;