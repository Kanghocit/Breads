import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateHasMoreData } from "../UtilSlice";

export const getConversations = createAsyncThunk(
  "message/getConversations",
  async (data, thunkApi) => {
    try {
      const dispatch = thunkApi.dispatch;
      const hasMoreData = data?.length !== 0 ? true : false;
      dispatch(updateHasMoreData(hasMoreData));
      return data;
    } catch (err) {
      console.error("getConversations: ", err);
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);
