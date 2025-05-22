import Message from "../models/Message.js"
import { getIO, getConnectedUsers } from "../socket/socket.server.js"

export const sendMessage = async(req, res) => {
    try {
        const { content, receiverId } = req.body

        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        //Send messages in realtime using Socket.Io
        const io = getIO();
        const connectedUsers = getConnectedUsers();

        const receiverSocketId = connectedUsers.get(receiverId);
        const senderSocketId = connectedUsers.get(req.user.id);

        io.to([receiverSocketId, senderSocketId].filter(Boolean)).emit("newMessage", newMessage);


        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.log("Error in sendMessage: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const getConversation = async(req, res) => {
    const { userId} = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id }
            ]
        }).sort("createdAt")   
        res.status(201).json({ success: true, messages }); 
    } catch (error) {
        console.log("Error in getConversation: ", error);
        res.status(500).json({ success: false, messages: "Server Error" });
    }
};