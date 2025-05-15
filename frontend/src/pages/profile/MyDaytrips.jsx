import DaytripCard from '../../components/DaytripCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkedAlt } from "react-icons/fa";

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

    axios.get(`/api/daytrips/user/${userId}`)
      .then((res) => setDaytrips(res.data))
      .catch((err) => console.error("Error fetching daytrips:", err));
  }, [userId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FaMapMarkedAlt className="text-black" />
          Created Daytrips
        </h3>
        {/* 👇 Only show button if viewing own profile */}
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
          <DaytripCard key={trip._id} daytrip={trip} />
        ))}
      </div>
    </div>
  );
}

export default MyDaytrips;
