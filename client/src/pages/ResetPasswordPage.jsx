import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { loading, resetPassword } = useAuthStore();

    const { token } = useParams();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            alert("Passwords do not match");
            return;
        }
        try {
            await resetPassword(token, password);
            toast.success("Password reset successfully, redirecting to Login Page...")
            setTimeout(() => {
                navigate("/auth");
            }, 2000);
        } catch (error) {
            console.log(error)
            toast.error(error.message || "Error resetting password")
        }
      };

  return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-400">
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                <form className='space-y-6'
                    onSubmit={handleSubmit}>
                    {/*Password*/}
                    <div className="mb-6">
                        <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        type="password" required value={password} placeholder="New Password" 
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    {/*Confirm Password*/}
                    <div className="mb-6">
                        <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        type="password" required value={confirmPassword} placeholder="Confirm Password" 
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>

                    {/*Button*/}
                    <div className="flex items-center justify-center">
                        <button className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${ loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }`} type="submit"
                            disabled={loading}>
                            {loading ? "Resetting" : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default ResetPasswordPage