import { createAsyncThunk } from "@reduxjs/toolkit";
import { POST } from "../../config/API";

export const signUp = createAsyncThunk(
  "user/signUp",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await POST({
        path: "api/users/signup",
        payload,
      });
      if (data) {
        localStorage.setItem("users-KF", JSON.stringify(data));
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
      const data = await POST({
        path: "api/users/login",
        payload,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
