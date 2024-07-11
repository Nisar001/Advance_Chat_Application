import express from "express";
const app = express();

import http from "http";
import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server);

import bodyparser from "body-parser";
app.use(bodyparser.json());
import path from "path";
import { fileURLToPath } from "url";

import Chat from "./models/MessageModel.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3333;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

io.on("connection", (client) => {
  console.log("a user connected");

  client.on("sendMessage", async (data) => {
    const { recipientId, text, senderId } = data;
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
    });
    if (!chat) {
      chat = new Chat({ participants: [senderId, recipientId] });
    }
    chat.messages.push({ sender: senderId, text });
    await chat.save();
  });

  client.on("disconnected", () => {
    console.log("user disconnected");
  });
});

import ConnectDB from "./config/ConnectDB.js";
ConnectDB();

import userRoute from "./routes/UserRoutes.js";
import chatRoute from "./routes/ChatRoutes.js";
app.use("/api", chatRoute);
app.use("/api", userRoute);

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(port, () => {
  console.log(`Server listem on port ${port}`.bgCyan.white);
});
