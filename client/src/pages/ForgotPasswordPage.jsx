import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { forgotPassword, loading } = useAuthStore();


  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-400">
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className='text-3xl font-bold text-center text-black mb-6'>
                  Forgot Password
                </h2>
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit}>
                    <p className='text-center mb-6 text-black'>Enter your email address to reset your password</p>
                    {/*Email*/}
                      <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      id="email" name="email" type="email" placeholder='Email Address'
                      required value={email}  onChange={(e) => setEmail(e.target.value)}/>
                  
                    {/*Button*/}
                      <button className={`w-full mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${ loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }`} type="submit"
                        disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Password Link"}
                      </button>
                  </form>
                ) : (
                  <div className='text-center'>
                    <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center
                    justify-center mx-auto mb-4'>
                      <Mail className='h-8 w-8 text-white' />
                    </div>
                    <p className='text-black mb-6'>
                      If an account exists for {email}, you will receive a password reset link
                      shortly.
                    </p>
                  </div>
                )}
                <div className='px-1 py-4 bg-opacity-50 flex justify-end'>
                    <Link to={"/auth"} className='text-sm text-black
                    hover:text-blue-500 flex items-center'>
                      <ArrowLeft className='h-4 w-4 mr-2'/> Back to Login
                    </Link>
                </div>
            </div>

            
    </div>
  )
}

export default ForgotPasswordPage