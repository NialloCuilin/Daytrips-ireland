import { useEffect, useState } from 'react';
import axios from 'axios';
import DaytripCard from '../../components/DaytripCard';
import { FaMapPin   } from "react-icons/fa";

function SavedDaytrips({ userId }) {
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (!stored || !userId) return;

    const { token } = JSON.parse(stored);

    axios.get(`/api/users/${userId}/saved-daytrips`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setSavedTrips(res.data))
    .catch(err => console.error("Failed to load saved trips:", err));
  }, [userId]);

  return (
    <div>
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <FaMapPin   className="text-black" />
        Travel List
      </h3> 
      {savedTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/*Render save list*/}
          {savedTrips.map(trip => (
            <DaytripCard key={trip._id} daytrip={trip} />
          ))}
        </div>
      ) : (
        <p>These are trips you have bookmarked for later.</p>
      )}
    </div>
  );
}

export default SavedDaytrips;
