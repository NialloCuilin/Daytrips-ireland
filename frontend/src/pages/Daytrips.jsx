import { useState, useEffect } from 'react';
import axios from 'axios';
import DaytripCard from "../components/DaytripCard";
import { FaHiking, FaEdit, FaBinoculars, FaWater, FaHourglassHalf} from "react-icons/fa";
import { GiIsland, GiBeachBucket  } from "react-icons/gi";
import { PiCastleTurretFill } from "react-icons/pi";
import { MdLocationCity } from "react-icons/md";

const featuredTags = ['City','Hike', 'Beach',  'Historic', 'Island', 'Castle', 'Waterfall','Birdwatching' ];
const editorsDaytrips = ['68194662eaf472aaf82d1a8c', '681d1d709b08803332ef0a3f']; // Just IDs
const tagSections = [
  { tags: ['Hike'], title: <> <FaHiking className="inline-block mr-2 text-3xl" /> Trails & Hikes </> },
  { tags: ['Beach'], title: <> <GiBeachBucket className="inline-block mr-2 text-3xl" /> Seaside Adventures </>},
  { tags: ['Urban'], title: <> <MdLocationCity className="inline-block mr-2 text-3xl"/> Urban Exploration </> },
  { tags: ['Historic'], title: <><FaHourglassHalf className="inline-block mr-2 text-3xl"/> Historical Gems</> },
  { tags: ['Island'], title: <> <GiIsland className="inline-block mr-2 text-3xl" /> Our Islands</>  },
  { tags: ['Castle'], title: <> <PiCastleTurretFill className="inline-block mr-2 text-3xl" /> Castles & Forts </> },
  { tags: ['Waterfall'], title: <> <FaWater className="inline-block mr-2 text-3xl" /> Don’t Go Chasing... </> },
  { tags: ['Birdwatching'], title: <> <FaBinoculars className="inline-block mr-2 text-3xl" /> Birdwatcher’s Paradise </> }
];


function Daytrips() {
  const [daytrips, setDaytrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDaytrips = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/daytrips");
        setDaytrips(res.data);
      } catch (err) {
        console.error("Failed to fetch daytrips:", err);
      }
    };

    fetchDaytrips();
  }, []);

  const getTripsByTags = (tags) =>
    daytrips.filter((trip) =>
      trip.tags?.some((tripTag) => tags.includes(tripTag))
    );  

  const filteredTags = featuredTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const editorPicks = daytrips.filter((trip) => editorsDaytrips.includes(trip._id));

  const matchingTrips = daytrips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center">Find Your Next Adventure</h1>

      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search daytrips by title or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full max-w-md shadow-sm"
        />
      </div>

      {/* Show matching trips when search is active */}
      {searchQuery && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🔍 Search Results</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {matchingTrips.map((trip) => (
              <DaytripCard key={trip._id} daytrip={trip} />
            ))}
            {matchingTrips.length === 0 && <p>No matches found.</p>}
          </div>
        </div>
      )}

      {/* Editor's Picks */}
      {!searchQuery && editorPicks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-semibold ml-4 mb-4 text-left"> <FaEdit className="inline-block mr-2 text-3xl" /> Editor's Choice</h2>
          <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide bg-gray-100 p-6 rounded-xl shadow-sm">
            {editorPicks.map((trip) => (
              <div key={trip._id} className="flex-shrink-0 w-72">
                <DaytripCard daytrip={trip} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tag-based sections */}
      {!searchQuery &&
        tagSections.map(({ tags, title }) => {
          const taggedTrips = getTripsByTags(tags);
          if (taggedTrips.length === 0) return null;

          return (
            <div key={tags.join(',')} className="mb-12">
              <h2 className="text-3xl font-semibold mb-4 text-left">{title}</h2>
              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {taggedTrips.map((trip) => (
                  <div key={trip._id} className="flex-shrink-0 w-72">
                    <DaytripCard daytrip={trip} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Daytrips;
