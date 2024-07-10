import express from 'express';
import { createServer } from 'http';
import {Server as socketIo} from 'socket.io'
import dotenv from 'dotenv'
import path from 'path'
import {dirname} from 'path'
import cors from 'cors'
import {fileURLToPath} from 'url'
import bodyParser from 'body-parser';
import { Chat, Message } from './models/MessageModel.js';
import ConnnectDB from './config/ConnectDB.js'
import UserRoutes from './routes/UserRoutes.js'
import ChatRoute from './routes/ChatRoutes.js'
import requireSignIn from './middlewares/AuthMiddleware.js';

dotenv.config()

const app = express();
const server = createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

ConnnectDB()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", UserRoutes);
app.use("/auth", ChatRoute);

app.get('/messages/:room', requireSignIn, async (req, res) => {
  const room = req.params.room;
  const messages = await Message.find({ room }).sort({ timestamp: 1 });
  res.json(messages);
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Join Room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`${socket.user.userName} joined room ${room}`);
  });

  // Handle Messages
  socket.on('message', async ({ room, content }) => {
    const message = new Message({
      room,
      sender: socket.user.userName,
      content
    });
    await message.save();
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.resolve(__dirname, '../frontend/public')));

// Serve the index.html file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/public/index.html'));
});


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${process.env.DEV_MODE} on port ${PORT}`));