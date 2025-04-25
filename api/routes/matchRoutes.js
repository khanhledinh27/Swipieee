import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { swipeRight, swipeLeft, getMatches, getUserProfiles } from "../controllers/matchController.js"
const router = express.Router();

router.post("/swipe-right/:likeUserId", protectRoute, swipeRight);
router.post("/swipe-left/:disLikeUserId", protectRoute, swipeLeft);

router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;
