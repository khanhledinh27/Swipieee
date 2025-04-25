import { useState, React } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
    };

    return (
        <div className='min-h-screen flex items-center justify-center p-4' style={{ backgroundImage: "url('../src/assets/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <motion.div
                className='w-full max-w-md'
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                <h2 className='text-center text-3xl font-extrabold text-white mb-8'>
                    {isLogin ? "Sign in to Swipieee" : "Create a Swipieee account"}
                </h2>

                <motion.div
                    className='bg-white shadow-xl rounded-lg p-8'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {isLogin ? <LoginForm /> : <RegisterForm />}

                    <div className='mt-8 text-center'>
                        <p className='text-sm text-gray-600'>
                            {isLogin ? "New to Swipieee?" : "Already have an account!"}
                        </p>
                        <motion.button
                            onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
                            className='mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isLogin ? "Create a new account" : "Sign in to your account"}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default AuthPage;