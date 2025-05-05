import { useState, useEffect, useRef } from 'react';
import { FaUserFriends, FaBookmark, FaMapMarkedAlt, FaMedal } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
import CreateDaytrip from './CreateDaytrip';
import MyDaytrips from '../components/profile/MyDaytrips';
import DaytripCard from '../components/DaytripCard';
import axios from 'axios';

// Random color generator
const getRandomColor = () => {
  const colors = [
    'bg-red-700', 'bg-green-700', 'bg-blue-700',
    'bg-yellow-700', 'bg-purple-700', 'bg-pink-700',
    'bg-indigo-700', 'bg-teal-700'
  ];  
  return colors[Math.floor(Math.random() * colors.length)];
};

function Profile() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);
  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [user]);     
  const [activeTab, setActiveTab] = useState('daytrips');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarColor, setAvatarColor] = useState('');
  const fileInputRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem('avatarColor');

    if (savedColor) {
      setAvatarColor(savedColor);
    } else {
      const newColor = getRandomColor();
      setAvatarColor(newColor);
      localStorage.setItem('avatarColor', newColor);
    }
  }, []);

  const handleAvatarClick = () => {
    const confirmUpload = window.confirm("Would you like to upload a profile photo?");
    if (confirmUpload) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dqrpclqri/image/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        const imageUrl = res.data.secure_url;
        setAvatar(imageUrl);

        // Save avatar URL to your backend
        await axios.post('http://localhost:5000/api/users/update-avatar', {
          userId: user._id,
          avatarUrl: imageUrl,
        });

        // Update localStorage
        const updatedUserInfo = { ...user, avatar: imageUrl };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

      } catch (err) {
        console.error('Upload failed', err.response?.data || err.message);
        alert('Image upload failed. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profile Top Section */}
      <div className="flex flex-col items-center mb-8">
        {/* Avatar */}
        <div
          onClick={handleAvatarClick}
          className={`w-48 h-48 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4 cursor-pointer overflow-hidden ${avatar ? '' : avatarColor}`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user?.firstName?.charAt(0)
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />

        {/* User Info */}
        <h2 className="text-4xl font-bold mb-2">{user?.firstName} {user?.lastName}</h2>
        <p className="text-gray-500">{user?.email}</p>
        <p className="text-gray-500 flex items-center gap-1">
        <FaMapMarkerAlt className="text-black" />   
          Co. {user?.county}
      </p>    
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-10">
        <button
          onClick={() => setActiveTab('daytrips')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'daytrips' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaMapMarkedAlt />
          <span>My Daytrips</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'saved' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaBookmark />
          <span>Saved Trips</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'achievements' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaMedal />
          <span>Achievements</span>
        </button>

        <button
          onClick={() => setActiveTab('friends')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'friends' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaUserFriends />
          <span>Friends</span>
        </button>
      </div>

      {/* Tab Content */}
        {/* Daytrips tab*/}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'daytrips' && (
          <MyDaytrips userId={user?._id} onCreate={() => setShowForm(true)} />
        )}

        {/* Saved tab*/}
        {activeTab === 'saved' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Saved Trips</h3>
            <p>These are trips you have bookmarked for later.</p>
          </div>
        )}
        {/* Achievements tab*/}
        {activeTab === 'achievements' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Achievements</h3>
            <p>Your badges and milestones will show here!</p>
          </div>
        )}
        {/* Friends tab*/}
        {activeTab === 'friends' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Friends</h3>
            <p>Connect with other explorers here!</p>
          </div>
        )}
          </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
              <CreateDaytrip onClose={() => setShowForm(false)} />
            </div>
          </div>
        )}
    </div>

    
  );
}

export default Profile;
