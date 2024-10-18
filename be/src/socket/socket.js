// import SocketListener from "../SocketRouters/index.js";
import { Server } from "socket.io";
import MessageListener from "./listeners/message.listener.js";
import NotificationListener from "./listeners/notification.listener.js";
import PostListener from "./listeners/post.listener.js";
import UserListener from "./listeners/user.listener.js";

export const initSocket = (server, app) => {
  try {
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
      path: "/socket",
    });
    app.set("socket_io", io);
    io.on("connection", async (socket) => {
      console.log("Server is connected with socket ", socket.id);
      UserListener(socket, io);
      NotificationListener(socket, io);
      PostListener(socket, io);
      MessageListener(socket, io);
      socket.on("disconnect", async (message) => {
        console.log("Socket disconnected");
        // await disconnect(socket, io);
      });
    });
  } catch (err) {
    console.log(err);
  }
};
