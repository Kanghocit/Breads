import { createSlice } from "@reduxjs/toolkit";

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
    changePage: (state, action) => {
      const { nextPage, currentPage } = action.payload;
      if (!currentPage) {
        state.prevPage = "";
      } else {
        state.prevPage = currentPage;
      }
      state.currentPage = nextPage;
    },
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
});

export const {
  changePage,
  updateSeeMedia,
  changeDisplayPageData,
  updateHasMoreData,
} = utilSlice.actions;
export default utilSlice.reducer;
