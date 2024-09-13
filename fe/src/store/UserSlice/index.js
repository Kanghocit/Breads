import { createSlice } from "@reduxjs/toolkit";
import { login } from "./asyncThunk";

const initialState = {
  userInfo: {
    _id: "",
    email: "",
    name: "",
    username: "",
    bio: "",
    avatar: "",
  },
  userSelected: {
    _id: "",
    email: "",
    name: "",
    username: "",
    bio: "",
    avatar: "",
  },
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
  },
});

export default userSlice.reducer;
