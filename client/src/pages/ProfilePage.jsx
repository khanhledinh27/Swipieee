import { useState, useRef } from 'react'
import Header from '../components/Header.jsx'
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'
import {
  HOBBY_OPTIONS,
  JOB_OPTIONS,
  RELIGION_OPTIONS,
  HEIGHT_OPTIONS,
  WEIGHT_OPTIONS,
  LOCATION_OPTIONS
} from '../data/profileOptions.js'

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [name, setName] = useState(authUser.name || "");
  const [bio, setBio] = useState(authUser.bio || "");
  const [dateOfBirth, setDateOfBirth] = useState(authUser.dateOfBirth ? authUser.dateOfBirth.slice(0,10) : "");
  const [profilePicture, setProfilePicture] = useState(authUser.profilePicture || null);
  const [photoAlbum, setPhotoAlbum] = useState(authUser.photoAlbum || []);
  const [gender, setGender] = useState(authUser.gender || "");
  const [genderPreference, setGenderPreference] = useState(authUser.genderPreference || "");
  const [selectedHobbies, setSelectedHobbies] = useState(authUser.hobbies || []);
  const [job, setJob] = useState(authUser.job || "");
  const [religion, setReligion] = useState(authUser.religion || "");
  const [height, setHeight] = useState(authUser.height || "");
  const [weight, setWeight] = useState(authUser.weight || "");
  const [location, setLocation] = useState(authUser.location?.address || "");
  const [showHobbyDropdown, setShowHobbyDropdown] = useState(false);

  const albumInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { updateProfile, loading } = useUserStore();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      name,
      bio,
      dateOfBirth,
      profilePicture,
      photoAlbum,
      gender,
      genderPreference,
      hobbies: selectedHobbies,
      job,
      religion,
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      location: location ? { ...authUser.location, address: location } : authUser.location
    };
    updateProfile(profileData);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleAlbumChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4 - photoAlbum.length);
    if (files.length === 0) return;
    
    const newPhotos = [];
    let loadedCount = 0;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result);
        loadedCount++;
        if (loadedCount === files.length) {
          setPhotoAlbum(prev => [...prev, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotoAlbum(prev => prev.filter((_, i) => i !== index));
  };

  const toggleHobby = (hobby) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <Header />
      <div className='flex-grow flex flex-col py-4 px-4 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-6xl'>
          <h2 className='text-center text-2xl sm:text-3xl font-extrabold text-gray-900'>Your Profile</h2>
        </div>

        {/* Changed to flex-col on mobile */}
        <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-6xl bg-white rounded-lg shadow border border-gray-200 flex flex-col lg:flex-row'>
          {/* Left Column - Now full width on mobile */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6 border-b lg:border-r lg:border-b-0 border-gray-200 flex flex-col items-center">
            <div className="relative mb-4">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <img 
                  src={'avatar.png'} 
                  alt="Profile" 
                  className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white shadow-md"
                />
              )}
            </div>
            <div className='w-full text-center space-y-4'>
              <button 
                type='button' 
                onClick={() => fileInputRef.current.click()}
                className='w-1/2 sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Change Avatar
              </button>
              
              {/* Photo Album Section - Improved for mobile */}
              <div className="mt-4 w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Photo Album</h3>
                <p className="text-sm text-gray-500 mb-3">Maximum 4 photos</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 mb-3">
                  {photoAlbum.map((photo, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img 
                        src={photo} 
                        alt={`Album ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                {photoAlbum.length < 8 && (
                  <button 
                    type="button" 
                    onClick={() => albumInputRef.current.click()}
                    className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Photos ({4 - photoAlbum.length} remaining)
                  </button>
                )}
                
                <input 
                  type="file" 
                  ref={albumInputRef}
                  className="hidden"
                  onChange={handleAlbumChange}
                  multiple
                  accept="image/*"
                />
              </div>
              <input 
                type='file' 
                ref={fileInputRef}
                className='hidden'
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Right Column - Full width on mobile */}
          <div className="w-full lg:w-2/3 overflow-y-auto" style={{ maxHeight: ['calc(100vh - 180px)'] }}>
            <form onSubmit={handleSubmit} className='p-4 lg:p-6 space-y-4 lg:space-y-6'>
              {/* Basic Info Section */}
              <div className="border-b border-gray-200 pb-4 lg:pb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Basic Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Name</label>
                    <input 
                      type='text' 
                      value={name} 
                      required 
                      onChange={(e) => setName(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Date of Birth</label>
                    <input 
                      type='date' 
                      value={dateOfBirth} 
                      required 
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                    <div className='text-xs sm:text-sm text-gray-500 mt-1'>
                      Age: {computeAge(dateOfBirth)}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Gender Preference</label>
                    <select
                      value={genderPreference}
                      onChange={(e) => setGenderPreference(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value="" disabled>Select Preference</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="border-b border-gray-200 pb-4 lg:pb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">About</h3>
                <div>
                  <label className='block text-sm font-medium text-gray-500'>Bio</label>
                  <textarea 
                    rows={3} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    className='mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholder="Tell others about yourself..."
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="border-b border-gray-200 pb-4 lg:pb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Additional Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4'>
                  {/* Hobbies - Improved for mobile */}
                  <div className='md:col-span-2 relative'>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Hobbies</label>
                    <div 
                      className="mt-1 p-2 border border-gray-300 rounded-md cursor-pointer flex flex-wrap gap-2 min-h-10"
                      onClick={() => setShowHobbyDropdown(!showHobbyDropdown)}
                    >
                      {selectedHobbies.length > 0 ? (
                        selectedHobbies.map(hobby => (
                          <span 
                            key={hobby} 
                            className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                          >
                            {hobby}
                          </span>
                        ))
                      ) : (
                        <span className='text-gray-400 text-sm'>Select hobbies</span>
                      )}
                    </div>
                    
                    {showHobbyDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {HOBBY_OPTIONS.map(hobby => (
                          <div 
                            key={hobby}
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedHobbies.includes(hobby) ? 'bg-blue-50' : ''}`}
                            onClick={() => toggleHobby(hobby)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={selectedHobbies.includes(hobby)}
                                readOnly
                              />
                              <span className="ml-2 block text-sm font-normal">{hobby}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Other fields */}
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Job</label>
                    <select
                      value={job}
                      onChange={(e) => setJob(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value="" disabled>Select Job</option>
                      {JOB_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Religion</label>
                    <select
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value="" disabled>Select Religion</option>
                      {RELIGION_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Height (cm)</label>
                    <select
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value="" disabled>Select Height</option>
                      {HEIGHT_OPTIONS.map(option => (
                        <option key={option} value={option}>{option} cm</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Weight (kg)</label>
                    <select
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value="" disabled>Select Weight</option>
                      {WEIGHT_OPTIONS.map(option => (
                        <option key={option} value={option}>{option} kg</option>
                      ))}
                    </select>
                  </div>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-500'>Location</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value="" disabled>Select Location</option>
                      {LOCATION_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with Update Button */}
              <div className='sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50'>
                <button 
                  type='submit' 
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  disabled={loading}
                >
                  {loading ? 'Updating Profile...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;