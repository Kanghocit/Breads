import { createAsyncThunk } from "@reduxjs/toolkit";
import { POST_PATH, Route } from "../../Breads-Shared/APIConfig";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { DELETE, GET, POST, PUT } from "../../config/API";
import { updateHasMoreData } from "../UtilSlice";

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
      const data = await POST({
        path: Route.POST + POST_PATH.CREATE,
        payload: postPayload,
        params: {
          action: action,
        },
      });
      return {
        data,
        currentPage: currerntPage,
      };
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

export const getPosts = createAsyncThunk(
  "post/getPosts",
  async (params, thunkApi) => {
    try {
      const dispatch = thunkApi.dispatch;
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
      const hasMoreData = posts?.length !== 0 ? true : false;
      dispatch(updateHasMoreData(hasMoreData));
      return {
        posts: posts,
        isNewPage: params?.isNewPage ?? false,
      };
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
      const rootState = thunkApi.getState();
      const displayPageData = rootState.util.displayPageData;
      const currentPage = rootState.util.currentPage;
      const data = await GET({
        path: Route.POST + POST_PATH.GET_ALL,
        params: {
          userId: userId,
          filter: { page: PageConstant.USER, value: displayPageData },
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

export const updatePostStatus = createAsyncThunk(
  "post/updatePostStatus",
  async (payload, thunkApi) => {
    try {
      await POST({
        path: Route.POST + POST_PATH.UPDATE_POST_STATUS,
        payload,
      });
      return payload.postId;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);
