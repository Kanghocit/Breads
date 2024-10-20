import { createSlice } from "@reduxjs/toolkit";
import { getConversations } from "./asyncThunk";

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
  isLoading: false,
};

const msgSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    updateMsgInfo: (state, action) => {
      state.msgInfo = action.payload;
    },
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConversations.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getConversations.fulfilled, (state, action) => {
      const newConversations = action.payload;
      state.conversations = [...state.conversations, ...newConversations];
      state.isLoading = false;
    });
  },
});

export const { updateMsgInfo, selectConversation } = msgSlice.actions;
export default msgSlice.reducer;
