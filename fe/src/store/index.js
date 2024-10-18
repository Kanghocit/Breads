import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice";
import PostReducer from "./PostSlice";
import UtilReducer from "./UtilSlice";
import MessageReducer from "./MessageSlice";

const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    util: UtilReducer,
    message: MessageReducer,
  },
});

export default store;
