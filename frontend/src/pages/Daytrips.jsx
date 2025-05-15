import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DaytripCard from "../components/DaytripCard";
import { FaHiking, FaEdit, FaBinoculars, FaWater, FaHourglassHalf, FaTree, FaMapMarkerAlt, FaStar, FaTags, FaSearch  } from "react-icons/fa";
import { GiIsland, GiBeachBucket } from "react-icons/gi";
import { PiCastleTurretFill } from "react-icons/pi";
import { MdLocationCity } from "react-icons/md";
import { FaGlobeEurope } from "react-icons/fa";

//Editor's Picks IDs
const editorsDaytrips = ['68194662eaf472aaf82d1a8c', '681d1d709b08803332ef0a3f', '681ba37a27ba01d9292c5223', '681a1a35679bd632ba46237a'];
const tagSections = [
  { tags: ['Hike'], title: <> <FaHiking className="inline-block mr-2 text-3xl" /> Trails & Hikes </> },
  { tags: ['Beach'], title: <> <GiBeachBucket className="inline-block mr-2 text-3xl" /> Seaside Adventures </>},
  { tags: ['City', 'Town'], title: <> <MdLocationCity className="inline-block mr-2 text-3xl"/> Urban Exploration </> },
  { tags: ['Historic'], title: <><FaHourglassHalf className="inline-block mr-2 text-3xl"/> Historical Gems</> },
  { tags: ['Forest'], title: <> <FaTree  className="inline-block mr-2 text-3xl" /> Forests & National Parks </> },
  { tags: ['Island'], title: <> <GiIsland className="inline-block mr-2 text-3xl" /> Our Islands</>  },
  { tags: ['Castle'], title: <> <PiCastleTurretFill className="inline-block mr-2 text-3xl" /> Castles & Forts </> },
  { tags: ['Waterfall'], title: <> <FaWater className="inline-block mr-2 text-3xl" /> Don’t Go Chasing... </> },
  { tags: ['Birdwatching'], title: <> <FaBinoculars className="inline-block mr-2 text-3xl" /> Birdwatcher’s Paradise </> }
];
const tagFilters = [
  { tag: 'Location', icon: <FaMapMarkerAlt className="inline-block mr-2 text-3xl text-red-500" /> },
  { tag: 'County', icon: <FaGlobeEurope className="inline-block mr-2 text-3xl text-blue-500" /> },
  { tag: 'Tags', icon: <FaTags className="inline-block mr-2 text-3xl text-green-500" /> },
  { tag: 'TopRated', icon: <FaStar className="inline-block mr-2 text-3xl text-yellow-400"/> }
];

function Daytrips() {
  const [daytrips, setDaytrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  // Fetch daytrips and user location on component mount
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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn("Geolocation error:", err);
      }
    );
  }, []);
  // Function to get trips by tags
  const getTripsByTags = (tags) =>
    daytrips.filter((trip) =>
      tags.every((tag) => trip.tags?.includes(tag))
    );

  const editorPicks = daytrips.filter((trip) => editorsDaytrips.includes(trip._id));
  const matchingTrips = daytrips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-10 text-center" style={{ fontFamily: "Tinos", fontWeight: 900  }}>Find Your Next Adventure</h1>
      {/*  Filter Tiles */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {tagFilters.map((filter) => (
          <div
            key={filter.tag}
            onClick={() => navigate(`/explore/${filter.tag.toLowerCase()}`)}
            className={`border rounded-lg p-4 text-center w-36 cursor-pointer hover:bg-gray-100`}
          >
            <div className="text-2xl mb-1">{filter.icon}</div>
            <div className="font-semibold text-sm">{filter.tag}</div>
          </div>
        ))}
      </div>

      <div className="mb-10 flex justify-center">
        <div className="relative w-full max-w-lg">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <FaSearch className="w-5 h-5" />
          </div>
          {/* Search Input */}
          <input
            type="text"
            placeholder=" Search daytrips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border border-gray-300 px-4 py-2 rounded-md w-full shadow-sm"
          />
        </div>
      </div>
      {/* Search Results */}
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
      {/* Editor's Choice */}
      {!searchQuery && editorPicks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-semibold ml-4 mb-4 text-left" style={{ fontFamily: "Tinos", fontWeight: 900  }}> <FaEdit className="inline-block mr-2 text-3xl" /> Editor's Choice</h2>
          <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide bg-orange-100 p-6 rounded-xl shadow-sm">
            {editorPicks.map((trip) => (
              <div key={trip._id} className="flex-shrink-0 w-72">
                <DaytripCard daytrip={trip} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Tag-based Sections */}
      {!searchQuery && tagSections.map(({ tags, title }) => {
        const taggedTrips = getTripsByTags(tags);
        if (taggedTrips.length === 0) return null;
        return (
          <div key={tags.join(',')} className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-left"  style={{ fontFamily: "Tinos", fontWeight: 900  }}>{title}</h2>
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