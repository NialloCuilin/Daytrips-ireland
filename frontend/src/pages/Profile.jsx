import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapPin , FaMapMarkedAlt, FaMedal, FaStar, FaMapMarkerAlt, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import CreateDaytrip from './CreateDaytrip';
import MyDaytrips from './profile/MyDaytrips';
import SavedDaytrips from './profile/SavedDaytrips';
import UserReviews from './profile/UserReviews';
import axios from 'axios';
import UserListModal from '../components/UserListModal';

const getRandomColor = () => {
  const colors = ['bg-red-700', 'bg-green-700', 'bg-blue-700', 'bg-yellow-700', 'bg-purple-700', 'bg-pink-700', 'bg-indigo-700', 'bg-teal-700'];
  return colors[Math.floor(Math.random() * colors.length)];
};

function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState('daytrips');
  const [avatarColor, setAvatarColor] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('userInfo'));
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUser(res.data);
        setAvatar(res.data.avatar || null);
  
        const currentUser = JSON.parse(localStorage.getItem('userInfo'));
        
        // ✅ Check if this is not your own profile
        if (currentUser && userId !== currentUser._id) {
          const isFollowing = res.data.followers?.includes(currentUser._id);
          setIsFollowing(isFollowing);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
  
    if (userId) fetchUser();
  }, [userId]);
  

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
    if (userId !== JSON.parse(localStorage.getItem('userInfo'))?._id) return;
    const confirmUpload = window.confirm("Would you like to upload a profile photo?");
    if (confirmUpload) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dqrpclqri/image/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const imageUrl = res.data.secure_url;
      setAvatar(imageUrl);
      await axios.post('/api/users/update-avatar', {
        userId,
        avatarUrl: imageUrl,
      });

      if (userId === JSON.parse(localStorage.getItem('userInfo'))?._id) {
        const updatedUser = { ...user, avatar: imageUrl };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      }

    } catch (err) {
      console.error('Upload failed', err.response?.data || err.message);
      alert('Image upload failed. Please try again.');
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`/api/users/${userId}/follow`, null, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      // Update isFollowing immediately
      setIsFollowing(true);

      // Simulate adding to the follower list locally
      setUser(prev => ({
        ...prev,
        followers: [...(prev.followers || []), currentUser._id]
      }));
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  
  const handleUnfollow = async () => {
    try {
      await axios.post(`/api/users/${userId}/unfollow`, null, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setIsFollowing(false);

      // 💡 Remove the user from the local followers list
      setUser(prev => ({
        ...prev,
        followers: (prev.followers || []).filter(id => id !== currentUser._id)
      }));
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  if (!user) return <div className="text-center p-6">Loading profile...</div>;

  console.log("user:", user);
  console.log("currentUser:", currentUser);
  console.log("userId param:", userId);
  console.log("Match check (own profile):", userId === currentUser?._id);
  console.log("Render follow button:", !!(currentUser && userId !== currentUser?._id));

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profile Top Section */}
      <div className="flex flex-col items-center mb-8">
        {/* Avatar */}
        <div
          onClick={handleAvatarClick}
          className={`w-48 h-48 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4 cursor-pointer overflow-hidden ${avatar ? '' : avatarColor}`}
        >
          {avatar ? <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" /> : user?.firstName?.charAt(0)}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />

        {/* User Info */}
        <h2 className="text-4xl font-bold mb-2">{user.firstName} {user.lastName}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-500 flex items-center gap-1">
          <FaMapMarkerAlt className="text-black" /> Co. {user.county}
        </p>

        <p className="text-gray-600 text-sm mt-2">
          <button onClick={() => setShowFollowers(true)} className="hover:underline mr-4">
            {user.followers?.length || 0} follower{user.followers?.length === 1 ? '' : 's'}
          </button>
          <button onClick={() => setShowFollowing(true)} className="hover:underline">
            {user.following?.length || 0} following
          </button>
        </p>


        {currentUser && userId !== currentUser._id && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`mt-4 px-4 py-2 rounded-full shadow text-white transition  ${
              isFollowing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isFollowing ? (
              <span><FaUserCheck className="inline mr-1" /> Following</span>
            ) : (
              <span><FaUserPlus className="inline mr-1" /> Follow</span>
            )}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-10">
        <button onClick={() => setActiveTab('daytrips')} className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'daytrips' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
          <FaMapMarkedAlt /><span>My Daytrips</span>
        </button>
        <button onClick={() => setActiveTab('reviews')} className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'reviews' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
            <FaStar /><span>Reviews</span>
          </button>
        <button onClick={() => setActiveTab('saved')} className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'saved' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
          <FaMapPin   /><span>Travel List</span>
        </button>
        <button onClick={() => setActiveTab('achievements')} className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'achievements' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
          <FaMedal /><span>Achievements</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'daytrips' && <MyDaytrips userId={user._id} onCreate={() => setShowForm(true)} />}
        {activeTab === 'reviews' && <UserReviews userId={user._id} />}
        {activeTab === 'saved' && <SavedDaytrips userId={user._id} />}
        {activeTab === 'achievements' && <p>Your badges and milestones will show here!</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
            <CreateDaytrip onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowers && (
        <UserListModal
          title="Followers"
          users={user.followers || []}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <UserListModal
          title="Following"
          users={user.following || []}
          onClose={() => setShowFollowing(false)}
        />
      )}  
    </div>
  );
}

export default Profile;
