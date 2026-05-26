import { createSlice } from "@reduxjs/toolkit";

const chatuserSlice = createSlice({
    name: 'chatuser',
    initialState: {
        chatuser: ''
    },
    reducers: {
        setChatuser: (state, action) => {
            state.chatuser = action.payload;
        },
        removeChatuser: (state) => {
            state.chatuser = null;
        },
    }
})

export const { setChatuser, removeChatuser } = chatuserSlice.actions;
export default chatuserSlice.reducer;