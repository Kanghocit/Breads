import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, PATCH, POST, PUT } from "../../config/API";
import PageConstant from "../../../../share/Constants/PageConstants";
import { updateListPost } from "../PostSlice";

export const signUp = createAsyncThunk(
  "user/signUp",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await POST({
        path: "users/signup",
        payload,
      });
      if (data) {
        localStorage.setItem("userId", data?._id);
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
          path: "users/get-admin",
        });
      } else {
        data = await POST({
          path: "users/login",
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
        path: "users/logout",
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
  async (payload, { rejectWithValue }) => {
    try {
      const userId = payload.userId;
      const data = await GET({
        path: "users/profile/" + userId,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
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
        path: `users/update/${userInfo._id}`,
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
        path: `collections/add`,
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
      const data = await PATCH({
        path: `collections/remove`,
        payload: {
          userId: userId,
          postId: postId,
        },
      });
      if (displayPageData === PageConstant.SAVED) {
        dispatch(updateListPost(data));
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
