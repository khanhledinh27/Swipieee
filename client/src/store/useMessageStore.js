import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { getSocket } from '../socket/socket.client';
import { useAuthStore } from './useAuthStore';

const handleNewMessage = (message) => {
    const { currentChatUserId } = useMessageStore.getState();
    
    const isCurrentChat = (
        String(message.sender) === String(currentChatUserId) ||
        String(message.receiver) === String(currentChatUserId)
    );

    if (isCurrentChat) {
        useMessageStore.setState(state => {
            const messageExists = state.messages.some(msg => 
                msg._id === message._id ||
                (msg.content === message.content && 
                 msg.sender === message.sender && 
                 msg.receiver === message.receiver &&
                 Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 10000)
            );
            
            if (!messageExists) {
                return { messages: [...state.messages, message] };
            }
            
            return {
                messages: state.messages.map(msg => 
                    msg._id === message._id ? message : msg
                )
            };
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
        const tempId = Date.now().toString();
        const authUser = useAuthStore.getState().authUser;
        
        try {
            set(state => ({
                messages: [...state.messages, { 
                    _id: tempId,
                    content, 
                    sender: authUser._id,
                    receiver: receiverId,
                    status: 'sent',
                    createdAt: new Date().toISOString()
                }]
            }));

            const res = await axiosInstance.post('/messages/send', { receiverId, content });
            
            set(state => ({
                messages: state.messages.map(msg => 
                    msg._id === tempId ? res.data.message : msg
                )
            }));
        } catch (error) {
            set(state => ({
                messages: state.messages.filter(msg => msg._id !== tempId)
            }));
            toast.error(error.response?.data?.message || "Error sending message");
        }
    },
    
    updateMessageStatus: async (messageId, status) => {
        try {
            set(state => ({
                messages: state.messages.map(msg => 
                    msg._id === messageId ? {...msg, status} : msg
                )
            }));
            
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
    }
}));