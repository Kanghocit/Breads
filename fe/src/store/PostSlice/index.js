import { createSlice } from "@reduxjs/toolkit";
import { createPost, getPosts } from "./asyncThunk";

export const surveyTemplate = ({ placeholder, value }) => {
  return {
    placeholder,
    value,
  };
};

const initialState = {
  listPost: [],
  postSelected: null,
  postInfo: {
    content: "",
    media: {
      url: "",
      type: "", //img, video, gif
    },
    survey: [],
  },
  postAction: "", //action's name
  isLoading: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    selectPost: (state, action) => {
      state.postSelected = action.payload;
    },
    updatePostInfo: (state, action) => {
      state.postInfo = action.payload;
    },
    updatePostAction: (state, action) => {
      state.postAction = action.payload ?? "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      const listPost = action.payload;
      state.isLoading = false;
      state.listPost = listPost;
    });
    builder.addCase(createPost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      const newPost = action.payload;
      state.listPost = [...state.listPost, newPost];
      state.isLoading = false;
      state.postAction = "";
    });
  },
});

export const { selectPost, updatePostInfo, updatePostAction } =
  postSlice.actions;
export default postSlice.reducer;
