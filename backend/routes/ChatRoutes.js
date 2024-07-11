import express from "express";
import {
  getMessages,
  getMessagesByRecipientName,
} from "../controllers/ChatController.js";

import authMiddleware from "./../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/chat/:recipientId", authMiddleware, getMessages);
router.get(
  "/messages/:recipientName",
  authMiddleware,
  getMessagesByRecipientName
);

export default router;
