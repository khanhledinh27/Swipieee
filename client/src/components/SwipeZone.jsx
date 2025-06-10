import { useRef, useState } from 'react';
import TinderCard from 'react-tinder-card';
import { useMatchStore } from '../store/useMatchStore';
import { FaMapMarkerAlt, FaHeart, FaUser, FaBriefcase, FaPrayingHands, FaRulerVertical, FaWeight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FaInfoCircle } from 'react-icons/fa';
import UserDetailModal from './UserDetailModal';

const computeAge = (dobStr) => {
    if (!dobStr) return "";
    const dob = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
};

const SwipeZone = () => {
    const { userProfiles, swipeLeft, swipeRight } = useMatchStore();
    const cardRefs = useRef([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Initialize refs array
    if (cardRefs.current.length !== userProfiles.length) {
        cardRefs.current = Array(userProfiles.length).fill().map((_, i) => cardRefs.current[i] || null);
    }

    const handleSwipe = (dir, user) => {
        if (dir === 'right') {
            swipeRight(user);
        } else if (dir === 'left') {
            swipeLeft(user);
        }
    };

    const handleButtonSwipe = (dir, user, index) => {
        const card = cardRefs.current[index];
        if (card) {
            card.swipe(dir)
                .then(() => {
                    // The onSwipe callback will handle the actual swipe logic
                });
        }
    };

    const openModal = (user) => {
        setSelectedUser(user);
    };

    const closeModal = (e) => {
        e.stopPropagation();
        setSelectedUser(null);
    };

    return (
        <div className='relative w-full max-w-sm h-[32rem] mx-auto'>
            {userProfiles.map((user, index) => (
                <TinderCard
                    key={user._id}
                    ref={el => cardRefs.current[index] = el}
                    className='absolute shadow-xl'
                    onSwipe={(dir) => handleSwipe(dir, user)}
                    swipeRequirementType='position'
                    swipeThreshold={100}
                    preventSwipe={['up', 'down']}
                >
                    <div 
                        className='card bg-white w-96 h-[32rem] select-none rounded-2xl overflow-hidden border border-gray-100 shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl'
                    >
                        {/* Image Section with Gradient Overlay */}
                        <div className='h-2/3 relative group'>
                            <img 
                                src={user.profilePicture || "/avatar.png"} 
                                alt={user.name} 
                                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80'></div>
                            <button 
                                onClick={(e) => {
                                e.stopPropagation();
                                openModal(user);
                                }}
                                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full z-10"
                            >
                                <FaInfoCircle className="text-blue-500" size={20} />
                            </button>
                            {/* Basic Info Overlay */}
                            <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                                <div className='flex justify-between items-end'>
                                    <div>
                                        <h2 className='text-3xl font-bold'>
                                            {user.name}, {computeAge(user.dateOfBirth)}
                                        </h2>
                                        {user.location?.address && (
                                            <div className='flex items-center text-sm opacity-90'>
                                                <FaMapMarkerAlt className='mr-1' size={12} />
                                                <span>{user.location.address}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className='flex space-x-2' onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => handleButtonSwipe('left', user, index)}
                                            className='p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors'
                                            aria-label='Dislike'
                                        >
                                            <IoMdClose size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleButtonSwipe('right', user, index)}
                                            className='p-2 bg-white rounded-full shadow-md text-green-500 hover:bg-green-50 transition-colors'
                                            aria-label='Like'
                                        >
                                            <FaHeart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Info Section - Compact View */}
                        <div className='flex-1 bg-white p-5'>
                            {/* Key Details Grid */}
                            <div className='grid grid-cols-2 gap-3 mb-4'>
                                {/*
                                {user.gender && (
                                    <div className='flex items-center'>
                                        <FaWeight className='text-yellow-500 mr-2' />
                                        <span className='text-sm'>{user.gender}</span>
                                    </div>
                                )}
                                {user.genderPreference && (
                                    <div className='flex items-center'>
                                        <FaWeight className='text-yellow-500 mr-2' />
                                        <span className='text-sm'>{user.genderPreference}</span>
                                    </div>
                                )}
                                 */}
                                {user.job && (
                                    <div className='flex items-center'>
                                        <FaBriefcase className='text-blue-500 mr-2' />
                                        <span className='text-sm'>{user.job}</span>
                                    </div>
                                )}
                                {user.religion && (
                                    <div className='flex items-center'>
                                        <FaPrayingHands className='text-purple-500 mr-2' />
                                        <span className='text-sm'>{user.religion}</span>
                                    </div>
                                )}
                                {user.height && (
                                    <div className='flex items-center'>
                                        <FaRulerVertical className='text-green-500 mr-2' />
                                        <span className='text-sm'>{user.height} cm</span>
                                    </div>
                                )}
                                {user.weight && (
                                    <div className='flex items-center'>
                                        <FaWeight className='text-yellow-500 mr-2' />
                                        <span className='text-sm'>{user.weight} kg</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Bio Preview */}
                            <div className='mb-4'>
                                <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center'>
                                    <FaUser className='mr-1 text-pink-500' />
                                    Về {user.name}
                                </h3>
                                {user.bio ? (
                                    <p className='text-gray-600 text-sm line-clamp-2'>{user.bio}</p>
                                ) : (
                                    <p className='text-gray-400 italic text-sm'>Không có tiểu sử!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </TinderCard>
            ))}
            
            {/* Modal for Detailed View */}
            <UserDetailModal user={selectedUser} onClose={closeModal} />
        </div>
    );
};

export default SwipeZone;