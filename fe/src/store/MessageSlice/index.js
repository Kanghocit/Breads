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
  usersMsg: [], //List user message
  userSelected: null,
  messages: [], //List message in a conversation
  selectedMsg: null,
  msgInfo: defaulMessageInfo,
};

const msgSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    updateMsgInfo: (state, action) => {
      state.msgInfo = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { updateMsgInfo } = msgSlice.actions;
export default msgSlice.reducer;
