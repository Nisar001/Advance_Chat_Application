import express from "express";

import authMiddleware from "./../middlewares/AuthMiddleware.js";
import {
  alluser,
  searchByName,
  signin,
  signup,
} from "../controllers/UserController.js";

const route = express.Router();
route.get("/all/:id", authMiddleware, alluser);
route.post("/signin", signin);
route.post("/signup", signup);
route.get("/search", authMiddleware, searchByName);

export default route;
