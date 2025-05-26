import { useState, useRef } from 'react'
import React from 'react'
import Header from '../components/Header.jsx'
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'

const HOBBY_OPTIONS = [
  "Reading", "Sports", "Gaming", "Cooking", "Traveling",
  "Photography", "Music", "Art", "Dancing", "Hiking",
  "Cycling", "Swimming", "Yoga", "Movies", "Writing",
  "Gardening", "Fishing", "Chess", "Programming", "Shopping"
];

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [name, setName] = useState(authUser.name || "");
  const [bio, setBio] = useState(authUser.bio || "");
  const [dateOfBirth, setDateOfBirth] = useState(authUser.dateOfBirth ? authUser.dateOfBirth.slice(0,10) : "");
  const [profilePicture, setProfilePicture] = useState(authUser.profilePicture || null);
  const [gender, setGender] = useState(authUser.gender || "");
  const [genderPreference, setGenderPreference] = useState(authUser.genderPreference || "");
  const [selectedHobbies, setSelectedHobbies] = useState(authUser.hobbies || []);
  const [job, setJob] = useState(authUser.job || "");
  const [religion, setReligion] = useState(authUser.religion || "");
  const [height, setHeight] = useState(authUser.height || "");
  const [weight, setWeight] = useState(authUser.weight || "");
  const [location, setLocation] = useState(authUser.location?.address || "");
  const [showHobbyDropdown, setShowHobbyDropdown] = useState(false);

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
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>Your Profile</h2>
        </div>

        <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-6xl bg-white rounded-lg shadow border border-gray-200 flex'>
          {/* Fixed Left Column - Profile Picture */}
          <div className="w-1/3 p-6 border-r border-gray-200 flex flex-col items-center sticky top-0 self-start">
            <div className="relative mb-4">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <img 
                  src={'avatar.png'} 
                  alt="Profile" 
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md"
                />
              )}
            </div>
            <div className='w-full text-center'>
              <button 
                type='button' 
                onClick={() => fileInputRef.current.click()}
                className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Change Photo
              </button>
              <input 
                type='file' 
                ref={fileInputRef}
                className='hidden'
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Scrollable Right Column - Profile Information */}
          <div className="w-2/3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              {/* Basic Info Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Name</label>
                    <input 
                      type='text' 
                      value={name} 
                      required 
                      onChange={(e) => setName(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Date of Birth</label>
                    <input 
                      type='date' 
                      value={dateOfBirth} 
                      required 
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                    <div className='text-sm text-gray-500 mt-1'>
                      Age: {computeAge(dateOfBirth)}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
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
                      className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
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
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                <div>
                  <label className='block text-sm font-medium text-gray-500'>Bio</label>
                  <textarea 
                    rows={3} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholder="Tell others about yourself..."
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Hobbies */}
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
                            className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                          >
                            {hobby}
                          </span>
                        ))
                      ) : (
                        <span className='text-gray-400'>Select hobbies</span>
                      )}
                    </div>
                    
                    {showHobbyDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {HOBBY_OPTIONS.map(hobby => (
                          <div 
                            key={hobby}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedHobbies.includes(hobby) ? 'bg-blue-50' : ''}`}
                            onClick={() => toggleHobby(hobby)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={selectedHobbies.includes(hobby)}
                                readOnly
                              />
                              <span className="ml-3 block font-normal">{hobby}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Other fields */}
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Job</label>
                    <input 
                      type='text' 
                      value={job} 
                      onChange={(e) => setJob(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Religion</label>
                    <input 
                      type='text' 
                      value={religion} 
                      onChange={(e) => setReligion(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Height (cm)</label>
                    <input 
                      type='number' 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Weight (kg)</label>
                    <input 
                      type='number' 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-500'>Location</label>
                    <input 
                      type='text' 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                </div>
              </div>

              {/* Fixed Footer with Update Button */}
              <div className='sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50'>
                <button 
                  type='button' 
                  onClick={handleSubmit}
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