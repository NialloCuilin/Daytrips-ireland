import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaUserFriends } from "react-icons/fa";

function UserListModal({ title, users = [], onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl shadow-xl px-6 py-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
    
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
    >
      <FaTimes />
    </button>
    <div className="flex flex-col items-center mb-6">
      <FaUserFriends className="text-4xl text-black-600 mb-2" />
      <h3 className="text-2xl font-bold text-center text-gray-800">{title}</h3>
    </div>


    {users.length ? (
      <div className="flex flex-col items-center space-y-4">
        {users.map((u, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-2 hover:bg-gray-50 transition rounded-lg w-full"
          >
            <img
              src={u.avatar || 'https://via.placeholder.com/40'}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <Link
              to={`/profile/${u._id}`}
              className="text-lg font-medium text-blue-600 hover:underline"
              onClick={onClose}
            >
              {u.firstName} {u.lastName}
            </Link>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500">No users to display.</p>
    )}
  </div>
</div>

  );
}

export default UserListModal;
