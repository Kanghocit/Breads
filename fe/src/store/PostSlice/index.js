import { createSlice } from "@reduxjs/toolkit";

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
  extraReducers: (builder) => {},
});

export const { selectPost, updatePostInfo, updatePostAction } =
  postSlice.actions;
export default postSlice.reducer;
