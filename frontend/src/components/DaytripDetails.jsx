import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaMapMarkedAlt, FaMapMarkerAlt, FaBookmark, FaRegBookmark, FaClock, FaStar, FaStarHalfAlt, FaUserFriends , FaShareAlt} from "react-icons/fa";
import LocationMap from '../components/LocationMap';
import RatingModal from "../components/RatingModal";

function DaytripDetails() {
  const { id } = useParams();
  const [daytrip, setDaytrip] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [userRating, setUserRating] = useState(0); // user's personal rating
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchDaytrip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/daytrips/${id}`);
        setDaytrip(res.data);

        if (user && res.data.ratings?.length) {
          const existing = res.data.ratings.find(r => r.user === user._id);
          if (existing) setUserRating(existing.value);
        }

        if (user) {
          axios
            .get(`/api/users/${user._id}/saved-daytrips`, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .then((res2) => {
              const saved = res2.data.some((savedTrip) => savedTrip._id === id);
              setIsSaved(saved);
            })
            .catch((err) => console.error("Failed to check saved state:", err));
        }
      } catch (err) {
        console.error("Failed to load daytrip details", err);
      }
    };

    fetchDaytrip();
  }, [id]);

  if (!daytrip) return <div className="p-6 text-center">Loading...</div>;
  
  const toggleSave = async () => {
    if (!user) return;
  
    try {
      if (isSaved) {
        await axios.delete(`/api/users/unsave-daytrip/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        await axios.post(`/api/users/save-daytrip/${id}`, null, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: daytrip.title,
      text: `Check out this daytrip: ${daytrip.title}`,
      url: window.location.href,
    };
  
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error('Sharing failed:', err));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Could not copy link.'));
    }
  };

  const formatDuration = (durationString) => {
    const minutes = parseInt(durationString);
    if (isNaN(minutes)) return durationString;
  
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
  
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const submitRating = async (value) => {
    try {
      setUserRating(value);
      await axios.post(
        `http://localhost:5000/api/daytrips/${id}/rate`,
        { value },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err) {
      console.error("Failed to rate trip", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
  
      {/*Title, Icon, county tag*/}
      <div className="max-w-4xl mx-auto p-0">
        <div className="mb-0 relative">
          <div className="flex items-baseline justify-center gap-4">
            <FaMapMarkerAlt className="text-3xl text-red-600" />
            <h1 className="text-3xl font-bold text-left mb-4">{daytrip.title}</h1>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => {
              const fullStars = Math.floor(daytrip.averageRating || 0);
              const hasHalf = daytrip.averageRating - fullStars >= 0.5 && star === fullStars + 1;

              return (
                <button key={star} onClick={() => {
                  setTempRating(star);
                  setShowModal(true);
                }}>
                  {star <= fullStars ? (
                    <FaStar className="text-2xl text-yellow-400" />
                  ) : hasHalf ? (
                    <FaStarHalfAlt className="text-2xl text-yellow-400" />
                  ) : (
                    <FaStar className="text-2xl text-gray-300" />
                  )}
                </button>
              );
            })}
              <span className="text-sm text-gray-600 ml-2">
                ({daytrip.ratings?.length || 0} rating{daytrip.ratings?.length === 1 ? '' : 's'})
              </span>
          </div>

            {/* County tags */}
            <div className="absolute right-0 top-3">
              {daytrip.countyTags?.map((county, i) => (
                <span key={i} className="bg-gray-200 text-black-800 px-3 py-1 rounded-full text-sm">
                  {county}
                </span>
              ))}
            </div>
          </div>
      </div>
      {/* Image Swiper */}
      {daytrip.images?.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="mb-6 rounded overflow-hidden"
        >
          {daytrip.images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`Slide ${idx}`} className="w-full object-cover rounded" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Author + Created Date */}
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        {daytrip.author && (
          <span>
            Created by: <Link 
              to={`/profile/${daytrip.author._id}`} 
              className="text-black font-semibold hover:underline"
            >
              {daytrip.author.firstName} {daytrip.author.lastName}
            </Link>
          </span>
        )}
        <span>{new Date(daytrip.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Main Description */}
      <p className="text-gray-800 mb-6 text-left">{daytrip.description}</p>
      
      {/* Locations */}
      <div className="mb-6">
        <div className="flex flex-col items-center mb-6 text-center">
          {/* Title + Icon */}
          <div className="flex items-center gap-2 mb-1">
            <FaMapMarkedAlt className="text-3xl text-black" />
            <h1 className="text-3xl font-semibold text-black">Itinerary</h1>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1 text-gray-500">
            <FaClock className="text-lg" />
            <span>{formatDuration(daytrip.duration)}</span>
          </div>
        </div>

        {/* Map */}
        {daytrip.locations?.length > 0 && (
          <LocationMap locations={daytrip.locations} />
        )}

        {/* Location list with descriptions */}
        <ul className="space-y-4 text-gray-700 mt-4">
        {daytrip.locations?.map((loc, i) => {
          if (typeof loc === 'string') {
            return (
              <li key={i}>
                <span className="font-semibold text-black">{i + 1}. {loc}</span>
              </li>
            );
          }

          return (
            <li key={i} className="space-y-1">
              <div className="text-base font-semibold text-black">{i + 1}. {loc.name}</div>
              <div className="text-sm text-gray-600 italic">{loc.address}</div>

              {loc.description && (
                <div className="text-gray-700 pl-2 border-l-4 border-gray-300">
                  {loc.description}
                </div>
              )}
              {loc.timeSpent && (
                <div className="text-sm text-green-700 mt-1">
                  ⏱️ Duration at this location: {loc.timeSpent} minutes
                </div>
              )}
            </li>
          );
        })}
        </ul>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {daytrip.tags?.map((tag, i) => (
          <span key={i} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>

      <RatingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialRating={tempRating}
        user={user}
        onSubmit={async (rating, comment, title) => {
          try {
            await axios.post(
              `http://localhost:5000/api/daytrips/${id}/rate`,
              { value: rating, comment, title },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setUserRating(rating);
            // Optionally re-fetch trip
          } catch (err) { 
            console.error("Rating failed:", err);
          }
        }}  
      /> 

      <div className="space-y-6 mt-10">
        {/*User reviews title*/}
        <h2 className="text-3xl font-bold text-left flex items-center gap-2">
          <FaUserFriends className="text-black text-3xl" />
          User Reviews
        </h2>

        {daytrip.ratings?.map((rating, idx) => (
          <div key={idx} className="border rounded-lg p-6 shadow-sm flex gap-6 items-start bg-yellow-50">
            
            {/* Left: Avatar & Name */}
            <div className="flex flex-col items-center w-28 text-center">
              <div className="w-16 h-16 rounded-full bg-green-200 text-green-800 font-bold text-xl flex items-center justify-center">
                {rating.user?.avatar ? (
                  <img
                    src={rating.user.avatar}
                    alt="User avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-green-200 text-green-800 font-bold text-xl flex items-center justify-center">
                    {rating.user?.firstName?.[0] || '?'}
                  </div>
                )}
              </div>
              <Link 
                to={`/profile/${rating.user?._id}`} 
                className="mt-2 text-sm text-gray-800 font-medium mb-2 hover:underline"
              >
                {rating.user?.firstName} {rating.user?.lastName}
              </Link>
              <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar
                      key={s}
                      className={`text-lg ${s <= rating.value ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
            </div>

            {/* Right: Rating Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{rating.title}</h3>
                  <p className="text-sm text-gray-500 italic whitespace-nowrap">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Comment Box */} 
                {rating.comment && (
                  <div className="mt-3 p-3 border border-gray-200 rounded bg-gray-50 text-sm text-gray-700 text-left">
                    {rating.comment}
                  </div>
                )}
              </div>
          </div>
        ))}
      </div>
      {/* Save & share buttons */}
      <div className="flex justify-end gap-4 mt-6 w-full">
        <button
          onClick={toggleSave}
          className="flex items-center gap-2 text-gray-600 hover:text-black border px-4 py-2 rounded shadow"
          title={isSaved ? "Unsave this daytrip" : "Save this daytrip"}
        >
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          {isSaved ? "Saved" : "Save this daytrip"}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 border px-4 py-2 rounded shadow"
          title="Share this daytrip"
        >
          <FaShareAlt/> Share
        </button>
      </div>
    </div>
  );
}

export default DaytripDetails;
