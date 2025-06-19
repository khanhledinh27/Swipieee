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
                    io.to(likedUserSocketId).emit("newMatch", {
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
        
        // 1. Define age range (±5 years from current user's age)
        const minAge = currentUser.age - 5;
        const maxAge = currentUser.age + 5;
        
        // Calculate birth date range for age filtering
        const minBirthDate = new Date();
        //Example: If current user is 30, minAge = 25, maxAge = 35
        minBirthDate.setFullYear(minBirthDate.getFullYear() - maxAge - 1);
        
        const maxBirthDate = new Date();
        maxBirthDate.setFullYear(maxBirthDate.getFullYear() - minAge);

        // 2. New gender matching logic:
        const genderConditions = [];
        
        // Handle current user's gender preference
        if (currentUser.genderPreference === "both") {
            genderConditions.push({
                gender: { $in: ["male", "female"] }
            });
        } else {
            genderConditions.push({
                gender: currentUser.genderPreference
            });
        }
        
        // Handle profile's gender preference (must include current user's gender)
        genderConditions.push({
            $or: [
                { genderPreference: currentUser.gender },
                { genderPreference: "both" }
            ]
        });

        // 3. Base query (excluded users + age + gender logic)
        const baseQuery = {
            $and: [
                { _id: { $ne: currentUser._id } },
                { _id: { $nin: currentUser.likedBy } },
                { _id: { $nin: currentUser.dislikedBy } },
                { _id: { $nin: currentUser.matches } },
                // Age range
                { 
                    dateOfBirth: { 
                        $gte: minBirthDate, 
                        $lte: maxBirthDate 
                    } 
                },
                // Gender conditions
                ...genderConditions
            ],
        };

        // 4. Add hobby matching with minimum 2 shared hobbies
        if (currentUser.hobbies?.length >= 2) {
            // Create an array of $and conditions for each hobby combination
            const hobbyCombinations = [];
            
            // Generate all possible pairs of hobbies (for minimum 2 matches)
            for (let i = 0; i < currentUser.hobbies.length; i++) {
                for (let j = i + 1; j < currentUser.hobbies.length; j++) {
                    hobbyCombinations.push({
                        hobbies: { 
                            $all: [
                                currentUser.hobbies[i],
                                currentUser.hobbies[j]
                            ]
                        }
                    });
                }
            }
            
            // Add $or condition to match any of the hobby pairs
            baseQuery.$and.push({
                $or: hobbyCombinations
            });
        }

        // 5. Fetch users with smart sorting
        const users = await User.find(baseQuery)
            .select("-password -verified -tokens") // Exclude sensitive data
            .lean() // Convert to plain JS objects for aggregation
            .exec();

        // 6. Enhanced sorting by relevance (hobby matches + last activity)
        const sortedUsers = users
            .map(user => {
                // Calculate hobby match score between current user and each user
                const hobbyMatches = currentUser.hobbies?.length 
                    ? user.hobbies?.filter(hobby => 
                        currentUser.hobbies.includes(hobby))
                    : [];
                const hobbyScore = hobbyMatches.length;

                return {
                    ...user,
                    hobbyMatches: hobbyMatches,
                    hobbyScore: hobbyScore,
                    // Add match percentage (optional) For example: 2 / 3 * 100 = 66.67%
                    matchPercentage: Math.round(
                        (hobbyMatches.length / Math.max(
                            currentUser.hobbies.length, 
                            user.hobbies.length
                        )) * 100
                    )
                };
            })
            .sort((a, b) => {
                // Primary sort: Hobby matches (descending)
                if (a.hobbyScore > b.hobbyScore) return -1;
                if (a.hobbyScore < b.hobbyScore) return 1;
                
                // Secondary sort: Match percentage (if same number of matches)
                if (a.matchPercentage > b.matchPercentage) return -1;
                if (a.matchPercentage < b.matchPercentage) return 1;
                
                // Tertiary sort: Last login (newest first)
                return new Date(b.lastLogin) - new Date(a.lastLogin);
            });

        res.status(200).json({ 
            success: true, 
            users: sortedUsers,
            meta: {
                hobbyMatches: currentUser.hobbies?.length >= 2,
                totalResults: sortedUsers.length,
                minHobbyMatches: 2,
                genderLogic: "reciprocal"
            }
        });

    } catch (error) {
        console.error("Error in getUserProfiles: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};