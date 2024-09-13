import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: "",
  prevPage: "",
};

const utilSlice = createSlice({
  name: "util",
  initialState,
  reducers: {
    changePage: (state, action) => {
      const { nextPage, currentPage } = action.payload;
      state.prevPage = currentPage;
      state.currentPage = nextPage;
    },
  },
});

export const { changePage } = utilSlice.actions;
export default utilSlice.reducer;
