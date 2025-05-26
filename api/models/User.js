import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  dateOfBirth: { type: Date, required: true }, // changed from age
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  photoAlbum: [{ type: String, default: "" }],
  lastLogin: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  //For matching algorithm
  gender: { type: String, required: true, enum: ["male", "female"] },
  genderPreference: { type: String, required: true, enum: ["male", "female", "both"] },
  weight: { type: Number, required: false },
  height: { type: Number, required: false },
  job: { type: String, required: false },
  religion: { type: String, required: false },
  location: { 
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: { type: String }
  },
  hobbies: [{ 
    type: String,
    required: false 
  }],
}, { timestamps: true });

// Virtual for age
userSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  let age = today.getFullYear() - this.dateOfBirth.getFullYear();
  const m = today.getMonth() - this.dateOfBirth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < this.dateOfBirth.getDate())) {
    age--;
  }
  return age;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

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
