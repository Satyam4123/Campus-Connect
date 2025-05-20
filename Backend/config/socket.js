const { Server } = require("socket.io");

let io;
const userSocketMap = {};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
      console.log(`Registered ${userId} -> ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (let userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    });
  });
};

const sendNotification = (userId, message) => {
  const socketId = userSocketMap[userId];
  if (socketId && io) {
    io.to(socketId).emit("notification", message);
  }
};

module.exports = { initSocket, sendNotification };
