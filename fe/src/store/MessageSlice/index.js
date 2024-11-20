import { createSlice } from "@reduxjs/toolkit";
import { getConversationById, getConversations, getMsgs } from "./asyncThunk";
import { formatDateToDDMMYYYY } from "../../util";
import moment from "moment";

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
  selectedMsg: null,
  msgInfo: defaulMessageInfo,
  loadingConversations: false,
  loadingUploadMsg: false,
  loadingMsgs: false,
  isLoading: false,
  currentPageMsg: 1,
};

const msgSlice = createSlice({
  name: "message",
  initialState: initialMsgState,
  reducers: {
    updateCurrentPageMsg: (state, action) => {
      state.currentPageMsg = action.payload;
    },
    updateMsgInfo: (state, action) => {
      state.msgInfo = action.payload;
    },
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
      state.messages = {};
    },
    updateSelectedConversation: (state, action) => {
      const { key, value } = action.payload;
      if (key in state.selectedConversation) {
        state.selectedConversation[key] = value;
      }
    },
    addNewMsg: (state, action) => {
      const msgsInfo = action.payload;
      if (!msgsInfo?.length) {
        return;
      }
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
      if (state.selectedConversation?._id === msgsInfo[0]?.conversationId) {
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
    updateMsg: (state, action) => {
      const msgUpdate = action.payload;
      if (msgUpdate?._id) {
        const msgDateConvert = moment(msgUpdate?.createdAt).format(
          "DD/MM/YYYY"
        );
        const msgInListIndex = state.messages[msgDateConvert].findIndex(
          (msg) => msg._id === msgUpdate._id
        );
        if (msgInListIndex !== -1) {
          state.messages[msgDateConvert][msgInListIndex] = msgUpdate;
        }
      }
    },
    selectMsg: (state, action) => {
      state.selectedMsg = action.payload;
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
    builder.addCase(getMsgs.pending, (state) => {
      state.loadingMsgs = true;
    });
    builder.addCase(getMsgs.fulfilled, (state, action) => {
      const { msgs, isNew } = action.payload;
      if (isNew) {
        state.messages = msgs;
      } else {
        let currentMsgState = JSON.parse(JSON.stringify(state.messages));
        const listDate = Object.keys(msgs);
        for (let i = listDate.length - 1; i >= 0; i--) {
          let date = listDate[i];
          if (date in currentMsgState) {
            currentMsgState[date] = [...msgs[date], ...currentMsgState[date]];
          } else {
            const convertToEntries = Object.entries(currentMsgState);
            convertToEntries.unshift([date, msgs[date]]);
            currentMsgState = {};
            convertToEntries.forEach(([key, value]) => {
              currentMsgState[key] = value;
            });
          }
        }
        state.messages = currentMsgState;
      }
      state.loadingMsgs = false;
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
  updateCurrentPageMsg,
  updateMsg,
  updateSelectedConversation,
  selectMsg,
} = msgSlice.actions;
export default msgSlice.reducer;
