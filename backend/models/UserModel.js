import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   
   userName: {
      type: String,
      required: true,
      trim: true
   },
   userEmail: {
      type: String,
      required: true,
      unique: true
   },
   userPhone: {
      type: String,
      required: true,
      unique: true
   },
   userPassword: {
      type: String,
      required: true
   },
}, {timestamps: true});

export default mongoose.model('Users', UserSchema);