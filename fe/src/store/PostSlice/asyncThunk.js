import { createAsyncThunk } from "@reduxjs/toolkit";
import { DELETE, GET, POST, PUT } from "../../config/API";
import PageConstant from "../../../../share/Constants/PageConstants";

export const createPost = createAsyncThunk(
  "post/create",
  async ({ postPayload, action }, thunkApi) => {
    try {
      if (postPayload.survey?.length) {
        postPayload.survey = postPayload.survey.filter(
          (option) => option.value.trim() !== ""
        );
      }
      const dispatch = thunkApi.dispatch;
      const data = await POST({
        path: "posts/create",
        payload: postPayload,
        params: {
          action: action,
        },
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

export const deletePost = createAsyncThunk(
  "post/delete",
  async (payload, thunkApi) => {
    try {
      const rootState = thunkApi.getState();
      const userInfo = rootState.user.userInfo;
      const { postId } = payload;
      await DELETE({
        path: "posts/" + postId,
        params: { userId: userInfo._id },
      });
      return postId;
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

export const getPost = createAsyncThunk(
  "post/getPost",
  async (postId, thunkApi) => {
    try {
      const data = await GET({
        path: "posts/" + postId,
      });
      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);

export const getUserPosts = createAsyncThunk(
  "post/getUserPosts",
  async (userId, thunkApi) => {
    try {
      const data = await GET({
        path: "posts/get-user-posts",
        params: {
          userId: userId,
          filter: PageConstant.USER,
        },
      });
      return data;
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
