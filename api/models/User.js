import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
  genderPreference: { type: String, required: true, enum: ["male", "female", "both"] },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  
  lastLogin: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  //weight: { type: Number, required: true },
  //height: { type: Number, required: true },
  //location: { type: String, required: true },
  //hobbies: { type: [String], required: false },
  //job: { type: String, required: false },
  //religion: { type: String, required: false },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

//hash password before saving
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//save password as hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
