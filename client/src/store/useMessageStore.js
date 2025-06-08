import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { getSocket } from '../socket/socket.client';
import { useAuthStore } from './useAuthStore';

// Define the handler outside so the same reference is used for on/off
const handleNewMessage = (message) => {
    const { currentChatUserId } = useMessageStore.getState();
    // Convert both to strings for comparison
    if (
        String(message.sender) === String(currentChatUserId) ||
        String(message.receiver) === String(currentChatUserId)
    ) {
        useMessageStore.setState(state => {
            const messageExists = state.messages.some(
                msg => msg._id === message._id ||
                    (msg.content === message.content && msg.sender === message.sender)
            );
            if (!messageExists) {
                return { messages: [...state.messages, message] };
            }
            return state;
        });
    }
};
const handleStatusUpdate = (updatedMessage) => {
    useMessageStore.setState(state => ({
        messages: state.messages.map(msg => 
            msg._id === updatedMessage._id ? updatedMessage : msg
        )
    }));
};
export const useMessageStore = create((set) => ({
    messages: [],
    loading: true,
    currentChatUserId: null,

    setCurrentChatUserId: (userId) => set({ currentChatUserId: userId }),
    sendMessage: async (receiverId, content) => {
        try {
            // Optimistically add message
            set(state => ({
                messages: [...state.messages, { 
                    _id: Date.now(), // Temporary ID
                    content, 
                    sender: useAuthStore.getState().authUser._id,
                    status: 'sent', // Initial optimistic status
                    createdAt: new Date().toISOString() // <-- Add this line
                }]

            }))
            const res = await axiosInstance.post('/messages/send', { receiverId, content });
            // Optionally: Replace optimistic message with server message here
            set(state => ({
                messages: state.messages.map(msg => 
                    msg._id === Date.now() ? res.data.message : msg
                )
            }));
        } catch (error) {
            set(state => ({
                messages: state.messages.filter(msg => msg._id !== Date.now())
            }));
            toast.error(error.response.data.message || "Error sending message");
        }
    },
    updateMessageStatus: async (messageId, status) => {
        try {
            await axiosInstance.post('/messages/update-status', { messageId, status });
        } catch (error) {
            console.log("Error updating message status: ", error);
        }
    },
    getMessages: async (userId) => {
        try {
            set({ loading: true });
            const res = await axiosInstance.get(`/messages/conversation/${userId}`);
            set({ messages: res.data.messages });
        } catch (error) {
            console.log("Error in getMessages: ", error);
            set({ messages: [] }); // Optionally: Do not clear messages on error
        } finally {
            set({ loading: false });
        }
    }, 

    subscribeToMessages: () => {
        const socket = getSocket();
        if (socket) {
            socket.on("newMessage", handleNewMessage);
            socket.on("messageStatusUpdate", handleStatusUpdate);
        }
    },

    unSubscribeFromMessages: () => {
        const socket = getSocket();
        if (socket) {
            socket.off("newMessage", handleNewMessage);
            socket.off("messageStatusUpdate", handleStatusUpdate);
        }
    }

}));