import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-hot-toast";

// List of available hobbies (customize as needed)
const HOBBY_OPTIONS = [
  "Reading", "Sports", "Gaming", "Cooking", "Traveling",
  "Photography", "Music", "Art", "Dancing", "Hiking",
  "Cycling", "Swimming", "Yoga", "Movies", "Writing",
  "Gardening", "Fishing", "Chess", "Programming", "Shopping"
];

const HobbyPickPage = () => {
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const { loading, updateProfile } = useUserStore();
  const navigate = useNavigate();

  const toggleHobby = (hobby) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(h => h !== hobby) 
        : [...prev, hobby]
    );
  };

  const handleSubmit = async () => {
    if (selectedHobbies.length === 0) {
      toast.error("Please select at least one hobby");
      return;
    }

    try {
      await updateProfile({ hobbies: selectedHobbies });
      navigate("/"); // Redirect to home after saving
    } catch (error) {
      console.error("Error saving hobbies:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pick Your Hobbies</h1>
      <p className="mb-6">Select hobbies that interest you. This will help us find better matches for you.</p>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {HOBBY_OPTIONS.map(hobby => (
          <button
            key={hobby}
            onClick={() => toggleHobby(hobby)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedHobbies.includes(hobby)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {hobby}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Hobbies"}
      </button>
    </div>
  );
};

export default HobbyPickPage;