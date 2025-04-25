import {create} from 'zustand';
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";

export const useMatchStore = create((set) => ({
    matches: [],
    isLoadingUserProfile: false,
    isLoadingMyMatches: false,
    userProfiles: [],
    swipeNotification: null,
    
    getMyMatches: async () => {
        try {
            set({isLoadingMyMatches: true})
            const res = await axiosInstance.get("/matches")
            set({matches: res.data.matches})
            
        } catch (error) {
            set({matches: []})
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({isLoadingMyMatches: false})
        }
    },
    getUserProfiles: async () => {
        try {
            set({isLoadingUserProfile: true})    
            const res = await axiosInstance.get("/matches/user-profiles")
            set({userProfiles: res.data.users})
            
        } catch (error) {
            set({userProfiles: []})
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({isLoadingUserProfile: false})
        }
    },
    swipeLeft: async (user) => {
        try {
            set({ swipeNotification: "passed" })
            await axiosInstance.post("/matches/swipe-left/" + user._id)
        } catch (error) {
            console.log(error)
            toast.error("Failed to Swipe Left")
        } finally {
            setTimeout(() => {
                set({ swipeNotification: null })
            }, 1500);
        }
    },
    swipeRight: async (user) => {
        try {
            set({ swipeNotification: "liked" })
            await axiosInstance.post("/matches/swipe-right/" + user._id)

        } catch (error) {
            console.log(error)
            toast.error("Failed to Swipe Right")
        } finally {
            setTimeout(() => {
                set({ swipeNotification: null })
            }, 1500);
        }
    },
    subscribeToNewMatches: () => {
        try {
            const socket = getSocket();

            socket.on("newMatch", (newMatch) => {
                console.log("New match event received:", newMatch); // Debugging log
                set((state) => ({ 
                    matches: [...state.matches, newMatch] 
                }));
                toast.success("New match found!");
            });

            // Listen for match notifications for both users
            socket.on("matchNotification", (notification) => {
                console.log("Match notification received:", notification); // Debugging log
                toast.success(notification.message);
            });

        } catch (error) {
            console.log("Error in subscribeToNewMatches:", error); // Debugging log
        }
    },
    unSubcribeToNewMatches: () => {
        try {
            const socket = getSocket();
            socket.off("newMatch")
        } catch (error) {
            console.log(error);
        }
    },
}));