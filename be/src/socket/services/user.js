export const getAllSockets = async (io) => {
  const sockets = await io.fetchSockets();
  return sockets;
};

export const getFriendsSocketInfo = async (io, socket) => {
  const socketData = socket.data;
  const userFollowed = socketData?.userFollowed;
  const userFollowing = socketData?.userFollowing;
  const friendsId = userFollowed?.filter((userId) =>
    userFollowing?.includes(userId)
  );
  if (friendsId?.length) {
    const listSocket = await getAllSockets(io);
    const socketsData = listSocket.map((sk) => sk.data);
    const friendsSocket = socketsData?.filter((socket) =>
      friendsId?.includes(socket.userId)
    );
    if (!!friendsSocket?.length) {
      const friendsSocketInfo = friendsSocket.map((socket) => {
        return {
          socketId: socket.id,
          userId: socket.userId,
        };
      });
      return friendsSocketInfo;
    }
  }
  return [];
};

export const getFriendSocketId = async (userId, io, socket) => {
  const friendsSocketInfo = await getFriendsSocketInfo(io, socket);
  if (friendsSocketInfo?.length) {
    const socketId = friendsSocketInfo.find(
      (info) => info.userId === userId
    )?.socketId;
    return socketId;
  }
  return "";
};

export const getUserSocketByUserId = async (userId, io) => {
  const listSocket = await getAllSockets(io);
  const socketsData = listSocket.map((sk) => sk.data);
  const userSocketId = socketsData?.find(
    (socket) => socket?.userId === userId.toString()
  )?.id;
  return userSocketId;
};
