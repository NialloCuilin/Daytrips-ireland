import { useEffect, useState } from 'react';
import axios from 'axios';
import DaytripCard from '../../components/DaytripCard';

function LocationFilter() {
  const [daytrips, setDaytrips] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [maxTravelTime, setMaxTravelTime] = useState(480); 
  const [duration, setDuration] = useState(480);
  const [location, setLocation] = useState(null);

  const AVERAGE_SPEED_KMH = 45; // Estimate: driving speed

  useEffect(() => {
    axios.get('http://localhost:5000/api/daytrips').then(res => setDaytrips(res.data));
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => console.warn(err)
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    const haversine = (lat1, lon1, lat2, lon2) => {
      const toRad = val => (val * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const result = daytrips
      .map(trip => {
        const tripDuration = parseInt(trip.duration) || 0;
        const tripDistances = trip.locations?.map(loc =>
          haversine(location.lat, location.lng, loc.lat, loc.lng)
        ) || [];

        const minDistance = Math.min(...tripDistances);
        const estimatedTime = Math.round((minDistance / AVERAGE_SPEED_KMH) * 60);

        return {
          ...trip,
          travelTime: estimatedTime,
          isWithinFilters: estimatedTime <= maxTravelTime && tripDuration <= duration
        };
      })
      .filter(trip => trip.isWithinFilters)
      .sort((a, b) => a.travelTime - b.travelTime); // sort by shortest time

    setFiltered(result);
  }, [daytrips, location, maxTravelTime, duration]);

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins} min`;
    if (mins === 0) return `${hrs} hr`;
    return `${hrs} hr ${mins} min`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Daytrips Near You</h1>

      {/* Filters */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="travelTime" className="block mb-1 font-semibold">
            Max Travel Time: <span className="text-blue-600">{formatDuration(maxTravelTime)}</span>
          </label>
          <input
            type="range"
            id="travelTime"
            min={15}
            max={480}
            step={15}
            value={maxTravelTime}
            onChange={e => setMaxTravelTime(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block mb-1 font-semibold">
            Max Activity Duration: <span className="text-blue-600">{formatDuration(duration)}</span>
          </label>
          <input
            type="range"
            id="duration"
            min={30}
            max={600}
            step={15}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
      </div>

      {/* Filtered Daytrips */}
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p>No daytrips found within the selected filters.</p>
        ) : (
          filtered.map(trip => (
            <DaytripCard key={trip._id} daytrip={trip} />
          ))
        )}
      </div>
    </div>
  );
}

export default LocationFilter;
