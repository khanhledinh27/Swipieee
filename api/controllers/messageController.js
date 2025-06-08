import Message from "../models/Message.js"
import { getIO, getConnectedUsers } from "../socket/socket.server.js"

export const sendMessage = async(req, res) => {
    try {
        const { content, receiverId } = req.body

        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content,
            status: "sent" // Initial status
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
export const updateMessageStatus = async(req, res) => {
    try {
        const { messageId, status } = req.body;
        
        const message = await Message.findByIdAndUpdate(
            messageId,
            { status },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        // Notify users about status change
        const io = getIO();
        const connectedUsers = getConnectedUsers();

        const receiverSocketId = connectedUsers.get(message.receiver.toString());
        const senderSocketId = connectedUsers.get(message.sender.toString());

        io.to([receiverSocketId, senderSocketId].filter(Boolean)).emit("messageStatusUpdate", message);

        res.status(200).json({ success: true, message });
    } catch (error) {
        console.log("Error in updateMessageStatus: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};