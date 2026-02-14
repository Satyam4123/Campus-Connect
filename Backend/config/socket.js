const socketio = require("socket.io");

let io;

const socketConfig = (server) => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.DEV_CLIENT_URL
  ].filter(Boolean);

  io = socketio(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("setup", (userId) => {
      socket.join(userId.toString());
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { socketConfig, getIO };
