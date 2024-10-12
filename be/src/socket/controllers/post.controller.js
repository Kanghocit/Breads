import { POST_PATH } from "../../Breads-Shared/APIConfig.js";
import { destructObjectId, getCollection, ObjectId } from "../../util/index.js";
import Model from "../../util/ModelName.js";

export default class PostController {
  static likePost = async (payload, socket, io) => {
    const { userId, postId } = payload;
    const postInfo = await getCollection(Model.POST).findOne({
      _id: ObjectId(postId),
    });
    if (postInfo) {
      const usersLike = postInfo.usersLike.map((id) => destructObjectId(id));
      const query = !usersLike?.includes(userId)
        ? {
            $push: { usersLike: ObjectId(userId) },
          }
        : {
            $pull: { usersLike: ObjectId(userId) },
          };
      await getCollection(Model.POST).updateOne(
        {
          _id: ObjectId(postId),
        },
        query
      );
      const updateList = usersLike?.includes(userId)
        ? usersLike.filter((id) => id !== userId)
        : [...usersLike, userId];
      io.emit(POST_PATH.GET_ONE, {
        usersLike: updateList,
        postId,
      });
    }
  };
}
