import mongoose from "mongoose";

export const getCollection = (name) => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB: Can not get Collection");
  }

  return db.collection(name);
};

export const ObjectId = (_id = null) => {
  if (!mongoose.isValidObjectId(_id)) {
    return new mongoose.Types.ObjectId();
  }
  return new mongoose.Types.ObjectId(_id);
};

export const destructObjectId = (objectId) => {
  return JSON.parse(JSON.stringify(objectId).replace("new ObjectId", ""));
};

export const getAllSockets = async (io) => {
  const sockets = await io.fetchSockets();
  return sockets;
};

export const getFriendsSocketId = async (io, friendsId) => {
  const listSocket = await getAllSockets(io);
  const socketsData = listSocket.map((sk) => sk.data);
  const friendsSocket = socketsData.filter((socket) =>
    friendsId?.includes(socket.userId)
  );
  if (!!friendsSocket?.length) {
    const friendsSocketId = friendsSocket.map((socket) => socket.id);
    return friendsSocketId;
  }
  return [];
};
