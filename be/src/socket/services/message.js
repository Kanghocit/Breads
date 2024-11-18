import { getUserSocketByUserId } from "./user.js";

export const sendToSpecificUser = async ({
  recipientId,
  io,
  path,
  payload,
}) => {
  try {
    if (!recipientId) {
      return;
    }
    const recipientSocketId = await getUserSocketByUserId(recipientId, io);
    console.log("recipientSocketId: ", recipientSocketId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit(path, payload);
    }
  } catch (err) {
    console.log("sendToSpecificUser: ", err);
  }
};
