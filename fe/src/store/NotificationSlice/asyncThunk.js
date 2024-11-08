import { createAsyncThunk } from "@reduxjs/toolkit";
import { POST } from "../../config/API";
import { Route, NOTIFICATION_PATH } from "../../Breads-Shared/APIConfig";

export const getNotificattions = createAsyncThunk(
  "notification/getNotifications",
  async (payload, thunkApi) => {
    try {
      const { userId, page, limit } = payload;
      const data = await POST({
        path: Route.NOTIFICATION + NOTIFICATION_PATH.GET,
        payload: {
          userId: userId,
          page: page,
          limit: limit,
        },
      });
      return data;
    } catch (err) {
      thunkApi.rejectWithValue(err.response.data);
    }
  }
);
