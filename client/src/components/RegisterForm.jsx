import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';


const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(""); // changed from age
    const [genderPreference, setGenderPreference] = useState("");
    const { signup, loading } = useAuthStore();

    return (
        <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Tạo tài khoản mới</h2>
                <form className='space-y-6' 
                    onSubmit={(e) => { 
                    e.preventDefault() 
                    signup({ name, email, password, dateOfBirth, gender, genderPreference });
                     }}>
                    {/*Name*/}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Tên
                            </label>
                            <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div>
                    {/*Date of Birth*/}
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
                                Ngày sinh
                            </label>
                            <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            id="dateOfBirth" name="dateOfBirth" type="date" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}/>
                        </div>
                    </div>

                    {/*Email*/}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Địa chỉ Email
                        </label>
                        <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        id="email" name="email" type="email" autoComplete="email" required value={email}  onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    {/*Password*/}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        id="password" name="password" type="password" autoComplete="new-password" required value={password}  onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    

                    {/*Gender*/}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                            Giới tính 
                        </label>
                        <div className='flex items-center'>
                            {/*Male*/}
                            <input className="h-4 w-4 text-red-600 focus:ring-pink-500 border-gray-300 rounded" 
                            id="male" name="gender" type="checkbox" checked={ gender === "male" } onChange={() => setGender("male")}/>
                            <label className='ml-2 block text-sm text-gray-900' htmlFor='male'>Nam</label>
                            {/*Female*/}
                            <input className="h-4 w-4 text-red-600 focus:ring-pink-500 border-gray-300 rounded ml-4" 
                            id="female" name="gender" type="checkbox" checked={ gender === "female" } onChange={() => setGender("female")}/>
                            <label className='ml-2 block text-sm text-gray-900' htmlFor='female'>Nữ</label>
                        </div>
                    </div>

                    {/*Gender Preference*/}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Bạn thích giới tính nào?
                        </label>
                        <div className='flex items-center mb-3'>
                            {/*Male*/}
                            <input className="h-4 w-4 text-red-600 focus:ring-pink-500 border-gray-300 rounded" 
                            id="preferMale" name="gender-preference" type="checkbox" value="male" checked={ genderPreference === "male" } onChange={(e) => setGenderPreference(e.target.value)}/>
                            <label className='ml-2 block text-sm text-gray-900' htmlFor='preferMale'>Nam</label>
                            {/*Female*/}
                            <input className="h-4 w-4 text-red-600 focus:ring-pink-500 border-gray-300 rounded ml-4" 
                            id="preferFemale" name="gender-preference" type="checkbox" value="female" checked={ genderPreference === "female" } onChange={(e) => setGenderPreference(e.target.value)}/>
                            <label className='ml-2 block text-sm text-gray-900' htmlFor='preferFemale'>Nữ</label>
                            {/*Both*/}
                            <input className="h-4 w-4 text-red-600 focus:ring-pink-500 border-gray-300 rounded ml-4" 
                            id="preferBoth" name="gender-preference" type="checkbox" value="both" checked={ genderPreference === "both" } onChange={(e) => setGenderPreference(e.target.value)}/>
                            <label className='ml-2 block text-sm text-gray-900' htmlFor='preferBoth'>Cả hai</label>
                        </div>
                    </div>
                    
                    {/*Button*/}
                    <div className="flex items-center justify-center">
                        <button className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mt-3
                            ${ loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }`} type="submit"
                            disabled={loading}>
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default RegisterForm;