import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notificationCreatedPosts",
  initialState: {
    postId: null,
  },
  reducers: {
    setNotificationPostId: (state, action) => {
      state.postId = action.payload;
    },
    clearNotificationPostId: (state) => {
      state.postId = null;
    },
  },
});

export const { setNotificationPostId, clearNotificationPostId } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
