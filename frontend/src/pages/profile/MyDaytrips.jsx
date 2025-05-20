import DaytripCard from '../../components/DaytripCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkedAlt, FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function MyDaytrips({ userId, onCreate }) {
  const [daytrips, setDaytrips] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentUserId(parsed._id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios.get(`${API_URL}/api/daytrips/user/${userId}`)
      .then((res) => setDaytrips(res.data))
      .catch((err) => console.error("Error fetching daytrips:", err));
  }, [userId]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this daytrip?');
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}/api/daytrips/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
        }
      });
      setDaytrips(prev => prev.filter(trip => trip._id !== id));
    } catch (err) {
      console.error('Error deleting daytrip:', err);
      alert('Failed to delete daytrip.');
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FaMapMarkedAlt className="text-black" />
          Created Daytrips
        </h3>
        {currentUserId === userId && (
          <button
            onClick={onCreate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create Daytrip
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daytrips.map(trip => (
          <div key={trip._id} className="relative">
            <DaytripCard daytrip={trip} />
            {currentUserId === userId && (
              <button
                onClick={() => handleDelete(trip._id)}
                className="absolute top-2 right-2 bg-gray-400 hover:bg-red-700 text-white p-2 rounded-full shadow-md"
                title="Delete this daytrip"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDaytrips;
