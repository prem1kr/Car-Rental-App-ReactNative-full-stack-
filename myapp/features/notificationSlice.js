import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name:'notification',
    initialState:{
        notification:[]
    },
    reducers:{
        setNotification:(state,action) => {
            state.notification = action.payload;
        },
         addNotificationRedux: (state, action) => {
            state.notification.unshift(action.payload);
        },
    }
});

export const {setNotification,addNotificationRedux} = notificationSlice.actions;
export default notificationSlice.reducer;