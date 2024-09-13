import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listPost: [],
  postSelected: null,
  postInfo: {},
  postAction: "", //action's name
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default postSlice.reducer;
