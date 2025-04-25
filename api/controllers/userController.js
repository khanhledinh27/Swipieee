import cloudinary from "../config/cloudinary.js"
import User from "../models/User.js"


export const updateProfile = async (req, res) => {
    try {
        const {profilePicture, ...otherData} = req.body

        let updateData = otherData

        if (profilePicture) {
            //base64 format
            if (profilePicture.startsWith("data:image")) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(profilePicture)
                    updateData.profilePicture = uploadResponse.secure_url;
                } catch (error) {
                    console.error("Failed to uploading Image:", uploadError);

                    return res.status(400).json({ success: false, message: "Failed to uploading image"})
                }
            }
        }

        const updateUser = await User.findByIdAndUpdate(req.user.id, updateData, {new: true});
        res.status(200).json({ success: true, user: updateUser });

    } catch (error) {
        console.log("Error in UpdateProfile:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}