import { getAllSockets, getFriendsSocketInfo } from "../../util/index.js";

export default class UserController {
  static connect = async (payload, socket, io) => {
    const { userId, userFollowed, userFollowing } = payload;
    socket.data = {
      id: socket.id,
      userId: userId,
      userFollowed: userFollowed,
      userFollowing: userFollowing,
    };
    const friendsId = userFollowed.filter((userId) =>
      userFollowing?.includes(userId)
    );
    if (!!friendsId?.length) {
      const friendsSocketInfo = await getFriendsSocketInfo(io, friendsId);
    }
  };
}
