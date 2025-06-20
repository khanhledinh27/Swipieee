import express from "express";
import { protectRoute } from "../middleware/auth.js"
import { sendMessage, getConversation, updateMessageStatus } from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute)
router.post("/send", sendMessage)
router.get("/conversation/:userId", getConversation)
router.post("/update-status", updateMessageStatus);
export default router;
