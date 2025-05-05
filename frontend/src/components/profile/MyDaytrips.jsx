import DaytripCard from '../DaytripCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

function MyDaytrips({ userId, onCreate }) {
  const [daytrips, setDaytrips] = useState([]);

  useEffect(() => {
    if (!userId) return; // ✅ Don't fetch if undefined
  
    console.log("Fetching daytrips for user:", userId);
  
    axios.get(`/api/daytrips/user/${userId}`)
      .then((res) => {
        console.log("DAYTRIPS FROM BACKEND:", res.data);
        setDaytrips(res.data);
      })
      .catch((err) => console.error("Error fetching daytrips:", err));
  }, [userId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Your Created Daytrips</h3>
        <button
          onClick={onCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Create Daytrip
        </button>
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
