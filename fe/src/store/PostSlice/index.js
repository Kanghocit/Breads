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
import PostConstants from "../../util/PostConstants";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";

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
  usersTag: [],
  files: [],
};

const initialState = {
  listPost: [],
  postSelected: null,
  postInfo: defaultPostInfo,
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
    updatePostLike: (state, action) => {
      const { postId, usersLike } = action.payload;
      const postIndex = state.listPost.findIndex((post) => post._id === postId);

      if (postIndex !== -1) {
        state.listPost[postIndex] = {
          ...state.listPost[postIndex],
          usersLike: usersLike,
        };
      } else {
        if (state.postSelected._id === postId) {
          state.postSelected = {
            ...state.postSelected,
            usersLike: usersLike,
          };
        }
      }
    },
    reloadListPost: (state, action) => {
      state.listPost = [];
      state.isLoading = true;
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
      const newPosts = action.payload.posts;
      const isNewPage = action.payload.isNewPage;
      state.isLoading = false;
      if (!isNewPage) {
        state.listPost = [...state.listPost, ...newPosts];
      } else {
        state.listPost = newPosts;
      }
      state.postInfo = defaultPostInfo;
    });
    builder.addCase(createPost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      const newPost = action.payload;
      if (state.postAction === PostConstants.ACTIONS.REPLY) {
        state.postSelected.replies = [
          ...state.postSelected.replies,
          newPost._id,
        ];
      } else {
        state.listPost = [newPost, ...state.listPost];
      }
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
      state.postSelected = state.postInfo;
      state.postAction = "";
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const { postId, currentPage } = action.payload;
      if (
        state.postSelected?._id &&
        postId !== state.postSelected?._id &&
        currentPage === PageConstant.POST_DETAIL
      ) {
        state.listPost = state.postSelected.replies.filter(
          (post) => post._id !== postId
        );
        state.postSelected.replies = state.listPost;
      } else {
        const listPost = JSON.parse(JSON.stringify(state.listPost));
        const newListPost = listPost.filter(({ _id }) => _id !== postId);
        for (let i = 0; i < newListPost.length; i++) {
          const post = newListPost[i];
          if (post.parentPost === postId) {
            delete newListPost[i].parentPostInfo;
          }
          if (post?.quote?._id === postId) {
            delete newListPost[i].quote;
          }
        }
        state.listPost = newListPost;
      }
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
      //Update share post with survey
      const listPost = JSON.parse(JSON.stringify(state.listPost));
      const postsShared = listPost.filter(
        ({ parentPost }) => parentPost === postId
      );
      if (postsShared?.length) {
        for (const post of postsShared) {
          const postIndex = listPost.findIndex(({ _id }) => _id === post._id);
          state.listPost[postIndex].parentPostInfo.survey =
            state.listPost[postTickedIndex].survey;
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
  updatePostLike,
  reloadListPost,
} = postSlice.actions;
export default postSlice.reducer;
