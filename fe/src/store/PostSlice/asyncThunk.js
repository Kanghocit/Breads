import { createAsyncThunk } from "@reduxjs/toolkit";
import { DELETE, GET, POST, PUT } from "../../config/API";
import PageConstant from "../../../../share/Constants/PageConstants";
import { POST_PATH, Route } from "../../../../share/APIConfig";

export const createPost = createAsyncThunk(
  "post/create",
  async ({ postPayload, action }, thunkApi) => {
    try {
      if (postPayload.survey?.length) {
        postPayload.survey = postPayload.survey.filter(
          (option) => option.value.trim() !== ""
        );
      }
      const rootState = thunkApi.getState();
      const currerntPage = rootState.util.currentPage;
      const userInfo = rootState.user.userInfo;
      const dispatch = thunkApi.dispatch;
      const data = await POST({
        path: Route.POST + POST_PATH.CREATE,
        payload: postPayload,
        params: {
          action: action,
        },
      });
      if (currerntPage !== PageConstant.USER) {
        dispatch(
          getPosts({
            filter: currerntPage,
            userId: userInfo._id,
          })
        );
      }
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
        path: Route.POST + POST_PATH.UPDATE,
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
      const currentPage = rootState.util.currentPage;
      const { postId } = payload;
      await DELETE({
        path: Route.POST + "/" + postId,
        params: { userId: userInfo._id },
      });
      return {
        postId,
        currentPage,
      };
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
      if (!params?.page) {
        params.page = 1;
      }
      if (!params?.limit) {
        params.limit = 20;
      }
      const posts = await GET({
        path: Route.POST + POST_PATH.GET_ALL,
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
        path: Route.POST + "/" + postId,
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
        path: Route.POST + POST_PATH.USER,
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
        path: Route.POST + POST_PATH.TICK_SURVEY,
        payload,
      });
      return payload;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);
