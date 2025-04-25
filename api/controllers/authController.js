import User from "../models/User.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";

import { sendVerificationEmail, sendWelcomeEmail, 
    sendResetPasswordEmail, sendResetPasswordEmailSuccess } from "../mailtrap/email.js";

const registerToken = (id) => {
    //jwt token
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
//Sign up
export const registerUser = async (req, res) => {
    const { name, email, password, age, gender, genderPreference } = req.body;

    try {
        const userExists = await User.findOne({ email });
        //check User exist
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        //check filled all the fields
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({ success: false, message: "You need to fill all the fields" });
        }
        //check age over 18 years old
        if (age < 18) {
            return res.status(400).json({ success: false, message: "You need to be at least 18 years old to register" });
        }
        //check password
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Your password must be at least 6 characters" });
        }


        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const newUser = await User.create({ name, email, password, age, gender, genderPreference, verificationToken, verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 });
        const token = registerToken(newUser._id);

        await sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
            httpOnly: true, // Prevent XSS attacks
            sameSite: "strict", // Prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        })
        res.status(201).json ({ success: true, user: newUser })

    } catch (error) {
        console.log("Error in register controller:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
//Verify Email
export const verifyEmail = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ verificationToken: token, verificationTokenExpiresAt: { $gt: Date.now() } });
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        user.verified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({ success: true, message: "Email verified successfully}" });
    } catch (error) {
        console.log("Error in verify email controller:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
//Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;

        await user.save();
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ success: true, message: "Reset password email sent successfully" });

    } catch (error) {
        console.log("Error in forgot password controller:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
//Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();
        await sendResetPasswordEmailSuccess(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Error in reset password controller:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
//Login
export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        //check filled email and password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "You must fill all the fields to login!" })
        }
        //check Invalid email or password
        const user = await User.findOne({email}).select("+password");
        
        if (!user || !(await user.matchPassword(password))){
            return res.status(401).json({ success: false, message: "Invalid Email or Password" })
        }

        const token = registerToken(user._id);

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
            httpOnly: true, // Prevent XSS attacks
            sameSite: "strict", // Prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        })

        res.status(200).json({ success: true, user })

    } catch (error) {
        console.log("Error in login controller:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
//Logout
export const logoutUser = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout Successfully!"});
}
