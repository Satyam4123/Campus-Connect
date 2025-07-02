const socketio = require("socket.io");
const Message = require("../models/messages");
const areConnected = require("../middlewares/areConnected");

const socketConfig = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("setup", (userId) => {
      socket.join(userId.toString());
    });

    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      const connected = await areConnected(senderId, receiverId);
      if (!connected) {
        return socket.emit("error", {
          message: "You are not connected with this user.",
        });
      }

      const newMessage = new Message({ senderId, receiverId, text });
      await newMessage.save();

      io.to(receiverId.toString()).emit("receiveMessage", newMessage);
      socket.emit("messageSent", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = socketConfig;
