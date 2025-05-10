import { useEffect, useState } from 'react';
import axios from 'axios';
import DaytripCard from '../../components/DaytripCard';

const counties = [
  "Antrim", "Armagh", "Carlow", "Cavan", "Clare", "Cork", "Derry", "Donegal",
  "Down", "Dublin", "Fermanagh", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois",
  "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly",
  "Roscommon", "Sligo", "Tipperary", "Tyrone", "Waterford", "Westmeath", "Wexford", "Wicklow"
];

function CountyFilter() {
  const [daytrips, setDaytrips] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/daytrips').then(res => setDaytrips(res.data));
  }, []);

  const filtered = daytrips.filter(trip => trip.countyTags?.includes(selected));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Browse by County</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {counties.map(c => (
          <button
            key={c}
            className={`border px-4 py-2 rounded ${selected === c ? 'bg-green-200' : ''}`}
            onClick={() => setSelected(c)}
          >
            {c}
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