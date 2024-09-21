import { createSlice } from "@reduxjs/toolkit";
import {
  getUserInfo,
  login,
  logout,
  addPostToCollection,
  removePostFromCollection,
} from "./asyncThunk";

const defaultUser = {
  _id: "",
  email: "",
  name: "",
  username: "",
  bio: "",
  avatar: "",
  followers: [],
  followings: [],
  collection: [],
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
      state.userInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(addPostToCollection.fulfilled, (state, action) => {
      const postAddId = action.payload;
      state.userInfo.collection = [...state.userInfo.collection, postAddId];
    });
    builder.addCase(removePostFromCollection.fulfilled, (state, action) => {
      const postRemoveId = action.payload;
      state.userInfo.collection = state.userInfo.collection.filter(
        (postId) => postId !== postRemoveId
      );
    });
  },
});

export default userSlice.reducer;
