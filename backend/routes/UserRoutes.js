import express from "express";
import { loginController, registerController } from "../controllers/UserController.js";
import { requireSignIn } from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)

router.get('/user-auth', requireSignIn, (req, res) => {
   res.status(200).json({ok:true})
})

export default router