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
            <div className="relative z-10 bg-white p-0 rounded-lg shadow-none max-w-md w-full">
                <form className="space-y-6"
                    onSubmit={(e) => {
                    e.preventDefault()
                    signin({ email, password }); }}>
                    {/*Email*/}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        id="email" name="email" type="email" autoComplete="email" required value={email} placeholder="anhit@gmail.com" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    {/*Password*/}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        id="password" name="password" type="password" autoComplete="password" required value={password} placeholder="........" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="flex items-center justify-between">
                        <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    {/*Button*/}
                    <div>
                        <button className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white 
                            ${ loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }`} type="submit"
                            disabled={loading}>
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default LoginForm;