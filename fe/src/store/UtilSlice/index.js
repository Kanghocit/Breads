import { createSlice } from "@reduxjs/toolkit";
import { changePage } from "./asyncThunk";

const initialState = {
  currentPage: "",
  prevPage: "",
  seeMediaInfo: {
    open: false,
    img: "",
  },
  displayPageData: "",
  hasMoreData: false,
};

const utilSlice = createSlice({
  name: "util",
  initialState,
  reducers: {
    updateSeeMedia: (state, action) => {
      state.seeMediaInfo = action.payload;
    },
    changeDisplayPageData: (state, action) => {
      state.displayPageData = action.payload;
    },
    updateHasMoreData: (state, action) => {
      state.hasMoreData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(changePage.fulfilled, (state, action) => {
      const { nextPage, currentPage } = action.payload;
      state.prevPage = currentPage;
      state.currentPage = nextPage;
    });
  },
});

export const { updateSeeMedia, changeDisplayPageData, updateHasMoreData } =
  utilSlice.actions;
export default utilSlice.reducer;
