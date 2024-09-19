import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "../../config/API";

export const createPost = createAsyncThunk(
  "post/create",
  async (payload, thunkApi) => {
    try {
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

//Temp
export const getPosts = createAsyncThunk(
  "post/getPosts",
  async (_, thunkApi) => {
    try {
      const posts = await GET({
        path: "posts/get-all",
      });
      return posts;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);
