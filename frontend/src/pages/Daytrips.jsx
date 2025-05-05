import { useState, useEffect } from 'react';
import axios from 'axios';
import DaytripCard from "../components/DaytripCard";

function Daytrips() {
  const [daytrips, setDaytrips] = useState([]);

  useEffect(() => {
    const fetchDaytrips = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/daytrips");
        setDaytrips(res.data); // Assuming backend returns an array
      } catch (err) {
        console.error("Failed to fetch daytrips:", err);
      }
    };

    fetchDaytrips();
  }, []);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Find Your Next Adventure</h1>

      {/* Optional: Search/filter bar (can be added later) */}

      <div className="grid md:grid-cols-3 gap-8">
        {daytrips.map((daytrip) => (
          <DaytripCard key={daytrip._id} daytrip={daytrip} />
        ))}
      </div>
    </div>
  );
}

export default Daytrips;
