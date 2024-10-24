import { getFriendsSocketInfo } from "../services/user.js";

export default class UserController {
  static connect = async (payload, socket, io) => {
    const { userId, userFollowed, userFollowing } = payload;
    socket.data = {
      id: socket.id,
      userId: userId,
      userFollowed: userFollowed,
      userFollowing: userFollowing,
      friendsInfo: [],
    };
    const friendsSocketInfo = await getFriendsSocketInfo(io, socket);
    socket.data.friendsInfo = friendsSocketInfo;
  };
}
