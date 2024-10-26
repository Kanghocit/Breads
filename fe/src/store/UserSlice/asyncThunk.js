import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, PATCH, POST, PUT } from "../../config/API";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { updateListPost } from "../PostSlice";
import {
  COLLECTION_PATH,
  Route,
  USER_PATH,
} from "../../Breads-Shared/APIConfig";

export const signUp = createAsyncThunk(
  "user/signUp",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await POST({
        path: Route.USER + USER_PATH.SIGN_UP,
        payload,
      });
      console.log("khang",data)
      if (data) {
        // localStorage.setItem("userId", data?._id);
        return data;
      }
      return null;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      let data = null;
      if (payload?.loginAsAdmin) {
        data = await GET({
          path: Route.USER + USER_PATH.ADMIN,
        });
      } else {
        data = await POST({
          path: Route.USER + USER_PATH.LOGIN,
          payload,
        });
      }
      if (data) {
        localStorage.setItem("userId", data?._id);
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await POST({
        path: Route.USER + USER_PATH.LOGOUT,
      });
      localStorage.removeItem("userId");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (payload, thunkAPI) => {
    try {
      const userId = payload.userId;
      const getCurrentUser = payload.getCurrentUser;
      const data = await GET({
        path: Route.USER + USER_PATH.PROFILE + userId,
      });
      return {
        user: data,
        getCurrentUser: getCurrentUser,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (payload, thunkAPI) => {
    try {
      const rootState = thunkAPI.getState();
      const userInfo = rootState.user.userInfo;
      const data = await PUT({
        path: Route.USER + USER_PATH.UPDATE + userInfo._id,
        payload,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addPostToCollection = createAsyncThunk(
  "user/addToCollection",
  async (payload, thunkAPI) => {
    try {
      const { userId, postId } = payload;
      await PATCH({
        path: Route.COLLECTION + COLLECTION_PATH.ADD,
        payload: {
          userId: userId,
          postId: postId,
        },
      });
      return postId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const removePostFromCollection = createAsyncThunk(
  "user/removeFromCollection",
  async (payload, thunkAPI) => {
    try {
      const rootState = thunkAPI.getState();
      const dispatch = thunkAPI.dispatch;
      const displayPageData = rootState.util.displayPageData;
      const { userId, postId } = payload;
      await PATCH({
        path: Route.COLLECTION + COLLECTION_PATH.REMOVE,
        payload: {
          userId: userId,
          postId: postId,
        },
      });
      if (displayPageData === PageConstant.SAVED) {
        const newListPost = rootState.post.listPost.filter(
          (post) => post._id !== postId
        );
        dispatch(updateListPost(newListPost));
        return {
          postId: postId,
        };
      }
      return {
        postId: postId,
      };
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const followUser = createAsyncThunk(
  "user/handleFollow",
  async (payload, thunkAPI) => {
    try {
      const { userFlId, userId } = payload;
      await PUT({
        path: Route.USER + USER_PATH.FOLLOW,
        payload: {
          userFlId,
          userId,
        },
      });
      return userFlId;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
