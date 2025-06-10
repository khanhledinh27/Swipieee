import { useState, React } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import CoupleLoveSVG from '../assets/undraw_couple-love_32ys.svg';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            {/* Left Illustration */}
            <div className="hidden md:flex flex-1 items-center justify-center">
                {/* Replace src with your illustration path or SVG */}
                <img
                    src={CoupleLoveSVG}
                    alt="Login Illustration"
                    className="max-w-md w-full"
                    draggable={false}
                />
            </div>
            {/* Right Form */}
            <motion.div
                className="flex-1 flex items-center justify-center"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'inherit' }}>
                        <span className="font-semibold">Chào mừng bạn đến với <span className="italic font-bold">Swipieee</span></span>
                    </h2>
                    <motion.div
                        className="bg-white shadow-xl rounded-lg p-8"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {isLogin ? <LoginForm /> : <RegisterForm />}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? "Lần đầu đến với Swipieee?" : "Đã có tài khoản!"}
                            </p>
                            <motion.button
                                onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
                                className="mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isLogin ? "Tạo tài khoản mới" : "Đăng nhập ngay"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default AuthPage;