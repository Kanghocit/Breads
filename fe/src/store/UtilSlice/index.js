import { createSlice } from "@reduxjs/toolkit";
import { changePage } from "./asyncThunk";

export const initialUtilState = {
  currentPage: "",
  prevPage: "",
  seeMediaInfo: {
    open: false,
    media: [],
    currentMediaIndex: -1,
  },
  displayPageData: "",
  hasMoreData: false,
};

const utilSlice = createSlice({
  name: "util",
  initialState: initialUtilState,
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
      state.prevPage = currentPage ? currentPage : state.currentPage;
      state.currentPage = nextPage;
    });
  },
});

export const { updateSeeMedia, changeDisplayPageData, updateHasMoreData } =
  utilSlice.actions;
export default utilSlice.reducer;
