import { useEffect, useState } from 'react';
import axios from 'axios';
import DaytripCard from '../../components/DaytripCard';

const API_URL = import.meta.env.VITE_API_URL;

function TopRated() {
  const [daytrips, setDaytrips] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // how many cards to show
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/daytrips`).then(res => {
      const sorted = res.data.sort((a, b) => {
        const avgDiff = (b.averageRating || 0) - (a.averageRating || 0);
        if (avgDiff !== 0) return avgDiff;
        return (b.ratings?.length || 0) - (a.ratings?.length || 0);
      });
      setDaytrips(sorted);
      setLoading(false);
    });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6); // load 6 more at a time
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Top Rated Daytrips</h1>

      {loading ? (
        <p>Loading top-rated daytrips...</p>
      ) : daytrips.length === 0 ? (
        <p>No daytrips available yet.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {daytrips.slice(0, visibleCount).map(trip => (
              <DaytripCard key={trip._id} daytrip={trip} />
            ))}
          </div>

          {visibleCount < daytrips.length && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TopRated;