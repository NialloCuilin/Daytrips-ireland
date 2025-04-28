import { useState, useEffect, useRef } from 'react';
import { FaUserFriends, FaBookmark, FaMapMarkedAlt, FaMedal } from 'react-icons/fa';

// Random pastel color generator
const getRandomColor = () => {
  const colors = [
    'bg-red-700', 'bg-green-700', 'bg-blue-700',
    'bg-yellow-700', 'bg-purple-700', 'bg-pink-700',
    'bg-indigo-700', 'bg-teal-700'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

function Profile() {
  const [activeTab, setActiveTab] = useState('daytrips');
  const [avatar, setAvatar] = useState(null);
  const [avatarColor, setAvatarColor] = useState('');
  const fileInputRef = useRef(null);

  // Example user info (replace later with real user data)
  const user = {
    firstName: 'Niall',
    lastName: 'Cullen',
    email: 'niall@example.com',
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview locally while uploading
      setAvatar(URL.createObjectURL(file));
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;
  
          const res = await axios.post('http://localhost:5000/api/users/upload-photo', {
            data: base64String,
          });
  
          console.log('Cloudinary URL:', res.data.url);
  
          // Update avatar with the Cloudinary URL (permanent version)
          setAvatar(res.data.url);
  
          // (optional) Save to localStorage if you want it between sessions
          // localStorage.setItem('avatarUrl', res.data.url);
  
        } catch (err) {
          console.error('Upload failed', err);
          alert('Image upload failed. Please try again.');
        }
      };
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profile Top Section */}
      <div className="flex flex-col items-center mb-8">
        {/* Avatar */}
        <div
          onClick={handleAvatarClick}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4 cursor-pointer overflow-hidden ${avatar ? '' : avatarColor}`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user.firstName.charAt(0)
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
        <h2 className="text-2xl font-bold mb-2">{user.firstName} {user.lastName}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-10">
        {/* Repeat your tab code here */}
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
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'daytrips' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Your Created Daytrips</h3>
            <p>Here you will see all the daytrips you’ve created!</p>
          </div>
        )}
        {activeTab === 'saved' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Saved Trips</h3>
            <p>These are trips you have bookmarked for later.</p>
          </div>
        )}
        {activeTab === 'achievements' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Achievements</h3>
            <p>Your badges and milestones will show here!</p>
          </div>
        )}
        {activeTab === 'friends' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Friends</h3>
            <p>Connect with other explorers here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
