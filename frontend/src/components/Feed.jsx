  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { FaStar, FaUserPlus, FaBookmark, FaMap, FaClock, FaRegNewspaper } from 'react-icons/fa';
  import { Link } from 'react-router-dom';
  import { formatDistanceToNow } from 'date-fns';

  const API_URL = import.meta.env.VITE_API_URL;

  function Feed() {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchFeed = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
          const res = await axios.get(`${API_URL}/api/activity/feed`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFeed(res.data);
        } catch (err) {
          console.error('Failed to fetch feed:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchFeed();
    }, []);

    if (loading) return <p className="text-gray-500 italic p-4">Loading your feed...</p>;
    if (feed.length === 0) {
      return <p className="text-gray-500 italic p-4">No recent activity from people you follow.</p>;
    }

    return (
      <div className="space-y-4 p-4 max-w-3xl mx-auto ">
        <h2 className=" flex justify-center text-3xl font-bold text-green-500 mb-4"> <FaRegNewspaper className="text-4xl mr-4"/>Activity</h2>
        {feed.map((item, i) => (  
          <div key={i} className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            {/* Avatar centered */}
            <div className="flex justify-center">
                {item.type === 'follow' && (
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={item.actor?.avatar || 'htt ps://via.placeholder.com/40'}
                      alt="Follower Avatar"
                      className="w-16 h-16 rounded-full border"
                    />
                    <FaUserPlus className="text-green-400 text-4xl" />
                    <img
                      src={item.targetUser?.avatar || 'https://via.placeholder.com/40'}
                      alt="Followed Avatar"
                      className="w-16 h-16 rounded-full border"
                    />
                  </div>  
                )}
            </div>
            {/* Activity type & date */}
            <div className="relative flex items-center gap-1 text-sm text-gray-500 justify-end mb-4">
              <FaClock />
              <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
            </div>

            {/* Activity description */}
            <p className="text-gray-800">
              <Link
                to={`/profile/${item.actor?._id}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                {item.actor?.firstName} {item.actor?.lastName}
              </Link> {' '}
                {/*Create post*/}
                {item.type === 'create' && (
                  <>
                    created a new daytrip "
                    <Link
                      to={`/daytrips/${item.daytrip?._id}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {item.daytrip?.title}
                    </Link>
                    "
                    {item.daytrip?.images?.[0] && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={item.daytrip.images[0]}
                          alt={item.daytrip.title}
                          className="w-64 h-40 object-cover rounded shadow"
                        />
                      </div>
                    )}
                  </>
                )}
                {/*Rate post*/}
                {item.type === 'rate' && (
                  <>
                    rated{' '}
                    <Link
                      to={`/daytrips/${item.daytrip?._id}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {item.daytrip?.title}
                    </Link>
                    <div className="mt-2 text-yellow-500 text-4xl">
                      {'★'.repeat(item.value)}
                    </div>
                    {item.daytrip?.images?.[0] && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={item.daytrip.images[0]}
                          alt={item.daytrip.title}
                          className="w-64 h-40 object-cover rounded shadow"
                        />
                      </div>
                    )}
                  </>
                )}
                {/*Save Post*/}
                {item.type === 'save' && (
                  <>
                    added{' '}
                    <Link
                      to={`/daytrips/${item.daytrip?._id}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {item.daytrip?.title} {' '}
                    </Link>
                    to their travel list!
                    {item.daytrip?.images?.[0] && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={item.daytrip.images[0]}
                          alt={item.daytrip.title}
                          className="w-64 h-40 object-cover rounded shadow"
                        />
                      </div>
                    )}
                  </>
                )}
               {/*Follow Post*/}
                {item.type === 'follow' && (
                  <>
                    followed{' '}
                    <Link
                      to={`/profile/${item.targetUser?._id}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {item.targetUser?.firstName} {item.targetUser?.lastName}
                    </Link>
                  </>
                )}
              </p>
            </div>
          ))}
      </div>
    );
  }

  export default Feed;
