/*import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true,min: 18 },
    gender: { type: String, required: true, enum: ["male", "female"] },
    genderPreference: { type: String, required: true, enum: ["male", "female", "both"] },
    bio: { type: String, default: "" },
    photos: [{ type: String }],
    profilePicture: { type: String },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Middleware để tự động cập nhật lastUpdated khi profile được cập nhật
profileSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

// Middleware để tự động cập nhật lastUpdated khi profile được cập nhật qua updateOne/updateMany
profileSchema.pre('findOneAndUpdate', function(next) {
    this.set({ lastUpdated: new Date() });
    next();
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile; */