import { configureStore } from "@reduxjs/toolkit";
import AdminReducer from "./AdminSlice";
import MessageReducer from "./MessageSlice";
import NotificationReducer from "./NotificationSlice";
import PostReducer from "./PostSlice";
import ToastCreatedPost from "./ToastCreatedPost";
import UserReducer from "./UserSlice";
import UtilReducer from "./UtilSlice";

const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    util: UtilReducer,
    message: MessageReducer,
    notification: NotificationReducer,
    notificationCreatedPosts: ToastCreatedPost,
    admin: AdminReducer,
  },
});

export default store;
