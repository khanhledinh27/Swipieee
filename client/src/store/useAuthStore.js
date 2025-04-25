import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

export const useAuthStore = create((set) => ({
    authUser:null,
    checkingAuth:true,
    loading:false,
    message:null,

    signup: async (registerData) => {
        try {
            set({loading:true});
            const res = await axiosInstance.post("/auth/register", registerData);
            set({authUser: res.data.user});
            initializeSocket(res.data.user._id);
            toast.success("Register Successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({loading:false});
        }
    },
    verifyEmail: async (token) => {
        try {
            set({ loading: true });
            const res = await axiosInstance.post("/auth/verify-email", { token: token.join("") });
            set({ authUser: res.data.user });
            toast.success("Verified Successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
    forgotPassword: async (email) => {
        try {
            set({ loading: true });
            const res = await axiosInstance.post("/auth/forgot-password", { email })
            set({ message: res.data.message })
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading:false });
        }
    },
    resetPassword: async(token, password) => {
        set({ loading: true })
        try {
            const res = await axiosInstance.post(`/auth/reset-password/${token}`, {password});
            set({ message: res.data.message, loading: false })
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({ loading:false })
        }
    },
    signin: async (loginData) => {
        try {
            set({loading:true});
            const res = await axiosInstance.post("/auth/login", loginData);
            set({authUser: res.data.user});
            initializeSocket(res.data.user._id);
            toast.success("Login Successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({loading:false});
        }
    },
    logout: async () => {
        try {
            set({loading:true});
            const res = await axiosInstance.post("/auth/logout");
            disconnectSocket();
            if (res.status === 200) set({authUser: null});
            toast.success("Logout Successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({loading:false});
        }
    },
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/me");
            initializeSocket(res.data.user._id);
            set({authUser: res.data.user});
        } catch (error) {
            set({authUser: null});
            console.log(error);
        } finally {
            set({checkingAuth:false});
        }
    },
}));