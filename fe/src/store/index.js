import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice";
import PostReducer from "./PostSlice";
import UtilReducer from "./UtilSlice";

const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    util: UtilReducer,
  },
});

export default store;
