import { createSlice } from "@reduxjs/toolkit";
import { createPost, getPosts, selectSurveyOption } from "./asyncThunk";

export const surveyTemplate = ({ placeholder, value }) => {
  return {
    placeholder,
    value,
  };
};

const defaultPostInfo = {
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
  },
});

export const { selectPost, updatePostInfo, updatePostAction } =
  postSlice.actions;
export default postSlice.reducer;
