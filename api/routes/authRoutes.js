import express from "express";
import { registerUser, loginUser, logoutUser, verifyEmail, forgotPassword, resetPassword} from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/me", protectRoute, (req, res) => {
    res.send({ success: true, user: req.user })
})

export default router;
