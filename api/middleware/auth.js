import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ success: false, message: "You need to be authorized"})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({ success: false, message: "Invalid Token"})
        }

        const currentUser = await User.findById(decode.id);

        req.user = currentUser;
        next();
        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: "You are not authorized"})
        } else {
            return res.status(500).json({ success: false, message: "Server Error"})
        }
        
    }
}