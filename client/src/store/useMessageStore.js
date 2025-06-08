import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { getSocket } from '../socket/socket.client';
import { useAuthStore } from './useAuthStore';

// Define the handler outside so the same reference is used for on/off
const handleNewMessage = (message) => {
    const { currentChatUserId } = useMessageStore.getState();
    // Only add if the message is for the current chat
    if (
        message.sender === currentChatUserId ||
        message.receiver === currentChatUserId
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
                    sender: useAuthStore.getState().authUser._id }]
            }))
            const res = await axiosInstance.post('/messages/send', { receiverId, content });
            // Optionally: Replace optimistic message with server message here
            console.log("Message sent successfully: ", res.data);
        } catch (error) {
            // Optionally: Remove optimistic message here if send fails
            toast.error(error.response.data.message || "Error in sendMessage: ");
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
        }
    },

    unSubscribeFromMessages: () => {
        const socket = getSocket();
        if (socket) {
            socket.off("newMessage", handleNewMessage);
        }
    }

}));