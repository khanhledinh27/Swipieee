import { useState, useRef } from 'react'
import React from 'react'
import Header from '../components/Header.jsx'
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [name, setName] = useState(authUser.name || "");
  const [bio, setBio] = useState(authUser.bio || "");
  const [age, setAge] = useState(authUser.age || "");
  const [profilePicture, setProfilePicture] = useState(authUser.img || null);
  const [gender, setGender] = useState(authUser.gender || "");
  const [genderPreference, setGenderPreference] = useState(authUser.genderPreference || []);
  
  const fileInputRef = useRef(null);
  const { updateProfile, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, bio, age, profilePicture, gender, genderPreference });
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
  console.log(profilePicture);
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <Header />
      <div className='flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Your Profile</h2>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  {/* Name */}
                  <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Name</label>
                  <div className='mt-1'>
                    <input type='text' name='name' id='name' value={name} required onChange={(e) => setName(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500' />
                  </div>
                </div>
                <div>
                  {/* Age */}
                  <label htmlFor='age' className='block text-sm font-medium text-gray-700'>Age</label>
                  <div className='mt-1'>
                    <input type='number' name='age' id='age' value={age} required onChange={(e) => setAge(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500' />
                  </div>
                </div>
              </div>
              {/* Bio */}
              <label htmlFor='bio' className='block text-sm font-medium text-gray-700'>Bio</label>
              <div className='mt-1'>
                <textarea name='bio' id='bio' rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500' />
              </div>
              {/*Gender*/}
              <div>
                <span className='block text-sm font-medium text-gray-700 mb-2'>Your Gender</span>
                <div className='flex space-x-4'>
                  {[ "Male", "Female" ].map((option) => (
                    <label key={option} className='inline-flex items-center'>
                      <input type='checkbox'
                      className='form-checkbox text-pink-600'
                      name='gender' value={option.toLowerCase()}
                      checked={gender === option.toLowerCase()}
                      onChange={() => setGender(option.toLowerCase())}
                      />
                      <span className='ml-2'>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/*Gender Preference*/}
              <div>
                <span className='block text-sm font-medium text-gray-700 mb-2'>Prefer</span>
                <div className='flex space-x-4'>
                  {[ "Male", "Female", "Both" ].map((option) => (
                    <label key={option} className='inline-flex items-center'>
                      <input type='checkbox'
                      className='form-checkbox text-pink-600'
                      checked={genderPreference === option.toLowerCase()}
                      onChange={() => setGenderPreference(option.toLowerCase())}
                      />
                      <span className='ml-2'>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
             
              {/* Profile Picture */}
              <div>
                <label htmlFor='profilePicture' className='block text-sm font-medium text-gray-700'>Profile Picture</label>
                <div className='mt-1 flex items-center'>
                  <button type='button' onClick={() => fileInputRef.current.click()}
                  className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'>
                    Upload Picture
                  </button>
                  <input type='file' name='profilePicture' accept='image/*' id='profilePicture' ref={fileInputRef}
                  className='hidden'
                  onChange={handleImageChange}/>
                </div>
              </div>
              {profilePicture && (
                <div className='mt-4'>
                  <img src={profilePicture} alt='Profile' className='w-48 h-full object-cover rounded-md' />
                </div>
              )}
              {/* Button */}
              <button type='submit' className= 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bgblue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              disabled={loading}>
                
                {loading ? "Updating Profile..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage