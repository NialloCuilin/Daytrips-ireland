  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import DaytripCard from '../../components/DaytripCard';

  function TopRated() {
    const [daytrips, setDaytrips] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:5000/api/daytrips').then(res => {
        const sorted = res.data.sort((a, b) => {
          const avgDiff = (b.averageRating || 0) - (a.averageRating || 0);
          if (avgDiff !== 0) return avgDiff;
          return (b.ratings?.length || 0) - (a.ratings?.length || 0);
        });
        setDaytrips(sorted);
      });
    }, []);

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Top Rated Daytrips</h1>
        <div className="grid md:grid-cols-3 gap-4">
          {daytrips.map(trip => <DaytripCard key={trip._id} daytrip={trip} />)}
        </div>
      </div>
    );
  }

  export default TopRated;