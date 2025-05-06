import { useEffect, useState } from 'react';
import axios from 'axios';
import DaytripCard from '../DaytripCard';

function SavedDaytrips({ user }) {
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios.get(`/api/users/${user._id}/saved-daytrips`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => setSavedTrips(res.data))
    .catch(err => console.error("Failed to load saved trips:", err));
  }, [user]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Saved Trips</h3>
      {savedTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
