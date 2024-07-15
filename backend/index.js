const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/UserRoutes");
const chatSocket = require("./sockets/chatSocket");
const { authenticateSocket } = require("./middlewares/AuthMiddleware");
const dbConfig = require("./config/ConnectDB");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

dbConfig(); // Initialize MongoDB connection

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

io.use(authenticateSocket); // Middleware to authenticate socket connections
chatSocket(io);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
