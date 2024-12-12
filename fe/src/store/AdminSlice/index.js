import { createSlice } from "@reduxjs/toolkit";

export const initialAdminState = {
  filterPostValidation: {
    user: "",
    postContent: [],
    postType: [],
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialAdminState,
  reducers: {
    updateFilterPostValidation: (state, action) => {
      state.filterPostValidation = action.payload;
    },
  },
});

export const { updateFilterPostValidation } = adminSlice.actions;
export default adminSlice.reducer;
