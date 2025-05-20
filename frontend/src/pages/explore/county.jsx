import { useEffect, useState } from 'react';
import axios from 'axios';
import DaytripCard from '../../components/DaytripCard';
import { countyTags } from '../../utils/counties';

const API_URL = import.meta.env.VITE_API_URL;

function CountyFilter() {
  const [daytrips, setDaytrips] = useState([]);
  const [selected, setSelected] = useState('');
  // Fetch daytrips on component mount
  useEffect(() => {
    axios.get(`${API_URL}/api/daytrips`).then(res => setDaytrips(res.data));
  }, []);

  const filtered = daytrips.filter(trip => trip.countyTags?.includes(selected));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Browse by County</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {countyTags.map((c) => (
          <button
            key={c.value}
            className={`border px-4 py-2 rounded ${selected === c.value ? 'bg-green-200' : ''}`}
            onClick={() => setSelected(c.value)}
          >
            {c.label}
          </button>
        ))}
        
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map(trip => <DaytripCard key={trip._id} daytrip={trip} />)}
      </div>
    </div>
  );
}

export default CountyFilter;