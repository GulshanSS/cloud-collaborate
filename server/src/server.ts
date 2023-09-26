import dotenv from "dotenv";
dotenv.config();
import config from "./config";

import io from "socket.io";
import {
  findByIdOrCreateDocument,
  saveDocument,
} from "./services/document.service";

const socket = new io.Server(config.PORT, {
  cors: {
    origin: config.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket) => {
  socket.on("get-document", async (documentId: string) => {
    const document = await findByIdOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.content);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-changes", async (data: string) => {
      await saveDocument(documentId, data);
    });
  });
});
