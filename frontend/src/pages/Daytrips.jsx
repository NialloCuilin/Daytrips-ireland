import { useState, useEffect } from 'react';
import axios from 'axios';
import DaytripCard from "../components/DaytripCard";

function Daytrips() {
  const [daytrips, setDaytrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDaytrips = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/daytrips");
        console.log("Fetched daytrips:", res.data);
        setDaytrips(res.data);
      } catch (err) {
        console.error("Failed to fetch daytrips:", err);
      }
    };
  
    fetchDaytrips();
  }, []);

  const filteredDaytrips = daytrips.filter((trip) =>
    trip.tags?.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Find Your Next Adventure</h1>

      {/* 🔍 Tag Search Input */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by tag (e.g. city, hike, waterfall)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full max-w-md shadow-sm"
        />
      </div>

      {/* 📍 Results */}
      <div className="grid md:grid-cols-3 gap-8">
        {(searchQuery ? filteredDaytrips : daytrips).map((daytrip) => (
          <DaytripCard key={daytrip._id} daytrip={daytrip} />
        ))}
      </div>
    </div>
  );
}

export default Daytrips;
