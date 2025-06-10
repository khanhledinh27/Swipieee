import { FaMapMarkerAlt, FaBriefcase, FaPrayingHands, FaRulerVertical, FaWeight, FaUser } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';

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

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                    >
                        <IoMdClose className="text-gray-600" size={20} />
                    </button>
                    
                    {/* Profile Header */}
                    <div className="relative h-72 w-full">
                        <img 
                            src={user.profilePicture || "/avatar.png"} 
                            alt={user.name} 
                            className="w-full h-full object-cover rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h2 className="text-3xl font-bold">
                                {user.name}, {computeAge(user.dateOfBirth)}
                            </h2>
                            {user.location?.address && (
                                <div className="flex items-center mt-2 text-sm">
                                    <FaMapMarkerAlt className="mr-2 opacity-80" />
                                    <span>{user.location.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Key Details */}
                        <div className="grid grid-cols-2 gap-4">
                            {user.job && (
                                <div className="flex items-start">
                                    <FaBriefcase className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Nghề nghiệp</p>
                                        <p className="text-sm font-medium">{user.job}</p>
                                    </div>
                                </div>
                            )}
                            
                            {user.religion && (
                                <div className="flex items-start">
                                    <FaPrayingHands className="text-purple-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Tôn giáo</p>
                                        <p className="text-sm font-medium">{user.religion}</p>
                                    </div>
                                </div>
                            )}
                            
                            {user.height && (
                                <div className="flex items-start">
                                    <FaRulerVertical className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Chiều cao</p>
                                        <p className="text-sm font-medium">{user.height} cm</p>
                                    </div>
                                </div>
                            )}
                            
                            {user.weight && (
                                <div className="flex items-start">
                                    <FaWeight className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Cân nặng</p>
                                        <p className="text-sm font-medium">{user.weight} kg</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Bio */}
                        <div>
                            <div className="flex items-center mb-3">
                                <FaUser className="text-pink-500 mr-2" />
                                <h3 className="text-sm font-semibold text-gray-700">Về {user.name}</h3>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {user.bio ? (
                                    <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
                                ) : (
                                    <p className="text-gray-400 italic text-sm">Không có tiểu sử</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Hobbies */}
                        {user.hobbies?.length > 0 && (
                            <div>
                                <div className="flex items-center mb-3">
                                    <GiWeightLiftingUp className="text-indigo-500 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-700">Các thói quen & sở thích</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {user.hobbies.map((hobby, index) => (
                                        <span 
                                            key={index} 
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                        >
                                            {hobby}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Photo Album */}
                        {user.photoAlbum?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Album ảnh</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {user.photoAlbum.map((photo, index) => (
                                        <div key={index} className="relative aspect-square group overflow-hidden rounded-lg">
                                            <img
                                                src={photo}
                                                alt={`Album ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserDetailModal;