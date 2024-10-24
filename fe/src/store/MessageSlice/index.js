import { createSlice } from "@reduxjs/toolkit";
import { getConversations } from "./asyncThunk";

export const defaulMessageInfo = {
  content: "",
  files: null,
  folder: null,
  media: [],
  /*
  {
    url: "",
    type: "",
  }
  */
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
    getMsgs: (state, action) => {
      const { msgs, isNew } = action.payload;
      if (isNew) {
        state.messages = msgs;
      } else {
        state.messages = [...msgs, state.messages];
      }
    },
    addNewMsg: (state, action) => {
      const msgInfo = action.payload;
      state.messages = [...state.messages, msgInfo];
      //Update last message
      if (state.selectedConversation?._id === msgInfo.conversationId) {
        state.selectedConversation.lastMsg = msgInfo;
      }
      const conversationIndex = state.conversations.findIndex(
        (item) => item._id === msgInfo.conversationId
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          lastMsg: msgInfo,
        };
      }
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

export const { updateMsgInfo, selectConversation, getMsgs, addNewMsg } =
  msgSlice.actions;
export default msgSlice.reducer;
