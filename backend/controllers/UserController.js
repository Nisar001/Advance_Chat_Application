import model from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await model.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const newuser = new model({
      name,
      email,
      password: hashedPassword,
    });
    await newuser.save();
    res.status(201).json(newuser);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await model.findOne({ email });
    const ismatch = await bcrypt.compare(password, user.password);

    if (!user || !ismatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    res.status(201).json({ token, userId: user.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const alluser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await model
      .find({ _id: { $ne: currentUserId } })
      .select("-password");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const searchByName = async (req, res) => {
  try {
    const { query } = req.query;
    const user = await model
      .find({ name: { $regex: query, $options: "i" } })
      .select("name -_id");
    res.status(201).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
