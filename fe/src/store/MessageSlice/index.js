import { createSlice } from "@reduxjs/toolkit";
import { getConversationById, getConversations, getMsgs } from "./asyncThunk";
import { formatDateToDDMMYYYY } from "../../util";

export const defaulMessageInfo = {
  content: "",
  files: [],
  media: [],
  /*
  {
    url: "",
    type: "",
  }
  */
  icon: "",
};
export const initialMsgState = {
  conversations: [], //List user message
  userSelected: null,
  messages: {}, //List message in a conversation
  selectedConversation: null,
  msgInfo: defaulMessageInfo,
  loadingConversations: false,
  loadingUploadMsg: false,
  loadingMsgs: false,
  isLoading: false,
};

const msgSlice = createSlice({
  name: "message",
  initialState: initialMsgState,
  reducers: {
    updateMsgInfo: (state, action) => {
      state.msgInfo = action.payload;
    },
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    addNewMsg: (state, action) => {
      const msgsInfo = action.payload;
      const msgCreateDate = formatDateToDDMMYYYY(
        new Date(msgsInfo[0]?.createdAt)
      );
      const isValidDate = Object.keys(state.messages).includes(msgCreateDate);
      if (isValidDate) {
        state.messages[msgCreateDate] = [
          ...state.messages[msgCreateDate],
          ...msgsInfo,
        ];
      } else {
        state.messages[msgCreateDate] = [...msgsInfo];
      }
      //Update last message
      const lastMsg = msgsInfo[msgsInfo.length - 1];
      if (state.selectedConversation?._id === msgsInfo[0].conversationId) {
        state.selectedConversation.lastMsg = lastMsg;
      }
      const conversationIndex = state.conversations.findIndex(
        (item) => item._id === msgsInfo[0].conversationId
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          lastMsg: lastMsg,
        };
      }
    },
    updateLoadingUpload: (state, action) => {
      state.loadingUploadMsg = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConversations.pending, (state, action) => {
      state.loadingConversations = true;
    });
    builder.addCase(getConversations.fulfilled, (state, action) => {
      const newConversations = action.payload.data;
      const isLoadNew = action.payload.isLoadNew;
      if (!isLoadNew) {
        state.conversations.push(...newConversations);
      } else {
        state.conversations = newConversations;
      }
      state.loadingConversations = false;
    });
    builder.addCase(getMsgs.fulfilled, (state, action) => {
      const { msgs, isNew } = action.payload;
      if (isNew) {
        state.messages = msgs;
      } else {
        state.messages = [...msgs, state.messages];
      }
    });
    builder.addCase(getConversationById.fulfilled, (state, action) => {
      const conversation = action.payload;
      state.selectedConversation = conversation;
    });
  },
});

export const {
  updateMsgInfo,
  selectConversation,
  addNewMsg,
  updateLoadingUpload,
} = msgSlice.actions;
export default msgSlice.reducer;
