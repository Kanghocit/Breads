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
  reducers: {
    selectPost: (state, action) => {
      state.postSelected = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { selectPost } = postSlice.actions;
export default postSlice.reducer;
