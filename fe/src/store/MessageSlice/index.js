import { createSlice } from "@reduxjs/toolkit";

export const defaulMessageInfo = {
  content: "",
  files: null,
  folder: null,
  media: {
    url: "",
    type: "",
  },
  audio: null,
  icon: "",
};
const initialState = {
  conversations: [], //List user message
  userSelected: null,
  messages: [], //List message in a conversation
  selectedConversation: null,
  msgInfo: defaulMessageInfo,
};

const msgSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    getConversations: (state, action) => {
      state.conversations = action.payload;
    },
    updateMsgInfo: (state, action) => {
      state.msgInfo = action.payload;
    },
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { getConversations, updateMsgInfo, selectConversation } =
  msgSlice.actions;
export default msgSlice.reducer;
