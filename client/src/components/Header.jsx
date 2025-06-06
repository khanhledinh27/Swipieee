import React, { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'
import { User, LogOut, Menu, Flame } from 'lucide-react'

const Header = () => {
    const { authUser, logout } = useAuthStore()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const dropdownRef = useRef(null)

    //Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside)
    },[])
        

    return (
        // Update the header background gradient
        <header className='bg-gradient-to-r from-blue-500 via-purple-600 to-rose-600 shadow-lg'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center py-4'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <Link to="/" className='flex items-center space-x-2'>
                            <Flame className="w-10 h-10 text-white"/>
                            <span className='text-2xl font-bold text-white hidden sm:inline'>Swipieee</span>
                        </Link>
                    </div>
                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center space-x-4'>
                        {authUser ? (
                            <div className='relative' ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} 
                                className='flex items-center space-x-2 focus:outline-none'>
                                    <img src={authUser.profilePicture || "/avatar.png"}
                                    className='h-10 w-10 object-cover rounded-full border-2 border-white'
                                    alt='avatar'/>
                                    <span className='text-white font-semibold'>{authUser.name}</span>
                                </button>

                                {dropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10'>
                                        <Link to="/profile" className='flex px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 items-center'
                                        onClick={() => setDropdownOpen(false)}>
                                            <User className='mr-2' size={16}/>
                                            Profile
                                        </Link>
                                        <button onClick={logout} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'>
                                            <LogOut className='mr-2' size={16}/>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to='/auth' className='text-white font-semibold hover:text-red-300 transition duration-150 ease-in-out'>Login</Link>
                                <Link to='/auth' className='bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-150 ease-in-out'>Sign Up</Link>
                            </>
                        )}
                    </div>
                    {/* Mobile Menu Button */}
                    <div className='md:hidden'>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='focus:outline-none text-white'>
                            <Menu className='w-6 h-6'/>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                    <div className='md:hidden'>
                        <div className='flex flex-col space-y-2 mt-2'>
                            {authUser ? (
                                <>
                                    <Link to="/profile" className='flex px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 items-center'
                                    onClick={() => setMobileMenuOpen(false)}>
                                        <User className='mr-2' size={16}/>
                                        Profile
                                    </Link>
                                    <button onClick={logout} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'>
                                        <LogOut className='mr-2' size={16}/>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to='/auth' className='text-white font-semibold hover:text-red-300 transition duration-150 ease-in-out'>Login</Link>
                                    <Link to='/auth' className='bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-150 ease-in-out'>Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
        </header>
    )
}

export default Header