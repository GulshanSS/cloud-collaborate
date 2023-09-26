import dotenv from "dotenv";
dotenv.config();
import config from "./config";

import io from "socket.io";

const socket = new io.Server(config.PORT, {
  cors: {
    origin: config.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket) => {
  socket.on("send-changes", (delta) => {
    socket.broadcast.emit("receive-changes", delta);
  });
});
