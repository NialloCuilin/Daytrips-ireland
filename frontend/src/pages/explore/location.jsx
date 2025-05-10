import { useEffect, useState } from 'react';
import axios from 'axios';
import DaytripCard from '../../components/DaytripCard';

function LocationFilter() {
  const [daytrips, setDaytrips] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [distance, setDistance] = useState(30);
  const [duration, setDuration] = useState(480);
  const [location, setLocation] = useState(null);

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
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const result = daytrips.filter(trip => {
      const tripDuration = parseInt(trip.duration) || 0;
      return (
        trip.locations?.some(loc => haversine(location.lat, location.lng, loc.lat, loc.lng) <= distance) &&
        tripDuration <= duration
      );
    });
    setFiltered(result);
  }, [daytrips, location, distance, duration]);

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

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="distance" className="block mb-1 font-semibold">
            Max Distance: <span className="text-blue-600">{distance} km</span>
          </label>
          <input
            type="range"
            id="distance"
            min={5}
            max={100}
            step={5}
            value={distance}
            onChange={e => setDistance(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block mb-1 font-semibold">
            Max Duration: <span className="text-blue-600">{formatDuration(duration)}</span>
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

      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map(trip => <DaytripCard key={trip._id} daytrip={trip} />)}
      </div>
    </div>
  );
}

export default LocationFilter;
