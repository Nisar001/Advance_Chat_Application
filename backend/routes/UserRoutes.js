import express from "express";
import { loginController, registerController, Searching, usersController } from "../controllers/UserController.js";
import requireSignIn  from "../middlewares/AuthMiddleware.js";
import UserModel from "../models/UserModel.js";

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/search', requireSignIn, Searching)
router.get('/all/:id', requireSignIn, usersController)
router.get('/users', requireSignIn, usersController, async(req, res) => {
   const users = await UserModel.find({});
   res.send(users);
})

export default router