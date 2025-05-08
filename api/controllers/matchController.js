import User from "../models/User.js";
import { getIO, getConnectedUsers } from "../socket/socket.server.js"

export const swipeRight = async (req, res) => {
    try {
        const { likeUserId } = req.params;
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likeUserId);

        if (!likedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!currentUser.likedBy.includes(likeUserId)) {
            currentUser.likedBy.push(likeUserId);
            await currentUser.save();

            // Check if my profile is already liked by the other user
            if (likedUser.likedBy.includes(currentUser.id)) {
                currentUser.matches.push(likeUserId);
                likedUser.matches.push(currentUser.id);

                // Save both users at the same time
                await Promise.all([currentUser.save(), likedUser.save()]);
                // Send Notification if Match using Socket.IO
                const connectedUsers = getConnectedUsers();
                const io = getIO();

                const likedUserSocketId = connectedUsers.get(likeUserId);
                

                if (likedUserSocketId) {
                    io.to(likedUserSocketId).emit("match", {
                        _id: currentUser._id,
                        name: currentUser.name,
                        profilePicture: currentUser.profilePicture
                    });
                }
                
                const currentSocketId = connectedUsers.get(currentUser._id.toString());
                if (currentSocketId) {
                    io.to(currentSocketId).emit("newMatch", {
                        _id: likedUser._id,
                        name: likedUser.name,
                        profilePicture: likedUser.profilePicture
                    });
                }
            }

            return res.status(200).json({ success: true, user: currentUser });
        }

        // Respond if the user is already liked
        res.status(200).json({ success: true, message: "User already liked" });
    } catch (error) {
        console.log("Error in swipeRight: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const swipeLeft = async (req, res) => {
    try {
        const { disLikeUserId } = req.params;
        const currentUser = await User.findById(req.user.id); // Corrected `findById` call

        if (!currentUser.dislikedBy.includes(disLikeUserId)) {
            currentUser.dislikedBy.push(disLikeUserId);
            await currentUser.save();
        }

        res.status(200).json({ success: true, user: currentUser });
    } catch (error) {
        console.log("Error in swipeLeft: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const getMatches = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("matches", "name profilePicture");
        res.status(200).json({ success: true, matches: user.matches });
    } catch (error) {
        console.log("Error in getMatches: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const getUserProfiles = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        //For filter
        const users = await User.find({
            $and: [
                { _id: {$ne: currentUser.id} }, //Prevent match your own profile
                // Prevent match the Profiles that liked, disliked or matched
                { _id: {$nin: currentUser.likedBy} },
                { _id: {$nin: currentUser.dislikedBy} },
                { _id: {$nin: currentUser.matches} },
                // Based on Gender that the user prefer to match
                { gender: currentUser.genderPreference === "both" ? { $in: ["male", "female"] } 
                : currentUser.genderPreference },
                { genderPreference: { $in: [currentUser.gender, "both" ]}},
                // Match based on hobbies (if both users have hobbies)
                /*...(currentUser.hobbies && currentUser.hobbies.length > 0 ? [{
                    $or: [
                        { hobbies: { $in: currentUser.hobbies } },
                        { hobbies: { $exists: false } }
                    ]
                }] : []),
                // Match based on location (within 50km radius if location exists)
                ...(currentUser.location && currentUser.location.coordinates ? [{
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: currentUser.location.coordinates
                            },
                            $maxDistance: 50000 // 50km in meters
                        }
                    }
                }] : [])
                */
            ]
        })
        res.status(200).json({ success: true, users })
    } catch (error) {
        console.log("Error in getUserProfiles: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};