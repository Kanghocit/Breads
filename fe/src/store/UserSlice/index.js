import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo, login, logout } from "./asyncThunk";

const defaultUser = {
  _id: "",
  email: "",
  name: "",
  username: "",
  bio: "",
  avatar: "",
  followers: [],
  followings: [],
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
  },
});

export default userSlice.reducer;
