import express from "express";
import { loginController, registerController } from "../controllers/UserController.js";
import { requireSignIn } from "../middlewares/AuthMiddleware.js";
import UserModel from "../models/UserModel.js";

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)

router.get('/user-auth', requireSignIn, async(req, res) => {
   const users = await UserModel.find({});
   res.send(users);
})

export default router