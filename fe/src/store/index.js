import { configureStore } from "@reduxjs/toolkit";
import MessageReducer from "./MessageSlice";
import NotificationReducer from "./NotificationSlice";
import PostReducer from "./PostSlice";
import UserReducer from "./UserSlice";
import UtilReducer from "./UtilSlice";
import ToastCreatedPost from "./ToastCreatedPost"
const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    util: UtilReducer,
    message: MessageReducer,
    notification: NotificationReducer,
    notificationCreatedPosts: ToastCreatedPost
  },
});

export default store;
