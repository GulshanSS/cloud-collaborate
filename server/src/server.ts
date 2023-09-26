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
  socket.on("get-document", (documentId: string) => {
    const data = "";
    socket.join(documentId);
    socket.emit("load-document", data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });
});
