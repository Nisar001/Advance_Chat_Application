const Chat = require("../models/MessageModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", ({ userId }) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("privateMessage", async ({ senderId, receiverId, message }) => {
      const chat = await Chat.findOneAndUpdate(
        { users: { $all: [senderId, receiverId] } },
        { $push: { messages: { sender: senderId, content: message } } },
        { new: true, upsert: true }
      );

      io.to(receiverId).emit("privateMessage", { senderId, message });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
