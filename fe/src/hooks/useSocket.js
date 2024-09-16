import { useEffect } from "react";
import Socket from "../socket";

const useSocket = (listener, deps, disconnect = false) => {
  useEffect(() => {
    const socket = Socket.getInstant();

    if (socket) {
      listener && listener(socket);
    }

    return () => {
      if (disconnect && socket) {
        socket.disconnect();
      }
    };
  }, [...(deps ?? [])]);

  return null;
};

export default useSocket;
