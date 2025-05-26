import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChatPage from "./pages/ChatPage";
import HobbyPickPage from "./pages/HobbyPickPage";

import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";


function App() {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(checkingAuth) return null;

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right, 
    #f0f0f0_1px, transparent_1px), linear-gradient(to_bottom, #f0f0f0_1px, transparent_1px)] bg-[size:6rem_4rem]">
      <Routes>
        <Route path="/" 
          element={ authUser ? (authUser.verified ? (authUser.hobbies?.length > 0 ? <HomePage/> : <Navigate to="/pick-hobbies" />) : <Navigate to={"/verify-email"} />) : <Navigate to={"/auth"} />}
        />
        <Route path="/auth" 
          element={ !authUser ? <AuthPage/> : (authUser.verified ? (authUser.hobbies?.length > 0 ? <Navigate to={"/"} /> : <Navigate to="/pick-hobbies" />) : <Navigate to={"/verify-email"} />) }
        />
        <Route path="/profile" 
          element={ authUser ? (authUser.verified ? (authUser.hobbies?.length > 0 ? <ProfilePage/> : <Navigate to="/pick-hobbies" />) : <Navigate to={"/verify-email"} />) : <Navigate to={"/auth"} /> }
        />
        <Route path="/chat/:id" 
          element={ authUser ? (authUser.verified ? (authUser.hobbies?.length > 0 ? <ChatPage/> : <Navigate to="/pick-hobbies" />) : <Navigate to={"/verify-email"} />) : <Navigate to={"/auth"} /> }
        />
        <Route path="/verify-email" 
          element={ authUser ? (!authUser.verified ? <EmailVerificationPage/> : (authUser.hobbies?.length > 0 ? <Navigate to={"/"} /> : <Navigate to="/pick-hobbies" />)) : <Navigate to={"/auth"} /> }
        />
        <Route path="/pick-hobbies" 
          element={ authUser ? (authUser.verified ? (authUser.hobbies?.length > 0 ? <Navigate to={"/"} /> : <HobbyPickPage/>) : <Navigate to={"/auth"} />) : <Navigate to={"/auth"} /> }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/reset-password/:token" element={<ResetPasswordPage/>}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
