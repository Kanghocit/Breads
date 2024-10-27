import { createAsyncThunk } from "@reduxjs/toolkit";
import { reloadListPost } from "../PostSlice";

export const changePage = createAsyncThunk(
  "util/changePage",
  (payload, thunkApi) => {
    const dispatch = thunkApi.dispatch;
    const { nextPage, currentPage } = payload;
    dispatch(reloadListPost());
    return {
      currentPage: currentPage ?? "",
      nextPage: nextPage,
    };
  }
);
