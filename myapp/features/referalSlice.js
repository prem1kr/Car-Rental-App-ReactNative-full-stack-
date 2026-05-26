import { createSlice } from '@reduxjs/toolkit';

const referalSlice = createSlice({
    name: 'referal',
    initialState: {
        referal: {
            referralCode: "",
            totalEarning: 0,
            invites: [],
        }
    },

    reducers: {
        setReferal: (state, action) => {
            state.referal = action.payload;
        },
        setReferalRedux: (state, action) => {
            state.referal.unshift(action.payload);
        }
    }
});

export const { setReferal, setReferalRedux } = referalSlice.actions;
export default referalSlice.reducer;