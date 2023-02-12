import { Server } from "socket.io";
import http from "http";
import { FRONTEND_URL } from "../utils/constants";

const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected to ${socket.id} `);

    socket.on("send-message", (conversationId, message) => {
      socket.to(conversationId).emit("new message", message);
    });
  });
};

export default initializeSocket;
