// import SocketListener from "../SocketRouters/index.js";
import { Server } from "socket.io";
import NotificationListener from "./listeners/notification.listener.js";

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
      NotificationListener(socket, io);
      socket.on("disconnect", async (message) => {
        console.log("Socket disconnected");
        // await disconnect(socket, io);
      });
    });
  } catch (err) {
    console.log(err);
  }
};
