import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateHasMoreData } from "../UtilSlice";
import { formatDateToDDMMYYYY } from "../../util";
import { GET } from "../../config/API";
import { Route } from "../../Breads-Shared/APIConfig";

export const getConversations = createAsyncThunk(
  "message/getConversations",
  async (payload, thunkApi) => {
    try {
      const { data, isLoadNew } = payload;
      const dispatch = thunkApi.dispatch;
      const hasMoreData = data?.length !== 0 ? true : false;
      dispatch(updateHasMoreData(hasMoreData));
      return { data, isLoadNew };
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

export const getConversationById = createAsyncThunk(
  "message/getConversation",
  async (data, thunkApi) => {
    try {
      const rootState = thunkApi.getState();
      const userId = rootState.user.userInfo._id;
      const conversationId = data;
      const conversation = await GET({
        path: Route.MESSAGE + `/conversation/${conversationId}`,
        params: {
          conversationId: conversationId,
          userId: userId ? userId : localStorage.getItem("userId"),
        },
      });
      return conversation;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);
