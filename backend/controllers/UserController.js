import UserModel from "../models/UserModel.js";
import { comparePassword, hashPassword } from './../helpers/AuthHelper.js'
import JWT from 'jsonwebtoken'

export const registerController = async(req, res) => {
   try {
      const {userName, userEmail, userPhone, userPassword} = req.body
      if(!userName){
         return res.send({
            message: "Name is Required"
         })
      }
      if(!userEmail){
         return res.send({
            message: "Email is Required"
         })
      }
      if(!userPhone){
         return res.send({
            message: "Phone is Required"
         })
      }
      if(!userPassword){
         return res.send({
            message: "Password is Required"
         })
      }
      const existingUser = await UserModel.findOne({userEmail})
      if(existingUser){
         return res.send({message:"Already Registered Plase Login"})
      }
      const hashedPassword = await hashPassword(userPassword);
      const user = await new UserModel({
         userName,
         userEmail,
         userPhone,
         userPassword: hashedPassword,
      }).save();

      res.status(200).send({
         success: true,
         message: "User register Successfully"
      })

   } catch (error) {
      console.log(error)
      res.status(500).json({
         success: false,
         message: "Error in Registration",
         error
      })
   }
};

export const loginController = async(req, res) => {
   try {
      const {userEmail, userPassword} = req.body;

      if(!userEmail || !userPassword){
         return res.status(404).json({
            success: false,
            message: "Invalid Emial or Password"
         })
      }
      const user = await UserModel.findOne({userEmail})
      if(!user){
         return res.status(404).json({
            success: false,
            message: "Email is Not Registered"
         })
      }
      const match = await comparePassword(userPassword, user.userPassword)
      if(!match){
         return res.json({
            success: false,
            message: "Invalid Password"
         })
      }
      const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: "2d"})
      res.status(200).send({
         success: true,
         message: "Login Successfully",
         user: {
            name: user.userName,
            email: user.userEmail,
            phone: user.userPhone
         },
         token,
      })
   } catch (error) {
      console.log(error)
      res.status(500).json({
         success: false,
         message: "Error in Login",
         error
      })
   }
};

export const usersController = async(req, res) => {
   try {
    const currentUserId = req.user.id;
    const users = await UserModel.find({ _id: { $ne: currentUserId } }).select("-userPassword");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const Searching = async(req, res) => {
   try {
    const { query } = req.query;
    const user = await UserModel.find({ userName: { $regex: query, $options: "i" } }).select("userName -_id");
    res.status(201).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
}