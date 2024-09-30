import { createSlice } from "@reduxjs/toolkit";
import {
  getUserInfo,
  login,
  logout,
  addPostToCollection,
  removePostFromCollection,
  updateProfile,
} from "./asyncThunk";

const defaultUser = {
  _id: "",
  email: "",
  name: "",
  username: "",
  bio: "",
  avatar: "",
  followed: [],
  followings: [],
  collection: [],
  links: [],
};

const initialState = {
  userInfo: defaultUser,
  userSelected: defaultUser,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.userInfo = defaultUser;
    });
    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      const user = action.payload;
      const localUserId = localStorage.getItem("userId");
      const isCurrentUser = user._id === localUserId;
      if (isCurrentUser) {
        state.userInfo = user;
      } else {
        state.userSelected = user;
      }
      state.isLoading = false;
    });
    builder.addCase(addPostToCollection.fulfilled, (state, action) => {
      const postAddId = action.payload;
      state.userInfo.collection = [...state.userInfo.collection, postAddId];
    });
    builder.addCase(removePostFromCollection.fulfilled, (state, action) => {
      const { postId: postRemoveId } = action.payload;
      state.userInfo.collection = state.userInfo.collection.filter(
        (postId) => postId !== postRemoveId
      );
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      const newUserData = action.payload;
      state.userInfo = newUserData;
    });
  },
});

export default userSlice.reducer;
