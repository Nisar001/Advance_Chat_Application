import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
   
  room: String,
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', MessageSchema);

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }],
  messages: [MessageSchema]
})

export const Chat = mongoose.model('chat', chatSchema)

