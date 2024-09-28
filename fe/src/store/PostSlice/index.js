import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  editPost,
  getPost,
  getPosts,
  getUserPosts,
  selectSurveyOption,
} from "./asyncThunk";

export const surveyTemplate = ({ placeholder, value }) => {
  return {
    placeholder,
    value,
  };
};

export const defaultPostInfo = {
  content: "",
  media: [],
  survey: [],
};

const initialState = {
  listPost: [],
  postSelected: null,
  postInfo: {
    content: "",
    media: [] /*
    {
      url: "",
      type: "", //img, video, gif
    }
    */,
    survey: [],
  },
  postAction: "", //action's name
  postReply: null,
  isLoading: true,
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
    updateListPost: (state, action) => {
      state.listPost = action.payload ?? [];
    },
    selectPostReply: (state, action) => {
      state.postReply = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPost.fulfilled, (state, action) => {
      const postSelected = action.payload;
      state.postSelected = postSelected;
    });
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      const listPost = action.payload;
      state.isLoading = false;
      state.listPost = listPost;
      state.postInfo = defaultPostInfo;
    });
    builder.addCase(createPost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      const newPost = action.payload;
      state.listPost = [newPost, ...state.listPost];
      state.isLoading = false;
      state.postAction = "";
    });
    builder.addCase(editPost.fulfilled, (state, action) => {
      const postUpdated = action.payload;
      const postIndex = state.listPost.findIndex(
        (post) => post._id === postUpdated._id
      );
      state.listPost[postIndex] = {
        ...state.listPost[postIndex],
        ...postUpdated,
      };
      state.postAction = "";
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const postId = action.payload;
      state.listPost = state.listPost.filter((post) => post._id !== postId);
    });
    builder.addCase(selectSurveyOption.fulfilled, (state, action) => {
      const { postId, userId, isAdd, optionId } = action.payload;
      const postTickedIndex = state.listPost.findIndex(
        ({ _id }) => _id === postId
      );
      const optionIndex = state.listPost[postTickedIndex].survey.findIndex(
        (option) => option._id === optionId
      );
      if (optionIndex !== -1) {
        const currentUsersId = JSON.parse(
          JSON.stringify(
            state.listPost[postTickedIndex].survey[optionIndex].usersId
          )
        );
        if (isAdd) {
          state.listPost[postTickedIndex].survey[optionIndex].usersId = [
            ...currentUsersId,
            userId,
          ];
        } else {
          state.listPost[postTickedIndex].survey[optionIndex].usersId =
            currentUsersId.filter((id) => id !== userId);
        }
      }
    });
    builder.addCase(getUserPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      const userPosts = action.payload;
      state.listPost = userPosts;
      state.isLoading = false;
    });
  },
});

export const {
  selectPost,
  updatePostInfo,
  updatePostAction,
  updateListPost,
  selectPostReply,
} = postSlice.actions;
export default postSlice.reducer;
