import { useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { useMatchStore } from '../store/useMatchStore';
import { FaMapMarkerAlt, FaHeart, FaUser, FaBriefcase, FaPrayingHands, FaRulerVertical, FaWeight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { GiWeightLiftingUp } from 'react-icons/gi';

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
        // Get the current card ref
        const card = cardRefs.current[index];
        if (card) {
            // Trigger the swipe animation
            card.swipe(dir)
                .then(() => {
                    // The onSwipe callback will handle the actual swipe logic
                });
        }
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
                    <div className='card bg-white w-96 h-[32rem] select-none rounded-2xl overflow-hidden border border-gray-100 shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl'>
                        {/* Image Section with Gradient Overlay */}
                        <div className='h-2/3 relative group'>
                            <img 
                                src={user.profilePicture || "/avatar.png"} 
                                alt={user.name} 
                                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80'></div>
                            
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
                                    <div className='flex space-x-2'>
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
                        
                        {/* Info Section - Scrollable */}
                        <div className='flex-1 overflow-y-auto bg-white p-5'>
                            {/* Key Details Grid */}
                            <div className='grid grid-cols-2 gap-3 mb-4'>
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
                            
                            {/* Bio */}
                            <div className='mb-4'>
                                <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center'>
                                    <FaUser className='mr-1 text-pink-500' />
                                    About {user.name}
                                </h3>
                                {user.bio ? (
                                    <p className='text-gray-600 text-sm leading-relaxed'>{user.bio}</p>
                                ) : (
                                    <p className='text-gray-400 italic text-sm'>No bio provided</p>
                                )}
                            </div>
                            
                            {/* Hobbies */}
                            {user.hobbies?.length > 0 && (
                                <div className='mb-4'>
                                    <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center'>
                                        <GiWeightLiftingUp className='mr-1 text-indigo-500' />
                                        Hobbies & Interests
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {user.hobbies.map((hobby, index) => (
                                            <span 
                                                key={index} 
                                                className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700'
                                            >
                                                {hobby}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Photo Album Preview */}
                            {user.photoAlbum?.length > 0 && (
                                <div>
                                    <h3 className='text-sm font-semibold text-gray-700 mb-2'>Photo Album</h3>
                                    <div className='grid grid-cols-3 gap-2'>
                                        {user.photoAlbum.slice(0, 3).map((photo, index) => (
                                            <div key={index} className='relative aspect-square'>
                                                <img
                                                    src={photo}
                                                    alt={`Album ${index + 1}`}
                                                    className='w-full h-full object-cover rounded-lg'
                                                />
                                                {index === 2 && user.photoAlbum.length > 3 && (
                                                    <div className='absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center'>
                                                        <span className='text-white text-xs font-bold'>
                                                            +{user.photoAlbum.length - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </TinderCard>
            ))}
        </div>
    );
};

export default SwipeZone;