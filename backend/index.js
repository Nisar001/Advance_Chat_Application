import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv'
import cors from 'cors'
import ConnnectDB from './config/ConnectDB.js'
import UserRoutes from './routes/UserRoutes.js'

dotenv.config()

const app = express();
// const server = createServer(app);
// const io = new Server(server);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});
ConnnectDB()

app.use(cors());
app.use(express.json());
app.use('/auth/v1', UserRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', ({ userId }) => {
    socket.join(userId);
  });

  socket.on('sendMessage', ({ sender, receiver, message }) => {
    io.to(receiver).emit('receiveMessage', { sender, message });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${process.env.DEV_MODE} on port ${PORT}`));