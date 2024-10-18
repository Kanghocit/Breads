import { POST_PATH, Route } from "../../Breads-Shared/APIConfig.js";
import PostController from "../controllers/post.controller.js";

const PostListener = (socket, io) => {
  socket.on(Route.POST + POST_PATH.LIKE, (payload) =>
    PostController.likePost(payload, socket, io)
  );
};

export default PostListener;
