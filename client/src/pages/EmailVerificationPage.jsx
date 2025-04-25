import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import { useAuthStore } from '../store/useAuthStore';

const EmailVerificationPage = () => {
    const [token, setToken] = useState(["","","","","",""]);
    const inputRef = useRef([]);
    const {loading, verifyEmail} = useAuthStore();

    const handleChange = (index, value) => {
        const newToken = [...token];
        //handle paste code
        if (value.length > 1) {
            const pasteToken = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newToken[i] = pasteToken[i] || "";
            }
            setToken(newToken);

        const lastFilledIndex = newToken.findLastIndex((digit) => digit !== "");
        const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
        inputRef.current[focusIndex].focus();
        } else {
            newToken[index] = value;
            setToken(newToken);

            if (value && index < 5) {
                inputRef.current[index + 1].focus();
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !token[index] && index > 0) {
            inputRef.current[index - 1].focus();
    }
    }
    //auto submit
    useEffect(() => {
        if (token.every(digit => digit !== '')){
            verifyEmail(token)
        }
    },[token, verifyEmail])

    return (
         <div className="min-h-screen flex items-center justify-center p-4 bg-slate-400">
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className='text-3xl font-bold text-center text-black mb-6'>
                        Verify your email
                    </h2>
                    <p className='text-center mb-6 text-black'>
                        Enter the verification code sent to your email.
                    </p>
                    <form onSubmit={(e) => { 
                    e.preventDefault() 
                    verifyEmail(token);
                    }}
                    className='space-y-6'>
                        <div className='flex justify-between'>
                            {token.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => inputRef.current[index] = el}
                                    type='text'
                                    maxLength='6'
                                    value={digit}
                                    className='w-12 h-12 text-center text-2xl bg-black
                                    text-white rounded-lg focus:outline-none'
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                />
                            ))}
                        </div>
                        {/*Button*/}
                        <div className="flex items-center justify-center">
                            <button className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                ${ loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }`} type="submit"
                                disabled={loading}>
                                {loading ? "Verifying..." : "Verify Email"}
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    );
};

export default EmailVerificationPage