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
        <div className={`fixed inset-y-0 z-10 w-64 bg-white shadow-md overflow-hidden transition-transform duration-300
        ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:w-1/4`}>
            <div className='flex flex-col h-full p-4'>
                {/* Header */}
                <div className='p-4 pb-[11px] border-b border-blue-500 flex justify-between items-center'>
                    <h2 className='text-xl font-bold text-blue-700'> Matches</h2>
                    <button className='lg:hidden p-1 text-black hover:text-white focus:outline-none'
                    onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>
                <div className='flex-grow overflow-y-auto p-4 z-10 relative'>{ isLoadingMyMatches ? <LoadingState /> : matches.length === 0
                ? <NoMatchesFound /> : (matches.map(match => (
                    <Link key={match._id} to={`/chat/${match._id}`}>
                        <div className='flex items-center mb-4 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors duration-300'>
                            <img src={match.profilePicture || "/avatar.png"} alt={match.name} className='w-12 h-12 rounded-full mr-3 border-2 border-blue-300' />
                            <h3 className='font-semibold text-black'>{match.name}</h3>
                        </div>
                    </Link>
                ))) }</div>
            </div>
        </div>
        <button className='lg:hidden fixed top-4 left-4 bg-blue-500 text-white p-2 rounded-md z-0'
        onClick={toggleSidebar}>
            <MessageCircle size={25} />
        </button>
    </>
  )
}

export default Sidebar;

const LoadingState = () => {
    return (
        <div className='flex flex-col items-center justify-center h-full text-center'>
            <Loader className='text-black mb-4 animate-spin' size={48}/>
            <h3 className='text-xl font-semibold text-black mb-2'>Loading Matches</h3>
            <p className='text-black max-w-xs'>We&apos;re finding your perfect matches. This might take a moment...</p>
        </div>
    );
}

const NoMatchesFound = () => {
    return (
        <div className='flex flex-col items-center justify-center h-full text-center'>
            <Heart className='text-blue-400 mb-4' size={48}/>
            <h3 className='text-xl font-semibold text-black mb-2'>No Matches Yet</h3>
            <p className='text-black max-w-xs'>Don&apos;t worry! Your perfect match is just around the corner. Keep Sweepieee!</p>
        </div>
    );
}