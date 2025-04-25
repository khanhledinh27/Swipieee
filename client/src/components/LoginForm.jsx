import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signin, loading } = useAuthStore();

    return (
        <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Get Started</h2>
                <form className='space-y-6'
                    onSubmit={(e) => {
                    e.preventDefault()
                    signin({ email, password }); }}>
                    {/*Email*/}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input className="sappearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        id="email" name="email" type="email" autoComplete="email" required value={email} placeholder="xxx@gmail.com" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    {/*Password*/}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        id="password" name="password" type="password" autoComplete="password" required value={password} placeholder="******************" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className='flex items-center justify-between'>
                        <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                            Forgot Password?
                        </Link>
                    </div>
                    {/*Button*/}
                    <div className="flex items-center justify-center">
                        <button className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${ loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }`} type="submit"
                            disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default LoginForm;