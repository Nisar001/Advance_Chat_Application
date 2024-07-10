import express from 'express'
import getMessages  from "../controllers/ChatController.js";
import requireSignIn  from '../middlewares/AuthMiddleware.js'; 

const route = express.Router();

route.get('/chat/', requireSignIn, getMessages);

export default route