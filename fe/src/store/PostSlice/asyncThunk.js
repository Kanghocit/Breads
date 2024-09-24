import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT } from "../../config/API";
import { updatePostAction } from ".";

export const createPost = createAsyncThunk(
  "post/create",
  async (payload, thunkApi) => {
    try {
      if (payload.survey?.length) {
        payload.survey = payload.survey.filter(
          (option) => option.value.trim() !== ""
        );
      }
      const dispatch = thunkApi.dispatch;
      const data = await POST({
        path: "posts/create",
        payload,
      });
      dispatch(getPosts());
      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);

export const editPost = createAsyncThunk(
  "post/update",
  async (payload, thunkApi) => {
    try {
      const rootState = thunkApi.getState();
      const userInfo = rootState.user.userInfo;
      payload = {
        ...payload,
        userId: userInfo._id,
      };
      const data = await PUT({
        path: "posts/update",
        payload,
      });
      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);

// Temp
export const getPosts = createAsyncThunk(
  "post/getPosts",
  async (params, thunkApi) => {
    try {
      const posts = await GET({
        path: "posts/get-all",
        params,
      });
      return posts;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);

export const selectSurveyOption = createAsyncThunk(
  "post/tickSurvey",
  async (payload, thunkApi) => {
    try {
      await PUT({
        path: "posts/tick-post-survey",
        payload,
      });
      return payload;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);
