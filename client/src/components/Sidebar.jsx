import React, { useState } from 'react';
import {Heart, Loader, MessageCircle, X} from 'lucide-react'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useMatchStore } from '../store/useMatchStore';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const {getMyMatches, matches, isLoadingMyMatches} = useMatchStore()
    useEffect(() => {
        getMyMatches()
    }, [getMyMatches])

  return (
    <>
        <div className={`fixed inset-y-0 z-10 w-64 bg-blue-50 shadow-md overflow-hidden transition-transform duration-300
        ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:w-1/4`}>
            <div className='flex flex-col h-full p-4'>
                {/* Header */}
                <div className='p-4 pb-[11px] border-b border-rose-400 flex justify-between items-center'>
                    <h2 className='text-xl font-bold text-rose-700'> Đã ghép đôi</h2>
                    <button className='lg:hidden p-1 text-black hover:text-white focus:outline-none'
                    onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>
                <div className='flex-grow overflow-y-auto p-4 z-10 relative'>{ isLoadingMyMatches ? <LoadingState /> : matches.length === 0
                ? <NoMatchesFound /> : (matches.map(match => (
                    <Link key={match._id} to={`/chat/${match._id}`}>
                        <div className='flex items-center mb-4 cursor-pointer hover:bg-blue-100 p-2 rounded-lg transition-colors duration-300'>
                            <img src={match.profilePicture || "/avatar.png"} alt={match.name} className='w-12 h-12 rounded-full mr-3 border-2 border-rose-300' />
                            <h3 className='font-semibold text-black'>{match.name}</h3>
                        </div>
                    </Link>
                ))) }</div>
            </div>
        </div>
        <button className='lg:hidden fixed top-4 left-4 bg-blue-500 text-white p-2 rounded-md z-0'
        onClick={toggleSidebar}>
            <MessageCircle size={30} />
        </button>
    </>
  )
}

export default Sidebar;

const LoadingState = () => {
    return (
        <div className='flex flex-col items-center justify-center h-full text-center'>
            <Loader className='text-black mb-4 animate-spin' size={48}/>
            <h3 className='text-xl font-semibold text-black mb-2'>Đang tải</h3>
            <p className='text-black max-w-xs'>Chúng tôi đang tải các hồ sơ đã tương thích. Vui lòng đợi trong ít giây!</p>
        </div>
    );
}

const NoMatchesFound = () => {
    return (
        <div className='flex flex-col items-center justify-center h-full text-center'>
            <Heart className='text-rose-400 mb-4' size={48}/>
            <h3 className='text-xl font-semibold text-black mb-2'>Bạn chưa có hồ sơ tương thích</h3>
            <p className='text-black max-w-xs'>Nhưng mà đừng lo lắng nhé, Một nửa kia hoàn hảo của bạn đang ở đâu đó gần đây thôi. Hãy tiếp tục Swipieee nhé!</p>
        </div>
    );
}