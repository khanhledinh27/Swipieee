import React from 'react'
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import { useMatchStore } from '../store/useMatchStore';
import { useEffect } from 'react';
import { Frown } from 'lucide-react';
import SwipeZone from '../components/SwipeZone';
import SwipeNotification from '../components/SwipeNotification';
import { useAuthStore } from '../store/useAuthStore';


const HomePage = () => {
  const { isLoadingUserProfile, getUserProfiles, userProfiles, subscribeToNewMatches,
    unSubcribeToNewMatches } = useMatchStore();

    const { authUser} = useAuthStore();

  useEffect(() => {
    getUserProfiles()
  }, [getUserProfiles])

  useEffect(() => {
    authUser && subscribeToNewMatches()
      return () => {
        unSubcribeToNewMatches()
      }
  }, [subscribeToNewMatches, unSubcribeToNewMatches, authUser])

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-white to-blue-300 overflow-hidden'>
      <Sidebar />
      <div className='flex-grow flex flex-col overflow-hidden'>
        <Header />
        <main className='flex-grow flex flex-col gap-10 justify-center items-center p-4 relative overflow-hidden'>
          { userProfiles.length > 0 && !isLoadingUserProfile && (
            <>
              <SwipeZone />
              <SwipeNotification />
            </>
          )}

          { userProfiles.length === 0 && !isLoadingUserProfile && <NoMoreProfiles /> }

          { isLoadingUserProfile && <LoadingUI /> }
        </main>
      </div>
    </div>
  )
};

export default HomePage

const NoMoreProfiles = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full text-center p-8'>
      <Frown className='text-blue-500 mb-6' size={80} />
      <h2 className='text-3xl font-bold text-gray-800 mb-4'>No more profiles</h2>
      <p className='text-xl mb-6 text-gray-600'>Try again later</p>
    </div>
  )
};

const LoadingUI = () => {
  return (
    <div className='relative w-full max-w-sm h-[28rem]'>
      <div className='card bg-white w-96 h-[28rem] rounded-lg overflow-hidden border border-gray-200
      shadow-sm'>
        <div className='px-4 pt-4 h-3/4'>
          <div className='w-full h-full bg-gray-200 rounded-lg' />
        </div>
        <div className='card-body bg-gradient-to-b from-white to-blue-50 p-4'>
          <div className='space-y-2'>
            <div className='h-6 bg-gray-200 rounded w-3/4' />
            <div className='h-4 bg-gray-200 rounded w-1/2' />
          </div>
        </div>
      </div>
      <p className='text-xl mb-6 text-gray-600'>Loading...</p>
    </div>
  )
}