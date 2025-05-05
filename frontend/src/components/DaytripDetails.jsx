import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaMapMarkedAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaClock } from 'react-icons/fa';
import LocationMap from '../components/LocationMap';
import { Link } from 'react-router-dom';

function DaytripDetails() {
  const { id } = useParams();
  const [daytrip, setDaytrip] = useState(null);

  useEffect(() => {
    const fetchDaytrip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/daytrips/${id}`);
        setDaytrip(res.data);
      } catch (err) {
        console.error("Failed to load daytrip details", err);
      }
    };

    fetchDaytrip();
  }, [id]);

  if (!daytrip) return <div className="p-6 text-center">Loading...</div>;

  const formatDuration = (durationString) => {
    const minutes = parseInt(durationString);
    if (isNaN(minutes)) return durationString;
  
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
  
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/*Title, Icon, county tag*/}
      <div className="max-w-4xl mx-auto p-0">
        <div className="mb-0 relative">
          <div className="flex items-baseline justify-center gap-4">
            <FaMapMarkerAlt className="text-3xl text-red-600" />
            <h1 className="text-3xl font-bold text-center mb-4">{daytrip.title}</h1>
          </div>
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
    </div>
  );
}

export default DaytripDetails;
