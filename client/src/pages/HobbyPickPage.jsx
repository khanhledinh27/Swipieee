import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-hot-toast";
import { HOBBY_OPTIONS } from '../data/profileOptions.js';
import { Loader } from "lucide-react";

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
    try {
      await updateProfile({ hobbies: selectedHobbies });
      toast.success("Hobbies saved successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to save hobbies");
      console.error("Error saving hobbies:", error);
    }
  };

  const hasMinimumHobbies = selectedHobbies.length >= 3;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Hãy chọn sở thích của bạn
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Vui lòng chọn ít nhất 3 sở thích mà bạn yêu thích. Điều này sẽ giúp chúng tôi hiểu rõ hơn về bạn và cải thiện trải nghiệm của bạn trên nền tảng.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {HOBBY_OPTIONS.map(hobby => (
              <button
                key={hobby}
                onClick={() => toggleHobby(hobby)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all duration-200 ${
                  selectedHobbies.includes(hobby)
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {hobby}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Đã chọn: {selectedHobbies.length} {selectedHobbies.length === 1 ? "sở thích" : "sở thích"}.
            {!hasMinimumHobbies && (
              <span className="text-red-500 ml-2">
                (Chọn {3 - selectedHobbies.length} để tiếp tục)
              </span>
            )}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !hasMinimumHobbies}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            loading || !hasMinimumHobbies
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2 h-4 w-4" />
              Đang lưu...
            </>
          ) : (
            "Lưu sở thích"
          )}
        </button>

        {hasMinimumHobbies && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            Bạn có thể thay đổi sở thích của mình bất cứ lúc nào trong phần cài đặt hồ sơ.
          </p>
        )}
      </div>
    </div>
  );
};

export default HobbyPickPage;