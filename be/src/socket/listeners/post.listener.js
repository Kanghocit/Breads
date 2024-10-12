import { POST_PATH } from "../../Breads-Shared/APIConfig.js";
import PostController from "../controllers/post.controller.js";

const PostListener = (socket, io) => {
  socket.on(POST_PATH.LIKE, (payload) =>
    PostController.likePost(payload, socket, io)
  );
};

export default PostListener;
