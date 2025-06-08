import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { getSocket } from '../socket/socket.client';
import { useAuthStore } from './useAuthStore';

// Define handlers outside so the same reference is used for on/off
const handleNewMessage = (message) => {
    const { currentChatUserId } = useMessageStore.getState();
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
        const tempId = Date.now() + Math.random(); // Unique temp ID
        try {
            // Optimistically add message with temporary ID and 'sent' status
            set(state => ({
                messages: [...state.messages, { 
                    _id: tempId,
                    content, 
                    sender: useAuthStore.getState().authUser._id,
                    receiver: receiverId,
                    status: 'sent'
                }]
            }));
            
            const res = await axiosInstance.post('/messages/send', { receiverId, content });
            
            // Replace optimistic message with server message
            set(state => ({
                messages: state.messages.map(msg => 
                    msg._id === tempId ? res.data.message : msg
                )
            }));
            
        } catch (error) {
            // Remove optimistic message if send fails
            set(state => ({
                messages: state.messages.filter(msg => msg._id !== tempId)
            }));
            toast.error(error.response?.data?.message || "Error sending message");
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
            set({ messages: [] });
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
    },
}));
