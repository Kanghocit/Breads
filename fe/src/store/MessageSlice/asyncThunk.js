import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateHasMoreData } from "../UtilSlice";
import { formatDateToDDMMYYYY } from "../../util";

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

export const getMsgs = createAsyncThunk("message/getMsgs", (data, thunkApi) => {
  const { msgs, isNew } = data;
  const dateSet = [
    ...new Set(
      msgs.map((msg) => formatDateToDDMMYYYY(new Date(msg?.createdAt)))
    ),
  ];
  const splitMsgsByDate = {};
  dateSet.forEach((date) => {
    const msgsByDate = msgs.filter(
      (msg) => formatDateToDDMMYYYY(new Date(msg?.createdAt)) === date
    );
    splitMsgsByDate[date] = msgsByDate;
  });
  return { msgs: splitMsgsByDate, isNew: isNew };
});
