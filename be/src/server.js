import "dotenv/config";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server started at on port:${PORT}`);
});

initSocket(server, app);
